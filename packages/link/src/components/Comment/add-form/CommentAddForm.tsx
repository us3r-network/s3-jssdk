import {
  HTMLAttributes,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChildrenRenderProps, childrenRender } from "../../../utils/props";
import * as CommentAddFormElements from "./CommentAddFormElements";
import {
  CommentAddFormContext,
  CommentAddFormContextValue,
} from "./CommentAddFormContext";
import { CommentAddFormDefaultChildren } from "./CommentAddFormDefaultChildren";
import { getS3LinkModel, useLinkState } from "../../../LinkStateProvider";
import {
  useAuthentication,
  useIsAuthenticated,
  useSession,
} from "@us3r-network/auth-with-rainbowkit";
import { useStore } from "../../../store";
import { userLink } from "../../../hooks/link";

export interface CommentAddFormIncomingProps {
  linkId: string;
  onSuccessfullySubmit?: () => void;
}

export interface CommentAddFormProps
  extends ChildrenRenderProps<
      HTMLAttributes<HTMLFormElement>,
      CommentAddFormContextValue
    >,
    CommentAddFormIncomingProps {}

function CommentAddFormRoot({
  linkId,
  children,
  onSuccessfullySubmit,
  ...props
}: CommentAddFormProps) {
  const { link } = userLink(linkId);
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

  const [text, setText] = useState("");
  const [errMsg, setErrMsg] = useState("");
  useEffect(() => {
    setErrMsg("");
  }, [text]);

  const submitComment = useCallback(async () => {
    try {
      if (isDisabled) return;
      if (!session || !s3LinkModalAuthed) {
        signIn();
        return;
      }
      addOneToCommentingLinkIds(linkId);
      const res = await s3LinkModel?.createComment({
        text,
        linkID: linkId,
        revoke: false,
      });
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
      if (onSuccessfullySubmit) onSuccessfullySubmit();
    } catch (error) {
      const errMsg = (error as ReadonlyArray<any>)[0].toJSON().message;
      setErrMsg(errMsg);
    } finally {
      removeOneFromCommentingLinkIds(linkId);
    }
  }, [
    text,
    isDisabled,
    session,
    s3LinkModalAuthed,
    linkId,
    addOneToCommentingLinkIds,
    removeOneFromCommentingLinkIds,
    addCommentToCacheLinks,
    updateCommentInCacheLinks,
  ]);

  const businessProps = {
    "data-us3r-comment-add-form": "",
    "data-authenticated": isAuthenticated || undefined,
    "data-commenting": isCommenting || undefined,
    "data-disabled": isDisabled || undefined,
  };
  const contextValue = {
    text,
    setText,
    isCommenting,
    isDisabled,
    errMsg,
    submitComment,
  };
  return (
    <form {...props} {...businessProps}>
      <CommentAddFormContext.Provider value={contextValue}>
        {childrenRender(
          children,
          contextValue,
          <CommentAddFormDefaultChildren />
        )}
      </CommentAddFormContext.Provider>
    </form>
  );
}

export const CommentAddForm = Object.assign(CommentAddFormRoot, {
  ...CommentAddFormElements,
});
