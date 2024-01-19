﻿import { useState } from "react";

import { Book } from "../models/book";
import { useAppDispatch } from "./app/hooks";
import ContextMenu from "./components/ContextMenu";
import StarRating from "./common/StarRating";
import {
  removeBook,
  updateBookRating,
  updateBookThumbnail,
} from "./features/books/booksSlice";
import { openEditDialog } from "./features/editor/editorSlice";
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

  const [contextMenuState, setContextMenuState] = useState<{
    isOpen: boolean;
    top: number;
    left: number;
  }>({ isOpen: false, top: 0, left: 0 });

  const handleClickEdit = () => {
    dispatch(openEditDialog(book.path));
  };

  const handleClickRemove = () => {
    dispatch(removeBook({ path: book.path }));
  };

  const handleClickOpen = () => {
    window.electronAPI.openFile(book.path);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();

    if (!contextMenuState.isOpen) {
      openContextMenu(e.clientY, e.clientX);
    }
  };

  const handleChangeRating = (newRating: number) => {
    dispatch(updateBookRating({ path: book.path, rating: newRating }));
  };

  const handleClickContextMenuShowInFolder = (book: Book) => {
    window.electronAPI.showItemInFolder(book.path);

    closeContextMenu();
  };

  const handleClickContextMenuCreateThumbnail = (book: Book) => {
    dispatch(updateBookThumbnail({ path: book.path }));

    closeContextMenu();
  };

  const handleClickContextMenuMoveToTrash = (book: Book) => {
    window.electronAPI
      .moveToTrash(book.path)
      .then(() => dispatch(removeBook({ path: book.path })))
      .then(() => closeContextMenu());
  };

  const openContextMenu = (top: number, left: number) => {
    setContextMenuState({ isOpen: true, top, left });
  };

  const closeContextMenu = () => {
    setContextMenuState({ isOpen: false, top: 0, left: 0 });
  };

  const createMenuItems = (book: Book) => {
    return [
      {
        label: "Reveal in File Explorer",
        onClick: () => handleClickContextMenuShowInFolder(book),
      },
      {
        label: "Create Thumbnail",
        onClick: () => handleClickContextMenuCreateThumbnail(book),
      },
      {
        label: "Move to Trash",
        onClick: () => handleClickContextMenuMoveToTrash(book),
      },
    ];
  };

  const thumbnailPath =
    book.thumbnailPath !== ""
      ? book.thumbnailPath
      : "https://via.placeholder.com/256x362/92c952";

  const modifiedTimeString = new Date(book.modifiedTime).toLocaleDateString();

  return (
    <div className="bookWrapper" onContextMenu={handleContextMenu}>
      <div className="thumbnail">
        <img src={thumbnailPath} alt="thumbnail" />
      </div>
      <div>
        <div className="bookText">{book.title}</div>
        <div className="bookText">{book.author}</div>
        <div className="bookText">{modifiedTimeString}</div>
        <StarRating defaultRating={book.rating} onChange={handleChangeRating} />
        <div className="button-container">
          <button onClick={handleClickOpen}>open</button>
          <button onClick={handleClickEdit}>edit</button>
          <button onClick={handleClickRemove}>remove</button>
        </div>
      </div>
      {contextMenuState.isOpen && (
        <ContextMenu
          top={contextMenuState.top}
          left={contextMenuState.left}
          onClose={() => closeContextMenu()}
          menuItems={createMenuItems(book)}
        />
      )}
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
