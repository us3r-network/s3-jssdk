import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
import { DateTime, Link, Creator } from ".";

export type Favor = {
  id: string;
  linkID: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  link: Link;
  creator: Creator;
};

export type FavorInput = {
  linkID: string;
  revoke: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};

export class S3FavorModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as RuntimeCompositeDefinition)
    );
  }

  public async createFavor(favorInput: FavorInput) {
    const createMutation = `
      mutation CreateFavor($input: CreateFavorInput!) {
        createFavor(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createFavor: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...favorInput,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateFavor(favorId: string, favorInput: Partial<FavorInput>) {
    const updateMutation = `
      mutation UpdateFavor($input: UpdateFavorInput!) {
        updateFavor(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createFavor: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id: favorId,
        content: {
          ...favorInput,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalFavors({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        favorList: Page<Favor>;
      };
    }>(`
      query {
        viewer {
          favorList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                creator {
                  id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  url
                  date
                  type
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
