import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../../Dialog";
import { clearEditTarget, loadBook, selectEditTarget } from "./booksSlice";

export function BookEditDialog() {
  const editTarget = useAppSelector(selectEditTarget);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [authors, setAuthors] = useState<string[]>([]);

  useEffect(() => {
    if (editTarget) {
      setTitle(editTarget.title);
      setAuthor(editTarget.author);
    }
  }, [editTarget]);

  useEffect(() => {
    window.electronAPI.getAuthors().then(setAuthors);
  }, []);

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
        <label htmlFor="input-author">Author</label>
        <div>
          <input
            type="text"
            defaultValue={editTarget.author}
            onChange={(e) => setAuthor(e.target.value)}
            list="input-author-datalist"
            id="input-author"
          />
          <datalist id="input-author-datalist">
            {authors.map((optionValue) => (
              <option value={optionValue} key={optionValue} />
            ))}
          </datalist>
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
      </Dialog>
    );
  }

  return <div />;
}
