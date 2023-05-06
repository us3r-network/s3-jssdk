import type { FavorButtonRenderProps } from "./FavorButton";
import ReactLoading from "react-loading";
import FavoriteBorderSvg from "@material-design-icons/svg/round/favorite_border.svg";
import FavoriteSvg from "@material-design-icons/svg/round/favorite.svg";

export interface FavorButtonChildrenProps extends FavorButtonRenderProps {}

export function FavorButtonChildren({
  isFavoring,
  isFavored,
  favorsCount,
}: FavorButtonChildrenProps) {
  return (
    <>
      {(isFavoring && (
        <ReactLoading type="spinningBubbles" width={20} height={20} />
      )) || <>{isFavored ? <FavoriteSvg /> : <FavoriteBorderSvg />}</>}
      <span>{favorsCount || 0}</span>
    </>
  );
}
