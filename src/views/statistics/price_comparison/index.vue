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
      seriesAll: [],
      titleAll: [],
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
      this.titleAll = [];
      this.seriesAll = [];
      statistics.getPriceComparison(this.product).then((res) => {
        if (res.data.items == null) {
          this.$message({
            message: "暂无数据",
            type: "warning",
          });
          return;
        }
        res.data.items.forEach((item) => {
          this.titleAll.push(item.name);
          this.seriesAll.push(item);
        });
        this.myChart.setOption(
          {
            title: {
              text: "商品近10次进价对比",
            },
            tooltip: {
              trigger: "axis",
            },
            legend: {
              data: this.titleAll,
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "3%",
              containLabel: true,
            },
            toolbox: {
              feature: {
                saveAsImage: {},
              },
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: [
                "近一次",
                "近二次",
                "近三次",
                "近四次",
                "近五次",
                "近六次",
                "近七次",
                "近八次",
                "近九次",
                "近十次",
              ],
            },
            yAxis: {
              type: "value",
            },
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