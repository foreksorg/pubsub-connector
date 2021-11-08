[![Foreks Logo](https://www.foreks.com/i/logo.png)](http://foreks.com/)

  Foreks publisher subscriber connection class

```js
import { PubsubConnector }  from 'foreks-pubsub-connector';

const options = {
    username: '', // socket username
    password: '', // socket password
    resource: '', // socket resource
    url: '', // socket url
    isReconnection: false, // is reconnection default is false
    autoReconnect: true, // auto reconnect on error or on close 
    reConnectInterval: 5000, // auto reconnect interval
}

PubsubConnector.connect(options);

or 

pubsubConnector.connect(options).then(socket => {

});

```

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

If this is a brand new project, make sure to create a `package.json` first with
the [`npm init` command](https://docs.npmjs.com/creating-a-package-json-file).

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm i pubsub-connector -s
```
