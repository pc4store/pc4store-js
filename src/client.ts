import * as crypto from 'crypto';
import fetch from 'node-fetch';
import * as ed from 'noble-ed25519';
import {
  SuccessfulOrderResponse,
  SuccessfulTransferResponse,
  CreatePaymentLinkParams,
  CreateTransferParams,
  CreateTransferOutput,
  CreatePaymentLinkOutput,
  GetOrderOutput,
  GetTransferOutput,
} from './types';

const HOST = 'https://api.pc4.store/v1';
const PUBLIC_KEY = '69f72437e2e359a3e5c29fe9a7e0d509345cc57b7bfca0b470598d679a349806';

export class PC4StoreClient {
  storeId: string;
  secretKey: string;

  constructor({ storeId, secretKey }: { storeId: string; secretKey: string }) {
    this.storeId = storeId;
    this.secretKey = secretKey;
  }

  constructHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(this.storeId + ':' + this.secretKey).toString('base64'),
    };
  }

  /**
   * Verify response
   * @param signature - hex string, taken from header
   * @param data - callback's body
   */
  async verify(
    headers: { [key: string]: unknown; signature: string },
    data: SuccessfulOrderResponse | SuccessfulTransferResponse,
  ) {
    return await ed.verify(
      headers.signature,
      crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
      PUBLIC_KEY,
    );
  }

  /**
   * @param paymentParams - all order params
   * @returns payment link for client
   */
  async createOrder(paymentParams: CreatePaymentLinkParams): Promise<CreatePaymentLinkOutput> {
    return await fetch(`${HOST}/create`, {
      method: 'POST',
      headers: this.constructHeaders(),
      body: JSON.stringify(paymentParams),
    }).then((j) => j.json());
  }
  /**
   * @param orderId - order's id in payment system
   * @returns order
   */
  async getOrder(orderId: string): Promise<GetOrderOutput> {
    return await fetch(`${HOST}/order_info/${orderId}`, {
      method: 'GET',
      headers: this.constructHeaders(),
    }).then((j) => j.json());
  }

  /**
   * Create transfer
   * @param transferParams - all transfer params
   * @returns transfer's details
   */
  async createTransfer(transferParams: CreateTransferParams): Promise<CreateTransferOutput> {
    return await fetch(`${HOST}/transfer`, {
      method: 'POST',
      headers: this.constructHeaders(),
      body: JSON.stringify(transferParams),
    }).then((j) => j.json());
  }

  /**
   * @param transferId - transfers's id in payment system
   * @returns transfer's details
   */
  async getTransfer(transfer: string): Promise<GetTransferOutput> {
    return await fetch(`${HOST}/transfer_info/${transfer}`, {
      method: 'GET',
      headers: this.constructHeaders(),
    }).then((j) => j.json());
  }
}
