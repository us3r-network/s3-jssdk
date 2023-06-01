import { useMemo } from "react";
import { useLink } from "./useLink";

export const useComments = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const { isFetching, link } = useLink(linkId);
  const { order = "asc" } = opts || {};

  const comments = useMemo(
    () =>
      (isFetching
        ? []
        : link?.comments?.edges
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
    [isFetching, link?.comments]
  );

  const commentsCount = useMemo(
    () => link?.commentsCount || comments.length,
    [link?.commentsCount, comments]
  );

  return { isFetching, comments, commentsCount };
};
