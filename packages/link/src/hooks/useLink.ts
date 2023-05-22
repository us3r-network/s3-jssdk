import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const useLink = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinks = useStore((state) => state.cacheLinks);
  const fetchingLinkIds = useStore((state) => state.fetchingLinkIds);
  const blockFetchLinkIds = useStore((state) => state.blockFetchLinkIds);
  const setOneInCacheLinks = useStore((state) => state.setOneInCacheLinks);
  const addOneToFetchingLinkIds = useStore(
    (state) => state.addOneToFetchingLinkIds
  );
  const removeOneFromFetchingLinkIds = useStore(
    (state) => state.removeOneFromFetchingLinkIds
  );
  const addOneToBlockFetchLinkIds = useStore(
    (state) => state.addOneToBlockFetchLinkIds
  );
  const link = cacheLinks.get(linkId);

  const isFetching = fetchingLinkIds.has(linkId);
  const isBlockFetch = blockFetchLinkIds.has(linkId);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    (async () => {
      if (isBlockFetch) return;
      if (isFetching) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;

      try {
        setErrMsg("");
        addOneToFetchingLinkIds(linkId);
        const res = await s3LinkModel.queryLink(linkId);
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const data = res.data?.node;
        if (data) {
          setOneInCacheLinks(data);
        }
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        addOneToBlockFetchLinkIds(linkId);
        removeOneFromFetchingLinkIds(linkId);
      }
    })();
  }, [
    isFetching,
    isBlockFetch,
    s3LinkModalInitialed,
    linkId,
    setOneInCacheLinks,
    addOneToFetchingLinkIds,
    removeOneFromFetchingLinkIds,
  ]);

  return { isFetching, link, errMsg };
};
