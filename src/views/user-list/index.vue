<template>
  <div class="app-container">
    <div class="y-flex">
      <el-table
        v-loading="listLoading"
        :data="userList"
        element-loading-text="Loading"
        style="width: 831px"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="用户id" width="180" prop="orderId">
          <template slot-scope="scope">
            {{ scope.row.userId }}
          </template>
        </el-table-column>
        <el-table-column label="头像" width="110" align="center">
          <template slot-scope="scope">
            <div class="apply-user yx-center">
              <img :src="scope.row.userInfo.avatarUrl">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="昵称" width="180" align="center">
          <template slot-scope="scope">
            {{ scope.row.userInfo.nickName }}
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
      </el-table>
      <div class="goods-pagination y-center__between">
        <el-pagination
          background
          layout="prev, pager, next"
          :hide-on-single-page="true"
          :page-size="pGetGoodsList.pagingSize"
          :current-page="pGetGoodsList.currentPage + 1"
          :total="count"
          @current-change="getUserList"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { pGetGoodsList } from '@/api/goods/params'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        UNPAID: 'gray',
        SUCCESSED: 'success',
        FAILED: 'danger'
      }
      return statusMap[status]
    },
    statusLabelFilter(status) {
      const statusMap = {
        UNPAID: '待支付',
        SUCCESSED: '支付成功',
        FAILED: '支付失败'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      userList: [],
      pGetGoodsList: pGetGoodsList(),
      count: 10,
      mergeOptions: {}
    }
  },
  created() {
    this.getUserList()
  },
  methods: {
    getUserList(curPage = 1) {
      this.pGetGoodsList.currentPage = curPage - 1
      this.$api.user.getUserList(this.pGetGoodsList).then(({ userList, count }) => {
        this.userList = userList
        this.count = count
      }).finally(() => {
        this.listLoading = false
      })
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

.goods-pagination {
  bottom: 10px;
  width: 830px;
  position: fixed;
  margin-left: auto;
  justify-content: flex-end;
}
</style>
