import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { LinkStateProvider } from "@us3r-network/link";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <LinkStateProvider
        ceramicHost={process.env.REACT_APP_CERAMIC_HOST as string}
        themeConfig={{ mode: "dark" }}
      >
        {children}
      </LinkStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
