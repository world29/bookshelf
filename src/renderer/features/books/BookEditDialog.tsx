import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { Dialog } from "../../Dialog";
import { clearEditTarget, loadBook, selectEditTarget } from "./booksSlice";

export function BookEditDialog() {
  const editTarget = useAppSelector(selectEditTarget);
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  useEffect(() => {
    if (editTarget) {
      setTitle(editTarget.title);
      setAuthor(editTarget.author);
    }
  }, [editTarget]);

  if (editTarget) {
    return (
      <Dialog open>
        <div>
          <input
            type="text"
            defaultValue={editTarget.title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            defaultValue={editTarget.author}
            onChange={(e) => setAuthor(e.target.value)}
          />
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
