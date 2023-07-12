import { useCallback, useMemo } from "react";
import {
  useAuthentication,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { getS3LinkModel, useLinkState } from "../LinkStateProvider";
import { useStore } from "../store";
import { useLinkComments } from "./useLinkComments";

export const useCommentAction = (
  linkId: string,
  opts?: {
    onSuccessfullyComment?: () => void;
    onFailedComment?: (errMsg: string) => void;
  }
) => {
  const { isFetched } = useLinkComments(linkId);
  const s3LinkModel = getS3LinkModel();
  const { signIn } = useAuthentication();
  const session = useSession();
  const { s3LinkModalAuthed } = useLinkState();

  const commentingLinkIds = useStore((state) => state.commentingLinkIds);
  const addOneToCommentingLinkIds = useStore(
    (state) => state.addOneToCommentingLinkIds
  );
  const removeOneFromCommentingLinkIds = useStore(
    (state) => state.removeOneFromCommentingLinkIds
  );
  const addCommentToCacheLinkComments = useStore(
    (state) => state.addCommentToCacheLinkComments
  );
  const updateCommentInCacheLinkComments = useStore(
    (state) => state.updateCommentInCacheLinkComments
  );

  const isCommenting = useMemo(
    () => commentingLinkIds.has(linkId),
    [commentingLinkIds, linkId]
  );

  const isDisabled = useMemo(
    () => !isFetched || isCommenting,
    [isFetched, isCommenting]
  );

  const onComment = useCallback(
    async (text: string) => {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
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
          addCommentToCacheLinkComments(linkId, {
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
      session,
      s3LinkModalAuthed,
      signIn,
      linkId,
      addOneToCommentingLinkIds,
      removeOneFromCommentingLinkIds,
      addCommentToCacheLinkComments,
      updateCommentInCacheLinkComments,
      opts?.onSuccessfullyComment,
      opts?.onFailedComment,
    ]
  );

  return { isCommenting, isDisabled, onComment };
};
