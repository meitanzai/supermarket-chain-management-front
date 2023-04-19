<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="permissionQuery.name" placeholder="权限名" />
      </el-form-item>
      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号" >
        <template slot-scope="scope">
          {{scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="权限名" >
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="权限值" >
        <template slot-scope="scope">
          {{ scope.row.permissionValue }}
        </template>
      </el-table-column>
      <el-table-column label="路径" >
        <template slot-scope="scope">
          {{ scope.row.path }}
        </template>
      </el-table-column>
      <el-table-column label="组件" >
        <template slot-scope="scope">
          {{ scope.row.component }}
        </template>
      </el-table-column>
      <el-table-column label="图标" >
        <template slot-scope="scope">
          {{ scope.row.icon }}
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import permission from "@/api/permission/permission.js";
export default {
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
      permissionQuery: {},
      permissionEntity: {},
    };
  },

  created() {
    this.getList();
  },
  methods: {
    getList() { permission
        .getPermissionListPage(
          this.permissionQuery
        )
        .then((response) => {
          this.tableData = response.data.rows;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    resetData() {
      this.permissionQuery = {};
      this.getList();
    },
    handleSelectionChange(val) {},

  },
};
</script>
<style lang="scss" scoped>
</style>