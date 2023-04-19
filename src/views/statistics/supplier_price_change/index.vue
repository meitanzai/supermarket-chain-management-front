<template>
  <div>
    <el-form>
      <el-form-item label="商品名称">
        <el-select
          v-model="product.id"
          filterable
          clearable
          placeholder="请选择商品名称"
        >
          <el-option
            v-for="item in products"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <div id="main" style="width: 100%; height: 750px" />
  </div>
</template>
<script>
import echarts from "echarts";
import statistics from "@/api/statistics/statistics";
import product from "@/api/product/product";
export default {
  data() {
    return {
      suppliers: [],
      seriesAll: [],
      products: [],
      product: {
        id: "",
      },
      myChart: {},
    };
  },
  created() {
    this.getProductList();
  },
  watch: {
    product: {
      handler() {
        this.getMychart();
      },
      deep: true,
    },
  },
  methods: {
    getProductList() {
      product.getProductList().then((res) => {
        this.products = res.data.items;
      });
    },
    getMychart() {
      this.suppliers = [];
      this.seriesAll = [];
      statistics.getSupplierPriceChange(this.product).then((res) => {
        if (res.data.items == null) {
          this.$message({
            message: "暂无数据",
            type: "warning",
          });
          return;
        }
        this.seriesAll = res.data.items;
        this.suppliers = res.data.items.list;
        this.myChart.setOption(
          {
            title: {
              text: "供货商价格对比",
            },
            color: ["#3398DB"],
            tooltip: {
              trigger: "axis",
              axisPointer: {
                type: "shadow",
              },
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            xAxis: [
              {
                type: "category",
                data: this.suppliers,
                axisTick: {
                  alignWithLabel: true,
                },
              },
            ],
            yAxis: [
              {
                type: "value",
              },
            ],
            series: this.seriesAll,
          },
          true
        );
      });
    },
  },
  mounted() {
    this.myChart = echarts.init(document.getElementById("main"));
    this.getMychart();
  },
};
</script>
<style lang="scss" scoped>
</style>