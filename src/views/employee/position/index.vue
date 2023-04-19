<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="positionQuery.name" placeholder="职位名称" />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="positionQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="positionQuery.endTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>

      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="() => save()"
        >添加</el-button
        >
        <el-button
          type="danger"
          icon="el-icon-delete"
          @click="deleteBatchPosition()"
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
      <el-table-column label="职位名称" width="300">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="300">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="300">
        <template slot-scope="scope">
          {{ scope.row.gmtModified }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getEmployeeDetails(scope.row.id)"
            >员工详情</el-button
          >
          <el-button
            v-if="
              scope.row.name !== '超市经理' && scope.row.name !== '仓库经理'
            "
            size="mini"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-button
            size="mini"
            type="danger"
            @click="deletePositionById(scope.row.id)"
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
    <el-dialog title="职位" :visible.sync="dialogFormVisible">
      <el-form :model="positionEntity">
        <el-form-item label="职位名称" :label-width="formLabelWidth">
          <el-input v-model="positionEntity.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="员工详情" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="employeeQuery.name" placeholder="员工姓名" />
        </el-form-item>

        <el-button type="primary" icon="el-icon-search" @click="getInnerList()"
          >查询</el-button
        >
        <el-button type="default" @click="innerResetData()">清空</el-button>
      </el-form>
      <el-table :data="gridData">
        <el-table-column width="100" label="员工工号">
          <template slot-scope="scope">
            {{ scope.row.workNumber }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="员工姓名">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="门店地址">
          <template slot-scope="scope">
            {{ scope.row.warehouseId == 0 ? scope.row.storeRegion : "" }}
          </template>
        </el-table-column>
        <el-table-column label="仓库地址">
          <template slot-scope="scope">
            {{ scope.row.storeId == 0 ? scope.row.warehouseRegion : "" }}
          </template>
        </el-table-column>
        <el-table-column width="80" label="员工状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status == 1" type="success">在职</el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="warning"
              >停职</el-tag
            >
            <el-tag v-else type="danger">离职</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        @size-change="innerHandleSizeChange"
        @current-change="getInnerList"
        :current-page="innerCurrentPage"
        :page-sizes="[1, 2, 3, 4, 5, 10]"
        :page-size="innerSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="innerTotal"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import position from "@/api/employee/position";
import employee from "@/api/employee/employee";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      innerSize: 5,
      innerCurrentPage: 1,
      innerTotal: 0,
      tableData: [],
      gridData: [],
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogTableVisible: false,
      positionQuery: {},
      positionEntity: {},
      employeeQuery: {},
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      position
        .getPositionListPage(this.currentPage, this.size, this.positionQuery)
        .then((response) => {
          //response接口返回的数据
          this.tableData = response.data.rows;
          // debugger;
          this.total = response.data.total;
        }) //请求成功
        .catch((error) => {
          console.error(error);
        }); //请求失败;
    },

    resetData() {
      this.positionQuery = {};
      this.getList();
    },

    save() {
      this.positionEntity = {};
      this.dialogFormVisible = true;
    },

    deleteBatchPosition() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的职位",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该职位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          position.deleteBatchPosition(this.ids).then((response) => {
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

    getEmployeeDetails(id) {
      this.positionEntity.id = id;
      this.getInnerList();
      this.dialogTableVisible = true;
    },

    handleEdit(row) {
      this.positionEntity = row;
      this.dialogFormVisible = true;
    },

    deletePositionById(id) {
      this.$confirm("此操作将永久删除该职位, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          position.deletePositionById(id).then((response) => {
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
      this.positionEntity = {};
      this.dialogFormVisible = false;
      this.getList();
    },

    saveOrUpdate() {
      if (
        this.positionEntity.name == null ||
        this.positionEntity.name.trim() == ""
      ) {
        this.$message({
          message: "职位名称不能为空",
          type: "warning",
        });
        return;
      }
      position.isExistPositionName(this.positionEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            message: "职位名称已存在",
            type: "warning",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.positionEntity.id != null) {
          position.updatePosition(this.positionEntity).then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getList();
          });
        } else {
          position.savePosition(this.positionEntity).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getList();
          });
        }
      });
    },

    getInnerList(innerCurrentPage = 1) {
      this.innerCurrentPage = innerCurrentPage;
      employee
        .getEmployeeListPageByPositionId(
          this.innerCurrentPage,
          this.innerSize,
          this.employeeQuery,
          this.positionEntity.id
        )
        .then((response) => {
          //response接口返回的数据
          this.gridData = response.data.rows;
          // debugger;
          this.innerTotal = response.data.total;
        }) //请求成功
        .catch((error) => {
          console.error(error);
        }); //请求失败;
    },

    innerResetData() {
      this.employeeQuery = {};
      this.getInnerList();
    },

    innerHandleSizeChange(val) {
      this.innerSize = val;
      this.getInnerList();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>