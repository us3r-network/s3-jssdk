import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import type { LinkFavors } from "../store/favor";
const fetchingFavorsLinkIds = new Set();
const fetchedFavorsLinkIds = new Set();

export const useLinkFavors = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkFavors = useStore((state) => state.cacheLinkFavors);
  const setOneInCacheLinkFavors = useStore(
    (state) => state.setOneInCacheLinkFavors
  );
  const linkFavors = useMemo(
    () => cacheLinkFavors.get(linkId),
    [cacheLinkFavors, linkId]
  );
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      if (fetchingFavorsLinkIds.has(linkId)) return;
      if (fetchedFavorsLinkIds.has(linkId)) return;

      try {
        setErrMsg("");

        fetchingFavorsLinkIds.add(linkId);
        const res = await s3LinkModel.executeQuery<{
          node: LinkFavors;
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
        if (data) {
          setOneInCacheLinkFavors(linkId, data);
        }
        fetchingFavorsLinkIds.delete(linkId);
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        fetchedFavorsLinkIds.add(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, setOneInCacheLinkFavors]);

  return { linkFavors, errMsg };
};
