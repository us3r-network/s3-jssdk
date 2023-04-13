/**
 * @jest-environment s3network
 */

import { Composite } from "@composedb/devtools";

import { S3ProfileModel } from "../src";

const profilesSchema = `
enum ChainType {
  EVM
  SOLANA
}

type Wallet
{
  chain: ChainType!
  address: String! @string(minLength: 20, maxLength: 60)
  primary: Boolean!
}

type Profile
  @createModel(
    accountRelation: SINGLE,
    description: "profile for us3r-network"
  ) {
  version: CommitID! @documentVersion
  name: String! @string(minLength: 3, maxLength: 100)
  bio: String @string(minLength: 3, maxLength: 200)
  avatar: String @string(maxLength: 1000)
  tags: [String!] @string(maxLength: 60) @list(maxLength:20)
  wallets: [Wallet!] @list(maxLength:20)
}`;

describe("client", () => {
  test("adds 1 + 2 to equal 3", async () => {
    // const ceramic = (global as any).ceramic;
    const composite = await Composite.create({
      ceramic,
      schema: profilesSchema,
    });
    const s3Profile = new S3ProfileModel(ceramic, composite.toRuntime());
    const resp = await s3Profile.mutationPersonalProfile({
      name: "name",
      avatar: "avatar",
      wallets: [],
      bio: "bio",
      tags: ["tag", "s"],
    });

    expect(resp.data?.createProfile.document.id).not.toBeNull();
    expect(1 + 2).toBe(3);
  });
});
