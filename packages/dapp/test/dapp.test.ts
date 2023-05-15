/**
 * @jest-environment s3network
 */

import { Composite } from "@composedb/devtools";

import { S3DappModel } from "../src/data-model";

import { dappSchema } from "./dappSchema";

describe("client", () => {
  let dappComposite: Composite;

  let s3Dapp: S3DappModel;

  let dappId: string;
  const testURL = "https://scan.s3.xyz/";

  beforeAll(async () => {
    dappComposite = await Composite.create({
      ceramic,
      schema: dappSchema,
    });

    const linkCompositeRT = dappComposite.toRuntime();

    s3Dapp = new S3DappModel(ceramic, linkCompositeRT);
  });

  // create dapp
  test("create dapp success", async () => {
    const resp = await s3Dapp.createDapp({
      name: "test dapp",
      icon: testURL,
      url: testURL,
      tags: ["tags"],
      models: [
        "kjzl6kcym7w8y9qghvuwx9apjsldcqj47uc7kaezrotrfazcczczi0e4043qdd5",
      ],
      socialLink: [
        {
          platform: "test platform socialLink",
          url: testURL,
        },
      ],
      description: "description",
    });
    expect(resp?.data?.createDapp.document.id).not.toBeNull();
    dappId = resp?.data?.createDapp.document.id!;
  });

  test("update dapp success", async () => {
    const resp = await s3Dapp.updateDapp(dappId, {
      description: "update",
    });

    expect(resp.errors).not.toBeDefined();
    expect(resp.data?.updateDapp.document.id).not.toBeNull();
  });

  test("query personal dapps", async () => {
    const resp = await s3Dapp.queryPersonalDapps({ first: 10 });
    const dappList = resp.data?.viewer.dappList;
    expect(dappList).not.toBeNull();
    expect(dappList?.edges.length).toBe(1);
  });

  test("query dapp by id", async () => {
    const resp = await s3Dapp.queryDappWithId(dappId);
    expect(resp.errors).not.toBeDefined();
  });
});
