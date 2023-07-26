import React, { useCallback, useEffect } from "react";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { S3LinkModel } from "@us3r-network/data-model";

import { LoginButton } from "@us3r-network/profile";

export const CERAMIC_TESTNET_HOST = "https://gcp-ceramic-testnet-dev.s3.xyz";

const s3Link = new S3LinkModel(CERAMIC_TESTNET_HOST);

function App() {
  const session = useSession();
  const [currLinkId, setCurrLinkId] = React.useState<string>("");

  const queryPersonal = useCallback(async () => {
    const resp = await s3Link.queryPersonalLinks({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.linkList);
  }, []);

  const queryLinkList = useCallback(async () => {
    const resp = await s3Link.queryLinks({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.linkIndex);
  }, []);

  const createLink = useCallback(async () => {
    if (!session) return;
    s3Link.authComposeClient(session);
    const resp = await s3Link.createLink({
      url: "https://s3.xyz",
      type: "testType",
      title: "testTitle",
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createLink);
    if (resp.data?.createLink?.document.id) {
      setCurrLinkId(resp.data?.createLink?.document.id);
    }
  }, [session]);

  const createLinkComment = useCallback(async () => {
    if (!currLinkId) throw new Error("currLinkId is empty");
    const resp = await s3Link.createComment({
      linkID: currLinkId,
      text: "link comment text",
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createComment);
  }, [currLinkId]);

  const queryPersonalLinkComments = useCallback(async () => {
    const resp = await s3Link.queryPersonalComments({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.commentList);
  }, []);

  const createLinkVote = useCallback(async () => {
    if (!currLinkId) throw new Error("currLinkId is empty");
    const resp = await s3Link.createVote({
      linkID: currLinkId,
      type: "UP_VOTE",
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createVote);
  }, [currLinkId]);

  const queryPersonalLinkVotes = useCallback(async () => {
    const resp = await s3Link.queryPersonalVotes({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.voteList);
  }, []);

  const createLinkFavor = useCallback(async () => {
    if (!currLinkId) throw new Error("currLinkId is empty");
    const resp = await s3Link.createFavor({
      linkID: currLinkId,
      revoke: false,
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createFavor);
  }, [currLinkId]);

  const queryPersonalLinkFavors = useCallback(async () => {
    const resp = await s3Link.queryPersonalFavors({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.favorList);
  }, []);

  const createLinkScore = useCallback(async () => {
    if (!currLinkId) throw new Error("currLinkId is empty");
    const resp = await s3Link.createScore({
      linkID: currLinkId,
      text: "string",
      value: 10,
    });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.createScore);
  }, [currLinkId]);

  const queryPersonalLinkScores = useCallback(async () => {
    const resp = await s3Link.queryPersonalScores({ first: 10 });
    if (resp.errors) throw new Error(resp.errors[0].message);
    console.log(resp.data?.viewer.scoreList);
  }, []);

  useEffect(() => {
    if (!session) {
      s3Link.resetComposeClient();
      return;
    }

    s3Link.authComposeClient(session);
  }, [session]);

  return (
    <div className="App">
      <LoginButton />
      <div>
        <button onClick={createLink}>create Link</button>
        <button onClick={queryPersonal}>query Personal</button>
        <button onClick={queryLinkList}>query Link List</button>
      </div>
      <div>
        <button onClick={createLinkComment}>create Link Comment</button>
        <button onClick={queryPersonalLinkComments}>
          query Personal Link Comments
        </button>
      </div>
      <div>
        <button onClick={createLinkVote}>create Link Vote</button>
        <button onClick={queryPersonalLinkVotes}>
          query Personal Link Votes
        </button>
      </div>
      <div>
        <button onClick={createLinkFavor}>create Link Favor</button>
        <button onClick={queryPersonalLinkFavors}>
          query Personal Link Favors
        </button>
      </div>
      <div>
        <button onClick={createLinkScore}>create Link Score</button>
        <button onClick={queryPersonalLinkScores}>
          query Personal Link Scores
        </button>
      </div>
    </div>
  );
}

export default App;
