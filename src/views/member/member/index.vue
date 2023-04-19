<template>
  <div>
    <!-- 搜索 -->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select
          v-model="memberQuery.cardNumber"
          clearable
          filterable
          placeholder="会员卡号"
        >
          <el-option
            v-for="item in members"
            :key="item.id"
            :label="item.cardNumber"
            :value="item.cardNumber"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="memberQuery.name"
          placeholder="会员名字"
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="memberQuery.tel"
          placeholder="会员电话"
          style="width: 130px"
        />
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 130px"
          v-model="memberQuery.status"
          clearable
          filterable
          placeholder="请选择状态"
        >
          <el-option :value="1" label="正常" />
          <el-option :value="2" label="停用" />
          <el-option :value="3" label="注销" />
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          style="width: 180px"
          v-model="memberQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="width: 180px"
          v-model="memberQuery.endTime"
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
    <el-button type="primary" icon="el-icon-plus" @click="() => save()"
      >添加</el-button
    >
    <el-button type="danger" icon="el-icon-delete" @click="deleteBatchMember()"
      >批量删除</el-button
    >
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="会员卡号" width="250">
        <template slot-scope="scope">
          {{ scope.row.cardNumber }}
        </template>
      </el-table-column>
      <el-table-column label="会员名字" width="150">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="会员电话" width="150">
        <template slot-scope="scope">
          {{ scope.row.tel }}
        </template>
      </el-table-column>
      <el-table-column label="会员性别" width="120">
        <template slot-scope="scope">
          {{ scope.row.sex === 1 ? "男" : "女" }}
        </template>
      </el-table-column>
      <el-table-column label="会员余额" width="120">
        <template slot-scope="scope">
          {{ scope.row.balance + "￥" }}
        </template>
      </el-table-column>
      <el-table-column label="会员积分" width="120">
        <template slot-scope="scope">
          {{ scope.row.point }}
        </template>
      </el-table-column>
      <el-table-column label="会员卡状态" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status == 1" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status == 2" type="warning">停用</el-tag>
          <el-tag v-else type="danger">注销</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="info"
            @click="getPointDetails(scope.row.id)"
            >积分详情</el-button
          >
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteMemberById(scope.row.id)"
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

    <el-dialog title="会员" :visible.sync="dialogFormVisible">
      <el-form :model="memberEntity">
        <el-form-item label="会员卡号" :label-width="formLabelWidth">
          <el-input
            v-model="memberEntity.cardNumber"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="会员名字" :label-width="formLabelWidth">
          <el-input v-model="memberEntity.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员电话" :label-width="formLabelWidth">
          <el-input v-model="memberEntity.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员性别" :label-width="formLabelWidth">
          <el-radio-group v-model="memberEntity.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="会员余额" :label-width="formLabelWidth">
          <el-input
            v-model="memberEntity.balance"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="会员积分" :label-width="formLabelWidth">
          <el-input v-model="memberEntity.point" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="会员卡状态" :label-width="formLabelWidth">
          <el-select
            v-model="memberEntity.status"
            clearable
            filterable
            placeholder="会员卡状态"
          >
            <el-option :value="1" label="正常" />
            <el-option :value="2" label="停用" />
            <el-option :value="3" label="注销" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="积分详情" :visible.sync="dialogTableVisible">
      <!-- 搜索 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="修改时间">
          <el-date-picker
            v-model="memberPointQuery.startTime"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="memberPointQuery.endTime"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-button type="success" icon="el-icon-search" @click="getInnerList()"
          >查询</el-button
        >
        <el-button type="default" @click="innerResetData()">清空</el-button>
      </el-form>
      <el-table :data="gridData">
        <el-table-column label="修改日期">
          <template slot-scope="scope">
            {{ scope.row.gmtCreate }}
          </template>
        </el-table-column>
        <el-table-column label="积分">
          <template slot-scope="scope">
            {{ scope.row.point }}
          </template>
        </el-table-column>
        <el-table-column label="备注">
          <template slot-scope="scope">
            {{ scope.row.remark }}
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
  </div>
</template>

<script>
import member from "@/api/member/member";
import memberPoint from "@/api/member/memberPoint";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      innerSize: 5,
      innerCurrentPage: 1,
      innerTotal: 0,
      memberQuery: {},
      tableData: [],
      memberEntity: {},
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      dialogTableVisible: false,
      gridData: [],
      memberPointQuery: {},
      members: [],
    };
  },

  created() {
    this.getList();
    this.getMemberList();
  },
  methods: {
    getList(currentPage = 1) {
      this.currentPage = currentPage;
      member
        .getMemberListPage(this.currentPage, this.size, this.memberQuery)
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
    getMemberList() {
      member.getMemberList().then((response) => {
        this.members = response.data.items;
      });
    },
    resetData() {
      this.memberQuery = {};
      this.getList();
    },

    save() {
      this.memberEntity = {};
      this.dialogFormVisible = true;
    },

    deleteBatchMember() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的会员",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该会员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          member.deleteBatchMember(this.ids).then((response) => {
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

    getPointDetails(id) {
      this.memberEntity.id = id;
      this.getInnerList();
      this.dialogTableVisible = true;
    },

    handleEdit(row) {
      this.memberEntity = row;
      this.dialogFormVisible = true;
    },

    deleteMemberById(id) {
      this.$confirm("此操作将永久删除该会员, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          member.deleteMemberById(id).then((response) => {
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

    cancel() {
      this.dialogFormVisible = false;
      this.memberEntity = {};
      this.getList();
    },

    saveOrUpdate() {
      if (
        this.memberEntity.cardNumber == null ||
        this.memberEntity.cardNumber.trim() == "" ||
        this.memberEntity.name == null ||
        this.memberEntity.name.trim() == "" ||
        this.memberEntity.tel == null ||
        this.memberEntity.tel.trim() == ""
      ) {
        this.$message({
          message: "请填写完整信息",
          type: "warning",
        });
        return;
      }
      member.isExistMemberCardNumber(this.memberEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "会员卡号已存在",
          });
          return;
        }
        this.dialogFormVisible = false;
        if (this.memberEntity.id != null) {
          member.updateMemberById(this.memberEntity).then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getList();
          });
        } else {
          member.saveMember(this.memberEntity).then((response) => {
            this.$message({
              message: "添加成功",
              type: "success",
            });
            this.getList();
          });
        }
      });
    },

    getInnerList(innerCurrentPage = 1) {
      this.innerCurrentPage = innerCurrentPage;
      memberPoint
        .getMemberPointListPageByMemberId(
          this.innerCurrentPage,
          this.innerSize,
          this.memberPointQuery,
          this.memberEntity.id
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
      this.memberPointQuery = {};
      this.getInnerList();
    },

    innerHandleSizeChange(val) {
      this.innerSize = val;
      this.getInnerList();
    },
  },
};
</script>
<style lang="scss" scoped>
</style>