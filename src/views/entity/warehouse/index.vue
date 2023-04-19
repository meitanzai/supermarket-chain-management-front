<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-cascader
          placeholder="地址"
          ref="cascader1"
          v-model="regionQueryIds"
          :options="regionOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="regionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="warehouseQuery.managerId"
          clearable
          filterable
          placeholder="仓库经理"
        >
          <el-option
            v-for="item in managers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="warehouseQuery.tel" placeholder="门店电话" />
      </el-form-item>
      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-button type="primary" icon="el-icon-plus" @click="() => save()"
      >添加</el-button
    >
    <el-table
      ref="singleTable"
      :data="tableData"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          {{ (currentPage - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="仓库地址" width="400">
        <template slot-scope="scope">
          {{ scope.row.regionName }}
        </template>
      </el-table-column>
      <el-table-column label="仓库经理" width="200">
        <template slot-scope="scope">
          {{ scope.row.managerName }}
        </template>
      </el-table-column>
      <el-table-column label="仓库电话" width="200">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="租金" width="160">
        <template slot-scope="scope">
          {{ scope.row.rent + "￥" }}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getEmployeeDetails(scope.row.id)"
            >员工表</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteWarehouseById(scope.row.id)"
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
    <el-dialog title="仓库" :visible.sync="dialogFormVisible">
      <el-form :model="warehouseEntity">
        <el-form-item label="仓库地址" :label-width="formLabelWidth">
          <el-cascader
            ref="cascader2"
            v-model="regionEntityIds"
            :options="regionOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="regionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="仓库经理" :label-width="formLabelWidth">
          <el-select v-model="warehouseEntity.managerId" clearable filterable>
            <el-option
              v-for="item in managers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.status != 1"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="仓库电话" :label-width="formLabelWidth">
          <el-input v-model="warehouseEntity.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="租金" :label-width="formLabelWidth">
          <el-input v-model="warehouseEntity.rent" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="员工表" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item style="width: 100px">
          <el-input v-model="employeeQuery.workNumber" placeholder="员工工号" />
        </el-form-item>
        <el-form-item label="入职时间">
          <el-date-picker
            style="width: 180px"
            v-model="employeeQuery.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 180px"
            v-model="employeeQuery.endTime"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="success" icon="el-icon-search" @click="getInnerList()"
          >查询</el-button
        >
        <el-button type="default" @click="innerResetData()">清空</el-button>
      </el-form>
      <el-table :data="gridData">
        <el-table-column width="170" label="员工工号">
          <template slot-scope="scope">
            {{ scope.row.workNumber }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="员工姓名">
          <template slot-scope="scope">
            {{ scope.row.name }}
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
        <el-table-column label="入职时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate }}
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="180">
          <template slot-scope="scope">
            {{ scope.row.gmtModified }}
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
import warehouse from "@/api/entity/warehouse";
import region from "@/api/entity/region";
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
      dialogFormVisible: false,
      dialogTableVisible: false,
      formLabelWidth: "120px",
      warehouseQuery: {},
      warehouseEntity: {},
      employeeQuery: {},
      regionQueryIds: [],
      regionEntityIds: [],
      managers: [],
      regionOptions: [],
    };
  },

  created() {
    this.getList();
    this.getRegionList();
    this.getWarehouseManagerList();
  },
  methods: {
    regionQueryHandleChange(value) {
      this.warehouseQuery.regionId = value[value.length - 1];
    },

    getList(currentPage = 1) {
      this.currentPage = currentPage;
      warehouse
        .getWarehouseListPage(this.currentPage, this.size, this.warehouseQuery)
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
      this.warehouseQuery = {};
      this.regionQueryIds = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },

    save() {
      this.warehouseEntity = {};
      this.regionEntityIds = [];
      this.dialogFormVisible = true;
    },

    getEmployeeDetails(id) {
      this.warehouseEntity.id = id;
      this.getInnerList();
      this.dialogTableVisible = true;
    },

    handleEdit(row) {
      this.warehouseEntity = row;
      warehouse
        .getWarehouseRegionIdsByRegionId(row.regionId)
        .then((response) => {
          this.regionEntityIds = response.data.items;
        });
      warehouse
        .getManagerIdByManagerId(this.warehouseEntity.managerId)
        .then((response) => {
          this.warehouseEntity.managerId = response.data.item;
        });
      this.dialogFormVisible = true;
    },

    deleteWarehouseById(id) {
      this.$confirm("此操作将永久删除该仓库, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          warehouse.deleteWarehouseById(id).then((response) => {
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

    regionEntityHandleChange(value) {
      this.warehouseEntity.regionId = value[value.length - 1];
    },

    cancel() {
      this.dialogFormVisible = false;
      this.regionEntityIds = [];
      this.warehouseEntity = {};
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },

    saveOrUpdate() {
      if (
        this.warehouseEntity.tel == null ||
        this.warehouseEntity.tel.trim() == ""
      ) {
        this.$message({
          message: "请输入仓库电话",
          type: "warning",
        });
        return;
      }
      warehouse.isExistWarehouseRegion(this.warehouseEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            message: "该区域已存在仓库",
            type: "warning",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.warehouseEntity.id != null) {
          warehouse
            .updateWarehouseById(this.warehouseEntity)
            .then((response) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.warehouseEntity = {};
              this.regionEntityIds = [];
              this.getList();
              this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
            });
        } else {
          warehouse.saveWarehouse(this.warehouseEntity).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.warehouseEntity = {};
            this.regionEntityIds = [];
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        }
      });
    },

    getInnerList(innerCurrentPage = 1) {
      this.innerCurrentPage = innerCurrentPage;
      employee
        .getEmployeeListPageByWarehouseId(
          this.innerCurrentPage,
          this.innerSize,
          this.employeeQuery,
          this.warehouseEntity.id
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

    getRegionList() {
      region.getRegionList().then((response) => {
        this.regionOptions = response.data.items;
      });
    },

    getWarehouseManagerList() {
      employee.getWarehouseManagerList().then((response) => {
        this.managers = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>