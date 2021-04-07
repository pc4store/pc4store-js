# PC4Store

SDK for work with [PC4Store API](http://pc4.store/)

# Installation

Just run
`npm i -S pc4store`

# Examples

## Create order

```TypeScript
import * as PC4StoreClient from 'pc4store';

const storeId = 'your_store_id'
const secretKey = 'your_secret_key'

// All required params for create order. Look at typedef
const orderParams = { ... }

try {
    const response = await PC4StoreClient.createOrder(
        storeId,
        secretKey,
        orderParams
    );

    if (response.status === 'OK') {
        // order created
        const order = response.payload.order.payment_url;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {

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
import * as PC4StoreClient from 'pc4store';

const storeId = 'your_store_id'
const secretKey = 'your_secret_key'
const orderId = 'order_id_in_payment_system'

try {
    const response = await PC4StoreClient.getOrder(
        storeId,
        secretKey,
        orderId
    );

    if (response.status === 'OK') {
        // order received
        const order = response.payload.order.payment_url;
    } else {
        // something happend
        throw Error(response.error);
    }
} catch (e) {

}
```


