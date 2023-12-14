/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-14 17:45:20
 * @FilePath: /s3-jssdk/packages/link/src/hooks/useLinkVotes.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { useEffect, useMemo } from "react";
import { Page } from "@ceramicnetwork/common";
import { Vote } from "@us3r-network/data-model";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const useLinkVotes = (linkId: string) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkVotes = useStore((state) => state.cacheLinkVotes);
  const upsertOneInCacheLinkVotes = useStore(
    (state) => state.upsertOneInCacheLinkVotes
  );

  const linkVotes = useMemo(
    () => cacheLinkVotes.get(linkId),
    [cacheLinkVotes, linkId]
  );

  const isFetched = useMemo(
    () => linkVotes?.status === "success",
    [linkVotes?.status]
  );

  const isFetching = useMemo(
    () => linkVotes?.status === "loading",
    [linkVotes?.status]
  );

  const isFetchFailed = useMemo(
    () => linkVotes?.status === "error",
    [linkVotes?.status]
  );

  const errMsg = useMemo(() => linkVotes?.errMsg || "", [linkVotes?.errMsg]);

  const votes = useMemo(
    () =>
      isFetching
        ? []
        : linkVotes?.votes?.filter((item) => !!item && !item?.revoke) || [],
    [isFetching, linkVotes?.votes]
  );

  const votesCount = useMemo(
    () => linkVotes?.votesCount || votes.length,
    [linkVotes?.votesCount, votes]
  );

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const linkVotes = useStore.getState().cacheLinkVotes.get(linkId);
      if (!!linkVotes) return;

      try {
        upsertOneInCacheLinkVotes(linkId, {
          status: "loading",
          errMsg: "",
        });
        const res = await s3LinkModel.queryLinkVotes({linkId});

        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const data = res.data?.node;
        const votes =
          data?.votes?.edges
            ?.map((edge) => edge?.node)
            ?.filter((node) => !!node) || [];
        const votesCount = data?.votesCount || 0;
        upsertOneInCacheLinkVotes(linkId, {
          status: "success",
          votes,
          votesCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        upsertOneInCacheLinkVotes(linkId, {
          status: "error",
          errMsg,
        });
      }
    })();
  }, [s3LinkModalInitialed, linkId]);

  return { votes, votesCount, isFetching, isFetched, isFetchFailed, errMsg };
};
