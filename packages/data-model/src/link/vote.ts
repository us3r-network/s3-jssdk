import { DateTime, Link } from ".";
import { Creator } from "../base";

export type VoteType = "UP_VOTE" | "DOWN_VOTE";

export type Vote = {
  id: string;
  linkID: string;
  creator: Creator;
  type?: VoteType;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
  link?: Link;
};

export type VoteInput = {
  linkID: string;
  type?: VoteType;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};
