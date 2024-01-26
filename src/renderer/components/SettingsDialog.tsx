import { useEffect, useRef, useState } from "react";

import "./../styles/SettingsDialog.css";

export default function SettingsDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const calledRef = useRef(false);

  const [viewer, setViewer] = useState("");

  useEffect(() => {
    // devServer が有効なときは useEffect が２回呼ばれるので、１度だけ実行したい処理はフラグでチェックする
    if (calledRef.current) return;
    calledRef.current = true;

    console.log("SettingsDialog:useEffect()");

    // メニューから設定ダイアログを開く
    window.electronAPI.handleOpenSettings(() => {
      openDialog();
    });
  }, []);

  const openDialog = () => {
    if (dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();

      // ダイアログが開いたときに設定情報をメインプロセスから受け取る
      window.electronAPI
        .getSettings()
        .then((settings) => setViewer(settings.viewer));
    }
  };

  const closeDialog = () => {
    if (dialogRef.current) {
      dialogRef.current.close();
    }
  };

  const handleChangeViewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewer(e.target.value);
  };

  const handleSave = () => {
    // メインプロセスに新しい設定値を送り、バリデーションする
    window.electronAPI
      .setSettingsViewer(viewer)
      .then(() => closeDialog())
      .catch((err) => console.error(err));
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={() => closeDialog()}
      onCancel={() => closeDialog()}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <div className="settings-page">
          <h1>Settings</h1>
          <form>
            <div className="form-group">
              <label>Viewer:</label>
              <input type="text" value={viewer} onChange={handleChangeViewer} />
            </div>
            <button type="button" onClick={handleSave}>
              Save
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
