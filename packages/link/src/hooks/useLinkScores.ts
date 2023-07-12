import { useEffect, useMemo, useState } from "react";
import { Page } from "@ceramicnetwork/common";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { Score, isFetchingScores } from "../store/score";

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
        : linkScores?.scores?.filter((item) => !!item && !item?.revoke) || [],
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
          node: {
            scores: Page<Score>;
            scoresCount: number;
          };
        }>(`
          query {
            node(id: "${linkId}") {
              ...on Link {
                scoresCount
                scores (${scoresVariablesStr}) {
                  edges {
                    node {
                      id
                      text
                      value
                      linkID
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
        const scores =
          data?.scores?.edges
            ?.map((edge) => edge?.node)
            ?.filter((node) => !!node) || [];
        const scoresCount = data?.scoresCount || 0;
        setOneInCacheLinkScores(linkId, {
          scores,
          scoresCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingScoresLinkIds(linkId);
      }
    })();
  }, [
    s3LinkModalInitialed,
    linkId,
    scoresVariablesStr,
    setOneInCacheLinkScores,
  ]);

  return {
    isFetching,
    isFetched,
    scores,
    scoresCount,
    errMsg,
  };
};
