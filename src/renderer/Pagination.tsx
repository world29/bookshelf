import { useState } from "react";
import ReactPaginate from "react-paginate";

import "./styles/Pagination.css";
import { BookList } from "./BookList";
import { Book } from "../models/book";

type Props = {
  books: Book[];
  itemsPerPage: number;
};

const Pagination = (props: Props) => {
  const { books, itemsPerPage } = props;

  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentBooks = books.slice(itemOffset, endOffset);

  const pageCount = Math.ceil(books.length / itemsPerPage);

  const handlePageClick = (e: { selected: number }) => {
    const newOffset = (e.selected * itemsPerPage) % books.length;
    setItemOffset(newOffset);
  };

  const renderPagination = () => (
    <div className="paginateWrapper">
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="< previous"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );

  return (
    <div className="booksWrapper">
      <div>
        {itemOffset + 1}-{Math.min(endOffset, books.length)} of {books.length}{" "}
        results
      </div>
      {renderPagination()}
      <BookList books={currentBooks} />
      {renderPagination()}
    </div>
  );
};

export default Pagination;
