import { DateTime, Link, Creator } from ".";

export type Score = {
  id: string;
  text: string;
  value: number;
  linkID: string;
  revoke?: Boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
  link?: Link;
  creator: Creator;
};

export type ScoreInput = {
  text: string;
  value: number;
  linkID: string;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};
