export const profilesSchema = `
enum ChainType {
  EVM
  SOLANA
}

type Wallet
{
  chain: ChainType!
  address: String! @string(minLength: 20, maxLength: 60)
  primary: Boolean!
}

type Profile
  @createModel(
    accountRelation: SINGLE,
    description: "profile for us3r-network"
  ) {
  version: CommitID! @documentVersion
  name: String! @string(minLength: 3, maxLength: 100)
  bio: String @string(minLength: 3, maxLength: 200)
  avatar: String @string(maxLength: 1000)
  tags: [String!] @string(maxLength: 60) @list(maxLength:20)
  wallets: [Wallet!] @list(maxLength:20)
}`;
