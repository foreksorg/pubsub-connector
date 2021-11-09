export default interface IPubSubConnectionOptions {
    username: string;
    password: string;
    resource: string;
    url: string;
    isReconnection?: boolean;
    autoReconnect?: boolean;
    reConnectInterval?: number;
}
