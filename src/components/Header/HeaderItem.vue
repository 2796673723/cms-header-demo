<template>
  <div>
    <!--展示信息-->
    <section v-if="openMessage && messageList.length > 0" class="message-box">
      <div />
      <!--  轮播图-->
      <el-carousel v-if="messageList.length > 1" :interval="7000" arrow="never" trigger="click" height="40px">
        <el-carousel-item v-for="(item, index) in messageList" :key="index">
          <div class="message-text">{{ item.content }}</div>
        </el-carousel-item>
      </el-carousel>
      <div v-if="messageList.length === 1">
        <div class="message-text">{{ messageList[0].content }}</div>
      </div>
      <!--  关闭按钮-->
      <div class="close-message">
        <img src="./img/close_no_2x.png" width="20" height="20" alt="" @click="closeMessage" />
      </div>
    </section>
    <!--头部菜单栏-->
    <div class="header-section">
      <!--  链接区域-->
      <div class="link-container">
        <!--    logo区域-->
        <div class="logo-container">
          <!--      logo图标区-->
          <img src="./img/logo.png" alt="" class="logo-img" @click="goOrigin" />
          <!--      logo按钮区-->
          <div class="logo-btn" @click="skipTo('cms')">
            <img src="./img/home_2x.png" alt="" />
            <span class="index-link">工作台首页</span>
          </div>
        </div>
        <!--   外部链接区域-->
        <div class="header-link">
          <!--      导航链接-->
          <div class="nav-menu">
            <a v-for="menuItem in navList" :key="menuItem.id" class="item" target="_blank" :href="menuItem.skipUrl">{{
              menuItem.name
            }}</a>
          </div>
          <!--      邮箱链接-->
          <div class="email-menu" @click="skipTo('cms/message/index')">
            <img v-if="hasNewMessage" src="./img/logo_email_new_2x.png" alt="" />
            <img v-else src="./img/logo_email_2x.png" alt="" />
          </div>
        </div>
      </div>
      <!--  用户中心-->
      <div class="user-center">
        <el-dropdown>
          <div class="el-dropdown-link">
            <img class="user-avatar" :src="avatarImg" alt="" />
          </div>
          <el-dropdown-menu
            v-if="Object.keys(userInfo).length > 0 && userInfo.accountName"
            slot="dropdown"
            class="dropdown-menu-fix"
          >
            <div class="menu-title">
              <div class="title-up">
                <div class="name">{{ userInfo.phone }}</div>
                <div v-if="!userInfo.userType" class="role">{{ roleCheck }}</div>
              </div>
              <div class="title-txt">【{{ userInfo.userName }}】的工作台</div>
            </div>
            <el-dropdown-item class="drop-item-text" @click.native="skip('info')">账号信息</el-dropdown-item>
            <el-dropdown-item class="drop-item-text" @click.native="skip('newIndex')">安全设置</el-dropdown-item>
            <el-dropdown-item class="drop-item-text" @click.native="skipTo('cmsIndex')">访问控制</el-dropdown-item>
            <el-dropdown-item class="drop-item-text" @click.native="skipTo('workorder')">我的工单</el-dropdown-item>
            <el-dropdown-item class="drop-item-text" @click.native="skipTo('cms/guard/select-account')"
              >切换账户
            </el-dropdown-item>
            <el-button class="drop-item-button" @click.native="logoutHandle">退出登录</el-button>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script>
import avatar from './img/avatar_default.png';
import { getNavList, getMessageList, getMessageStatus } from './api/header';
import { checkMessage, evalBoolean, getBrowserInfo } from './utils/browserInfo';
import { CookieNames, sessionNames, localNames } from './browserStore';
import Cookies from 'js-cookie';
import { UrlSkip } from '../../mixins/urlSkip';

export default {
  name: 'HeaderItem',
  mixins: [UrlSkip],
  props: {
    userInfo: {
      type: Object,
      default: () => ({
        userName: '',
        accountName: '',
        phone: '',
        userType: 0,
        headPicture: null,
      }),
    },
    handleLogout: {
      type: Function,
      default: null,
    },
  },
  data() {
    return {
      openMessage: true,
      intervalList: null,
      intervalStatus: null,
      messageList: [],
      navList: [],
      hasNewMessage: false,
      browserFlag: true,
      isFirstLogin: false,
    };
  },

  computed: {
    roleCheck() {
      switch (this.userInfo.userType) {
        case 0:
          return '协作者';
        case 1:
          return '';
        default:
          return '';
      }
    },
    avatarImg() {
      return this.userInfo.headPicture ?? avatar;
    },
  },

  created() {
    this.getIsFirstLogin();
    this.getNavList();
    this.getMessageStatus();
    this.initGetList();
  },
  mounted() {
    this.getMessageList();
  },
  destroyed() {
    clearInterval(this.intervalList);
    clearInterval(this.intervalStatus);
  },

  methods: {
    closeMessage() {
      this.openMessage = false;
      Cookies.set(CookieNames.openMessage, false);
      localStorage.setItem(localNames.oldMessage, JSON.stringify(this.messageList));
    },

    initGetList() {
      this.intervalList = setInterval(() => {
        this.getMessageList();
      }, 30000);
      this.intervalStatus = setInterval(() => {
        this.getMessageStatus();
      }, 30000);
      this.browserFlag = getBrowserInfo();
      if (!this.browserFlag && this.isFirstLogin) {
        this.$confirm(
          '检测到您正在使用旧版或系统不支持的浏览器，为获得更好的使用体验，我们推荐您使用较新版本的Chrome、Microsoft Edge浏览器。',
          '提示',
          {
            type: 'warning',
            closeOnClickModal: false,
          }
        );
        this.isFirstLogin = false;
        sessionStorage.removeItem(sessionNames.firstLogin);
      }
      const accountToken = localStorage.getItem(localNames.accountToken);
      if (!accountToken || accountToken == 'null') {
        return false;
      }
      const openMessage = Cookies.get(CookieNames.openMessage);
      this.openMessage = evalBoolean(openMessage);
    },

    async getNavList() {
      const res = await getNavList();
      if (res.success) {
        this.navList = res.data;
      }
    },

    async getMessageList() {
      const res = await getMessageList();
      if (res.success) {
        this.messageList = res.data;
        let oldMessage;
        try {
          oldMessage = JSON.parse(localStorage.getItem(localNames.oldMessage));
        } catch {
          oldMessage = [];
        }
        const isUpdated = checkMessage(oldMessage, this.messageList);
        console.log(isUpdated);
        if (isUpdated) {
          this.openMessage = true;
          Cookies.set(CookieNames.openMessage, true);
        }
        localStorage.setItem(localNames.oldMessage, JSON.stringify(this.messageList));
      }
    },

    async getMessageStatus() {
      const res = await getMessageStatus();
      if (res.success) {
        this.hasNewMessage = +res.data > 0;
      }
    },

    getIsFirstLogin() {
      this.isFirstLogin = !!sessionStorage.getItem(sessionNames.firstLogin);
    },

    logoutHandle() {
      this.handleLogout?.();
      Cookies.set(CookieNames.openMessage, true);
    },
  },
};
</script>

<style scoped>
.message-box {
  min-width: 800px;
  display: grid;
  grid-template-columns: 1fr 95% 1fr;
  height: 40px;
  background-color: #464c59;
}
.message-box .message-text {
  width: 100%;
  color: #fff;
  line-height: 40px;
  font-weight: 500;
  font-size: 12px;
  text-align: center;
  white-space: nowrap;
}
.message-box ::v-deep .el-carousel__indicators--horizontal {
  height: 100%;
  transform: none;
  right: 0;
  left: auto;
  display: flex;
  align-items: center;
}
.message-box ::v-deep .el-carousel--horizontal li.is-active button {
  background: #4a90e2;
}
.message-box .close-message {
  display: flex;
  justify-content: center;
  align-items: center;
}
.message-box .close-message img {
  cursor: pointer;
}
.header-section {
  min-width: 800px;
  display: flex;
  height: 50px;
  line-height: 50px;
  background-color: #2b303b;
  color: #acb0b8;
  font-size: 14px;
}
.header-section .link-container {
  display: flex;
  justify-content: space-between;
  flex-grow: 1;
}
.header-section .link-container .logo-container {
  height: 100%;
  display: flex;
}
.header-section .link-container .logo-container .logo-img {
  height: 100%;
  cursor: pointer;
}
.header-section .link-container .logo-container .logo-btn {
  display: flex;
  align-items: center;
  cursor: pointer;
}
.header-section .link-container .logo-container .logo-btn img {
  height: 16px;
  width: 16px;
}
.header-section .link-container .logo-container .logo-btn .index-link {
  color: #acb0b8;
  font-size: 14px;
  margin-left: 7px;
}
.header-section .link-container .logo-container .logo-btn .index-link:hover {
  color: #4a90e2;
}
.header-section .link-container .header-link {
  display: flex;
  align-items: center;
}
.header-section .link-container .header-link .nav-menu {
  display: flex;
  align-items: center;
  border-right: 1px solid #383e4d;
  padding-right: 20px;
  margin-right: 20px;
  height: 24px;
}
.header-section .link-container .header-link .nav-menu .item {
  font-size: 12px;
  font-weight: 400;
  color: #acb0b8;
  text-decoration: none;
}
.header-section .link-container .header-link .nav-menu .item:hover {
  color: #4a90e2;
}
.header-section .link-container .header-link .nav-menu .item + .item {
  margin-left: 35px;
}
.header-section .link-container .header-link .email-menu {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-right: 20px;
}
.header-section .link-container .header-link .email-menu img {
  cursor: pointer;
  width: 24px;
  height: 24px;
}
.header-section .user-center {
  display: flex;
  align-items: center;
  width: 100px;
}
.header-section .user-center .el-dropdown {
  width: 100%;
  height: 100%;
}
.header-section .user-center .el-dropdown .el-dropdown-link {
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
}
.header-section .user-center .el-dropdown .el-dropdown-link .user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.header-section .user-center .el-dropdown .el-dropdown-link .user-name {
  flex: 1;
  text-align: center;
  font-size: 14px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.el-dropdown-menu {
  margin-top: 5px !important;
  left: 1064px;
  width: 200px;
  border: 1px solid #e5e5e5;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  border-radius: 0;
  text-align: center;
}
.title-up {
  display: flex;
  align-items: center;
}
.title-up .role {
  padding-right: 9px;
  line-height: 20px;
  margin-left: 8px;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  color: #4a90e2;
  background: #fff;
  border: 1px solid #4a90e2;
  border-radius: 11px;
  flex-shrink: 0;
}
.title-up .name {
  font-size: 16px;
  font-weight: 600;
  color: #313131;
  overflow: hidden;
  max-width: 60%;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.title-txt {
  margin-top: 1px;
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  color: #98999a;
}
.menu-title {
  margin: 0 auto;
  width: 90%;
  text-indent: 10px;
  line-height: 35px;
  background: #f5f6f9;
  text-align: left;
}
.drop-item-text {
  text-align: left;
}
.drop-item-button {
  height: 36px;
  line-height: 32px;
  width: 88%;
  margin-top: 7px;
  margin-bottom: 6px;
  padding: 0;
}
</style>
