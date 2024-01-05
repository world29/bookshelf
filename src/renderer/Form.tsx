import { ChangeEvent, useState } from "react";

import {
  FILTER_BY_RATING,
  FILTER_BY_TAG,
  FilterByRating,
  FilterByTag,
} from "../models/filter";
import { SORT_ORDER, SortOrder } from "../models/sortOrder";
import "./styles/Form.css";

type Props = {
  onChangeString: (queryString: string) => void;
  onChangeTag: (queryTag: FilterByTag) => void;
  onChangeRating: (queryRating: FilterByRating) => void;
  onChangeSortOrder: (querySortOrder: SortOrder) => void;
  defaultTag: FilterByTag;
  defaultRating: FilterByRating;
  defaultSortOrder: SortOrder;
};

export const Form = (props: Props) => {
  const {
    onChangeString,
    onChangeTag,
    onChangeRating,
    onChangeSortOrder,
    defaultTag,
    defaultRating,
    defaultSortOrder,
  } = props;

  const [tag, setTag] = useState<FilterByTag>(defaultTag);
  const [rating, setRating] = useState<FilterByRating>(defaultRating);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSortOrder);

  const handleChangeString = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeString(e.target.value);
  };

  const handleChangeTag = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as FilterByTag;

    if (tag !== newValue) {
      setTag(newValue);
      onChangeTag(newValue);
    }
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
    <div className="row g-7 form">
      {/* filter by string */}
      <div className="col-auto">
        <input
          type="text"
          className="form-control"
          onChange={handleChangeString}
          placeholder="Search..."
        />
      </div>
      {/* filter by tag */}
      <div className="col-auto">
        <label className="col-form-label">Tag:</label>
      </div>
      <div className="col-auto">
        <select
          className="form-select"
          defaultValue={tag}
          onChange={handleChangeTag}
        >
          {Object.values(FILTER_BY_TAG).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
      {/* filter by rating */}
      <div className="col-auto">
        <label className="col-form-label">Rating:</label>
      </div>
      <div className="col-auto">
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
      </div>
      {/* filter by sortOrder */}
      <div className="col-auto">
        <label className="col-form-label">Sort:</label>
      </div>
      <div className="col-auto">
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
      </div>
    </div>
  );
};
