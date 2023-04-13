import path from "path";
import { Ceramic } from "@ceramicnetwork/core";
import { DID } from "dids";
import { create } from "ipfs-core";
import { TestEnvironment as NodeEnvironment } from "jest-environment-node";

import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { dir } from "tmp-promise";
import { fromString } from "uint8arrays/from-string";

// const NodeEnvironment = NodeEnv.default ?? NodeEnv;
class CustomEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
    const seed = config.projectConfig?.seed;
    this.seed = seed ? fromString(seed) : new Uint8Array(32);
    this.indexingConfig = {
      db: config.db,
      models: config.models,
    };
  }
  async setup() {
    console.log("setup....");
    this.tmpFolder = await dir({ unsafeCleanup: true });

    this.global.ipfs = await create({
      config: {
        Addresses: {
          Swarm: [],
        },
      },
      repo: path.join(this.tmpFolder.path, "ipfs"),
      silent: true,
    });

    const did = new DID({
      resolver: getResolver(),
      provider: new Ed25519Provider(this.seed),
    });
    await did.authenticate();

    const stateStoreDirectory = path.join(this.tmpFolder.path, "ceramic");
    const ceramic = await Ceramic.create(this.global.ipfs, {
      stateStoreDirectory: stateStoreDirectory,
      indexing: {
        db:
          this.indexingConfig.db ??
          `sqlite://${stateStoreDirectory}/ceramic.sqlite`,
        models: this.indexingConfig.models ?? [],
        allowQueriesBeforeHistoricalSync: true,
      },
    });
    ceramic.did = did;

    this.global.ceramic = ceramic;
  }

  async teardown() {
    await this.global.ceramic.close();
    await this.global.ipfs.stop();
    await this.tmpFolder.cleanup();
    await super.teardown();
    console.log("teardown...");
  }

  getVmContext() {
    return super.getVmContext();
  }
}

// module.exports = CustomEnvironment;
export default CustomEnvironment;
