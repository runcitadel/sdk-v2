import { ApiConnection } from "../common/connection.ts";

export class ApiV2 extends ApiConnection {
  /**
   * Ping a node and get version information
   *
   * @returns Version information about the node
   */
  public async ping(): Promise<{
    version: string;
    features?: string[];
    isCitadel?: true | undefined;
  }> {
    return await this.get<{
      version: string;
      features?: string[];
      isCitadel?: true | undefined;
    }>("ping");
  }

  /**
   * Check if the manager is online
   *
   * @returns {boolean} True if the manager is online
   */
  public async isOnline(): Promise<boolean> {
    try {
      await await this.ping();
      return true;
    } catch {
      return false;
    }
  }
}
