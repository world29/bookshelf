// ネイティブ型の変更
// https://typescript-jp.gitbook.io/deep-dive/type-system/lib.d.ts#neitibunative-typeswosuru

// https://github.com/microsoft/TypeScript/issues/48267
interface HTMLDialogElement {
  open: boolean;
  show: () => void;
  showModal: () => void;
  close: () => void;
}
