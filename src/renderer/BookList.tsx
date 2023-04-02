import { Book } from "../models/book";
import { useAppDispatch } from "./app/hooks";
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

  const handleClickEdit = () => {
    dispatch(openEditDialog(book.path));
  };

  const thumbnailPath =
    book.thumbnailPath !== ""
      ? book.thumbnailPath
      : "https://via.placeholder.com/150/92c952";

  return (
    <div>
      <img src={thumbnailPath} alt="album" />
      <div>
        <div>{book.title}</div>
        <button onClick={handleClickEdit}>edit</button>
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
