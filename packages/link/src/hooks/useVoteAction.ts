import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useLinkVotes } from "./useLinkVotes";

export const useVoteAction = (
  linkId: string,
  opts?: {
    onSuccessfullyVote?: (isVoted: boolean) => void;
    onFailedVote?: (errMsg: string) => void;
  }
) => {
  const { votes, isFetched } = useLinkVotes(linkId);
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
  const addVoteToCacheLinkVotes = useStore(
    (state) => state.addVoteToCacheLinkVotes
  );
  const updateVoteInCacheLinkVotes = useStore(
    (state) => state.updateVoteInCacheLinkVotes
  );

  const findCurrUserVote = useMemo(
    () =>
      !session
        ? null
        : votes?.find((node) => node?.creator?.id === session?.id),
    [votes, session]
  );

  const isVoted = useMemo(
    () => !!findCurrUserVote && !findCurrUserVote?.revoke,
    [findCurrUserVote]
  );

  const isVoting = useMemo(
    () => votingLinkIds.has(linkId),
    [votingLinkIds, linkId]
  );

  const isDisabled = useMemo(
    () => !isFetched || isVoting,
    [isFetched, isVoting]
  );

  const onVote = useCallback(async () => {
    if (isDisabled) return;
    if (!isAuthenticated || !session || !s3LinkModalAuthed) {
      signIn();
      return;
    }
    try {
      addOneToVotingLinkIds(linkId);
      if (findCurrUserVote) {
        // update vote
        const id = findCurrUserVote.id;
        const revoke = !findCurrUserVote.revoke;
        const type = revoke ? "DOWN_VOTE" : "UP_VOTE";
        const res = await s3LinkModel?.updateVote(id, { revoke, type });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        // update store
        updateVoteInCacheLinkVotes(linkId, id, {
          revoke,
          type,
          modifiedAt: new Date().toDateString(),
        });
        if (opts?.onSuccessfullyVote) opts.onSuccessfullyVote(!revoke);
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
          addVoteToCacheLinkVotes(linkId, {
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
        if (opts?.onSuccessfullyVote) opts.onSuccessfullyVote(!revoke);
      }
    } catch (error) {
      const errMsg = (error as any)?.message;
      if (opts?.onFailedVote) opts.onFailedVote(errMsg);
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
    addVoteToCacheLinkVotes,
    updateVoteInCacheLinkVotes,
    opts?.onSuccessfullyVote,
    opts?.onFailedVote,
  ]);

  return { isVoted, isVoting, isDisabled, onVote };
};
