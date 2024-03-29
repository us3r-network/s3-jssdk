import { useEffect, useMemo } from "react";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";

export const usePersonalScores = (opts?: {
  onSuccessfullyFetch?: () => void;
  onFailedFetch?: (errMsg: string) => void;
}) => {
  const s3LinkModel = getS3LinkModel();
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
      if (!session || !s3LinkModalAuthed || !s3LinkModel) return;
      try {
        setIsFetchingPersonalScores(true);
        const res = await s3LinkModel.queryPersonalScores({ first: 1000 });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const scores =
          res.data?.viewer?.scoreList?.edges
            ?.filter((edge) => !!edge?.node && !edge.node?.revoke)
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
    session,
    s3LinkModalAuthed,
    setIsFetchingPersonalScores,
    setIsBlockFetchPersonalScores,
    setAllInPersonalScores,
    opts?.onSuccessfullyFetch,
    opts?.onFailedFetch,
  ]);

  const personalScoresAry = useMemo(
    () => Array.from(personalScores.values()),
    [personalScores]
  );

  return {
    isFetching: isFetchingPersonalScores,
    personalScores: personalScoresAry,
  };
};
