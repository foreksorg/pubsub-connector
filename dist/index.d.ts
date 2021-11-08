import WebSocket from "ws";
import { PubSubConnectionOptions } from "./options";
/**
 * @description Pubsub Socket Service provide connect socket and manage socket actions
 */
export declare class PubsubConnector {
    static _socket: WebSocket;
    static _subscriptions: any;
    static _subscriptionsMap: any[];
    static _isLogged: boolean;
    static _isLoginMessageSent: boolean;
    static _subId: number;
    static _options: PubSubConnectionOptions;
    /**
     * @description connect to socket
     * @param {PubSubConnectionOptions} options : options
     */
    static connect(options: PubSubConnectionOptions): Promise<unknown>;
    /**
     * @description is socket ready
     * @return {boolean}
     */
    static isSocketReady(): boolean;
    /**
     * @description get subscription by id
     * @param {string} id : id
     */
    static getSubscriptionsById(id: string): any;
    /**
     * @description send message via socket
     * @param {string} message : message
     */
    static send(message: string): void;
    /**
     * @description send login message to socket
     * @param {string} username : username
     * @param {string} password : password
     * @param {string} resource : resource
     */
    static login(username: string, password: string, resource: string): void;
    /**
     * @description schedule heart beat for socket service.
     */
    static scheduleHeartbeat(): void;
    /**
     * @description subscribe
     * @param {string[]} symbols : symbols list
     * @param {string[]} fields : fields list
     * @param {Function} callback : callback method
     * @returns {number} subscription id
     */
    static subscribe(symbols: string[], fields: string[], callback?: (data: any) => any): number;
    /**
     * @description check subscription has snapshot data if has sent it to pubsub sendData service
     * @param {string[]} symbols : symbols list
     * @param {string[]} fields : fields list
     */
    static checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;
    /**
     * @description get field snapshot value if exsist
     * @param {string} definitionId : definition id
     * @param {string} fieldShortCode : fields shortcode
     */
    static getFieldSnapShotValue(definitionId: string, fieldShortCode: string): any | null;
    /**
     * @description check subscription has snapshot data if has sent it to pubsub sendData service
     * @param {number} subId : subscription id
     * @param {string[]} symbols : symbols list
     * @param {string[]} fields : fields list
     * @param {Function} callback : callback method
     */
    static addSubscriptions(subId: number, symbols: string[], fields: string[], callback?: (data: any) => any): void;
    /**
     * @description re subscribe with old subscription map
     */
    static reSubscribe(): void;
    /**
     * @description unsubscribe with subscription id
     * @param {number} id : subscription id
     */
    static unSubscribe(id: number): void;
    /**
     * @description feed subscriptions
     * @param {any} data : socket data
     */
    static feedSubscriptions(data: any): void;
    /**
     * @description callback
     * @param {any} data : socket data
     */
    static callback(data: any): void;
    /**
     * @description send message via socket
     * @param {string} message : message
     */
    static messageEvent(message: any): void;
}
