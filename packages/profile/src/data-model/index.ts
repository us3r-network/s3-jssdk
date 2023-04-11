import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import S3Model from "@us3r-network/data-model";

import { definition as profileDefinition } from "./profile-runtime-composite";

export type WalletChainType = "EVM" | "SOLANA";
export type Profile = {
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

export default class S3ProfileModel extends S3Model {
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
}
