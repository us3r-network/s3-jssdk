import { create } from "zustand";
import { LinkSlice, createLinkSlice } from "./link";
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

interface Store
  extends LinkSlice,
    FavorSlice,
    VoteSlice,
    CommentSlice,
    ScoreSlice,
    PersonalFavorsSlice,
    PersonalScoresSlice {}

export const useStore = create<Store>()((...a) => ({
  ...createLinkSlice(...a),
  ...createFavorSlice(...a),
  ...createVoteSlice(...a),
  ...createCommentSlice(...a),
  ...createScoreSlice(...a),
  ...createPersonalFavorsSlice(...a),
  ...createPersonalScoresSlice(...a),
}));
