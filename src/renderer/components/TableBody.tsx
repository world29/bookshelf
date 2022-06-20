import React from "react";

import { TableColumn } from "./Table";

export type TableDataValue = any;

export type TableDataRow = { [name: string]: TableDataValue };

export type TableBodyProps = {
  columns: TableColumn[];
  dataRows: TableDataRow[];
};

export function TableBody(props: TableBodyProps) {
  const { columns, dataRows } = props;

  return (
    <tbody>
      {dataRows.map((data, index) => {
        return (
          <tr key={index}>
            {columns.map(({ accessor }) => {
              const tData = data[accessor] ? data[accessor] : "---";
              return <td key={accessor}>{tData}</td>;
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
