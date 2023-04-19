<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="query.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="query.endTime"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="success" icon="el-icon-search" @click="getData()"
        >查询</el-button
      >
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="进货单">
        <template slot-scope="scope">
          {{ scope.row.purchaseNumber }}
        </template>
      </el-table-column>
      <el-table-column label="商品">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="保质期">
        <template slot-scope="scope">
          {{ scope.row.shelfLife }}
        </template>
      </el-table-column>
      <el-table-column label="售价">
        <template slot-scope="scope">
          {{ scope.row.sellPrice }}
        </template>
      </el-table-column>
      <el-table-column label="促销价">
        <template slot-scope="scope">
          {{ scope.row.promotionalPrice }}
        </template>
      </el-table-column>
      <el-table-column label="促销">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.productId)"
            >促销价</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="商品促销" :visible.sync="dialogFormVisible">
      <el-form>
        <el-form-item label="商品促销价">
          <el-input v-model="price" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="save()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import statistics from "@/api/statistics/statistics";
import product from "@/api/product/product";
export default {
  components: {},
  props: {},
  data() {
    return {
      tableData: [],
      query: {
        startTime: "",
        endTime: "",
      },
      dialogFormVisible: false,
      price: "",
      productId: "",
    };
  },
  created() {
    this.getData();
  },
  methods: {
    resetData() {
      this.query = {
        startTime: "",
        endTime: "",
      };
      this.getData();
    },
    // 获取数据
    getData() {
      statistics.getShelflife(this.query).then((res) => {
        this.tableData = res.data.items;
      });
    },
    handleEdit(productId) {
      this.dialogFormVisible = true;
      this.productId = productId;
    },
    cancel() {
      this.dialogFormVisible = false;
      this.productId = "";
      this.price = "";
    },
    save() {
      if (this.price == "") {
        this.$message({
          type: "warning",
          message: "请填写促销价",
        });
        return;
      }
      product
        .updatePromotionalPriceById(this.productId, this.price)
        .then((res) => {
          this.$message({
            type: "success",
            message: "保存成功",
          });
          this.dialogFormVisible = false;
          this.productId = "";
          this.price = "";
          this.getData();
        });
    },
  },
};
</script>
<style lang="scss" scoped>
</style>