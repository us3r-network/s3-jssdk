import { useMemo } from "react";
import { getScoresFromLink } from "../utils/score";
import { useLink } from "./useLink";

export const useScores = (
  linkId: string,
  opts?: {
    order: "asc" | "desc";
  }
) => {
  const { isFetching, link } = useLink(linkId);
  const { order = "asc" } = opts || {};

  const scores = useMemo(
    () =>
      (!isFetching && link ? getScoresFromLink(link) : []).sort((a, b) => {
        const aTime = a?.createAt ? new Date(a.createAt).getTime() : 0;
        const bTime = b?.createAt ? new Date(b.createAt).getTime() : 0;
        if (order === "asc") {
          return aTime - bTime;
        } else {
          return bTime - aTime;
        }
      }),
    [isFetching, link?.scores, order]
  );

  const scoresCount = useMemo(
    () => link?.scoresCount || 0,
    [link?.scoresCount]
  );

  return { isFetching, scores, scoresCount };
};
