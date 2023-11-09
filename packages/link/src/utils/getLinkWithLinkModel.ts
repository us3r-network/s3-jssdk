import { Link, S3LinkModel } from "@us3r-network/data-model";

export function getLinkWithLinkModel(s3LinkModel: S3LinkModel, linkId: string) {
  return s3LinkModel.executeQuery<{
    node: Link;
  }>(`
    query {
        node(id: "${linkId}") {
        ...on Link {
            id
            type
            url
            title
            data
            creator {
            id
            }
            createAt
        }
        }
    }
    `);
}
