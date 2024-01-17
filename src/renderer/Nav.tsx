﻿import { ChangeEvent, useState } from "react";

import { FILTER_BY_RATING, FilterByRating } from "../models/filter";
import { SORT_ORDER, SortOrder } from "../models/sortOrder";
import { useAppDispatch } from "./app/hooks";
import { addBooks } from "./features/books/booksSlice";

import "./styles/Nav.css";

type Props = {
  onChangeString: (queryString: string) => void;
  onChangeRating: (queryRating: FilterByRating) => void;
  onChangeSortOrder: (querySortOrder: SortOrder) => void;
  defaultRating: FilterByRating;
  defaultSortOrder: SortOrder;
};

export const Nav = (props: Props) => {
  const {
    onChangeString,
    onChangeRating,
    onChangeSortOrder,
    defaultRating,
    defaultSortOrder,
  } = props;

  const dispatch = useAppDispatch();

  const [rating, setRating] = useState<FilterByRating>(defaultRating);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const handleClickAddZip = () => {
    window.electronAPI.openFileDialog("openFile").then((result) => {
      if (result.canceled) return;
      dispatch(addBooks({ filePaths: result.filePaths }));
    });
  };

  const handleClickAddFolder = () => {
    window.electronAPI.openFileDialog("openDirectory").then((result) => {
      if (result.canceled) return;
      dispatch(addBooks({ filePaths: result.filePaths }));
    });
  };

  const handleChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeString(e.target.value);
  };

  const handleChangeRating = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as FilterByRating;

    if (rating !== newValue) {
      setRating(newValue);
      onChangeRating(newValue);
    }
  };

  const handleChangeSortOrder = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as SortOrder;

    if (sortOrder !== newValue) {
      setSortOrder(newValue);
      onChangeSortOrder(newValue);
    }
  };

  return (
    <div className="navbar">
      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          onChange={handleChangeString}
        />
        <select
          className=""
          defaultValue={rating}
          onChange={handleChangeRating}
        >
          {Object.values(FILTER_BY_RATING).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
        <select
          className=""
          defaultValue={sortOrder}
          onChange={handleChangeSortOrder}
        >
          {Object.values(SORT_ORDER).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      <div>
        <button className="button" type="button" onClick={handleClickAddZip}>
          Addzip
        </button>
        <button className="button" type="button" onClick={handleClickAddFolder}>
          Addfolder
        </button>
      </div>
    </div>
  );
};
