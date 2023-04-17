import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
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

export class S3ScoreModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as RuntimeCompositeDefinition)
    );
  }

  public async createScore(input: ScoreInput) {
    const createMutation = `
      mutation CreateScore($input: CreateScoreInput!) {
        createScore(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createScore: { document: { id: string } };
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

  public async updateScore(id: string, input: Partial<ScoreInput>) {
    const updateMutation = `
      mutation UpdateScore($input: UpdateScoreInput!) {
        updateScore(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateScore: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id: id,
        content: {
          ...input,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalScores({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        scoreList: Page<Score>;
      };
    }>(`
      query {
        viewer {
          scoreList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                text
                value
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
