export const SORT_BY = {
  MODIFIED_DESC: "Modified(DESC)", // 変更日時：降順
  MODIFIED_ASC: "Modified(ASC)", // 変更日時：昇順
  REGISTERED_DESC: "Registered(DESC)", // 登録日時：降順
  REGISTERED_ASC: "Registered(ASC)", // 登録日時：昇順
} as const;

export type SortBy = typeof SORT_BY[keyof typeof SORT_BY];
