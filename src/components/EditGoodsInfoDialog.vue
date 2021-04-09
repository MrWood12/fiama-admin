<template>
  <el-dialog :title="`${isNew ? '新增' : '编辑'}${goodsType === 1 ? '宠物g' : '工具'}`" :visible="show" class="edit-goods-info" @close="$emit('close')">
    <el-form ref="goodsForm" :model="tempGoods" :rules="rules" label-width="100px">
      <el-form-item label="商品名称" prop="goodsName">
        <el-input v-model="tempGoods.goodsName" />
      </el-form-item>
      <el-form-item label="商品描述" prop="intro">
        <el-input v-model="tempGoods.intro" />
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
          list-type="picture-card"
          name="file"
          :on-preview="handlePictureCardPreview"
          :file-list="masterImgList"
          :on-remove="handleRemoveMaster"
          :action="uploadUrl"
          :on-success="handleMasterSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="商品描述图" prop="name">
        <el-upload
          list-type="picture-card"
          name="file"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="imgList"
          :action="uploadUrl"
          :on-success="handlerSuccess"
          :before-upload="beforeAvatarUpload"
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
import dataStore from '@/utils/dataStore'
import { BASE_URL, GOODS_IMAGE_URL } from '@/config'

export default {
  props: {
    goods: {
      type: Object,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    isNew: {
      type: Boolean,
      default: false
    },
    goodsType: {
      type: Number,
      default: 1
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
          imgList: [],
          postage: 1
        },
        intro: ''
      },
      rules: {
        goodsName: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        intro: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ]
      },
      uploadUrl: BASE_URL + '/goods/upload-image',
      headers: {
        'Authorization': dataStore.getToken() || ''
      },
      tempImageList: []
    }
  },
  computed: {
    masterImgList() {
      if (!this.tempGoods.masterImg) {
        return []
      }
      const url = this.tempGoods.masterImg.includes('http') ? this.tempGoods.masterImg : GOODS_IMAGE_URL + this.tempGoods.masterImg
      return [{ url }]
    },
    imgList() {
      const arr = []
      this.tempGoods.goodsInfo.imgList.forEach(url => {
        url = url.includes('http') ? url : GOODS_IMAGE_URL + url
        arr.push({ url })
      })
      return arr
    }
  },
  watch: {
    goods: {
      handler(val) {
        if (!this.isNew) {
          console.log(val)
          this.tempGoods = {
            ...val,
            intro: val.goodsInfo.intro
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          if (!this.checkCanSubmit()) {
            return false
          }
          this.getImgList()
          if (this.isNew) {
            this.tempGoods.goodsType = this.goodsType
            await this.$api.goods.addGoods(this.tempGoods).then(res => {
              this.$emit('update', res.goodsItem, true)
            })
            this.$emit('new-close')
          } else {
            await this.$api.goods.updateGoodsInfo(this.tempGoods)
            this.$emit('update', this.tempGoods)
          }
          this.$emit('close')
        } else {
          return false
        }
      })
    },
    checkCanSubmit() {
      if (!this.tempGoods.masterImg) {
        this.$tips.error('请先上传主图')
        return false
      }
      console.log(this.tempGoods.goodsInfo.imgList, this.tempImageList)
      if (!this.tempGoods.goodsInfo.imgList) {
        this.$tips.error('至少上传一张描述图')
        return false
      }
      this.tempGoods.goodsInfo.intro = this.tempGoods.intro
      return true
    },
    getImgList() {
      for (let i = 0; i < this.tempImageList.length; i++) {
        this.tempImageList[i].url = this.tempImageList[i].url.replace(GOODS_IMAGE_URL, '')
      }
      this.tempGoods.goodsInfo.imgList = this.tempImageList.map(item => {
        return item.url
      })
    },
    handleRemoveMaster(file, fileList) {
      if (file.status === 'success') {
        this.tempGoods.masterImg = ''
      }
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      const url = file.url.replace(GOODS_IMAGE_URL, '')
      const index = this.tempGoods.goodsInfo.imgList.find(item => item === url)
      if (index !== -1) {
        this.tempGoods.goodsInfo.imgList.splice(index, 1)
      }
      this.tempImageList = fileList
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleMasterSuccess(res) {
      console.log(res)
      this.tempGoods.masterImg = res.data.url
      // this.isUploading = false
      // this.$emit('onUpload', this.imageUrl, res.data.avatarUrl)
    },
    handlerSuccess(res) {
      this.tempImageList.push({
        url: res.data.url
      })
      this.tempGoods.goodsInfo.imgList.push(res.data.url)
    },
    beforeAvatarUpload(file) {
      // console.log(file.type)
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      this.isUploading = true
      return isJPG && isLt2M
    },
    getToken() {
      return {
        'Authorization': dataStore.getToken() || ''
      }
    },
    onSuccess(res) {
      console.log(res)
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
