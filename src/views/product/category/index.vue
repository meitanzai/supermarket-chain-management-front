<template>
  <div class="custom-tree-container">
    <el-input
      placeholder="输入关键字进行过滤"
      v-model="filterText"
      style="margin-bottom: 30px"
    >
    </el-input>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin-bottom: 30px"
      @click="() => save()"
      >添加</el-button
    >
    <div class="block">
      <el-tree
        ref="tree"
        :data="data"
        :props="props"
        :filter-node-method="filterNode"
        node-key="id"
        default-expand-all
        class="filter-tree"
        :expand-on-click-node="false"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              v-if="data.level < 4"
              type="text"
              size="mini"
              @click="() => saveByParentId(data.id)"
            >
              添加
            </el-button>
            <el-button
              type="text"
              size="mini"
              @click="updateCategoryById(data)"
            >
              修改
            </el-button>

            <el-button
              type="text"
              size="mini"
              @click="deleteCategoryById(data.id)"
            >
              删除
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <el-dialog title="分类" :visible.sync="dialogFormVisible">
      <el-form :model="categoryEntity">
        <el-form-item label="分类标题" :label-width="formLabelWidth">
          <el-input
            v-model="categoryEntity.title"
            autocomplete="off"
          ></el-input>
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
import category from "@/api/product/category.js";
export default {
  data() {
    return {
      filterText: "",
      data: [],
      props: {
        children: "children",
        label: "title",
      },
      categoryEntity: {},
      dialogFormVisible: false,
      formLabelWidth: "120px",
    };
  },
  created() {
    this.getAllCategoryWithTree();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  methods: {
    save() {
      this.categoryEntity = {};
      this.dialogFormVisible = true;
    },

    saveByParentId(parentId) {
      this.categoryEntity = {};
      if (parentId != null) {
        this.categoryEntity.parentId = parentId;
      }
      this.dialogFormVisible = true;
    },

    updateCategoryById(data) {
      this.categoryEntity = data;
      this.dialogFormVisible = true;
    },

    deleteCategoryById(id) {
      this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() =>
          category.deleteCategoryById(id).then((response) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getAllCategoryWithTree();
          })
        )
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    cancel() {
      this.categoryEntity = {};
      this.getAllCategoryWithTree();
      this.dialogFormVisible = false;
    },

    saveOrUpdate() {
      if (
        this.categoryEntity.title == null ||
        this.categoryEntity.title.trim() == ""
      ) {
        this.$message({
          type: "warning",
          message: "分类标题不能为空!",
        });
        return;
      }
      this.dialogFormVisible = false;
      if (this.categoryEntity.id != null) {
        category.updateCategoryById(this.categoryEntity).then((response) => {
          this.$message({
            type: "success",
            message: "修改成功!",
          });
          this.categoryEntity = {};
          this.getAllCategoryWithTree();
        });
      } else {
        category.saveCategory(this.categoryEntity).then((response) => {
          this.$message({
            type: "success",
            message: "添加成功!",
          });
          this.categoryEntity = {};
          this.getAllCategoryWithTree();
        });
      }
    },

    getAllCategoryWithTree() {
      category.getAllCategoryWithTree().then((response) => {
        this.data = response.data.items;
      });
    },

    filterNode(value, data) {
      if (!value) return true;
      return data.title.toLowerCase().indexOf(value.toLowerCase()) !== -1;
    },
  },
};
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
</style>