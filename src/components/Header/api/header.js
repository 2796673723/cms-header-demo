import request from '../xhr/request';

export function getNavList() {
  return request({
    url: '/portal/config/navigation/list',
    method: 'get',
  });
}

export function getMessageList() {
  return request({
    url: '/portal/notice/list',
    method: 'get',
  });
}

export function getMessageStatus() {
  return request({
    url: '/portal/message/unCheck/unread/num',
    method: 'get',
  });
}
