<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请选择仓库"
          ref="cascader1"
          v-model="warehouseRegionQueryIds"
          :options="warehouseQueryOptions"
          :props="{ value: 'id', label: 'name' }"
          @change="warehouseRegionQueryHandleChange"
          filterable
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="InventoryQuery.inventoryCount"
          placeholder="库存数量"
        />
      </el-form-item>
      <el-form-item :label-width="formLabelWidth">
        <el-cascader
          placeholder="请先选择商品分类"
          ref="cascader2"
          v-model="categoryQueryIds"
          :options="categoryQueryOptions"
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
      <el-button type="success" icon="el-icon-search" @click="getProductList()">商品列</el-button>
      <el-form-item :label-width="formLabelWidth">
        <el-select
          v-model="InventoryQuery.productId"
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

      <el-form-item label="修改时间">
        <el-date-picker
          v-model="InventoryQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="InventoryQuery.endTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="success"  icon="el-icon-search" @click="getList()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
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
      <el-table-column label="仓库" width="350">
        <template slot-scope="scope">
          {{ scope.row.warehouseRegion }}
        </template>
      </el-table-column>
      <el-table-column label="商品" width="100">
        <template slot-scope="scope">
          {{ scope.row.productName }}
        </template>
      </el-table-column>
      <el-table-column label="进库" width="100">
        <template slot-scope="scope">
          {{ scope.row.instockCount }}
        </template>
      </el-table-column>
      <el-table-column label="出库" width="100">
        <template slot-scope="scope">
          {{ scope.row.outstockCount }}
        </template>
      </el-table-column>
      <el-table-column label="库存" width="100">
        <template slot-scope="scope">
          {{ scope.row.inventoryCount }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="250">
        <template slot-scope="scope">
          {{ scope.row.gmtModified }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getInStockDetails(scope.row)"
            >入库详情</el-button
          >
          <el-button
            size="mini"
            type="info"
            @click="getOutStockDetails(scope.row)"
            >出库详情</el-button
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

    <el-dialog title="进库表" :visible.sync="dialogTableVisible">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item style="width: 100px">
          <el-input
            v-model="instockQuery.instockCount"
            placeholder="进库数量"
          />
        </el-form-item>
        <el-form-item label="入库时间">
          <el-date-picker
            style="width: 180px"
            v-model="instockQuery.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 180px"
            v-model="instockQuery.endTime"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="getInnerList()"
          >查询</el-button
        >
        <el-button type="default" @click="innerResetData()">清空</el-button>
      </el-form>
      <el-table :data="gridData">
        <el-table-column label="入库数量">
          <template slot-scope="scope">
            {{ scope.row.instockCount }}
          </template>
        </el-table-column>
        <el-table-column label="入库时间">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate }}
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
    <el-dialog title="出库表" :visible.sync="dialogTableVisible2">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item style="width: 100px">
          <el-input
            v-model="outstockQuery.outstockCount"
            placeholder="出库数量"
          />
        </el-form-item>
        <el-form-item label="出库时间">
          <el-date-picker
            style="width: 180px"
            v-model="outstockQuery.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            style="width: 180px"
            v-model="outstockQuery.endTime"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="success" icon="el-icon-search" @click="getInnerList2()"
          >查询</el-button
        >
        <el-button type="default" @click="innerResetData2()">清空</el-button>
      </el-form>
      <el-table :data="gridData2">
        <el-table-column label="出库数量">
          <template slot-scope="scope">
            {{ scope.row.outstockCount }}
          </template>
        </el-table-column>
        <el-table-column label="出库时间">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        style="text-align: center"
        @size-change="innerHandleSizeChange2"
        @current-change="getInnerList2"
        :current-page="innerCurrentPage2"
        :page-sizes="[1, 2, 3, 4, 5, 10]"
        :page-size="innerSize2"
        layout="total, sizes, prev, pager, next, jumper"
        :total="innerTotal2"
      >
      </el-pagination>
    </el-dialog>
  </div>
</template>

<script>
import inventory from "@/api/inventory/inventory.js";
import brand from "@/api/product/brand.js";
import product from "@/api/product/product";
import category from "@/api/product/category.js";
import region from "@/api/entity/region.js";
import instock from "@/api/inventory/instock";
import outstock from "@/api/inventory/outstock";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      InventoryQuery: {},
      brands: [],
      brandQueryId: "",
      categoryQueryIds: [],
      categoryQueryOptions: [],
      categoryQueryId: "",
      products: [],
      formLabelWidth: "120px",
      dialogTableVisible: false,
      dialogTableVisible2: false,
      warehouseRegionQueryIds: [],
      warehouseQueryOptions: [],
      instockQuery: {},
      outstockQuery: {},
      gridData: [],
      gridData2: [],
      innerSize: 5,
      innerCurrentPage: 1,
      innerTotal: 0,
      innerSize2: 5,
      innerCurrentPage2: 1,
      innerTotal2: 0,
    };
  },

  created() {
    this.getList();
    this.getRegionList();
    this.getBrandList();
    this.getCategoryList();
  },
  methods: {
    warehouseRegionQueryHandleChange(value) {
      const regionId = value[value.length - 1];
      if (regionId != undefined) {
        inventory.getWarehouseIdByRegionId(regionId).then((response) => {
          this.InventoryQuery.warehouseId = response.data.item;
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
      inventory
        .getInventoryListPage(this.currentPage, this.size, this.InventoryQuery)
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
    getRegionList() {
      region.getRegionList().then((response) => {
        this.warehouseQueryOptions = response.data.items;
      });
    },
    getBrandList() {
      brand.getBrandList().then((response) => {
        this.brands = response.data.items;
      });
    },
    getCategoryList() {
      category.getAllCategoryWithTree().then((response) => {
        this.categoryQueryOptions = response.data.items;
      });
    },
    resetData() {
      this.InventoryQuery = {};
      this.warehouseRegionQueryIds = [];
      this.categoryQueryIds = [];
      this.brandQueryId = "";
      this.categoryQueryId = "";
      this.products = [];
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = [];
      this.$refs.cascader2.$refs.panel.activePath = [];
    },

    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    handleSelectionChange(val) {},
    getInStockDetails(row) {
      this.dialogTableVisible = true;
      this.instockQuery.productId = row.productId;
      this.instockQuery.warehouseId = row.warehouseId;
      this.getInnerList();
    },
    getInnerList(innerCurrentPage = 1) {
      this.innerCurrentPage = innerCurrentPage;
      instock
        .getInstockListPage(
          this.innerCurrentPage,
          this.innerSize,
          this.instockQuery
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
      this.instockQuery = {};
      this.getInnerList();
    },
    innerHandleSizeChange(val) {
      this.size = val;
      this.getInnerList();
    },
    getOutStockDetails(row) {
      this.dialogTableVisible2 = true;
      this.outstockQuery.productId = row.productId;
      this.outstockQuery.warehouseId = row.warehouseId;
      this.getInnerList2();
    },
    getInnerList2(innerCurrentPage2 = 1) {
      this.innerCurrentPage2 = innerCurrentPage2;
      outstock
        .getOutstockListPage(
          this.innerCurrentPage2,
          this.innerSize2,
          this.outstockQuery
        )
        .then((response) => {
          //response接口返回的数据
          this.gridData2 = response.data.rows;
          // debugger;
          this.innerTotal2 = response.data.total;
        }) //请求成功
        .catch((error) => {
          console.error(error);
        }); //请求失败;
    },
    innerResetData() {
      this.outstockQuery = {};
      this.getInnerList2();
    },
    innerHandleSizeChange2(val) {
      this.size = val;
      this.getInnerList2();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>