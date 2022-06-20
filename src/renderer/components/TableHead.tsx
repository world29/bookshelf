import React, { useState } from "react";

import { SortOrder, TableColumn } from "./Table";

export type TableHeadProps = {
  columns: TableColumn[];
  handleSorting: (sortField: string, sortOrder: SortOrder) => void;
};

export function TableHead(props: TableHeadProps) {
  const { columns, handleSorting } = props;
  const [sortField, setSortField] = useState("");
  const [order, setOrder] = useState(SortOrder.Ascending);

  const handleSortingChange = (accessor: string) => {
    const sortOrder =
      accessor === sortField && order === SortOrder.Ascending
        ? SortOrder.Descending
        : SortOrder.Ascending;

    setSortField(accessor);
    setOrder(sortOrder);

    handleSorting(accessor, sortOrder);
  };

  return (
    <thead>
      <tr>
        {columns.map(({ label, accessor, sortable }) => {
          return (
            <th
              key={accessor}
              onClick={
                sortable ? () => handleSortingChange(accessor) : undefined
              }
            >
              {label}
            </th>
          );
        })}
      </tr>
    </thead>
  );
}
