import styled from "styled-components";
import LoadingGif from "./loading.gif";

const ButtonLoading = styled.img.attrs({
  src: LoadingGif,
})`
  width: 20px;
  height: 20px;
`;
export default ButtonLoading;
