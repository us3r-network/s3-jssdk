/**
 * @jest-environment s3network
 */

import { Composite } from "@composedb/devtools";

import { S3ProfileModel } from "../src/data-model";

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
  const testName = "name";
  const testAvatar = "testAvatar";
  let profileId = "";

  let composite: Composite;
  let s3Profile: S3ProfileModel;
  beforeAll(async () => {
    composite = await Composite.create({
      ceramic,
      schema: profilesSchema,
    });
    s3Profile = new S3ProfileModel(ceramic, composite.toRuntime());
  });

  test("create profile success", async () => {
    const resp = await s3Profile.mutationPersonalProfile({
      name: testName,
      avatar: testAvatar,
      wallets: [],
      bio: "bio",
      tags: ["tag", "s"],
    });

    expect(resp.data?.createProfile.document.id).not.toBeNull();
    profileId = resp.data?.createProfile.document.id || "";
    expect(profileId).not.toBe("");
  });

  test("query profile success", async () => {
    const resp = await s3Profile.queryPersonalProfile();
    const profile = resp.data?.viewer.profile;
    expect(profile).not.toBeNull();
    expect(profile).toHaveProperty("name", testName);
    expect(profile).toHaveProperty("avatar", testAvatar);
  });
});
