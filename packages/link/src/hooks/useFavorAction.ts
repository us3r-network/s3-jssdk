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
    onSuccessfullyFavor?: () => void;
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

  const findCurrUserFavor =
    !link?.favors || !session
      ? null
      : link.favors?.edges?.find(
          (edge) => edge?.node?.creator?.id === session?.id
        );

  const isFavored = !!findCurrUserFavor && !findCurrUserFavor?.node?.revoke;

  const isFavoring = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isFavoring, [link, isFavoring]);

  const onFavor = useCallback(async () => {
    try {
      if (isDisabled) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      addOneToFavoringLinkIds(linkId);
      if (findCurrUserFavor) {
        // update favor
        const id = findCurrUserFavor.node.id;
        const revoke = !findCurrUserFavor.node.revoke;
        const res = await s3LinkModel?.updateFavor(id, { revoke });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        // update store
        updateFavorInCacheLinks(linkId, id, { revoke });
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
          // update store
          addFavorToCacheLinks(linkId, {
            id,
            linkID: linkId,
            revoke: false,
            createAt: new Date().toTimeString(),
            modifiedAt: new Date().toTimeString(),
            creator: {
              id: session.id,
            },
          });
        }
      }
      if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor();
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
    findCurrUserFavor,
    addOneToFavoringLinkIds,
    removeOneFromFavoringLinkIds,
    addFavorToCacheLinks,
    updateFavorInCacheLinks,
    opts?.onSuccessfullyFavor,
    opts?.onFailedFavor,
  ]);

  return { isFavored, isFavoring, isDisabled, onFavor };
};
