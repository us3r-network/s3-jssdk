import { Page } from "@ceramicnetwork/common";
import {
  Link,
  LinkField,
  VoteType,
  Vote,
  VoteInput,
  Favor,
  FavorInput,
  ScoreInput,
  Score,
  Comment,
  CommentInput,
} from "../../src/link/index";
// import type { ExecutionResult } from "graphql";

type GraphqlResult<T> = {
  data?: T;
  error?: { message: string }[];
};

export const ExecuteQueryReturns = (props: GraphqlResult<any>) => {};

export const CreateLinkParams = (
  props: Partial<Pick<Link, "url" | "data" | "type" | "title">>
) => {};

export const CreateLinkReturns = (
  props: GraphqlResult<{
    createLink: { document: { id: string } };
  }>
) => {};

export const UpdateLinkReturns = (
  props: GraphqlResult<{
    updateLink: { document: { id: string } };
  }>
) => {};

export const QueryLinkField = (
  props: Partial<{ linkId: string; LinkField: LinkField[] }>
) => {};

export const QueryLinkReturns = (
  props: GraphqlResult<{
    node: Link;
  }>
) => {};

export const QueryPersonalLinkReturns = (
  props: GraphqlResult<{
    viewer: {
      linkList: Page<Link>;
    };
  }>
) => {};

export const QueryLinksReturns = (
  props: GraphqlResult<{
    linkIndex: Page<Link>;
  }>
) => {};

export const CreateVoteParams = (props: {
  linkId: string;
  type: VoteType;
}) => {};

export const CreateVoteReturns = (
  props: GraphqlResult<{
    createVote: { document: { id: string } };
  }>
) => {};

export const UpdateVoteParams = (props: {
  linkId: string;
  VoteInput: Partial<VoteInput>;
}) => {};

export const UpdateVoteReturns = (
  props: GraphqlResult<{
    updateVote: { document: { id: string } };
  }>
) => {};

export const QueryPersonalVoteReturns = (
  props: GraphqlResult<{
    viewer: {
      voteList: Page<Vote>;
    };
  }>
) => {};

export const CreateFavorParams = (props: {
  linkId: string;
  revoke?: Boolean;
}) => {};

export const CreateFavorReturns = (
  props: GraphqlResult<{
    createFavor: { document: { id: string } };
  }>
) => {};

export const UpdateFavorParams = (props: {
  favorId: string;
  FavorInput: Partial<FavorInput>;
}) => {};

export const UpdateFavorReturns = (
  props: GraphqlResult<{
    createFavor: { document: { id: string } };
  }>
) => {};

export const QueryPersonalFavorReturns = (
  props: GraphqlResult<{
    viewer: {
      favorList: Page<Favor>;
    };
  }>
) => {};

export const CreateScoreParams = (props: {
  linkId: string;
  value: number;
  linkID: string;
}) => {};

export const CreateScoreReturns = (
  props: GraphqlResult<{
    createScore: { document: { id: string } };
  }>
) => {};

export const UpdateScoreParams = (props: {
  scoreId: string;
  ScoreInput: Partial<ScoreInput>;
}) => {};

export const UpdateScoreReturns = (
  props: GraphqlResult<{
    updateScore: { document: { id: string } };
  }>
) => {};

export const QueryPersonalScoreReturns = (
  props: GraphqlResult<{
    viewer: {
      scoreList: Page<Score>;
    };
  }>
) => {};

export const CreateCommentParams = (
  props: Partial<Pick<CommentInput, "linkID" | "revoke" | "text">>
) => {};

export const CreateCommentReturns = (
  props: GraphqlResult<{
    createComment: { document: { id: string } };
  }>
) => {};

export const UpdateCommentParams = (props: {
  CommentId: string;
  CommentInput: Partial<Pick<CommentInput, "linkID" | "revoke" | "text">>;
}) => {};

export const UpdateCommentReturns = (
  props: GraphqlResult<{
    updateComment: { document: { id: string } };
  }>
) => {};

export const QueryPersonalCommentReturns = (
  props: GraphqlResult<{
    viewer: {
      commentList: Page<Comment>;
    };
  }>
) => {};
