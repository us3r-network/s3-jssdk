import { ReactComponent as StarSvg } from "@material-design-icons/svg/filled/star.svg";
import { ReactComponent as StarBorderSvg } from "@material-design-icons/svg/filled/star_border.svg";
import { HTMLAttributes } from "react";
import styles from "./RatingStar.module.css";

export function ActivatedStarIcon({
  className,
  ...props
}: HTMLAttributes<SVGSVGElement>) {
  return (
    <StarSvg
      className={`${styles.ActivatedStarIcon} ${className}`}
      {...props}
    />
  );
}
export function InactivatedStarIcon({
  className,
  ...props
}: HTMLAttributes<SVGSVGElement>) {
  return (
    <StarBorderSvg
      className={`${styles.InactivatedStarIcon} ${className}`}
      {...props}
    />
  );
}
