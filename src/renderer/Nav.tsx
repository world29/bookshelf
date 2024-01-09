import { ChangeEvent, useState } from "react";

import { FILTER_BY_RATING, FilterByRating } from "../models/filter";
import { SORT_ORDER, SortOrder } from "../models/sortOrder";
import { useAppDispatch } from "./app/hooks";
import { addBooks } from "./features/books/booksSlice";

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
    <nav className="navbar bg-body-tertiary">
      <div className="container-fluid">
        <form className="d-flex align-items-start" role="search">
          <input
            className="form-control"
            type="search"
            placeholder="Search"
            onChange={handleChangeString}
          ></input>
          <select
            className="form-select"
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
            className="form-select"
            defaultValue={sortOrder}
            onChange={handleChangeSortOrder}
          >
            {Object.values(SORT_ORDER).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </form>
        <form className="d-flex align-items-end">
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={handleClickAddZip}
          >
            Addzip
          </button>
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={handleClickAddFolder}
          >
            Addfolder
          </button>
        </form>
      </div>
    </nav>
  );
};
