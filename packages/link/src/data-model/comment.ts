import { RuntimeCompositeDefinition } from "@composedb/types";
import type { CeramicApi } from "@ceramicnetwork/common";
import { S3Model } from "@us3r-network/data-model";
import { Page } from "@ceramicnetwork/common";

import { definition as linkDefinition } from "./link-runtime-composite";
import { DateTime, Link, Creator } from ".";

export type Comment = {
  id: string;
  linkID: string;
  revoke: boolean;
  createAt: DateTime;
  modifiedAt: DateTime;
  link: Link;
  text: string;
  creator: Creator;
};

export type CommentInput = {
  text: string;
  linkID: string;
  revoke?: boolean;
  createAt?: DateTime;
  modifiedAt?: DateTime;
};

export class S3CommentModel extends S3Model {
  constructor(
    ceramic: CeramicApi | string,
    definition?: RuntimeCompositeDefinition
  ) {
    super(
      ceramic,
      definition ?? (linkDefinition as RuntimeCompositeDefinition)
    );
  }

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
}
