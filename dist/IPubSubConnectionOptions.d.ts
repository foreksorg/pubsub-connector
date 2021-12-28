export default interface IPubSubConnectionOptions {
    username: string;
    password: string;
    resource: string;
    url: string;
    company: string;
    appName: string;
    autoReconnect?: boolean;
    reConnectInterval?: number;
    sendData?: Function;
    onError?: Function;
}
