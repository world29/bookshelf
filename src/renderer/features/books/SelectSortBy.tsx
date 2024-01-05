import { ChangeEvent, useState } from "react";

import { SortBy, SORT_BY } from "../../../models/sort";
import "../../styles/SelectSortBy.css";

type Props = {
  defaultValue: SortBy;
  onChange: (sortBy: SortBy) => void;
};

function SelectSortBy(props: Props) {
  const { defaultValue, onChange } = props;

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as SortBy;

    if (currentValue !== newValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="sortWrapper">
      <div className="label">Sort by:</div>
      <div>
        <select onChange={handleChange} defaultValue={currentValue}>
          {Object.values(SORT_BY).map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default SelectSortBy;
