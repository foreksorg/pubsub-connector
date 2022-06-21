import IPubSubConnectionOptions from "./IPubSubConnectionOptions";
import IPubsubConnector from "./IPubsubConnector";

const WebSocket =
  typeof window === "undefined" ? require("ws") : window.WebSocket;

/**
 * @description Pubsub Socket Service provide connect socket and manage socket actions
 */
export default class PubsubConnector implements IPubsubConnector {
  private socket!: WebSocket;
  private subscriptions: any = {};
  private subscriptionsMap: any[] = [];
  private isLogin: boolean = false;
  private subId = 0;
  private userLincenses = [];
  private reConnectCount = 0;
  private options: IPubSubConnectionOptions = {
    url: "wss://websocket.foreks.com",
    username: "",
    password: "",
    resource: "",
    autoReconnect: true,
    reConnectInterval: 5000,
    company: "",
    appName: "",
  };

  /**
   * @description contructor
   * @param {PubSubConnectionOptions} options : options
   */
  constructor(options?: IPubSubConnectionOptions) {
    if (options) {
      this.options = options;
    }
  }

  /**
   * @description set options for socket
   * @param {PubSubConnectionOptions} options : options
   * @return {void}
   */
  public setOptions(options: IPubSubConnectionOptions): void {
    this.options = options;
  }

  /**
   * @description get socket connection
   * @return {WebSocket}
   */
  public getSocket(): WebSocket {
    return this.socket;
  }

  /**
   * @description connect to socket
   * @param {PubSubConnectionOptions} options : options
   */
  public connect(): Promise<WebSocket> {
    const _self = this;
    this.reConnectCount += 1;
    if (this.reConnectCount > 5) {
      throw new Error("Too many connection failed");
    }

    return new Promise((resolve, reject) => {
      try {
        const server = new WebSocket(this.options.url);
        _self.socket = server;
      } catch (ex) {
        console.log(ex);
        setTimeout(() => {
          _self.connect();
        }, _self.options.reConnectInterval || 5000);
        return;
      }

      // on server open
      _self.socket.onopen = () => {
        _self.socket.onmessage = (msg: any) => {
          const msgData = JSON.parse(msg.data);
          _self.feedSubscriptions(msgData);
          _self.messageEvent(msgData);
        };

        _self.socket.onclose = (message) => {
          if (message.code !== 1905) {
            setTimeout(() => {
              _self.connect();
            }, _self.options.reConnectInterval || 5000);
          }
        };
        if (!_self.isLogin) {
          _self.login(
            _self.options.username,
            _self.options.password,
            _self.options.resource
          );
        }

        _self.reSubscribe();

        resolve(_self.socket);
      };

      // on server error
      _self.socket.onerror = (err) => {
        setTimeout(() => {
          if (_self.options.autoReconnect) {
            _self.connect();
          }
        }, _self.options.reConnectInterval || 5000);
        reject(err);
      };
    });
  }

  /**
   * @description disconnect from socket
   */
  public disconnect(): void {
    this.socket.close(1905);
  }

  /**
   * @description is socket ready
   * @return {boolean}
   */
  public isSocketReady(): boolean {
    return this.socket ? this.socket.readyState === WebSocket.OPEN : false;
  }

  /**
   * @description get subscription by id
   * @param {string} id : id
   */
  public getSubscriptionsById(id: string) {
    if (this.subscriptions[id]) {
      return this.subscriptions[id];
    }
  }

  /**
   * @description get subscriptions
   * @returns {any}
   */
  public getSubscriptions(): any {
    return this.subscriptions;
  }

  /**
   * @description send message via socket
   * @param {string} message : message
   */
  public send(message: string) {
    if (this.isSocketReady()) {
      this.socket.send(message);
    } else {
      setTimeout(() => {
        this.send(message);
      }, 400);
    }
  }

  /**
   * @description send login message to socket
   * @param {string} username : username
   * @param {string} password : password
   * @param {string} resource : resource
   */
  public login(username: string, password: string, resource: string): void {
    if (this.isSocketReady()) {
      let deviceOss = "";
      let deviceModel = "";
      let clientAddress = "";
      let clientPort = "";
      let clientLanguage = "";
      let clientNavigator = "";
      if (typeof window !== "undefined") {
        deviceOss = window.navigator.platform;
        deviceModel = window.navigator.product;
        clientAddress = location.origin;
        clientPort = location.port;
        clientLanguage = window.navigator.language;
        clientNavigator = window.navigator.appVersion;
      }

      this.send(
        JSON.stringify({
          _id: 64,
          user: username,
          password,
          info: {
            company: this.options.company || "",
            resource,
            platform: "web",
            "app-name": this.options.appName || "NA",
            "device-os": deviceOss,
            "device-model": deviceModel,
            "client-address": clientAddress,
            "client-port": clientPort,
            "client-language": clientLanguage,
            "client-navigator": clientNavigator,
          },
          resource,
        })
      );
    }
  }

  /**
   * @description schedule heart beat for socket service.
   */
  public scheduleHeartbeat(): void {
    setInterval(() => {
      this.send(
        JSON.stringify({
          _id: 16,
        })
      );
    }, 14_000);
  }

  /**
   * @description subscribe
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   * @returns {number} subscription id
   */
  public subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): number {
    if (!symbols[0]) {
      throw new Error("Symbol expired");
    }
    this.subId = this.subId + 1;
    this.checkSubscriptionHasSnapshot(symbols, fields);

    this.send(
      JSON.stringify({
        _id: 1,
        id: this.subId,
        symbols,
        fields,
      })
    );

    this.subscriptionsMap.push({
      id: this.subId,
      symbols,
      fields,
      callback,
    });

    this.addSubscriptions(this.subId, symbols, fields, callback);

    return this.subId;
  }

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   */
  public checkSubscriptionHasSnapshot(symbols: string[], fields: string[]) {
    symbols.forEach((s) => {
      fields.forEach((f) => {
        if (
          this.subscriptions[s] &&
          this.subscriptions[s][f] &&
          typeof this.subscriptions[s][f] !== "undefined"
        ) {
          const sendData = { _id: 1, _s: 1, _i: "" };
          sendData._i = s;
          sendData[f] = this.subscriptions[s][f];
          this.callback(sendData);
          if (this.options.sendData) {
            this.options.sendData(sendData);
          }
        }
      });
    });
  }

  /**
   * @description get field snapshot value if exsist
   * @param {string} definitionId : definition id
   * @param {string} fieldShortCode : fields shortcode
   */
  public getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null {
    if (
      this.subscriptions[definitionId] &&
      this.subscriptions[definitionId][fieldShortCode] &&
      this.subscriptions[definitionId][fieldShortCode]
    ) {
      return this.subscriptions[definitionId][fieldShortCode];
    }
    return null;
  }

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {number} subId : subscription id
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   */
  public addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void {
    symbols.forEach((s) => {
      if (!this.subscriptions[s]) {
        this.subscriptions[s] = {};
        this.subscriptions[s].callback = {};
      }

      this.subscriptions[s].callback[subId] = callback;

      fields.forEach((f) => {
        if (!this.subscriptions[s][f]) {
          this.subscriptions[s][f] = undefined;
        }
      });
    });
  }

  /**
   * @description re subscribe with old subscription map
   */
  public reSubscribe(): void {
    if (this.isSocketReady()) {
      this.subscriptions = {};
      const tempSubMap = Object.assign([], this.subscriptionsMap);
      this.subscriptionsMap = [];
      tempSubMap.forEach((s: any) => {
        this.subscribe(s.symbols, s.fields, s.callback);
      });
    }
  }

  /**
   * @description unsubscribe with subscription id
   * @param {number} id : subscription id
   */
  public unSubscribe(id: number): void {
    const mapIndex = this.subscriptionsMap.findIndex((s) => s.id === id);
    const findSub = this.subscriptionsMap[mapIndex];
    if (findSub) {
      this.send(
        JSON.stringify({
          _id: 2,
          id: findSub.id,
          symbols: findSub.symbols,
          fields: findSub.fields,
        })
      );
      const keys = Object.keys(this.subscriptions);
      for (let i = 0; i < keys.length; i++) {
        const sub = this.subscriptions[keys[i]];
        if (sub.callback && sub.callback[id]) {
          sub.callback[id] = undefined;
        }
      }
      this.subscriptionsMap.splice(mapIndex, 1);
    }
  }

  /**
   * @description unsubscribe all subscriptions
   */
  public unSubscribeAll(): void {
    for (let i = 0; i < this.subscriptionsMap.length; i++) {
      const sub = this.subscriptionsMap[i];
      this.unSubscribe(sub.id);
    }
  }

  /**
   * @description feed subscriptions
   * @param {any} data : socket data
   */
  public feedSubscriptions(data: any): void {
    if (this.subscriptions[data._i]) {
      Object.keys(data).forEach((d) => {
        if (this.subscriptions[data._i]) {
          this.subscriptions[data._i][d] = data[d];
        }
      });
    }
  }

  /**
   * @description callback
   * @param {any} data : socket data
   */
  public callback(data: any): void {
    if (
      this.subscriptions[data._i] &&
      this.subscriptions[data._i].callback &&
      this.subscriptions[data._i].callback
    ) {
      for (
        let i = 0;
        i < Object.keys(this.subscriptions[data._i].callback).length;
        i++
      ) {
        const callback =
          this.subscriptions[data._i].callback[
            Object.keys(this.subscriptions[data._i].callback)[i]
          ];
        if (callback) callback(data);
      }
    }
  }

  /**
   * @description send message via socket
   * @param {string} message : message
   */
  public messageEvent(message: any) {
    switch (message._id) {
      case 0:
        break;
      case 16:
        break;
      case 18:
        this.login(
          this.options.username,
          this.options.password,
          this.options.resource
        );
        break;
      case 65:
        // Same user logged in another location
        if (message.result === 0) {
          console.log("message: Same user logged in another location");
          this.socket.close();
          if (this.options.onError) {
            this.options.onError(message);
          }
        }
        // start heartbeat
        if (message.result === 100) {
          this.scheduleHeartbeat();
          this.reSubscribe();
          this.userLincenses = message.licenses;
        }
        // login failed
        if (message.result === 101) {
          console.log("message: Socket Login Failed");
          if (this.options.onError) {
            this.options.onError(message);
          }
        }
        break;
      case 1:
        this.callback(message);
        if (this.options.sendData) {
          this.options.sendData(message);
        }
        break;
      case 67:
        break;
      default:
        console.warn(
          "Event message not mapped to any method. Message is : ",
          message
        );
        break;
    }
  }

  /**
   * @description get user licenses
   */
  public getLicenses(): any[] {
    return this.userLincenses;
  }
}
