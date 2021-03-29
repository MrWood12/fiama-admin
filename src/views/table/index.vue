<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="applyList"
      element-loading-text="Loading"
      style="max-width: 936px"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="申请人" width="110" align="center">
        <template slot-scope="scope">
          <div class="apply-user yx-center">
            <img :src="scope.row.user.userInfo.avatarUrl">
            <span>{{ scope.row.user.userInfo.nickName }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.name }}
        </template>
      </el-table-column>
      <el-table-column label="账户余额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.user.account.toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="提现金额" width="110" align="center">
        <template slot-scope="scope">
          {{ scope.row.withdraw.value }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="申请时间" width="200">
        <template slot-scope="scope">
          <!--          <i class="el-icon-time" />-->
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="160">
        <template slot-scope="scope">
          <div class="y-center__between">
            <el-button size="mini" type="primary" @click="showAudit('approved',scope.row.exchangeId, scope.$index)">通过</el-button>
            <el-button size="mini" type="danger" @click="showAudit('refuse',scope.row.exchangeId, scope.$index)">拒绝</el-button>
          </div>
          <!--          <i class="el-icon-time" />-->
          <!--          <span>{{ scope.row.createTime | formatDate }}</span>-->
        </template>
      </el-table-column>
    </el-table>
    <audit-dialog
      v-if="showAuditDialog"
      :show="showAuditDialog"
      :type="auditType"
      :index="selectedIndex"
      :exchange-id="selectedExchangeId"
      @confirm="confirm"
      @close="showAuditDialog = false"
    />
  </div>
</template>

<script>
import AuditDialog from '@/components/AuditDialog'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  components: {
    AuditDialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
      applyList: [],
      showAuditDialog: false,
      auditType: '',
      selectedIndex: 0,
      selectedExchangeId: 0
    }
  },
  created() {
    // this.fetchData()
    this.getApplyList()
  },
  methods: {
    // fetchData() {
    //   this.listLoading = true
    //   getList().then(response => {
    //     this.list = response.data.items
    //     this.listLoading = false
    //   })
    // }
    getApplyList() {
      this.$api.withdraw.applyList().then(({ applyingList }) => {
        this.applyList = applyingList
      }).finally(() => {
        this.listLoading = false
      })
    },
    showAudit(type, exchangeId, index) {
      this.auditType = type
      this.showAuditDialog = true
      this.selectedIndex = index
      this.selectedExchangeId = exchangeId
    },
    confirm(index) {
      this.applyList.splice(index, 1)
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
</style>
