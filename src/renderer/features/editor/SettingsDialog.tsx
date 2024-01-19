import { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeSettingsDialog } from "./editorSlice";

import "./../../styles/SettingsDialog.css";

export default function SettingsDialog() {
  const { isOpen } = useAppSelector((state) => state.editor.settingsDialog);

  const dialogRef = useRef<HTMLDialogElement>(null);

  const dispatch = useAppDispatch();

  const [viewer, setViewer] = useState("");

  useEffect(() => {
    // ダイアログが開いたときだけ設定情報をメインプロセスから受け取る
    if (isOpen) {
      window.electronAPI
        .getSettings()
        .then((settings) => setViewer(settings.viewer));
    }

    if (dialogRef.current) {
      if (isOpen) {
        dialogRef.current.showModal();
      } else {
        dialogRef.current.close();
      }
    }
  }, [isOpen]);

  const handleChangeViewer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setViewer(e.target.value);
  };

  const handleSave = () => {
    // メインプロセスに新しい設定値を送り、バリデーションする
    window.electronAPI
      .setSettingsViewer(viewer)
      .then(() => closeModal())
      .catch((err) => console.error(err));
  };

  const closeModal = () => {
    dispatch(closeSettingsDialog());
  };

  return (
    <dialog ref={dialogRef} onClick={closeModal} onCancel={closeModal}>
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
