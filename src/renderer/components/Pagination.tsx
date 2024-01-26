import "./../styles/Pagination.css";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const maxVisiblePages = 3;

function Pagination(props: Props) {
  const { currentPage, totalPages, onPageChange } = props;

  const handlePageClick = (pageNumber: number) => {
    onPageChange(pageNumber);
  };

  const renderPages = () => {
    const pages = [];
    const halfVisiblePages = Math.floor(maxVisiblePages / 2);

    let startPage = Math.max(currentPage - halfVisiblePages, 0);
    const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 0);
    }

    // 先頭ページへのリンク
    if (startPage > 0) {
      pages.push(renderPage(0));
      if (startPage > 1) {
        pages.push(renderDots("dots-left"));
      }
    }

    // 現在ページ周辺のリンク
    for (let i = startPage; i <= endPage; i++) {
      pages.push(renderPage(i));
    }

    // 末尾ページへのリンク
    if (endPage < totalPages - 1) {
      if (endPage < totalPages - 2) {
        pages.push(renderDots("dots-right"));
      }
      pages.push(renderPage(totalPages - 1));
    }

    return pages;
  };

  const renderPage = (pageNumber: number) => (
    <span
      key={pageNumber}
      className={`page ${pageNumber === currentPage ? "active" : ""}`}
      onClick={() => handlePageClick(pageNumber)}
    >
      {pageNumber + 1}
    </span>
  );

  const renderDots = (key: string) => (
    <span key={key} className="dots">
      ...
    </span>
  );

  return (
    <div className="pagination">
      <span
        className={`prev ${currentPage === 0 ? "disabled" : ""}`}
        onClick={() => handlePageClick(currentPage - 1)}
      >
        &#10094;
      </span>
      {renderPages()}
      <span
        className={`next ${currentPage === totalPages - 1 ? "disabled" : ""}`}
        onClick={() => handlePageClick(currentPage + 1)}
      >
        &#10095;
      </span>
    </div>
  );
}

export default Pagination;
