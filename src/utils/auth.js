import { userCenterLoginUrl, userCenterProfileUrl, userCenterTokenName } from '../config/index';

export function getToken() {
  return window.localStorage.getItem(userCenterTokenName);
}

export function removeToken() {
  window.localStorage.removeItem(userCenterTokenName);
}

export function goLogin() {
  window.location.href = userCenterLoginUrl;
}

export function goProfile() {
  window.location.href = userCenterProfileUrl;
}
