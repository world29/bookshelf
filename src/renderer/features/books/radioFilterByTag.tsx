import React, { useState } from "react";
import { FilterByTag, FILTER_BY_TAG } from "../../../models/filter";

type Props = {
  defaultValue: FilterByTag;
  onChange: (filter: FilterByTag) => void;
};

function RadioFilterByTag(props: Props) {
  const { defaultValue, onChange } = props;

  const [currentValue, setCurrentValue] = useState(defaultValue);

  const handleChange = (value: FilterByTag) => () => {
    if (currentValue !== value) {
      setCurrentValue(value);
      onChange(value);
    }
  };

  return (
    <fieldset>
      <legend>Filter by Tag</legend>
      {Object.values(FILTER_BY_TAG).map((value) => (
        <React.Fragment key={value}>
          <input
            type="radio"
            name="radio-filter-by-tag"
            id={`radio-filter-by-tag-${value}`}
            value={value}
            onChange={handleChange(value)}
            checked={value === currentValue}
          />
          <label htmlFor={`radio-filter-by-tag-${value}`}>{value}</label>
        </React.Fragment>
      ))}
    </fieldset>
  );
}

export default RadioFilterByTag;
