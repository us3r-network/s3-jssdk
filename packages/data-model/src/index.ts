import { ComposeClient } from "@composedb/client";
import { RuntimeCompositeDefinition } from "@composedb/types";
import { DIDSession } from "did-session";
import type { CeramicApi } from "@ceramicnetwork/common";
import { DID } from "dids";

/**
 *
 */
export default class Model {
  composeClient: ComposeClient;

  constructor(
    ceramic: CeramicApi | string,
    definition: RuntimeCompositeDefinition
  ) {
    this.composeClient = new ComposeClient({
      ceramic: ceramic,
      definition: definition,
    });
  }
  public authComposeClient(session: DIDSession) {
    if (!session || (session.hasSession && session.isExpired)) {
      throw new Error("Please login with wallet first!");
    }
    this.composeClient.setDID(session.did);
  }

  public resetComposeClient() {
    const did = new DID();
    this.composeClient.setDID(did);
  }
}
