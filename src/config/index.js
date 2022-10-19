export const publicPath = '/cms';
export const oneosOfficialUrl = 'https://os.iot.10086.cn/';

if (!window.location.origin) {
  window.location.origin =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '');
}

export const userCenterLoginUrl = window.APP.VUE_APP_LOGIN_URL + '?callback=' + window.location.href;
export const userCenterProfileUrl = window.APP.VUE_APP_ACCOUNT_LINK;

export const userCenterTokenName = 'accountToken';

export const navMenuList = [
  {
    name: '资费管理',
    url: '',
  },
  {
    name: '文档中心',
    url: 'https://os.iot.10086.cn/doc/',
  },
  {
    name: 'OneOS官网',
    url: 'https://os.iot.10086.cn/',
  },
];

export const communicationTypeMap = {
  1: 'cellular',
  2: 'nbiot',
  3: 'wifi',
  4: 'zigbee',
  5: 'bluetooth',
  10: 'other',
};

export const communicationTypeTextMap = {
  1: '2G/3G/4G/5G',
  2: 'NB-IoT',
  3: 'WiFi',
  4: 'Zigbee',
  5: '蓝牙',
  10: '其他',
};

export const protocolTextMap = {
  1: 'MQTT',
  2: 'CoAPS',
  3: '轻量HTTPS',
};

export const systemTypeTextMap = {
  1: 'OneOS',
  2: 'Linux',
};

export const communicationTypeOptions = [
  {
    label: '2G/3G/4G/5G',
    value: 1,
  },
  {
    label: 'NB-IoT',
    value: 2,
  },
  {
    label: 'WiFi',
    value: 3,
  },
  {
    label: 'Zigbee',
    value: 4,
  },
  {
    label: '蓝牙',
    value: 5,
  },
  {
    label: '其他',
    value: 10,
  },
];

export const protocolOptions = [
  {
    label: 'mqtt',
    value: 1,
  },
  // {
  //   label: 'coap',
  //   value: 2,
  // },
  // {
  //   label: 'tcp',
  //   value: 3,
  // },
  // {
  //   label: 'udp',
  //   value: 4,
  // },
];

export const systemTypeOptions = [
  {
    label: 'OneOS',
    value: 1,
  },
  {
    label: 'Linux',
    value: 2,
  },
];

export const billMethodOptions = [
  {
    label: 'license用量',
    value: 'license用量',
  },
  {
    label: '接口调用量',
    value: '接口调用量',
  },
  {
    label: '包月',
    value: '包月',
  },
];
