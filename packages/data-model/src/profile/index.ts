import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi, Page } from "@ceramicnetwork/common";
import { Creator, S3Model } from "../base";

import { definition as profileDefinition } from "./profileV2-runtime-composite";

export type WalletChainType = "EVM" | "SOLANA";
export type Profile = {
  id?: string;
  name?: string;
  avatar?: string;
  wallets?: Wallet[];
  bio?: string;
  tags?: string[];
};
export type Wallet = {
  chain: WalletChainType;
  address: string;
  primary: boolean;
};
export type BioLink = {
  id: string;
  profileID: string;
  creator: Creator;
  platform?: string;
  network?: string;
  handle?: string;
  data?: string;
};
export type BioLinkInput = {
  profileID: string;
  platform?: string;
  network?: string;
  handle?: string;
  data?: string;
};

export class S3ProfileModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (profileDefinition as RuntimeCompositeDefinition)
    );
  }
  public async queryPersonalProfile() {
    const profileComposeClient = this.composeClient;
    const profile = await profileComposeClient.executeQuery<{
      viewer: {
        profile: Profile;
      };
    }>(`
      query {
        viewer {
          profile {
            id
            bio
            name
            tags
            avatar
            wallets {
              chain
              address
              primary
            }
          }
        }
      }
    `);
    return profile;
  }

  public async mutationUpdatePersonalProfile({
    name,
    avatar,
    wallets,
    bio,
    tags,
  }: {
    name: string;
    avatar: string;
    wallets?: Wallet[];
    bio?: string;
    tags?: string[];
  }) {
    const query = `
      mutation($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const profileComposeClient = this.composeClient;
    const update = await profileComposeClient.executeQuery<{
      updateProfile: {
        document: { id: string };
      };
    }>(query, {
      input: {
        content: {
          name,
          avatar,
          wallets,
          bio,
          tags,
        },
      },
    });
    return update;
  }

  public async mutationPersonalProfile({
    name,
    avatar,
    wallets,
    bio,
    tags,
  }: Profile) {
    const query = `
      mutation($input: CreateProfileInput!) {
        createProfile(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const profileComposeClient = this.composeClient;
    const update = await profileComposeClient.executeQuery<{
      createProfile: {
        document: { id: string };
      };
    }>(query, {
      input: {
        content: {
          name,
          avatar,
          wallets,
          bio,
          tags,
        },
      },
    });
    return update;
  }

  public async queryProfileWithDid(did: string) {
    const query = `
      query ($id: ID!) {
        node(id: $id) {
          ...on CeramicAccount {
            id
            profile {
              id
              bio
              name
              tags
              avatar
              wallets {
                chain
                address
                primary
              }
            }
          }
        }
      }
    `;
    const profileComposeClient = this.composeClient;
    const res = await profileComposeClient.executeQuery<{
      node: {
        id: string;
        profile: Profile;
      };
    }>(query, {
      id: did,
    });

    return res;
  }

  /**
   * BioLink
   */

  public async createBioLink(input: BioLinkInput) {
    const createMutation = `
      mutation CreateBioLink($input: CreateBioLinkInput!) {
        createBioLink(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createBioLink: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...input,
        },
      },
    });
    return res;
  }

  public async updateBioLink(id: string, input: Partial<BioLinkInput>) {
    const updateMutation = `
      mutation UpdateBioLink($input: UpdateBioLinkInput!) {
        updateBioLink(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateBioLink: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id,
        content: {
          ...input,
        },
      },
    });
    return res;
  }

  public async queryPersonalBioLinks({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const profileComposeClient = this.composeClient;
    const profile = await profileComposeClient.executeQuery<{
      viewer: {
        bioLinkList: Page<BioLink>;
      };
    }>(`
      query {
        viewer {
          bioLinkList(first: ${first}, after: "${after}") {
            edges {
              node {
                data
                handle
                id
                network
                platform
                profileID
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
    return profile;
  }

  public async queryBioLinksWithDid(
    did: string,
    {
      first = 10,
      after = "",
    }: {
      first: number;
      after?: string;
    }
  ) {
    const query = `
      query ($id: ID!) {
        node(id: $id) {
          ...on CeramicAccount {
            id
            bioLinkList(first: ${first}, after: "${after}") {
              edges {
                node {
                  id
                  network
                  platform
                  data
                  handle
                  profileID
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
      }
    `;
    const profileComposeClient = this.composeClient;
    const res = await profileComposeClient.executeQuery<{
      node: {
        id: string;
        bioLinkList: Page<BioLink>;
      };
    }>(query, {
      id: did,
    });

    return res;
  }

  public async queryBioLinksWithFilters({
    filters,
    first = 10,
    after = "",
  }: {
    filters: any;
    first?: number;
    after?: string;
  }) {
    const query = `
      query ($input: BioLinkFiltersInput!) {
        bioLinkIndex(filters: $input, first: ${first}, after: "${after}") {
          edges {
            node {
              id
              profileID
              creator {
                id
              }
              platform
              network
              handle
              data
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
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      bioLinkIndex: Page<BioLink>;
    }>(query, {
      input: filters,
    });
    return res;
  }
}
