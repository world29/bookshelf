import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadBooks, selectBooks } from "./filesSlice";

export function Files() {
  const books = useAppSelector(selectBooks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.electronAPI
      .getBooks()
      .then((fileInfos) => dispatch(loadBooks(fileInfos)));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>FileSize</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {books.map((book, index) => (
            <tr key={index}>
              <td>{book.title}</td>
              <td>{book.fileInfo.fileSize}</td>
              <td>
                <button
                  onClick={() =>
                    window.electronAPI
                      .removeFile(book.fileInfo.filePath)
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
