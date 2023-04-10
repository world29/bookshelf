import { useState } from "react";

import { Book } from "../models/book";
import { useAppDispatch } from "./app/hooks";
import ClickAwayListener from "./common/ClickAwayListener";
import { removeBook } from "./features/books/booksSlice";
import { openEditDialog } from "./features/editor/editorSlice";
import "./styles/BookList.css";

type BookListItemProps = {
  book: Book;
};

type BookListProps = {
  books: Book[];
};

type ContextMenuProps = {
  top: number;
  left: number;
  onClose: () => void;
};

const ContextMenu = (props: ContextMenuProps) => {
  const { top, left, onClose } = props;

  const styles = {
    position: "absolute",
    top: `${top}px`,
    left: `${left}px`,
    width: "30%",
    height: "50%",
    backgroundColor: "slategray",
    zIndex: 999,
  } as React.CSSProperties;

  return (
    <ClickAwayListener onClick={onClose}>
      <div style={styles}>ContextMenu</div>
    </ClickAwayListener>
  );
};

const BookListItem = (props: BookListItemProps) => {
  const { book } = props;

  const dispatch = useAppDispatch();

  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

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

    if (!isOpenMenu) {
      setIsOpenMenu(true);
      setPosition({ x: e.pageX, y: e.pageY });
    }
  };

  const thumbnailPath =
    book.thumbnailPath !== ""
      ? book.thumbnailPath
      : "https://via.placeholder.com/150/92c952";

  return (
    <div onContextMenu={handleContextMenu}>
      <img src={thumbnailPath} alt="album" />
      <div>
        <div>{book.title}</div>
        <div>{book.author}</div>
        <button onClick={handleClickOpen}>open</button>
        <button onClick={handleClickEdit}>edit</button>
        <button onClick={handleClickRemove}>remove</button>
      </div>
      {isOpenMenu && (
        <ContextMenu
          top={position.y}
          left={position.x}
          onClose={() => setIsOpenMenu(false)}
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
