import axios from 'axios';
import Message from '../utils/message';
import { goLogin, getToken } from '../utils/auth';

// create an axios instance
const service = axios.create({
  baseURL: '/api/cmsapi', // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
  headers: {
    get: {
      Pragma: 'no-cache',
      'Cache-Control': 'no-cache',
    },
  },
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    config.headers['cmsToken'] = getToken();
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const res = response.data;
    const type = response.headers['content-type'];
    const url = response.config.url;
    if (res instanceof ArrayBuffer) {
      if ((url.includes('/license/') || url.includes('/tariff/')) && type.match(/application\/vnd.ms-excel/)) {
        const filename = response.headers['content-disposition'].split('=')[1];
        return {
          filename: decodeURIComponent(filename),
          file: res,
        };
      } else {
        if (type.includes('json')) {
          let enc = new TextDecoder('utf-8');
          const result = JSON.parse(enc.decode(new Uint8Array(res)));
          Message({
            message: result.message || 'Error',
            type: 'error',
            duration: 5 * 1000,
          });
          return false;
        }
      }
    }
    switch (res.code) {
      // 成功
      case '10000':
        if (type.match(/application\/vnd.ms-excel/)) {
          const filename = response.headers['content-disposition'].split('=')[1];

          return {
            filename: decodeURIComponent(filename),
            file: res,
          };
        }

        return res;
      // 未登录
      case '10001':
        goLogin();

        return res;
      // 无效请求
      case '10008':
        res.message = '列表数据为空';
        return res;
      // 未实名认证
      // case '300021':
      //     router.push('/guard/index');
      //
      //     return res;
      // // 当前账户已冻结
      // case '300023':
      //     router.push('/guard/select-account');
      //
      //     return res;
      default:
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000,
        });

        return Promise.reject(new Error(res.message || 'Error'));
    }
  },
  (error) => {
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
