const verList = {
  chrome: '86.0.4240.198',
  edg: '98.0.1108.43',
  ie: '10',
};

export function getBrowserInfo() {
  let checkIE = IEVersion();
  if (checkIE === 'edg' || checkIE === 'noIE') {
    let Sys = {};
    let ua = navigator.userAgent.toLowerCase();
    let re = /(edg|msie|firefox|chrome|opera|version).*?([\d.]+)/;
    let m = ua.match(re);
    Sys.browser = m[1].replace(/version/, "'safari");
    Sys.ver = m[2];
    if (Object.keys(verList).indexOf(Sys.browser) > -1) {
      let now = Sys.ver.split('.');
      let limit = verList[Sys.browser].split('.');
      if (now.length > 0 && limit.length > 0) {
        return compareArray(now, limit);
      }
    }
  } else if (checkIE < parseInt(verList.ie)) {
    return false;
  }
  return true;
}

function IEVersion() {
  const ua = window.navigator.userAgent;

  const msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  const trident = ua.indexOf('Trident/');
  if (trident > 0) {
    const rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  const edge = ua.indexOf('Edge/');
  if (edge > 0) {
    return 'edg';
  }

  return 'noIE';
}

function compareArray(pre, next) {
  for (let i = 0; i < pre.length; i++) {
    if (parseInt(pre[i]) > parseInt(next[i])) {
      return true;
    } else if (parseInt(pre[i]) === parseInt(next[i])) {
      if (i === pre.length - 1) return true;
    } else {
      return false;
    }
  }
  return true;
}

export const evalBoolean = (flag) => flag === 'true';

export function checkMessage(oldMessage, newMessage) {
  if (!oldMessage || !newMessage) return false;
  if (oldMessage.length !== newMessage.length) return true;

  const contentSet = new Set(oldMessage.map((val) => val.content));
  for (const message of newMessage) {
    if (contentSet.has(message.content)) return false;
  }
  return true;
}
