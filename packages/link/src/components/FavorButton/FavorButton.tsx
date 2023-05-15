import { useCallback, useMemo } from "react";
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
import { useLink } from "../../hooks/useLink";

export interface FavorButtonIncomingProps {
  linkId: string;
  onSuccessfullyFavor?: () => void;
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

export function FavorButton({
  linkId,
  onSuccessfullyFavor,
  children,
  ...props
}: FavorButtonProps) {
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

  const findCurrUserFavor = useMemo(() => {
    if (!link?.favors || !session) return null;
    return link.favors?.edges?.find(
      (edge) => edge?.node?.creator?.id === session?.id
    );
  }, [link, session]);

  const isFavored = !!findCurrUserFavor && !findCurrUserFavor?.node?.revoke;

  const isFavoring = useMemo(
    () => favoringLinkIds.has(linkId),
    [favoringLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isFavoring, [link, isFavoring]);

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
      if (onSuccessfullyFavor) onSuccessfullyFavor();
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
    onSuccessfullyFavor,
  ]);

  const businessProps = {
    "data-us3r-component": "FavorButton",
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
