import * as React from "react";
import { useAppSelector } from "../../app/hooks";
import { selectFiles } from "./filesSlice";

export function Files() {
  const files = useAppSelector(selectFiles);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>FilePath</th>
            <th>FileSize</th>
            <th>FileHash</th>
          </tr>
        </thead>
        <tbody>
          {files.map((fileInfo, index) => (
            <tr key={index}>
              <td>{fileInfo.filePath}</td>
              <td>{fileInfo.fileSize}</td>
              <td>{fileInfo.fileHash}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
