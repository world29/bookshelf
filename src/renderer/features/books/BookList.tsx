import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { SortOrder } from "../../components/Table";
import { TableBody } from "../../components/TableBody";
import { TableHead } from "../../components/TableHead";
import { loadBooks, selectBooks } from "./booksSlice";

const columns = [
  {
    label: "Title",
    accessor: "title",
    sortable: true,
  },
  {
    label: "Author",
    accessor: "author",
    sortable: true,
  },
  {
    label: "Score",
    accessor: "score",
    sortable: true,
  },
];

export function BookList() {
  const books = useAppSelector(selectBooks);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.electronAPI
      .getBooks()
      .then((bookInfos) => dispatch(loadBooks(bookInfos)));
  }, []);

  const handleSorting = (sortField: string, sortOrder: SortOrder) => {
    window.electronAPI
      .getBooksSortBy(sortField, sortOrder === SortOrder.Ascending)
      .then((bookInfos) => dispatch(loadBooks(bookInfos)));
  };

  return (
    <div>
      <table>
        <TableHead columns={columns} handleSorting={handleSorting} />
        <TableBody columns={columns} dataRows={books} />
      </table>
    </div>
  );
}
