import { PubsubConnector } from "../dist";

let _ws: any;
const options = {
  username: "test", // socket username
  password: "test", // socket password
  resource: "test", // socket resource
  url: "wss://ws.foreks.com", // socket url
  isReconnection: false, // is reconnection default is false
  autoReconnect: true, // auto reconnect on error or on close
  reConnectInterval: 5000, // auto reconnect interval
};

test("TEsting Connection to pubsub", async () => {
  _ws = await PubsubConnector.connect(options);
  expect(_ws).toBeDefined();
});

afterAll(() => _ws.close());
