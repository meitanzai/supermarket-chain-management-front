<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-cascader
          placeholder="请选择仓库地址"
          ref="cascader1"
          v-model="warehouseRegionQueryIds"
          :options="regionOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="warehouseRegionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-input v-model="outstockQuery.outstockCount" placeholder="出库数" />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请先选择商品分类"
          ref="cascader1"
          v-model="categoryQueryIds"
          :options="categoryOptions"
          :props="{ value: 'id', label: 'title' }"
          @change="categoryQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="brandQueryId"
          filterable
          clearable
          placeholder="再选择品牌"
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
      <el-button type="success" icon="el-icon-search" @click="getProductList()"
        >商品列</el-button
      >
      <el-form-item :label-width="formLabelWidth">
        <el-select
          v-model="outstockQuery.productId"
          filterable
          clearable
          placeholder="最后选择商品"
        >
          <el-option
            v-for="item in products"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          v-model="outstockQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="outstockQuery.endTime"
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
    </el-form>
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
      <el-table-column label="仓库" width="400" >
        <template slot-scope="scope">
          {{ scope.row.warehouseRegion }}
        </template>
      </el-table-column>
      <el-table-column label="商品" >
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="出库数量" width="150">
        <template slot-scope="scope">
          {{ scope.row.outstockCount }}
        </template>
      </el-table-column>
      <el-table-column label="状态"  width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0">调货出库</el-tag>
          <el-tag v-else-if="scope.row.type == 1" type="success"
            >出售出库</el-tag
          >
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
            @click="deleteOutstock(scope.row.id)"
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
    <el-dialog title="出库" :visible.sync="dialogFormVisible">
      <el-form :model="outstockEntity">
        <el-form-item label="仓库" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请选择仓库地址"
            ref="cascader2"
            v-model="warehouseRegionEntityIds"
            :options="regionOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="warehouseRegionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请选择商品分类"
            ref="cascader2"
            v-model="categoryEntityIds"
            :options="categoryOptions"
            :props="{ value: 'id', label: 'title' }"
            @change="categoryEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="品牌" :label-width="formLabelWidth">
          <el-select
            v-model="brandEntityId"
            filterable
            clearable
            placeholder="再选择品牌"
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
        <el-form-item :label-width="formLabelWidth">
          <el-button
            type="success"
            icon="el-icon-search"
            @click="getProductEntityList()"
            >获得商品名</el-button
          >
        </el-form-item>
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select
            v-model="outstockEntity.productId"
            filterable
            clearable
            placeholder="最后选择商品"
          >
            <el-option
              v-for="item in products"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" :label-width="formLabelWidth">
          <el-select
            v-model="outstockEntity.type"
            clearable
            filterable
            placeholder="请选择状态"
          >
            <el-option :value="1" label="出售出库" />
            <el-option :value="0" label="调货出库" />
          </el-select>
        </el-form-item>
        <el-form-item label="出库数量" :label-width="formLabelWidth">
          <el-input
            placeholder="请输入出库数量"
            v-model="outstockEntity.outstockCount"
            autocomplete="off"
          ></el-input>
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
import outstock from "@/api/inventory/outstock.js";
import product from "@/api/product/product";
import brand from "@/api/product/brand";
import category from "@/api/product/category";
import warehouse from "@/api/entity/warehouse";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      outstockQuery: {},
      outstockEntity: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
      warehouseRegionQueryIds: [],
      warehouseRegionEntityIds: [],
      regionOptions: [],
      categoryQueryId: "",
      categoryQueryIds: [],
      categoryEntityIds: [],
      categoryOptions: [],
      brandQueryId: "",
      brandEntityId: "",
      brands: [],
      products: [],
    };
  },

  created() {
    this.getList();
    this.getWarehouseRegionList();
    this.getBrandList();
    this.getCategoryList();
  },
  methods: {
    warehouseRegionQueryHandleChange(value) {
      const regionId = value[value.length - 1];
      if (regionId != undefined) {
        outstock.getwarehouseIdByRegionId(regionId).then((response) => {
          this.outstockQuery.warehouseId = response.data.item;
        });
      }
    },
    categoryQueryHandleChange(value) {
      this.categoryQueryId = value[value.length - 1];
    },
    getProductList() {
      if (this.brandQueryId == "" || this.categoryQueryId == "") {
        return;
      }
      product
        .getProductListByBrandIdAndCategoryId(
          this.brandQueryId,
          this.categoryQueryId
        )
        .then((response) => {
          this.products = response.data.items;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      outstock
        .getOutstockListPage(this.currentPage, this.size, this.outstockQuery)
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
      this.outstockQuery = {};
      this.warehouseRegionQueryIds = [];
      this.categoryQueryIds = [];
      this.brandQueryId = "";
      this.categoryQueryId = "";
      this.products = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = [];
    },
    save() {
      this.outstockEntity = {};
      this.warehouseRegionEntityIds = [];
      this.categoryEntityIds = [];
      this.brandEntityId = "";
      this.categoryQueryId = "";
      this.products = [];
      this.dialogFormVisible = true;
    },

    handleEdit(row) {
      this.outstockEntity = row;
      outstock
        .getOutstockRegionIds(this.outstockEntity.warehouseId)
        .then((response) => {
          this.warehouseRegionEntityIds = response.data.items;
        });
      product
        .getProductIdById(this.outstockEntity.productId)
        .then((response) => {
          if (response.data.item == null) {
            this.outstockEntity.productId = response.data.item;
            this.dialogFormVisible = true;
            return;
          }
          product.getCategoryIdById(response.data.item).then((resp) => {
            this.categoryQueryId = resp.data.item;
            if (this.categoryQueryId == null) {
              this.outstockEntity.productId = "";
              this.dialogFormVisible = true;
              return;
            }
            product
              .getCategoryIdsByCategoryId(this.categoryQueryId)
              .then((resp) => {
                this.categoryEntityIds = resp.data.items;
              });
            product.getBrandIdById(response.data.item).then((resp) => {
              this.brandEntityId = resp.data.item;
              if (this.brandEntityId == null) {
                this.outstockEntity.productId = "";
                this.dialogFormVisible = true;
                return;
              } else {
                product
                  .getProductListByBrandIdAndCategoryId(
                    this.brandEntityId,
                    this.categoryQueryId
                  )
                  .then((resp) => {
                    this.products = resp.data.items;
                    this.dialogFormVisible = true;
                  });
              }
            });
          });
        });
      this.dialogFormVisible = true;
    },
    deleteOutstock(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          outstock.deleteOutstockById(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
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
    categoryEntityHandleChange(value) {
      this.categoryQueryId = value[value.length - 1];
    },
    getProductEntityList() {
      if (this.brandEntityId == "" || this.categoryQueryId == "") {
        return;
      }
      product
        .getProductListByBrandIdAndCategoryId(
          this.brandEntityId,
          this.categoryQueryId
        )
        .then((response) => {
          this.products = response.data.items;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    warehouseRegionEntityHandleChange(value) {
      const regionId = value[value.length - 1];
      if (regionId != undefined) {
        outstock.getWarehouseIdByRegionId(regionId).then((response) => {
          this.outstockEntity.warehouseId = response.data.item;
        });
      }
    },
    cancel() {
      this.warehouseRegionEntityIds = [];
      this.categoryEntityIds = [];
      this.brandEntityId = "";
      this.categoryQueryId = "";
      this.outstockEntity = {};
      this.products = [];
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = [];
      this.dialogFormVisible = false;
    },
    saveOrUpdate() {
      if (
        this.outstockEntity.productId == "" ||
        this.outstockEntity.productId == null ||
        this.outstockEntity.outstockCount == "" ||
        this.outstockEntity.outstockCount == null
      ) {
        this.$message({
          type: "warning",
          message: "请填写完整信息!",
        });
        return;
      }
      this.dialogFormVisible = false;
      if (this.outstockEntity.id) {
        outstock.updateOutstock(this.outstockEntity).then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.getList();
          this.dialogFormVisible = false;
          this.$refs.cascader2.$refs.panel.activePath = [];
        });
      } else {
        outstock.saveOutstock(this.outstockEntity).then((response) => {
          this.$message({
            type: "success",
            message: "添加成功!",
          });

          this.getList();
          this.dialogFormVisible = false;
          this.$refs.cascader2.$refs.panel.activePath = [];
        });
      }
    },
    getWarehouseRegionList() {
      warehouse.warehouseRegionAll().then((response) => {
        this.regionOptions = response.data.items;
      });
    },
    getBrandList() {
      brand.getBrandList().then((response) => {
        this.brands = response.data.items;
      });
    },
    getCategoryList() {
      category.getAllCategoryWithTree().then((response) => {
        this.categoryOptions = response.data.items;
      });
    },
    handleSelectionChange(val) {},
  },
};
</script>
<style lang="scss" scoped>
</style>