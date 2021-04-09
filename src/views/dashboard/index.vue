<template>
  <div class="app-container">
    <div class="y-flex">
      <el-table
        v-loading="listLoading"
        :data="adminList"
        element-loading-text="Loading"
        style="width: 991px"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户id" width="180" prop="orderId">
          <template slot-scope="scope">
            {{ scope.row.adminId }}
          </template>
        </el-table-column>
        <el-table-column label="头像" width="110" align="center">
          <template slot-scope="scope">
            <div class="apply-user yx-center">
              <img :src="scope.row.avatarUrl | addGoodsImagePrefix">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.email }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" width="180" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160">
          <template slot-scope="scope">
            <div class="y-center__between">
              <el-button size="mini" type="primary" @click="beforeEdit(scope.$index)">编辑</el-button>
              <el-button size="mini" type="danger" @click="beforeDelete(scope.$index)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="admin-pagination y-center__between">
        <el-button size="mini" type="primary" @click="addNewAdmin">新增</el-button>
        <el-pagination
          background
          layout="prev, pager, next"
          :hide-on-single-page="false"
          :page-size="pGetGoodsList.pagingSize"
          :current-page="pGetGoodsList.currentPage + 1"
          :total="count"
          @current-change="getUserList"
        >
        </el-pagination>
      </div>
      <edit-admin-info-dialog
        v-if="showEditDialog"
        :show="showEditDialog"
        :goods="adminList[selectedIndex]"
        :is-new="isAdd"
        @close="showEditDialog = false"
        @new-close="isAdd = false"
        @update="handlerUpdate"/>
      <el-dialog
        title="温馨提示"
        :visible.sync="showDelDialog"
        width="300px"
        center>
        <span class="xy-center" style="font-size: 18px; font-weight: 500;">您确认删除该管理员吗？</span>
        <span slot="footer" class="dialog-footer">
        <el-button @click="showDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlerDelete">确 定</el-button>
      </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { pGetGoodsList } from '@/api/goods/params'
import EditAdminInfoDialog from '@/components/EditAdminInfoDialog';

export default {
  components: { EditAdminInfoDialog },
  data() {
    return {
      listLoading: true,
      adminList: [],
      pGetGoodsList: pGetGoodsList(),
      count: 10,
      mergeOptions: {},
      selectedIndex: -1,
      selectedRecordId: 0,
      showDelDialog: false,
      showEditDialog: false,
      isAdd: false
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(curPage = 1) {
      this.pGetGoodsList.currentPage = curPage - 1
      this.$api.user.getAdminList(this.pGetGoodsList).then(({ adminList, count }) => {
        this.adminList = adminList
        this.count = count
      }).finally(() => {
        this.listLoading = false
      })
    },
    handlerUpdate(item, isAdd = false) {
      if (isAdd) {
        this.adminList.push(item)
      } else {
        this.$set(this.adminList, this.selectedIndex, item)
      }
    },
    addNewAdmin() {
      this.isAdd = true
      this.showEditDialog = true
    },
    beforeEdit(index) {
      this.selectedIndex = index
      this.$nextTick(() => {
        this.showEditDialog = true
      })
    },
    handlerDelete() {
      this.$api.user.deleteAdmin( { adminId: this.adminList[this.selectedIndex].adminId }).then(() => {
        this.showDelDialog = false
        this.adminList.splice(this.selectedIndex, 1)
        this.count -= 1
      })
    },
    beforeDelete(index) {
      this.selectedIndex = index
      this.showDelDialog = true
    }
  }
}
</script>

<style lang="scss">
.red-packet {
  img {
    width: 47px;
    height: 79px;
    margin-bottom: 10px;
  }
}

.apply-user {
  img {
    width: 30px;
    height: 30px;
    margin-bottom: 10px;
    border-radius: 100%;
  }
}

.admin-pagination {
  bottom: 10px;
  width: 990px;
  position: fixed;
  margin-left: auto;
  justify-content: space-between !important;
}
</style>

