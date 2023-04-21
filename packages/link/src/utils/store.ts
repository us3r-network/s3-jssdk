import { Link } from "../data-model";

type MakeFieldsRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export function linkDataFieldFilling(link: Link) {
  if (!link.favors) {
    link["favors"] = {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: "",
      },
    };
  }
  if (!link.favorsCount === undefined) {
    link["favorsCount"] = 0;
  }
  if (!link.votes) {
    link["votes"] = {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: "",
        endCursor: "",
      },
    };
  }
  if (link.votesCount === undefined) {
    link["votesCount"] = 0;
  }
  return link as MakeFieldsRequired<
    Link,
    "favors" | "favorsCount" | "votes" | "votesCount"
  >;
}
