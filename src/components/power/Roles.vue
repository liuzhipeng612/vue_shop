<template>
  <div>
    <!-- 面包屑导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 顶部格栅区域 -->
      <el-row :gutter="20">
        <!-- 添加按钮 -->
        <el-col :span="6">
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesForm" stripe border>
        <el-table-column type="expand" label="收缩">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="商品名称">
                <span>{{ props.row.name }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号">
        </el-table-column>
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <el-table-column
          label="操作"
          width="284">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          <el-button type="warning" icon="el-icon-s-tools" size="mini">分配角色</el-button>
        </el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      rolesForm: []
    }
  },
  created () {
    this.getRolesForm()
  },
  methods: {
    async getRolesForm () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.rolesForm = res.data
    }
  }
}
</script>

<style scoped>

</style>
