import { ChangeEvent, useState } from "react";

import { SortBy, SORT_BY } from "../../../models/sort";

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
    <select onChange={handleChange}>
      {Object.values(SORT_BY).map((value) => (
        <option key={value} value={value}>
          Sort by: {value}
        </option>
      ))}
    </select>
  );
}

export default SelectSortBy;
