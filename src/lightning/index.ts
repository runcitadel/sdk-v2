import {ApiConnection} from '../common/connection.ts';

export class Middleware extends ApiConnection {
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
    }>('ping');
  }

  public async isOnline(): Promise<boolean> {
    try {
      await this.ping();
      return true;
    } catch {
      return false;
    }
  }
}
