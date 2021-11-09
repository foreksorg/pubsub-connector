let { WebSocket } = require("ws");

if (typeof window !== "undefined") {
  WebSocket = window.WebSocket;
}

/**
 * @description Pubsub Socket Service provide connect socket and manage socket actions
 */
export default class {
  static _socket: WebSocket;
  static _subscriptions: any = {};
  static _subscriptionsMap: any[] = [];
  static _isLogin: boolean = false;
  static _subId = 0;
  static _options: PubSubConnectionOptions;

  /**
   * @description connect to socket
   * @param {PubSubConnectionOptions} options : options
   */
  public static connect(options: PubSubConnectionOptions): Promise<WebSocket> {
    this._options = options;

    return new Promise((resolve, reject) => {
      const _self = this;

      try {
        let server = new WebSocket(options.url);
        _self._socket = server;
      } catch (ex) {
        console.log(ex);
      }

      resolve(_self._socket);

      // on server open
      if (_self._socket) {
        _self._socket.onopen = function () {
          _self._socket.onmessage = (msg: any) => {
            _self.messageEvent(JSON.parse(msg.data));
            _self.feedSubscriptions(JSON.parse(msg.data));
          };

          _self._socket.onclose = () => {
            setTimeout(() => {
              _self.connect(options);
            }, options.reConnectInterval || 5000);
          };
          if (!_self._isLogin) {
            _self.login(options.username, options.password, options.resource);
          }

          if (options.isReconnection) {
            _self.reSubscribe();
          }

          resolve(_self._socket);
        };

        // on server error
        _self._socket.onerror = function (err) {
          setTimeout(() => {
            if (options.autoReconnect) {
              _self.connect(options);
            }
          }, 5000);
          reject(err);
        };
      }
    });
  }

  /**
   * @description is socket ready
   * @return {boolean}
   */
  public static isSocketReady(): boolean {
    if (this._socket) {
      return this._socket.readyState === WebSocket.OPEN;
    } else {
      return false;
    }
  }

  /**
   * @description get subscription by id
   * @param {string} id : id
   */
  public static getSubscriptionsById(id: string) {
    if (this._subscriptions[id]) {
      return this._subscriptions[id];
    }
  }

  /**
   * @description send message via socket
   * @param {string} message : message
   */
  public static send(message: string) {
    if (this.isSocketReady()) {
      this._socket.send(message);
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
  public static login(
    username: string,
    password: string,
    resource: string
  ): void {
    if (this.isSocketReady()) {
      this.send(
        JSON.stringify({
          _id: 64,
          user: username,
          password: password,
          info: {
            company: "foreks",
            resource: resource,
            platform: "web",
            "device-os": window ? window.navigator.platform : "",
            "device-model": window ? window.navigator.product : "",
            "device-os-version": "",
            "app-version": "1.0.1",
            "app-name": "foreks-widget-service",
            "client-address": location ? location.origin : "",
            "client-port": location ? location.port : "",
            "client-language": window ? window.navigator.language : "",
            "client-navigator": window ? window.navigator.appVersion : "",
          },
          resource: resource,
        })
      );
    }
  }

  /**
   * @description schedule heart beat for socket service.
   */
  public static scheduleHeartbeat(): void {
    setInterval(() => {
      this.send(
        JSON.stringify({
          _id: 16,
        })
      );
    }, 14000);
  }

  /**
   * @description subscribe
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   * @returns {number} subscription id
   */
  public static subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): number {
    if (!symbols[0]) {
      throw new Error("Symbol expired");
    }
    this._subId = this._subId + 1;
    this.checkSubscriptionHasSnapshot(symbols, fields);

    this.send(
      JSON.stringify({
        _id: 1,
        id: this._subId,
        symbols: symbols,
        fields: fields,
      })
    );

    this._subscriptionsMap.push({
      id: this._subId,
      symbols: symbols,
      fields: fields,
      callback: callback,
    });

    this.addSubscriptions(this._subId, symbols, fields, callback);

    return this._subId;
  }

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   */
  public static checkSubscriptionHasSnapshot(
    symbols: string[],
    fields: string[]
  ) {
    symbols.forEach((s) => {
      fields.forEach((f) => {
        if (this._subscriptions[s]) {
          if (this._subscriptions[s][f]) {
            if (this._subscriptions[s][f].val) {
              const sendData = { _id: 1, _s: 1, _i: "" };
              sendData._i = s;
              sendData[f] = this._subscriptions[s][f].val;
              this.callback(sendData);
            }
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
  public static getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null {
    if (
      this._subscriptions[definitionId] &&
      this._subscriptions[definitionId][fieldShortCode] &&
      this._subscriptions[definitionId][fieldShortCode].val
    ) {
      return this._subscriptions[definitionId][fieldShortCode].val;
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
  public static addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void {
    symbols.forEach((s) => {
      if (!this._subscriptions[s]) {
        this._subscriptions[s] = {};
        this._subscriptions[s].callback = {};
      }

      this._subscriptions[s].callback[subId] = callback;

      fields.forEach((f) => {
        if (!this._subscriptions[s][f]) {
          this._subscriptions[s][f] = {};
          this._subscriptions[s][f].count = 1;
        } else {
          this._subscriptions[s][f].count = this._subscriptions[s][f].count + 1;
        }
      });
    });
  }

  /**
   * @description re subscribe with old subscription map
   */
  public static reSubscribe(): void {
    if (this.isSocketReady()) {
      this._subscriptions = {};
      const tempSubMap = Object.assign([], this._subscriptionsMap);
      this._subscriptionsMap = [];
      tempSubMap.forEach((s: any) => {
        this.subscribe(s.symbols, s.fields, s.callback);
      });
    }
  }

  /**
   * @description unsubscribe with subscription id
   * @param {number} id : subscription id
   */
  public static unSubscribe(id: number): void {
    const findSub = this._subscriptionsMap.find((s) => s.id === id);
    const unSubSymbols: string[] = [];
    const unSubFields: string[] = [];
    if (findSub) {
      findSub.symbols.forEach((s) => {
        findSub.fields.forEach((f) => {
          if (this._subscriptions[s]) {
            if (this._subscriptions[s][f].count <= 1) {
              if (unSubFields.indexOf(f) === -1) {
                unSubFields.push(f);
                unSubSymbols.push(s);
                delete this._subscriptions[s].callback[id];
              }
              this._subscriptions[s][f].count = 0;
            } else {
              this._subscriptions[s][f].count =
                this._subscriptions[s][f].count - 1;
            }
          }
        });
      });
    }

    // send unsubscibe message
    if (unSubSymbols.length > 0 || unSubFields.length > 0) {
      this.send(
        JSON.stringify({
          _id: 2,
          id: id,
          symbols: unSubSymbols,
          fields: unSubFields,
        })
      );
    }
  }

  /**
   * @description feed subscriptions
   * @param {any} data : socket data
   */
  public static feedSubscriptions(data: any): void {
    if (this._subscriptions[data._i]) {
      Object.keys(data).forEach((d) => {
        if (this._subscriptions[data._i][d]) {
          this._subscriptions[data._i][d].val = data[d];
        }
      });
    }
  }

  /**
   * @description callback
   * @param {any} data : socket data
   */
  public static callback(data: any): void {
    if (
      this._subscriptions[data._i] &&
      this._subscriptions[data._i].callback &&
      this._subscriptions[data._i].callback
    ) {
      for (
        let i = 0;
        i < Object.keys(this._subscriptions[data._i].callback).length;
        i++
      ) {
        const callback =
          this._subscriptions[data._i].callback[
            Object.keys(this._subscriptions[data._i].callback)[i]
          ];
        if (callback) callback(data);
      }
    }
  }

  /**
   * @description send message via socket
   * @param {string} message : message
   */
  public static messageEvent(message: any) {
    switch (message._id) {
      case 0:
        break;
      case 16:
        break;
      case 18:
        this.login(
          this._options.username,
          this._options.password,
          this._options.resource
        );
        break;
      case 65:
        // Same user logged in another location
        if (message.result === 0) {
          console.log("message: Same user logged in another location");
          this._socket.close();
        }
        // start heartbeat
        if (message.result === 100) {
          this.scheduleHeartbeat();
          this.reSubscribe();
        }
        // login failed
        if (message.result === 101) {
          console.log("message: Socket Login Failed");
        }
        break;
      case 1:
        this.callback(message);
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
}

export interface Connector {
  _socket: WebSocket;
  _subscriptions: any;
  _subscriptionsMap: any[];
  _isLogin: boolean;
  _subId: number;
  _options: PubSubConnectionOptions;
  connect(options: PubSubConnectionOptions): Promise<WebSocket>;
  isSocketReady(): boolean;
  getSubscriptionsById(id: string): any;
  send(message: string): void;
  login(username: string, password: string, resource: string): void;
  scheduleHeartbeat(): void;
  subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): number;
  checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
  getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null;
  addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void;
  reSubscribe(): void;
  unSubscribe(id: number): void;
  feedSubscriptions(data: any): void;
  callback(data: any): void;
  messageEvent(message: any): void;
}

export interface PubSubConnectionOptions {
  username: string;
  password: string;
  resource: string;
  url: string;
  isReconnection?: boolean;
  autoReconnect?: boolean;
  reConnectInterval?: number;
}
