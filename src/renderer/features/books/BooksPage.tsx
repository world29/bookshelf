import React from "react";
import { BookEditDialog } from "./BookEditDialog";

import { BookList } from "./BookList";

export function BooksPage() {
  return (
    <div>
      <BookList />
      <BookEditDialog />
    </div>
  );
}
