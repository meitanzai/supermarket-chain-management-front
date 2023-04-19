<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="employeeQuery.name" placeholder="员工名称" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="employeeQuery.workNumber" placeholder="员工工号" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="employeeQuery.positionId"
          clearable
          filterable
          placeholder="员工职位"
        >
          <el-option
            v-for="item in positions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-cascader
          placeholder="请选择工作门店地址"
          ref="cascader1"
          v-model="storeRegionQueryIds"
          :options="storeOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="storeRegionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-cascader
          placeholder="请选择工作仓库地址"
          ref="cascader1"
          v-model="warehouseRegionQueryIds"
          :options="warehouseOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="warehouseRegionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="employeeQuery.status"
          clearable
          filterable
          placeholder="员工状态"
        >
          <el-option :value="1" label="在职" />
          <el-option :value="2" label="停职" />
          <el-option :value="3" label="离职" />
        </el-select>
      </el-form-item>
      <el-form-item label="入职时间">
        <el-date-picker
          v-model="employeeQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="employeeQuery.endTime"
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
        >添加员工</el-button
      >

      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="deleteBatchEmployee()"
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
      <el-table-column label="工号" width="150">
        <template slot-scope="scope">
          {{ scope.row.workNumber }}
        </template>
      </el-table-column>
      <el-table-column label="员工名字" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="性别" width="50">
        <template slot-scope="scope">
          {{ scope.row.sex === 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column label="年龄" width="50">
        <template slot-scope="scope">
          {{ scope.row.age }}
        </template>
      </el-table-column>
      <el-table-column label="职位名称" width="100">
        <template slot-scope="scope">
          {{ scope.row.positionName }}
        </template>
      </el-table-column>
      <el-table-column label="门店地址" width="180">
        <template slot-scope="scope">
          {{ scope.row.storeRegion }}
        </template>
      </el-table-column>
      <el-table-column label="仓库地址" width="180">
        <template slot-scope="scope">
          {{ scope.row.warehouseRegion }}
        </template>
      </el-table-column>
      <el-table-column label="入职时间" width="160">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="工资" width="80">
        <template slot-scope="scope">
          {{ scope.row.salary }}
        </template>
      </el-table-column>
      <el-table-column label="员工状态" width="80">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">在职</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="warning">停职</el-tag>
          <el-tag v-else type="danger">离职</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteEmployeeById(scope.row.id)"
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
    <el-dialog title="员工" :visible.sync="dialogFormVisible">
      <el-form :model="employeeEntity">
        <el-form-item label="员工姓名" :label-width="formLabelWidth">
          <el-input v-model="employeeEntity.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工工号" :label-width="formLabelWidth">
          <el-input
            v-model="employeeEntity.workNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工性别" :label-width="formLabelWidth">
          <el-radio-group v-model="employeeEntity.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="员工年龄" :label-width="formLabelWidth">
          <el-input v-model="employeeEntity.age" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="员工职位" :label-width="formLabelWidth">
          <el-select
            v-model="employeeEntity.positionId"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in positions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注意" :label-width="formLabelWidth">
          <el-tag type="warning">以下地址二选一</el-tag>
        </el-form-item>
        <el-form-item
          v-if="storeFlag == 1"
          label="工作门店地址"
          :label-width="formLabelWidth"
        >
          <el-cascader
            ref="cascader2"
            v-model="storeRegionEntityIds"
            :options="storeOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="storeRegionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item
          v-if="warehouseFlag == 1"
          label="工作仓库地址"
          :label-width="formLabelWidth"
        >
          <el-cascader
            ref="cascader2"
            v-model="warehouseRegionEntityIds"
            :options="warehouseOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="warehouseRegionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="工资" :label-width="formLabelWidth">
          <el-input
            v-model="employeeEntity.salary"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="员工" :label-width="formLabelWidth">
          <el-select
            v-model="employeeEntity.status"
            clearable
            filterable
            placeholder="员工状态"
          >
            <el-option :value="1" label="在职" />
            <el-option :value="2" label="停职" />
            <el-option :value="3" label="离职" />
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
import employee from "@/api/employee/employee";
import store from "@/api/entity/store";
import warehouse from "@/api/entity/warehouse";
import position from "@/api/employee/position";
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
      employeeQuery: {},
      employeeEntity: {},
      storeRegionQueryIds: [],
      storeRegionEntityIds: [],
      warehouseRegionQueryIds: [],
      warehouseRegionEntityIds: [],
      storeOptions: [],
      warehouseOptions: [],
      positions: [],
      storeFlag: 1,
      warehouseFlag: 1,
    };
  },

  created() {
    this.getList();
    this.getPositionList();
    this.getStoreRegionList();
    this.getWarehouseRegionList();
  },
  methods: {
    storeRegionQueryHandleChange(value) {
      const storeRegionId = value[value.length - 1];
      if (storeRegionId != undefined) {
        store.getStoreIdByRegionId(storeRegionId).then((response) => {
          this.employeeQuery.storeId = response.data.item;
        });
      }
    },

    warehouseRegionQueryHandleChange(value) {
      const warehouseRegionId = value[value.length - 1];
      if (warehouseRegionId != undefined) {
        warehouse
          .getWarehouseIdByRegionId(warehouseRegionId)
          .then((response) => {
            this.employeeQuery.warehouseId = response.data.item;
          });
      }
    },

    getList(currentPage = 1) {
      this.currentPage = currentPage;
      employee
        .getEmployeeListPage(this.currentPage, this.size, this.employeeQuery)
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
      this.employeeQuery = {};
      this.storeRegionQueryIds = [];
      this.warehouseRegionQueryIds = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },

    save() {
      this.employeeEntity = {};
      this.storeRegionEntityIds = [];
      this.warehouseRegionEntityIds = [];
      this.dialogFormVisible = true;
    },

    deleteBatchEmployee() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的员工",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          employee.deleteBatchEmployee(this.ids).then((response) => {
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
      this.employeeEntity = row;
      if (this.employeeEntity.storeId == 0) {
        this.storeRegionEntityIds = [];
      } else {
        store
          .getRegionIdByStoreId(this.employeeEntity.storeId)
          .then((response) => {
            if (response.data.item == null) {
              this.storeRegionEntityIds = [];
            } else {
              store
                .getStoreRegionIdsByRegionId(response.data.item)
                .then((response) => {
                  this.storeRegionEntityIds = response.data.items;
                });
            }
          });
      }
      if (this.employeeEntity.warehouseId == 0) {
        this.warehouseRegionEntityIds = [];
      } else {
        warehouse
          .getRegionIdByWarehouseId(this.employeeEntity.warehouseId)
          .then((response) => {
            if (response.data.item == null) {
              this.warehouseRegionEntityIds = [];
            } else {
              warehouse
                .getWarehouseRegionIdsByRegionId(response.data.item)
                .then((response) => {
                  this.warehouseRegionEntityIds = response.data.items;
                });
            }
          });
      }
      if (this.employeeEntity.positionId == 0) {
        this.employeeEntity.positionId = "";
      } else {
        position
          .getPositionIdById(this.employeeEntity.positionId)
          .then((response) => {
            this.employeeEntity.positionId = response.data.item;
          });
      }
      this.dialogFormVisible = true;
    },

    deleteEmployeeById(id) {
      this.$confirm("此操作将永久删除该员工, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          employee.deleteEmployeeById(id).then((response) => {
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
      this.storeFlag = 1;
      this.warehouseFlag = 1;
      this.getList();
    },

    storeRegionEntityHandleChange(value) {
      const storeRegionId = value[value.length - 1];
      if (storeRegionId != undefined) {
        store.getStoreIdByRegionId(storeRegionId).then((response) => {
          this.employeeEntity.storeId = response.data.item;
        });
      }
      this.warehouseFlag = 0;
    },

    warehouseRegionEntityHandleChange(value) {
      const warehouseRegionId = value[value.length - 1];
      if (warehouseRegionId != undefined) {
        warehouse
          .getWarehouseIdByRegionId(warehouseRegionId)
          .then((response) => {
            this.employeeEntity.warehouseId = response.data.item;
          });
      }
      this.storeFlag = 0;
    },

    cancel() {
      this.dialogFormVisible = false;
      this.storeRegionEntityIds = [];
      this.warehouseRegionEntityIds = [];
      this.employeeEntity = {};
      this.storeFlag = 1;
      this.warehouseFlag = 1;
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },

    saveOrUpdate() {
      if (
        this.employeeEntity.workNumber == null ||
        this.employeeEntity.workNumber.trim() == "" ||
        this.employeeEntity.name == null ||
        this.employeeEntity.name.trim() == "" ||
        this.employeeEntity.age == null || 
        this.employeeEntity.age== "" ||
        this.employeeEntity.salary == null ||
        this.employeeEntity.salary == ""
      ) {
        this.$message({
          type: "warning",
          message: "请填写完整信息",
        });
        return;
      }
      employee.isExistWorkNumber(this.employeeEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "工号已存在",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.employeeEntity.id != null) {
          employee.updateEmployeeById(this.employeeEntity).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.storeRegionEntityIds = [];
            this.warehouseRegionEntityIds = [];
            this.employeeEntity = {};
            this.storeFlag = 1;
            this.warehouseFlag = 1;
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        } else {
          employee.saveEmployee(this.employeeEntity).then((response) => {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.storeRegionEntityIds = [];
            this.warehouseRegionEntityIds = [];
            this.employeeEntity = {};
            this.storeFlag = 1;
            this.warehouseFlag = 1;
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        }
      });
    },

    getStoreRegionList() {
      store.getStoreRegionList().then((response) => {
        this.storeOptions = response.data.items;
      });
    },

    getWarehouseRegionList() {
      warehouse.getWarehouseRegionList().then((response) => {
        this.warehouseOptions = response.data.items;
      });
    },

    getPositionList() {
      position.getPositionList().then((response) => {
        this.positions = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>