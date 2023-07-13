import { useEffect, useMemo } from "react";
import { Page } from "@ceramicnetwork/common";
import { Favor } from "@us3r-network/data-model";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const useLinkFavors = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkFavors = useStore((state) => state.cacheLinkFavors);
  const upsertOneInCacheLinkFavors = useStore(
    (state) => state.upsertOneInCacheLinkFavors
  );

  const linkFavors = useMemo(
    () => cacheLinkFavors.get(linkId),
    [cacheLinkFavors, linkId]
  );

  const isFetched = useMemo(
    () => linkFavors?.status === "success",
    [linkFavors?.status]
  );

  const isFetching = useMemo(
    () => linkFavors?.status === "loading",
    [linkFavors?.status]
  );

  const isFetchFailed = useMemo(
    () => linkFavors?.status === "error",
    [linkFavors?.status]
  );

  const errMsg = useMemo(() => linkFavors?.errMsg || "", [linkFavors?.errMsg]);

  const favors = useMemo(
    () =>
      isFetching
        ? []
        : linkFavors?.favors?.filter((item) => !!item && !item?.revoke) || [],
    [isFetching, linkFavors?.favors]
  );

  const favorsCount = useMemo(
    () => linkFavors?.favorsCount || favors.length,
    [linkFavors?.favorsCount, favors]
  );

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const linkFavors = useStore.getState().cacheLinkFavors.get(linkId);
      if (!!linkFavors) return;

      try {
        upsertOneInCacheLinkFavors(linkId, {
          status: "loading",
          errMsg: "",
        });
        const res = await s3LinkModel.executeQuery<{
          node: {
            favors: Page<Favor>;
            favorsCount: number;
          };
        }>(`
          query {
            node(id: "${linkId}") {
              ...on Link {
                favorsCount
                favors (first: 1000) {
                  edges {
                    node {
                      id
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
        const favors =
          data?.favors?.edges
            ?.map((edge) => edge?.node)
            ?.filter((node) => !!node) || [];
        const favorsCount = data?.favorsCount || 0;
        upsertOneInCacheLinkFavors(linkId, {
          status: "success",
          favors,
          favorsCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        upsertOneInCacheLinkFavors(linkId, {
          status: "error",
          errMsg,
        });
      }
    })();
  }, [s3LinkModalInitialed, linkId]);

  return { favors, favorsCount, isFetching, isFetched, isFetchFailed, errMsg };
};
