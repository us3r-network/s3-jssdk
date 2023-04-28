import { FavorButton, FavorButtonProps } from "@us3r-network/link";
import ButtonLoading from "../common/ButtonLoading/ButtonLoading";
import FavorWhiteIcon from "../common/FavorIcon/FavorWhiteIcon";
import FavorIcon from "../common/FavorIcon/FavorIcon";
import "./FavorButton.css";

export interface FavorButtonExampleProps extends FavorButtonProps {}

export function FavorButtonExample({ ...otherProps }: FavorButtonExampleProps) {
  return (
    <FavorButton className="us3r-FavorButton" {...otherProps}>
      {({ loading, isFavored, favorsCount }) => (
        <>
          {(loading && <ButtonLoading />) || (
            <>{isFavored ? <FavorWhiteIcon /> : <FavorIcon />}</>
          )}
          <span>{favorsCount || 0}</span>
        </>
      )}
    </FavorButton>
  );
}
