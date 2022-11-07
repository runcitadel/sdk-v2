import { ApiConnection } from "../common/connection.ts";
import { joinUrl } from "../common/utils.ts";
import {
  BitcoinTransaction,
  ChainInfo,
  MempoolInfo,
  MiningInfo,
  NetworkInfo,
} from "./bitcoin-types.ts";
import type {
  connectionDetails,
  RpcConnectionDetails
} from '../common/types.ts';

export type SyncStatus = {
  chain: string;
  percent: number;
  currentBlock: number;
  headerCount: number;
};

export type StatsDump = {
  blockchainInfo: ChainInfo;
  networkInfo: NetworkInfo;
  mempoolInfo: MempoolInfo;
  miningInfo: MiningInfo;
};

export type Stats = {
  difficulty: number;
  size: number;
  mempool: number;
  connections: number;
  networkhashps: number;
};

export type Block = {
  block: string;
  confirmations: number;
  size: number;
  height: number;
  blocktime: number;
  prevblock: string;
  nextblock: string | undefined;
  transactions: string | BitcoinTransaction[];
};

export type BasicBlock = {
  hash: string;
  height: number;
  numTransactions: number;
  confirmations: number;
  time: number;
  size: number;
};

export type Transaction = {
  txid: string;
  timestamp: number;
  confirmations: number;
  blockhash: string;
  size: number;
  input: string;
  utxo: unknown;
  rawtx: string;
};


export class ManagerBitcoin extends ApiConnection {
  constructor(baseUrl: string) {
    super(joinUrl(baseUrl, `v2/bitcoin`));
  }

  async isAvailable(): Promise<boolean> {
    try {
      if (typeof (await this.blockcount()) !== "number") {
        throw new TypeError("Received invalid data");
      }
      return true;
    } catch {
      return false;
    }
  }

  async mempool(): Promise<MempoolInfo> {
    return await this.get<MempoolInfo>("/mempool");
  }

  blockcount() {
    return this.get<number>("/blockcount");
  }

  connections() {
    return this.get<{
      total: number;
      inbound: number;
      outbound: number;
    }>("/connections");
  }

  version() {
    return this.get<string>("/version");
  }

  chain() {
    return this.get<ChainInfo>(`/chain`);
  }

  blocks(from: number, to: number): Promise<BasicBlock[]> {
    return this.get<BasicBlock[]>(`/blocks?from=${from}&to=${to}`);
  }

  getTransaction(txid: string): Promise<Transaction> {
    return this.get<Transaction>(`/tx/${txid}`);
  }

  p2pConnectionDetails() {
    return this.get<connectionDetails>(`/connection-details/p2p`);
  }

  rpcConnectionDetails() {
    return this.get<RpcConnectionDetails>(`/connection-details/rpc`);
  }
}
