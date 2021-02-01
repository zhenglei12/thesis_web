<template>
  <a-layout class="layout">
    <a-layout-sider v-model="collapsed" :trigger="null" collapsible>
      <div class="logo" @click="goto('/')">
        <img v-if="collapsed" src="../assets/logo.png" alt="logo" />
        <span v-else>论文系统</span>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :open-keys="openKey"
        :defaultSelectedKeys="[$route.name]"
        @openChange="openChange"
      >
        <a-sub-menu
          v-acl:one="['user-list', 'role-list', 'permission-list']"
          key="user"
        >
          <span slot="title"><a-icon type="user" /><span>用户管理</span></span>
          <a-menu-item v-acl="'user-list'" key="person" @click="goto('/person')"
            >用户列表</a-menu-item
          >
          <a-menu-item v-acl="'role-list'" key="role" @click="goto('/role')"
            >角色列表</a-menu-item
          >
        </a-sub-menu>
        <a-sub-menu key="task" v-acl="'order-list'">
          <span slot="title"><a-icon type="user" /><span>任务管理</span></span>
          <a-menu-item v-acl="'order-list'" key="order" @click="goto('/order')"
            >订单列表</a-menu-item
          >
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <a-icon
          class="trigger"
          :type="collapsed ? 'menu-unfold' : 'menu-fold'"
          @click="() => (collapsed = !collapsed)"
        />
        <a-button type="link" @click="$auth.logout()">退出登录</a-button>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="wraper">
          <router-view />
        </div>
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>

<script>
export default {
  data() {
    return {
      collapsed: false,
      openKey: [],
    };
  },
  mounted() {
    let key = this.$route.meta.group || this.$route.name.split("/")[0];
    this.openKey = [key];
  },
  methods: {
    goto(path) {
      this.$router.push(path);
    },
    openChange(e) {
      this.openKey = e.filter((_) => _ !== this.openKey[0]);
    },
  },
};
</script>

<style lang="less" scoped>
.layout {
  height: 100vh;
  overflow: hidden;

  .trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #1890ff;
    }
  }

  .logo {
    height: 32px;
    background: rgba(255, 255, 255, 0.2);
    margin: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    color: white;
    font-family: cursive;
    white-space: nowrap;
    overflow: hidden;
    cursor: pointer;

    img {
      width: 20px;
    }
  }

  .header {
    background: #fff;
    padding: 0;
    box-shadow: 0 0 10px 0px #cccccc;
    z-index: 9;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content {
    padding: "24px 16px";
    overflow: "auto";

    .wraper {
      background: white;
      padding: 16px;
    }
  }
}
</style>