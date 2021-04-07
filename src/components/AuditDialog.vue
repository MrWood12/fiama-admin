<template>
  <el-dialog
    :title="type === 'approve' ? '审核通过' : '审核不通过'"
    :visible="show"
    :center="true"
    @close="$emit('close')"
    width="400px">
    <el-form :model="ruleForm" :rules="rules" ref="auditForm" class="demo-ruleForm">
      <el-form-item label="备注" prop="remark">
        <el-input v-model="ruleForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
    <el-button @click="$emit('close')">取 消</el-button>
    <el-button type="primary" @click="submitForm">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'AuditDialog',
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        exchangeCode: '',
        remark: ''
      }
    }
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'approved'
    },
    recordId: {
      type: Number
    },
    index: {
      type: Number
    }
  },
  methods: {
    submitForm() {
      this.$refs.auditForm.validate((valid) => {
        if (valid) {
          // alert('submit!')
          this.approved()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    approved() {
      this.$api.service[this.type]({
        serviceId: this.recordId,
        remark: this.ruleForm.remark
      }).then(res => {
        this.$tips.success('审核成功')
        this.$emit('confirm', this.index)
      })
    }
  }
}
</script>
