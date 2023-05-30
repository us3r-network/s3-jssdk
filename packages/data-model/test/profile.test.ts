import { Composite } from "@composedb/devtools";

import { S3ProfileModel } from "../src";
import { profilesSchema } from "./schema/profileSchema";

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
