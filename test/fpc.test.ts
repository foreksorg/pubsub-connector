import PubsubConnector from "../dist";
import IPubsubConnector from "../dist/IPubsubConnector";

let _socket: WebSocket;
let _connector: IPubsubConnector;
const options = {
  username: "test", // socket username
  password: "test", // socket password
  resource: "test", // socket resource
  url: "wss://ws.foreks.com", // socket url
  isReconnection: false, // is reconnection default is false
  autoReconnect: true, // auto reconnect on error or on close
  reConnectInterval: 5000, // auto reconnect interval
};

beforeAll(async () => {
  _connector = new PubsubConnector(options);
  _socket = await _connector.connect();
});

test("Testing connection subscribe ready state", () => {
  _connector.subscribe(["o17"], ["l"]);
  expect(_connector.getSubscriptionsById("o17")).toBeDefined();
});

test("Testing disconnection", () => {
  _connector.disconnect();
  expect(_socket.readyState).toBe(2);
  setTimeout(() => {
    expect(_socket.readyState).toEqual(3);
  }, 1500);
});

afterAll((done) => {
  done();
});
