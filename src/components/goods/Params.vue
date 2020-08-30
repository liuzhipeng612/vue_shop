<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 警告区域 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon>
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="cate-opt">
        <el-col>
          <span>商品选择分类：</span>
          <!-- 选择商品分类的级联选择框 -->
          <el-cascader v-model="selectedKeys" :options="selectCatePidList" :props="selectCascaderProps"
                       @change="selectHandleChanged" clearable></el-cascader>
        </el-col>
      </el-row>
      <!-- 分类参数Tabs标签 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" :disabled="isBtnDisabled">添加参数</el-button>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Params',
  data () {
    return {
      // 选择分类请求信息
      selectParamsInfo: {
        id: 0,
        sel: []
      },
      // 被选分类ID
      selectedKeys: [],
      // 选择分类父分类ID列表
      selectCatePidList: [],
      // 选择分类列表选项
      selectCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 分类参数Tabs标签激活名称
      activeName: 'many'
    }
  },
  created () {
    this.getCateListThreeLevel()
  },
  methods: {
    // 获取三级分类列表
    async getCateListThreeLevel () {
      const { data: res } = await this.$http.get('categories')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败')
      }
      this.selectCatePidList = res.data
    },
    // 选择商品分类
    async selectHandleChanged () {
      // 选择商品分类如果不是第三分类，不给选中
      if (this.selectedKeys.length !== 3) {
        this.selectedKeys = []
      }
      // console.log(this.selectedKeys)
      this.selectParamsInfo.id = this.selectedKeys[2]
      this.selectParamsInfo.sel = this.activeName
      const { data: res } = await this.$http.get(`categories/${this.selectParamsInfo.id}/attributes`,
        { params: { sel: this.selectParamsInfo.sel } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数列表失败')
      }
      console.log(res.data)
    },
    handleClick () {
    }
  },
  computed: {
    isBtnDisabled () {
      return this.selectedKeys.length !== 3
    }
  }
}
</script>

<style lang="less" scoped>
.cate-opt {
  margin: 15px 0;
}
</style>
