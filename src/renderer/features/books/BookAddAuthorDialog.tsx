import React, { useState } from "react";
import { Dialog } from "../../Dialog";

export type AddAuthorDialogResult = {
  canceled: boolean;
  authorName?: string;
};

export type AddAuthorDialogProps = {
  onClose: (result: AddAuthorDialogResult) => void;
};

export function BookAddAuthorDialog(props: AddAuthorDialogProps) {
  const { onClose } = props;

  const [authorName, setAuthorName] = useState("");

  return (
    <Dialog open>
      <div>
        <input type="text" onChange={(e) => setAuthorName(e.target.value)} />
      </div>
      <span>
        <button onClick={() => onClose({ canceled: false, authorName })}>
          ok
        </button>
        <button onClick={() => onClose({ canceled: true })}>cancel</button>
      </span>
    </Dialog>
  );
}
