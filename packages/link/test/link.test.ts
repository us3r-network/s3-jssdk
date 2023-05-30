/**
 * @jest-environment s3network
 */

import { Composite } from "@composedb/devtools";

import { S3LinkModel } from "../src";

import { linkSchema } from "./linkSchema";
import { genLinkOpsSchema } from "./linkOpsSchema";
import { genRelationSchema } from "./linkRelationSchema";

describe("client", () => {
  let linkComposite: Composite;
  let linkOpsComposite: Composite;
  let relationComposite: Composite;

  let s3Link: S3LinkModel;

  let linkId: string;
  const testURL = "https://scan.s3.xyz/";
  const testTitle = "title";
  const testType = "type";
  const testUpdateType = "typeUpdate";

  beforeAll(async () => {
    linkComposite = await Composite.create({
      ceramic,
      schema: linkSchema,
    });

    const linkCompositeRT = linkComposite.toRuntime();
    const linkOpsSchema = genLinkOpsSchema(linkCompositeRT.models.Link.id);
    linkOpsComposite = await Composite.create({
      ceramic,
      schema: linkOpsSchema,
    });
    const linkOpsRT = linkOpsComposite.toRuntime();
    const { Link, Comment, Favor, Score, Vote } = linkOpsRT.models;
    const relationSchema = genRelationSchema(
      Link.id,
      Vote.id,
      Comment.id,
      Score.id,
      Favor.id
    );
    relationComposite = await Composite.create({
      ceramic,
      schema: relationSchema,
    });
    const relationRT = relationComposite.toRuntime();

    s3Link = new S3LinkModel(ceramic, relationRT);
  });

  // links
  test("create link success", async () => {
    const resp = await s3Link.createLink({
      url: testURL,
      type: testType,
      title: testTitle,
    });
    expect(resp.data?.createLink.document.id).not.toBeNull();
    linkId = resp.data?.createLink.document.id || "";
    expect(linkId).not.toBe("");
  });

  test("query link success", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("url", testURL);
    expect(link).toHaveProperty("title", testTitle);
    expect(link).toHaveProperty("type", testType);
  });

  test("update link success", async () => {
    const resp = await s3Link.updateLink(linkId, {
      type: testUpdateType,
      url: testURL,
      title: testTitle,
    });

    expect(resp.errors).not.toBeDefined();
    expect(resp.data?.updateLink.document.id).not.toBeNull();
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2500);
    });
  });

  test("query link success after update", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("url", testURL);
    expect(link).toHaveProperty("title", testTitle);
    expect(link).toHaveProperty("type", testUpdateType);
  });

  test("query personal success", async () => {
    const resp = await s3Link.queryPersonalLinks({ first: 10 });
    const linkList = resp.data?.viewer.linkList;
    expect(linkList).not.toBeNull();
    expect(linkList?.edges.length).toBe(1);
  });

  test("query linkIndex", async () => {
    const resp = await s3Link.queryLinks({ first: 10 });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();
    expect(linkIndex?.edges.length).toBe(1);
  });

  // votes
  test("create link vote success", async () => {
    const resp = await s3Link.createVote({
      linkID: linkId,
      type: "UP_VOTE",
    });

    expect(resp.errors).not.toBeDefined();
    const createVote = resp.data?.createVote;
    expect(createVote).not.toBeNull();
  });

  test("query link success with vote", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("votesCount", 1);
  });

  test("query personal votes success", async () => {
    const resp = await s3Link.queryPersonalVotes({ first: 10 });
    const voteList = resp.data?.viewer.voteList;
    expect(voteList).not.toBeNull();
    expect(voteList?.edges.length).toBe(1);
  });

  // favor
  test("create link favor success", async () => {
    const resp = await s3Link.createFavor({
      linkID: linkId,
      revoke: false,
    });

    expect(resp.errors).not.toBeDefined();
    const createFavor = resp.data?.createFavor;
    expect(createFavor).not.toBeNull();

    const favorId = createFavor?.document.id || "";

    const updateResp = await s3Link.updateFavor(favorId, {
      revoke: true,
    });
    console.log(updateResp.errors);
    expect(updateResp.errors).not.toBeDefined();
  });

  test("query link success with favor", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("favorsCount", 1);
  });

  test("query personal favors success", async () => {
    const resp = await s3Link.queryPersonalFavors({ first: 10 });
    const favorList = resp.data?.viewer.favorList;
    expect(resp.errors).not.toBeDefined();
    expect(favorList).not.toBeNull();
    expect(favorList?.edges.length).toBe(1);
  });

  // score
  test("create link score success", async () => {
    const resp = await s3Link.createScore({
      linkID: linkId,
      text: "string",
      value: 10,
    });

    expect(resp.errors).not.toBeDefined();
    const createScore = resp.data?.createScore;
    expect(createScore).not.toBeNull();

    let scoreId = createScore?.document.id || "";

    const updateResp = await s3Link.updateScore(scoreId, {
      text: "update",
    });
    expect(updateResp.errors).not.toBeDefined();
  });

  test("query link success with score", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("scoresCount", 1);
  });

  test("query personal scores success", async () => {
    const resp = await s3Link.queryPersonalScores({ first: 10 });
    const scoreList = resp.data?.viewer.scoreList;
    expect(resp.errors).not.toBeDefined();
    expect(scoreList).not.toBeNull();
    expect(scoreList?.edges.length).toBe(1);
  });

  // comment
  test("create link comment success", async () => {
    const resp = await s3Link.createComment({
      linkID: linkId,
      text: "string",
    });

    expect(resp.errors).not.toBeDefined();
    const createComment = resp.data?.createComment;
    expect(createComment).not.toBeNull();
    let commentId = createComment?.document.id || "";

    const updateResp = await s3Link.updateComment(commentId, {
      text: "update",
    });
    expect(updateResp.errors).not.toBeDefined();
  });

  test("query link success with comment", async () => {
    const resp = await s3Link.queryLink(linkId);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("commentsCount", 1);
  });

  test("query personal comments success", async () => {
    const resp = await s3Link.queryPersonalComments({ first: 10 });
    const commentList = resp.data?.viewer.commentList;
    expect(resp.errors).not.toBeDefined();
    expect(commentList).not.toBeNull();
    expect(commentList?.edges.length).toBe(1);
  });
});
