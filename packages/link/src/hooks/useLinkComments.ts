import { useEffect, useMemo } from "react";
import { Page } from "@ceramicnetwork/common";
import { Comment } from "@us3r-network/data-model";
import isEqual from "lodash.isequal";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { OrderType } from "../store/types";

export const useLinkComments = (
  linkId: string,
  opts?: {
    order?: OrderType;
  }
) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkComments = useStore((state) => state.cacheLinkComments);
  const upsertOneInCacheLinkComments = useStore(
    (state) => state.upsertOneInCacheLinkComments
  );

  const linkComments = useMemo(
    () => cacheLinkComments.get(linkId),
    [cacheLinkComments, linkId]
  );

  const isFetched = useMemo(
    () => linkComments?.status === "success",
    [linkComments?.status]
  );

  const isFetching = useMemo(
    () => linkComments?.status === "loading",
    [linkComments?.status]
  );

  const isFetchFailed = useMemo(
    () => linkComments?.status === "error",
    [linkComments?.status]
  );

  const errMsg = useMemo(
    () => linkComments?.errMsg || "",
    [linkComments?.errMsg]
  );

  const comments = useMemo(
    () =>
      isFetching
        ? []
        : linkComments?.comments?.filter((item) => !!item && !item?.revoke) ||
          [],
    [isFetching, linkComments?.comments]
  );

  const commentsCount = useMemo(
    () => linkComments?.commentsCount || comments.length,
    [linkComments?.commentsCount, comments]
  );

  useEffect(() => {
    (async () => {
      if (!linkId) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const linkComments = useStore.getState().cacheLinkComments.get(linkId);
      const oldParams = linkComments?.params;
      const params = {
        order: opts?.order || "desc",
      };

      if (!!linkComments && !!oldParams) {
        if (!opts || isEqual(oldParams, params)) {
          return;
        }
      }

      try {
        upsertOneInCacheLinkComments(linkId, {
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
        const commentsVariablesStr = Object.keys(variables)
          .map((key) => {
            return `${key}: ${variables[key]}`;
          })
          .join(", ");

        const res = await s3LinkModel.executeQuery<{
          node: {
            comments: Page<Comment>;
            commentsCount: number;
          };
        }>(`
          query {
            node(id: "${linkId}") {
              ...on Link {
                commentsCount
                comments (${commentsVariablesStr}) {
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
        const comments =
          data?.comments?.edges
            ?.map((edge) => edge?.node)
            ?.filter((node) => !!node) || [];
        const commentsCount = data?.commentsCount || 0;
        // TODO Last cannot be set to sort in reverse, manually flip the data here
        if (params.order === "desc") comments.reverse();
        upsertOneInCacheLinkComments(linkId, {
          status: "success",
          comments,
          commentsCount,
        });
      } catch (error) {
        const errMsg = (error as any)?.message;
        upsertOneInCacheLinkComments(linkId, {
          status: "error",
          errMsg,
        });
      }
    })();
  }, [s3LinkModalInitialed, linkId, opts]);

  return {
    comments,
    commentsCount,
    isFetching,
    isFetched,
    isFetchFailed,
    errMsg,
  };
};
