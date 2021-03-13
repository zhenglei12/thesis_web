
<template>
  <div>
    <div class="cus-table-header">
      <list-search
        v-model="search"
        :condition="condition"
        :collection="collection"
      ></list-search>
    </div>
    <div class="cus-table-header">
      <div class="statistic">
        <span v-if="statistic" v-acl="'order-statistics'">
          <span>总金额：{{ statistic.amount_count }}</span>
          <span>已回收金额：{{ statistic.received_amount_count }}</span>
          <span>本月总金额：{{ statistic.month_amount_count }}</span>
          <span>已回收金额：{{ statistic.month_received_amount_count }}</span>
        </span>
        <span v-if="numbers" v-acl="'order-count.num'"
          >文字统计：{{ numbers }}</span
        >
      </div>
      <a-button v-acl="'order-add'" type="primary" @click="toEdit()"
        >新增</a-button
      >
    </div>
    <a-table
      :columns="columns"
      :data-source="collection.list"
      :loading="collection.loading"
      :pagination="{
        total: collection.total,
        current: collection.page,
        pageSize: collection.pageSize,
        showSizeChanger: true,
      }"
      :rowClassName="getRowClass"
      bordered
      rowKey="id"
      @change="listChange"
    >
      <template slot="type" slot-scope="data">
        {{ taskTypeMap[data] }}
      </template>
      <template slot="user" slot-scope="data">
        <p>名称：{{ data.name }}</p>
        <!-- <p>电话：{{ data.phone }}</p> -->
        <p>旺旺名：{{ data.want_name }}</p>
      </template>
      <template slot="money" slot-scope="data">
        {{
          data.amount - data.received_amount > 0
            ? data.amount - data.received_amount
            : "已结清"
        }}
      </template>
      <template slot="image" slot-scope="data">
        <img
          v-if="data"
          :src="data"
          alt="图片"
          class="image"
          @click="toPreview(data)"
        />
      </template>
      <template slot="ask" slot-scope="data">
        <a v-if="data" @click="toDownload(data)">下载附件</a>
        <span v-else>无附件</span>
      </template>
      <template slot="status" slot-scope="data">
        {{ orderStatusMap[data] }}
      </template>
      <template slot="file" slot-scope="data">
        <a v-if="data" @click="toDownload(data)">下载稿件</a>
        <span v-else>未提交</span>
      </template>
      <template slot="operate" slot-scope="data">
        <div class="cus-nowrap">
          <span v-acl="'order-update'">
            <a-icon type="edit" title="编辑" @click="toEdit(data)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-edit.name'">
            <a-icon type="api" title="分配编辑" @click="toAllot(data.id)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-manuscript'">
            <a-icon type="upload" title="上传稿件" @click="toUpload(data.id)" />
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-delete'">
            <a-popconfirm title="确认删除？" @confirm="toDelete(data.id)">
              <a-icon type="delete" title="删除" />
            </a-popconfirm>
            <a-divider type="vertical"></a-divider>
          </span>
          <span v-acl="'order-status'">
            <a-icon type="swap" title="修改状态" @click="toStatus(data)" />
          </span>
        </div>
      </template>
    </a-table>

    <!-- 编辑 -->
    <cus-edit v-model="editVisible" :data="temp" @refresh="_getList"></cus-edit>

    <!-- 分配编辑 -->
    <cus-allot
      v-model="allotVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-allot>

    <!-- 修改状态 -->
    <cus-status
      v-model="statusVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-status>

    <!-- 上传稿件 -->
    <cus-upload
      v-model="uploadVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-upload>

    <!-- 详情 -->
    <!-- <cus-detail
      v-model="detailVisible"
      :data="temp"
      @refresh="_getList"
    ></cus-detail> -->

    <!-- 图片预览 -->
    <img-preview v-model="previewVisible" :urls="previewUrl"></img-preview>
  </div>
</template>

<script>
const condition = [
  {
    key: "id",
    placeholder: "ID",
  },
  {
    key: "subject",
    placeholder: "题目",
  },
  {
    key: "word_number",
    placeholder: "字数",
  },
  {
    key: "name",
    placeholder: "客户姓名",
  },
  {
    key: "task_type",
    type: "select",
    options: Utils.mapToArray(taskTypeMap),
    placeholder: "任务类型",
  },
  {
    key: "staff_name",
    type: "select",
    placeholder: "客服名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "edit_name",
    type: "select",
    placeholder: "编辑名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "status",
    type: "select",
    options: Utils.mapToArray(orderStatusMap),
    placeholder: "状态",
  },
  {
    key: "created_at",
    type: "date",
    placeholder: "创建时间",
  },
  {
    key: "submission_time",
    type: "date",
    placeholder: "截止时间",
  },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "任务类型",
    dataIndex: "task_type",
    scopedSlots: { customRender: "type" },
  },
  {
    title: "题目",
    dataIndex: "subject",
  },
  {
    title: "字数",
    dataIndex: "word_number",
  },
  {
    title: "任务要求",
    dataIndex: "task_ask",
  },
  {
    title: "客户",
    scopedSlots: { customRender: "user" },
  },
  {
    title: "客户电话",
    hidden: ["edit", "edit_admin"],
    dataIndex: "phone",
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
  },
  {
    title: "截止时间",
    dataIndex: "submission_time",
  },
  {
    title: "订单总额",
    hidden: ["edit", "edit_admin"],
    dataIndex: "amount",
  },
  {
    title: "已收金额",
    hidden: ["edit", "edit_admin"],
    dataIndex: "received_amount",
  },
  {
    title: "未收尾款",
    hidden: ["edit", "edit_admin"],
    scopedSlots: { customRender: "money" },
  },
  {
    title: "付款截图",
    hidden: ["edit", "edit_admin"],
    dataIndex: "pay_img",
    scopedSlots: { customRender: "image" },
  },
  {
    title: "详细要求",
    dataIndex: "detail_re",
    scopedSlots: { customRender: "ask" },
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "创建客服",
    dataIndex: "staff_name",
  },
  {
    title: "责任编辑",
    dataIndex: "edit_name",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
  {
    title: "稿件下载",
    dataIndex: "manuscript",
    scopedSlots: { customRender: "file" },
  },
  {
    title: "操作",
    scopedSlots: { customRender: "operate" },
  },
];

import listMixin from "../../mixins/list";
import OrderApi from "../../apis/order";
import PublicApi from "../../apis/public";
import Utils from "../../libs/utils";
import CusEdit from "./Edit";
import CusStatus from "./Status";
import CusAllot from "./Allot";
import CusUpload from "./Upload";
import { taskTypeMap, orderStatusMap } from "./mapping";

export default {
  components: {
    CusEdit,
    CusAllot,
    CusStatus,
    CusUpload,
  },
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      taskTypeMap,
      orderStatusMap,
      isService: false,
      isEditor: false,
      statistic: null,
      numbers: null,
      editVisible: false,
      statusVisible: false,
      allotVisible: false,
      previewVisible: false,
      uploadVisible: false,
      previewUrl: "",
      editorList: [],
    };
  },
  created() {
    PublicApi.roleUserList("staff").then((res) => {
      let temp = this.condition.find((_) => _.key == "staff_name");
      if (temp) {
        temp.options = res.list;
      }
    });
    PublicApi.roleUserList("edit").then((res) => {
      let temp = this.condition.find((_) => _.key == "edit_name");
      this.editorList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
    let user = this.$auth.user();
    this.isService = !!user.roles.find((_) => _.alias == "staff");
    this.isEditor = !!user.roles.find((_) => _.alias == "edit");
    this.isEditAdmain = !!user.roles.find((_) => _.alias == "edit_admin");
    if (this.isService) {
      this.condition = this.condition.filter((_) => _.key != "staff_name");
    }
    if (this.isEditor) {
      this.condition = this.condition.filter((_) => _.key != "edit_name");
      this.columns = this.columns.filter((_) => {
        if (_.hidden) {
          return !~_.hidden.indexOf("edit");
        }
        return true;
      });
    }
    if (this.isEditAdmain) {
      this.columns = this.columns.filter((_) => {
        if (_.hidden) {
          return !~_.hidden.indexOf("edit_admin");
        }
        return true;
      });
    }
    console.log(this.columns);
  },
  methods: {
    getStatistic() {
      OrderApi.statistic().then((res) => {
        this.statistic = res;
      });
      OrderApi.numbers().then((res) => {
        this.numbers = res.count_num;
      });
    },
    getRowClass(data) {
      switch (data.status) {
        case "1":
          return "bg-yellow";
        case "2":
          return "bg-pink";
        case "3":
        case "5":
          return "bg-blue";
        case "4":
          return "bg-green";
        default:
          break;
      }
    },
    toStatus(e) {
      this.temp = e;
      this.statusVisible = true;
    },
    toAllot(e) {
      this.temp = {
        id: e,
        editorList: this.editorList,
      };
      this.allotVisible = true;
    },
    toEdit(e) {
      this.temp = e;
      this.editVisible = true;
    },
    toPreview(e) {
      this.previewUrl = e;
      this.previewVisible = true;
    },
    toDownload(e) {
      Utils.download(e, e.split("/").pop()).then(() => {
        this.$message.success("下载完成");
      });
    },
    toUpload(e) {
      this.temp = e;
      this.uploadVisible = true;
    },
    toDelete(e) {
      OrderApi.remove(e).then(() => {
        this.$message.success("操作成功");
        this._getList();
      });
    },
    _getList() {
      this.getStatistic();
      this.collection.loading = true;
      OrderApi.list(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
            staff_name: this.isService ? this.$auth.user().name : undefined,
            edit_name: this.isEditor ? this.$auth.user().name : undefined,
          },
          this.search
        )
      ).then((res) => {
        this.collection.list = res.list;
        this.collection.total = res.total;
        this.collection.loading = false;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.statistic {
  font-size: 20px;
  color: red;

  span {
    margin-left: 50px;

    &:first-of-type {
      margin: 0;
    }
  }
}

.image {
  max-width: 90px;
  max-height: 90px;
  cursor: pointer;
}

/deep/ .bg {
  &-pink {
    background-color: #fbe5e2;
  }

  &-green {
    background-color: #75f98d;
  }

  &-yellow {
    background-color: #fbfd87;
  }

  &-blue {
    background-color: #a3ccfa;
  }
}

/deep/ tr:hover > td {
  background-color: inherit !important;
}
</style>