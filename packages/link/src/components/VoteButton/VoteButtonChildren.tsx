import type { VoteButtonRenderProps } from "./VoteButton";
import { ReactComponent as VoteIcon } from "@material-design-icons/svg/filled/thumb_up_off_alt.svg";
import { ReactComponent as VotedIcon } from "@material-design-icons/svg/filled/thumb_up_alt.svg";
import LoadingSpokes from "../common/Loading/LoadingSpokes";

export interface VoteButtonChildrenProps extends VoteButtonRenderProps {}

export function VoteButtonChildren({
  isVoting,
  isVoted,
  votesCount,
}: VoteButtonChildrenProps) {
  return (
    <>
      {(isVoting && (
        <LoadingSpokes
          width={20}
          height={20}
          data-layout-element="LoadingSvg"
        />
      )) || (
        <>
          {isVoted ? (
            <VotedIcon data-layout-element="VotedIcon" />
          ) : (
            <VoteIcon data-layout-element="VoteIcon" />
          )}
        </>
      )}
      <span data-layout-element="VotesCount">{votesCount || 0}</span>
    </>
  );
}
