'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = require("ws").WebSocket;
if (typeof window !== "undefined") {
    WebSocket = window.WebSocket;
}
var PubsubConnector = (function () {
    function PubsubConnector(options) {
        this.subscriptions = {};
        this.subscriptionsMap = [];
        this.isLogin = false;
        this.subId = 0;
        this.options = options;
    }
    PubsubConnector.prototype.getSocket = function () {
        return this.socket;
    };
    PubsubConnector.prototype.connect = function () {
        var _this = this;
        var _self = this;
        return new Promise(function (resolve, reject) {
            try {
                var server = new WebSocket(_this.options.url);
                _self.socket = server;
            }
            catch (ex) {
                console.log(ex);
                setTimeout(function () {
                    _self.connect();
                }, _self.options.reConnectInterval || 5000);
                return;
            }
            resolve(_self.socket);
            if (_self.socket) {
                _self.socket.onopen = function () {
                    _self.socket.onmessage = function (msg) {
                        _self.messageEvent(JSON.parse(msg.data));
                        _self.feedSubscriptions(JSON.parse(msg.data));
                    };
                    _self.socket.onclose = function () {
                        setTimeout(function () {
                            _self.connect();
                        }, _self.options.reConnectInterval || 5000);
                    };
                    if (!_self.isLogin) {
                        _self.login(_self.options.username, _self.options.password, _self.options.resource);
                    }
                    if (_self.options.isReconnection) {
                        _self.reSubscribe();
                    }
                    resolve(_self.socket);
                };
                _self.socket.onerror = function (err) {
                    setTimeout(function () {
                        if (_self.options.autoReconnect) {
                            _self.connect();
                        }
                    }, 5000);
                    reject(err);
                };
            }
        });
    };
    PubsubConnector.prototype.disconnect = function () {
        this.socket.close();
    };
    PubsubConnector.prototype.isSocketReady = function () {
        if (this.socket) {
            return this.socket.readyState === WebSocket.OPEN;
        }
        else {
            return false;
        }
    };
    PubsubConnector.prototype.getSubscriptionsById = function (id) {
        if (this.subscriptions[id]) {
            return this.subscriptions[id];
        }
    };
    PubsubConnector.prototype.send = function (message) {
        var _this = this;
        if (this.isSocketReady()) {
            this.socket.send(message);
        }
        else {
            setTimeout(function () {
                _this.send(message);
            }, 400);
        }
    };
    PubsubConnector.prototype.login = function (username, password, resource) {
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
    PubsubConnector.prototype.scheduleHeartbeat = function () {
        var _this = this;
        setInterval(function () {
            _this.send(JSON.stringify({
                _id: 16,
            }));
        }, 14000);
    };
    PubsubConnector.prototype.subscribe = function (symbols, fields, callback) {
        if (!symbols[0]) {
            throw new Error("Symbol expired");
        }
        this.subId = this.subId + 1;
        this.checkSubscriptionHasSnapshot(symbols, fields);
        this.send(JSON.stringify({
            _id: 1,
            id: this.subId,
            symbols: symbols,
            fields: fields,
        }));
        this.subscriptionsMap.push({
            id: this.subId,
            symbols: symbols,
            fields: fields,
            callback: callback,
        });
        this.addSubscriptions(this.subId, symbols, fields, callback);
        return this.subId;
    };
    PubsubConnector.prototype.checkSubscriptionHasSnapshot = function (symbols, fields) {
        var _this = this;
        symbols.forEach(function (s) {
            fields.forEach(function (f) {
                if (_this.subscriptions[s] &&
                    _this.subscriptions[s][f] &&
                    _this.subscriptions[s][f].val) {
                    var sendData = { _id: 1, _s: 1, _i: "" };
                    sendData._i = s;
                    sendData[f] = _this.subscriptions[s][f].val;
                    _this.callback(sendData);
                }
            });
        });
    };
    PubsubConnector.prototype.getFieldSnapShotValue = function (definitionId, fieldShortCode) {
        if (this.subscriptions[definitionId] &&
            this.subscriptions[definitionId][fieldShortCode] &&
            this.subscriptions[definitionId][fieldShortCode].val) {
            return this.subscriptions[definitionId][fieldShortCode].val;
        }
        return null;
    };
    PubsubConnector.prototype.addSubscriptions = function (subId, symbols, fields, callback) {
        var _this = this;
        symbols.forEach(function (s) {
            if (!_this.subscriptions[s]) {
                _this.subscriptions[s] = {};
                _this.subscriptions[s].callback = {};
            }
            _this.subscriptions[s].callback[subId] = callback;
            fields.forEach(function (f) {
                if (!_this.subscriptions[s][f]) {
                    _this.subscriptions[s][f] = {};
                    _this.subscriptions[s][f].count = 1;
                }
                else {
                    _this.subscriptions[s][f].count = _this.subscriptions[s][f].count + 1;
                }
            });
        });
    };
    PubsubConnector.prototype.reSubscribe = function () {
        var _this = this;
        if (this.isSocketReady()) {
            this.subscriptions = {};
            var tempSubMap = Object.assign([], this.subscriptionsMap);
            this.subscriptionsMap = [];
            tempSubMap.forEach(function (s) {
                _this.subscribe(s.symbols, s.fields, s.callback);
            });
        }
    };
    PubsubConnector.prototype.unSubscribe = function (id) {
        var _this = this;
        var findSub = this.subscriptionsMap.find(function (s) { return s.id === id; });
        var unSubSymbols = [];
        var unSubFields = [];
        if (findSub) {
            findSub.symbols.forEach(function (s) {
                findSub.fields.forEach(function (f) {
                    if (_this.subscriptions[s]) {
                        if (_this.subscriptions[s][f].count <= 1) {
                            if (unSubFields.indexOf(f) === -1) {
                                unSubFields.push(f);
                                unSubSymbols.push(s);
                                delete _this.subscriptions[s].callback[id];
                            }
                            _this.subscriptions[s][f].count = 0;
                        }
                        else {
                            _this.subscriptions[s][f].count =
                                _this.subscriptions[s][f].count - 1;
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
    PubsubConnector.prototype.feedSubscriptions = function (data) {
        var _this = this;
        if (this.subscriptions[data._i]) {
            Object.keys(data).forEach(function (d) {
                if (_this.subscriptions[data._i][d]) {
                    _this.subscriptions[data._i][d].val = data[d];
                }
            });
        }
    };
    PubsubConnector.prototype.callback = function (data) {
        if (this.subscriptions[data._i] &&
            this.subscriptions[data._i].callback &&
            this.subscriptions[data._i].callback) {
            for (var i = 0; i < Object.keys(this.subscriptions[data._i].callback).length; i++) {
                var callback = this.subscriptions[data._i].callback[Object.keys(this.subscriptions[data._i].callback)[i]];
                if (callback)
                    callback(data);
            }
        }
    };
    PubsubConnector.prototype.messageEvent = function (message) {
        switch (message._id) {
            case 0:
                break;
            case 16:
                break;
            case 18:
                this.login(this.options.username, this.options.password, this.options.resource);
                break;
            case 65:
                if (message.result === 0) {
                    console.log("message: Same user logged in another location");
                    this.socket.close();
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
    return PubsubConnector;
}());
exports.default = PubsubConnector;
