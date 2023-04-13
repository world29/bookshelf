import { useState } from "react";

import "../styles/StarRating.css";

type Props = {
  defaultRating: number;
  onChange: (rating: number) => void;
};

function StarRating(props: Props) {
  const { defaultRating, onChange } = props;

  const [rating, setRating] = useState(defaultRating);
  const [hover, setHover] = useState(0);

  const onClickStar = (newValue: number) => {
    if (rating !== newValue) {
      setRating(newValue);
      onChange(newValue);
    }
  };

  return (
    <div className="starRatingWrapper">
      {[...Array(5)].map((value, index) => {
        index += 1;

        return (
          <button
            type="button"
            key={index}
            onClick={() => onClickStar(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
          >
            {index <= (hover || rating) ? (
              <i className="fa-solid fa-star" />
            ) : (
              <i className="fa-regular fa-star" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default StarRating;
