import { SCORE_VALUE_MAX } from "../../../constants";
import { StarBorderIcon, StarIcon } from "./StarIcon";
interface RatingStarSelectProps {
  value: number;
  onChange?: (value: number) => void;
  isDisabled?: boolean;
}
export default function RatingStarSelect({
  value,
  onChange,
  isDisabled,
}: RatingStarSelectProps) {
  return (
    <span>
      {[...Array(SCORE_VALUE_MAX)].map((_, index) => {
        const v = index + 1;
        return (
          <span
            key={v}
            onClick={() => {
              if (isDisabled) return;
              if (onChange) onChange(v);
            }}
          >
            {value >= v ? <StarIcon /> : <StarBorderIcon />}
          </span>
        );
      })}
    </span>
  );
}
