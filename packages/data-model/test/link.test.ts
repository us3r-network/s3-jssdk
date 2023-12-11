import { Composite } from "@composedb/devtools";

import { S3LinkModel } from "../src";

import { linkSchema } from "./schema/linkSchema";
import { genLinkOpsSchema } from "./schema/linkOpsSchema";
import { genRelationSchema } from "./schema/linkRelationSchema";
import { RuntimeCompositeDefinition } from "@composedb/types";

describe("links testing", () => {
  let linkComposite: Composite;
  let linkOpsComposite: Composite;
  let relationComposite: Composite;

  let s3Link: S3LinkModel;

  let firstLinkId: string;
  const testURL = "https://scan.s3.xyz";
  const testTitle = "title";
  const testType = "type";

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

    s3Link = new S3LinkModel(ceramic, relationRT as unknown as RuntimeCompositeDefinition);
  });

  // links
  //add one link
  test("create link", async () => {
    const resp = await s3Link.createLink({
      url: testURL,
      type: testType,
      title: testTitle,
    });
    expect(resp.data?.createLink.document.id).not.toBeNull();
    firstLinkId = resp.data?.createLink.document.id || "";
    expect(firstLinkId).not.toBe("");
  });

  test("query link", async () => {
    const resp = await s3Link.queryLink(firstLinkId, ["url", "title", "type"]);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("url", testURL);
    expect(link).toHaveProperty("title", testTitle);
    expect(link).toHaveProperty("type", testType);
  });

  //update one link
  test("update link", async () => {
    const resp = await s3Link.updateLink(firstLinkId, {
      type: testType + '-' + 1,
      url: testURL + '/' + 1,
      title: testTitle + '-' + 1 + '-update',
    });

    expect(resp.errors).not.toBeDefined();
    expect(resp.data?.updateLink.document.id).not.toBeNull();
    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        const resp = await s3Link.queryLink(firstLinkId, ["url", "title", "type"]);
        const link = resp.data?.node;
        expect(link).not.toBeNull();
        expect(link).toHaveProperty("url", testURL + '/' + 1);
        expect(link).toHaveProperty("title", testTitle + '-' + 1 + '-update');
        expect(link).toHaveProperty("type", testType + '-' + 1);
        resolve();
      }, 1000);
    });
  },10000);

  //create one more link and update one link
  test("upsert link", async () => {
    const resp = await s3Link.createLink({
      type: testType + '-' + 2,
      url: testURL + '/' + 2,
      title: testTitle + '/' + 2,
    });

    const resp_update = await s3Link.upsertLink({
      type: testType + '-' + 2,
      url: testURL + '/' + 2,
      title: testTitle + '-' + 2 + '-upsert',
    });

    expect(resp_update.errors).not.toBeDefined();
    // expect(resp_update.data?.updateLink.document.id).not.toBeNull();

    const resp_create = await s3Link.upsertLink({
      type: testType + '-' + 3,
      url: testURL + '/' + 3,
      title: testTitle + '-' + 3 + '-upsert',
    });
    expect(resp_create.errors).not.toBeDefined();
    // expect(resp_create.data?.createLink.document.id).not.toBeNull();

    await new Promise<void>((resolve) => {
      setTimeout(async () => {
        const resp = await s3Link.queryLinks({});
        const linkIndex = resp.data?.linkIndex;
        console.log(linkIndex?.edges[0].node)
        console.log(linkIndex?.edges[1].node)
        console.log(linkIndex?.edges[2].node)
        expect(linkIndex).not.toBeNull();
        expect(linkIndex?.edges.length).toBe(3);
        expect(linkIndex?.edges[0].node.title).toBe(testTitle + '-' + 3 + '-upsert');
        expect(linkIndex?.edges[1].node.title).toBe(testTitle + '-' + 2 + '-upsert');
        expect(linkIndex?.edges[2].node.title).toBe(testTitle + '-' + 1 + '-update');
        resolve();
      }, 1000);
    });
  },10000);

  return;
  test("query personal link", async () => {
    const resp = await s3Link.queryPersonalLinks({ first: 10 });
    const linkList = resp.data?.viewer.linkList;
    expect(linkList).not.toBeNull();
    expect(linkList?.edges.length).toBe(1);
  });

  //create 11 more links
  test("create links", async () => {
    const arr: number[] = new Array(11).fill(0).map((_, i) => i+3);
    for await (const i of arr) {
      const data = {
        url: testURL + '/' + i,
        type: testType + '-' + i%3,
        title: testTitle + '-' + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      const linkId = resp.data?.createLink.document.id || "";
      expect(linkId).not.toBe("");
    }
  });

  test("query personal links", async () => {
    const resp_desc = await s3Link.queryPersonalLinks({
      first: 2,
      linkFields: ["title"],
    });
    const linkList_desc = resp_desc.data?.viewer.linkList;

    expect(linkList_desc).not.toBeNull();
    expect(linkList_desc?.edges.length).toBe(2);

    expect(linkList_desc?.edges[0].node.title).toBe("title-13");
    expect(linkList_desc?.edges[1].node.title).toBe("title-12");

    const resp_asc = await s3Link.queryPersonalLinks({
      sort: {createAt:"ASC"},
      first: 2,
      linkFields: ["title"],
    });
    const linkList_asc = resp_asc.data?.viewer.linkList;

    expect(linkList_asc).not.toBeNull();
    expect(linkList_asc?.edges.length).toBe(2);

    expect(linkList_asc?.edges[0].node.title).toBe("title-1");
    expect(linkList_asc?.edges[1].node.title).toBe("title-2");
  });

  test("query linkIndex with filter", async () => {
    const resp = await s3Link.queryLinks({ first: 20 });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();
    expect(linkIndex?.edges.length).toBe(14);

    const resp_filter = await s3Link.queryLinks(
      { 
        filters: {
            "where" : {
              "type" : { "equalTo" : testType + '-' + 1}
            },
          },
        first: 20 
      }
    );
    const linkIndex_filter = resp_filter.data?.linkIndex;
    console.log(linkIndex_filter);
    expect(linkIndex_filter).not.toBeNull();
    expect(linkIndex_filter?.edges.length).toBe(5);
  });

  test("query linkIndex", async () => {
    const resp = await s3Link.queryLinks({
      sort: {createAt:"ASC"},
      first: 3,
      linkFields: ["title"],
    });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();
    expect(linkIndex?.edges.length).toBe(3);
    expect(linkIndex?.edges[0].node.title).toBe("title-1-update");
    expect(linkIndex?.edges[1].node.title).toBe("title-2-upsert");
    expect(linkIndex?.edges[2].node.title).toBe("title-3");
  });

  test("query linkIndex desc", async () => {
    const resp = await s3Link.queryLinks({
      first: 3,
      linkFields: ["title"],
    });
    const linkIndex = resp.data?.linkIndex;
    expect(linkIndex).not.toBeNull();
    expect(linkIndex?.edges.length).toBe(3);
    expect(linkIndex?.edges[0].node.title).toBe("title-13");
    expect(linkIndex?.edges[1].node.title).toBe("title-12");
    expect(linkIndex?.edges[2].node.title).toBe("title-11");
  });
  return;
  // votes
  test("create link vote", async () => {
    const resp = await s3Link.createVote({
      linkID: firstLinkId,
      type: "UP_VOTE",
    });

    expect(resp.errors).not.toBeDefined();
    const createVote = resp.data?.createVote;
    expect(createVote).not.toBeNull();
  });

  test("query link with vote", async () => {
    const resp = await s3Link.queryLink(firstLinkId, ["votesCount"]);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("votesCount", 1);
  });

  test("query personal votes", async () => {
    const resp = await s3Link.queryPersonalVotes({ first: 10 });
    const voteList = resp.data?.viewer.voteList;
    expect(voteList).not.toBeNull();
    expect(voteList?.edges.length).toBe(1);
  });

  const votesIdList: string[] = [];
  test("create vote for desc", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      const linkId = resp.data?.createLink.document.id || "";
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

  test("query personal vote desc", async () => {
    const resp = await s3Link.queryPersonalVotesDesc({ last: 3 });
    const voteList = resp.data?.viewer.voteList;
    expect(voteList).not.toBeNull();
    expect(voteList?.edges.length).toBe(3);
    const last3LinkId = voteList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(votesIdList.slice(-3));
  });

  // favor
  test("create link favor", async () => {
    const resp = await s3Link.createFavor({
      linkID: firstLinkId,
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

  test("query link with favor", async () => {
    const resp = await s3Link.queryLink(firstLinkId, ["favorsCount"]);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("favorsCount", 1);
  });

  test("query personal favors", async () => {
    const resp = await s3Link.queryPersonalFavors({ first: 10 });
    const favorList = resp.data?.viewer.favorList;
    expect(resp.errors).not.toBeDefined();
    expect(favorList).not.toBeNull();
    expect(favorList?.edges.length).toBe(1);
  });

  const favorIdList: string[] = [];
  test("create favors desc", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      const linkId = resp.data?.createLink.document.id || "";
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

  test("query personal favors desc", async () => {
    const resp = await s3Link.queryPersonalFavorsDesc({ last: 3 });
    const favorList = resp.data?.viewer.favorList;
    expect(resp.errors).not.toBeDefined();
    expect(favorList).not.toBeNull();
    expect(favorList?.edges.length).toBe(3);
    const last3LinkId = favorList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(favorIdList.slice(-3));
  });

  // score
  test("create link score", async () => {
    const resp = await s3Link.createScore({
      linkID: firstLinkId,
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

  test("query link with score", async () => {
    const resp = await s3Link.queryLink(firstLinkId, ["scoresCount"]);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("scoresCount", 1);
  });

  test("query personal scores", async () => {
    const resp = await s3Link.queryPersonalScores({ first: 10 });
    const scoreList = resp.data?.viewer.scoreList;
    expect(resp.errors).not.toBeDefined();
    expect(scoreList).not.toBeNull();
    expect(scoreList?.edges.length).toBe(1);
  });

  const scoreIdList: string[] = [];
  test("create scores desc", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      const linkId = resp.data?.createLink.document.id || "";
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

  test("query personal scores desc", async () => {
    const resp = await s3Link.queryPersonalScoresDesc({ last: 3 });
    const scoreList = resp.data?.viewer.scoreList;
    expect(resp.errors).not.toBeDefined();
    expect(scoreList).not.toBeNull();
    expect(scoreList?.edges.length).toBe(3);
    const last3LinkId = scoreList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(scoreIdList.slice(-3));
  });

  // comment
  test("create link comment", async () => {
    const resp = await s3Link.createComment({
      linkID: firstLinkId,
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

  test("query link with comment", async () => {
    const resp = await s3Link.queryLink(firstLinkId, ["commentsCount"]);
    const link = resp.data?.node;
    expect(link).not.toBeNull();
    expect(link).toHaveProperty("commentsCount", 1);
  });

  test("query personal comments", async () => {
    const resp = await s3Link.queryPersonalComments({ first: 10 });
    const commentList = resp.data?.viewer.commentList;
    expect(resp.errors).not.toBeDefined();
    expect(commentList).not.toBeNull();
    expect(commentList?.edges.length).toBe(1);
  });

  const commentsIdList: string[] = [];
  test("create comment for desc", async () => {
    const arr: number[] = new Array(12).fill(0).map((_, i) => i);
    for await (const i of arr) {
      const data = {
        url: testURL + i,
        type: testType + i,
        title: testTitle + i,
      };
      const resp = await s3Link.createLink(data);
      expect(resp.data?.createLink.document.id).not.toBeNull();
      const linkId = resp.data?.createLink.document.id || "";
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

  test("query personal comments desc", async () => {
    const resp = await s3Link.queryPersonalCommentsDesc({ last: 3 });
    const commentList = resp.data?.viewer.commentList;
    expect(resp.errors).not.toBeDefined();
    expect(commentList).not.toBeNull();
    expect(commentList?.edges.length).toBe(3);
    const last3LinkId = commentList?.edges.map((e) => e.node.link?.id);
    expect(last3LinkId).toStrictEqual(commentsIdList.slice(-3));
  });
});
