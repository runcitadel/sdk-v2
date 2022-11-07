import { joinUrl } from "./common/utils.ts";
import { RequestFunction } from "./common/types.ts";
import { ManagerApps } from "./base/apps.ts";
import { ManagerAuth } from "./base/auth.ts";
import { ManagerBitcoin } from "./base/bitcoin.ts";
import { ManagerElectrum } from "./base/electrum.ts";
import { ManagerExternal } from "./base/external.ts";
import { ManagerSystem } from "./base/system.ts";
import { MiddlewareLND } from "./lightning/lnd.ts";
import { ApiV2 } from "./base/index.ts";
import { Middleware } from "./lightning/index.ts";
import { MiddlewarePages } from "./lightning/pages.ts";

export default class Citadel {
  readonly auth: ManagerAuth;
  readonly apps: ManagerApps;
  readonly bitcoin: ManagerBitcoin;
  readonly electrum: ManagerElectrum;
  readonly external: ManagerExternal;
  readonly system: ManagerSystem;
  readonly lightning: MiddlewareLND;
  readonly pages: MiddlewarePages;
  private _jwt = "";
  private _v2Api: ApiV2;
  private _middleware: Middleware;

  constructor(baseUrl: string) {
    const v2Api = joinUrl(baseUrl, "api-v2");
    this._v2Api = new ApiV2(v2Api);
    this.auth = new ManagerAuth(v2Api, this);
    this.apps = new ManagerApps(v2Api);
    this.bitcoin = new ManagerBitcoin(v2Api);
    this.electrum = new ManagerElectrum(v2Api);
    this.external = new ManagerExternal(v2Api);
    this.system = new ManagerSystem(v2Api);
    const middlewareApi = joinUrl(baseUrl, "api");
    this._middleware = new Middleware(middlewareApi.toString());
    this.lightning = new MiddlewareLND(middlewareApi.toString());
    this.pages = new MiddlewarePages(middlewareApi.toString());
  }

  /**
   * Check if the node is online, and what parts are online
   */
  public async isOnline(): Promise<{
    manager: boolean;
    middleware: boolean;
    node: boolean;
    lightning: {
      operational: boolean;
      unlocked: boolean;
    };
  }> {
    const manager = await this._v2Api.isOnline();
    const middleware = await this._middleware.isOnline();
    let lightning: {
      operational: boolean;
      unlocked: boolean;
    } = {
      operational: false,
      unlocked: false,
    };
    try {
      lightning = await this.lightning.info.getStatus();
    } catch {
      // Ignore errors
    }

    return {
      manager,
      middleware,
      node: manager && middleware,
      lightning,
    };
  }

  public get jwt(): string {
    return this._jwt;
  }

  public set jwt(newJwt: string) {
    this._jwt =
      this.apps.jwt =
      this.auth.jwt =
      this.bitcoin.jwt =
      this.electrum.jwt =
      this.external.jwt =
      this.lightning.jwt =
      this.pages.jwt =
        newJwt;
  }

  public set requestFunc(requestFunc: RequestFunction) {
    this.requestFunc =
      this.apps.requestFunc =
      this.auth.requestFunc =
      this.bitcoin.requestFunc =
      this.electrum.requestFunc =
      this.external.requestFunc =
      this.lightning.requestFunc =
      this.pages.requestFunc =
        requestFunc;
  }

  public set onAuthFailed(callback: (url: string) => void) {
    this.onAuthFailed =
      this.apps.onAuthFailed =
      this.auth.onAuthFailed =
      this.bitcoin.onAuthFailed =
      this.electrum.onAuthFailed =
      this.external.onAuthFailed =
      this.lightning.onAuthFailed =
      this.pages.onAuthFailed =
        callback;
  }
}
