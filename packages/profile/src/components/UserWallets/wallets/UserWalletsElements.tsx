import {
  Item as AriaItem,
  ItemProps,
  ListBox,
  ListBoxProps,
} from "react-aria-components";
import { HTMLAttributes } from "react";
import {
  UserWalletsItemContext,
  useUserWalletsItemState,
  useUserWalletsState,
} from "./UserWalletsContext";
import { Wallet } from "../../../data-model";
import { childrenRender } from "../../../utils/props";
import { shortPubKey } from "../../../utils/short";

export function Count(props: HTMLAttributes<HTMLSpanElement>) {
  const { wallets } = useUserWalletsState();
  return (
    <span data-count="" {...props}>
      {wallets.length}
    </span>
  );
}

export function List(props: ListBoxProps<Wallet>) {
  const { wallets } = useUserWalletsState();
  return <ListBox data-list="" items={wallets} {...props} />;
}

export function Item({ children, value, ...props }: ItemProps<Wallet>) {
  if (!value) return null;
  return (
    <AriaItem data-item="" key={value.address} {...props}>
      <UserWalletsItemContext.Provider value={value as Wallet}>
        {childrenRender(children, value)}
      </UserWalletsItemContext.Provider>
    </AriaItem>
  );
}

export function Address(props: HTMLAttributes<HTMLSpanElement>) {
  const { address } = useUserWalletsItemState();
  return (
    <span data-address="" {...props}>
      {shortPubKey(address)}
    </span>
  );
}

export function Network(props: HTMLAttributes<HTMLSpanElement>) {
  const { primary } = useUserWalletsItemState();
  return (
    <span data-address="" {...props}>
      {primary ? "Main" : ""}
    </span>
  );
}

export function Delete(props: HTMLAttributes<HTMLSpanElement>) {
  const { deleteWallet } = useUserWalletsState();
  const wallet = useUserWalletsItemState();
  if (!wallet || wallet.primary) return null;
  return (
    <span
      data-delete=""
      onClick={() => {
        deleteWallet(wallet);
      }}
      {...props}
    />
  );
}

export function Copy({
  onCopied,
  onFailed,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  onCopied?: () => void;
  onFailed?: () => void;
}) {
  const { address } = useUserWalletsItemState();
  return (
    <span
      data-copy=""
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(address);
          onCopied?.();
        } catch (error) {
          onFailed?.();
        }
      }}
      {...props}
    />
  );
}
