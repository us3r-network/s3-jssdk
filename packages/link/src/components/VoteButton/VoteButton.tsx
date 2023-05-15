import { useCallback, useEffect, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../../LinkStateProvider";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../store";
import { Button, ButtonRenderProps } from "react-aria-components";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { AriaButtonProps } from "react-aria";
import { VoteButtonChildren } from "./VoteButtonChildren";
import { useLink } from "../../hooks/useLink";

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
  const { link } = useLink(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const votingLinkIds = useStore((state) => state.votingLinkIds);
  const addOneToVotingLinkIds = useStore(
    (state) => state.addOneToVotingLinkIds
  );
  const removeOneFromVotingLinkIds = useStore(
    (state) => state.removeOneFromVotingLinkIds
  );
  const addVoteToCacheLinks = useStore((state) => state.addVoteToCacheLinks);
  const updateVoteInCacheLinks = useStore(
    (state) => state.updateVoteInCacheLinks
  );

  const findCurrUserVote = useMemo(() => {
    if (!link?.votes || !session) return null;
    return link.votes?.edges?.find(
      (edge) => edge?.node?.creator?.id === session?.id
    );
  }, [link, session]);

  const isVoted = !!findCurrUserVote && !findCurrUserVote?.node?.revoke;

  const isVoting = useMemo(
    () => votingLinkIds.has(linkId),
    [votingLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isVoting, [link, isVoting]);

  const onVote = useCallback(async () => {
    try {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      addOneToVotingLinkIds(linkId);
      if (findCurrUserVote) {
        // update vote
        const id = findCurrUserVote.node.id;
        const revoke = !findCurrUserVote.node.revoke;
        const type = revoke ? "DOWN_VOTE" : "UP_VOTE";
        await s3LinkModel?.updateVote(id, { revoke, type });
        if (onSuccessfullyVote) onSuccessfullyVote();
        // update store
        updateVoteInCacheLinks(linkId, id, {
          revoke,
          type,
          modifiedAt: new Date().toDateString(),
        });
      } else {
        // create vote
        const revoke = false;
        const type = "UP_VOTE";
        const res = await s3LinkModel?.createVote({
          linkID: linkId,
          revoke,
          type,
        });
        if (onSuccessfullyVote) onSuccessfullyVote();
        const id = res?.data?.createVote.document.id;
        if (id) {
          // update store
          addVoteToCacheLinks(linkId, {
            id,
            linkID: linkId,
            revoke,
            type,
            createAt: new Date().toDateString(),
            modifiedAt: new Date().toDateString(),
            creator: {
              id: session.id,
            },
          });
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      removeOneFromVotingLinkIds(linkId);
    }
  }, [
    isDisabled,
    session,
    s3LinkModalAuthed,
    linkId,
    findCurrUserVote,
    addOneToVotingLinkIds,
    removeOneFromVotingLinkIds,
    addVoteToCacheLinks,
    updateVoteInCacheLinks,
    onSuccessfullyVote,
  ]);

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
