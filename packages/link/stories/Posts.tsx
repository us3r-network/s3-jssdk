import styled from "styled-components";
import { FavorButton, VoteButton } from "@us3r-network/link";
import { useState } from "react";
import { EXAMPLE_LINKID_1, EXAMPLE_LINKID_2 } from "./constants";
type Post = {
  linkId: string;
  title: string;
  content: string;
  img: string;
};

export default function Posts() {
  const posts = [
    {
      linkId: EXAMPLE_LINKID_1,
      title: "example post 1 title",
      content: "example post 1 content",
      img: "https://picsum.photos/600/300",
    },
    {
      linkId: EXAMPLE_LINKID_2,
      title: "example post 2 title",
      content: "example post 2 content",
      img: "https://picsum.photos/500/200",
    },
  ];
  const [activeLinkId, setActiveLinkId] = useState<string>(posts[0].linkId);
  const post = posts.find((item) => item.linkId === activeLinkId);
  return (
    <Wrapper>
      <PostNavList
        posts={posts}
        activeLinkId={activeLinkId}
        onChangeLinkId={setActiveLinkId}
      />
      {!!post && <PostDetail post={post} />}
    </Wrapper>
  );
}

function PostNavList({
  posts,
  activeLinkId,
  onChangeLinkId,
}: {
  posts: Post[];
  activeLinkId: string;
  onChangeLinkId: (linkId: string) => void;
}) {
  return (
    <PostNavListWrapper>
      {posts.map((post) => (
        <PostNavItem
          key={post.linkId}
          isActive={post.linkId === activeLinkId}
          onClick={() => onChangeLinkId(post.linkId)}
        >
          <PostNavTitle>{post.title}</PostNavTitle>
          <PostNavActions>
            <FavorButton linkId={post.linkId} />
            <VoteButton linkId={post.linkId} />
          </PostNavActions>
        </PostNavItem>
      ))}
    </PostNavListWrapper>
  );
}

function PostDetail({ post }: { post: Post }) {
  return (
    <PostDetailWrapper>
      <PostDetailTitle>{post.title}</PostDetailTitle>
      <PostDetailContent>
        <p>{post.content}</p>
        <img src={post.img} alt="content image" />
      </PostDetailContent>
      <PostDetailActions>
        <FavorButton linkId={post.linkId} />
        <VoteButton linkId={post.linkId} />
      </PostDetailActions>
    </PostDetailWrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  height: 60vh;
`;

// PostNavList
const PostNavListWrapper = styled.div`
  width: 300px;
  border-right: 1px solid #eee;
`;
const PostNavItem = styled.div<{ isActive: boolean }>`
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  cursor: pointer;
  background-color: ${({ isActive }) => (isActive ? "#eee" : "transparent")};
`;
const PostNavTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const PostNavActions = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: space-evenly;
`;

// PostDetail
const PostDetailWrapper = styled.div`
  width: 0px;
  flex: 1;
  display: flex;
  flex-direction: column;
`;
const PostDetailTitle = styled.div`
  font-size: 20px;
  font-weight: 500;
  padding: 20px;
  box-sizing: border-box;
  border-bottom: 1px solid #eee;
`;
const PostDetailContent = styled.div`
  height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
`;
const PostDetailActions = styled.div`
  border-top: 1px solid #eee;
  padding: 20px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-evenly;
`;
