import { useEffect, useMemo, useState } from "react";
import { Page } from "@ceramicnetwork/common";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { Vote, isFetchingVotes } from "../store/vote";

export const useLinkVotes = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkVotes = useStore((state) => state.cacheLinkVotes);
  const setOneInCacheLinkVotes = useStore(
    (state) => state.setOneInCacheLinkVotes
  );
  const addOneToFetchingVotesLinkIds = useStore(
    (state) => state.addOneToFetchingVotesLinkIds
  );
  const removeOneFromFetchingVotesLinkIds = useStore(
    (state) => state.removeOneFromFetchingVotesLinkIds
  );

  const isFetched = useMemo(
    () => cacheLinkVotes.has(linkId),
    [cacheLinkVotes, linkId]
  );

  const fetchingVotesLinkIds = useStore((state) => state.fetchingVotesLinkIds);
  const isFetching = useMemo(
    () => fetchingVotesLinkIds.has(linkId),
    [fetchingVotesLinkIds, linkId]
  );

  const linkVotes = useMemo(
    () => cacheLinkVotes.get(linkId),
    [cacheLinkVotes, linkId]
  );

  const votes = useMemo(
    () =>
      isFetching
        ? []
        : linkVotes?.votes?.filter((item) => !!item && !item?.revoke) || [],
    [isFetching, linkVotes?.votes]
  );

  const votesCount = useMemo(
    () => linkVotes?.votesCount || votes.length,
    [linkVotes?.votesCount, votes]
  );

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      if (isFetched) return;
      if (isFetchingVotes(linkId)) return;

      try {
        setErrMsg("");

        addOneToFetchingVotesLinkIds(linkId);
        const res = await s3LinkModel.executeQuery<{
          node: {
            votes: Page<Vote>;
            votesCount: number;
          };
        }>(`
          query {
            node(id: "${linkId}") {
              ...on Link {
                votesCount
                votes (first: 1000) {
                  edges {
                    node {
                      id
                      linkID
                      type
                      revoke
                      createAt
                      modifiedAt
                      creator {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        `);

        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const data = res.data?.node;
        const votes =
          data?.votes?.edges
            ?.map((edge) => edge?.node)
            ?.filter((node) => !!node) || [];
        const votesCount = data?.votesCount || 0;
        setOneInCacheLinkVotes(linkId, {
          votes,
          votesCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingVotesLinkIds(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, isFetched]);

  return { votes, votesCount, isFetching, isFetched, errMsg };
};
