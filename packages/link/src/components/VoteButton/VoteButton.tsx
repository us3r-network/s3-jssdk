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
import { VoteButtonChildren } from "./default-ui/VoteButtonChildren";

export interface VoteButtonIncomingProps {
  linkId: string;
}
export interface VoteButtonRenderProps {
  isAuthenticated: boolean;
  isVoted: boolean;
  loading: boolean;
  votesCount: number;
}
export interface VoteButtonProps
  extends ChildrenRenderProps<
      AriaButtonProps,
      ButtonRenderProps & VoteButtonRenderProps
    >,
    VoteButtonIncomingProps {}

export function VoteButton({ linkId, children, ...props }: VoteButtonProps) {
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalInitialed, s3LinkModalAuthed } = useLinkState();

  const cacheLinks = useStore((state) => state.cacheLinks);
  const votingLinkIds = useStore((state) => state.votingLinkIds);
  const setOneInCacheLinks = useStore((state) => state.setOneInCacheLinks);
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

  const link = useMemo(() => cacheLinks.get(linkId), [cacheLinks, linkId]);

  const loading = useMemo(
    () => votingLinkIds.has(linkId),
    [votingLinkIds, linkId]
  );

  useEffect(() => {
    (async () => {
      if (loading) return;
      if (link) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const res = await s3LinkModel.queryLink(linkId);
      const data = res.data?.node;
      if (!data) return;
      setOneInCacheLinks(data);
    })();
  }, [loading, link, s3LinkModalInitialed, linkId, setOneInCacheLinks]);

  const findCurrUserVote = useMemo(() => {
    if (!link || !session) return null;
    return link.votes?.edges?.find(
      (edge) => edge?.node?.creator?.id === session?.id
    );
  }, [link, session]);

  const onVote = useCallback(async () => {
    try {
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      if (!link) return;
      addOneToVotingLinkIds(linkId);
      if (findCurrUserVote) {
        // update vote
        const id = findCurrUserVote.node.id;
        const revoke = !findCurrUserVote.node.revoke;
        const type = revoke ? "DOWN_VOTE" : "UP_VOTE";
        await s3LinkModel?.updateVote(id, { revoke, type });
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
    session,
    s3LinkModalAuthed,
    link,
    linkId,
    findCurrUserVote,
    addOneToVotingLinkIds,
    removeOneFromVotingLinkIds,
    addVoteToCacheLinks,
    updateVoteInCacheLinks,
  ]);
  const isVoted = !!findCurrUserVote && !findCurrUserVote?.node?.revoke;

  const businessProps = {
    "data-us3r-votebutton": "",
    "data-authenticated": isAuthenticated || undefined,
    "data-voted": isVoted || undefined,
    "data-loading": loading || undefined,
    onClick: onVote,
  };

  const businessRenderProps = {
    isAuthenticated,
    isVoted,
    loading,
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
