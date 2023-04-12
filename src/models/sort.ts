export const SORT_BY = {
  MODIFIED_DESC: "Modified(DESC)", // 変更日時：昇順
  MODIFIED_ASC: "Modified(ASC)", // 変更日時：降順
} as const;

export type SortBy = typeof SORT_BY[keyof typeof SORT_BY];
