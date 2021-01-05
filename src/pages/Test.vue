<template>
  <div>
    <a-upload
      :fileList="fileList"
      :beforeUpload="beforeUpload"
      :customRequest="request"
      :remove="remove"
    >
      <a-button>上传</a-button>
    </a-upload>
  </div>
</template>

<script>
import upload from "../libs/upload";

export default {
  data() {
    return {
      fileList: [],
      fileType: ["png"],
    };
  },
  methods: {
    test() {
      upload.uploadFile().then((res) => {
        console.log(res);
      });
    },
    beforeUpload(e) {
      let type = e.name.substring(e.name.lastIndexOf(".") + 1);
      if (!~this.fileType.indexOf(type.toLowerCase())) {
        this.$message.error(`文件${e.name}上传失败,不支持该文件类型!`);
        e.status = "unqualified";
        return false;
      }
      return true;
    },
    remove() {
      this.fileList = [];
    },
    request(e) {
      this.fileList = [e.file];
      console.log(e);
      upload.uploadFile(e.file, ["cherishlin"]).then((res) => {
        console.log(res);
      });
    },
  },
};
</script>

<style lang="less" scoped>
/deep/ .ant-upload-list-text {
  width: 200px;
}
</style>