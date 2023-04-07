import React, { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Modal from "../../common/Modal";
import { closeSettingsDialog } from "./editorSlice";

export default function SettingsDialog() {
  const { isOpen } = useAppSelector((state) => state.editor.settingsDialog);

  const dispatch = useAppDispatch();

  const [viewer, setViewer] = useState("");

  useEffect(() => {
    // ダイアログが開いたときだけ設定情報をメインプロセスから受け取る
    if (isOpen) {
      window.electronAPI
        .getSettings()
        .then((settings) => setViewer(settings.viewer));
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
    <Modal open={isOpen}>
      <form onSubmit={handleSubmit}>
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
    </Modal>
  );
}
