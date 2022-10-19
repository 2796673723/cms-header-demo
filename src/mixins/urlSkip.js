export const UrlSkip = {
  methods: {
    goOrigin() {
      let url = window.location.origin;
      window.open(url);
    },

    skip(type) {
      //   location.href = location.origin + `/${type}`;
      if (type === 'info') {
        location.href = location.origin + '/user-center/#/userCenter/profile/info';
      } else if (type === 'newIndex') {
        location.href = location.origin + '/user-center/#/userCenter/safety/newIndex';
      }
    },

    skipTo(type) {
      if (type === 'cmsIndex') {
        let url = window.location.origin + '/cms/subaccount-management/index';
        window.open(url);
      } else {
        location.href = location.origin + `/${type}`;
      }
    },
  },
};