<template>
  <div class="app-container">
    <div class="y-flex">
      <el-table
        v-loading="listLoading"
        :data="goodsList"
        element-loading-text="Loading"
        style="max-width: 916px"
        border
        fit
        highlight-current-row
      >
        <el-table-column align="center" label="ID" width="95" prop="goodsId">
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
        <el-table-column label="原价" width="110" align="center" prop="originalPrice">
          <template slot-scope="scope">
            {{ scope.row.originalPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="优惠价" width="110" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ scope.row.discountPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="会员价" width="110" align="center" prop="discountPrice">
          <template slot-scope="scope">
            {{ scope.row.memberPrice.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column label="库存" width="110" align="center" prop="inventory">
          <template slot-scope="scope">
            {{ scope.row.inventory }}
          </template>
        </el-table-column>
        <el-table-column label="已售" width="110" align="center" prop="saleVolume">
          <template slot-scope="scope">
            {{ scope.row.saleVolume }}
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
      <div class="goods-pagination y-center__between">
        <el-button size="mini" type="primary" @click="addNewGoods">新增</el-button>
        <el-pagination
          background
          layout="prev, pager, next"
          :hide-on-single-page="true"
          :page-size="pGetGoodsList.pagingSize"
          :current-page="pGetGoodsList.currentPage + 1"
          :total="count"
          @current-change="getGoodsList"
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
    <el-dialog
      title="温馨提示"
      :visible.sync="showDelDialog"
      width="300px"
      center>
      <span class="xy-center" style="font-size: 18px; font-weight: 500;">您确认删除该宠物吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDelDialog = false">取 消</el-button>
        <el-button type="primary" @click="handlerDelete">确 定</el-button>
      </span>
    </el-dialog>
    <edit-goods-info-dialog
      v-if="showEditDialog"
      :show="showEditDialog"
      :goods="goodsList[selectedIndex]"
      :is-new="isAdd"
      @close="showEditDialog = false"
      @new-close="isAdd = false"
      @update="handlerUpdate"
    />
  </div>
</template>

<script>
import AuditDialog from '@/components/AuditDialog'
import { pGetGoodsList } from '@/api/goods/params'
import EditGoodsInfoDialog from '@/components/EditGoodsInfoDialog'

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
    AuditDialog,
    EditGoodsInfoDialog
  },
  data() {
    return {
      list: null,
      listLoading: true,
      goodsList: [],
      showAuditDialog: false,
      auditType: '',
      selectedIndex: -1,
      selectedRecordId: 0,
      pGetGoodsList: pGetGoodsList(),
      count: 10,
      showDelDialog: false,
      showEditDialog: false,
      isAdd: false
      // selectedExchangeId: 0
    }
  },
  created() {
    // this.fetchData()
    this.getGoodsList()
  },
  methods: {
    getGoodsList(curPage = 1) {
      this.pGetGoodsList.currentPage = curPage - 1
      this.$api.goods.getGoodsList(this.pGetGoodsList).then(({ goodsList, count }) => {
        this.goodsList = goodsList
        this.count = count
      }).finally(() => {
        this.listLoading = false
      })
    },
    beforeDelete(index) {
      this.selectedIndex = index
      this.showDelDialog = true
    },
    beforeEdit(index) {
      this.selectedIndex = index
      this.$nextTick(() => {
        this.showEditDialog = true
      })
    },
    handlerDelete() {
      this.$api.goods.deleteGoods(this.goodsList[this.selectedIndex].goodsId).then(() => {
        this.showDelDialog = false
        this.goodsList.splice(this.selectedIndex, 1)
        this.count -= 1
      })
    },
    showAudit(type, recordId, index) {
      this.auditType = type
      this.showAuditDialog = true
      this.selectedIndex = index
      this.selectedRecordId = recordId
      // this.selectedExchangeId = exchangeId
    },
    confirm(index) {
      this.applyList.splice(index, 1)
      this.showAuditDialog = false
    },
    handlerUpdate(item, isAdd = false) {
      if (isAdd) {
        this.goodsList.push(item)
      } else {
        this.$set(this.goodsList, this.selectedIndex, item)
      }
    },
    addNewGoods() {
      this.isAdd = true
      this.showEditDialog = true
    }
  }
}
</script>

<style lang="scss">
@import "./src/styles/css库.scss";

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
  width: 916px;
  position: fixed;
  margin-left: auto;
}
</style>
