'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var WebSocket = typeof window === "undefined" ? require("ws") : window.WebSocket;
var PubsubConnector = (function () {
    function PubsubConnector(options) {
        this.subscriptions = {};
        this.subscriptionsMap = [];
        this.isLogin = false;
        this.subId = 0;
        this.reConnectCount = 0;
        this.options = {
            url: "wss://websocket.foreks.com",
            username: "",
            password: "",
            resource: "",
            autoReconnect: true,
            reConnectInterval: 5000,
            isReconnection: true,
            company: "",
            appName: "",
        };
        if (options) {
            this.options = options;
        }
    }
    PubsubConnector.prototype.setOptions = function (options) {
        this.options = options;
    };
    PubsubConnector.prototype.getSocket = function () {
        return this.socket;
    };
    PubsubConnector.prototype.connect = function () {
        var _this = this;
        var _self = this;
        this.reConnectCount += 1;
        if (this.reConnectCount > 50) {
            throw new Error("Too many connection failed");
        }
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
                }, _self.options.reConnectInterval || 5000);
                reject(err);
            };
        });
    };
    PubsubConnector.prototype.disconnect = function () {
        this.socket.close();
    };
    PubsubConnector.prototype.isSocketReady = function () {
        return this.socket ? this.socket.readyState === WebSocket.OPEN : false;
    };
    PubsubConnector.prototype.getSubscriptionsById = function (id) {
        if (this.subscriptions[id]) {
            return this.subscriptions[id];
        }
    };
    PubsubConnector.prototype.getSubscriptions = function () {
        return this.subscriptions;
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
            var deviceOss = "";
            var deviceModel = "";
            var clientAddress = "";
            var clientPort = "";
            var clientLanguage = "";
            var clientNavigator = "";
            if (typeof window !== "undefined") {
                deviceOss = window.navigator.platform;
                deviceModel = window.navigator.product;
                clientAddress = location.origin;
                clientPort = location.port;
                clientLanguage = window.navigator.language;
                clientNavigator = window.navigator.appVersion;
            }
            this.send(JSON.stringify({
                _id: 64,
                user: username,
                password: password,
                info: {
                    company: this.options.company || "",
                    resource: resource,
                    platform: "web",
                    "app-name": this.options.appName || "NA",
                    "device-os": deviceOss,
                    "device-model": deviceModel,
                    "client-address": clientAddress,
                    "client-port": clientPort,
                    "client-language": clientLanguage,
                    "client-navigator": clientNavigator,
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
                    typeof _this.subscriptions[s][f] !== "undefined") {
                    var sendData = { _id: 1, _s: 1, _i: "" };
                    sendData._i = s;
                    sendData[f] = _this.subscriptions[s][f];
                    _this.callback(sendData);
                    if (_this.options.sendData) {
                        _this.options.sendData(sendData);
                    }
                }
            });
        });
    };
    PubsubConnector.prototype.getFieldSnapShotValue = function (definitionId, fieldShortCode) {
        if (this.subscriptions[definitionId] &&
            this.subscriptions[definitionId][fieldShortCode] &&
            this.subscriptions[definitionId][fieldShortCode]) {
            return this.subscriptions[definitionId][fieldShortCode];
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
                    _this.subscriptions[s][f] = undefined;
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
        var mapIndex = this.subscriptionsMap.findIndex(function (s) { return s.id === id; });
        var findSub = this.subscriptionsMap[mapIndex];
        if (findSub) {
            this.send(JSON.stringify({
                _id: 2,
                id: findSub.id,
                symbols: findSub.symbols,
                fields: findSub.fields,
            }));
            var keys = Object.keys(this.subscriptions);
            for (var i = 0; i < keys.length; i++) {
                var sub = this.subscriptions[keys[i]];
                if (sub.callback && sub.callback[id]) {
                    sub.callback[id] = undefined;
                }
            }
            this.subscriptionsMap.splice(mapIndex, 1);
        }
    };
    PubsubConnector.prototype.unSubscribeAll = function () {
        for (var i = 0; i < this.subscriptionsMap.length; i++) {
            var sub = this.subscriptionsMap[i];
            this.unSubscribe(sub.id);
        }
    };
    PubsubConnector.prototype.feedSubscriptions = function (data) {
        var _this = this;
        if (this.subscriptions[data._i]) {
            Object.keys(data).forEach(function (d) {
                if (_this.subscriptions[data._i]) {
                    _this.subscriptions[data._i][d] = data[d];
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
                if (this.options.sendData) {
                    this.options.sendData(message);
                }
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
