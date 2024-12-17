<template>
  <a-modal
    :visible="visible"
    title="尾款核验"
    destroyOnClose
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 19 }">
      <a-form-model-item label="尾款核验" required>
        <a-select v-model="form.hard_grade" allowClear :dropdownMatchSelectWidth="false">
          <a-select-option v-for="(option, index) in options" :key="index" :value="option">
            {{ option }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      form: {},
      options: [
        "已结清",
        "正文未开始",
        "稿件已完成待追尾款",
        "等通知",
        "等客户资料",
        "未到交稿时间",
        "分三次付款",
        "未交稿",
        "需求改变",
        "售后中（需调价/退款）",
      ],
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
          hard_grade: this.R.hard_grade,
        };
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      OrderApi.grade({ ...this.form })
        .then((res) => {
          this.$message.success("操作成功");
          this.$emit("refresh", res);
          this.close();
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>
