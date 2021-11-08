var { PubsubConnector } = require("../dist");

const options = {
  username: "test", // socket username
  password: "test", // socket password
  resource: "test", // socket resource
  url: "wss://ws.foreks.com", // socket url
  isReconnection: false, // is reconnection default is false
  autoReconnect: true, // auto reconnect on error or on close
  reConnectInterval: 5000, // auto reconnect interval
};

PubsubConnector.connect(options)
  .then((connection) => {
    setTimeout(() => {
      console.log("Login Status", PubsubConnector._isLogged);
      process.exit(1);
    }, 5000);
  })
  .catch((ex) => {
    console.log(ex);
    process.exit(1);
  });
