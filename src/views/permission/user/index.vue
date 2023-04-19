<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="userQuery.username" placeholder="用户" />
      </el-form-item>

      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="() => save()"
        >添加</el-button
      >
      <el-button type="danger" icon="el-icon-delete" @click="deleteBatchUser()"
        >批量删除</el-button
      >
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号" width="50">
        <template slot-scope="scope">
          {{ (currentPage - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="用户名" width="250">
        <template slot-scope="scope">
          {{ scope.row.username }}
        </template>
      </el-table-column>
      <el-table-column label="角色" width="800">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.roles"
            :key="item.id"
            disable-transitions
            >{{ item.name }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteUserById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      style="text-align: center"
      @size-change="handleSizeChange"
      @current-change="getList"
      :current-page="currentPage"
      :page-sizes="[1, 5, 10, 12, 20, 50, 100]"
      :page-size="size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <el-dialog title="用户" :visible.sync="dialogFormVisible">
      <el-form :model="userEntity">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="userEntity.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="userEntity.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select
            v-model="roleIds"
            multiple
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import role from "@/api/permission/role";
import user from "@/api/permission/user";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      userQuery: {},
      userEntity: {},
      options: [],
      roleIds: [],
    };
  },
  created() {
    this.getList();
    this.getRoleList();
  },

  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      user
        .getUserListPage(this.currentPage, this.size, this.userQuery)
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getRoleList() {
      role.getRoleList().then((response) => {
        this.options = response.data.items;
      });
    },
    resetData() {
      this.userQuery = {};
      this.getList();
    },
    save() {
      this.roleIds = [];
      this.roleEntity = {};
      this.dialogFormVisible = true;
    },
    deleteBatchUser() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的用户",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          user.deleteBatchUser(this.ids).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.ids = [];
            this.multipleSelection = [];
            this.getList();
          })
        )
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEdit(row) {
      this.userEntity = row;
      this.roleIds = row.roles.map((item) => item.id);
      this.dialogFormVisible = true;
    },
    deleteUserById(id) {
      this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          user.deleteUserById(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          })
        )
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    cancel() {
      this.userEntity = {};
      this.roleIds = [];
      this.getList();
      this.dialogFormVisible = false;
    },
    saveOrUpdate() {
      if (
        this.userEntity.username == null ||
        this.userEntity.username.trim() == "" ||
        this.userEntity.password == null ||
        this.userEntity.password.trim() == "" ||
        this.roleIds.length == 0
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });
        return;
      }
      user.isExistUserName(this.userEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            message: "用户名已存在",
            type: "warning",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.userEntity.id != null) {
          user
            .updateUserById(this.userEntity, this.roleIds)
            .then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.userEntity = {};
              this.roleIds = [];
              this.getList();
            });
        } else {
          user.saveUser(this.userEntity, this.roleIds).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.userEntity = {};
            this.roleIds = [];
            this.getList();
          });
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>