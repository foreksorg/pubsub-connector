export default interface IPubsubConnector {
    getSocket(): WebSocket;
    connect(): Promise<WebSocket>;
    disconnect(): void;
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
