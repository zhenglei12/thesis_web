// 订单状态
export const orderStatusMap = {
  "-1": "等待安排",
  1: "写作中",
  2: "打回修改",
  3: "订单完成",
  4: "提交客户",
  5: "已交稿",
};

// 任务类型
export const taskTypeMap = {
  1: "论文写作",
  2: "期刊发表",
  3: "PPT",
  4: "翻译",
  5: "其他",
};

// 支付方式
export const payTypeMap = {
  1: "支付宝",
  2: "微信",
  3: "银行转账",
  4: "对公账户",
  5: "线上支付",
};

// 收款户
export const accountTypeMap = {
  1: "天扬对公",
  2: "巷船对公",
  3: "巷船微信商户",
  4: "源洲对公",
};

// 财务审核
export const financeCheckMap = {
  "-1": "没有",
  0: "初审",
  2: "中审",
  1: "终审",
};
