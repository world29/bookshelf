import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../../Dialog";
import {
  AddAuthorDialogProps,
  AddAuthorDialogResult,
  BookAddAuthorDialog,
} from "./BookAddAuthorDialog";
import { clearEditTarget, loadBook, selectEditTarget } from "./booksSlice";

export function BookEditDialog() {
  const editTarget = useAppSelector(selectEditTarget);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);
  const [dialogProps, setDialogProps] = useState<
    AddAuthorDialogProps | undefined
  >(undefined);

  useEffect(() => {
    if (editTarget) {
      setTitle(editTarget.title);
      setAuthor(editTarget.author);
    }
  }, [editTarget]);

  useEffect(() => {
    window.electronAPI.getAuthors().then(setAuthors);
  }, []);

  const openAddAuthorDialog = () => {
    new Promise<AddAuthorDialogResult>((resolve) => {
      setDialogProps({ onClose: resolve });
    })
      .then(({ canceled, authorName }) => {
        if (canceled) return;
        if (authorName) setAuthors(authors.concat(authorName));
      })
      .finally(() => setDialogProps(undefined));
  };

  if (editTarget) {
    return (
      <Dialog open>
        <label htmlFor="input-title">Title</label>
        <div>
          <input
            type="text"
            defaultValue={editTarget.title}
            onChange={(e) => setTitle(e.target.value)}
            id="input-title"
          />
        </div>
        <label htmlFor="select-author">Author</label>
        <div>
          <select
            defaultValue={editTarget.author}
            onChange={(e) => setAuthor(e.target.value)}
            id="select-author"
          >
            <option value="">{""}</option>
            {authors.map((optionValue) => (
              <option value={optionValue} key={optionValue}>
                {optionValue}
              </option>
            ))}
          </select>
          <span>
            <button onClick={() => openAddAuthorDialog()}>+</button>
          </span>
        </div>
        <span>
          <button
            onClick={() => {
              window.electronAPI
                .setBookProperties(editTarget.filePath, { title, author })
                .then((bookInfo) => dispatch(loadBook(bookInfo)))
                .then(() => dispatch(clearEditTarget()));
            }}
          >
            apply
          </button>
          <button onClick={() => dispatch(clearEditTarget())}>cancel</button>
        </span>
        {dialogProps && <BookAddAuthorDialog {...dialogProps} />}
      </Dialog>
    );
  }

  return <div />;
}
