import { DateTime, Link, Creator } from ".";

export type Favor = {
  id: string;
  linkID: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  link?: Link;
  creator: Creator;
};

export type FavorInput = {
  linkID: string;
  revoke: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};
