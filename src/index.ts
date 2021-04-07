import * as crypto from 'crypto';
import fetch from 'node-fetch';
import * as ed from 'noble-ed25519';

const HOST = 'https://api.pc4.store/v1';
const PUBLIC_KEY = '69f72437e2e359a3e5c29fe9a7e0d509345cc57b7bfca0b470598d679a349806';

export type CreatePaymentLinkParams = {
  currency_name: Currency['name'];
  currency_smart_contract: string;
  amount_to_pay: string;
  response_url: string;
  expiration_time?: number;
  merchant_order_id?: string;
  description?: string;
  success_payment_redirect_url?: string;
  failed_payment_redirect_url?: string;
};

export type Currency = {
  name: 'USDCASH' | 'UAHCASH' | 'RUBCASH';
  smart_contract: string;
  precission: number;
};

export type AmountType = {
  full_amount: string;
  amount_after_tax: string;
  fee: string;
};

export type SuccessfulResponse = {
  status: 'OK';
  payload: {
    order: {
      id: string;
      sequent_number: number;
      amount: AmountType;
      currency: Currency;
      status: 'PAID' | 'CREATED' | 'MONEY_RECEIVED' | 'CANCELLED' | 'EXPIRED';
      expiration_date: string;
      payment_url: string;
      response_url: string;
      success_payment_redirect_url?: string;
      failed_payment_redirect_url?: string;
      is_test: boolean;
      details: {
        merchant_order_id?: string;
        description?: string;
      };
      payment_transfer?: {
        id: string;
        amount: AmountType;
        currency: Currency;
        sender: string;
        receiver: string;
        txn_type: string;
        status: string;
        memo: string;
        action: {
          txid: string;
          block_number: number;
          global_sequence: number;
          is_irreversible: boolean;
          is_reversed: boolean;
        };
      } | null;
    };
  };
};

export type CallbackResponse = SuccessfulResponse;

type CreatePaymentLinkOutput =
  | SuccessfulResponse
  | {
      status: 'ERROR';
      error: string;
    };

type GetOrderOutput = CreatePaymentLinkOutput;

const constructHeaders = (storeId: string, secretKey: string) => {
  return {
    'Content-Type': 'application/json',
    Authorization: 'Basic ' + Buffer.from(storeId + ':' + secretKey).toString('base64'),
  };
};

/**
 *
 * @param storeId
 * @param secretKey - same as API Key
 * @param paymentParams - all order params
 *
 * @returns payment link for client
 */
export const createOrder = async (
  storeId: string,
  secretKey: string,
  paymentParams: CreatePaymentLinkParams,
): Promise<CreatePaymentLinkOutput> => {
  return await fetch(`${HOST}/create`, {
    method: 'POST',
    headers: constructHeaders(storeId, secretKey),
    body: JSON.stringify(paymentParams),
  }).then((j) => j.json());
};

/**
 * Verify response
 * @param signature - hex string, taken from header
 * @param data - callback's body
 */
export const verify = async (
  headers: { [key: string]: unknown; signature: string },
  data: SuccessfulResponse,
): Promise<boolean> => {
  return await ed.verify(
    headers.signature,
    crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex'),
    PUBLIC_KEY,
  );
};

/**
 * Get order's data by orderId. Verify built in
 * @param storeId
 * @param secretKey - same as API Key
 * @param orderId - order's id in payment system
 *
 * @returns order
 */
export const getOrder = async (storeId: string, secretKey: string, orderId: string): Promise<GetOrderOutput> => {
  const response = await fetch(`${HOST}/order_info/${orderId}`, {
    method: 'GET',
    headers: constructHeaders(storeId, secretKey),
  });

  const headers = response.headers;
  const data = await response.json();

  if (!(await verify({ signature: headers.get('signature') || '' }, data))) {
    throw Error('Invalid signature');
  }

  return data;
};
