<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 顶部格栅区域 -->
      <el-row :gutter="20">
        <!-- 添加分类按钮区域 -->
        <el-col :span="6">
          <el-button type="primary" @click="addCateDialogShow">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 分类列表区域 -->
      <zk-table
        :data="cateList"
        :columns="columns"
        :border="true"
        :show-row-hover="false"
        :show-index="true"
        :expand-type="false"
        :selection-type="false">
        <template slot="cat_deleted" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted === false" style="color: lightgreen"></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <template slot="cat_level" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template slot="cat_set" slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editCatDialogShow(scope.row)">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini" @click="editCatDialogShow(scope.row)">删除
          </el-button>
        </template>
      </zk-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 添加分类按钮区域 -->
    <el-dialog
      title="添加分类" :visible.sync="addCateDialogVisible" width="50%">
      <el-form :model="addCateInfo" :rules="addCateFormRules" ref="addCateFormRule" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateInfo.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader v-model="selectedKeys" :options="addCatePidList" :props="addCascaderProps" expand-trigger="hover"
                       @change="addCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateDialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 分类查询参数
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 10
      },
      // 分类列表
      cateList: [],
      // 分类总数
      total: 0,
      // 分类列表
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'cat_deleted'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'cat_level'
        },
        {
          label: '操作',
          type: 'template',
          template: 'cat_set',
          width: '181px'
        }
      ],
      // 添加分类按钮默认隐藏
      addCateDialogVisible: false,
      // 添加分类规则
      addCateFormRules: {
        cat_name: [
          {
            required: true,
            message: '请输入分类名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 添加分类请求信息
      addCateInfo: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0
      },
      // 添加分类父分类ID列表
      addCatePidList: [],
      // 添加分类列表选项
      addCascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      selectedKeys: []
    }
  },
  created () {
    // 商品分类数据列表
    this.getCateList()
  },
  methods: {
    // 商品分类数据列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类列表数据失败')
      }
      // 将分类列表数据赋值给cateList
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    addCateDialogShow () {
      this.getCateListTwoLevel()
      this.addCateDialogVisible = true
    },
    async getCateListTwoLevel () {
      const { data: res } = await this.$http.get('categories', { params: { type: 2 } })
      // console.log(res)
      this.addCatePidList = res.data
    },
    addCateChanged () {
      this.addCateInfo.cat_pid = this.selectedKeys
      // 如果 selectedKeys 数组中的 length 大于0，证明有选中的父级分类
      // 反之，就说明没有选中任何父级分类
      console.log(this.selectedKeys)
      if (this.selectedKeys.length > 0) {
        // 长度索引是从1开始计算的，-1是所得当前分类名称需要配置的父类ID
        this.addCateInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateInfo.cat_level = this.selectedKeys.length
      } else {
        this.addCateInfo.cat_pid = 0
        this.addCateInfo.cat_level = 0
      }
      // console.log(this.addCateInfo)
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
  font-size: 12px;
}

.el-cascader {
  width: 100%;
}
</style>
