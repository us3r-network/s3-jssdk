import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import S3Model from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
import { Vote } from "./vote";
import { Favor } from "./favor";
import { Score } from "./score";

export type Creator = {
  id: string;
};

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
}
