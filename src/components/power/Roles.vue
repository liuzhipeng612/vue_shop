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
        <!-- 添加角色按钮区域 -->
        <el-col :span="6">
          <el-button type="primary" @click="addRolesDialogVisible=true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="RolesList" stripe border>
        <!-- 展开列 -->
        <el-table-column type="expand" label="收缩">
          <template slot-scope="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id"
                    :class="['bdbottom',i1===0 ? 'bdtop' : '', 'vcenter']">
              <el-col :span="5">
                <el-tag closable @close="removeRolesRights(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row :class="[i2===0 ? '' : 'bdtop','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRolesRights(scope.row,item2.id)">{{
                        item2.authName
                      }}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3) in item2.children" :key="item3.id" closable
                            @close="removeRolesRights(scope.row,item3.id)">{{
                        item3.authName
                      }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--<pre>
              {{ scope.row }}
            </pre>-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="序号">
        </el-table-column>
        <!-- 角色名称列 -->
        <el-table-column
          label="角色名称"
          prop="roleName">
        </el-table-column>
        <!-- 角色描述列 -->
        <el-table-column
          label="角色描述"
          prop="roleDesc">
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column
          label="操作"
          width="173">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
                       @click="editRolesDialogShow(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRoles(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配权限" placement="top-start" :enterable="false">
              <el-button type="warning" icon="el-icon-s-tools" size="mini"
                         @click="setRightsDialogShow(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色弹框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRolesDialogVisible"
      @close="addRolesDialogHide"
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
        <el-button type="primary" @click="addRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑角色弹框 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="editRolesDialogVisible"
      @close="editRolesDialogHide"
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
        <el-button type="primary" @click="editRolesSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限弹窗 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightsDialogVisible"
      @close="setRightsDialogHide"
      width="50%">
      <!-- 内容区域 -->
      <el-tree :data="setRightsList" :props="defaultProps" show-checkbox default-expand-all node-key="id"
               :default-checked-keys="defaultKeys" ref="setRightsTreeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data () {
    return {
      // 所有角色表单数据默认为空
      RolesList: [],
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
      },
      // 设置权限弹窗默认隐藏
      setRightsDialogVisible: false,
      // 设置权限列表默认为空
      setRightsList: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      defaultKeys: [],
      roleId: ''
    }
  },
  created () {
    this.getRolesList()
  },
  methods: {
    // 获取角色表单数据
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      this.RolesList = res.data
    },
    // 关闭添加角色弹窗重置表单数据
    addRolesDialogHide () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 提交添加角色信息
    addRolesSubmit () {
      // 表单数据校验
      this.$refs.addRolesFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请按要求填写')
        }
        // 发起添加角色请求
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
    // 展示编辑角色弹窗
    async editRolesDialogShow (id) {
      this.editRolesDialogVisible = true
      const { data: res } = await this.$http.get(`roles/${id}`)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户角色失败')
      }
      this.editRolesForm = res.data
    },
    // 隐藏编辑角色弹窗
    editRolesDialogHide () {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 提交修改角色信息
    editRolesSubmit () {
      this.$refs.editRolesFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('请按要求填写')
        }
        const { data: res } = await this.$http.put(`roles/${this.editRolesForm.roleId}`, {
          roleName: this.editRolesForm.roleName,
          roleDesc: this.editRolesForm.roleDesc
        })
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('保存角色信息失败')
        }
        this.editRolesDialogVisible = false
        this.$message.success('保存角色信息成功')
        this.getRolesForm()
      })
    },
    // 删除角色信息
    removeRoles (id) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${id}`)
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message({
          type: 'success',
          message: res.meta.msg
        })
        this.getRolesForm()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 展示删除指定权限弹窗
    removeRolesRights (role, rightId) {
      this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        if (res.meta.status !== 200) {
          return this.$message.error('删除权限失败')
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        // this.getRolesForm()
        role.children = res.data
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async setRightsDialogShow (role) {
      this.roleId = role.id
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      this.setRightsList = res.data
      this.getLeafKeys(role, this.defaultKeys)
      this.setRightsDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到 defKeys 数组中 node原来的数组，arr为新数组即defaultKeys
    getLeafKeys (node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 关闭权限分配弹窗时，自动初始化defaultKeys为空
    setRightsDialogHide () {
      this.defaultKeys = []
    },
    async setRightsSubmit () {
      const keys = [
        ...this.$refs.setRightsTreeRef.getHalfCheckedKeys(),
        ...this.$refs.setRightsTreeRef.getCheckedKeys()
      ]
      console.log(keys)
      const idStr = keys.join(',')
      console.log(idStr)

      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败！')
      }

      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightsDialogVisible = false
    }
  }
}
</script>

<style lang="less" scoped>
.bdtop {
  border-top: 1px solid #eee;
}

.el-tag {
  margin: 7px;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>
