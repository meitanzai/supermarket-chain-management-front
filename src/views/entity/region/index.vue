<template>
  <div>
      <el-button type="primary" icon="el-icon-plus" @click="() => save()"
        >添加</el-button
      >
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="tableData"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      default-expand-all
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"> </el-table-column>
      <el-table-column label="序号" width="300">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="地区" width="700">
        <template slot-scope="scope">
          {{ scope.row.fullName }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">修改</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="deleteRegionById(scope.row.id)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="地区" :visible.sync="dialogFormVisible">
      <el-form :model="regionEntity">
        <el-form-item
          v-if="regionEntity.id == null"
          label="父级地区"
          :label-width="formLabelWidth"
        >
          <el-cascader
            ref="cascader1"
            v-model="regionEntityIds"
            :options="regionOptions"
            :props="{ value: 'id', label: 'name' }"
            @change="regionEntityHandleChange"
            filterable
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="地区名称" :label-width="formLabelWidth">
          <el-input v-model="regionEntity.name" autocomplete="off"></el-input>
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
import region from "@/api/entity/region";
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      formLabelWidth: "120px",
      regionEntity: {},
      regionEntityIds: [],
      regionOptions: [],
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      region
        .getRegionList()
        .then((response) => {
          //response接口返回的数据
          this.tableData = response.data.items
          this.regionOptions = response.data.items
        }) //请求成功
        .catch((error) => {
          console.error(error);
        }); //请求失败;
    },

    save() {
      this.regionEntity = {};
      this.regionEntityIds = [];
      this.dialogFormVisible = true;
    },

    handleSelectionChange(val) {},

    handleEdit(row) {
      this.regionEntity = row;
      this.dialogFormVisible = true;
    },

    deleteRegionById(id) {
      this.$confirm("此操作将永久删除该地区, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          region.deleteRegionById(id).then((response) => {
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

    regionEntityHandleChange(value) {
      this.regionEntity.parentId = value[value.length - 1];
    },

    cancel() {
      this.dialogFormVisible = false;
      this.regionEntityIds = [];
      this.regionEntity = {};
      this.getList();
      this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
    },

    saveOrUpdate() {
      if (
        this.regionEntity.name == null ||
        this.regionEntity.name.trim() == ""
      ) {
        this.$message({
          type: "warning",
          message: "地区名称不能为空",
        });
        return;
      }
      region.isExistRegionName(this.regionEntity).then((response) => {
        if (response.data.item) {
          this.$message({
            type: "warning",
            message: "地区名称已存在",
          });
          return;
        }
      this.dialogFormVisible = false;
      if (this.regionEntity.id != null) {
        region.updateRegionById(this.regionEntity).then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.regionEntityIds = [];
          this.regionEntity = {};
          this.getList();
        });
      } else {
        region.saveRegion(this.regionEntity).then((response) => {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.regionEntityIds = [];
          this.regionEntity = {};
          this.getList();
          this.$refs.cascader1.$refs.panel.activePath = []; // 清除高亮
        });
      }
    });
    },

  },
};
</script>
<style lang="scss" scoped>
</style>