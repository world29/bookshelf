import { useRef, useState } from "react";

import { Book } from "../../models/book";
import { useAppDispatch } from "../app/hooks";
import ContextMenu from "./ContextMenu";
import StarRating from "./StarRating";
import {
  removeBook,
  updateBookRating,
  createBookThumbnail,
} from "../features/books/booksSlice";
import BookEditorDialog from "./BookEditorDialog";

import "./../styles/BookList.css";

type BookListItemProps = {
  book: Book;
  onClickEdit: () => void;
};

type BookListProps = {
  books: Book[];
};

const BookListItem = (props: BookListItemProps) => {
  const { book, onClickEdit } = props;

  const dispatch = useAppDispatch();

  const [contextMenuState, setContextMenuState] = useState<{
    isOpen: boolean;
    top: number;
    left: number;
  }>({ isOpen: false, top: 0, left: 0 });

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
    dispatch(createBookThumbnail({ path: book.path }));

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

  const createThumbnailUrl = (): string => {
    if (book.thumbnailPath === "") {
      return "https://via.placeholder.com/256x362/92c952";
    }
    if (book.thumbHash) {
      return `${book.thumbnailPath}?${book.thumbHash}`;
    }
    return book.thumbnailPath;
  };

  const modifiedTimeString = new Date(book.modifiedTime).toLocaleDateString();

  return (
    <div className="bookWrapper" onContextMenu={handleContextMenu}>
      <div className="thumbnail">
        <img src={createThumbnailUrl()} alt="thumbnail" />
      </div>
      <div>
        <div className="bookText">{book.title}</div>
        <div className="bookText">{book.author}</div>
        <div className="bookText">{modifiedTimeString}</div>
        <StarRating defaultRating={book.rating} onChange={handleChangeRating} />
        <div className="button-container">
          <button onClick={handleClickOpen}>open</button>
          <button onClick={() => onClickEdit()}>edit</button>
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

  const dialogRef = useRef<HTMLDialogElement>(null);
  const [bookToEdit, setBookToEdit] = useState<Book | null>(null);

  function showEditDialog(book: Book) {
    if (dialogRef.current) {
      setBookToEdit(book);
      dialogRef.current.showModal();
    }
  }

  function handleCloseDialog() {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  }

  return (
    <>
      <div className="bookGridWrapper">
        {books.map((book) => (
          <BookListItem
            key={book.path}
            book={book}
            onClickEdit={() => showEditDialog(book)}
          />
        ))}
      </div>
      <BookEditorDialog
        dialogRef={dialogRef}
        book={bookToEdit}
        onClose={handleCloseDialog}
      />
    </>
  );
};
