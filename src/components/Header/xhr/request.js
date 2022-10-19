import axios from 'axios';
import { getToken, removeToken } from '../../../utils/auth';
import { Message } from 'element-ui';
import Cookies from 'js-cookie';

const service = axios.create({
  baseURL: '/api/cmsapi',
  timeout: 120000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
  withCredentials: true,
});

service.interceptors.request.use((config) => {
  if (config.method === 'get') {
    //  给data赋值以绕过if判断
    config.data = true;
    // config.headers['Cache-Control'] = 'no-cache, no-store'; // 清除缓存
    config.url += ~config.url.indexOf('?') ? `&v=${Date.now()}` : `?v=${Date.now()}`;
  }
  const cmsToken = getToken();
  if (cmsToken) {
    config.headers['cmsToken'] = cmsToken;
  }
  return config;
});

service.interceptors.response.use(({ data }) => {
  if (+data.code === 1000002 || +data.code === 1000001 || +data.code === 1000003) {
    let url = decodeURIComponent(location.href);

    if (url.indexOf('user/') < 0) {
      localStorage.setItem('targetUrls', location.href);
    }
    // location.href = location.origin + '/user-center/#/user/login/';

    // } else if (location.hash.indexOf('userCenter') > -1) {
    //     location.href =
    //         location.origin + '/user-center/#/user/login?callback=' + encodeURIComponent(location.href);
    // }
    removeToken();
    Cookies.set('closeM', 0);

    // sessionStorage.removeItem('closeFlag');
    Message.error('登录信息失效, 请重新登录!');
  }

  return data;
});

export default service;
