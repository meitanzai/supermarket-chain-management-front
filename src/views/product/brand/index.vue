<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="brandQuery.name" placeholder="品牌名" />
      </el-form-item>

      <el-form-item>
        <el-select
          style="width: 150px"
          v-model="brandQuery.isShow"
          clearable
          filterable
          placeholder="启用状态"
        >
          <el-option :value="1" label="启用" />
          <el-option :value="0" label="禁用" />
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="brandQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="brandQuery.endTime"
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
      <el-button type="danger" icon="el-icon-delete" @click="deleteBatchBrand()"
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
      <el-table-column label="序号" width="200">
        <template slot-scope="scope">
          {{ (currentPage - 1) * size + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="280">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="340">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="是否显示" width="280">
        <template slot-scope="scope">
          <el-switch
            style="display: block"
            v-model="scope.row.isShow"
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteBrandById(scope.row.id)"
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
    <el-dialog title="品牌" :visible.sync="dialogFormVisible">
      <el-form :model="brandEntity">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="brandEntity.name" autocomplete="off"></el-input>
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
import brand from "@/api/product/brand.js";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      multipleSelection: [],
      ids: [],
      brandQuery: {},
      brandEntity: {},
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      brand
        .getBrandListPage(this.currentPage, this.size, this.brandQuery)
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    resetData() {
      this.brandQuery = {};
      this.getList();
    },

    save() {
      this.brandEntity = {};
      this.dialogFormVisible = true;
    },

    deleteBatchBrand() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的品牌",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          brand.deleteBatchBrand(this.ids).then((response) => {
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
      brand
        .updateBrandById(row)
        .then((response) => {
          this.brandEntity = {};
        })
        .catch((error) => {
          console.error(error);
        });
    },

    handleEdit(row) {
      this.brandEntity = row;
      this.dialogFormVisible = true;
    },

    deleteBrandById(id) {
      this.$confirm("此操作将永久删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          brand.deleteBrandById(id).then((response) => {
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
      this.brandEntity = {};
      this.getList();
      this.dialogFormVisible = false;
    },

    saveOrUpdate() {
      if (this.brandEntity.name == null || this.brandEntity.name.trim() == "") {
        this.$message({
          type: "warning",
          message: "品牌名称不能为空",
        });
        return;
      }
      brand.isExistBrandName(this.brandEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "品牌名称已存在",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.brandEntity.id != null) {
          brand.updateBrandById(this.brandEntity).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.brandEntity = {};
            this.getList();
          });
        } else {
          brand.saveBrand(this.brandEntity).then((response) => {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.brandEntity = {};
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