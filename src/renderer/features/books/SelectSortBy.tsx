import { ChangeEvent, useState } from "react";

import { SortOrder, SORT_ORDER } from "../../../models/sortOrder";
import "../../styles/SelectSortBy.css";

type Props = {
  defaultValue: SortOrder;
  onChange: (sortBy: SortOrder) => void;
};

function SelectSortBy(props: Props) {
  const { defaultValue, onChange } = props;

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as SortOrder;

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
          {Object.values(SORT_ORDER).map((value) => (
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
