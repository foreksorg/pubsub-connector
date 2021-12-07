export default interface IPubSubConnectionOptions {
    username: string;
    password: string;
    resource: string;
    url: string;
    appName?: string;
    company?: string;
    isReconnection?: boolean;
    autoReconnect?: boolean;
    reConnectInterval?: number;
    sendData?: Function;
}
