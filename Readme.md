
[![Foreks Logo](https://www.foreks.com/i/logo.png)](http://foreks.com/)

Foreks publisher subscriber connection helper  

## Installation

```bash

$ npm i foreks-pubsub-connector -s

```


```js

import  PubsubConnector  from  "foreks-pubsub-connector";

const  options = {
username:  "", // socket username
password:  "", // socket password
resource:  "", // socket resource
url:  "", // socket url
company:  "", // company name
appName:  "", // application name
autoReconnect:  true, // auto reconnect on error or on close
reConnectInterval:  5000, // auto reconnect interval
reConnectCountLimit:  5, // auto reconnect limit
sendData:  Function, // on message event
onError:  Function, // on error event
};

const  connector = new  PubsubConnector(options);
await  connector.connect();
connector.subscribe(["o17"], ["l"]);

// or you can use promise callback

const  connector = new  PubsubConnector(options);
connector.connect(options).then(() => {
connector.subscribe(["o17"], ["l"]);
});

```


## Docs

#### Options

|name            |description      | default |mandatory |
|----------------|------------------|--------|----|
|username		 |pubsub username   | "" | yes |
|password        |pubsub password   | "" | yes |
|resource        |pubsub resource	| "" | yes |
|url        |pubsub socket url	| wss://websocket.foreks.com | yes |
|appName        |your app name	| "" | yes |
|autoReconnect  | auto reconnect on close or error	| true | no |
|reConnectInterval  | reconnection interval	| 5000 | no |
|sendData  | send message data callback function	| null | no |
|onError  | send message data on error	| null | no |


####  PubsubConnector

set options for socket
@param  {**PubSubConnectionOptions**}  options 
**setOptions**

----
get socket connection
@return  {**WebSocket**}
**getSocket**

----
connect to socket
@param  {**PubSubConnectionOptions**}  options 
**connect**(): void

----
disconnect from socket
**disconnect**(): void

----
is socket ready
@return  {boolean}
**isSocketReady**(): boolean

----
get subscription by id
@param  {string}  id : id
**getSubscriptionsById**(id: string)

----
get subscriptions
@returns  {any}
**getSubscriptions**(): any

----
send message via socket
@param  {string}  message : message
**send**(message: string)

----
send login message to socket
@param  {string}  username : username
@param  {string}  password : password
@param  {string}  resource : resource
**login**(username: string, password: string, resource: string): void

----

schedule heart beat for socket service.
**scheduleHeartbeat**(): void

----

subscribe to pubsub for symbols & fields
@param  {string[]}  symbols : symbols list
@param  {string[]}  fields : fields list
@param  {Function}  callback : callback method
@returns  {number} subscription id
**subscribe**(symbols: string[],fields: string[],callback?: (data: any) =>  any): number

----
check subscription has snapshot data if has sent it to pubsub sendData service
@param  {string[]}  symbols : symbols list
@param  {string[]}  fields : fields list
**checkSubscriptionHasSnapshot**(symbols: string[], fields: string[])

----
get field snapshot value if exsist
@param  {string}  definitionId : definition id
@param  {string}  fieldShortCode : fields shortcode
**getFieldSnapShotValue**(definitionId: string,fieldShortCode: string): any | null

----
check subscription has snapshot data if has sent it to pubsub sendData service
@param  {number}  subId : subscription id
@param  {string[]}  symbols : symbols list
@param  {string[]}  fields : fields list
@param  {Function}  callback : callback method
**addSubscriptions**(subId: number,symbols: string[],fields: string[],callback?: (data: any) =>  any): void

----
re-subscribe with old subscription map
**reSubscribe**(): void

----
unsubscribe with subscription id
@param  {number}  id : subscription id
**unSubscribe**(id: number): void

---
unsubscribe all subscriptions
**unSubscribeAll**(): void

---
feed subscriptions
@param  {any}  data : socket data
**feedSubscriptions**(data: any): void

---
call all callbacks
@param  {any}  data : socket data
**callback**(data: any): void

---

send message via socket
@param {string}  message : message
**messageEvent**(message: any)