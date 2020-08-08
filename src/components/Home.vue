<template>
  <!--  监听退出按钮，点击按钮调用logout方法-->
  <el-button @click="logout" type="info">退出</el-button>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    logout () {
      // 使用window DOM调用seesionStorage的clear方法清空token
      window.sessionStorage.clear()
      // 使用router路由，push到对应页面
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
