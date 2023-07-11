import { Mutate, StoreApi, UseBoundStore, create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { enableMapSet } from "immer";
import { FavorSlice, createFavorSlice } from "./favor";
import { VoteSlice, createVoteSlice } from "./vote";
import { CommentSlice, createCommentSlice } from "./comment";
import { ScoreSlice, createScoreSlice } from "./score";
import {
  PersonalFavorsSlice,
  createPersonalFavorsSlice,
} from "./personalFavors";
import {
  PersonalScoresSlice,
  createPersonalScoresSlice,
} from "./personalScores";

enableMapSet();

interface State
  extends FavorSlice,
    VoteSlice,
    CommentSlice,
    ScoreSlice,
    PersonalFavorsSlice,
    PersonalScoresSlice {}

type Store = UseBoundStore<Mutate<StoreApi<State>, [["zustand/immer", never]]>>;
export const useStore: Store = create<State>()(
  immer<State>((...a) => ({
    ...createFavorSlice(...a),
    ...createVoteSlice(...a),
    ...createCommentSlice(...a),
    ...createScoreSlice(...a),
    ...createPersonalFavorsSlice(...a),
    ...createPersonalScoresSlice(...a),
  }))
);
