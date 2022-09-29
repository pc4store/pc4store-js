# PC4Store

SDK for work with [PC4Store API](http://pc4.store/)

# Installation

Just run
`npm i -S pc4store`

# Examples

## Create order

```TypeScript
import { PC4StoreClient } from 'pc4store';

// All required params for create order. Look at typedef
const orderParams = { ... }
const client = new PC4StoreClient({
    storeId: 'your_store_id',
    secretKey: 'your_secret_key',
})

try {
    const response = await client.createOrder(orderParams);

    if (response.status === 'OK') {
        // order created
        const order = response.payload.order;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {
    // Handle errors
}
```

## Verify response

```TypeScript
import { verify } from 'pc4store';


try {
    // Pass all headers and body to function
    const valid = await verify(req.headers, req.body)
} catch (e) {

}
```

## Get order details

```TypeScript
import { PC4StoreClient } from 'pc4store';

const orderId = 'order_id_in_payment_system'
const client = new PC4StoreClient({
    storeId: 'your_store_id',
    secretKey: 'your_secret_key',
})


try {
    const response = await client.getOrder(orderId);


    if (response.status === 'OK') {
        // order received
        const order = response.payload.order;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {

}
```

## Create transfer

```TypeScript
import { PC4StoreClient } from 'pc4store';

const transferParams = { ... }
const client = new PC4StoreClient({
    storeId: 'your_store_id',
    secretKey: 'your_secret_key',
})

try {
    const response = await client.createTransfer(transferParams);


    if (response.status === 'OK') {
        // transfer created
        const transfer = response.payload.transfer_id;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {

}
```

## Get transfer

```TypeScript
import { PC4StoreClient } from 'pc4store';

const transferId = 'some_id'
const client = new PC4StoreClient({
    storeId: 'your_store_id',
    secretKey: 'your_secret_key',
})

try {
    const response = await client.getTransfer(transferId);

    if (response.status === 'OK') {
        // transfer received
        const transfer = response.payload.transfer;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {

}
```
