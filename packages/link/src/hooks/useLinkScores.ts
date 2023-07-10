import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { isFetchingScores, type LinkScores } from "../store/score";

export const useLinkScores = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkScores = useStore((state) => state.cacheLinkScores);
  const setOneInCacheLinkScores = useStore(
    (state) => state.setOneInCacheLinkScores
  );
  const addOneToFetchingScoresLinkIds = useStore(
    (state) => state.addOneToFetchingScoresLinkIds
  );
  const removeOneFromFetchingScoresLinkIds = useStore(
    (state) => state.removeOneFromFetchingScoresLinkIds
  );

  const isFetched = useMemo(
    () => cacheLinkScores.has(linkId),
    [cacheLinkScores, linkId]
  );

  const fetchingScoresLinkIds = useStore(
    (state) => state.fetchingScoresLinkIds
  );
  const isFetching = useMemo(
    () => fetchingScoresLinkIds.has(linkId),
    [fetchingScoresLinkIds, linkId]
  );

  const linkScores = useMemo(
    () => cacheLinkScores.get(linkId),
    [cacheLinkScores, linkId]
  );

  const scores = useMemo(
    () =>
      isFetching
        ? []
        : linkScores?.scores?.edges
            ?.filter((edge) => !!edge?.node && !edge.node?.revoke)
            ?.map((e) => e.node) || [],
    [isFetching, linkScores?.scores]
  );

  const scoresCount = useMemo(
    () => linkScores?.scoresCount || scores.length,
    [linkScores?.scoresCount, scores]
  );

  const [errMsg, setErrMsg] = useState("");

  const { order = "desc" } = opts || {};

  const scoresVariablesStr = useMemo(() => {
    const variables: any = {};
    if (order === "desc") {
      Object.assign(variables, {
        last: 1000,
      });
    }
    if (order === "asc") {
      Object.assign(variables, {
        first: 1000,
      });
    }
    return Object.keys(variables)
      .map((key) => {
        return `${key}: ${variables[key]}`;
      })
      .join(", ");
  }, [order]);

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      if (isFetched) return;
      if (isFetchingScores(linkId)) return;

      try {
        setErrMsg("");

        addOneToFetchingScoresLinkIds(linkId);
        const res = await s3LinkModel.executeQuery<{
          node: LinkScores;
        }>(`
          query {
            node(id: "${linkId}") {
              ...on Link {
                scoresCount
                scores (${scoresVariablesStr}) {
                  edges {
                    node {
                      id
                      linkID
                      text
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
          setOneInCacheLinkScores(linkId, data);
        }
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingScoresLinkIds(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, order, setOneInCacheLinkScores]);

  return {
    isFetching,
    isFetched,
    scores,
    scoresCount,
    errMsg,
  };
};
