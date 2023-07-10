import { useEffect, useMemo, useState } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { isFetchingComments, type LinkComments } from "../store/comment";

export const useLinkComments = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const s3LinkModel = getS3LinkModel();
  const { s3LinkModalInitialed } = useLinkState();

  const cacheLinkComments = useStore((state) => state.cacheLinkComments);
  const setOneInCacheLinkComments = useStore(
    (state) => state.setOneInCacheLinkComments
  );
  const addOneToFetchingCommentsLinkIds = useStore(
    (state) => state.addOneToFetchingCommentsLinkIds
  );
  const removeOneFromFetchingCommentsLinkIds = useStore(
    (state) => state.removeOneFromFetchingCommentsLinkIds
  );

  const isFetched = useMemo(
    () => cacheLinkComments.has(linkId),
    [cacheLinkComments, linkId]
  );

  const fetchingCommentsLinkIds = useStore(
    (state) => state.fetchingCommentsLinkIds
  );
  const isFetching = useMemo(
    () => fetchingCommentsLinkIds.has(linkId),
    [fetchingCommentsLinkIds, linkId]
  );

  const linkComments = useMemo(
    () => cacheLinkComments.get(linkId),
    [cacheLinkComments, linkId]
  );

  const comments = useMemo(
    () =>
      isFetching
        ? []
        : linkComments?.comments?.edges
            ?.filter((edge) => !!edge?.node && !edge.node?.revoke)
            ?.map((e) => e.node) || [],
    [isFetching, linkComments?.comments]
  );

  const commentsCount = useMemo(
    () => linkComments?.commentsCount || comments.length,
    [linkComments?.commentsCount, comments]
  );

  const [errMsg, setErrMsg] = useState("");

  const { order = "desc" } = opts || {};

  const commentsVariablesStr = useMemo(() => {
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
      if (isFetchingComments(linkId)) return;

      try {
        setErrMsg("");

        addOneToFetchingCommentsLinkIds(linkId);
        const res = await s3LinkModel.executeQuery<{
          node: LinkComments;
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
        if (data) {
          setOneInCacheLinkComments(linkId, data);
        }
      } catch (error) {
        const errMsg = (error as any)?.message;
        setErrMsg(errMsg);
      } finally {
        removeOneFromFetchingCommentsLinkIds(linkId);
      }
    })();
  }, [s3LinkModalInitialed, linkId, order, setOneInCacheLinkComments]);

  return {
    isFetching,
    isFetched,
    comments,
    commentsCount,
    errMsg,
  };
};
