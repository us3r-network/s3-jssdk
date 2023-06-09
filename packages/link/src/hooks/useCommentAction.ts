import { useCallback, useMemo } from "react";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLink } from "./useLink";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";

export const useCommentAction = (
  linkId: string,
  opts?: {
    onSuccessfullyComment?: () => void;
    onFailedComment?: (errMsg: string) => void;
  }
) => {
  const { link } = useLink(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const isAuthenticated = useIsAuthenticated();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const commentingLinkIds = useStore((state) => state.commentingLinkIds);
  const addOneToCommentingLinkIds = useStore(
    (state) => state.addOneToCommentingLinkIds
  );
  const removeOneFromCommentingLinkIds = useStore(
    (state) => state.removeOneFromCommentingLinkIds
  );
  const addCommentToCacheLinks = useStore(
    (state) => state.addCommentToCacheLinks
  );
  const updateCommentInCacheLinks = useStore(
    (state) => state.updateCommentInCacheLinks
  );

  const isCommenting = useMemo(
    () => commentingLinkIds.has(linkId),
    [commentingLinkIds, linkId]
  );

  const isDisabled = useMemo(() => !link || isCommenting, [link, isCommenting]);

  const onComment = useCallback(
    async (text: string) => {
      if (isDisabled) return;
      if (!isAuthenticated || !session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      try {
        addOneToCommentingLinkIds(linkId);
        const res = await s3LinkModel?.createComment({
          text,
          linkID: linkId,
          revoke: false,
        });
        if (res?.errors && res?.errors.length > 0) {
          throw new Error(res?.errors[0]?.message);
        }
        const id = res?.data?.createComment.document.id;
        if (id) {
          // update store
          addCommentToCacheLinks(linkId, {
            id,
            text,
            linkID: linkId,
            revoke: false,
            createAt: new Date().toISOString(),
            modifiedAt: new Date().toISOString(),
            creator: {
              id: session.id,
            },
          });
        }
        if (opts?.onSuccessfullyComment) opts.onSuccessfullyComment();
      } catch (error) {
        const errMsg = (error as any)?.message;
        if (opts?.onFailedComment) opts.onFailedComment(errMsg);
      } finally {
        removeOneFromCommentingLinkIds(linkId);
      }
    },
    [
      isDisabled,
      isAuthenticated,
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      addOneToCommentingLinkIds,
      removeOneFromCommentingLinkIds,
      addCommentToCacheLinks,
      updateCommentInCacheLinks,
      opts?.onSuccessfullyComment,
      opts?.onFailedComment,
    ]
  );

  return { isCommenting, isDisabled, onComment };
};
