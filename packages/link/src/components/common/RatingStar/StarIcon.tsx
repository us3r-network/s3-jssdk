import { ReactComponent as StarSvg } from "@material-design-icons/svg/filled/star.svg";
import { ReactComponent as StarBorderSvg } from "@material-design-icons/svg/filled/star_border.svg";
import { HTMLAttributes } from "react";
export function ActivatedStarIcon(props: HTMLAttributes<SVGSVGElement>) {
  return <StarSvg data-common-element="ActivatedStarIcon" {...props} />;
}
export function InactivatedStarIcon(props: HTMLAttributes<SVGSVGElement>) {
  return <StarBorderSvg data-common-element="InactivatedStarIcon" {...props} />;
}
