export type CreatePaymentLinkParams = {
  currency_name: Currency['name'];
  currency_smart_contract: Currency['smart_contract'];
  amount_to_pay: string;
  response_url: string;
  expiration_time?: number;
  merchant_order_id?: string;
  description?: string;
  success_payment_redirect_url?: string;
  failed_payment_redirect_url?: string;
};

export type CreateTransferParams = {
  amount: string;
  currency_name: Currency['name'];
  currency_smart_contract: Currency['smart_contract'];
  eos_account: string;
  response_url?: string;
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

export type Transfer = {
  id: string;
  amount: AmountType;
  currency: Currency;
  sender: string;
  receiver: string;
  txn_type: 'ORDER_PAYMENT' | 'PAYBACK' | 'DEPOSIT' | 'WITHDRAW';
  status: 'INITIATED' | 'SENDED' | 'RECEIVED' | 'ACCEPTED' | 'DECLINED' | 'FAILED';
  memo: string;
  action: {
    txid: string;
    block_number: number;
    global_sequence: number;
    is_irreversible: boolean;
    is_reversed: boolean;
  };
};

export type Order = {
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
  payment_transfer?: Transfer | null;
};

export type SuccessfulOrderResponse = {
  status: 'OK';
  payload: {
    order: Order;
  };
};

export type SuccessfulTransferResponse = {
  status: 'OK';
  payload: {
    transfer_id: string;
  };
};

export type FailureResponse = {
  status: 'ERROR';
  error: string;
};

export type CallbackResponse = SuccessfulOrderResponse;

export type CreatePaymentLinkOutput = SuccessfulOrderResponse | FailureResponse;
export type CreateTransferOutput = SuccessfulTransferResponse | FailureResponse;

export type GetOrderOutput = CreatePaymentLinkOutput;
export type GetTransferOutput = CreateTransferOutput;
