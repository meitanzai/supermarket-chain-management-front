<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="supplierQuery.name" placeholder="供应商" />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="supplierQuery.contactPerson"
          placeholder="供应商联系人"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="supplierQuery.tel"
          placeholder="供货商电话"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请选择供货商地址"
          ref="cascader1"
          v-model="supplierRegionQueryIds"
          :options="regionOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="supplierRegionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          style="width: 180px"
          v-model="supplierQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="width: 180px"
          v-model="supplierQuery.endTime"
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
    </el-form>
    <el-button type="primary" icon="el-icon-plus" @click="() => save()"
      >添加</el-button
    >
    <el-button
      type="danger"
      icon="el-icon-delete"
      @click="deleteBatchSupplier()"
      >批量删除</el-button
    >
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
      <el-table-column label="供货商" width="100">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="供货商联系人" width="110">
        <template slot-scope="scope">
          {{ scope.row.contactPerson }}
        </template>
      </el-table-column>
      <el-table-column label="供货商电话" width="120">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="供货商地址" width="400">
        <template slot-scope="scope">
          {{ scope.row.regionName }}
        </template>
      </el-table-column>
      <el-table-column label="是否使用" width="150">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.isUse"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus(scope.row)"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="开启"
            inactive-text="禁用"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteSupplierById(scope.row.id)"
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

    <el-dialog title="供货商" :visible.sync="dialogFormVisible">
      <el-form :model="supplierEntity">
        <el-form-item label="供货商" :label-width="formLabelWidth">
          <el-input v-model="supplierEntity.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供货商联系人" :label-width="formLabelWidth">
          <el-input
            v-model="supplierEntity.contactPerson"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="供货商电话" :label-width="formLabelWidth">
          <el-input v-model="supplierEntity.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="供货商地址" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请选择供货商地址"
            ref="cascader2"
            v-model="supplierRegionEntityIds"
            :options="regionOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="supplierRegionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
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
import supplier from "@/api/supply/supplier.js";
import region from "@/api/entity/region.js";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      tableData: [],
      supplierQuery: {},
      supplierEntity: {},
      supplierRegionQueryIds: [],
      supplierRegionEntityIds: [],
      regionOptions: [],
    };
  },

  created() {
    this.getList();
    this.getRegionList();
  },
  methods: {
    supplierRegionQueryHandleChange(value) {
      this.supplierQuery.regionId = value[value.length - 1];
    },
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      supplier
        .getSupplierListPage(this.currentPage, this.size, this.supplierQuery)
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
      this.supplierQuery = {};
      this.supplierRegionQueryIds = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },
    save() {
      this.supplierEntity = {};
      this.supplierRegionEntityIds = [];
      this.dialogFormVisible = true;
    },
    deleteBatchSupplier() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的供货商",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该供货商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          supplier.deleteBatchSupplier(this.ids).then((response) => {
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
    changeStatus(row) {
      supplier
        .updateSupplierById(row)
        .then((response) => {
          this.supplierEntity = {};
        })
        .catch((error) => {
          console.error(error);
        });
    },
    handleEdit(row) {
      this.supplierEntity = row;
      supplier
        .getSupplierRegionIdsByRegionId(this.supplierEntity.regionId)
        .then((response) => {
          this.supplierRegionEntityIds = response.data.items;
        });
      this.dialogFormVisible = true;
    },
    deleteSupplierById(id) {
      this.$confirm("此操作将永久删除该供货商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          supplier.deleteSupplierById(id).then((response) => {
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
    supplierRegionEntityHandleChange(value) {
      this.supplierEntity.regionId = value[value.length - 1];
    },
    cancel() {
      this.dialogFormVisible = false;
      this.supplierRegionEntityIds = [];
      this.supplierEntity = {};
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },
    saveOrUpdate() {
      if (
        this.supplierEntity.name == null ||
        this.supplierEntity.name.trim() == "" ||
        this.supplierEntity.contactPerson == null ||
        this.supplierEntity.contactPerson.trim() == "" ||
        this.supplierEntity.tel == null ||
        this.supplierEntity.tel.trim() == ""
      ) {
        this.$message({
          type: "info",
          message: "请填写完整信息",
        });
        return;
      }
      supplier.isExistSupplierNameAndRegion(this.supplierEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "该供货商已存在",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.supplierEntity.id == null) {
          supplier.saveSupplier(this.supplierEntity).then((response) => {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        } else {
          supplier.updateSupplierById(this.supplierEntity).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        }
      });
    },
    getRegionList() {
      region.getRegionList().then((response) => {
        this.regionOptions = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>