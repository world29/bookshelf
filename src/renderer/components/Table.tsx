export type TableColumn = {
  label: string;
  accessor: string;
  sortable: boolean;
};

export enum SortOrder {
  None = "none",
  Ascending = "asc",
  Descending = "desc",
}
