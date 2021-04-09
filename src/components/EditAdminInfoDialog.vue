<template>
  <el-dialog
    :title="isNew ? '新增管理员' : '编辑管理员'"
    :visible="show"
    class="edit-goods-info"
    @close="$emit('close')"
  >
    <el-form
      ref="goodsForm"
      :model="tempInfo"
      :rules="rules"
      label-width="50px"
    >
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="tempInfo.email" :disabled="!isNew" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="tempInfo.password" />
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="tempInfo.nickName" />
      </el-form-item>
      <el-form-item label="头像" prop="avatarUrl">
        <el-upload
          list-type="picture-card"
          name="file"
          :on-preview="handlePictureCardPreview"
          :file-list="imgList"
          :on-remove="handleRemoveMaster"
          :action="uploadUrl"
          :on-success="handleMasterSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
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
      default: () => {
      }
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
      tempInfo: {
        email: '',
        password: '',
        nickName: '',
        avatarUrl: ''
      },
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        nickName: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
      },
      uploadUrl: BASE_URL + '/goods/upload-image',
      headers: {
        Authorization: dataStore.getToken() || ''
      },
      tempImageList: []
    }
  },
  computed: {
    imgList() {
      if (!this.tempInfo.avatarUrl) {
        return []
      }
      const url = this.tempInfo.avatarUrl.includes('http')
        ? this.tempInfo.avatarUrl
        : GOODS_IMAGE_URL + this.tempInfo.avatarUrl
      return [{ url }]
    }
  },
  watch: {
    goods: {
      handler(val) {
        if (!this.isNew) {
          console.log(val)
          this.tempInfo = {
            ...val
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
          if (this.isNew) {
            this.tempInfo.goodsType = this.goodsType
            await this.$api.user.addAdmin(this.tempInfo).then((res) => {
              this.$emit('update', res, true)
            })
            this.$emit('new-close')
          } else {
            await this.$api.user.updateAdmin(this.tempInfo)
            this.$emit('update', this.tempInfo)
          }
          this.$emit('close')
        } else {
          return false
        }
      })
    },
    checkCanSubmit() {
      if (!this.tempInfo.avatarUrl) {
        this.$tips.error('请先上传头像')
        return false
      }
      return true
    },
    handleRemoveMaster(file, fileList) {
      if (file.status === 'success') {
        this.tempInfo.avatarUrl = ''
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleMasterSuccess(res) {
      this.tempInfo.avatarUrl = res.data.url
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
        Authorization: dataStore.getToken() || ''
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
    width: 600px;
  }

  .el-upload--picture-card {
    width: 80px;
    height: 80px;
    line-height: 80px;
  }

  .el-upload-list--picture-card {
    .el-upload-list__item {
      width: 80px !important;
      height: 80px !important;
    }
  }
}
</style>
