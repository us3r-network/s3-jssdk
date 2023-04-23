import { PropsWithChildren } from "react";
import { Us3rAuthWithRainbowkitProvider } from "@us3r-network/auth-with-rainbowkit";
import { ProfileStateProvider } from "@us3r-network/profile";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthWithRainbowkitProvider>
      <ProfileStateProvider
        ceramicHost={process.env.REACT_APP_CERAMIC_HOST as string}
      >
        {children}
      </ProfileStateProvider>
    </Us3rAuthWithRainbowkitProvider>
  );
}
