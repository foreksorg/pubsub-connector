export default interface PubSubConnectionOptions {
    username: string,
    password: string,
    resource: string,
    url: string,
    messageEvent: Function,
    isReconnection?: boolean,
    autoReconnect?: boolean,
    reConnectInterval?: number,
}