import { ButtonHTMLAttributes, useCallback, useEffect, useMemo } from "react";
import ButtonLoading from "../common/ButtonLoading/ButtonLoading";
import { getS3LinkModel, useLinkState } from "../../LinkStateProvider";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../store";

export type FavorButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  linkId: string;
  className?: string;
  loadingClassName?: string;
  favorClassName?: string;
  unfavorClassName?: string;
  countClassName?: string;
};

export default function FavorButton({
  linkId,
  className = "us3r-FavorButton",
  loadingClassName = "us3r-FavorButton__loading",
  favorClassName = "us3r-FavorButton__favor",
  unfavorClassName = "us3r-FavorButton__unfavor",
  countClassName = "us3r-FavorButton__count",
  ...otherProps
}: FavorButtonProps) {
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalInitialed, s3LinkModalAuthed } = useLinkState();

  const cacheLinks = useStore((state) => state.cacheLinks);
  const favoringLinkIds = useStore((state) => state.favoringLinkIds);
  const setOneInCacheLinks = useStore((state) => state.setOneInCacheLinks);
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

  const link = useMemo(() => cacheLinks.get(linkId), [cacheLinks, linkId]);
  const loading = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  useEffect(() => {
    (async () => {
      if (loading) return;
      if (link) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const res = await s3LinkModel.queryLink(linkId);
      const data = res.data?.node;
      if (!data) return;
      setOneInCacheLinks(data);
    })();
  }, [loading, link, s3LinkModalInitialed, linkId, setOneInCacheLinks]);

  const findCurrUserFavor = useMemo(() => {
    if (!link || !session) return null;
    return link.favors?.edges?.find(
      (edge) => edge?.node?.creator?.id === session?.id
    );
  }, [link, session]);

  const onFavor = useCallback(async () => {
    try {
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      if (!link) return;
      addOneToFavoringLinkIds(linkId);
      if (findCurrUserFavor) {
        // update favor
        const id = findCurrUserFavor.node.id;
        const revoke = !findCurrUserFavor.node.revoke;
        await s3LinkModel?.updateFavor(id, { revoke });
        // update store
        updateFavorInCacheLinks(linkId, id, { revoke });
      } else {
        // create favor
        const res = await s3LinkModel?.createFavor({
          linkID: linkId,
          revoke: false,
        });
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
    } catch (error) {
      console.error(error);
    } finally {
      removeOneFromFavoringLinkIds(linkId);
    }
  }, [
    session,
    s3LinkModalAuthed,
    link,
    linkId,
    findCurrUserFavor,
    addOneToFavoringLinkIds,
    removeOneFromFavoringLinkIds,
    addFavorToCacheLinks,
    updateFavorInCacheLinks,
  ]);

  const isFavored = findCurrUserFavor && !findCurrUserFavor?.node?.revoke;

  return (
    <button className={className} onClick={onFavor} {...otherProps}>
      {(loading && <ButtonLoading className={loadingClassName} />) || (
        <>
          {isFavored ? (
            <FavorWhiteIcon className={unfavorClassName} />
          ) : (
            <FavorIcon className={favorClassName} />
          )}
        </>
      )}
      <span className={countClassName}>{link?.favorsCount || 0}</span>
    </button>
  );
}

function FavorIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" />
    </svg>
  );
}

function FavorWhiteIcon({ ...props }: ButtonHTMLAttributes<HTMLOrSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#FFFFFF"
      {...props}
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}
