import { useEffect, useMemo, useState } from "react";
import { Page } from "@ceramicnetwork/common";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { Favor, isFetchingFavors } from "../store/favor";

export const useLinkFavors = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkFavors = useStore((state) => state.cacheLinkFavors);
  const setOneInCacheLinkFavors = useStore(
    (state) => state.setOneInCacheLinkFavors
  );
  const addOneToFetchingFavorsLinkIds = useStore(
    (state) => state.addOneToFetchingFavorsLinkIds
  );
  const removeOneFromFetchingFavorsLinkIds = useStore(
    (state) => state.removeOneFromFetchingFavorsLinkIds
  );

  const isFetched = useMemo(
    () => cacheLinkFavors.has(linkId),
    [cacheLinkFavors, linkId]
  );

  const fetchingFavorsLinkIds = useStore(
    (state) => state.fetchingFavorsLinkIds
  );
  const isFetching = useMemo(
    () => fetchingFavorsLinkIds.has(linkId),
    [fetchingFavorsLinkIds, linkId]
  );

  const linkFavors = useMemo(
    () => cacheLinkFavors.get(linkId),
    [cacheLinkFavors, linkId]
  );

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

  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      if (isFetched) return;
      if (isFetchingFavors(linkId)) return;

      try {
        setErrMsg("");

        addOneToFetchingFavorsLinkIds(linkId);
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
        if (favors.length > 0) {
          setOneInCacheLinkFavors(linkId, {
            favors,
            favorsCount,
          });
        }
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingFavorsLinkIds(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, isFetched]);

  return { favors, favorsCount, isFetching, isFetched, errMsg };
};
