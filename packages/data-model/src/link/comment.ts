import { DateTime, Link, Creator } from ".";

export type Comment = {
  id: string;
  linkID: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  link?: Link;
  text: string;
  creator: Creator;
};

export type CommentInput = {
  text: string;
  linkID: string;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};
