export default class {
    static _socket: WebSocket;
    static _subscriptions: any;
    static _subscriptionsMap: any[];
    static _isLogin: boolean;
    static _subId: number;
    static _options: PubSubConnectionOptions;
    static connect(options: PubSubConnectionOptions): Promise<WebSocket>;
    static isSocketReady(): boolean;
    static getSubscriptionsById(id: string): any;
    static send(message: string): void;
    static login(username: string, password: string, resource: string): void;
    static scheduleHeartbeat(): void;
    static subscribe(symbols: string[], fields: string[], callback?: (data: any) => any): number;
    static checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
    static getFieldSnapShotValue(definitionId: string, fieldShortCode: string): any | null;
    static addSubscriptions(subId: number, symbols: string[], fields: string[], callback?: (data: any) => any): void;
    static reSubscribe(): void;
    static unSubscribe(id: number): void;
    static feedSubscriptions(data: any): void;
    static callback(data: any): void;
    static messageEvent(message: any): void;
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
    subscribe(symbols: string[], fields: string[], callback?: (data: any) => any): number;
    checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
    getFieldSnapShotValue(definitionId: string, fieldShortCode: string): any | null;
    addSubscriptions(subId: number, symbols: string[], fields: string[], callback?: (data: any) => any): void;
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
