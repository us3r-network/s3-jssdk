import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLink } from "./useLink";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export const useFavorAction = (
  linkId: string,
  opts?: {
    onSuccessfullyFavor?: (isFavored: boolean) => void;
    onFailedFavor?: (errMsg: string) => void;
  }
) => {
  const { link } = useLink(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const favoringLinkIds = useStore((state) => state.favoringLinkIds);
  const addOneToFavoringLinkIds = useStore(
    (state) => state.addOneToFavoringLinkIds
  );
  const removeOneFromFavoringLinkIds = useStore(
    (state) => state.removeOneFromFavoringLinkIds
  );
  const addFavorToCacheLinks = useStore((state) => state.addFavorToCacheLinks);
  const updateFavorInCacheLinks = useStore(
    (state) => state.updateFavorInCacheLinks
  );

  const addOneToPersonalFavors = useStore(
    (state) => state.addOneToPersonalFavors
  );
  const removeOneFromPersonalFavors = useStore(
    (state) => state.removeOneFromPersonalFavors
  );

  const findCurrUserFavor = useMemo(
    () =>
      !link?.favors || !session
        ? null
        : link.favors?.edges?.find(
            (edge) => edge?.node?.creator?.id === session?.id
          )?.node,
    [link?.favors, session]
  );

  const isFavored = useMemo(
    () => !!findCurrUserFavor && !findCurrUserFavor?.revoke,
    [findCurrUserFavor]
  );

  const isFavoring = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isFavoring, [link, isFavoring]);

  const onFavor = useCallback(async () => {
    if (isDisabled) return;
    if (!isAuthenticated || !session || !s3LinkModalAuthed) {
      signIn();
      return;
    }
    try {
      addOneToFavoringLinkIds(linkId);
      if (findCurrUserFavor) {
        // update favor
        const id = findCurrUserFavor.id;
        const revoke = !findCurrUserFavor.revoke;
        const res = await s3LinkModel?.updateFavor(id, { revoke });

        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        // update store
        updateFavorInCacheLinks(linkId, id, { revoke });
        if (revoke) {
          removeOneFromPersonalFavors(id);
        } else {
          addOneToPersonalFavors({ ...findCurrUserFavor, link: link });
        }
        if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor(!revoke);
      } else {
        // create favor
        const res = await s3LinkModel?.createFavor({
          linkID: linkId,
          revoke: false,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const id = res?.data?.createFavor.document.id;
        if (id) {
          const favorData = {
            id,
            linkID: linkId,
            revoke: false,
            createAt: new Date().toTimeString(),
            modifiedAt: new Date().toTimeString(),
            creator: {
              id: session.id,
            },
          };
          // update store
          addFavorToCacheLinks(linkId, favorData);
          addOneToPersonalFavors({ ...favorData, link: link });
        }
        if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor(true);
      }
    } catch (error) {
      const errMsg = (error as any)?.message;
      if (opts?.onFailedFavor) opts.onFailedFavor(errMsg);
    } finally {
      removeOneFromFavoringLinkIds(linkId);
    }
  }, [
    isDisabled,
    isAuthenticated,
    session,
    s3LinkModalAuthed,
    signIn,
    linkId,
    link,
    findCurrUserFavor,
    addOneToFavoringLinkIds,
    removeOneFromFavoringLinkIds,
    addFavorToCacheLinks,
    updateFavorInCacheLinks,
    opts?.onSuccessfullyFavor,
    opts?.onFailedFavor,
    addOneToPersonalFavors,
    removeOneFromPersonalFavors,
  ]);

  return { isFavored, isFavoring, isDisabled, onFavor };
};
