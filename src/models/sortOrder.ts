// MEMO: 列挙型の代わりにオブジェクトリテラルを使用している
// https://typescriptbook.jp/reference/values-types-variables/enum/enum-problems-and-alternatives-to-enums
// https://qiita.com/KokiSakano/items/51cafbf7bda527a9d5bf
export const SORT_ORDER = {
  REGISTERED_DESC: "Registered(DESC)", // 登録日時：降順
  REGISTERED_ASC: "Registered(ASC)", // 登録日時：昇順
  MODIFIED_DESC: "Modified(DESC)", // 変更日時：降順
  MODIFIED_ASC: "Modified(ASC)", // 変更日時：昇順
} as const;

export type SortOrder = typeof SORT_ORDER[keyof typeof SORT_ORDER];
