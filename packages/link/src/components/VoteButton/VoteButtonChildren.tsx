import type { VoteButtonRenderProps } from "./VoteButton";
import ReactLoading from "react-loading";
import ThumbUpOffSvg from "@material-design-icons/svg/filled/thumb_up_off_alt.svg";
import ThumbUpSvg from "@material-design-icons/svg/filled/thumb_up_alt.svg";

export interface VoteButtonChildrenProps extends VoteButtonRenderProps {}

export function VoteButtonChildren({
  isVoting,
  isVoted,
  votesCount,
}: VoteButtonChildrenProps) {
  return (
    <>
      {(isVoting && (
        <ReactLoading type="spinningBubbles" width={20} height={20} />
      )) || <>{isVoted ? <ThumbUpSvg /> : <ThumbUpOffSvg />}</>}
      <span>{votesCount || 0}</span>
    </>
  );
}
