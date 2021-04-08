<template>
  <div class="app-container">
    <div class="y-flex">
      <el-table
        v-loading="listLoading"
        :data="serviceList"
        element-loading-text="Loading"
        style="width: 1541px"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="订单id" width="150" prop="orderId">
          <template slot-scope="scope">
            {{ scope.row.serviceId }}
          </template>
        </el-table-column>
        <el-table-column label="宠物图片" width="110" align="center">
          <template slot-scope="scope">
            <div class="apply-user yx-center">
              <img :src="scope.row.url | addGoodsImagePrefix">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务名称" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.name }}
          </template>
        </el-table-column>
        <el-table-column label="基础服务" width="150" align="center" prop="saleVolume">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.basic" :key="index" class="yx-center">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="健康服务" width="150" align="center" prop="saleVolume">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.health" :key="index" class="yx-center">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="贴心服务" width="150" align="center" prop="saleVolume">
          <template slot-scope="scope">
            <div v-for="(item, index) in scope.row.intimate" :key="index" class="yx-center">
              {{ item }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="服务地址" width="180" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.address && scope.row.address.completedAddress }}
          </template>
        </el-table-column>
        <el-table-column label="服务时间" width="110" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ (new Date(scope.row.date)).format().substring(0, 10)}}
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
        <el-table-column align="center" label="审核状态" width="140">
          <template slot-scope="scope">
            <div class="y-center__between" v-if="scope.row.status === 0">
              <el-button size="mini" type="primary" @click="showAudit('approve', scope.row.serviceId, scope.$index)">通过</el-button>
              <el-button size="mini" type="danger" @click="showAudit('reject', scope.row.serviceId, scope.$index)">拒绝</el-button>
            </div>
            <div class="xy-center" v-if="scope.row.status === 1">
              <el-tag type="success">审核通过</el-tag>
            </div>
            <div class="xy-center" v-if="scope.row.status === 2">
              <el-tag type="danger">{{scope.row.remark}}</el-tag>
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
          @current-change="getServiceList"
        >
        </el-pagination>
      </div>
    </div>
    <audit-dialog
      v-if="showAuditDialog"
      :show="showAuditDialog"
      :type="auditType"
      :index="selectedIndex"
      :record-id="selectedRecordId"
      @confirm="confirm"
      @close="showAuditDialog = false"
    />
  </div>
</template>

<script>
import AuditDialog from '@/components/AuditDialog'
import { pGetGoodsList } from '@/api/goods/params'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        1: 'success',
        2: 'danger'
      }
      return statusMap[status]
    },
    statusLabelFilter(status) {
      const statusMap = {
        1: '审核通过',
        2: '审核失败'
      }
      return statusMap[status]
    }
  },
  components: {
    AuditDialog
  },
  data() {
    return {
      listLoading: true,
      serviceList: [],
      pGetGoodsList: pGetGoodsList(),
      count: 10,
      mergeOptions: {},
      showAuditDialog: false,
      auditType: '',
      selectedIndex: -1,
      selectedRecordId: 0
    }
  },
  created() {
    this.getServiceList()
  },
  methods: {
    getServiceList(curPage = 1) {
      this.pGetGoodsList.currentPage = curPage - 1
      this.$api.service.getServiceList(this.pGetGoodsList).then(({ orderList, count }) => {
        this.serviceList = orderList
        this.count = count
      }).finally(() => {
        this.listLoading = false
      })
    },
    showAudit(type, recordId, index) {
      this.auditType = type
      this.showAuditDialog = true
      this.selectedIndex = index
      this.selectedRecordId = recordId
    },
    confirm(index) {
      this.showAuditDialog = false
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
  width: 1541px;
  position: fixed;
  margin-left: auto;
  justify-content: flex-end;
}
</style>
