import { ReactNode, useState } from "react";
import ClickAwayListener from "./../common/ClickAwayListener";
import { FILTER_BY_RATING, FilterByRating } from "../../models/filter";

import "./../styles/RatingSelect.css";

type Props = {
  defaultValue: FilterByRating;
  onSelect: (value: FilterByRating) => void;
};

type Option = {
  value: FilterByRating;
  label: ReactNode;
};

const RatingSelect = ({ defaultValue, onSelect }: Props) => {
  const options = [
    {
      value: FILTER_BY_RATING.ALL,
      label: <span>All</span>,
    },
    {
      value: FILTER_BY_RATING.EXCELLENT,
      label: (
        <span>
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
        </span>
      ),
    },
    {
      value: FILTER_BY_RATING.GOOD,
      label: (
        <span>
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
        </span>
      ),
    },
    {
      value: FILTER_BY_RATING.OK,
      label: (
        <span>
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
        </span>
      ),
    },
    {
      value: FILTER_BY_RATING.POOR,
      label: (
        <span>
          <i className="fa-solid fa-star" />
          <i className="fa-solid fa-star" />
        </span>
      ),
    },
    {
      value: FILTER_BY_RATING.VERY_BAD,
      label: (
        <span>
          <i className="fa-solid fa-star" />
        </span>
      ),
    },
    {
      value: FILTER_BY_RATING.UNRATED,
      label: <span>Unrated</span>,
    },
  ];

  const defaultOption =
    options.find((x) => x.value === defaultValue) || options[0];

  const [selectedOption, setSelectedOption] = useState<Option>(defaultOption);
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setShowOptions(false);
    onSelect(option.value);
  };

  return (
    <ClickAwayListener onClick={() => setShowOptions(false)}>
      <div className="rating-select">
        <div
          className="selected-option"
          onClick={() => setShowOptions(!showOptions)}
        >
          {selectedOption.label}
          <i className="fas fa-angle-down"></i>
        </div>
        {showOptions && (
          <div className="options">
            {options.map((option) => (
              <div
                key={option.value}
                className={`option ${
                  option.value === selectedOption.value ? "selected" : ""
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default RatingSelect;
