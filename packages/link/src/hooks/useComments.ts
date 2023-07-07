import { useMemo } from "react";
import { useLinkComments } from "./useLinkComments";

export const useComments = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const { isFetching, linkComments } = useLinkComments(linkId);
  const { order = "asc" } = opts || {};

  const comments = useMemo(
    () =>
      (isFetching
        ? []
        : linkComments?.comments?.edges
            ?.filter((edge) => !!edge?.node && !edge.node?.revoke)
            ?.map((e) => e.node) || []
      ).sort((a, b) => {
        const aTime = new Date(a.createAt).getTime();
        const bTime = new Date(b.createAt).getTime();
        if (order === "asc") {
          return aTime - bTime;
        } else {
          return bTime - aTime;
        }
      }),
    [isFetching, linkComments?.comments]
  );

  const commentsCount = useMemo(
    () => linkComments?.commentsCount || comments.length,
    [linkComments?.commentsCount, comments]
  );

  return { isFetching, comments, commentsCount };
};
