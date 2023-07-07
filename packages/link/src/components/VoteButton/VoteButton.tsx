import { useMemo } from "react";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { Button, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { VoteButtonChildren } from "./VoteButtonChildren";
import { useVoteAction } from "../../hooks/useVoteAction";
import { useLinkVotes } from "../../hooks/useLinkVotes";

export interface VoteButtonIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * callback when vote is successfully added or removed.
   * @param isVoted is voted or not.
   */
  onSuccessfullyVote?: (isVoted: boolean) => void;
  /**
   * callback when vote is failed to add or remove.
   * @param errMsg error message.
   */
  onFailedVote?: (errMsg: string) => void;
}
export interface VoteButtonRenderProps {
  isAuthenticated: boolean;
  isVoted: boolean;
  isVoting: boolean;
  isDisabled: boolean;
  votesCount: number;
}
export interface VoteButtonProps
  extends ChildrenRenderProps<
      AriaButtonProps,
      ButtonRenderProps & VoteButtonRenderProps
    >,
    VoteButtonIncomingProps {}

export function VoteButton({
  linkId,
  onSuccessfullyVote,
  onFailedVote,
  children,
  ...props
}: VoteButtonProps) {
  const isAuthenticated = useIsAuthenticated();
  const { linkVotes } = useLinkVotes(linkId);
  const { isVoted, isVoting, isDisabled, onVote } = useVoteAction(linkId, {
    onSuccessfullyVote,
    onFailedVote,
  });

  const businessProps = {
    "data-us3r-component": "VoteButton",
    "data-authenticated": isAuthenticated || undefined,
    "data-voted": isVoted || undefined,
    "data-voting": isVoting || undefined,
    "data-disabled": isDisabled || undefined,
    isDisabled,
    onClick: onVote,
  };

  const businessRenderProps = {
    isAuthenticated,
    isVoted,
    isVoting,
    isDisabled,
    votesCount: linkVotes?.votesCount || 0,
  };

  const defaultChildren = useMemo(
    () => <VoteButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );
  return (
    <Button {...businessProps} {...props}>
      {(buttonProps) =>
        childrenRender(
          children,
          { ...buttonProps, ...businessRenderProps },
          defaultChildren
        )
      }
    </Button>
  );
}
