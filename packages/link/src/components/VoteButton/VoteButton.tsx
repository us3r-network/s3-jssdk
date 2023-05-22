import { useMemo } from "react";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { Button, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { VoteButtonChildren } from "./VoteButtonChildren";
import { useLink } from "../../hooks/useLink";
import { useVoteAction } from "../../hooks/useVoteAction";

export interface VoteButtonIncomingProps {
  linkId: string;
  onSuccessfullyVote?: () => void;
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
  children,
  ...props
}: VoteButtonProps) {
  const isAuthenticated = useIsAuthenticated();
  const { link } = useLink(linkId);
  const { isVoted, isVoting, isDisabled, onVote } = useVoteAction(
    linkId,
    onSuccessfullyVote
  );

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
    votesCount: link?.votesCount || 0,
  };

  const defaultChildren = useMemo(
    () => <VoteButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );
  return (
    <Button {...props} {...businessProps}>
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
