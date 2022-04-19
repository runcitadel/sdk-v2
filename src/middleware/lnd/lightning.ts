import {ApiConnection} from '../../common/connection.js';
import {joinUrl} from '../../common/utils.js';
import {
  ForwardingHistoryResponse,
  Invoice,
  Payment,
  SendResponse,
  PayReq,
  Invoice_InvoiceState,
} from '../autogenerated-types';

export type extendedPaymentRequest = PayReq & {
  paymentRequest?: string;
};

export class LNDLightning extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `lightning`));
  }

  public async addInvoice(
    amt: string,
    memo = '',
  ): Promise<{
    paymentRequest: string;
    rHashStr: string;
  }> {
    return await this.post<{
      paymentRequest: string;
      rHashStr: string;
    }>('/addInvoice', {
      memo,
      amt,
    });
  }

  public async addOffer(
    amount: string | number,
    description = '',
  ): Promise<{
    bolt12: string;
    bolt12_unsigned: string;
  }> {
    return await this.post<{
      bolt12: string;
      bolt12_unsigned: string;
    }>('/addOffer', {
      amount,
      description,
    });
  }

  public async forwardingHistory(
    startTime: number,
    endTime: number,
    indexOffset: number,
  ): Promise<ForwardingHistoryResponse> {
    return await this.get<ForwardingHistoryResponse>(
      `forwardingHistory?startTime=${startTime}&endTime=${endTime}&indexOffset=${indexOffset}`,
    );
  }

  public async parsePaymentRequest(
    paymentRequest: string,
  ): Promise<extendedPaymentRequest> {
    return await this.get<extendedPaymentRequest>(
      `invoice?paymentRequest=${paymentRequest}`,
    );
  }

  public async invoices(): Promise<Invoice[]> {
    return await this.get<Invoice[]>('invoices');
  }

  public async isPaid(paymentHash: string): Promise<boolean> {
    const data = await this.get<Invoice & {isPaid?: boolean}>(
      `invoice-info?paymentHash=${paymentHash}`,
    );
    return data.isPaid || data.state === Invoice_InvoiceState.SETTLED;
  }

  public async payInvoice(
    paymentRequest: string,
    amt?: number,
  ): Promise<SendResponse> {
    return await this.post<SendResponse>('payInvoice', {
      paymentRequest,
      amt,
    });
  }

  public async getPayments(): Promise<Payment[]> {
    return await this.get<Payment[]>('payments');
  }
}
