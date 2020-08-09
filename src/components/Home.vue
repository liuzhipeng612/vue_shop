<template>
  <!-- 监听退出按钮，点击按钮调用logout方法 -->
  <el-container>
    <!--  头部区域 -->
    <el-header>
      <div>
        <img alt="logo" src="../assets/heima.png">
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!--  页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          active-text-color="#ffd04b"
          background-color="#333744"
          text-color="#fff">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" :key="item.id" v-for="item in MenuList">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item :index="subitem.id+''" :key="subitem.id" v-for="subitem in item.children">
              <!-- 二级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <!-- 文本 -->
                <span>{{ subitem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'Home',
  data () {
    return {
      // 左侧菜单栏数据,定义为空，为了接受对应方法返回的数据
      MenuList: []
    }
  },
  // 在没有完全生成这个组件内存数据是，使用声明周期函数钩子提前介入创建一个函数
  created () {
    this.getMenuList()
  },
  methods: {
    logout () {
      // 使用window DOM调用seesionStorage的clear方法清空token
      window.sessionStorage.clear()
      // 使用router路由，push到对应页面
      this.$router.push('/login')
    },
    // 获取所有的菜单项
    // 对生命周期函数进行定义
    async getMenuList () {
      // const res = await this.$http.get('menus')
      const { data: res } = await this.$http.get('menus')
      // 判断返回状态码是否等于200，如果不是，将返回的meta.msg中的消息返回给前端
      // 如果是200，则将res.data的赋值给dat()方法中的菜单数据
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.MenuList = res.data
      console.log(res)
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-content: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }
  }
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}
</style>
