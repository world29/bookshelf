import { ChangeEvent, useState } from "react";

import { FilterByRating, FILTER_BY_RATING } from "../../../models/filter";

type Props = {
  defaultValue: FilterByRating;
  onChange: (filter: FilterByRating) => void;
};

function SelectFilterByRating(props: Props) {
  const { defaultValue, onChange } = props;

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as FilterByRating;

    if (currentValue !== newValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <select onChange={handleChange}>
      {Object.values(FILTER_BY_RATING).map((value) => (
        <option key={value} value={value}>
          Rating: {value}
        </option>
      ))}
    </select>
  );
}

export default SelectFilterByRating;
