import styled from "styled-components";
import { FavorButton, FavorButtonProps } from "@us3r-network/link";
import ButtonLoading from "../common/ButtonLoading/ButtonLoading";
import FavorWhiteIcon from "../common/FavorIcon/FavorWhiteIcon";
import FavorIcon from "../common/FavorIcon/FavorIcon";

export interface FavorButtonExampleProps extends FavorButtonProps {}

export function FavorButtonExample({ ...otherProps }: FavorButtonExampleProps) {
  return (
    <StyledFavorButton {...otherProps}>
      {({ loading, isFavored, favorsCount }) => (
        <>
          {(loading && <ButtonLoading />) || (
            <>{isFavored ? <FavorWhiteIcon /> : <FavorIcon />}</>
          )}
          <span>{favorsCount || 0}</span>
        </>
      )}
    </StyledFavorButton>
  );
}

const StyledFavorButton = styled(FavorButton)`
  box-sizing: border-box;

  /* Auto layout */

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  isolation: isolate;

  height: 40px;

  /* 🌘 $neutral/100 */

  background: #1a1e23;
  /* 🌘 $neutral/400 */

  border: 1px solid #39424c;
  border-radius: 12px;

  cursor: pointer;

  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  /* identical to box height, or 150% */

  text-align: center;

  /* #718096 */

  color: #718096;
`;
