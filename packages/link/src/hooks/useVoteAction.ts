import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLink } from "./useLink";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export const useVoteAction = (
  linkId: string,
  onSuccessfullyVote?: () => void
) => {
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
      if (!isAuthenticated || !session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      addOneToVotingLinkIds(linkId);
      if (findCurrUserVote) {
        // update vote
        const id = findCurrUserVote.node.id;
        const revoke = !findCurrUserVote.node.revoke;
        const type = revoke ? "DOWN_VOTE" : "UP_VOTE";
        const res = await s3LinkModel?.updateVote(id, { revoke, type });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
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
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
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
      if (onSuccessfullyVote) onSuccessfullyVote();
    } catch (error) {
      console.error(error);
    } finally {
      removeOneFromVotingLinkIds(linkId);
    }
  }, [
    isDisabled,
    isAuthenticated,
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

  return { isVoted, isVoting, isDisabled, onVote };
};
