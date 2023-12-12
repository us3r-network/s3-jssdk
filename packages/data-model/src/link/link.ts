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

export type LinkField =
  | "url"
  | "data"
  | "type"
  | "title"
  | "createAt"
  | "modifiedAt"
  | "votesCount"
  | "commentsCount"
  | "favorsCount"
  | "scoresCount"
  | "votes"
  | "comments"
  | "favors"
  | "scores";

const DEFAULT_LINK_FIELDS: LinkField[] = [
  "url",
  "data",
  "type",
  "title",
  "createAt",
  "modifiedAt",
];

const ALL_LINK_FIELDS: LinkField[] = [
  ...DEFAULT_LINK_FIELDS,
  "votesCount","commentsCount","favorsCount","scoresCount",
  "votes","comments","favors","scores"
];

export class S3LinkModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as unknown as RuntimeCompositeDefinition)
    );
  }

  public async executeQuery<T>(query: string, variables?: any) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<T>(query, variables);
    return res;
  }

  /**
   * link
   */
  public async queryPersonalLinks({
    filters = {"where":{"url":{"isNull":false}}},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
    linkFields = DEFAULT_LINK_FIELDS,
  }: {
    filters?: any;
    sort?: any;
    first?: number;
    after?: string;
    linkFields?: LinkField[];
  }) {
    const composeClient = this.composeClient;
    const linkListData = await composeClient.executeQuery<{
      viewer: {
        linkList: Page<Link>;
      };
    }>(`
      query ($input: LinkFiltersInput!, $sortInput: LinkSortingInput!) {
        viewer {
          linkList(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
            edges {
              node {
                id,
                creator {
                  id
                },
                ${linkFields.join(",")}
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });
    return linkListData;
  }

  public async queryLinks({
    filters = {"where":{"url":{"isNull":false}}},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
    linkFields = DEFAULT_LINK_FIELDS,
  }: {
    filters?: any;
    sort?: any;
    first?: number;
    after?: string;
    linkFields?: LinkField[];
  }) {
    // console.log("queryLinks", filters, sort, first, after, linkFields);
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      linkIndex: Page<Link>;
    }>(`
      query ($input: LinkFiltersInput!, $sortInput: LinkSortingInput!) {
        linkIndex(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
          edges {
            node {
              id,
              creator {
                id
              },
              ${linkFields.join(",")}
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });

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

  public async upsertLink(link: Link) {
    // console.log("upsertLink", link)
    const resp = await this.queryLinks(
      { 
        filters: {
            "where" : {
              "url" : { 
                "equalTo" : link.url
              },
              
              "type" : { 
                "equalTo" : link.type
              }
            },
          },
        first: 20 
      }
    );
    const existLinkIndex = resp.data?.linkIndex;
    if (existLinkIndex && existLinkIndex.edges.length > 0) {
      const existLink = existLinkIndex.edges[0].node;
      if (existLink?.id)
        return this.updateLink(existLink.id, link);
    }
    return this.createLink(link);
  }

  public async queryLink(
    id: string,
    linkFields: LinkField[] = ALL_LINK_FIELDS
  ) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      node: Link;
    }>(`
      query {
        node(id: "${id}") {
          id
          ...on Link {
            id,
            creator {
              id
            },
            ${linkFields.join(",")}
          }
        }
      }
    `);

    return res;
  }
  
  public async fetchLink(link: Link) {
    try {
      const filters = {
        "where" : {
          "url" : { 
            "equalTo" : link.url
          },
          "type" : { 
            "equalTo" : link.type
          }
        },
      };
      const resp = await this.queryLinks(
        { 
          filters
        }
      );
      if (resp.data?.linkIndex.edges.length === 0) {
        link.createAt = new Date().toISOString();
        const newLinkResp = await this.createLink(link);
        const linkId = newLinkResp.data?.createLink.document.id;
        if (linkId){
          const newLink = await this.queryLink(linkId, DEFAULT_LINK_FIELDS);
          return newLink.data?.node;
        }else{
          return Promise.reject("createLink failed");
        }
      }else{
        return resp.data?.linkIndex.edges[0].node;
      }
    } catch (error) {
      console.log("fetchLink", error);
      return Promise.reject(error);
    }
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
    filters = {"or":[{"where":{"revoke":{"isNull":true}},},{"where":{"revoke":{"equalTo":false}},}]},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
  }: {
    filters?: any;
    sort?: any;
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        voteList: Page<Vote>;
      };
    }>(`
      query ($input: VoteFiltersInput!, $sortInput: VoteSortingInput!) {
        viewer {
          voteList(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });
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
    filters = {"or":[{"where":{"revoke":{"isNull":true}},},{"where":{"revoke":{"equalTo":false}},}]},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
  }: {
    filters?: any;
    sort?: any;
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        favorList: Page<Favor>;
      };
    }>(`
      query ($input: FavorFiltersInput!, $sortInput: FavorSortingInput!) {
        viewer {
          favorList(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });
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
    filters = {"or":[{"where":{"revoke":{"isNull":true}},},{"where":{"revoke":{"equalTo":false}},}]},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
  }: {
    filters?: any;
    sort?: any;
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        commentList: Page<Comment>;
      };
    }>(`
      query ($input: CommentFiltersInput!, $sortInput: CommentSortingInput!) {
        viewer {
          commentList(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });
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
    filters = {"or":[{"where":{"revoke":{"isNull":true}},},{"where":{"revoke":{"equalTo":false}},}]},
    sort = {"createAt":"DESC"},
    first = 10,
    after = "",
  }: {
    filters?: any;
    sort?: any;
    first: number;
    after?: string;
  }) {
    const composeClient = this.composeClient;
    const res = await composeClient.executeQuery<{
      viewer: {
        scoreList: Page<Score>;
      };
    }>(`
      query ($input: ScoreFiltersInput!, $sortInput: ScoreSortingInput!) {
        viewer {
          scoreList(filters: $input, sorting: $sortInput, first: ${first}, after: "${after}") {
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
    `, 
    {
      input: filters,
      sortInput: sort,
    });
    return res;
  }
}
