import StarSvg from "@material-design-icons/svg/filled/star.svg";
import StarBorderSvg from "@material-design-icons/svg/filled/star_border.svg";
import { HTMLAttributes } from "react";
export function StarIcon(props: HTMLAttributes<SVGSVGElement>) {
  return <StarSvg {...props} />;
}
export function StarBorderIcon(props: HTMLAttributes<SVGSVGElement>) {
  return <StarBorderSvg {...props} />;
}
