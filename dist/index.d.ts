import { WebSocket } from "ws";
import { PubSubConnectionOptions } from "./options";
export declare class PubsubConnector {
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
