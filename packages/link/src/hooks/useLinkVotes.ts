import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import type { LinkVotes } from "../store/vote";

const fetchingVotesLinkIds = new Set();
const fetchedVotesLinkIds = new Set();

export const useLinkVotes = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkVotes = useStore((state) => state.cacheLinkVotes);
  const setOneInCacheLinkVotes = useStore(
    (state) => state.setOneInCacheLinkVotes
  );
  const linkVotes = useMemo(
    () => cacheLinkVotes.get(linkId),
    [cacheLinkVotes, linkId]
  );
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      if (fetchingVotesLinkIds.has(linkId)) return;
      if (fetchedVotesLinkIds.has(linkId)) return;

      try {
        setErrMsg("");

        fetchingVotesLinkIds.add(linkId);
        const res = await s3LinkModel.executeQuery<{
          node: LinkVotes;
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
        if (data) {
          setOneInCacheLinkVotes(linkId, data);
        }
        fetchedVotesLinkIds.add(linkId);
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        fetchingVotesLinkIds.delete(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, setOneInCacheLinkVotes]);

  return { linkVotes, errMsg };
};
