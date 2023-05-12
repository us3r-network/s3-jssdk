import { Link } from "../data-model";

type MakeFieldsRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type LinkDataFieldFillingResult = MakeFieldsRequired<
  Link,
  | "favors"
  | "favorsCount"
  | "votes"
  | "votesCount"
  | "comments"
  | "commentsCount"
  | "scores"
  | "scoresCount"
>;
export function getLinkListFieldDefaultData() {
  return {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: "",
      endCursor: "",
    },
  };
}
export function linkDataFieldFilling(link: Link) {
  if (!link.favors) {
    link["favors"] = getLinkListFieldDefaultData();
  }
  if (!link.favorsCount === undefined) {
    link["favorsCount"] = 0;
  }
  if (!link.votes) {
    link["votes"] = getLinkListFieldDefaultData();
  }
  if (link.votesCount === undefined) {
    link["votesCount"] = 0;
  }
  if (!link.comments) {
    link["comments"] = getLinkListFieldDefaultData();
  }
  if (link.commentsCount === undefined) {
    link["commentsCount"] = 0;
  }
  if (!link.scores) {
    link["scores"] = getLinkListFieldDefaultData();
  }
  if (link.scoresCount === undefined) {
    link["scoresCount"] = 0;
  }
  return link as LinkDataFieldFillingResult;
}
