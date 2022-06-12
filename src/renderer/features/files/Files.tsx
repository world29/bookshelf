import React, { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { loadFiles, selectFiles } from "./filesSlice";

export function Files() {
  const files = useAppSelector(selectFiles);
  const dispatch = useAppDispatch();

  useEffect(() => {
    window.electronAPI
      .getFiles()
      .then((fileInfos) => dispatch(loadFiles(fileInfos)));
  }, []);

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>FilePath</th>
            <th>FileSize</th>
            <th>FileHash</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {files.map((fileInfo, index) => (
            <tr key={index}>
              <td>{fileInfo.filePath}</td>
              <td>{fileInfo.fileSize}</td>
              <td>{fileInfo.fileHash}</td>
              <td>
                <button
                  onClick={() =>
                    window.electronAPI
                      .removeFile(fileInfo.filePath)
                      .then(() => window.electronAPI.getFiles())
                      .then((fileInfos) => dispatch(loadFiles(fileInfos)))
                  }
                >
                  x
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
