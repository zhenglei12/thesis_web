// 订单状态
export const orderStatusMap = {
  "-1": "等待安排",
  1: "写作中",
  2: "打回修改",
  3: "订单完成",
  4: "提交客户",
  5: "已交稿",
  6: "售后中",
  7: "售后完成",
};

// 任务类型
export const taskTypeMap = {
  1: "论文写作",
  2: "期刊发表",
  3: "PPT",
  4: "翻译",
  6: "论文辅导",
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
  5: "博鸿对公",
};

// 财务审核
export const financeCheckMap = {
  "-1": "没有",
  0: "初审",
  2: "中审",
  1: "终审",
};

// '专科', '博士', '成人本科', '在职硕士', '全日制硕士', '本科', '非论文'
export const levelMap = {
  1: "专科",
  2: "博士",
  3: "成人本科",
  4: "在职硕士",
  5: "全日制硕士",
  6: "本科",
  7: "非论文",
};

// '建模', '仿真', 'SPSS数据分析', '制图', '无', '其他', '软件/程序'
export const requireMap = {
  1: "建模",
  2: "仿真",
  3: "SPSS数据分析",
  4: "制图",
  5: "无",
  6: "其他",
  7: "软件/程序",
};

// '课程作业', '毕业论文', '期刊发表', '单位作业'
export const useMap = {
  1: "课程作业",
  2: "毕业论文",
  3: "期刊发表",
  4: "单位作业",
};

// '中文+中英文摘要', '中文', '英语', '韩语', '其他语种'
export const languageMap = {
  1: "中文+中英文摘要",
  2: "中文",
  3: "英语",
  4: "韩语",
  5: "其他语种",
};

// '无', '有'
export const egMap = {
  "-1": "无",
  1: "有",
};
