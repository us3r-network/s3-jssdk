import { useMemo } from "react";
import { AriaButtonProps } from "react-aria";
import { Button, ButtonRenderProps } from "react-aria-components";
import { useIsAuthenticated } from "@us3r-network/auth-with-rainbowkit";
import { ChildrenRenderProps, childrenRender } from "../../utils/props";
import { FavorButtonChildren } from "./FavorButtonChildren";
import { useLink } from "../../hooks/useLink";
import { useFavorAction } from "../../hooks/useFavorAction";

export interface FavorButtonIncomingProps {
  linkId: string;
  onSuccessfullyFavor?: (isFavored: boolean) => void;
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
  onSuccessfullyFavor,
  onFailedFavor,
  children,
  ...props
}: FavorButtonProps) {
  const isAuthenticated = useIsAuthenticated();
  const { link } = useLink(linkId);
  const { isFavored, isFavoring, isDisabled, onFavor } = useFavorAction(
    linkId,
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
    favorsCount: link?.favorsCount || 0,
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
