import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const userLink = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinks = useStore((state) => state.cacheLinks);
  const fetchingLinkIds = useStore((state) => state.fetchingLinkIds);
  const setOneInCacheLinks = useStore((state) => state.setOneInCacheLinks);
  const addOneToFetchingLinkIds = useStore(
    (state) => state.addOneToFetchingLinkIds
  );
  const removeOneFromFetchingLinkIds = useStore(
    (state) => state.removeOneFromFetchingLinkIds
  );

  const link = useMemo(
    () => (cacheLinks.has(linkId) ? { ...cacheLinks.get(linkId) } : undefined),
    [cacheLinks, linkId]
  );

  const isFetching = useMemo(
    () => fetchingLinkIds.has(linkId),
    [fetchingLinkIds, linkId]
  );
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (isFetching) return;
      if (link) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      try {
        setErrMsg("");
        addOneToFetchingLinkIds(linkId);
        const res = await s3LinkModel.queryLink(linkId);
        const data = res.data?.node;
        if (data) {
          setOneInCacheLinks(data);
        }
      } catch (error) {
        const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingLinkIds(linkId);
      }
    })();
  }, [
    isFetching,
    link,
    s3LinkModalInitialed,
    linkId,
    setOneInCacheLinks,
    addOneToFetchingLinkIds,
    removeOneFromFetchingLinkIds,
  ]);
  return { isFetching, link, errMsg };
};
