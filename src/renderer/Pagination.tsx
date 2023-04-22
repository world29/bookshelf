import ReactPaginate from "react-paginate";

import "./styles/Pagination.css";

type Props = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

const Pagination = (props: Props) => {
  const { page, pageCount, onPageChange } = props;

  const handlePageChange = (e: { selected: number }) => {
    onPageChange(e.selected);
  };

  return (
    <div className="paginateWrapper">
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageChange}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        forcePage={page}
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
};

export default Pagination;
