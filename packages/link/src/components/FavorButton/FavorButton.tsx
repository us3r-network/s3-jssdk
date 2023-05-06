import { useCallback, useEffect, useMemo } from "react";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { getS3LinkModel, useLinkState } from "../../LinkStateProvider";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../store";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { FavorButtonChildren } from "./FavorButtonChildren";

export interface FavorButtonIncomingProps {
  linkId: string;
}
export interface FavorButtonRenderProps {
  isAuthenticated: boolean;
  isFavored: boolean;
  isFavoring: boolean;
  isDisabled: boolean;
  favorsCount: number;
}
export interface FavorButtonProps
  extends ChildrenRenderProps<
      AriaButtonProps,
      ButtonRenderProps & FavorButtonRenderProps
    >,
    FavorButtonIncomingProps {}

export function FavorButton({ linkId, children, ...props }: FavorButtonProps) {
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
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

  const findCurrUserFavor = useMemo(() => {
    if (!link?.favors || !session) return null;
    return link.favors?.edges?.find(
      (edge) => edge?.node?.creator?.id === session?.id
    );
  }, [link?.favors, session]);

  const isFavored = !!findCurrUserFavor && !findCurrUserFavor?.node?.revoke;

  const isFavoring = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isFavoring, [link, isFavoring]);

  useEffect(() => {
    (async () => {
      if (isFavoring) return;
      if (link) return;
      if (!s3LinkModalInitialed || !s3LinkModel) return;
      const res = await s3LinkModel.queryLink(linkId);
      const data = res.data?.node;
      if (!data) return;
      setOneInCacheLinks(data);
    })();
  }, [isFavoring, link, s3LinkModalInitialed, linkId, setOneInCacheLinks]);

  const onFavor = useCallback(async () => {
    try {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
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
    isDisabled,
    session,
    s3LinkModalAuthed,
    linkId,
    findCurrUserFavor,
    addOneToFavoringLinkIds,
    removeOneFromFavoringLinkIds,
    addFavorToCacheLinks,
    updateFavorInCacheLinks,
  ]);

  const businessProps = {
    "data-us3r-favorbutton": "",
    "data-authenticated": isAuthenticated || undefined,
    "data-favored": isFavored || undefined,
    "data-favoring": isFavoring || undefined,
    "data-disabled": isDisabled || undefined,
    isDisabled,
    onClick: onFavor,
  };

  const businessRenderProps = {
    isAuthenticated,
    isFavored,
    isFavoring,
    isDisabled,
    favorsCount: link?.favorsCount || 0,
  };

  const defaultChildren = useMemo(
    () => <FavorButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <Button {...props} {...businessProps}>
      {(buttonProps) =>
        childrenRender(
          children,
          { ...buttonProps, ...businessRenderProps },
          defaultChildren
        )
      }
    </Button>
  );
}
