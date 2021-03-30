<template>
  <el-dialog title="编辑商品详情" :visible="show" class="edit-goods-info" @close="$emit('close')">
    <el-form ref="goodsForm" :model="tempGoods" :rules="rules" label-width="100px" >
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="tempGoods.goodsName" />
      </el-form-item>
      <el-form-item label="商品描述" prop="goodsName">
        <el-input v-model="tempGoods.goodsInfo.intro" />
      </el-form-item>
      <div class="el-row">
        <el-form-item class="el-col-12" label="原价" prop="name">
          <el-input-number v-model="tempGoods.originalPrice" :precision="2" :step="0.1" :min="0.01" />
        </el-form-item>
        <el-form-item class="el-col-12" label="优惠价" prop="name">
          <el-input-number v-model="tempGoods.discountPrice" :precision="2" :step="0.1" :min="0.01" />
        </el-form-item>
        <el-form-item class="el-col-12" label="会员价" prop="name">
          <el-input-number v-model="tempGoods.memberPrice" :precision="2" :step="0.1" :min="0.01" />
        </el-form-item>
        <el-form-item class="el-col-12" label="库存" prop="name">
          <el-input-number v-model="tempGoods.inventory" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item class="el-col-12" label="是否上架" prop="delivery">
          <el-switch v-model="tempGoods.delivery" />
        </el-form-item>
        <el-form-item class="el-col-12" label="运费" prop="delivery">
          <el-input-number v-model="tempGoods.goodsInfo.postage" :precision="2" :step="0.1" :min="0.01" />
        </el-form-item>
      </div>
      <el-form-item label="商品主图" prop="name">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :file-list="masterImgList"
          :on-remove="handleRemove"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述图" prop="name">
        <el-upload
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card"
          :auto-upload="false"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgList"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <!--      <el-form-item>-->
      <!--        <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>-->
      <!--        <el-button @click="resetForm('ruleForm')">重置</el-button>-->
      <!--      </el-form-item>-->
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="$emit('close')">取 消</el-button>
      <el-button type="primary" @click="submitForm('goodsForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tempGoods: {
        discountPrice: 1,
        goodsId: '',
        goodsName: '',
        inventory: 0,
        masterImg: '',
        memberPrice: 1,
        originalPrice: 1,
        saleVolume: 1,
        goodsInfo: {
          imgList: []
        }
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    masterImgList() {
      return [{ url: this.tempGoods.masterImg }]
    },
    imgList() {
      const arr = []
      this.tempGoods.goodsInfo.imgList.forEach(url => {
        arr.push({ url })
      })
      return arr
    }
  },
  watch: {
    goods: {
      handler(val) {
        console.log(val)
        this.tempGoods = {
          ...val
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          // alert('submit!')
          await this.$api.goods.updateGoodsInfo(this.tempGoods)
          this.$emit('update', this.tempGoods)
          this.$emit('close')
        } else {
          // console.log('error submit!!')
          return false
        }
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss">
.edit-goods-info {
  .el-dialog {
    width: 800px;
  }
  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  .el-upload-list--picture-card {
    .el-upload-list__item{
      width: 80px !important;
      height: 80px !important;
    }
  }
}
</style>
