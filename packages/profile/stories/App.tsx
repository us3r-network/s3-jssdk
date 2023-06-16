import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { ProfileStateProvider } from "@us3r-network/profile";
import { CERAMIC_HOST } from "./constants";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider ceramicHost={CERAMIC_HOST}>
        {children}
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
