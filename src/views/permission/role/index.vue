<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="roleQuery.name" placeholder="角色" />
      </el-form-item>
      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="() => save()"
        >添加</el-button
      >
      <el-button type="danger" icon="el-icon-delete" @click="deleteBatchRole()"
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
      <el-table-column label="角色" width="120">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="权限" width="900">
        <template slot-scope="scope">
          <el-tag
            v-for="item in scope.row.permissions"
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
            @click="deleteRoleById(scope.row.id)"
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
    <el-dialog title="角色" :visible.sync="dialogFormVisible">
      <el-form :model="roleEntity">
        <el-form-item label="角色" :label-width="formLabelWidth">
          <el-input v-model="roleEntity.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限" :label-width="formLabelWidth">
          <el-select
            v-model="permissionIds"
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
import permission from "@/api/permission/permission";
export default {
  components: {},
  props: {},
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
      roleQuery: {},
      roleEntity: {},
      options: [],
      permissionIds: [],
    };
  },

  created() {
    this.getList();
    this.permissionsList();
  },
  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      role
        .getRoleListPage(this.currentPage, this.size, this.roleQuery)
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    permissionsList() {
      permission.getPermissionList().then((response) => {
        this.options = response.data.items;
      });
    },
    resetData() {
      this.roleQuery = {};
      this.getList();
    },
    save() {
      this.permissionIds = [];
      this.roleEntity = {};
      this.dialogFormVisible = true;
    },
    deleteBatchRole() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的角色",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          role.deleteBatchRole(this.ids).then((response) => {
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
      this.roleEntity = row;
      this.permissionIds = row.permissions.map((item) => item.id);
      this.dialogFormVisible = true;
    },
    deleteRoleById(id) {
      this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          role.deleteRoleById(id).then((response) => {
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
      this.roleEntity = {};
      this.permissionIds = [];
      this.getList();
      this.dialogFormVisible = false;
    },
    saveOrUpdate() {
      if (
        this.roleEntity.name == null ||
        this.roleEntity.name.trim() == "" ||
        this.permissionIds.length == 0
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });
        return;
      }
      role.isExistRoleName(this.roleEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            message: "角色名已存在",
            type: "warning",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.roleEntity.id != null) {
          role
            .updateRoleById(this.roleEntity, this.permissionIds)
            .then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.roleEntity = {};
              this.permissionIds = [];
              this.getList();
            });
        } else {
          role.saveRole(this.roleEntity, this.permissionIds).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.roleEntity = {};
            this.permissionIds = [];
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