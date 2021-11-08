'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
exports.PubsubConnector = void 0;
var ws_1 = require("ws");
var PubsubConnector = (function () {
    function PubsubConnector() {
    }
    PubsubConnector.connect = function (options) {
        var _this = this;
        this._options = options;
        return new Promise(function (resolve, reject) {
            var _self = _this;
            try {
                var server = new ws_1.WebSocket(options.url);
                _self._socket = server;
            }
            catch (ex) {
                console.log(ex);
            }
            resolve(_self._socket);
            if (_self._socket) {
                _self._socket.onopen = function () {
                    _self._socket.onmessage = function (msg) {
                        _self.messageEvent(JSON.parse(msg.data));
                        _self.feedSubscriptions(JSON.parse(msg.data));
                    };
                    _self._socket.onclose = function () {
                        setTimeout(function () {
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
                _self._socket.onerror = function (err) {
                    setTimeout(function () {
                        if (options.autoReconnect) {
                            _self.connect(options);
                        }
                    }, 5000);
                    reject(err);
                };
            }
        });
    };
    PubsubConnector.isSocketReady = function () {
        if (this._socket) {
            return this._socket.readyState === ws_1.WebSocket.OPEN;
        }
        else {
            return false;
        }
    };
    PubsubConnector.getSubscriptionsById = function (id) {
        if (this._subscriptions[id]) {
            return this._subscriptions[id];
        }
    };
    PubsubConnector.send = function (message) {
        var _this = this;
        if (this.isSocketReady()) {
            this._socket.send(message);
        }
        else {
            setTimeout(function () {
                _this.send(message);
            }, 400);
        }
    };
    PubsubConnector.login = function (username, password, resource) {
        if (this.isSocketReady()) {
            this.send(JSON.stringify({
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
            }));
        }
    };
    PubsubConnector.scheduleHeartbeat = function () {
        var _this = this;
        setInterval(function () {
            _this.send(JSON.stringify({
                _id: 16,
            }));
        }, 14000);
    };
    PubsubConnector.subscribe = function (symbols, fields, callback) {
        if (!symbols[0]) {
            throw new Error("Symbol expired");
        }
        this._subId = this._subId + 1;
        this.checkSubscriptionHasSnapshot(symbols, fields);
        this.send(JSON.stringify({
            _id: 1,
            id: this._subId,
            symbols: symbols,
            fields: fields,
        }));
        this._subscriptionsMap.push({
            id: this._subId,
            symbols: symbols,
            fields: fields,
            callback: callback,
        });
        this.addSubscriptions(this._subId, symbols, fields, callback);
        return this._subId;
    };
    PubsubConnector.checkSubscriptionHasSnapshot = function (symbols, fields) {
        var _this = this;
        symbols.forEach(function (s) {
            fields.forEach(function (f) {
                if (_this._subscriptions[s]) {
                    if (_this._subscriptions[s][f]) {
                        if (_this._subscriptions[s][f].val) {
                            var sendData = { _id: 1, _s: 1, _i: "" };
                            sendData._i = s;
                            sendData[f] = _this._subscriptions[s][f].val;
                            _this.callback(sendData);
                        }
                    }
                }
            });
        });
    };
    PubsubConnector.getFieldSnapShotValue = function (definitionId, fieldShortCode) {
        if (this._subscriptions[definitionId] &&
            this._subscriptions[definitionId][fieldShortCode] &&
            this._subscriptions[definitionId][fieldShortCode].val) {
            return this._subscriptions[definitionId][fieldShortCode].val;
        }
        return null;
    };
    PubsubConnector.addSubscriptions = function (subId, symbols, fields, callback) {
        var _this = this;
        symbols.forEach(function (s) {
            if (!_this._subscriptions[s]) {
                _this._subscriptions[s] = {};
                _this._subscriptions[s].callback = {};
            }
            _this._subscriptions[s].callback[subId] = callback;
            fields.forEach(function (f) {
                if (!_this._subscriptions[s][f]) {
                    _this._subscriptions[s][f] = {};
                    _this._subscriptions[s][f].count = 1;
                }
                else {
                    _this._subscriptions[s][f].count = _this._subscriptions[s][f].count + 1;
                }
            });
        });
    };
    PubsubConnector.reSubscribe = function () {
        var _this = this;
        if (this.isSocketReady()) {
            this._subscriptions = {};
            var tempSubMap = Object.assign([], this._subscriptionsMap);
            this._subscriptionsMap = [];
            tempSubMap.forEach(function (s) {
                _this.subscribe(s.symbols, s.fields, s.callback);
            });
        }
    };
    PubsubConnector.unSubscribe = function (id) {
        var _this = this;
        var findSub = this._subscriptionsMap.find(function (s) { return s.id === id; });
        var unSubSymbols = [];
        var unSubFields = [];
        if (findSub) {
            findSub.symbols.forEach(function (s) {
                findSub.fields.forEach(function (f) {
                    if (_this._subscriptions[s]) {
                        if (_this._subscriptions[s][f].count <= 1) {
                            if (unSubFields.indexOf(f) === -1) {
                                unSubFields.push(f);
                                unSubSymbols.push(s);
                                delete _this._subscriptions[s].callback[id];
                            }
                            _this._subscriptions[s][f].count = 0;
                        }
                        else {
                            _this._subscriptions[s][f].count =
                                _this._subscriptions[s][f].count - 1;
                        }
                    }
                });
            });
        }
        if (unSubSymbols.length > 0 || unSubFields.length > 0) {
            this.send(JSON.stringify({
                _id: 2,
                id: id,
                symbols: unSubSymbols,
                fields: unSubFields,
            }));
        }
    };
    PubsubConnector.feedSubscriptions = function (data) {
        var _this = this;
        if (this._subscriptions[data._i]) {
            Object.keys(data).forEach(function (d) {
                if (_this._subscriptions[data._i][d]) {
                    _this._subscriptions[data._i][d].val = data[d];
                }
            });
        }
    };
    PubsubConnector.callback = function (data) {
        if (this._subscriptions[data._i] &&
            this._subscriptions[data._i].callback &&
            this._subscriptions[data._i].callback) {
            for (var i = 0; i < Object.keys(this._subscriptions[data._i].callback).length; i++) {
                var callback = this._subscriptions[data._i].callback[Object.keys(this._subscriptions[data._i].callback)[i]];
                if (callback)
                    callback(data);
            }
        }
    };
    PubsubConnector.messageEvent = function (message) {
        switch (message._id) {
            case 0:
                break;
            case 16:
                break;
            case 18:
                this.login(this._options.username, this._options.password, this._options.resource);
                break;
            case 65:
                if (message.result === 0) {
                    console.log("message: Same user logged in another location");
                    this._socket.close();
                }
                if (message.result === 100) {
                    this.scheduleHeartbeat();
                    this.reSubscribe();
                }
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
                console.warn("Event message not mapped to any method. Message is : ", message);
                break;
        }
    };
    PubsubConnector._subscriptions = {};
    PubsubConnector._subscriptionsMap = [];
    PubsubConnector._isLogin = false;
    PubsubConnector._subId = 0;
    return PubsubConnector;
}());
exports.PubsubConnector = PubsubConnector;
