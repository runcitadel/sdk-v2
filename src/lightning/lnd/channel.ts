import {ApiConnection} from '../../common/connection.ts';
import {joinUrl} from '../../common/utils.ts';
import {
  Channel,
  PendingChannelsResponse_WaitingCloseChannel,
  PendingChannelsResponse_ForceClosedChannel,
  PendingChannelsResponse_PendingOpenChannel,
  EstimateFeeResponse,
  PendingChannelsResponse,
  ChannelFeeReport,
} from '../autogenerated-types.ts';
import type {RangeOf2} from '../../common/types.ts';

export type Channel_extended = Channel & {
  type?: string;
};

export type WaitingCloseChannel_extended =
  PendingChannelsResponse_WaitingCloseChannel & {
    type?: string;
  };

export type PendingForceClosedChannel_extended =
  PendingChannelsResponse_ForceClosedChannel & {
    type?: string;
  };

export type PendingOpenChannel_extended =
  PendingChannelsResponse_PendingOpenChannel & {
    type?: string;
  };

export type EstimateFeeResponseExtended = EstimateFeeResponse & {
  sweepAmount?: number;
};

export class LNDChannel extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `channel`));
  }

  public async list(): Promise<Channel_extended[]> {
    return await this.get<Channel_extended[]>('');
  }

  public async estimateFee(
    amt: number | string,
    confTarget: RangeOf2<2, 1000>,
    sweep = false,
  ): Promise<EstimateFeeResponseExtended> {
    return await this.get<EstimateFeeResponseExtended>(
      `/estimateFee?amt=${amt}&confTarget=${confTarget}&sweep=${sweep}`,
    );
  }

  public async estimateFeeAll(
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
    }>(`/estimateFee?amt=${amt}&confTarget=0&sweep=${sweep}`);
  }

  public async getPendingChannels(): Promise<PendingChannelsResponse> {
    return await this.get<PendingChannelsResponse>('/pending');
  }

  public async getPolicy(): Promise<ChannelFeeReport[]> {
    return await this.get<ChannelFeeReport[]>('/policy');
  }

  public async setPolicy(
    chanPoint: string,
    baseFeeMsat: number | string,
    feeRate: number,
    timeLockDelta = 144,
    global = false,
  ): Promise<void> {
    await this.post('/policy', {
      chanPoint,
      baseFeeMsat,
      feeRate,
      timeLockDelta,
      global,
    });
  }

  public async closeChannel(
    channelPoint: string,
    force = false,
  ): Promise<void> {
    await this.delete(`/close`, {channelPoint, force});
  }

  public async channelCount(): Promise<number> {
    return (await this.get<{count: number}>('/count')).count;
  }

  /**
   * Open a new channel
   *
   * @param pubKey The pubkey of the peer to open a channel with
   * @param ip The IP address of the peer to open a channel with
   * @param port The port of the peer to open a channel with
   * @param amt The amount to open the channel with
   * @param satPerByte The amount to pay per byte of the opening transaction
   * @returns The ID of the funding transaction
   */
  public async openChannel(
    pubKey: string,
    ip: string,
    port: number | string,
    amt: string | number,
    satPerByte: number | undefined,
  ): Promise<string> {
    return (
      await this.post<{fundingTxId: string}>('/openChannel', {
        pubKey,
        ip,
        port,
        amt,
        satPerByte,
      })
    ).fundingTxId;
  }

  public async getBackup(): Promise<Blob> {
    return await this.get('/v1/lnd/util/download-channel-backup', true, true);
  }
}