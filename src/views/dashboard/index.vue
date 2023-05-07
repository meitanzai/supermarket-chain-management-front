<template>
  <div>
    <div class="dashboard-container">
      <div class="dashboard-text">
        用户名: {{ name }}
        <div class="msg">
          <el-badge :value="newOrderNoticeNum" :max="99" class="item">
            <el-button @click="newOrderNoticeNumChange" size="small"
              >新增订单提醒</el-button
            >
          </el-badge>
          <el-badge :value="newInventoryCountNoticeNum" :max="99" class="item">
            <el-button @click="newInventoryCountNoticeNumChange" size="small"
              >库存不足提醒</el-button
            >
          </el-badge>
          <el-badge :value="newShelfLifeNoticeNum" :max="99" class="item">
            <el-button @click="newShelfLifeNoticeNumChange" size="small"
              >商品保质期提醒</el-button
            >
          </el-badge>
        </div>
      </div>
    </div>
    <div
      id="top"
      style="border: 1px solid; color: #90bcee; width: 60%; height: 250px"
    >
      <div id="member" style="width: 25%; height: 250px"></div>
      <div id="order" style="width: 25%; height: 250px"></div>
      <div id="income" style="width: 25%; height: 250px"></div>
      <div id="expendse" style="width: 25%; height: 250px"></div>
    </div>
    <div
      id="right"
      style="border: 1px solid; color: #90bcee; width: 40%; height: 275px"
    >
      <el-table
        :data="tableData"
        ref="table"
        height="274px"
        style="width: 100%"
      >
        <el-table-column label="订单号" width="180">
          <template slot-scope="scope">
            {{ scope.row.orderNumber }}
          </template>
        </el-table-column>
        <el-table-column label="供应商" width="180">
          <template slot-scope="scope">
            {{ scope.row.supplierName }}
          </template>
        </el-table-column>
        <el-table-column label="金额">
          <template slot-scope="scope">
            {{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPay == 1" type="success">已支付</el-tag>
            <el-tag v-else-if="scope.row.isPay == 2" type="danger"
              >未支付</el-tag
            >
            <el-tag v-else type="warning">已取消</el-tag>
          </template></el-table-column
        >
      </el-table>
    </div>
    <div
      id="lowerLeft"
      style="border: 1px solid; color: #90bcee; width: 60%; height: 549px"
    >
      <div id="incomeAndExpendse" style="width: 100%; height: 540px"></div>
    </div>
    <div
      id="lowerRight"
      style="border: 1px solid; color: #90bcee; width: 40%; height: 524px"
    >
      <div id="dailySales" style="width: 100%; height: 523px"></div>
    </div>
    <el-dialog
      :before-close="close"
      title="新订单"
      :visible.sync="dialogTableVisible"
    >
      <el-table :data="gridData">
        <el-table-column label="订单号">
          <template slot-scope="scope">
            {{ scope.row.orderNumber }}
          </template>
        </el-table-column>
        <el-table-column label="进货商">
          <template slot-scope="scope">
            {{ scope.row.supplierName }}
          </template>
        </el-table-column>
        <el-table-column label="总价">
          <template slot-scope="scope">
            {{ scope.row.totalPrice }}
          </template>
        </el-table-column>
        <el-table-column label="支付状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isPay == 1" type="success">已支付</el-tag>
            <el-tag v-else-if="scope.row.isPay == 2" type="danger"
              >未支付</el-tag
            >
            <el-tag v-else type="warning">已取消</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :before-close="close1"
      title="库存不足"
      :visible.sync="dialogTableVisible1"
    >
      <el-table :data="gridData1">
        <el-table-column label="仓库">
          <template slot-scope="scope">
            {{ scope.row.warehouseRegion }}
          </template>
        </el-table-column>
        <el-table-column label="商品">
          <template slot-scope="scope">
            {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column label="库存">
          <template slot-scope="scope">
            {{ scope.row.inventoryCount }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="30天内过期" :visible.sync="dialogTableVisible2">
      <el-table :data="gridData2">
        <el-table-column label="进货单">
          <template slot-scope="scope">
            {{ scope.row.purchaseNumber }}
          </template>
        </el-table-column>
        <el-table-column label="商品">
          <template slot-scope="scope">
            {{ scope.row.productName }}
          </template>
        </el-table-column>
        <el-table-column label="保质期">
          <template slot-scope="scope">
            {{ scope.row.shelfLife }}
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import echarts from "echarts";
import statistics from "@/api/statistics/statistics";
import order from "@/api/supply/order";
export default {
  name: "Dashboard",
  computed: {
    ...mapGetters(["name", "userId"]),
  },
  data() {
    return {
      member: {},
      order: {},
      income: {},
      expendse: {},
      incomeAndExpendse: {},
      tableData: [],
      dailySales: {},
      newOrderNoticeNum: 0,
      newInventoryCountNoticeNum: 0,
      newShelfLifeNoticeNum: 0,
      websock: null,
      gridData: [],
      dialogTableVisible: false,
      gridData1: [],
      dialogTableVisible1: false,
      gridData2: [],
      dialogTableVisible2: false,
    };
  },
  created() {
    this.getOrders();
    this.initWebSocket();
    this.initNewOrderNoticeNum();
    this.initNewOrderNoticeNum();
    this.initNewInventoryCountNoticeNum();
    this.initNewShelfLifeNoticeNum();
  },
  destroyed() {
    this.websock.close(); //离开路由之后断开websocket连接
  },
  methods: {
    initNewOrderNoticeNum() {
      statistics.getNewOrderNoticeNum(this.userId).then((res) => {
        this.newOrderNoticeNum = res.data.total;
        this.gridData = res.data.rows;
      });
    },
    initNewInventoryCountNoticeNum(){
      statistics.getNewInventoryCountNoticeNum(this.userId).then((res) => {
        this.newInventoryCountNoticeNum = res.data.total;
        this.gridData1 = res.data.rows;
      });
    },
    initNewShelfLifeNoticeNum() {
      statistics.getNewShelfLifeNoticeNum(this.userId).then((res) => {
        this.newShelfLifeNoticeNum = res.data.total;
        this.gridData2 = res.data.rows;
      });
    },
    close() {
      this.gridData = [];
      this.dialogTableVisible = false;
    },
    close1() {
      this.gridData1 = [];
      this.dialogTableVisible1 = false;
    },
    newShelfLifeNoticeNumChange() {
      this.gridData2 = [];
      this.initNewShelfLifeNoticeNum();
      this.dialogTableVisible2 = true;
    },
    newInventoryCountNoticeNumChange() {
      this.newInventoryCountNoticeNum = 0;
      const type = 2;
      this.dialogTableVisible1 = true;
      statistics.userBrowse(this.userId, type).then(() => {});
    },
    newOrderNoticeNumChange() {
      this.newOrderNoticeNum = 0;
      const type = 1;
      this.dialogTableVisible = true;
      statistics.userBrowse(this.userId, type).then(() => {});
    },
    initWebSocket() {
      //初始化weosocket
      const wsuri = "ws://127.0.0.1:8081/ws/" + this.userId;
      this.websock = new WebSocket(wsuri);
      this.websock.onmessage = this.websocketonmessage;
      this.websock.onopen = this.websocketonopen;
      this.websock.onerror = this.websocketonerror;
      this.websock.onclose = this.websocketclose;
    },
    websocketonopen() {
      //连接建立之后执行send方法发送数据
      // let actions = { test: "12345" };
      // this.websocketsend(JSON.stringify(actions));
    },
    websocketonerror() {
      //连接建立失败重连
      // this.initWebSocket();
    },
    websocketonmessage(e) {
      this.gridData1 = JSON.parse(e.data);
      this.newInventoryCountNoticeNum = this.gridData1.length;
    },
    websocketsend(Data) {
      //数据发送
      this.websock.send(Data);
    },
    websocketclose(e) {
      //关闭
      // console.log("断开连接", e);
    },
    getOrders() {
      order.getOrders().then((res) => {
        this.tableData = res.data.items;
      });
    },
    getMember() {
      statistics.getMemberRegister().then((res) => {
        const data = res.data.items;
        this.member.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: ["会员注册人数"],
          },
          color: ["#45C2E0"],
          series: [
            {
              name: "当月",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [{ value: data, name: "会员注册人数" }],
            },
          ],
        });
      });
    },
    getOrder() {
      statistics.getOrders().then((r) => {
        const data = r.data.items;
        this.order.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: ["进货订单数"],
          },
          color: ["#C1EBDD"],
          series: [
            {
              name: "当月",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [{ value: data, name: "进货订单数" }],
            },
          ],
        });
      });
    },
    getIncome() {
      statistics.getIncome().then((res) => {
        const data = res.data.items;
        this.income.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: ["上月收入"],
          },
          color: ["#FFC851"],
          series: [
            {
              name: "上月",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [{ value: data, name: "上月收入" }],
            },
          ],
        });
      });
    },
    getExpendse() {
      statistics.getExpendse().then((r) => {
        const data = r.data.items;
        this.expendse.setOption({
          tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b}: {c} ({d}%)",
          },
          legend: {
            orient: "vertical",
            left: 10,
            data: ["上月支出"],
          },
          color: ["#5A5476"],
          series: [
            {
              name: "上月",
              type: "pie",
              radius: ["50%", "70%"],
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: "center",
              },
              emphasis: {
                label: {
                  show: true,
                  fontSize: "30",
                  fontWeight: "bold",
                },
              },
              labelLine: {
                show: false,
              },
              data: [{ value: data, name: "上月支出" }],
            },
          ],
        });
      });
    },
    getIncomeAndExpendse() {
      statistics.getIncomeAndExpendse().then((r) => {
        const income = r.data.income;
        const expendse = r.data.expendse;
        this.incomeAndExpendse.setOption({
          title: {
            text: "收入与支出",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["收入", "支出"],
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
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
          },
          yAxis: {
            type: "value",
          },
          series: [
            {
              name: "收入",
              type: "line",
              data: income,
            },
            {
              name: "支出",
              type: "line",
              data: expendse,
            },
          ],
        });
      });
    },
    getDailySales() {
      statistics.getDailySales().then((r) => {
        const name = r.data.name;
        const data = r.data.data;
        this.dailySales.setOption({
          color: [
            "#ee6666",
            "#73c0de",
            "#3ba272",
            "#fc8452",
            "#9a60b4",
            "#ea7ccc",
          ],
          title: {
            text: "日销TOP10",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              // 坐标轴指示器，坐标轴触发有效
              type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
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
              type: "value",
            },
          ],
          yAxis: [
            {
              type: "category",
              data: name,
              axisTick: {
                alignWithLabel: true,
              },
            },
          ],
          series: [
            {
              name: "日销售量",
              type: "bar",
              barWidth: "60%",
              data: data,
            },
          ],
        });
      });
    },
    infinitScroll() {
      const table = this.$refs.table;
      const divData = table.bodyWrapper;
      divData.addEventListener("mouseenter", () => {
        clearInterval(this.timer);
      });
      divData.addEventListener("mouseleave", () => {
        this.infinitScroll();
      });
      this.timer = setInterval(() => {
        divData.scrollTop += 1;
        if (divData.clientHeight + divData.scrollTop == divData.scrollHeight) {
          divData.scrollTop = 0;
        }
      }, 100);
    },
  },
  mounted() {
    this.infinitScroll();
    this.member = echarts.init(document.getElementById("member"));
    this.order = echarts.init(document.getElementById("order"));
    this.income = echarts.init(document.getElementById("income"));
    this.expendse = echarts.init(document.getElementById("expendse"));
    this.incomeAndExpendse = echarts.init(
      document.getElementById("incomeAndExpendse")
    );
    this.dailySales = echarts.init(document.getElementById("dailySales"));
    this.getMember();
    this.getOrder();
    this.getIncome();
    this.getExpendse();
    this.getIncomeAndExpendse();
    this.getDailySales();
  },
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 10px;
  }
  &-text {
    font-size: 30;
    line-height: 30px;
  }
}
#top {
  float: left;
}
#right {
  float: right;
}
#member {
  float: left;
}
#order {
  float: left;
}
#income {
  float: left;
}
#expendse {
  float: left;
}
#incomeAndExpendse {
  float: left;
}
#lowerLeft {
  float: left;
}
#lowerRight {
  float: left;
}
.item {
  margin-right: 22px;
}
.msg {
  float: right;
  margin-right: 50px;
}
</style>
