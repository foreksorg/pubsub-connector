'use strict';

Object.defineProperty(exports, "__esModule", { value: true });
var PubsubConnector = (function () {
    function PubsubConnector(options) {
        this.subscriptions = {};
        this.subscriptionsMap = [];
        this.isLogin = false;
        this.subId = 0;
        this.userLincenses = [];
        this.reConnectCount = 0;
        this.options = {
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
        if (options) {
            this.options = options;
        }
    }
    PubsubConnector.prototype.resetReconnectCount = function () {
        this.reConnectCount = 0;
    };
    PubsubConnector.prototype.setOptions = function (options) {
        this.options = options;
    };
    PubsubConnector.prototype.getSocket = function () {
        return this.socket;
    };
    PubsubConnector.prototype.connect = function () {
        var _this = this;
        this.reConnectCount += 1;
        if (this.reConnectCount > (this.options.reConnectCountLimit || 5)) {
            throw new Error("Too many connection failed");
        }
        return new Promise(function (resolve, reject) {
            try {
                var server = new WebSocket(_this.options.url);
                _this.socket = server;
            }
            catch (ex) {
                console.error(ex);
                setTimeout(function () {
                    _this.connect();
                }, _this.options.reConnectInterval || 5000);
                return;
            }
            _this.socket.onopen = function () {
                _this.socket.onmessage = function (msg) {
                    var msgData = JSON.parse(msg.data);
                    _this.feedSubscriptions(msgData);
                    _this.messageEvent(msgData);
                };
                _this.socket.onclose = function () {
                    setTimeout(function () {
                        _this.connect();
                    }, _this.options.reConnectInterval || 5000);
                };
                if (!_this.isLogin) {
                    _this.login(_this.options.username, _this.options.password, _this.options.resource);
                }
                _this.reSubscribe();
                resolve(_this.socket);
            };
            _this.socket.onerror = function (err) {
                setTimeout(function () {
                    if (_this.options.autoReconnect) {
                        _this.connect();
                    }
                }, _this.options.reConnectInterval || 5000);
                reject(err);
            };
        });
    };
    PubsubConnector.prototype.disconnect = function () {
        this.socket.onclose = function () {
            console.log("disconnected");
        };
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
                    "client-navigator": clientNavigator.replace(/,/g, ""),
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
        }, 13000);
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
        var _a;
        for (var _b = 0, symbols_1 = symbols; _b < symbols_1.length; _b++) {
            var s = symbols_1[_b];
            for (var _c = 0, fields_1 = fields; _c < fields_1.length; _c++) {
                var f = fields_1[_c];
                if (((_a = this.subscriptions[s]) === null || _a === void 0 ? void 0 : _a[f]) &&
                    typeof this.subscriptions[s][f] !== "undefined") {
                    var sendData = { _id: 1, _s: 1, _i: "" };
                    sendData._i = s;
                    sendData[f] = this.subscriptions[s][f];
                    this.callback(sendData);
                    if (this.options.sendData) {
                        this.options.sendData(sendData);
                    }
                }
            }
        }
    };
    PubsubConnector.prototype.getFieldSnapShotValue = function (definitionId, fieldShortCode) {
        var _a;
        if (((_a = this.subscriptions[definitionId]) === null || _a === void 0 ? void 0 : _a[fieldShortCode]) &&
            this.subscriptions[definitionId][fieldShortCode]) {
            return this.subscriptions[definitionId][fieldShortCode];
        }
        return null;
    };
    PubsubConnector.prototype.addSubscriptions = function (subId, symbols, fields, callback) {
        for (var _a = 0, symbols_2 = symbols; _a < symbols_2.length; _a++) {
            var s = symbols_2[_a];
            if (!this.subscriptions[s]) {
                this.subscriptions[s] = {};
                this.subscriptions[s].callback = {};
            }
            if (callback)
                this.subscriptions[s].callback[subId] = callback;
            for (var _b = 0, fields_2 = fields; _b < fields_2.length; _b++) {
                var f = fields_2[_b];
                if (!this.subscriptions[s][f]) {
                    this.subscriptions[s][f] = undefined;
                }
            }
        }
    };
    PubsubConnector.prototype.reSubscribe = function () {
        if (this.isSocketReady()) {
            this.subscriptions = {};
            var tempSubMap = Object.assign([], this.subscriptionsMap);
            this.subscriptionsMap = [];
            for (var _a = 0, _b = tempSubMap; _a < _b.length; _a++) {
                var s = _b[_a];
                this.subscribe(s.symbols, s.fields, s.callback);
            }
        }
    };
    PubsubConnector.prototype.unSubscribe = function (id) {
        var _this = this;
        var mapIndex = this.subscriptionsMap.findIndex(function (s) { return s.id === id; });
        var findSub = this.subscriptionsMap[mapIndex];
        var foundSameField = [];
        var _loop_1 = function (sm) {
            for (var _c = 0, _d = findSub.fields; _c < _d.length; _c++) {
                var smf = _d[_c];
                if (sm.fields.includes(smf) &&
                    foundSameField.findIndex(function (fsf) { return fsf.id === sm.id; }) === -1) {
                    foundSameField.push(sm);
                }
            }
        };
        for (var _a = 0, _b = this.subscriptionsMap; _a < _b.length; _a++) {
            var sm = _b[_a];
            _loop_1(sm);
        }
        if (foundSameField.length <= 1) {
            this.send(JSON.stringify({
                _id: 2,
                id: findSub.id,
                symbols: findSub.symbols,
                fields: findSub.fields,
            }));
        }
        findSub.symbols.map(function (symbol) {
            delete _this.subscriptions[symbol].callback[id];
        });
        this.subscriptionsMap.splice(mapIndex, 1);
    };
    PubsubConnector.prototype.unSubscribeAll = function () {
        for (var _a = 0, _b = this.subscriptionsMap; _a < _b.length; _a++) {
            var sub = _b[_a];
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
        var _a;
        if (((_a = this.subscriptions[data._i]) === null || _a === void 0 ? void 0 : _a.callback) &&
            this.subscriptions[data._i].callback) {
            for (var _b = 0, _c = Object.keys(this.subscriptions[data._i].callback); _b < _c.length; _b++) {
                var sub = _c[_b];
                var callback = this.subscriptions[data._i].callback[sub];
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
                    console.error("message: Same user logged in another location");
                    this.disconnect();
                    if (this.options.onError) {
                        this.options.onError(message);
                    }
                }
                if (message.result === 100) {
                    this.scheduleHeartbeat();
                    this.reSubscribe();
                    this.userLincenses = message.licenses;
                }
                if (message.result === 101) {
                    console.error("message: Socket Login Failed");
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
                console.warn("Event message not mapped to any method. Message is : ", message);
                break;
        }
    };
    PubsubConnector.prototype.getLicenses = function () {
        return this.userLincenses;
    };
    return PubsubConnector;
}());
exports.default = PubsubConnector;
