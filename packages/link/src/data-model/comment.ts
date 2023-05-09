import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
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
