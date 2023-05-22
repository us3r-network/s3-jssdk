import type { FavorButtonRenderProps } from "./FavorButton";
import { ReactComponent as FavorIcon } from "@material-design-icons/svg/round/favorite_border.svg";
import { ReactComponent as FavoredIcon } from "@material-design-icons/svg/round/favorite.svg";
import LoadingSpokes from "../common/Loading/LoadingSpokes";

export interface FavorButtonChildrenProps extends FavorButtonRenderProps {}

export function FavorButtonChildren({
  isFavoring,
  isFavored,
  favorsCount,
}: FavorButtonChildrenProps) {
  return (
    <>
      {(isFavoring && (
        <LoadingSpokes
          width={20}
          height={20}
          data-layout-element="LoadingSvg"
        />
      )) || (
        <>
          {isFavored ? (
            <FavoredIcon data-layout-element="FavoredIcon" />
          ) : (
            <FavorIcon data-layout-element="FavorIcon" />
          )}
        </>
      )}
      <span data-layout-element="FavorsCount">{favorsCount || 0}</span>
    </>
  );
}
