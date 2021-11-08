[![Foreks Logo](https://www.foreks.com/i/logo.png)](http://foreks.com/)

Foreks publisher subscriber connection class

## Installation
```bash
$ npm i pubsub-connector -s
```

```js
import { PubsubConnector } from "foreks-pubsub-connector";

const options = {
  username: "", // socket username
  password: "", // socket password
  resource: "", // socket resource
  url: "", // socket url
  isReconnection: false, // is reconnection default is false
  autoReconnect: true, // auto reconnect on error or on close
  reConnectInterval: 5000, // auto reconnect interval
};

PubsubConnector.connect(options);

or;

pubsubConnector.connect(options).then((socket) => {});
```