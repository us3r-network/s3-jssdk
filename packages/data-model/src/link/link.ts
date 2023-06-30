import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
import { Vote, VoteInput } from "./vote";
import { Favor, FavorInput } from "./favor";
import { Score, ScoreInput } from "./score";
import { Comment, CommentInput } from "./comment";
import { S3Model } from "../base";
import type { Creator } from "../base";

export type DateTime = string;

export type Link = {
  id?: string;
  creator?: Creator;
  url: string;
  type: string;
  title: string;
  data?: string;
  createAt?: DateTime;
  modifiedAt?: DateTime;
  votesCount?: number;
  commentsCount?: number;
  favorsCount?: number;
  scoresCount?: number;
  votes?: Page<Vote>;
  comments?: Page<Comment>;
  favors?: Page<Favor>;
  scores?: Page<Score>;
};

export class S3LinkModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as RuntimeCompositeDefinition)
    );
  }

  /**
   *
   */
  public async queryPersonalLinks({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const linkListData = await composeClient.executeQuery<{
      viewer: {
        linkList: Page<Link>;
      };
    }>(`
      query {
        viewer {
          linkList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                creator {
                  id
                }
                url
                data
                type
                title
                createAt
                modifiedAt
                votesCount
                commentsCount
                favorsCount
                scoresCount
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return linkListData;
  }

  public async queryPersonalLinksDesc({
    last = 10,
    before = "",
  }: {
    last: number;
    before?: string;
  }) {
    const composeClient = this.composeClient;
    const linkListData = await composeClient.executeQuery<{
      viewer: {
        linkList: Page<Link>;
      };
    }>(`
      query {
        viewer {
          linkList(last: ${last}, before: "${before}") {
            edges {
              node {
                id
                creator {
                  id
                }
                url
                data
                type
                title
                createAt
                modifiedAt
                votesCount
                commentsCount
                favorsCount
                scoresCount
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return linkListData;
  }

  public async queryLinks({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      linkIndex: Page<Link>;
    }>(`
      query {
        linkIndex(first: ${first}, after: "${after}") {
          edges {
            node {
              id
              creator {
                id
              }
              url
              data
              type
              title
              createAt
              modifiedAt
              votesCount
              commentsCount
              favorsCount
              scoresCount
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `);

    return res;
  }

  public async queryLinksDesc({
    last = 10,
    before = "",
  }: {
    last: number;
    before?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      linkIndex: Page<Link>;
    }>(`
      query {
        linkIndex(last: ${last}, before: "${before}") {
          edges {
            node {
              id
              creator {
                id
              }
              url
              data
              type
              title
              createAt
              modifiedAt
              votesCount
              commentsCount
              favorsCount
              scoresCount
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    `);

    return res;
  }

  public async createLink(link: Link) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation createLink($input: CreateLinkInput!) {
        createLink(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      createLink: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: { ...link, createAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async updateLink(linkId: string, link: Link) {
    const composeClient = this.composeClient;
    const createMutation = `
      mutation updateLink($input: UpdateLinkInput!) {
        updateLink(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const res = await composeClient.executeQuery<{
      updateLink: { document: { id: string } };
    }>(createMutation, {
      input: {
        id: linkId,
        content: { ...link, modifiedAt: new Date().toISOString() },
      },
    });

    return res;
  }

  public async queryLink(id: string) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      node: Link;
    }>(`
      query {
        node(id: "${id}") {
          id
          ...on Link {
            id
            creator {
              id
            }
            url
            data
            type
            title
            createAt
            modifiedAt
            votesCount
            commentsCount
            favorsCount
            scoresCount
            votes (first: 1000) {
              edges {
                node {
                  id
                  type
                  revoke
                  createAt
                  modifiedAt
                  creator {
                    id
                  }
                }
              }
            }
            comments (first: 1000) {
              edges {
                node {
                  id
                  text
                  revoke
                  createAt
                  modifiedAt
                  creator {
                    id
                  }
                }
              }
            }
            favors (first: 1000) {
              edges {
                node {
                  id
                  revoke
                  createAt
                  modifiedAt
                  creator {
                    id
                  }
                }
              }
            }
            scores (first: 1000) {
              edges {
                node {
                  id
                  text
                  value
                  revoke
                  createAt
                  modifiedAt
                  creator {
                    id
                  }
                }
              }
            }
          }
        }
      }
    `);

    return res;
  }

  /**
   * vote
   */
  public async createVote(input: VoteInput) {
    const createMutation = `
      mutation CreateVote($input: CreateVoteInput!) {
        createVote(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createVote: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...input,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateVote(id: string, input: Partial<VoteInput>) {
    const updateMutation = `
      mutation UpdateVote($input: UpdateVoteInput!) {
        updateVote(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateVote: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id,
        content: {
          ...input,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalVotes({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        voteList: Page<Vote>;
      };
    }>(`
      query {
        viewer {
          voteList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                type
                creator {
                    id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  title
                  createAt
                  creator {
                    id
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }

  /**
   * score
   */
  public async createScore(input: ScoreInput) {
    const createMutation = `
      mutation CreateScore($input: CreateScoreInput!) {
        createScore(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createScore: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...input,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateScore(id: string, input: Partial<ScoreInput>) {
    const updateMutation = `
      mutation UpdateScore($input: UpdateScoreInput!) {
        updateScore(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateScore: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id: id,
        content: {
          ...input,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalScores({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        scoreList: Page<Score>;
      };
    }>(`
      query {
        viewer {
          scoreList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                text
                value
                creator {
                  id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  title
                  createAt
                  creator {
                    id
                  }
                  url
                  data
                  type
                  
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }

  /**
   * comment
   */
  public async createComment(input: CommentInput) {
    const createMutation = `
      mutation CreateComment($input: CreateCommentInput!) {
        createComment(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createComment: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...input,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateComment(commentId: string, input: Partial<CommentInput>) {
    const updateMutation = `
      mutation UpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      updateComment: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id: commentId,
        content: {
          ...input,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalComments({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        commentList: Page<Comment>;
      };
    }>(`
      query {
        viewer {
          commentList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                text
                creator {
                  id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  title
                  createAt
                  creator {
                    id
                  }
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }

  /**
   * favor
   */
  public async createFavor(favorInput: FavorInput) {
    const createMutation = `
      mutation CreateFavor($input: CreateFavorInput!) {
        createFavor(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createFavor: { document: { id: string } };
    }>(createMutation, {
      input: {
        content: {
          ...favorInput,
          createAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async updateFavor(favorId: string, favorInput: Partial<FavorInput>) {
    const updateMutation = `
      mutation UpdateFavor($input: UpdateFavorInput!) {
        updateFavor(input: $input) {
          document {
            id
          }
        }
      }
    `;
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      createFavor: { document: { id: string } };
    }>(updateMutation, {
      input: {
        id: favorId,
        content: {
          ...favorInput,
          modifiedAt: new Date().toISOString(),
        },
      },
    });
    return res;
  }

  public async queryPersonalFavors({
    first = 10,
    after = "",
  }: {
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        favorList: Page<Favor>;
      };
    }>(`
      query {
        viewer {
          favorList(first: ${first}, after: "${after}") {
            edges {
              node {
                id
                creator {
                  id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  url
                  type
                  createAt
                  creator {
                    id
                  }
                  data
                  title
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }

  public async queryPersonalFavorsDesc({
    last = 10,
    before = "",
  }: {
    last: number;
    before?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        favorList: Page<Favor>;
      };
    }>(`
      query {
        viewer {
          favorList(last: ${last}, before: "${before}") {
            edges {
              node {
                id
                creator {
                  id
                }
                revoke
                createAt
                modifiedAt
                link {
                  id
                  url
                  type
                  createAt
                  creator {
                    id
                  }
                  data
                  title
                }
              }
            }
            pageInfo {
              hasNextPage
              hasPreviousPage
              startCursor
              endCursor
            }
          }
        }
      }
    `);
    return res;
  }
}
