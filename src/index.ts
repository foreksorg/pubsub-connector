export interface PubsubLicense {
  delay: number;
  name: string;
}

export enum PubsubNewsActionType {
  INSERT = 'insert',
  UPDATE = 'update',
  DELETE = 'delete',
}


export interface PubsubData {
  // pubsub fields
  _id: number; // id of message
  _i?: string; // definition id
  _s?: number; // is snapshot
  t?: number; // time
  result?: number; // resulting
  st?: string; // status
  licenses?: PubsubLicense[]; // licenses
  // news fields
  lo?: string; // locale
  D?: number; // date
  So?: string; // source
  ST?: string; // related symbols  
  tI?: string; // time
  tg?: string; // tags
  TY?: PubsubNewsActionType; // type
  ni?: string; // news id
  ct?: string; // content
  hd?: string; // headline
  su?: string; // summary
  at?: string; // attachments
  // symbol fields
  E?: string;
  se?: number;
  sm?: string;
  O?: string;
  wa?: number;
  tt?: number;
  bC?: string;
  sC?: string;
  T?: string;
  P?: number;
  S?: number;
  TT?: number;
  TD?: number;
  TV?: number;
  BD?: number;
  LD?: number;
  PD?: number;
  l?: number;
  PL?: number;
  v?: number;
  W?: number;
  c?: number;
  C?: number;
  wc?: number;
  wp?: number;
  mc?: number;
  mp?: number;
  yc?: number;
  yp?: number;
  d?: number;
  b?: number;
  a?: number;
  L?: number;
  h?: number;
  Mp?: number;
  vo?: number;
  mm?: number;
  bq?: string;
  aq?: number;
  Bq?: number;
  Aq?: number;
  Wl?: number;
  Wh?: number;
  Wc?: number;
  Ml?: number;
  Mh?: number;
  Mc?: number;
  Yl?: number;
  Yh?: number;
  Yc?: number;
  cl?: number;
  pc?: number;
  Cs?: number;
  Ll?: number;
  Ul?: number;
  tS?: number;
  Gr?: number;
  bp?: string;
  tm?: number;
  ss?: string;
  tT?: string;
  tV?: number;
  BR?: number;
  AR?: number;
  ba?: number;
  bl?: number;
  aa?: number;
  al?: number;
  pW?: number;
  b0?: number;
  b1?: number;
  b2?: number;
  b3?: number;
  b4?: number;
  b5?: number;
  b6?: number;
  b7?: number;
  b8?: number;
  b9?: number;
  bg?: number;
  v0?: number;
  v1?: number;
  v2?: number;
  v3?: number;
  v4?: number;
  v5?: number;
  v6?: number;
  v7?: number;
  v8?: number;
  v9?: number;
  vt?: number;
  q0?: number;
  q1?: number;
  q2?: number;
  q3?: number;
  q4?: number;
  q5?: number;
  q6?: number;
  q7?: number;
  q8?: number;
  q9?: number;
  qt?: number;
  t0?: number;
  t1?: string;
  t2?: string;
  t3?: string;
  t4?: string;
  t5?: string;
  t6?: string;
  t7?: string;
  t8?: string;
  t9?: string;
  a0?: string;
  a1?: number;
  a2?: number;
  a3?: number;
  a4?: number;
  a5?: number;
  a6?: number;
  a7?: number;
  a8?: number;
  a9?: number;
  ag?: number;
  w0?: number;
  w1?: number;
  w2?: number;
  w3?: number;
  w4?: number;
  w5?: number;
  w6?: number;
  w7?: number;
  w8?: number;
  w9?: number;
  wt?: number;
  k0?: number;
  k1?: number;
  k2?: number;
  k3?: number;
  k4?: number;
  k5?: number;
  k6?: number;
  k7?: number;
  k8?: number;
  k9?: number;
  kt?: number;
  z0?: number;
  z1?: string;
  z2?: string;
  z3?: string;
  z4?: string;
  z5?: string;
  z6?: string;
  z7?: string;
  z8?: string;
  z9?: string;
  cs?: string;
  wL?: number;
  wD?: number;
  wH?: number;
  wI?: number;
  wC?: number;
  mL?: number;
  mD?: number;
  mH?: number;
  mI?: number;
  mC?: number;
  yL?: number;
  yD?: number;
  yH?: number;
  yI?: number;
  yC?: number;
  VA?: number;
  Br?: string;
  Ar?: number;
  Lt?: number;
  Lr?: string;
  Cy?: number;
  DT?: number;
  AL?: number;
  BSP?: number;
  ACP?: number;
  LCP?: number;
  DTE?: number;
  Sr?: number;
  Cr?: number;
  Mv?: number;
  Mq?: string;
  Mr?: number;
  Ma?: number;
  CPI?: number;
  PR?: number;
  pD?: number;
  lR?: number;
  hR?: number;
  V?: number;
  Days?: string;
  vW?: string;
  Wd?: number;
  Wi?: number;
  Md?: number;
  Mi?: number;
  Yd?: number;
  Yi?: number;
  eD?: number;
  on?: number;
  in?: string;
  br?: string;
  si?: string;
  psp?: string;
  sp?: number;
  pp?: number;
  oi?: number;
  oc?: number;
  us?: number;
  oy?: string;
  oC?: string;
  Sp?: string;
  Sg?: number;
  SG?: string;
  li?: number;
  cm?: number;
  sT?: number;
  Pc?: string;
  At?: string;
  mP?: string;
  TU?: number;
  c2?: number;
  fus?: string;
  ic?: string;
  sn?: number;
  sne?: string;
  rc?: string;
  BV?: string;
  AV?: number;
  BT?: number;
  AT?: number;
  pS?: number;
  eP?: string;
  eV?: number;
  eB?: number;
  eA?: number;
  CP?: number;
  Po?: number;
  In?: number;
  Nc?: string;
  Np?: number;
  Lp?: number;
  No?: string;
  Is?: number;
  Nd?: string;
  Ffr?: number;
  Lpp?: number;
  Iw?: number;
  If?: string;
  Ir?: number;
  Gs?: string;
  mv?: number;
  pE?: number;
  Pss?: number;
  Fss?: number;
  Fm?: number;
  Es?: number;
  Dy?: number;
  Pb?: number;
  Bv?: number;
  Pl?: number;
  yR?: number;
  sP?: number;
  cR?: number;
  PS?: number;
  PSn?: string;
  BB?: string;
  BA?: number;
  DE?: number;
  TH?: number;
  GA?: number;
  VE?: number;
  RH?: number;
  Ba?: number;
  BS?: number;
  Bd?: number;
  BC?: number;
  SC?: number;
  SP?: number;
  x3?: number;
  x5?: number;
  x1?: number;
  xT?: number;
  T1?: number;
  T2?: number;
  T3?: number;
  T4?: number;
  T5?: number;
  TP?: number;
  CT?: number;
  Cp?: number;
  H1?: number;
  H2?: number;
  H3?: number;
  H4?: number;
  H5?: number;
  H6?: number;
  TC?: number;
  LA?: number;
  PO?: number;
  EM?: number;
  aS?: number;
  NS?: number;
  OS?: number;
  PU?: number;
  LP?: number;
  BP?: number;
  RP?: number;
  EQ?: number;
  PP?: number;
  FP?: number;
  OP?: number;
  NP?: number;
  EP?: number;
  D1?: number;
  D8?: number;
  D2?: number;
  D3?: number;
  D4?: number;
  DG?: number;
  OE?: number;
  FT?: number;
  SL?: string;
  Al?: number;
  SO?: number;
  SR?: number;
  SE?: number;
  HC?: number;
  LC?: number;
  OC?: number;
  FL?: number;
  VC?: number;
  VP?: number;
  Dt?: number;
  Di?: number;
  WR?: number;
  OT?: number;
  Nm?: string;
  De?: string;
  Ti?: string;
  MS?: string;
  SY?: string;
  cu?: string;
  ex?: string;
  pr?: string;
  EX?: number;
  bv?: string;
  av?: number;
  dd?: number;
  WC?: number;
  WP?: number;
  MC?: number;
  MP?: number;
  YC?: number;
  YP?: number;
  wV?: number;
  wT?: number;
  mV?: number;
  mT?: number;
  yV?: number;
  yT?: number;
  vV?: number;
  vT?: number;
  nV?: number;
  nT?: number;
  zV?: number;
  zT?: number;
  WA?: number;
  WT?: number;
  WB?: number;
  WU?: number;
  MA?: number;
  MT?: number;
  MB?: number;
  MU?: number;
  YA?: number;
  YT?: number;
  YB?: number;
  YU?: number;
  V0?: number;
  V1?: number;
  V2?: number;
  V3?: number;
  V4?: number;
  V5?: number;
  V6?: number;
  V7?: number;
  V8?: number;
  V9?: number;
  W0?: number;
  W1?: number;
  W2?: number;
  W3?: number;
  W4?: number;
  W5?: number;
  W6?: number;
  W7?: number;
  W8?: number;
  W9?: number;
  y0?: number;
  y1?: number;
  y2?: number;
  y3?: number;
  y4?: number;
  y5?: number;
  y6?: number;
  y7?: number;
  y8?: number;
  y9?: number;
  Y0?: number;
  Y1?: number;
  Y2?: number;
  Y3?: number;
  Y4?: number;
  Y5?: number;
  Y6?: number;
  Y7?: number;
  Y8?: number;
  Y9?: number;
  mu?: number;
  me?: number;
  lc?: number;
  SS?: number;
  SN?: number;
  SD?: number;
  pd?: number;
  OF?: number;
  rl?: number;
  GM?: number;
  Mt?: number;
  s1?: number;
  s2?: number;
  s3?: number;
  s4?: number;
  s5?: number;
  s6?: number;
  e1?: number;
  e2?: number;
  e3?: number;
  e4?: number;
  e5?: number;
  e6?: number;
  r1?: number;
  m1?: number;
  bu?: number;
  bd?: number;
  ad?: number;
  u0?: number;
  u1?: number;
  u2?: number;
  u3?: number;
  u4?: number;
  u5?: number;
  u6?: number;
  u7?: number;
  u8?: number;
  u9?: number;
  U0?: number;
  U1?: number;
  U2?: number;
  U3?: number;
  U4?: number;
  U5?: number;
  U6?: number;
  U7?: number;
  U8?: number;
  U9?: number;
  M1?: number;
  M3?: number;
  M6?: number;
  M12?: number;
  Op?: number;
  Fb?: string;
  Fa?: number;
  Fn?: number;
  rn?: number;
  ti?: number;
  Fp?: string;
  PC?: number;
  Sa?: number;
  TO?: number;
  ah?: number;
  be?: number;
  eq?: number;
  DV?: number;
  aR?: number;
  dt?: number;
  ebp?: number;
  eap?: number;
  o0?: number;
  o1?: number;
  o2?: number;
  o3?: number;
  o4?: number;
  o5?: number;
  o6?: number;
  o7?: number;
  o8?: number;
  o9?: number;
  O0?: number;
  O1?: number;
  O2?: number;
  O3?: number;
  O4?: number;
  O5?: number;
  O6?: number;
  O7?: number;
  O8?: number;
  O9?: number;
  NO?: number;
  x?: number;
  q?: number;
  Qt?: number;
  p?: string;
  qy?: number;
  ay?: number;
  r?: number;
  or?: number;
  Mb?: number;
  Mk?: string;
  Mo?: string;
  Ms?: string;
  Me?: string;
  Mu?: number;
  Rp?: number;
  rv?: number;
  tc?: number;
  rt?: number;
  Rt?: number;
  Tc?: number;
  Ub?: number;
  Ua?: number;
  Un?: number;
  fb?: number;
  fa?: number;
  fn?: number;
  ub?: number;
  ua?: number;
  un?: number;
  wr?: number;
  AS?: number;
  Wr?: number;
  B0?: string;
  B1?: number;
  B2?: number;
  B3?: number;
  B4?: number;
  B5?: number;
  B6?: number;
  B7?: number;
  B8?: number;
  B9?: number;
  A0?: number;
  A1?: number;
  A2?: number;
  A3?: number;
  A4?: number;
  A5?: number;
  A6?: number;
  A7?: number;
  A8?: number;
  A9?: number;
  cp?: number;
  Tb?: number;
  Ta?: string;
  Tt?: string;
  cr?: string;
  PV?: number;
  S1?: number;
  S2?: number;
  R1?: number;
  R2?: number;
  eQ?: number;
  Oc?: number;
  Hc?: number;
  Lc?: number;
  Sq?: number;
  mt?: number;
  mU?: number;
  Plp?: string;
  plp?: number;
  pmp?: number;
  bbp?: number;
  fbp?: number;
  fdp?: number;
  ep?: number;
  cpp?: number;
  fcp?: number;
  rcp?: number;
  pap?: number;
  dp?: number;
  asp?: number;
  tdp?: number;
  fDp?: number;
  fep?: number;
  rp?: number;
  Ct?: number;
  Ts?: string;
  Ss?: string;
  f1?: number;
  f2?: number;
  f3?: number;
  f4?: number;
  LE?: number;
  Bf0?: string;
  Bf1?: number;
  Bf2?: number;
  Bf3?: number;
  Bf4?: number;
  Bf5?: number;
  Bf6?: number;
  Bf7?: number;
  Bf8?: number;
  Bf9?: number;
  Bh0?: number;
  Bh1?: number;
  Bh2?: number;
  Bh3?: number;
  Bh4?: number;
  Bh5?: number;
  Bh6?: number;
  Bh7?: number;
  Bh8?: number;
  Bh9?: number;
  Bo0?: number;
  Bo1?: string;
  Bo2?: string;
  Bo3?: string;
  Bo4?: string;
  Bo5?: string;
  Bo6?: string;
  Bo7?: string;
  Bo8?: string;
  Bo9?: string;
  Af0?: string;
  Af1?: number;
  Af2?: number;
  Af3?: number;
  Af4?: number;
  Af5?: number;
  Af6?: number;
  Af7?: number;
  Af8?: number;
  Af9?: number;
  Ah0?: number;
  Ah1?: number;
  Ah2?: number;
  Ah3?: number;
  Ah4?: number;
  Ah5?: number;
  Ah6?: number;
  Ah7?: number;
  Ah8?: number;
  Ah9?: number;
  Ao0?: number;
  Ao1?: string;
  Ao2?: string;
  Ao3?: string;
  Ao4?: string;
  Ao5?: string;
  Ao6?: string;
  Ao7?: string;
  Ao8?: string;
  Ao9?: string;
  MD?: string;
  cT?: string;
  lv?: number;
  ga?: number;
  gb?: number;
  gc?: number;
  gd?: number;
  ge?: number;
  gf?: number;
  gg?: number;
  gh?: number;
  gi?: number;
  gj?: number;
  gk?: number;
  gl?: number;
  aP?: number;
  aV?: number;
  CR?: number;
  sa?: number;
  re?: number;
  H?: number;
  w?: number;
  o?: number;
  g?: number;
  G?: number;
  sv?: number;
  St?: number;
  Sc?: number;
  Wa?: number;
  cS?: number;
  fe?: number;
  bB?: number;
  bA?: number;
  Bc?: number;
  Ac?: number;
  uc?: number;
  uv?: number;
  ut?: number;
  dc?: number;
  dv?: number;
  dT?: number;
  s7?: number;
  e7?: number;
  KIBD?: number;
  OSDB?: number;
  KKSTL?: number;
  KKSD?: number;
  OKSYD?: number;
  KKSYD?: number;
  VMTL?: number;
  VMD?: number;
  VMAU?: number;
  KHTL?: number;
  KHD?: number;
  KHAU?: number;
  KMKBA?: number;
  KMKKS?: number;
  YBKB?: number;
  YBOSB?: number;
  YBYF?: number;
  YYF?: number;
  BYF?: number;
  GYKB?: number;
  GSYKB?: number;
  Vnumber?: number;
  KMBYF?: number;
  b10?: number;
  b11?: number;
  b12?: number;
  b13?: number;
  b14?: number;
  b15?: number;
  b16?: number;
  b17?: number;
  b18?: number;
  b19?: number;
  b20?: number;
  b21?: number;
  b22?: number;
  b23?: number;
  b24?: number;
  v10?: number;
  v11?: number;
  v12?: number;
  v13?: number;
  v14?: number;
  v15?: number;
  v16?: number;
  v17?: number;
  v18?: number;
  v19?: number;
  v20?: number;
  v21?: number;
  v22?: number;
  v23?: number;
  v24?: number;
  q10?: number;
  q11?: number;
  q12?: number;
  q13?: number;
  q14?: number;
  q15?: number;
  q16?: number;
  q17?: number;
  q18?: number;
  q19?: number;
  q20?: number;
  q21?: number;
  q22?: number;
  q23?: number;
  q24?: number;
  a10?: number;
  a11?: number;
  a12?: number;
  a13?: number;
  a14?: number;
  a15?: number;
  a16?: number;
  a17?: number;
  a18?: number;
  a19?: number;
  a20?: number;
  a21?: number;
  a22?: number;
  a23?: number;
  a24?: number;
  w10?: number;
  w11?: number;
  w12?: number;
  w13?: number;
  w14?: number;
  w15?: number;
  w16?: number;
  w17?: number;
  w18?: number;
  w19?: number;
  w20?: number;
  w21?: number;
  w22?: number;
  w23?: number;
  w24?: number;
  k10?: number;
  k11?: number;
  k12?: number;
  k13?: number;
  k14?: number;
  k15?: number;
  k16?: number;
  k17?: number;
  k18?: number;
  k19?: number;
  k20?: number;
  k21?: number;
  k22?: number;
  k23?: number;
  k24?: number;
  nr?: number;
  sra?: string;
  lC?: number;
  tC?: number;
  [name: string]: any; // any other field
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
  /**
   * @description reset reconnect count
   * @return {void}
   */
  resetReconnectCount(): void;

  /**
   * @description set options for socket
   * @param {PubSubConnectionOptions} options : options
   * @return {void}
   */
  setOptions(options: IPubSubConnectionOptions): void;

  /**
   * @description get socket connection
   * @return {WebSocket}
   */
  getSocket(): WebSocket;

  /**
   * @description connect to socket
   * @return {Promise<WebSocket>}
   */
  connect(): Promise<WebSocket>;

  /**
   * @description disconnect from socket
   * @return {void}
   */
  disconnect(): void;

  /**
   * @description is socket ready
   * @return {boolean}
   */
  isSocketReady(): boolean;

  /**
   * @description get subscription by id
   * @param {string} id id
   */
  getSubscriptionsById(id: string);

  /**
   * @description get subscriptions
   * @return {any}
   */
  getSubscriptions(): any;

  /**
   * @description send message via socket
   * @param {string} message  message
   * @return {void}
   */
  send(message: string): void;

  /**
   * @description send login message to socket
   * @param {string} username username
   * @param {string} password password
   * @param {string} resource resource
   * @return {void}
   */
  login(username: string, password: string, resource: string): void;

  /**
   * @description schedule heart beat for socket service.
   * @return {void}
   */
  scheduleHeartbeat(): void;

  /**
   * @description subscribe
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @param {Function} callback callback method
   * @return {number} subscription id
   */
  subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: PubsubData) => void
  ): number;

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @return {void}
   */
  checkSubscriptionHasSnapshot(symbols: string[], fields: string[]): void;

  /**
   * @description get field snapshot value if exsist
   * @param {string} definitionId definition id
   * @param {string} fieldShortCode fields shortcode
   * @return {any | null} field value
   */
  getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null;

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {number} subId : subscription id
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   * @return {void}
   */
  addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void;

  /**
   * @description re subscribe with old subscription map
   * @return {void}
   */
  reSubscribe(): void;

  /**
   * @description unsubscribe with subscription id
   * @param {number} id subscription id
   * @return {void}
   */
  unSubscribe(id: number): void;

  /**
   * @description unsubscribe all subscriptions
   * @return {void}
   */
  unSubscribeAll(): void;

  /**
   * @description feed subscriptions
   * @param {PubsubData} data socket data
   * @return {void}
   */
  feedSubscriptions(data: PubsubData): void;

  /**
   * @description callback
   * @param {PubsubData} data socket data
   * @return {void}
   */
  callback(data: PubsubData): void;

  /**
   * @description send message via socket
   * @param {PubsubData} data socket data
   * @return {void}
   */
  messageEvent(data: PubsubData): void;

  /**
   * @description get user licenses
   * @return {PubsubLicense[]} user licenses
   */
  getLicenses(): PubsubLicense[];
}

/**
 * @description Pubsub Socket Service provide connect socket and manage socket actions
 */
export default class PubsubConnector implements IPubsubConnector {
  private socket!: WebSocket;
  private subscriptions: any = {};
  private subscriptionsMap: any[] = [];
  private isLogin: boolean = false;
  private subId = 0;
  private userLincenses: PubsubLicense[] = [];
  private reConnectCount = 0;
  private options: IPubSubConnectionOptions = {
    url: "wss://websocket.foreks.com",
    username: "",
    password: "",
    resource: "",
    autoReconnect: true,
    reConnectInterval: 5000,
    reConnectCountLimit: 5,
    company: "",
    appName: "",
  };

  /**
   * @description contructor
   * @param {PubSubConnectionOptions} options : options
   */
  constructor(options?: IPubSubConnectionOptions) {
    if (options) {
      this.options = options;
    }
  }

  /**
   * @description reset reconnect count
   * @return {void}
   */
  public resetReconnectCount(): void {
    this.reConnectCount = 0;
  }

  /**
   * @description set options for socket
   * @param {PubSubConnectionOptions} options : options
   * @return {void}
   */
  public setOptions(options: IPubSubConnectionOptions): void {
    this.options = options;
  }

  /**
   * @description get socket connection
   * @return {WebSocket}
   */
  public getSocket(): WebSocket {
    return this.socket;
  }

  /**
   * @description connect to socket
   * @return {Promise<WebSocket>}
   */
  public connect(): Promise<WebSocket> {
    this.reConnectCount += 1;
    if (this.reConnectCount > (this.options.reConnectCountLimit || 5)) {
      throw new Error("Too many connection failed");
    }

    return new Promise((resolve, reject) => {
      try {
        const server = new WebSocket(this.options.url);
        this.socket = server;
      } catch (ex) {
        console.error(ex);
        setTimeout(() => {
          this.connect();
        }, this.options.reConnectInterval || 5000);
        return;
      }

      // on server open
      this.socket.onopen = () => {
        this.socket.onmessage = (msg: MessageEvent<any>) => {
          const msgData: PubsubData = JSON.parse(msg.data);
          this.feedSubscriptions(msgData);
          this.messageEvent(msgData);
        };

        this.socket.onclose = () => {
          setTimeout(() => {
            this.connect();
          }, this.options.reConnectInterval || 5000);
        };
        if (!this.isLogin) {
          this.login(
            this.options.username,
            this.options.password,
            this.options.resource
          );
        }

        this.reSubscribe();

        resolve(this.socket);
      };

      // on server error
      this.socket.onerror = (err) => {
        setTimeout(() => {
          if (this.options.autoReconnect) {
            this.connect();
          }
        }, this.options.reConnectInterval || 5000);
        reject(err);
      };
    });
  }

  /**
   * @description disconnect from socket
   * @return {void}
   */
  public disconnect(): void {
    this.socket.onclose = () => {
      console.log("disconnected");
    };
    this.socket.close();
  }

  /**
   * @description is socket ready
   * @return {boolean}
   */
  public isSocketReady(): boolean {
    return this.socket ? this.socket.readyState === WebSocket.OPEN : false;
  }

  /**
   * @description get subscription by id
   * @param {string} id id
   */
  public getSubscriptionsById(id: string) {
    if (this.subscriptions[id]) {
      return this.subscriptions[id];
    }
  }

  /**
   * @description get subscriptions
   * @return {any}
   */
  public getSubscriptions(): any {
    return this.subscriptions;
  }

  /**
   * @description send message via socket
   * @param {string} message  message
   * @return {void}
   */
  public send(message: string): void {
    if (this.isSocketReady()) {
      this.socket.send(message);
    } else {
      setTimeout(() => {
        this.send(message);
      }, 400);
    }
  }

  /**
   * @description send login message to socket
   * @param {string} username username
   * @param {string} password password
   * @param {string} resource resource
   * @return {void}
   */
  public login(username: string, password: string, resource: string): void {
    if (this.isSocketReady()) {
      let deviceOss = "";
      let deviceModel = "";
      let clientAddress = "";
      let clientPort = "";
      let clientLanguage = "";
      let clientNavigator = "";
      if (typeof window !== "undefined") {
        deviceOss = window.navigator.platform;
        deviceModel = window.navigator.product;
        clientAddress = location.origin;
        clientPort = location.port;
        clientLanguage = window.navigator.language;
        clientNavigator = window.navigator.appVersion;
      } else {
        deviceOss = process.platform;
      }

      this.send(
        JSON.stringify({
          _id: 64,
          user: username,
          password,
          info: {
            company: this.options.company || "",
            resource,
            platform: "web",
            "app-name": this.options.appName || "NA",
            "device-os": deviceOss,
            "device-model": deviceModel,
            "client-address": clientAddress,
            "client-port": clientPort,
            "client-language": clientLanguage,
            "client-navigator": clientNavigator.replace(/,/g, ""),
          },
          resource,
        })
      );
    }
  }

  /**
   * @description schedule heart beat for socket service.
   * @return {void}
   */
  public scheduleHeartbeat(): void {
    setInterval(() => {
      this.send(
        JSON.stringify({
          _id: 16,
        })
      );
    }, 13_000);
  }

  /**
   * @description subscribe
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @param {Function} callback callback method
   * @return {number} subscription id
   */
  public subscribe(
    symbols: string[],
    fields: string[],
    callback?: (data: PubsubData) => void
  ): number {
    if (!symbols[0]) {
      throw new Error("Symbol expired");
    }
    this.subId = this.subId + 1;
    this.checkSubscriptionHasSnapshot(symbols, fields);

    this.send(
      JSON.stringify({
        _id: 1,
        id: this.subId,
        symbols,
        fields,
      })
    );

    this.subscriptionsMap.push({
      id: this.subId,
      symbols,
      fields,
      callback,
    });

    this.addSubscriptions(this.subId, symbols, fields, callback);

    return this.subId;
  }

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {string[]} symbols symbols list
   * @param {string[]} fields fields list
   * @return {void}
   */
  public checkSubscriptionHasSnapshot(
    symbols: string[],
    fields: string[]
  ): void {
    for (const s of symbols) {
      for (const f of fields) {
        if (
          this.subscriptions[s]?.[f] &&
          typeof this.subscriptions[s][f] !== "undefined"
        ) {
          const sendData: PubsubData = { _id: 1, _s: 1, _i: "" };
          sendData._i = s;
          sendData[f] = this.subscriptions[s][f];
          this.callback(sendData);
          if (this.options.sendData) {
            this.options.sendData(sendData);
          }
        }
      }
    }
  }

  /**
   * @description get field snapshot value if exsist
   * @param {string} definitionId definition id
   * @param {string} fieldShortCode fields shortcode
   * @return {any | null} field value
   */
  public getFieldSnapShotValue(
    definitionId: string,
    fieldShortCode: string
  ): any | null {
    if (
      this.subscriptions[definitionId]?.[fieldShortCode] &&
      this.subscriptions[definitionId][fieldShortCode]
    ) {
      return this.subscriptions[definitionId][fieldShortCode];
    }
    return null;
  }

  /**
   * @description check subscription has snapshot data if has sent it to pubsub sendData service
   * @param {number} subId : subscription id
   * @param {string[]} symbols : symbols list
   * @param {string[]} fields : fields list
   * @param {Function} callback : callback method
   * @return {void}
   */
  public addSubscriptions(
    subId: number,
    symbols: string[],
    fields: string[],
    callback?: (data: any) => any
  ): void {
    for (const s of symbols) {
      if (!this.subscriptions[s]) {
        this.subscriptions[s] = {};
        this.subscriptions[s].callback = {};
      }

      if (callback) this.subscriptions[s].callback[subId] = callback;

      for (const f of fields) {
        if (!this.subscriptions[s][f]) {
          this.subscriptions[s][f] = undefined;
        }
      }
    }
  }

  /**
   * @description re subscribe with old subscription map
   * @return {void}
   */
  public reSubscribe(): void {
    if (this.isSocketReady()) {
      this.subscriptions = {};
      const tempSubMap = Object.assign([], this.subscriptionsMap);
      this.subscriptionsMap = [];
      for (const s of tempSubMap as any) {
        this.subscribe(s.symbols, s.fields, s.callback);
      }
    }
  }

  /**
   * @description unsubscribe with subscription id
   * @param {number} id subscription id
   * @return {void}
   */
  public unSubscribe(id: number): void {
    const mapIndex = this.subscriptionsMap.findIndex((s) => s.id === id);
    const findSub = this.subscriptionsMap[mapIndex];
    const foundSameField: any[] = [];
    for (const sm of this.subscriptionsMap) {
      for (const smf of findSub.fields) {
        if (
          sm.fields.includes(smf) &&
          foundSameField.findIndex((fsf) => fsf.id === sm.id) === -1
        ) {
          foundSameField.push(sm);
        }
      }
    }

    if (foundSameField.length <= 1) {
      this.send(
        JSON.stringify({
          _id: 2,
          id: findSub.id,
          symbols: findSub.symbols,
          fields: findSub.fields,
        })
      );
    }
    findSub.symbols.map((symbol: string) => {
      delete this.subscriptions[symbol].callback[id];
    });
    this.subscriptionsMap.splice(mapIndex, 1);
  }

  /**
   * @description unsubscribe all subscriptions
   * @return {void}
   */
  public unSubscribeAll(): void {
    for (const sub of this.subscriptionsMap) {
      this.unSubscribe(sub.id);
    }
  }

  /**
   * @description feed subscriptions
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public feedSubscriptions(data: PubsubData): void {
    if (data._i && this.subscriptions[data._i]) {
      for (const d of Object.keys(data)) {
        if (this.subscriptions[data._i]) {
          this.subscriptions[data._i][d] = data[d];
        }
      }
    }
  }

  /**
   * @description callback
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public callback(data: PubsubData): void {
    if (
      data._i &&
      this.subscriptions[data._i]?.callback &&
      this.subscriptions[data._i].callback
    ) {
      for (const sub of Object.keys(this.subscriptions[data._i].callback)) {
        const callback = this.subscriptions[data._i].callback[sub];
        if (callback) callback(data);
      }
    }
  }

  /**
   * @description send message via socket
   * @param {PubsubData} data socket data
   * @return {void}
   */
  public messageEvent(data: PubsubData): void {
    switch (data._id) {
      case 0:
        break;
      case 16:
        break;
      case 18:
        this.login(
          this.options.username,
          this.options.password,
          this.options.resource
        );
        break;
      case 65:
        // Same user logged in another location
        if (data.result === 0) {
          console.error("message: Same user logged in another location");
          this.disconnect();
          if (this.options.onError) {
            this.options.onError(data);
          }
        }
        // start heartbeat
        if (data.result === 100) {
          this.scheduleHeartbeat();
          this.reSubscribe();
          this.userLincenses = data.licenses || [];
        }
        // login failed
        if (data.result === 101) {
          console.error("message: Socket Login Failed");
          if (this.options.onError) {
            this.options.onError(data);
          }
        }
        break;
      case 1:
        this.callback(data);
        if (this.options.sendData) {
          this.options.sendData(data);
        }
        break;
      case 67:
        break;
      default:
        console.warn(
          "Event message not mapped to any method. Message is : ",
          data
        );
        break;
    }
  }

  /**
   * @description get user licenses
   * @return {PubsubLicense[]} user licenses
   */
  public getLicenses(): PubsubLicense[] {
    return this.userLincenses;
  }
}
