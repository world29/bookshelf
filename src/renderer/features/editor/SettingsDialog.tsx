import React, { useEffect, useRef, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { closeSettingsDialog } from "./editorSlice";

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

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
    <dialog ref={dialogRef} onClick={closeModal}>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit} method="dialog">
          <input
            type="text"
            defaultValue={viewer}
            onChange={handleChangeViewer}
          />
          <div>
            <button type="submit">apply</button>
            <button type="button" onClick={closeModal}>
              close
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
