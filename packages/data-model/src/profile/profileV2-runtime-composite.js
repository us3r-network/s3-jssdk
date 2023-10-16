// This is an auto-generated file, do not edit manually
export const definition = {
  models: {
    Profile: {
      id: "kjzl6hvfrbw6c8qj2r0l59n7zu6g1i7bdw6nswexyy3gbpybn6pllxhqfn9dud3",
      accountRelation: { type: "single" },
    },
    BioLink: {
      id: "kjzl6hvfrbw6c5ctgt9xvj23sr6vokrtmvuokegz5teojtr6nny5oxhcd5x3p7d",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    ProfileWallet: {
      chain: {
        type: "reference",
        refType: "enum",
        refName: "ProfileChainType",
        required: false,
      },
      address: { type: "string", required: true },
      primary: { type: "boolean", required: true },
    },
    Profile: {
      bio: { type: "string", required: false },
      name: { type: "string", required: true, indexed: true },
      tags: {
        type: "list",
        required: false,
        item: { type: "string", required: false },
        indexed: true,
      },
      avatar: { type: "string", required: false },
      wallets: {
        type: "list",
        required: false,
        item: {
          type: "reference",
          refType: "object",
          refName: "ProfileWallet",
          required: false,
        },
        indexed: true,
      },
      version: { type: "view", viewType: "documentVersion" },
      bioLinksCount: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryCount",
          model:
            "kjzl6hvfrbw6c5ctgt9xvj23sr6vokrtmvuokegz5teojtr6nny5oxhcd5x3p7d",
          property: "bioLinkID",
        },
      },
      bioLinks: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "queryConnection",
          model:
            "kjzl6hvfrbw6c5ctgt9xvj23sr6vokrtmvuokegz5teojtr6nny5oxhcd5x3p7d",
          property: "bioLinkID",
        },
      },
    },
    BioLink: {
      data: { type: "string", required: false },
      handle: { type: "string", required: true, indexed: true },
      network: { type: "string", required: false, indexed: true },
      platform: { type: "string", required: true, indexed: true },
      profileID: { type: "streamid", required: true },
      creator: { type: "view", viewType: "documentAccount" },
      profile: {
        type: "view",
        viewType: "relation",
        relation: {
          source: "document",
          model:
            "kjzl6hvfrbw6c8qj2r0l59n7zu6g1i7bdw6nswexyy3gbpybn6pllxhqfn9dud3",
          property: "profileID",
        },
      },
      version: { type: "view", viewType: "documentVersion" },
    },
  },
  enums: { ProfileChainType: ["EVM", "SOLANA", "APTOS", "SUI", "ATOM"] },
  accountData: {
    profile: { type: "node", name: "Profile" },
    bioLinkList: { type: "connection", name: "BioLink" },
  },
};
