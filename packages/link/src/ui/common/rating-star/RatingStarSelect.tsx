import { SCORE_VALUE_MAX } from "../../../constants";
import { InactivatedStarIcon, ActivatedStarIcon } from "./StarIcon";
import styles from "./RatingStar.module.css";

type RatingStarSelectProps = {
  value: number;
  onChange?: (value: number) => void;
  isDisabled?: boolean;
  className?: string;
};
export default function RatingStarSelect({
  value,
  onChange,
  isDisabled,
  className,
}: RatingStarSelectProps) {
  return (
    <span
      className={`${styles.RatingStarSelect} ${className}`}
      data-disabled={isDisabled || undefined}
      data-changeable={onChange ? true : undefined}
    >
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
            {value >= v ? <ActivatedStarIcon /> : <InactivatedStarIcon />}
          </span>
        );
      })}
    </span>
  );
}
