<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input
          v-model="purchaseOrderQuery.orderNumber"
          placeholder="订单号"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="purchaseOrderQuery.supplierId"
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
          style="width: 130px"
          v-model="purchaseOrderQuery.totalPrice"
          placeholder="订单金额"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="purchaseOrderQuery.isPay"
          filterable
          clearable
          placeholder="支付状态"
          style="width: 110px"
        >
          <el-option :value="1" label="已支付" />
          <el-option :value="2" label="未支付" />
          <el-option :value="3" label="已取消" />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          style="width: 180px"
          v-model="purchaseOrderQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="width: 180px"
          v-model="purchaseOrderQuery.endTime"
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
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="订单号" width="240">
        <template slot-scope="scope">
          {{ scope.row.orderNumber }}
        </template>
      </el-table-column>
      <el-table-column label="供货商" width="200">
        <template slot-scope="scope">
          {{ scope.row.supplierName }}
        </template>
      </el-table-column>
      <el-table-column label="订单金额" width="150">
        <template slot-scope="scope">
          {{ scope.row.totalPrice + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="支付状态" width="100">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.isPay == 1" type="success">已支付</el-tag>
          <el-tag v-else-if="scope.row.isPay == 2" type="danger">未支付</el-tag>
          <el-tag v-else type="warning">已取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.gmtCreate }}
        </template>
      </el-table-column>
      <el-table-column label="修改时间" width="200">
        <template slot-scope="scope">
          {{ scope.row.gmtModified }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getPurchaseDetails(scope.row.purchaseId)"
            >进货详情</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
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
    <el-dialog title="订单" :visible.sync="dialogFormVisible">
      <el-form :model="purchaseOrderEntity">
        <el-form-item label="支付状态" :label-width="formLabelWidth">
          <el-select
            v-model="purchaseOrderEntity.isPay"
            filterable
            clearable
            placeholder="支付状态"
          >
            <el-option :value="1" label="已支付" />
            <el-option :value="2" label="未支付" />
            <el-option :value="3" label="已取消" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="update()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="进货详情" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column width="200" label="进货号">
          <template slot-scope="scope">
            {{ scope.row.purchaseNumber }}
          </template>
        </el-table-column>
        <el-table-column width="100" label="商品">
          <template slot-scope="scope">
            {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column width="150" label="供货商">
          <template slot-scope="scope">
            {{ scope.row.supplierName }}
          </template>
        </el-table-column>
        <el-table-column width="80" label="数量">
          <template slot-scope="scope">
            {{ scope.row.quantity }}
          </template>
        </el-table-column>

        <el-table-column width="80" label="进价">
          <template slot-scope="scope">
            {{ scope.row.purchasePrice }}
          </template>
        </el-table-column>

        <el-table-column width="80" label="总价">
          <template slot-scope="scope">
            {{ scope.row.totalPrice }}
          </template>
        </el-table-column>

        <el-table-column width="150" label="进货时间">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import order from "@/api/supply/order.js";
import supplier from "@/api/supply/supplier";
import purchase from "@/api/supply/purchase";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      purchaseOrderQuery: {},
      purchaseOrderEntity: {},
      dialogFormVisible: false,
      dialogTableVisible: false,
      formLabelWidth: "120px",
      suppliers: [],
      isPay: "",
      gridData: [],
    };
  },

  created() {
    this.getList();
    this.getSuppliersList();
  },
  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      order
        .getPurchaseOrderListPage(
          this.currentPage,
          this.size,
          this.purchaseOrderQuery
        )
        .then((response) => {
          this.tableData = response.data.rows;
          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    getSuppliersList() {
      supplier.getSupplierList().then((response) => {
        this.suppliers = response.data.items;
      });
    },
    resetData() {
      this.purchaseOrderQuery = {};
      this.getList();
    },
    getPurchaseDetails(purchaseId) {
      purchase.getPurchaseDetails(purchaseId).then((response) => {
        this.gridData[0] = response.data.item;
        this.dialogTableVisible = true;
      });
    },
    handleEdit(row) {
      this.purchaseOrderEntity = row;
      this.isPay = this.purchaseOrderEntity.isPay;
      this.dialogFormVisible = true;
    },
    handleSelectionChange(val) {},
    handleSizeChange(val) {
      this.size = val;
      this.getList();
    },
    cancel() {
      this.purchaseOrderEntity = {};
      this.isPay = "";
      this.dialogFormVisible = false;
      this.getList();
    },
    update() {
      if (this.isPay == 1) {
        this.$message({
          message: "已支付订单不能修改",
          type: "warning",
        });
        return;
      }
      order.updatePurchaseOrder(this.purchaseOrderEntity).then((response) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.purchaseOrderEntity = {};
        this.isPay = "";
        this.dialogFormVisible = false;
        this.getList();
      });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>