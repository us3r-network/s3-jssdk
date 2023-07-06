import { Composite } from "@composedb/devtools";

import { S3LinkModel } from "../src";

import { linkSchema } from "./schema/linkSchema";
import { genLinkOpsSchema } from "./schema/linkOpsSchema";
import { genRelationSchema } from "./schema/linkRelationSchema";

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
    const resp = await s3Link.queryLink(linkId, ["url", "title", "type"]);
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
    const resp = await s3Link.queryLink(linkId, ["url", "title", "type"]);
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

  test("create personal desc success", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
    }
  });

  test("query personal desc success", async () => {
    const resp = await s3Link.queryPersonalLinksDesc({
      last: 2,
      linkFields: ["title"],
    });
    const linkList = resp.data?.viewer.linkList;

    expect(linkList).not.toBeNull();
    expect(linkList?.edges.length).toBe(2);

    expect(linkList?.edges[0].node.title).toBe("title10");
    expect(linkList?.edges[1].node.title).toBe("title11");
  });

  test("query linkIndex", async () => {
    const resp = await s3Link.queryLinks({ first: 10 });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();
    expect(linkIndex?.edges.length).toBe(10);
  });

  test("query linkIndex desc", async () => {
    const resp = await s3Link.queryLinksDesc({
      last: 3,
      linkFields: ["title"],
    });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();

    expect(linkIndex?.edges.length).toBe(3);

    expect(linkIndex?.edges[0].node.title).toBe("title9");
    expect(linkIndex?.edges[1].node.title).toBe("title10");
    expect(linkIndex?.edges[2].node.title).toBe("title11");
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
    const resp = await s3Link.queryLink(linkId, ["votesCount"]);
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

  const votesIdList: string[] = [];
  test("create vote for desc success", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
      const voteResp = await s3Link.createVote({
        linkID: linkId,
        type: "UP_VOTE",
      });

      expect(resp.errors).not.toBeDefined();
      const createVote = voteResp.data?.createVote;
      expect(createVote).not.toBeNull();
      votesIdList.push(linkId);
    }
  });

  test("query personal vote desc success", async () => {
    const resp = await s3Link.queryPersonalVotesDesc({ last: 3 });
    const voteList = resp.data?.viewer.voteList;
    expect(voteList).not.toBeNull();
    expect(voteList?.edges.length).toBe(3);
    const last3LinkId = voteList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(votesIdList.slice(-3));
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
    expect(updateResp.errors).not.toBeDefined();
  });

  test("query link success with favor", async () => {
    const resp = await s3Link.queryLink(linkId, ["favorsCount"]);
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

  const favorIdList: string[] = [];
  test("create favors desc success", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
      const favorResp = await s3Link.createFavor({
        linkID: linkId,
        revoke: false,
      });
      expect(favorResp.errors).not.toBeDefined();
      const createFavor = favorResp.data?.createFavor;
      expect(createFavor).not.toBeNull();
      favorIdList.push(linkId);
    }
  });

  test("query personal favors desc success", async () => {
    const resp = await s3Link.queryPersonalFavorsDesc({ last: 3 });
    const favorList = resp.data?.viewer.favorList;
    expect(resp.errors).not.toBeDefined();
    expect(favorList).not.toBeNull();
    expect(favorList?.edges.length).toBe(3);
    const last3LinkId = favorList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(favorIdList.slice(-3));
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
    const resp = await s3Link.queryLink(linkId, ["scoresCount"]);
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

  const scoreIdList: string[] = [];
  test("create scores desc success", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
      const scoreResp = await s3Link.createScore({
        linkID: linkId,
        text: "string" + i,
        value: 10,
      });
      expect(scoreResp.errors).not.toBeDefined();
      const createScore = scoreResp.data?.createScore;
      expect(createScore).not.toBeNull();
      scoreIdList.push(linkId);
    }
  });

  test("query personal scores desc success", async () => {
    const resp = await s3Link.queryPersonalScoresDesc({ last: 3 });
    const scoreList = resp.data?.viewer.scoreList;
    expect(resp.errors).not.toBeDefined();
    expect(scoreList).not.toBeNull();
    expect(scoreList?.edges.length).toBe(3);
    const last3LinkId = scoreList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(scoreIdList.slice(-3));
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
    const resp = await s3Link.queryLink(linkId, ["commentsCount"]);
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

  const commentsIdList: string[] = [];
  test("create comment for desc success", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
      const commentResp = await s3Link.createComment({
        linkID: linkId,
        text: "string",
      });
      expect(commentResp.errors).not.toBeDefined();
      const createComment = commentResp.data?.createComment;
      expect(createComment).not.toBeNull();
      commentsIdList.push(linkId);
    }
  });

  test("query personal comments desc success", async () => {
    const resp = await s3Link.queryPersonalCommentsDesc({ last: 3 });
    const commentList = resp.data?.viewer.commentList;
    expect(resp.errors).not.toBeDefined();
    expect(commentList).not.toBeNull();
    expect(commentList?.edges.length).toBe(3);
    const last3LinkId = commentList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(commentsIdList.slice(-3));
  });
});
