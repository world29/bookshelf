import { ChangeEvent, useState } from "react";

import { FilterByTag, FILTER_BY_TAG } from "../../../models/filter";

type Props = {
  defaultValue: FilterByTag;
  onChange: (filter: FilterByTag) => void;
};

function SelectFilterByTag(props: Props) {
  const { defaultValue, onChange } = props;

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value as FilterByTag;

    if (currentValue !== newValue) {
      setCurrentValue(newValue);
      onChange(newValue);
    }
  };

  return (
    <select onChange={handleChange}>
      {Object.values(FILTER_BY_TAG).map((value) => (
        <option key={value} value={value}>
          Tag: {value}
        </option>
      ))}
    </select>
  );
}

export default SelectFilterByTag;
