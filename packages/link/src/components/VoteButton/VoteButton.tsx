/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 17:14:14
 * @FilePath: /s3-jssdk/packages/link/src/components/VoteButton/VoteButton.tsx
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useMemo, useState } from "react";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { Button, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { VoteButtonChildren } from "./VoteButtonChildren";
import { useVoteAction } from "../../hooks/useVoteAction";
import { useLinkVotes } from "../../hooks/useLinkVotes";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../hooks/useLinks";
export interface VoteButtonIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
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
  link,
  onSuccessfullyVote,
  onFailedVote,
  children,
  ...props
}: VoteButtonProps) {
  const isAuthenticated = useIsAuthenticated();
  const {linkId:unknownLinkId} = useLinks(link);
  const { votesCount } = useLinkVotes(linkId||unknownLinkId);
  const { isVoted, isVoting, isDisabled, onVote } = useVoteAction(
    linkId||unknownLinkId, 
    link,
    {
      onSuccessfullyVote,
      onFailedVote,
    }
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
    votesCount,
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
