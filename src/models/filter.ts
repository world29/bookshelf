// タグの有無による結果のフィルタリング
// memo:
// 以下のように enum を使用すると、Object.keys, Object.entries で
// 意図した結果を得られないため、オブジェクトリテラルとして定義
// export enum FilterByTag {
//   All,
//   Tagged,
//   Untagged,
// }
export const FILTER_BY_TAG = {
  ALL: "All", // 全て表示
  TAGGED: "Tagged", // タグ付けされているものだけを表示
  UNTAGGED: "Untagged", // タグ付けされていないものだけを表示
} as const;

export type FilterByTag = typeof FILTER_BY_TAG[keyof typeof FILTER_BY_TAG];

export const FILTER_BY_RATING = {
  ALL: "All",
  EXCELLENT: "Excellent", // 5
  GOOD: "Good", // 4
  OK: "Ok", // 3
  POOR: "Poor", // 2
  VERY_BAD: "VeryBad", // 1
  UNRATED: "Unrated", // 0
} as const;

export type FilterByRating =
  typeof FILTER_BY_RATING[keyof typeof FILTER_BY_RATING];
