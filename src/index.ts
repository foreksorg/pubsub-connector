export interface PubsubLicense {
  delay: number;
  name: string;
}
export interface PubsubData {
  _id: number; // id of message
  _i?: string; // definition id
  _s?: number; // is snapshot
  t?: number; // time
  result?: number; // resulting
  st?: string; // status
  licenses?: PubsubLicense[]; // licenses
}
export interface IPubSubConnectionOptions {
  username: string;
  password: string;
  resource: string;
  url: string;
  company: string;
  appName: string;
  autoReconnect?: boolean;
  reConnectInterval?: number;
  reConnectCountLimit?: number;
  sendData?: Function;
  onError?: Function;
}

export interface IPubsubConnector {
  /**
   * @description reset reconnect count
   * @return {void}
   */
  resetReconnectCount(): void;

  /**
   * @description set options for socket
   * @param {PubSubConnectionOptions} options : options
   * @return {void}
   */
  setOptions(options: IPubSubConnectionOptions): void;

  /**
   * @description get socket connection
   * @return {WebSocket}
   */
  getSocket(): WebSocket;

  /**
   * @description connect to socket
   * @return {Promise<WebSocket>}
   */
  connect(): Promise<WebSocket>;

  /**
   * @description disconnect from socket
   * @return {void}
   */
  disconnect(): void;

  /**
   * @description is socket ready
   * @return {boolean}
   */
  isSocketReady(): boolean;

  /**
   * @description get subscription by id
   * @param {string} id id
   */
  getSubscriptionsById(id: string);

  /**
   * @description get subscriptions
   * @return {any}
   */
  getSubscriptions(): any;

  /**
   * @description send message via socket
   * @param {string} message  message
   * @return {void}
   */
  send(message: string): void;

  /**
   * @description send login message to socket
   * @param {string} username username
   * @param {string} password password
   * @param {string} resource resource
   * @return {void}
   */
  login(username: string, password: string, resource: string): void;

  /**
   * @description schedule heart beat for socket service.
   * @return {void}
   */
  scheduleHeartbeat(): void;

  /**
   * @description subscribe
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @param {Function} callback callback method
   * @return {number} subscription id
   */
  subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: PubsubData) => PubsubData
  ): number;

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @return {void}
   */
  checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;

  /**
   * @description get field snapshot value if exsist
   * @param {string} definitionId definition id
   * @param {string} fieldShortCode fields shortcode
   * @return {any | null} field value
   */
  getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null;

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {number} subId : subscription id
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   * @return {void}
   */
  addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void;

  /**
   * @description re subscribe with old subscription map
   * @return {void}
   */
  reSubscribe(): void;

  /**
   * @description unsubscribe with subscription id
   * @param {number} id subscription id
   * @return {void}
   */
  unSubscribe(id: number): void;

  /**
   * @description unsubscribe all subscriptions
   * @return {void}
   */
  unSubscribeAll(): void;

  /**
   * @description feed subscriptions
   * @param {PubsubData} data socket data
   * @return {void}
   */
  feedSubscriptions(data: PubsubData): void;

  /**
   * @description callback
   * @param {PubsubData} data socket data
   * @return {void}
   */
  callback(data: PubsubData): void;

  /**
   * @description send message via socket
   * @param {PubsubData} data socket data
   * @return {void}
   */
  messageEvent(data: PubsubData): void;

  /**
   * @description get user licenses
   * @return {PubsubLicense[]} user licenses
   */
  getLicenses(): PubsubLicense[];
}

/**
 * @description Pubsub Socket Service provide connect socket and manage socket actions
 */
export default class PubsubConnector implements IPubsubConnector {
  private socket!: WebSocket;
  private subscriptions: any = {};
  private subscriptionsMap: any[] = [];
  private isLogin: boolean = false;
  private subId = 0;
  private userLincenses: PubsubLicense[] = [];
  private reConnectCount = 0;
  private options: IPubSubConnectionOptions = {
    url: "wss://websocket.foreks.com",
    username: "",
    password: "",
    resource: "",
    autoReconnect: true,
    reConnectInterval: 5000,
    reConnectCountLimit: 5,
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
   * @description reset reconnect count
   * @return {void}
   */
  public resetReconnectCount(): void {
    this.reConnectCount = 0;
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
   * @return {Promise<WebSocket>}
   */
  public connect(): Promise<WebSocket> {
    this.reConnectCount += 1;
    if (this.reConnectCount > (this.options.reConnectCountLimit || 5)) {
      throw new Error("Too many connection failed");
    }

    return new Promise((resolve, reject) => {
      try {
        const server = new WebSocket(this.options.url);
        this.socket = server;
      } catch (ex) {
        console.error(ex);
        setTimeout(() => {
          this.connect();
        }, this.options.reConnectInterval || 5000);
        return;
      }

      // on server open
      this.socket.onopen = () => {
        this.socket.onmessage = (msg: MessageEvent<any>) => {
          const msgData: PubsubData = JSON.parse(msg.data);
          this.feedSubscriptions(msgData);
          this.messageEvent(msgData);
        };

        this.socket.onclose = () => {
          setTimeout(() => {
            this.connect();
          }, this.options.reConnectInterval || 5000);
        };
        if (!this.isLogin) {
          this.login(
            this.options.username,
            this.options.password,
            this.options.resource
          );
        }

        this.reSubscribe();

        resolve(this.socket);
      };

      // on server error
      this.socket.onerror = (err) => {
        setTimeout(() => {
          if (this.options.autoReconnect) {
            this.connect();
          }
        }, this.options.reConnectInterval || 5000);
        reject(err);
      };
    });
  }

  /**
   * @description disconnect from socket
   * @return {void}
   */
  public disconnect(): void {
    this.socket.onclose = () => {
      console.log("disconnected");
    };
    this.socket.close();
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
   * @param {string} id id
   */
  public getSubscriptionsById(id: string) {
    if (this.subscriptions[id]) {
      return this.subscriptions[id];
    }
  }

  /**
   * @description get subscriptions
   * @return {any}
   */
  public getSubscriptions(): any {
    return this.subscriptions;
  }

  /**
   * @description send message via socket
   * @param {string} message  message
   * @return {void}
   */
  public send(message: string): void {
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
   * @param {string} username username
   * @param {string} password password
   * @param {string} resource resource
   * @return {void}
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
      } else {
        deviceOss = process.platform;
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
            "client-navigator": clientNavigator.replace(/,/g, ""),
          },
          resource,
        })
      );
    }
  }

  /**
   * @description schedule heart beat for socket service.
   * @return {void}
   */
  public scheduleHeartbeat(): void {
    setInterval(() => {
      this.send(
        JSON.stringify({
          _id: 16,
        })
      );
    }, 13_000);
  }

  /**
   * @description subscribe
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @param {Function} callback callback method
   * @return {number} subscription id
   */
  public subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: PubsubData) => void
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
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @return {void}
   */
  public checkSubscriptionHasSnapshot(
    symbols: string[],
    fields: string[]
  ): void {
    for (const s of symbols) {
      for (const f of fields) {
        if (
          this.subscriptions[s]?.[f] &&
          typeof this.subscriptions[s][f] !== "undefined"
        ) {
          const sendData: PubsubData = { _id: 1, _s: 1, _i: "" };
          sendData._i = s;
          sendData[f] = this.subscriptions[s][f];
          this.callback(sendData);
          if (this.options.sendData) {
            this.options.sendData(sendData);
          }
        }
      }
    }
  }

  /**
   * @description get field snapshot value if exsist
   * @param {string} definitionId definition id
   * @param {string} fieldShortCode fields shortcode
   * @return {any | null} field value
   */
  public getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null {
    if (
      this.subscriptions[definitionId]?.[fieldShortCode] &&
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
   * @return {void}
   */
  public addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void {
    for (const s of symbols) {
      if (!this.subscriptions[s]) {
        this.subscriptions[s] = {};
        this.subscriptions[s].callback = {};
      }

      if (callback) this.subscriptions[s].callback[subId] = callback;

      for (const f of fields) {
        if (!this.subscriptions[s][f]) {
          this.subscriptions[s][f] = undefined;
        }
      }
    }
  }

  /**
   * @description re subscribe with old subscription map
   * @return {void}
   */
  public reSubscribe(): void {
    if (this.isSocketReady()) {
      this.subscriptions = {};
      const tempSubMap = Object.assign([], this.subscriptionsMap);
      this.subscriptionsMap = [];
      for (const s of tempSubMap as any) {
        this.subscribe(s.symbols, s.fields, s.callback);
      }
    }
  }

  /**
   * @description unsubscribe with subscription id
   * @param {number} id subscription id
   * @return {void}
   */
  public unSubscribe(id: number): void {
    const mapIndex = this.subscriptionsMap.findIndex((s) => s.id === id);
    const findSub = this.subscriptionsMap[mapIndex];
    const foundSameField: any[] = [];
    for (const sm of this.subscriptionsMap) {
      for (const smf of findSub.fields) {
        if (
          sm.fields.includes(smf) &&
          foundSameField.findIndex((fsf) => fsf.id === sm.id) === -1
        ) {
          foundSameField.push(sm);
        }
      }
    }

    if (foundSameField.length <= 1) {
      this.send(
        JSON.stringify({
          _id: 2,
          id: findSub.id,
          symbols: findSub.symbols,
          fields: findSub.fields,
        })
      );
    }
    findSub.symbols.map((symbol: string) => {
      delete this.subscriptions[symbol].callback[id];
    });
    this.subscriptionsMap.splice(mapIndex, 1);
  }

  /**
   * @description unsubscribe all subscriptions
   * @return {void}
   */
  public unSubscribeAll(): void {
    for (const sub of this.subscriptionsMap) {
      this.unSubscribe(sub.id);
    }
  }

  /**
   * @description feed subscriptions
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public feedSubscriptions(data: PubsubData): void {
    if (data._i && this.subscriptions[data._i]) {
      for (const d of Object.keys(data)) {
        if (this.subscriptions[data._i]) {
          this.subscriptions[data._i][d] = data[d];
        }
      }
    }
  }

  /**
   * @description callback
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public callback(data: PubsubData): void {
    if (
      data._i &&
      this.subscriptions[data._i]?.callback &&
      this.subscriptions[data._i].callback
    ) {
      for (const sub of Object.keys(this.subscriptions[data._i].callback)) {
        const callback = this.subscriptions[data._i].callback[sub];
        if (callback) callback(data);
      }
    }
  }

  /**
   * @description send message via socket
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public messageEvent(data: PubsubData): void {
    switch (data._id) {
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
        if (data.result === 0) {
          console.error("message: Same user logged in another location");
          this.disconnect();
          if (this.options.onError) {
            this.options.onError(data);
          }
        }
        // start heartbeat
        if (data.result === 100) {
          this.scheduleHeartbeat();
          this.reSubscribe();
          this.userLincenses = data.licenses || [];
        }
        // login failed
        if (data.result === 101) {
          console.error("message: Socket Login Failed");
          if (this.options.onError) {
            this.options.onError(data);
          }
        }
        break;
      case 1:
        this.callback(data);
        if (this.options.sendData) {
          this.options.sendData(data);
        }
        break;
      case 67:
        break;
      default:
        console.warn(
          "Event message not mapped to any method. Message is : ",
          data
        );
        break;
    }
  }

  /**
   * @description get user licenses
   * @return {PubsubLicense[]} user licenses
   */
  public getLicenses(): PubsubLicense[] {
    return this.userLincenses;
  }
}
