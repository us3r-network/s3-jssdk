import { useEffect, useMemo } from "react";
import { useStore } from "../store";
import {
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";

export const usePersonalFavors = (opts?: {
  onSuccessfullyFetch?: () => void;
  onFailedFetch?: (errMsg: string) => void;
}) => {
  const s3LinkModel = getS3LinkModel();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();
  const isBlockFetchPersonalFavors = useStore(
    (state) => state.isBlockFetchPersonalFavors
  );
  const setIsBlockFetchPersonalFavors = useStore(
    (state) => state.setIsBlockFetchPersonalFavors
  );
  const personalFavors = useStore((state) => state.personalFavors);
  const setAllInPersonalFavors = useStore(
    (state) => state.setAllInPersonalFavors
  );
  const isFetchingPersonalFavors = useStore(
    (state) => state.isFetchingPersonalFavors
  );
  const setIsFetchingPersonalFavors = useStore(
    (state) => state.setIsFetchingPersonalFavors
  );

  useEffect(() => {
    (async () => {
      if (isBlockFetchPersonalFavors) return;
      if (isFetchingPersonalFavors) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed || !s3LinkModel)
        return;
      try {
        setIsFetchingPersonalFavors(true);
        const res = await s3LinkModel.queryPersonalFavors({ first: 1000 });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const favors =
          res.data?.viewer?.favorList?.edges
            ?.filter((edge) => !!edge?.node)
            .map((edge) => edge?.node) || [];
        setAllInPersonalFavors(favors);
      } catch (error) {
        const errMsg = (error as any)?.message;
        if (opts?.onFailedFetch) opts.onFailedFetch(errMsg);
      } finally {
        setIsBlockFetchPersonalFavors(true);
        setIsFetchingPersonalFavors(false);
      }
    })();
  }, [
    isBlockFetchPersonalFavors,
    isFetchingPersonalFavors,
    isAuthenticated,
    session,
    s3LinkModalAuthed,
    setIsFetchingPersonalFavors,
    setIsBlockFetchPersonalFavors,
    setAllInPersonalFavors,
    opts?.onSuccessfullyFetch,
    opts?.onFailedFetch,
  ]);

  const personalFavorsAry = useMemo(
    () => Array.from(personalFavors.values()),
    [personalFavors]
  );

  return {
    isFetching: isFetchingPersonalFavors,
    personalFavors: personalFavorsAry,
  };
};
