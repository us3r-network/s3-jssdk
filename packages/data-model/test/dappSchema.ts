export const dappSchema = `
type SocialLink
{
  platform: String! @string(minLength: 1, maxLength: 60)
  url: URI!
}

type Dapp
  @createModel(
    accountRelation: LIST,
    description: "s3 dapp for us3r-network"
  ) {
  version: CommitID! @documentVersion
  name: String! @string(minLength: 3, maxLength: 100)
  description: String @string(minLength: 3, maxLength: 200)
  icon: URI
  url: URI
  tags: [String!] @string(maxLength: 60) @list(maxLength:20)
  socialLink: [SocialLink!] @list(maxLength:20)
  models: [StreamID!] @list(maxLength:100)
}
`;
