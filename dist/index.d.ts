import IPubSubConnectionOptions from "./IPubSubConnectionOptions";
import IPubsubConnector from "./IPubsubConnector";
export default class PubsubConnector implements IPubsubConnector {
    private socket;
    private subscriptions;
    private subscriptionsMap;
    private isLogin;
    private subId;
    private options;
    constructor(options: IPubSubConnectionOptions);
    getSocket(): WebSocket;
    connect(): Promise<WebSocket>;
    disconnect(): void;
    isSocketReady(): boolean;
    getSubscriptionsById(id: string): any;
    getSubscriptions(): any;
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
