export interface PubsubLicense {
    delay: number;
    name: string;
}
export interface PubsubData {
    _id: number;
    _i?: string;
    _s?: number;
    t?: number;
    result?: number;
    st?: string;
    licenses?: PubsubLicense[];
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
    resetReconnectCount(): void;
    setOptions(options: IPubSubConnectionOptions): void;
    getSocket(): WebSocket;
    connect(): Promise<WebSocket>;
    disconnect(): void;
    isSocketReady(): boolean;
    getSubscriptionsById(id: string): any;
    getSubscriptions(): any;
    send(message: string): void;
    login(username: string, password: string, resource: string): void;
    scheduleHeartbeat(): void;
    subscribe(symbols: string[], fields: string[], callback?: (data: PubsubData) => PubsubData): number;
    checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
    getFieldSnapShotValue(definitionId: string, fieldShortCode: string): any | null;
    addSubscriptions(subId: number, symbols: string[], fields: string[], callback?: (data: any) => any): void;
    reSubscribe(): void;
    unSubscribe(id: number): void;
    unSubscribeAll(): void;
    feedSubscriptions(data: PubsubData): void;
    callback(data: PubsubData): void;
    messageEvent(data: PubsubData): void;
    getLicenses(): PubsubLicense[];
}
export default class PubsubConnector implements IPubsubConnector {
    private socket;
    private subscriptions;
    private subscriptionsMap;
    private isLogin;
    private subId;
    private userLincenses;
    private reConnectCount;
    private options;
    constructor(options?: IPubSubConnectionOptions);
    resetReconnectCount(): void;
    setOptions(options: IPubSubConnectionOptions): void;
    getSocket(): WebSocket;
    connect(): Promise<WebSocket>;
    disconnect(): void;
    isSocketReady(): boolean;
    getSubscriptionsById(id: string): any;
    getSubscriptions(): any;
    send(message: string): void;
    login(username: string, password: string, resource: string): void;
    scheduleHeartbeat(): void;
    subscribe(symbols: string[], fields: string[], callback?: (data: PubsubData) => void): number;
    checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
    getFieldSnapShotValue(definitionId: string, fieldShortCode: string): any | null;
    addSubscriptions(subId: number, symbols: string[], fields: string[], callback?: (data: any) => any): void;
    reSubscribe(): void;
    unSubscribe(id: number): void;
    unSubscribeAll(): void;
    feedSubscriptions(data: PubsubData): void;
    callback(data: PubsubData): void;
    messageEvent(data: PubsubData): void;
    getLicenses(): PubsubLicense[];
}
