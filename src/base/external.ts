import {ApiConnection} from '../common/connection.ts';
import {joinUrl} from '../common/utils.ts';

export type LnAddressSignupResponse =
  | 'Address added successfully'
  | 'Error: Address limit reached'
  | 'Error: Address already in use'
  | 'Error: Onion URL already used';

export class ManagerExternal extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v2/external`));
  }

  /**
   * Get the current Bitcoin price in another currency
   * @param currency The three-letter code of the currency you want
   *
   * @returns The value as a number
   */
  async price(currency = 'USD'): Promise<number> {
    return (
      await this.get<Record<string, number>>(`/price?currency=${currency}`)
    )[currency];
  }
}
