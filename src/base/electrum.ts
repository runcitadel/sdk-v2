import {ApiConnection} from '../common/connection.ts';
import {joinUrl} from '../common/utils.ts';
import type {
  connectionDetails,
} from '../common/types.ts';

export class ManagerElectrum extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v2/electrum`));
  }

  /**
   * Get connection details
   */
  connectionDetails() {
    return this.get<connectionDetails>('/connection-details');
  }

  /**
   * Get sync height
   */
  height() {
    return this.get<number>('/height');
  }
}
