import type { FavorButtonRenderProps } from "./FavorButton";
import FavoriteBorderSvg from "@material-design-icons/svg/round/favorite_border.svg";
import FavoriteSvg from "@material-design-icons/svg/round/favorite.svg";
import LoadingSpokes from "../common/Loading/LoadingSpokes";

export interface FavorButtonChildrenProps extends FavorButtonRenderProps {}

export function FavorButtonChildren({
  isFavoring,
  isFavored,
  favorsCount,
}: FavorButtonChildrenProps) {
  return (
    <>
      {(isFavoring && <LoadingSpokes width={20} height={20} />) || (
        <>{isFavored ? <FavoriteSvg /> : <FavoriteBorderSvg />}</>
      )}
      <span>{favorsCount || 0}</span>
    </>
  );
}
