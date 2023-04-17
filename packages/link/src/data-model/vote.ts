import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
import { DateTime, Link, Creator } from ".";

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

export class S3VoteModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as RuntimeCompositeDefinition)
    );
  }

  public async createVote(input: VoteInput) {
    const createMutation = `
      mutation CreateVote($input: CreateVoteInput!) {
        createVote(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createVote: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...input,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateVote(id: string, input: Partial<VoteInput>) {
    const updateMutation = `
      mutation UpdateVote($input: UpdateVoteInput!) {
        updateVote(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateVote: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id,
        content: {
          ...input,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalVotes({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        voteList: Page<Vote>;
      };
    }>(`
      query {
        viewer {
          voteList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                type
                creator {
                    id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  title
                  creator {
                    id
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }
}
