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
        <el-input v-model="storeQuery.telephone" placeholder="门店电话" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="storeQuery.managerId"
          clearable
          filterable
          placeholder="门店经理"
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
        <el-select
          v-model="storeQuery.status"
          filterable
          clearable
          placeholder="门店状态"
        >
          <el-option :value="1" label="营业" />
          <el-option :value="2" label="装修" />
          <el-option :value="3" label="关闭" />
        </el-select>
      </el-form-item>

      <el-button type="success" icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
      <el-button type="primary" icon="el-icon-plus" @click="() => save()"
        >添加</el-button
      >
      <el-button type="danger" icon="el-icon-delete" @click="deleteBatchStore()"
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
      <el-table-column label="序号" width="100">
        <template slot-scope="scope">
          {{ (currentPage - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="门店地址" width="300">
        <template slot-scope="scope">
          {{ scope.row.regionName }}
        </template>
      </el-table-column>
      <el-table-column label="门店电话" width="150">
        <template slot-scope="scope">
          {{ scope.row.telephone }}
        </template>
      </el-table-column>
      <el-table-column label="门店经理" width="120">
        <template slot-scope="scope">
          {{ scope.row.managerName }}
        </template>
      </el-table-column>
      <el-table-column label="门店面积" width="120">
        <template slot-scope="scope">
          {{ scope.row.area + "m²" }}
        </template>
      </el-table-column>
      <el-table-column label="租金" width="120">
        <template slot-scope="scope">
          {{ scope.row.rent + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="门店状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">营业</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="warning">装修</el-tag>
          <el-tag v-else type="danger">关闭</el-tag>
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
            @click="deleteStoreById(scope.row.id)"
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

    <el-dialog title="门店" :visible.sync="dialogFormVisible">
      <el-form :model="storeEntity">
        <el-form-item label="门店地址" :label-width="formLabelWidth">
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
        <el-form-item label="门店电话" :label-width="formLabelWidth">
          <el-input
            v-model="storeEntity.telephone"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="门店经理" :label-width="formLabelWidth">
          <el-select v-model="storeEntity.managerId" clearable filterable>
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
        <el-form-item label="门店面积" :label-width="formLabelWidth">
          <el-input v-model="storeEntity.area" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="租金" :label-width="formLabelWidth">
          <el-input v-model="storeEntity.rent" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="门店状态" :label-width="formLabelWidth">
          <el-select
            v-model="storeEntity.status"
            clearable
            filterable
            placeholder="门店状态"
          >
            <el-option :value="1" label="营业" />
            <el-option :value="2" label="装修" />
            <el-option :value="3" label="关闭" />
          </el-select>
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
import store from "@/api/entity/store.js";
import region from "@/api/entity/region.js";
import employee from "@/api/employee/employee.js";
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
      dialogTableVisible: false,
      formLabelWidth: "120px",
      storeQuery: {},
      storeEntity: {},
      regionOptions: [],
      regionQueryIds: [],
      regionEntityIds: [],
      managers: [],
      employeeQuery: {},
    };
  },
  created() {
    this.getList();
    this.getRegionList();
    this.getStoreManagerList();
  },

  methods: {
    regionQueryHandleChange(value) {
      this.storeQuery.regionId = value[value.length - 1];
    },

    getList(currentPage = 1) {
      this.currentPage = currentPage;
      store
        .getStoreListPage(this.currentPage, this.size, this.storeQuery)
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
      this.storeQuery = {};
      this.regionQueryIds = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },

    save() {
      this.storeEntity = {};
      this.regionEntityIds = [];
      this.dialogFormVisible = true;
    },

    deleteBatchStore() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的门店",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          store.deleteBatchStore(this.ids).then((response) => {
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
      this.storeEntity.id = id;
      this.getInnerList();
      this.dialogTableVisible = true;
    },

    handleEdit(row) {
      this.storeEntity = row;
      store
        .getStoreRegionIdsByRegionId(this.storeEntity.regionId)
        .then((response) => {
          this.regionEntityIds = response.data.items;
        });
      store
        .getManagerIdByManagerId(this.storeEntity.managerId)
        .then((response) => {
          this.storeEntity.managerId = response.data.item;
        });
      this.dialogFormVisible = true;
    },

    deleteStoreById(id) {
      this.$confirm("此操作将永久删除该门店, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          store.deleteStoreById(id).then((response) => {
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
      this.storeEntity.regionId = value[value.length - 1];
    },

    cancel() {
      this.dialogFormVisible = false;
      this.regionEntityIds = [];
      this.storeEntity = {};
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },

    saveOrUpdate() {
      if (
        this.storeEntity.telephone == null ||
        this.storeEntity.telephone.trim() == "" ||
        this.storeEntity.area == null ||
        this.storeEntity.area == ""
      ) {
        this.$message({
          message: "请填写完整信息或面积不为数字",
          type: "warning",
        });
        return;
      }
      store.isExistStoreRegion(this.storeEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            message: "该区域已存在门店",
            type: "warning",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.storeEntity.id != null) {
          store.updateStoreById(this.storeEntity).then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.regionEntityIds = [];
            this.storeEntity = {};
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        } else {
          store.saveStore(this.storeEntity).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.regionEntityIds = [];
            this.storeEntity = {};
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        }
      });
    },

    getInnerList(innerCurrentPage = 1) {
      this.innerCurrentPage = innerCurrentPage;
      employee
        .getEmployeeListPageByStoreId(
          this.innerCurrentPage,
          this.innerSize,
          this.employeeQuery,
          this.storeEntity.id
        )
        .then((response) => {
          this.gridData = response.data.rows;
          this.innerTotal = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
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

    getStoreManagerList() {
      employee.getStoreManagerList().then((response) => {
        this.managers = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>