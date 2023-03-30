import { Book } from "../models/book";

type Props = {
  books: Book[];
};

const BookList = (props: Props) => {
  const { books } = props;
  return (
    <div>
      {books.map((book) => (
        <div key={book.path}>
          <div> {book.title}</div>
          <div>{book.author}</div>
        </div>
      ))}
    </div>
  );
};

export default BookList;
