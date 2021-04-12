<template>
  <div class="app-container">
    <div class="y-flex">
      <el-table
        v-loading="listLoading"
        :data="orderList"
        element-loading-text="Loading"
        style="width: 1406px"
        border
        fit
        highlight-current-row
        :span-method="objectSpanMethod"
      >
        <el-table-column align="center" label="订单id" width="200" prop="orderId">
          <template slot-scope="scope">
            {{ scope.row.orderId }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="宠物id" width="95" prop="goodsId">
          <template slot-scope="scope">
            {{ scope.row.goodsId }}
          </template>
        </el-table-column>
        <el-table-column label="宠物" width="110" align="center">
          <template slot-scope="scope">
            <div class="apply-user yx-center">
              <img :src="scope.row.masterImg | addGoodsImagePrefix">
              <span>{{ scope.row.goodsName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单价" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.discountPrice }}
          </template>
        </el-table-column>
        <el-table-column label="数量" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.purchaseNum }}
          </template>
        </el-table-column>
        <el-table-column label="小计" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.totalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="共计/样" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.totalNum }}
          </template>
        </el-table-column>
        <el-table-column label="总金额" width="110" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ scope.row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="用户" width="110" align="center">
          <template slot-scope="scope">
            <div class="apply-user yx-center">
              <img :src="scope.row.userInfo.avatarUrl | addImagePrefix">
              <span>{{ scope.row.userInfo.nickName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" width="180" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ scope.row.createdAt | formatDate }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="160">
          <template slot-scope="scope">
            <div class="xy-center">
              <el-tag :type="scope.row.paymentState | statusFilter">{{scope.row.paymentState | statusLabelFilter}}</el-tag>
            </div>
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
          @current-change="getOrderList"
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
      orderList: [],
      pGetGoodsList: pGetGoodsList(),
      count: 10,
      mergeOptions: {}
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    getOrderList(curPage = 1) {
      this.pGetGoodsList.currentPage = curPage - 1
      this.$api.order.getOrderList(this.pGetGoodsList).then(({ orderList, count }) => {
        this.orderList = this.dealOrderList(orderList)
        this.count = count
      }).finally(() => {
        this.listLoading = false
      })
    },
    dealOrderList(orderList = []) {
      const arr = []
      let curRow = 0
      orderList.forEach(order => {
        const temp = { ...order }
        delete temp.goodsList
        this.mergeStrategy(curRow, order.goodsList.length)
        order.goodsList.forEach(goods => {
          arr.push({
            ...temp,
            ...goods
          })
          ++curRow
          this.mergeStrategy(curRow, 0)
        })
      })
      return arr
    },
    mergeStrategy(row, length) {
      this.mergeOptions[row] = length
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.mergeOptions[rowIndex] || this.mergeOptions[rowIndex] === 0) {
        if (columnIndex === 0 || columnIndex === 6 || columnIndex === 7) {
          return {
            rowspan: this.mergeOptions[rowIndex],
            colspan: this.mergeOptions[rowIndex] === 0 ? 0 : 1
          }
        }
      }
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
  width: 1406px;
  position: fixed;
  margin-left: auto;
  justify-content: flex-end;
}
</style>
