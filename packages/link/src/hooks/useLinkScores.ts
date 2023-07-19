import { useEffect, useMemo } from "react";
import { Page } from "@ceramicnetwork/common";
import { Score } from "@us3r-network/data-model";
import isEqual from "lodash.isequal";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const useLinkScores = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkScores = useStore((state) => state.cacheLinkScores);
  const upsertOneInCacheLinkScores = useStore(
    (state) => state.upsertOneInCacheLinkScores
  );

  const linkScores = useMemo(
    () => cacheLinkScores.get(linkId),
    [cacheLinkScores, linkId]
  );

  const isFetched = useMemo(
    () => linkScores?.status === "success",
    [linkScores?.status]
  );

  const isFetching = useMemo(
    () => linkScores?.status === "loading",
    [linkScores?.status]
  );

  const isFetchFailed = useMemo(
    () => linkScores?.status === "error",
    [linkScores?.status]
  );

  const errMsg = useMemo(() => linkScores?.errMsg || "", [linkScores?.errMsg]);

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

  const { order = "desc" } = opts || {};

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const linkScores = useStore.getState().cacheLinkScores.get(linkId);
      const oldParams = linkScores?.params;
      const params = {
        order: opts?.order || "desc",
      };

      if (!!linkScores && !!oldParams) {
        if (!opts || isEqual(oldParams, params)) {
          return;
        }
      }

      try {
        upsertOneInCacheLinkScores(linkId, {
          params,
          status: "loading",
          errMsg: "",
        });

        const variables: any = {};
        if (params.order === "desc") {
          Object.assign(variables, {
            last: 1000,
          });
        }
        if (params.order === "asc") {
          Object.assign(variables, {
            first: 1000,
          });
        }
        const scoresVariablesStr = Object.keys(variables)
          .map((key) => {
            return `${key}: ${variables[key]}`;
          })
          .join(", ");

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
        // TODO Last cannot be set to sort in reverse, manually flip the data here
        if (params.order === "desc") scores.reverse();
        upsertOneInCacheLinkScores(linkId, {
          status: "success",
          scores,
          scoresCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        upsertOneInCacheLinkScores(linkId, {
          status: "error",
          errMsg,
        });
      }
    })();
  }, [s3LinkModalInitialed, linkId, opts]);

  return {
    scores,
    scoresCount,
    isFetching,
    isFetched,
    isFetchFailed,
    errMsg,
  };
};
