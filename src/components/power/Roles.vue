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
          <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
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
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRolesInfo(scope.row.id)">编辑
            </el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-s-tools" size="mini">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      @close="closeAddRolesDialogVisible"
      width="50%">
      <el-form ref="addRolesFormRef" :model="addRolesForm" :rules="addRolesFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      @close="closeEditRolesDialogVisible"
      width="50%">
      <!-- 内容主体 -->
      <el-form ref="editRolesFormRef" :model="editRolesForm" :rules="editRolesFormRules" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 角色表单数据默认为空
      rolesForm: [],
      // 添加角色弹窗默认隐藏
      addRolesDialogVisible: false,
      // 添加角色表单数据默认为空
      addRolesForm: {
        roleName: '',
        roleDesc: ''
      },
      // 添加角色表单验证规则
      addRolesFormRules: {
        // 角色名验证规则
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 角色描述验证规则
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      // 编辑角色弹窗默认隐藏
      editRolesDialogVisible: false,
      // 编辑角色表单数据默认为空
      editRolesForm: {},
      // 编辑表单项验证规则
      editRolesFormRules: {
        // 角色名验证规则
        roleName: [
          {
            required: true,
            message: '请输入角色名称',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 10,
            message: '长度在 2 到 10 个字符',
            trigger: 'blur'
          }
        ],
        // 角色描述验证规则
        roleDesc: [
          {
            required: true,
            message: '请输入角色描述',
            trigger: 'blur'
          },
          {
            min: 2,
            max: 20,
            message: '长度在 2 到 20 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created () {
    this.getRolesForm()
  },
  methods: {
    // 获取角色表单数据
    async getRolesForm () {
      const { data: res } = await this.$http.get('roles')
      console.log(res)
      this.rolesForm = res.data
    },
    // 关闭添加角色弹窗重置表单数据
    closeAddRolesDialogVisible () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 数据校验和请求添加角色数据
    addRolesInfo () {
      // 表单数据校验
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请按要求填写')
        }
        // 发起添加橘色请求
        const { data: res } = await this.$http.post('roles', this.addRolesForm)
        console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error('添加用户角色失败')
        }
        // 添加角色成功后隐藏弹框
        this.addRolesDialogVisible = false
        // 提示添加成功
        this.$message.success('添加用户角色成功')
        // 刷新列表数据
        this.getRolesForm()
      })
    },
    closeEditRolesDialogVisible () {
      this.$refs.editRolesFormRef.resetFields()
    },
    editRolesInfo (id) {
      this.editRolesDialogVisible = true
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请按要求填写')
        }
        const { data: res } = await this.$http.put('roles/id', this.editRolesForm)
        console.log(res)
      })
    }
  }
}
</script>

<style scoped>

</style>
