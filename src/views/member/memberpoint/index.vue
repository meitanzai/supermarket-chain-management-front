<template>
  <div>
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-select
          v-model="memberPointQuery.memberId"
          clearable
          filterable
          placeholder="会员卡号"
        >
          <el-option
            v-for="item in members"
            :key="item.id"
            :label="item.cardNumber"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          v-model="memberPointQuery.point"
          placeholder="积分"
        />
      </el-form-item>

      <el-form-item label="添加时间">
        <el-date-picker
          style="width: 180px"
          v-model="memberPointQuery.startTime"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          style="width: 180px"
          v-model="memberPointQuery.endTime"
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
      <el-button
        type="danger"
        icon="el-icon-delete"
        @click="deleteBatchMemberPoint()"
        >批量删除</el-button
      >
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
      <el-table-column label="卡号" width="250">
        <template slot-scope="scope">
          {{ scope.row.cardNumber }}
        </template>
      </el-table-column>
      <el-table-column label="会员名字" width="150">
        <template slot-scope="scope">
          {{ scope.row.memberName }}
        </template>
      </el-table-column>
      <el-table-column label="积分" width="150">
        <template slot-scope="scope">
          {{ scope.row.point }}
        </template>
      </el-table-column>
      <el-table-column label="备注" width="350">
        <template slot-scope="scope">
          {{ scope.row.remark }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="200">
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
            @click="deleteMemberPointById(scope.row.id)"
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
    <el-dialog title="会员积分" :visible.sync="dialogFormVisible">
      <el-form :model="memberPointEntity">
        <el-form-item label="会员卡号" :label-width="formLabelWidth">
          <el-select
            v-model="memberPointEntity.memberId"
            filterable
            clearable
            placeholder="请选择"
            @change="getMemberNameById()"
          >
            <el-option
              v-for="item in members"
              :key="item.id"
              :label="item.cardNumber"
              :value="item.id"
              :disabled="item.status != 1"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员名字" :label-width="formLabelWidth">
          {{ memberPointEntity.memberName }}
        </el-form-item>
        <el-form-item label="会员积分" :label-width="formLabelWidth">
          <el-input
            v-model="memberPointEntity.point"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="memberPointEntity.remark"></el-input>
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
import memberPoint from "@/api/member/memberPoint";
import member from "@/api/member/member";
export default {
  data() {
    return {
      size: 12,
      currentPage: 1,
      total: 0,
      tableData: [],
      memberPointQuery: {},
      memberPointEntity: {},
      multipleSelection: [],
      ids: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
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
      memberPoint
        .getMemberPointListPage(
          this.currentPage,
          this.size,
          this.memberPointQuery
        )
        .then((response) => {
          this.tableData = response.data.rows;

          this.total = response.data.total;
        })
        .catch((error) => {
          console.error(error);
        });
    },

    resetData() {
      this.memberPointQuery = {};
      this.getList();
    },

    save() {
      this.memberPointEntity = {};
      this.dialogFormVisible = true;
    },

    deleteBatchMemberPoint() {
      this.ids = this.multipleSelection.map((item) => item.id);
      if (this.ids.length == 0) {
        this.$message({
          type: "info",
          message: "请先选择要删除的积分",
        });
        return;
      }
      this.$confirm("此操作将永久批量删除该积分, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          memberPoint.deleteBatchMemberPoint(this.ids).then((response) => {
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

    handleEdit(row) {
      this.memberPointEntity = row;
      this.dialogFormVisible = true;
    },

    deleteMemberPointById(id) {
      this.$confirm("此操作将永久删除该积分, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          memberPoint.deleteMemberPointById(id).then((response) => {
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
      this.memberPointEntity = {};
      this.dialogFormVisible = false;
      this.getList();
    },

    saveOrUpdate() {
      if (
        this.memberPointEntity.memberId == null ||
        this.memberPointEntity.memberId == "" ||
        this.memberPointEntity.point == null ||
        this.memberPointEntity.point == ""
      ) {
        this.$message({
          message: "会员名字和积分不能为空",
          type: "warning",
        });
        return;
      }
      this.dialogFormVisible = false;
      if (this.memberPointEntity.id != null) {
        memberPoint
          .updateMemberPointById(this.memberPointEntity)
          .then((response) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getList();
          });
      } else {
        memberPoint.saveMemberPoint(this.memberPointEntity).then((response) => {
          this.$message({
            message: "添加成功",
            type: "success",
          });
          this.getList();
        });
      }
    },

    getMemberList() {
      member.getMemberList().then((response) => {
        this.members = response.data.items;
      });
    },
    getMemberNameById() {
      if (
        this.memberPointEntity.memberId != null &&
        this.memberPointEntity.memberId != ""
      ) {
        member
          .getMemberNameById(this.memberPointEntity.memberId)
          .then((response) => {
            this.memberPointEntity.memberName = response.data.item;
          });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>