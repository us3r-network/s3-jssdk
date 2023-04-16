import { PropsWithChildren } from "react";
import { Us3rAuthProvider } from "@us3r-network/auth";
import { ProfileStateProvider } from "@us3r-network/profile";

export default function App({ children }: PropsWithChildren) {
  return (
    <Us3rAuthProvider>
      <ProfileStateProvider
        ceramicHost={process.env.REACT_APP_CERAMIC_HOST as string}
        themeConfig={{ mode: "dark" }}
      >
        {children}
      </ProfileStateProvider>
    </Us3rAuthProvider>
  );
}
