import { ButtonHTMLAttributes, useCallback, useEffect, useMemo } from "react";
import ButtonLoading from "../common/ButtonLoading/ButtonLoading";
import { getS3LinkModel, useLinkState } from "../../LinkStateProvider";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../store";

export type VoteButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  linkId: string;
  className?: string;
  loadingClassName?: string;
  upvoteClassName?: string;
  downvoteClassName?: string;
  countClassName?: string;
};

export default function VoteButton({
  linkId,
  className = "us3r-VoteButton",
  loadingClassName = "us3r-VoteButton__loading",
  upvoteClassName = "us3r-VoteButton__upvote",
  downvoteClassName = "us3r-VoteButton__downvote",
  countClassName = "us3r-VoteButton__count",
  ...props
}: VoteButtonProps) {
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
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
  const isVoted = findCurrUserVote && !findCurrUserVote?.node?.revoke;
  return (
    <button onClick={onVote} className={className} {...props}>
      {(loading && <ButtonLoading className={loadingClassName} />) || (
        <>
          {isVoted ? (
            <VoteWhiteIcon className={upvoteClassName} />
          ) : (
            <VoteIcon className={downvoteClassName} />
          )}
        </>
      )}
      <span>{link?.votesCount || 0}</span>
    </button>
  );
}

function VoteIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none" />
      <path d="M9 21h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.58 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2zM9 9l4.34-4.34L12 10h9v2l-3 7H9V9zM1 9h4v12H1z" />
    </svg>
  );
}

function VoteWhiteIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M18 21H8V8l7-7 1.25 1.25q.175.175.288.475.112.3.112.575v.35L15.55 8H21q.8 0 1.4.6.6.6.6 1.4v2q0 .175-.038.375-.037.2-.112.375l-3 7.05q-.225.5-.75.85T18 21ZM6 8v13H2V8Z" />
    </svg>
  );
}
