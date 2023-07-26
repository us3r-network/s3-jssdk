import { Profile, WalletChainType } from "../../src/profile/index";
// import type { ExecutionResult } from "graphql";

type GraphqlResult<T> = {
  data?: T;
  error?: { message: string }[];
};
export const WalletParams = (props: Partial<{ Wallet: WalletChainType }>) => {};

export const CreateProfileParams = (props: Partial<Profile>) => {};
export const CreateProfileReturns = (
  props: GraphqlResult<{
    createProfile: Profile;
  }>
) => {};

export const UpdateProfileParams = (props: Partial<Profile>) => {};
export const UpdateProfileReturns = (
  props: GraphqlResult<{ updateProfile: Profile }>
) => {};

export const QueryProfileParams = (props: {}) => {};
export const QueryProfileReturns = (
  props: GraphqlResult<{ viewer: { profile: Profile } }>
) => {};

export const QueryProfileWithDIDParams = (props: { did: string }) => {};
export const QueryProfileWithDIDReturns = (
  props: GraphqlResult<{ id: string; profile: Profile }>
) => {};
