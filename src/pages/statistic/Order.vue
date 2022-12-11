<template>
  <div>
    <div class="cus-table-header">
      <list-search
        v-model="search"
        :condition="condition"
        :collection="collection"
      ></list-search>
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
      bordered
      rowKey="id"
      @change="listChange"
    >
      <template slot="status" slot-scope="data">
        {{ orderStatusMap[data] }}
      </template>
    </a-table>
  </div>
</template>

<script>
const condition = [
  {
    key: "subject",
    placeholder: "题目",
  },
  {
    key: "classify_id",
    type: "select",
    placeholder: "文档分类",
    showSearch: true,
    options: [],
    labelKey: "name",
    valueKey: "id",
  },
];

const columns = [
  {
    title: "ID",
    dataIndex: "id",
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
    title: "文档分类",
    dataIndex: "classify.name",
  },
  {
    title: "状态",
    dataIndex: "status",
    scopedSlots: { customRender: "status" },
  },
  {
    title: "创建时间",
    dataIndex: "created_at",
  },
];

import listMixin from "@/mixins/list";
import StatisticApi from "@/apis/statistic";
import PublicApi from "@/apis/public";
import { orderStatusMap } from "../order/mapping";

export default {
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      orderStatusMap,
      amountCount: 0,
      receivedAmountCount: 0,
    };
  },
  created() {
    PublicApi.documentClassify({
      page: 1,
      pageSize: 200,
    }).then((res) => {
      let temp = this.condition.find((_) => _.key == "classify_id");
      this.classifyList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
  },
  methods: {
    _getList() {
      this.collection.loading = true;
      StatisticApi.order(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
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
