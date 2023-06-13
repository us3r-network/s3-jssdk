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
import { Wallet } from "@us3r-network/data-model";
import { childrenRender } from "../../../utils/props";
import { shortPubKey } from "../../../utils/short";

function Count(props: HTMLAttributes<HTMLSpanElement>) {
  const { wallets } = useUserWalletsState();
  return (
    <span data-state-element="Count" {...props}>
      {wallets.length}
    </span>
  );
}

function List(props: ListBoxProps<Wallet>) {
  const { wallets } = useUserWalletsState();
  return (
    <ListBox
      aria-label="User wallets"
      selectionMode="single"
      data-state-element="List"
      items={wallets}
      {...props}
    />
  );
}

function Item({ children, value, ...props }: ItemProps<Wallet>) {
  if (!value) return null;
  return (
    <AriaItem
      data-state-element="Item"
      key={value.address}
      textValue={value.address}
      {...props}
    >
      <UserWalletsItemContext.Provider value={value as Wallet}>
        {childrenRender(children, value)}
      </UserWalletsItemContext.Provider>
    </AriaItem>
  );
}

function Address(props: HTMLAttributes<HTMLSpanElement>) {
  const { address } = useUserWalletsItemState();
  return (
    <span data-state-element="Address" {...props}>
      {shortPubKey(address)}
    </span>
  );
}

function Network(props: HTMLAttributes<HTMLSpanElement>) {
  const { primary } = useUserWalletsItemState();
  return (
    <span data-state-element="Network" {...props}>
      {primary ? "Main" : ""}
    </span>
  );
}

function Delete(props: HTMLAttributes<HTMLSpanElement>) {
  const { deleteWallet } = useUserWalletsState();
  const wallet = useUserWalletsItemState();
  if (!wallet || wallet.primary) return null;
  return (
    <span
      data-state-element="Delete"
      onClick={() => {
        deleteWallet(wallet);
      }}
      {...props}
    />
  );
}

function Copy({
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
      data-state-element="Copy"
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

export default {
  Count,
  List,
  Item,
  Address,
  Network,
  Delete,
  Copy,
};
