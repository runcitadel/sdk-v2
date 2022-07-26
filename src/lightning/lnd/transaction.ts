import {ApiConnection} from '../../common/connection.ts';
import {joinUrl} from '../../common/utils.ts';
import {
  Transaction,
  SendCoinsResponse,
} from '../autogenerated-types.ts';
import type {RangeOf2} from '../../common/types.ts';
import type {EstimateFeeResponseExtended} from "./channel.ts";

export type Transaction_extended = Transaction & {
  type:
    | 'CHANNEL_OPEN'
    | 'CHANNEL_CLOSE'
    | 'PENDING_OPEN'
    | 'PENDING_CLOSE'
    | 'UNKNOWN'
    | 'ON_CHAIN_TRANSACTION_SENT'
    | 'ON_CHAIN_TRANSACTION_RECEIVED';
};

export class LNDTransaction extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `transaction`));
  }

  // Returns a list of all on chain transactions.
  async getOnChainTransactions(): Promise<Transaction_extended[]> {
    return this.get<Transaction_extended[]>('/');
  }

  async sendCoins(
    address: string,
    amount: number,
    satPerVByte: number,
  ): Promise<SendCoinsResponse> {
    return this.post<SendCoinsResponse>('/', {
      addr: address,
      amt: amount,
      satPerByte: satPerVByte,
    });
  }

  async sendAllCoins(
    address: string,
    satPerVByte: number,
  ): Promise<SendCoinsResponse> {
    return this.post<SendCoinsResponse>('/', {
      addr: address,
      // Ignored, but needs to be passed
      amt: 1,
      satPerByte: satPerVByte,
      sendAll: true,
    });
  }

  public async estimateFee(
    address: string,
    amt: number | string,
    confTarget: RangeOf2<2, 1000>,
    sweep = false,
  ): Promise<EstimateFeeResponseExtended> {
    return await this.get<EstimateFeeResponseExtended>(
      `/estimateFee?address=${address}&amt=${amt}&confTarget=${confTarget}&sweep=${sweep}`,
    );
  }

  public async estimateFeeAll(
    address: string,
    amt: number | string,
    sweep = false,
  ): Promise<{
    fast: EstimateFeeResponseExtended;
    slow: EstimateFeeResponseExtended;
    normal: EstimateFeeResponseExtended;
    cheapest: EstimateFeeResponseExtended;
  }> {
    return await this.get<{
      fast: EstimateFeeResponseExtended;
      slow: EstimateFeeResponseExtended;
      normal: EstimateFeeResponseExtended;
      cheapest: EstimateFeeResponseExtended;
    }>(
      `/estimateFee?address=${address}&amt=${amt}&confTarget=0&sweep=${sweep}`,
    );
  }
}
