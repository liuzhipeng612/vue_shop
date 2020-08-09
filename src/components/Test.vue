<template>
  <!-- 菜单区域 -->
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    text-color="#fff">
    <!-- 一级菜单 -->
    <el-submenu index="1">
      <!-- 一级菜单的模板区域 -->
      <template slot="title">
        <!-- 一级菜单的模板区域 -->
        <i class="el-icon-location"></i>
        <!-- 一级菜单的模板区域 -->
        <span>导航一</span>
      </template>
      <!-- 二级菜单分组 -->
      <el-menu-item-group>
        <!-- 二级菜单的模板区域 -->
        <template slot="title">分组一</template>
        <!-- 二级菜单的模板区域 -->
        <el-menu-item index="1-1">选项1</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'Test'
}
</script>

<style scoped>

</style>
