import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadBook, loadBooks, selectBooks, setEditTarget } from "./booksSlice";

export function BookList() {
  const books = useAppSelector(selectBooks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.electronAPI
      .getBooks()
      .then((bookInfos) => dispatch(loadBooks(bookInfos)));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>FileSize</th>
            <th>Score</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.fileSize}</td>
              <td>
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="5"
                  defaultValue={book.score}
                  onChange={(e) => {
                    window.electronAPI
                      .setBookScore(book.filePath, e.target.valueAsNumber)
                      .then((bookInfo) => dispatch(loadBook(bookInfo)));
                  }}
                />
              </td>
              <td>
                <button onClick={() => dispatch(setEditTarget(book.filePath))}>
                  edit
                </button>
              </td>
              <td>
                <button
                  onClick={() =>
                    window.electronAPI
                      .removeFile(book.filePath)
                      .then(() => window.electronAPI.getBooks())
                      .then((fileInfos) => dispatch(loadBooks(fileInfos)))
                  }
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
