/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-19 11:24:59
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 12:01:34
 * @FilePath: /s3-jssdk/packages/link/src/components/Score/reviews/ScoreReviewsContext.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createContext, useContext } from "react";
import { Link, Score } from "@us3r-network/data-model";

export interface ScoreReviewsContextValue {
  linkId: string;
  link?: Link;
  isLoading: boolean;
  scores: Score[];
}

export const ScoreReviewsContext =
  createContext<ScoreReviewsContextValue | null>(null);

export function useScoreReviewsState() {
  const context = useContext(ScoreReviewsContext);
  if (!context) {
    throw new Error(
      "useScoreReviewsState can only be used within the ScoreReviews component"
    );
  }
  return context;
}

export interface ScoreReviewsItemContextValue {
  data: Score;
  isLoginUserScore: boolean;
}
export const ScoreReviewsItemContext =
  createContext<ScoreReviewsItemContextValue>(null!);

export function useScoreReviewsItemState() {
  const context = useContext(ScoreReviewsItemContext);
  if (!context) {
    throw new Error(
      "useScoreReviewsItemState can only be used within the ScoreReviews.Item component"
    );
  }
  return context;
}
