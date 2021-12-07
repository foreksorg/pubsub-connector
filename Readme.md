[![Foreks Logo](https://www.foreks.com/i/logo.png)](http://foreks.com/)

Foreks publisher subscriber connection class

## Installation

```bash
$ npm i foreks-pubsub-connector -s
```

```js
import PubsubConnector from "foreks-pubsub-connector";

const options = {
  username: "", // socket username
  password: "", // socket password
  resource: "", // socket resource
  url: "", // socket url
  company: "", // company name
  appName: "", // application name
  isReconnection: false, // is reconnection default is false
  autoReconnect: true, // auto reconnect on error or on close
  reConnectInterval: 5000, // auto reconnect interval
  reConnectInterval: 5000, // auto reconnect interval
  sendData: Function, // on message event
};

const connector = new PubsubConnector(options);
await connector.connect();
connector.subscribe(["o17"], ["l"]);

// or you can use

const connector = new PubsubConnector(options);
connector.connect(options).then(() => {
  connector.subscribe(["o17"], ["l"]);
});
```
