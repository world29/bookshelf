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
          </tr>
        </thead>
        <tbody>
          {files.map((value, index) => (
            <tr key={index}>
              <td>{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
