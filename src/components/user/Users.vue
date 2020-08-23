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
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input @clear="getUserList" clearable placeholder="请输入内容" v-model="queryInfo.query">
            <el-button @click="getUserList" icon="el-icon-search" slot="append"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button @click="addDialogVisible=true" type="primary">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch @change="userStateChanged(scope.row)" v-model="scope.row.mg_state"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="173px">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-button icon="el-icon-edit" size="mini" type="primary" @click="editUser(scope.row.id)"></el-button>
            <!--删除按钮-->
            <el-button icon="el-icon-delete" size="mini" type="danger" @click="delUser(scope.row.id)"></el-button>
            <!--分配角色按钮-->
            <el-tooltip :enterable="false" content="角色分配" effect="dark" placement="top">
              <el-button icon="el-icon-setting" size="mini" type="warning" @click="setRolesShow(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域-->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-size="queryInfo.pagesize"
        :page-sizes="[1, 2, 3, 5]"
        :total="total"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      :visible.sync="addDialogVisible"
      @close="addDialogClose"
      title="添加用户"
      width="50%">
      <!-- 内容区域-->
      <el-form :model="addForm" :rules="addFormRules" label-width="70px" ref="addFormRef">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域-->
      <span class="dialog-footer" slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button @click="addUser" type="primary">确 定</el-button>
        </span>
    </el-dialog>
    <!-- 编辑用户信息对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%" @close="editDialogClose">
      <!-- 内容区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配用户角色 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRolesDialogVisible"
      @close="setRolesDialogHide"
      width="50%">
      <p>当前用户：{{ setRolesInfo.username }}</p>
      <p>当前角色：{{ setRolesInfo.role_name }}</p>
      <p>分配新角色：
        <el-select v-model="setRolesSelected" placeholder="请选择">
          <el-option
            v-for="item in setRolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id">
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRolesSubmit">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Users',
  data () {
    // 添加邮箱自定义验证规则
    var checkEmail = (rule, value, callback) => {
      // 验证邮箱的正则表达式
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 添加手机自定义验证规则
    var checkMobile = (rule, value, callback) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0-9]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userlist: [],
      total: 0,
      // 添加用户按钮默认隐藏弹窗
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 添加用户表单的验证规则对象
      addFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: checkEmail,
            trigger: 'blur'
          }],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            validator: checkMobile,
            trigger: 'blur'
          }]
      },
      // 编辑用户按钮默认隐藏弹窗
      editDialogVisible: false,
      // 编辑用户的表单数据
      editForm: {
        // username: '',
        // email: '',
        // mobile: ''
      },
      // 修改用户表单的验证规则对象
      editFormRules: {
        username: [
          {
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }],
        email: [
          {
            required: true,
            message: '请输入邮箱',
            trigger: 'blur'
          }, {
            validator: checkEmail,
            trigger: 'blur'
          }],
        mobile: [
          {
            required: true,
            message: '请输入手机号码',
            trigger: 'blur'
          }, {
            validator: checkMobile,
            trigger: 'blur'
          }]
      },
      // 分配角色弹窗默认隐藏
      setRolesDialogVisible: false,
      // 需要被分配的角色用户信息
      setRolesInfo: {},
      // 所有角色的数据列表
      setRolesList: [],
      // 已选中的角色ID值
      setRolesSelected: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表数据失败')
      }
      this.userlist = res.data.users
      this.total = res.data.total
      // console.log(res)
    },
    // 监听pagesize改变的事件
    handleSizeChange (newsize) {
      // console.log(newsize)
      this.queryInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听页码值改变的事件
    handleCurrentChange (newpage) {
      // console.log(newpage)
      this.queryInfo.pagenum = newpage
      this.getUserList()
    },
    async userStateChanged (userinfo) {
      // console.log(userinfo)
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功')
    },
    // 监听添加用户对话框的关闭事件
    addDialogClose () {
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮，添加新用户
    addUser () {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid)
        if (!valid) return this.$message.error('请按要求填写')
        // 发起网络请求添加用户
        const { data: res } = await this.$http.post('users', this.addForm)
        // console.log(res)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success(res.meta.msg)
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserList()
      })
    },
    // 展示编辑用户对话框
    async editUser (id) {
      const { data: res } = await this.$http.get(`users/${id}`)
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.editForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件，重置内容
    editDialogClose () {
      this.$refs.editFormRef.resetFields()
    },
    // 修改用户信息并提交
    editUserInfo () {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请按要求填写')
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(`users/${this.editForm.id}`, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.editForm = res.data
        // 关闭对话框
        this.editDialogVisible = false
        // 提示修改成功
        this.$message.success(res.meta.msg)
        // 刷新列表数据
        this.getUserList()
      })
    },
    delUser (id) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`users/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        this.getUserList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 根据Id删除对应的用户信息
    // async delUser (id) {
    //   // 弹框询问用户是否删除数据
    //   const confirmResult = await this.$confirm(
    //     '此操作将永久删除该用户, 是否继续?',
    //     '提示',
    //     {
    //       confirmButtonText: '确定',
    //       cancelButtonText: '取消',
    //       type: 'warning'
    //     }
    //   ).catch(err => err)
    //
    //   // 如果用户确认删除，则返回值为字符串 confirm
    //   // 如果用户取消了删除，则返回值为字符串 cancel
    //   // console.log(confirmResult)
    //   if (confirmResult !== 'confirm') {
    //     return this.$message.info('已取消删除')
    //   }
    //
    //   const { data: res } = await this.$http.delete('users/' + id)
    //
    //   if (res.meta.status !== 200) {
    //     return this.$message.error('删除用户失败！')
    //   }
    //
    //   this.$message.success('删除用户成功！')
    //   this.getUserList()
    // },
    // 触发展示分配角色弹窗
    async setRolesShow (userInfo) {
      // console.log(user)
      this.setRolesInfo = userInfo
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色信息失败')
      }
      this.setRolesList = res.data
      this.setRolesDialogVisible = true
    },
    // 取消展示分配角色弹窗时清空被选中的角色信息
    setRolesDialogHide () {
      this.setRolesSelected = ''
      this.setRolesInfo = {}
    },
    // 提交分配角色请求
    async setRolesSubmit () {
      // console.log(this.setRolesInfo)
      const { data: res } = await this.$http.put(`users/${this.setRolesInfo.id}/role`, {
        rid: this.setRolesSelected
      })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('设置角色失败')
      }
      this.$message.success('设置角色成功')
      this.getUserList()
      this.setRolesDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>

</style>
