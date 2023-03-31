import React, { useState } from "react";

import { Book } from "../models/book";
import { useAppDispatch } from "./app/hooks";
import { setTitle } from "./features/books/booksSlice";
import "./styles/BookList.css";

type BookListItemProps = {
  book: Book;
};

type BookListProps = {
  books: Book[];
};

const BookListItem = (props: BookListItemProps) => {
  const { book } = props;

  const dispatch = useAppDispatch();

  const [editMode, setEditMode] = useState(false);

  const handleClickTitle = () => {
    setEditMode(true);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setTitle({ path: book.path, title: e.target.value }));
  };

  const handleSubmitTitle = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setEditMode(false);
  };

  const handleBlurTitle = (e: React.FocusEvent<HTMLInputElement>) => {
    setEditMode(false);
  };

  return (
    <div>
      <img src={"https://via.placeholder.com/150/92c952"} alt="album" />
      <div>
        {editMode ? (
          <form onSubmit={handleSubmitTitle}>
            <input
              type="text"
              defaultValue={book.title}
              onChange={handleChangeTitle}
              onBlur={handleBlurTitle}
            />
          </form>
        ) : (
          <div onClick={handleClickTitle}>{book.title}</div>
        )}
      </div>
    </div>
  );
};

export const BookList = (props: BookListProps) => {
  const { books } = props;

  return (
    <div className="bookGridWrapper">
      {books.map((book) => (
        <BookListItem key={book.path} book={book} />
      ))}
    </div>
  );
};
