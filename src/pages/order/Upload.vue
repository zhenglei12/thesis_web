<template>
  <a-modal
    :visible="visible"
    title="上传稿件"
    destroyOnClose
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
      <a-form-model-item label="内容类型" required>
        <a-select
          v-model="form.classify_id"
          allowClear
          :dropdownMatchSelectWidth="false"
        >
          <a-select-option
            v-for="(option, index) in classifyList"
            :key="index"
            :value="option.id"
          >
            {{ option.name }}
          </a-select-option>
        </a-select>
      </a-form-model-item>
      <a-form-model-item label="字数" required>
        <a-input-number v-model="form.alter_word" :min="0" :precision="0" />
      </a-form-model-item>
      <a-upload-dragger
        :fileList="fileList"
        :customRequest="request"
        :remove="remove"
      >
        <p class="ant-upload-drag-icon">
          <a-icon type="inbox" />
        </p>
        <p class="ant-upload-text">点击或拖拽文件到此区域</p>
      </a-upload-dragger>
    </a-form-model>
  </a-modal>
</template>

<script>
import editMixin from "../../mixins/edit";
import OrderApi from "../../apis/order";
import upload from "../../libs/upload";

export default {
  mixins: [editMixin],
  props: {
    classifyList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      fileList: [],
      // fileType: ["xls", "xlsx", "csv"],
      form: {},
    };
  },
  watch: {
    visible() {
      this.form = {
        id: this.R,
      };
    },
  },
  methods: {
    // beforeUpload(e) {
    //   let type = e.name.substring(e.name.lastIndexOf(".") + 1);
    //   if (!~this.fileType.indexOf(type.toLowerCase())) {
    //     this.$message.error(`文件${e.name}上传失败,不支持该文件类型!`);
    //     e.status = "unqualified";
    //     return false;
    //   }
    //   return true;
    // },
    remove() {
      this.fileList = [];
    },
    request(e) {
      this.fileList = [e.file];
    },
    submit() {
      this.loading = true;
      upload.uploadList(this.fileList, ["lywang"]).then(() => {
        this.form.manuscript = upload.getRources(this.fileList)[0];
        OrderApi.upload({ ...this.form })
          .then((res) => {
            this.$message.success("保存成功");
            this.$emit("refresh", res);
            this.close();
          })
          .finally(() => (this.loading = false));
      });
    },
  },
};
</script>
