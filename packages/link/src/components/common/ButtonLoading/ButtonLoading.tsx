import { ButtonHTMLAttributes } from "react";
import LoadingGif from "./loading.gif";
function ButtonLoading({ ...props }: ButtonHTMLAttributes<HTMLImageElement>) {
  return <img src={LoadingGif} width={"20px"} height={"20px"} {...props} />;
}
export default ButtonLoading;
