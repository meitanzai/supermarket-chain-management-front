<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="productQuery.name" placeholder="商品名" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请选择商品分类"
          ref="cascader1"
          v-model="categoryQueryIds"
          :options="categoryOptions"
          :props="{ value: 'id', label: 'title' }"
          @change="categoryQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-select
          v-model="productQuery.brandId"
          filterable
          clearable
          placeholder="请选择品牌"
        >
          <el-option
            v-for="item in brands"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="productQuery.sellPrice" placeholder="售价" />
      </el-form-item>
      <el-form-item>
        <el-input v-model="productQuery.promotionalPrice" placeholder="促销价" />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="productQuery.isShow"
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
          v-model="productQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="productQuery.endTime"
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
        @click="deleteBatchProduct()"
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
      <el-table-column label="商品名" width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="分类" width="150">
        <template slot-scope="scope">
          {{ scope.row.categoryName }}
        </template>
      </el-table-column>
      <el-table-column label="品牌" width="150">
        <template slot-scope="scope">
          {{ scope.row.brandName }}
        </template>
      </el-table-column>
      <el-table-column label="售价" width="100">
        <template slot-scope="scope">
          {{ scope.row.sellPrice + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="促销价" width="100">
        <template slot-scope="scope">
          {{ scope.row.promotionalPrice + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="单位" width="80">
        <template slot-scope="scope">
          {{ scope.row.unit }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="180">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="是否显示" width="150">
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
            @click="deleteProductById(scope.row.id)"
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

    <el-dialog title="商品" :visible.sync="dialogFormVisible">
      <el-form :model="productEntity">
        <el-form-item label="商品名称" :label-width="formLabelWidth">
          <el-input v-model="productEntity.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader
            ref="cascader2"
            v-model="categoryEntityIds"
            :options="categoryOptions"
            :props="{ value: 'id', label: 'title' }"
            @change="categoryEntityhandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品品牌" :label-width="formLabelWidth">
          <el-select
            v-model="productEntity.brandId"
            filterable
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.isShow === 0"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品售价" :label-width="formLabelWidth">
          <el-input
            v-model="productEntity.sellPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="商品单位" :label-width="formLabelWidth">
          <el-input v-model="productEntity.unit" autocomplete="off"></el-input>
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
import product from "@/api/product/product.js";
import brand from "@/api/product/brand.js";
import category from "@/api/product/category.js";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      formLabelWidth: "120px",
      dialogFormVisible: false,
      multipleSelection: [],
      ids: [],
      productQuery: {},
      productEntity: {},
      brands: [],
      categoryOptions: [],
      categoryQueryIds: [],
      categoryEntityIds: [],
    };
  },
  created() {
    this.getList();
    this.getBrandList();
    this.getCategoryList();
  },
  methods: {
    categoryQueryHandleChange(value) {
      this.productQuery.categoryId = value[value.length - 1];
    },

    getList(currentPage = 1) {
      this.currentPage = currentPage;
      product
        .getProductListPage(this.currentPage, this.size, this.productQuery)
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    resetData() {
      this.productQuery = {};
      this.categoryQueryIds = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },

    save() {
      this.productEntity = {};
      this.categoryEntityIds = [];
      this.dialogFormVisible = true;
    },

    deleteBatchProduct() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的商品",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          product.deleteBatchProduct(this.ids).then((response) => {
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
      product
        .updateProductById(row)
        .then((response) => {
          this.productEntity = {};
        })
        .catch((error) => {
          console.error(error);
        });
    },

    handleEdit(row) {
      this.productEntity = row;
      product
        .getCategoryIdsByCategoryId(this.productEntity.categoryId)
        .then((response) => {
          this.categoryEntityIds = response.data.items;
        });
      product
        .getBrandIdByBrandId(this.productEntity.brandId)
        .then((response) => {
          this.productEntity.brandId = response.data.item;
        });
      this.dialogFormVisible = true;
    },

    deleteProductById(id) {
      this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          product.deleteProductById(id).then((response) => {
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

    categoryEntityhandleChange(value) {
      this.productEntity.categoryId = value[value.length - 1];
    },

    cancel() {
      this.dialogFormVisible = false;
      this.categoryEntityIds = [];
      this.productEntity = {};
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },

    saveOrUpdate() {
      if (
        this.productEntity.sellPrice == null ||
        this.productEntity.sellPrice == "" ||
        this.productEntity.name == null ||
        this.productEntity.name.trim() == "" ||
        this.productEntity.unit == null ||
        this.productEntity.unit.trim() == ""
      ) {
        this.$message({
          type: "warning",
          message: "请填写完整商品信息",
        });
        return;
      }
      product.isExistProductName(this.productEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "商品名称已存在",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.productEntity.id != null) {
          product.updateProductById(this.productEntity).then((response) => {
            this.$message({
              type: "success",
              message: "修改成功!",
            });
            this.categoryEntityIds = [];
            this.ProductEntity = {};
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        } else {
          product.saveProduct(this.productEntity).then((response) => {
            this.$message({
              type: "success",
              message: "添加成功!",
            });
            this.categoryEntityIds = [];
            this.ProductEntity = {};
            this.getList();
            this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
          });
        }
      });
    },

    getCategoryList() {
      category.getAllCategoryWithTree().then((response) => {
        this.categoryOptions = response.data.items;
      });
    },

    getBrandList() {
      brand.getBrandList().then((response) => {
        this.brands = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>