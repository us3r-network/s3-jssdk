import { useLink } from "./useLink";

export const useComments = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const { isFetching, link } = useLink(linkId);
  const { order = "asc" } = opts || {};

  const comments = (
    isFetching ? [] : link?.comments?.edges?.map((e) => e.node) || []
  ).sort((a, b) => {
    const aTime = new Date(a.createAt).getTime();
    const bTime = new Date(b.createAt).getTime();
    if (order === "asc") {
      return aTime - bTime;
    } else {
      return bTime - aTime;
    }
  });

  const commentsCount = link?.commentsCount || 0;

  return { isFetching, comments, commentsCount };
};
