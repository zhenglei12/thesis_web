<template>
  <a-modal
    :visible="visible"
    title="修改状态"
    destroyOnClose
    :maskClosable="false"
    :confirmLoading="loading"
    @cancel="close"
    @ok="submit"
  >
    <a-form-model
      ref="form"
      :model="form"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 19 }"
    >
      <a-form-model-item label="状态">
        <!-- <a-input v-model="form.roles" allow-clear /> -->
        <a-select
          v-model="form.status"
          allowClear
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option
            v-for="(option, index) in statusList"
            :key="index"
            :value="option.value"
          >
            {{ option.label }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import Utils from "../../libs/utils";
import { orderStatusMap } from "./mapping";

export default {
  mixins: [editMixin],
  data() {
    return {
      loading: false,
      statusList: Utils.mapToArray(orderStatusMap),
      form: {},
    };
  },
  watch: {
    visible(e) {
      if (e) {
        this.form = {
          id: this.R.id,
          status: this.R.status,
        };
      }
    },
  },
  methods: {
    submit() {
      this.loading = true;
      OrderApi.status({ ...this.form })
        .then((res) => {
          this.$message.success("保存成功");
          this.$emit("refresh", res);
          this.close();
        })
        .finally(() => (this.loading = false));
    },
  },
};
</script>