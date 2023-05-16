import type { VoteButtonRenderProps } from "./VoteButton";
import { ReactComponent as ThumbUpOffSvg } from "@material-design-icons/svg/filled/thumb_up_off_alt.svg";
import {ReactComponent as ThumbUpSvg} from "@material-design-icons/svg/filled/thumb_up_alt.svg";
import LoadingSpokes from "../common/Loading/LoadingSpokes";

export interface VoteButtonChildrenProps extends VoteButtonRenderProps {}

export function VoteButtonChildren({
  isVoting,
  isVoted,
  votesCount,
}: VoteButtonChildrenProps) {
  return (
    <>
      {(isVoting && <LoadingSpokes width={20} height={20} />) || (
        <>{isVoted ? <ThumbUpSvg /> : <ThumbUpOffSvg />}</>
      )}
      <span>{votesCount || 0}</span>
    </>
  );
}
