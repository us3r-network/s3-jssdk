import { useCallback, useMemo } from "react";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLinkFavors } from "./useLinkFavors";
import { getLinkWithLinkModel } from "../utils/getLinkWithLinkModel";
import { Link } from "@us3r-network/data-model";

export const useFavorAction = (
  linkId: string,
  unknownLinkParam?: Link | undefined,
  opts?: {
    onSuccessfullyFavor?: (isFavored:boolean, linkId: string) => void;
    onFailedFavor?: (errMsg: string) => void;
  }
) => {
  const { favors, isFetched } = useLinkFavors(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const favoringLinkIds = useStore((state) => state.favoringLinkIds);
  const upsertOneInCacheLinkFavors = useStore(
    (state) => state.upsertOneInCacheLinkFavors
  );
  const addOneToFavoringLinkIds = useStore(
    (state) => state.addOneToFavoringLinkIds
  );
  const removeOneFromFavoringLinkIds = useStore(
    (state) => state.removeOneFromFavoringLinkIds
  );
  const addFavorToCacheLinkFavors = useStore(
    (state) => state.addFavorToCacheLinkFavors
  );
  const updateFavorInCacheLinkFavors = useStore(
    (state) => state.updateFavorInCacheLinkFavors
  );

  const addOneToPersonalFavors = useStore(
    (state) => state.addOneToPersonalFavors
  );
  const removeOneFromPersonalFavors = useStore(
    (state) => state.removeOneFromPersonalFavors
  );

  const findCurrUserFavor = useMemo(
    () =>
      !session
        ? null
        : favors.find((node) => node?.creator?.id === session?.id),
    [favors, session]
  );

  const isFavored = useMemo(
    () => !!findCurrUserFavor && !findCurrUserFavor?.revoke,
    [findCurrUserFavor]
  );

  const isFavoring = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  const isDisabled = useMemo(
    () => (!isFetched && !unknownLinkParam?.url) || isFavoring,
    [isFetched, isFavoring, unknownLinkParam?.url]
  );

  const onFavor = useCallback(async () => {
    if (isDisabled) return;
    if (!session || !s3LinkModalAuthed) {
      signIn();
      return;
    }
    if (!s3LinkModel) return;
    try {
      // create link if not exist
      if (!linkId && unknownLinkParam && unknownLinkParam.url && unknownLinkParam.type) {
        const unknownLink = await s3LinkModel?.fetchLink(unknownLinkParam);
        if (unknownLink && unknownLink?.id){
          linkId = unknownLink?.id;
        }
      }
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
        updateFavorInCacheLinkFavors(linkId, id, { revoke });
        if (revoke) {
          removeOneFromPersonalFavors(id);
        } else {
          const linkRes = await getLinkWithLinkModel(s3LinkModel, linkId);
          const link = linkRes.data?.node;
          addOneToPersonalFavors({ ...findCurrUserFavor, link });
        }
        if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor(!revoke, linkId);
      } else {
        // create favor
        // console.log('start favor', linkId)
        const res = await s3LinkModel?.createFavor({
          linkID: linkId,
          revoke: false,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const id = res?.data?.createFavor.document.id;
        // console.log('favoring ', res, id)
        if (id) {
          const linkRes = await getLinkWithLinkModel(s3LinkModel, linkId);
          const link = linkRes.data?.node;
          const favorData = {
            id,
            linkID: linkId,
            revoke: false,
            createAt: new Date().toTimeString(),
            modifiedAt: new Date().toTimeString(),
            creator: {
              id: session.id,
            },
            link,
          };
          // update store
          addFavorToCacheLinkFavors(linkId, favorData);
          // console.log('addFavorToCacheLinkFavors done! ', favorData)
          addOneToPersonalFavors(favorData);
          // console.log('addOneToPersonalFavors done! ', favorData)
        }
        if (opts?.onSuccessfullyFavor) opts.onSuccessfullyFavor(true, linkId);
      }
    } catch (error) {
      const errMsg = (error as any)?.message;
      if (opts?.onFailedFavor) opts.onFailedFavor(errMsg);
    } finally {
      removeOneFromFavoringLinkIds(linkId);
    }
  }, [
    isDisabled,
    session,
    s3LinkModalAuthed,
    signIn,
    linkId,
    unknownLinkParam?.url,
    unknownLinkParam?.type,
    findCurrUserFavor,
    addOneToFavoringLinkIds,
    removeOneFromFavoringLinkIds,
    addFavorToCacheLinkFavors,
    updateFavorInCacheLinkFavors,
    opts?.onSuccessfullyFavor,
    opts?.onFailedFavor,
    addOneToPersonalFavors,
    removeOneFromPersonalFavors,
  ]);

  return { isFavored, isFavoring, isDisabled, onFavor };
};

