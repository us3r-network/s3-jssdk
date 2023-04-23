import {
  useEffect,
  useMemo,
  useState,
  createContext,
  useContext,
  PropsWithChildren,
} from "react";
import { useSession } from "@us3r-network/auth-with-rainbowkit";
import { S3LinkModel } from "./data-model";

let s3LinkModel: S3LinkModel | null = null;
export const getS3LinkModel = () => s3LinkModel;

export interface LinkStateContextValue {
  s3LinkModalInitialed: boolean;
  s3LinkModalAuthed: boolean;
}
const defaultContextValue: LinkStateContextValue = {
  s3LinkModalInitialed: false,
  s3LinkModalAuthed: false,
};
const LinkStateContext = createContext(defaultContextValue);

export interface LinkStateProviderProps extends PropsWithChildren {
  // ceramic host
  ceramicHost: string;
}

export default function LinkStateProvider({
  children,
  ceramicHost,
}: LinkStateProviderProps) {
  if (!ceramicHost) throw Error("ceramicHost is required");

  const [s3LinkModalInitialed, setS3LinkModalInitialed] = useState(false);
  const [s3LinkModalAuthed, setS3LinkModalAuthed] = useState(false);
  // TODO: Whether ceramicHost allows switching
  useEffect(() => {
    if (!s3LinkModel) {
      s3LinkModel = new S3LinkModel(ceramicHost);
      setS3LinkModalInitialed(true);
    }
  }, [ceramicHost]);

  const session = useSession();

  useEffect(() => {
    if (!s3LinkModalInitialed || !s3LinkModel) return;
    if (session) {
      s3LinkModel.authComposeClient(session);
      setS3LinkModalAuthed(true);
    } else {
      s3LinkModel.resetComposeClient();
      setS3LinkModalAuthed(false);
    }
  }, [s3LinkModalInitialed, session]);

  return (
    <LinkStateContext.Provider
      value={useMemo(
        () => ({
          s3LinkModalInitialed,
          s3LinkModalAuthed,
        }),
        [s3LinkModalInitialed, s3LinkModalAuthed]
      )}
    >
      {children}
    </LinkStateContext.Provider>
  );
}

export function useLinkState() {
  const context = useContext(LinkStateContext);
  if (!context) {
    throw Error(
      "useLinkState can only be used within the LinkStateProvider component"
    );
  }
  return context;
}

export function useFavor() {}
