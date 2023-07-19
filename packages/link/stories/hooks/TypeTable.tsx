import {
  useLinkState,
  useVoteAction,
  useLinkVotes,
  useFavorAction,
  useLinkFavors,
  useCommentAction,
  useLinkComments,
  useScoreAction,
  useLinkScores,
  usePersonalFavors,
  usePersonalScores,
} from "../../src/index";

// useLinkState
export const UseLinkStateReturns = (
  props: Partial<ReturnType<typeof useLinkState>>
) => {};

// useVoteAction
export const UseVoteActionArgs = (
  props: Omit<Parameters<typeof useVoteAction>, "length">
) => {};
export const UseVoteActionReturns = (
  props: Partial<ReturnType<typeof useVoteAction>>
) => {};
// useLinkVotes
export const UseLinkVotesArgs = (
  props: Omit<Parameters<typeof useLinkVotes>, "length">
) => {};
export const UseLinkVotesReturns = (
  props: Partial<ReturnType<typeof useLinkVotes>>
) => {};

// useFavorAction
export const UseFavorActionArgs = (
  props: Omit<Parameters<typeof useFavorAction>, "length">
) => {};
export const UseFavorActionReturns = (
  props: Partial<ReturnType<typeof useFavorAction>>
) => {};
// useLinkFavors
export const UseLinkFavorsArgs = (
  props: Omit<Parameters<typeof useLinkFavors>, "length">
) => {};
export const UseLinkFavorsReturns = (
  props: Partial<ReturnType<typeof useLinkFavors>>
) => {};

// useCommentAction
export const UseCommentActionArgs = (
  props: Omit<Parameters<typeof useCommentAction>, "length">
) => {};
export const UseCommentActionReturns = (
  props: Partial<ReturnType<typeof useCommentAction>>
) => {};
// useLinkComments
export const UseLinkCommentsArgs = (
  props: Omit<Parameters<typeof useLinkComments>, "length">
) => {};
export const UseLinkCommentsReturns = (
  props: Partial<ReturnType<typeof useLinkComments>>
) => {};

// useScoreAction
export const UseScoreActionArgs = (
  props: Omit<Parameters<typeof useScoreAction>, "length">
) => {};
export const UseScoreActionReturns = (
  props: Partial<ReturnType<typeof useScoreAction>>
) => {};
// useLinkScores
export const UseLinkScoresArgs = (
  props: Omit<Parameters<typeof useLinkScores>, "length">
) => {};
export const UseLinkScoresReturns = (
  props: Partial<ReturnType<typeof useLinkScores>>
) => {};

// usePersonalFavors
export const UsePersonalFavorsArgs = (
  props: Omit<Parameters<typeof usePersonalFavors>, "length">
) => {};
export const UsePersonalFavorsReturns = (
  props: Partial<ReturnType<typeof usePersonalFavors>>
) => {};

// usePersonalScores
export const UsePersonalScoresArgs = (
  props: Omit<Parameters<typeof usePersonalScores>, "length">
) => {};
export const UsePersonalScoresReturns = (
  props: Partial<ReturnType<typeof usePersonalScores>>
) => {};
