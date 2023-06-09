import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { LinkStateProvider } from "@us3r-network/link";
import { CERAMIC_HOST } from "./constants";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <LinkStateProvider ceramicHost={CERAMIC_HOST}>
        {children}
      </LinkStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
