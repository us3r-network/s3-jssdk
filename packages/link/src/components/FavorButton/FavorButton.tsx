/*
 * @Author: bufan bufan@hotmail.com
 * @Date: 2023-07-26 14:57:29
 * @LastEditors: bufan bufan@hotmail.com
 * @LastEditTime: 2023-12-13 17:12:14
 * @FilePath: /s3-jssdk/packages/link/src/components/FavorButton/FavorButton.tsx
 * @Description: FavorButton component.
 */
import { useEffect, useMemo, useState } from "react";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { FavorButtonChildren } from "./FavorButtonChildren";
import { useFavorAction } from "../../hooks/useFavorAction";
import { useLinkFavors } from "../../hooks/useLinkFavors";
import { Link } from "@us3r-network/data-model";
import { useLinks } from "../../hooks/useLinks";

export interface FavorButtonIncomingProps {
  /**
   * link stream id.
   */
  linkId: string;
  /**
   * link params include url and type.
   */
  link?: Link;
  /**
   * callback when favor is successfully added or removed.
   * @param isFavored is favored or not.
   */
  onSuccessfullyFavor?: (isFavored: boolean) => void;
  /**
   * callback when favor is failed to add or remove.
   * @param errMsg error message.
   */
  onFailedFavor?: (errMsg: string) => void;
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
  link,
  onSuccessfullyFavor,
  onFailedFavor,
  children,
  ...props
}: FavorButtonProps) {
  const isAuthenticated = useIsAuthenticated();
  const {linkId:unknownLinkId} = useLinks(link);
  const { favorsCount } = useLinkFavors(linkId||unknownLinkId);
  const { isFavored, isFavoring, isDisabled, onFavor } = useFavorAction(
    linkId||unknownLinkId,
    link,
    {
      onSuccessfullyFavor,
      onFailedFavor,
    }
  );

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
    favorsCount,
  };

  const defaultChildren = useMemo(
    () => <FavorButtonChildren {...businessRenderProps} />,
    [businessRenderProps]
  );

  return (
    <Button {...businessProps} {...props}>
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
