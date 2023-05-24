import { useEffect } from "react";
import { useStore } from "../store";
import {
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";

export const usePersonalScores = (opts?: {
  onSuccessfullyFetch?: () => void;
  onFailedFetch?: (errMsg: string) => void;
}) => {
  const s3LinkModel = getS3LinkModel();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const isBlockFetchPersonalScores = useStore(
    (state) => state.isBlockFetchPersonalScores
  );
  const setIsBlockFetchPersonalScores = useStore(
    (state) => state.setIsBlockFetchPersonalScores
  );
  const personalScores = useStore((state) => state.personalScores);
  const setAllInPersonalScores = useStore(
    (state) => state.setAllInPersonalScores
  );
  const isFetchingPersonalScores = useStore(
    (state) => state.isFetchingPersonalScores
  );
  const setIsFetchingPersonalScores = useStore(
    (state) => state.setIsFetchingPersonalScores
  );

  useEffect(() => {
    (async () => {
      if (isBlockFetchPersonalScores) return;
      if (isFetchingPersonalScores) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed || !s3LinkModel)
        return;
      try {
        setIsFetchingPersonalScores(true);
        const res = await s3LinkModel.queryPersonalScores({ first: 1000 });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const scores =
          res.data?.viewer?.scoreList?.edges
            ?.filter((edge) => !!edge?.node)
            ?.map((edge) => edge?.node) || [];
        setAllInPersonalScores(scores);
      } catch (error) {
        const errMsg = (error as any)?.message;
        if (opts?.onFailedFetch) opts.onFailedFetch(errMsg);
      } finally {
        setIsBlockFetchPersonalScores(true);
        setIsFetchingPersonalScores(false);
      }
    })();
  }, [
    isBlockFetchPersonalScores,
    isFetchingPersonalScores,
    isAuthenticated,
    session,
    s3LinkModalAuthed,
    setIsFetchingPersonalScores,
    setIsBlockFetchPersonalScores,
    setAllInPersonalScores,
    opts?.onSuccessfullyFetch,
    opts?.onFailedFetch,
  ]);
  return {
    isFetching: isFetchingPersonalScores,
    personalScores: Array.from(personalScores.values()),
  };
};
