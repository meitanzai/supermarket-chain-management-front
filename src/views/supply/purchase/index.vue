<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item style="width: 180px">
        <el-input v-model="purchaseQuery.purchaseNumber" placeholder="进货号" />
      </el-form-item>
      <el-form-item style="width: 150px">
        <el-input v-model="purchaseQuery.productName" placeholder="商品名称" />
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 150px"
          v-model="purchaseQuery.supplierId"
          filterable
          clearable
          placeholder="请选择供应商"
        >
          <el-option
            v-for="item in suppliers"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="purchaseQuery.totalPrice"
          placeholder="进货总价"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请先选择商品分类"
          ref="cascader1"
          v-model="categoryQueryIds"
          :options="categoryQueryOptions"
          :props="{ value: 'id', label: 'title' }"
          @change="categoryQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-select
          style="width: 150px"
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
      <el-button type="success" icon="el-icon-search" @click="getProductList()">商品列</el-button>
      <el-form-item :label-width="formLabelWidth">
        <el-select
          style="width: 170px"
          v-model="purchaseQuery.productId"
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
      <el-form-item label="进货时间">
        <el-date-picker
          style="width: 216px"
          v-model="purchaseQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
        style="width: 216px"
          v-model="purchaseQuery.endTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item label="保质期">
        <el-date-picker
        style="width: 216px"
          v-model="purchaseQuery.shelfLifeStart"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item >
        <el-date-picker
        style="width: 216px"
          v-model="purchaseQuery.shelfLifeEnd"
          type="datetime"
          placeholder="选择开始时间"
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
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column label="进货号" width="180">
        <template slot-scope="scope">
          {{ scope.row.purchaseNumber }}
        </template>
      </el-table-column>
      <el-table-column label="商品" width="100">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="供货商" width="150">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="商品数量" width="80">
        <template slot-scope="scope">
          {{ scope.row.quantity }}
        </template>
      </el-table-column>
      <el-table-column label="商品进价" width="80">
        <template slot-scope="scope">
          {{ scope.row.purchasePrice + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="进货总价" width="100">
        <template slot-scope="scope">
          {{ scope.row.totalPrice + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="进货时间" width="150">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="保质期" width="150">
        <template slot-scope="scope">
          {{ scope.row.shelfLife }}
        </template>
      </el-table-column>
      <el-table-column label="保质期" width="70">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 0" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.type == 1" type="warning">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getPurchaseOrderDetails(scope.row.id)"
            >订单详情</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deletePurchaseById(scope.row.id)"
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

    <el-dialog title="进货" :visible.sync="dialogFormVisible">
      <el-form :model="purchaseEntity">
        <el-form-item label="商品分类" :label-width="formLabelWidth">
          <el-cascader
            placeholder="请先选择商品分类"
            ref="cascader2"
            v-model="categoryEntityIds"
            :options="categoryQueryOptions"
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
          <el-button type="success" icon="el-icon-search" @click="getProductEntityList()"
            >获得商品名</el-button
          >
        </el-form-item>
        <el-form-item label="商品" :label-width="formLabelWidth">
          <el-select
            v-model="purchaseEntity.productId"
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

        <el-form-item label="供货商" :label-width="formLabelWidth">
          <el-select
            v-model="purchaseEntity.supplierId"
            filterable
            clearable
            placeholder="请选择供应商"
          >
            <el-option
              v-for="item in suppliers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
              :disabled="item.isUse === 0"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="进货数量" :label-width="formLabelWidth">
          <el-input
            v-model="purchaseEntity.quantity"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="进价" :label-width="formLabelWidth">
          <el-input
            v-model="purchaseEntity.purchasePrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="进货总价" :label-width="formLabelWidth">
          <el-input
            v-model="purchaseEntity.totalPrice"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="保质期" :label-width="formLabelWidth">
          <el-date-picker
            v-model="purchaseEntity.shelfLife"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="订单支付情况" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column width="200" label="订单编号">
          <template slot-scope="scope">
            {{ scope.row.orderNumber }}
          </template>
        </el-table-column>
        <el-table-column width="200" label="支付情况">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPay == 1" type="success">已支付</el-tag>
            <el-tag v-else-if="scope.row.isPay == 2" type="danger"
              >未支付</el-tag
            >
            <el-tag v-else type="warning">已取消</el-tag>
          </template>
        </el-table-column>
        <el-table-column width="150" label="修改时间">
          <template slot-scope="scope">
            {{ scope.row.gmtModified }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import purchase from "@/api/supply/purchase.js";
import category from "@/api/product/category.js";
import brand from "@/api/product/brand";
import product from "@/api/product/product";
import supplier from "@/api/supply/supplier";
import order from "@/api/supply/order";
export default {
  data() {
    return {
      purchaseQuery: {},
      tableData: [],
      size: 12,
      currentPage: 1,
      total: 0,
      purchaseEntity: {},
      formLabelWidth: "120px",
      dialogTableVisible: false,
      dialogFormVisible: false,
      categoryQueryIds: [],
      brands: [],
      products: [],
      brandQueryId: "",
      brandEntityId: "",
      categoryQueryId: "",
      categoryQueryOptions: [],
      suppliers: [],
      categoryEntityIds: [],
      gridData: [],
    };
  },

  created() {
    this.getList();
    this.getCategoryList();
    this.getBrandList();
    this.getSupplierList();
  },

  methods: {
    categoryQueryHandleChange(value) {
      this.categoryQueryId = value[value.length - 1];
    },
    getProductList() {
      if (this.brandQeuryId == "" || this.categoryQueryId == "") {
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
      purchase
        .getPurchaseListPage(this.currentPage, this.size, this.purchaseQuery)
        .then((response) => {
          this.tableData = response.data.rows;          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    resetData() {
      this.purchaseQuery = {};
      this.brandQueryId = "";
      this.categoryQueryIds = [];
      this.categoryQueryId = "";
      this.products = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },
    save() {
      this.purchaseEntity = {};
      this.brandEntityId = "";
      this.categoryEntityIds = [];
      this.categoryQueryId = "";
      this.products = [];
      this.dialogFormVisible = true;
    },

    getPurchaseOrderDetails(purchaseId) {
      order.getPurchaseDetails(purchaseId).then((response) => {
        this.gridData[0] = response.data.item;
        this.dialogTableVisible = true;
      });
    },
    handleEdit(row) {
      this.purchaseEntity = row;
      purchase
        .getSupplierIdBySupplierId(this.purchaseEntity.supplierId)
        .then((response) => {
          this.purchaseEntity.supplierId = response.data.item;
        });
      product
        .getProductIdById(this.purchaseEntity.productId)
        .then((response) => {
          if (response.data.item == null) {
            this.purchaseEntity.productId = response.data.item;
            this.dialogFormVisible = true;
            return;
          }
          product.getCategoryIdById(response.data.item).then((resp) => {
            this.categoryQueryId = resp.data.item;
            if (this.categoryQueryId == null) {
              this.purchaseEntity.productId = "";
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
                this.purchaseEntity.productId = "";
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
      this.categoryQueryId = "";
    },

    deletePurchaseById(id) {
      order.getIsPayByPurchaseId(id).then((response) => {
        if (response.data.item != 3) {
          this.$message({
            type: "error",
            message: "该进货订单没有取消,不能删除!",
          });
          return;
        }
        this.$confirm("此操作将永久删除该进货, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() =>
            purchase.deletePurchaseById(id).then((response) => {
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
    cancel() {
      this.dialogFormVisible = false;
      this.purchaseEntity = {};
      this.brandEntityId = "";
      this.categoryEntityIds = [];
      this.categoryQueryId = "";
      this.products = [];
      this.getList();
      this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
    },
    saveOrUpdate() {
      if (
        this.purchaseEntity.productId == null ||
        this.purchaseEntity.productId == "" ||
        this.purchaseEntity.supplierId == null ||
        this.purchaseEntity.supplierId == "" ||
        this.purchaseEntity.purchasePrice == null ||
        this.purchaseEntity.purchasePrice == "" ||
        this.purchaseEntity.quantity == null ||
        this.purchaseEntity.quantity == "" ||
        this.purchaseEntity.totalPrice == null ||
        this.purchaseEntity.totalPrice == "" || 
        this.purchaseEntity.shelfLife == null 
      ) {
        this.$message({
          type: "warning",
          message: "请填写完整信息!",
        });
        return;
      }
      if (this.purchaseEntity.id == null) {
        purchase.savePurchase(this.purchaseEntity).then((response) => {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.dialogFormVisible = false;
          this.getList();
          this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
        });
      } else {
        purchase.updatePurchase(this.purchaseEntity).then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.dialogFormVisible = false;
          this.getList();
          this.$refs.cascader2.$refs.panel.activePath = []; // 清除高亮
        });
      }
    },

    getCategoryList() {
      category.getAllCategoryWithTree().then((response) => {
        this.categoryQueryOptions = response.data.items;
      });
    },

    getBrandList() {
      brand.getBrandList().then((response) => {
        this.brands = response.data.items;
      });
    },

    getSupplierList() {
      supplier.getSupplierList().then((response) => {
        this.suppliers = response.data.items;
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>