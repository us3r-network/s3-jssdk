/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-12-12 17:35:33
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 15:29:23
 * @FilePath: /s3-jssdk/packages/link/src/hooks/useLinkFavors.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useMemo } from "react";
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
        const res = await s3LinkModel.queryLinkFavors({linkId});
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
