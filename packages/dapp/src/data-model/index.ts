import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
// import type { StreamID } from "@ceramicnetwork/streamid";
import { Page } from "@ceramicnetwork/common";

import { S3Model } from "@us3r-network/data-model";

import { definition as dappDefinition } from "./dapp-runtime-composite";

export type SocialLink = {
  platform: string;
  url: string;
};

export type Dapp = {
  id?: string;
  name: string;
  icon?: string;
  url?: string;
  tags?: string[];
  models?: string[];
  socialLink?: SocialLink[];
  description?: string;
};

export class S3DappModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (dappDefinition as RuntimeCompositeDefinition)
    );
  }

  public async queryPersonalDapps({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const dapps = await composeClient.executeQuery<{
      viewer: {
        dappList: Page<Dapp>;
      };
    }>(`
      query {
        viewer {
          dappList(first: ${first}, after: "${after}") {
            edges {
              node {
                icon
                id
                models
                name
                socialLink {
                  url
                  platform
                }
                tags
                url
                version
                description
              }
            }
          }
        }
      }
    `);
    return dapps;
  }

  public async createDapp(dapp: Dapp) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation createDapp($input: CreateDappInput!) {
        createDapp(input: $input) {
          document {
            id
          }
        }
      }
    `;

    const res = await composeClient.executeQuery<{
      createDapp: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: { ...dapp },
      },
    });

    return res;
  }

  public async updateDapp(id: string, dapp: Partial<Dapp>) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation updateDapp($input: UpdateDappInput!) {
        updateDapp(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      updateDapp: { document: { id: string } };
    }>(createMutation, {
      input: {
        id: id,
        content: { ...dapp },
      },
    });

    return res;
  }

  public async queryDappWithId(id: string) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      node: Dapp;
    }>(`
      query {
        node(id: "${id}") {
          id
          ...on Dapp {
            name
            icon
            url
            tags
            models
            socialLink {
              platform
              url
            }
            description
          }
        }
      }
    `);
    return res;
  }
}
