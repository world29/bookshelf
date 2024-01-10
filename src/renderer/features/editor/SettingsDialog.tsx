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

  const handleApply = () => {
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
      <div className="dialogInner" onClick={(e) => e.stopPropagation()}>
        <div className="form-group row mb-3">
          <label className="col-form-label col-sm-2">Viewer</label>
          <div className="col-sm-10">
            <input
              type="text"
              className="form-control"
              onChange={handleChangeViewer}
              defaultValue={viewer}
            />
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-primary me-2"
          onClick={handleApply}
        >
          Apply
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={closeModal}
        >
          Close
        </button>
      </div>
    </dialog>
  );
}
