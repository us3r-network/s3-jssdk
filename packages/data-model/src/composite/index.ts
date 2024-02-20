import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";

import { Page } from "@ceramicnetwork/common";

import { S3Model } from "../base";
import type { Creator } from "../base";

// import { definition as compositeDefinitionMainnet } from "./composite-runtime-composite-mainnet";
import { definition as compositeDefinitionTestnet } from "./composite-runtime-composite-testnet";

export type DateTime = string;

export type Composite = {
  id?: string;
  creator?: Creator;
  modelID: string;
  notes?: string;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};

export class S3ModelCompositeModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    network?: "mainnet" | "testnet",
    definition?: RuntimeCompositeDefinition
  ) {
    // super(
    //   ceramic,
    //   definition ??
    //     (network === "mainnet"
    //       ? (compositeDefinitionMainnet as unknown as RuntimeCompositeDefinition)
    //       : (compositeDefinitionTestnet as unknown as RuntimeCompositeDefinition))
    // );
    super(
      ceramic,
      definition ??
        compositeDefinitionTestnet as unknown as RuntimeCompositeDefinition
    )
    ;
  }

  public async createComposite(composite: Composite) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation CreateModelComposite($input: CreateModelCompositeInput!) {
        createModelComposite(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      createModelComposite: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: { ...composite, createAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async updateComposite(id: string, composite: Partial<Composite>) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation UpdateModelComposite($input: UpdateModelCompositeInput!) {
        updateModelComposite(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      updateModelComposite: { document: { id: string } };
    }>(createMutation, {
      input: {
        id,
        content: { ...composite, modifiedAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async queryPersonalComposites({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const modelCompositeListData = await composeClient.executeQuery<{
      viewer: {
        modelCompositeList: Page<Composite>;
      };
    }>(`
      query {
        viewer {
          modelCompositeList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                notes
                revoke
                modelID
                createAt
                modifiedAt
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
    return modelCompositeListData;
  }
}
