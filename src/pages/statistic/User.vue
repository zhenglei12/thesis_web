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
        <span>
          <span>总金额：{{ amountCount }}</span>
          <span>已回收金额：{{ receivedAmountCount }}</span>
        </span>
      </div>
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
    </a-table>
  </div>
</template>

<script>
const condition = [
  {
    key: "name",
    type: "select",
    placeholder: "客服名称",
    options: [],
    labelKey: "name",
    valueKey: "name",
  },
  {
    key: "_date",
    type: "date-in",
  },
];

const columns = [
  {
    title: "",
    dataIndex: "id",
  },
  {
    title: "客服名称",
    dataIndex: "staff_name",
  },
  {
    title: "总金额",
    dataIndex: "amount",
  },
  {
    title: "已回收金额",
    dataIndex: "received_amount",
  },
];

import listMixin from "@/mixins/list";
import StatisticApi from "@/apis/statistic";
import PublicApi from "@/apis/public";

export default {
  mixins: [listMixin],
  data() {
    return {
      condition,
      columns,
      amountCount: 0,
      receivedAmountCount: 0,
    };
  },
  created() {
    PublicApi.roleUserList("staff").then((res) => {
      let temp = this.condition.find((_) => _.key == "name");
      this.editorList = res.list;
      if (temp) {
        temp.options = res.list;
      }
    });
  },
  methods: {
    _getList() {
      this.collection.loading = true;
      let _search = { ...this.search };
      if (_search._date) {
        _search.created_at = _search._date[0];
        _search.end_time = _search._date[1];
        delete _search._date;
      }
      StatisticApi.list(
        Object.assign(
          {},
          {
            page: this.collection.page,
            pageSize: this.collection.pageSize,
          },
          _search
        )
      ).then((res) => {
        this.amountCount = res.amount_count;
        this.receivedAmountCount = res.received_amount_count;
        const list = res.list;
        list.data.forEach(
          (_, i) =>
            (_.id =
              (this.collection.page - 1) * this.collection.pageSize + i + 1)
        );
        this.collection.list = list.data;
        this.collection.total = list.total;
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
    margin-left: 20px;

    &:first-of-type {
      margin: 0;
    }
  }
}
</style>
