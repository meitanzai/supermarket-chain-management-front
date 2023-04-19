<template>
  <div>
    <div id="main" style="width: 100%; height: 750px" />
  </div>
</template>

<script>
import echarts from "echarts";
import statistics from "@/api/statistics/statistics";
export default {
  data() {
    return {
      myChart: {},
    };
  },
  computed: {},
  methods: {
    getMychart() {
      statistics.getProportionOfExpenditure().then((res) => {
        const name = res.data.items.map((item) => item.name);
        const data = res.data.items;
        const total = res.data.total;
        this.myChart.setOption({
          title: {
            text: "上月支出占比",
            subtext: "总支出:" + total + "元",
            left: "center",
          },
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: "left",
            data: name,
          },
          series: [
            {
              name: "金额",
              type: "pie",
              radius: "55%",
              center: ["50%", "60%"],
              data: data,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: "rgba(0, 0, 0, 0.5)",
                },
              },
            },
          ],
        });
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