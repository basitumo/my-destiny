export const ROLES = [
  "申请人·生产",
  "申请人·非生产",
  "申请人上级",
  "固资采购员",
  "采购执行",
  "使用人/保管人",
  "资产管理员",
  "财务",
  "管理者",
] as const;

export type Role = (typeof ROLES)[number];

export const STATUSES = [
  "草稿",
  "待上级审批",
  "待询价",
  "询价后待上级",
  "待固资采购员审批",
  "需求终止",
  "审批通过·待建 ERP 申请",
] as const;

export type Status = (typeof STATUSES)[number];

export type ActionName = "保存" | "提交" | "通过" | "驳回";

export type Tone = "info" | "ok" | "warn" | "err";

export const ORG = "络合高新材料（上海）股份有限公司";

export const EMPLOYEES = [
  { id: "lin-an", name: "林安（示例）", dept: "示例·设备部", post: "设备工程师" },
  { id: "chen-he", name: "陈禾（示例）", dept: "示例·生产车间", post: "生产操作员" },
  { id: "su-wan", name: "苏晚（示例）", dept: "示例·行政部", post: "行政专员" },
] as const;

export const USERS = ["周宁（示例）", "林安（示例）", "陈禾（示例）", "苏晚（示例）"] as const;

export const DEPTS = ["示例·质量实验室", "示例·设备部", "示例·生产车间", "示例·行政部"] as const;

export const MATERIALS = [
  {
    code: "YL-DEMO-001",
    itemCode: "MAT-DEMO-1001",
    name: "示例·实验工作台",
    spec: "1800×750×780 mm",
    unit: "台",
    pack: "木箱单件",
  },
  {
    code: "YL-DEMO-014",
    itemCode: "MAT-DEMO-2044",
    name: "示例·防静电周转箱",
    spec: "600×400×280 mm",
    unit: "个",
    pack: "折叠堆码",
  },
] as const;

export interface Line {
  needInquiry: "" | "是" | "否";
  goodsName: string;
  quantity: string;
  specialReq: string;
  materialCode: string;
  itemCode: string;
  itemName: string;
  spec: string;
  unit: string;
  packRule: string;
  userName: string;
  userDept: string;
  expectDate: string;
  inBudget: "" | "是" | "否";
  investment: "" | "一般投入" | "战略投入";
  inquiryResult: "" | "询价完成" | "需求终止";
  inquiryFileName: string;
}

export interface Sheet {
  employeeId: string;
  applyDate: string;
  org: string;
  assetType: "" | "行政类" | "非行政类";
  purchaseType: "" | "固定资产类" | "其他";
  purchasePath: "" | "走系统采购" | "不走系统采购";
  currency: "人民币" | "美元" | "日元";
  contractFileName: string;
  applicantKind: "" | "生产" | "非生产";
  isSample: boolean;
  line: Line;
}

export type FieldErrors = Partial<Record<string, string>>;

export type ScreenKind = "form" | "execute" | "gated" | "finance" | "manager";

export type MaterialView = "hidden" | "pending" | "show";

export interface ProgressStep {
  label: string;
  kind: "done" | "current" | "todo";
}

export function todayISO(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function emptyLine(): Line {
  return {
    needInquiry: "",
    goodsName: "",
    quantity: "",
    specialReq: "",
    materialCode: "",
    itemCode: "",
    itemName: "",
    spec: "",
    unit: "",
    packRule: "",
    userName: "",
    userDept: "",
    expectDate: "",
    inBudget: "",
    investment: "",
    inquiryResult: "",
    inquiryFileName: "",
  };
}

export function blankSheet(): Sheet {
  return {
    employeeId: "",
    applyDate: todayISO(),
    org: "",
    assetType: "",
    purchaseType: "",
    purchasePath: "",
    currency: "人民币",
    contractFileName: "",
    applicantKind: "",
    isSample: false,
    line: emptyLine(),
  };
}

export function sampleSheet(): Sheet {
  return {
    employeeId: "lin-an",
    applyDate: todayISO(),
    org: ORG,
    assetType: "非行政类",
    purchaseType: "固定资产类",
    purchasePath: "",
    currency: "人民币",
    contractFileName: "",
    applicantKind: "",
    isSample: true,
    line: {
      ...emptyLine(),
      needInquiry: "否",
      quantity: "1",
      specialReq: "示例：随货提供合格证",
      materialCode: "YL-DEMO-001",
      itemCode: "MAT-DEMO-1001",
      itemName: "示例·实验工作台",
      spec: "1800×750×780 mm",
      unit: "台",
      packRule: "木箱单件",
      userName: "周宁（示例）",
      userDept: "示例·质量实验室",
      expectDate: todayISO(21),
      inBudget: "是",
      investment: "一般投入",
    },
  };
}

export function employeeById(id: string) {
  return EMPLOYEES.find((employee) => employee.id === id);
}

export function materialByCode(code: string) {
  return MATERIALS.find((material) => material.code === code);
}

export function withMaterialCode(line: Line, code: string): Line {
  const material = materialByCode(code);
  if (!material) {
    return {
      ...line,
      materialCode: "",
      itemCode: "",
      itemName: "",
      spec: "",
      unit: "",
      packRule: "",
    };
  }
  return {
    ...line,
    materialCode: material.code,
    itemCode: material.itemCode,
    itemName: material.name,
    spec: material.spec,
    unit: material.unit,
    packRule: material.pack,
  };
}

export function isApplicant(role: Role): boolean {
  return role === "申请人·生产" || role === "申请人·非生产";
}

export function showPurchasePath(sheet: Sheet): boolean {
  return sheet.purchaseType === "其他";
}

export function showGoodsName(line: Line): boolean {
  return line.needInquiry === "是";
}

export function showMaterialCode(line: Line): boolean {
  return line.needInquiry === "否" || line.inquiryResult === "询价完成";
}

export function showInquiry(line: Line): boolean {
  return line.needInquiry === "是";
}

export function showInquiryFile(line: Line): boolean {
  return line.needInquiry === "是" && line.inquiryResult === "询价完成";
}

export function materialView(role: Role, applicantKind: Sheet["applicantKind"]): MaterialView {
  if (role === "申请人·生产") return "hidden";
  if ((role === "固资采购员" || role === "采购执行") && applicantKind === "生产") return "pending";
  return "show";
}

export function screenKind(role: Role, status: Status): ScreenKind {
  if (role === "管理者") return "manager";
  if (role === "财务") return "finance";
  if (role === "采购执行") {
    return status === "审批通过·待建 ERP 申请" ? "execute" : "gated";
  }
  if (role === "使用人/保管人" || role === "资产管理员") return "gated";
  return "form";
}

export function actionsFor(role: Role, status: Status): ActionName[] {
  if (isApplicant(role) && status === "草稿") return ["保存", "提交"];
  if (isApplicant(role) && status === "待询价") return ["保存"];
  if (role === "申请人上级" && (status === "待上级审批" || status === "询价后待上级")) {
    return ["通过", "驳回"];
  }
  if (role === "固资采购员" && status === "待询价") return ["保存", "提交"];
  if (role === "固资采购员" && status === "待固资采购员审批") return ["通过", "驳回"];
  return [];
}

export function writable(role: Role, status: Status, field: string, sheet: Sheet): boolean {
  const draft = isApplicant(role) && status === "草稿";
  const supplement = isApplicant(role) && status === "待询价";
  const inquiry = role === "固资采购员" && status === "待询价";
  switch (field) {
    case "employeeId":
    case "applyDate":
    case "org":
    case "assetType":
    case "purchaseType":
    case "purchasePath":
    case "currency":
    case "contract":
    case "needInquiry":
    case "userName":
    case "userDept":
    case "expectDate":
    case "inBudget":
    case "investment":
      return draft;
    case "goodsName":
    case "quantity":
    case "specialReq":
      return draft || supplement;
    case "materialCode":
      return (draft || supplement) && showMaterialCode(sheet.line);
    case "inquiryResult":
    case "inquiryFile":
      return inquiry;
    default:
      return false;
  }
}

export function dutyFor(status: Status, assetType: Sheet["assetType"]): string {
  switch (status) {
    case "草稿":
      return "申请人";
    case "待上级审批":
    case "询价后待上级":
      return "申请人上级";
    case "待询价":
      return "固资采购员";
    case "待固资采购员审批":
      if (assetType === "行政类") return "固资采购员（路由：香橼）";
      if (assetType === "非行政类") return "固资采购员（路由：苍术）";
      return "固资采购员";
    case "需求终止":
      return "申请人与采购（归档）";
    case "审批通过·待建 ERP 申请":
      return "采购执行";
  }
}

export function closedText(status: Status): string {
  if (status === "需求终止") return "否。需求终止只结束审批，没有形成新购资产。";
  if (status === "审批通过·待建 ERP 申请") return "否。审批通过还不是新购完成。";
  return "否";
}

export function nextStepText(status: Status, sheet: Sheet): string {
  switch (status) {
    case "草稿":
      return "申请人保存或提交。提交后进入待上级审批。";
    case "待上级审批":
      return sheet.line.needInquiry === "是"
        ? "申请人上级通过后进入待询价，驳回则退回草稿。"
        : "申请人上级通过后进入待固资采购员审批，驳回则退回草稿。";
    case "待询价":
      return "固资采购员填写询价结果。询价完成则进入询价后待上级；结果为需求终止则结束审批链。";
    case "询价后待上级":
      return "申请人上级通过后进入待固资采购员审批。";
    case "待固资采购员审批":
      return "固资采购员通过后进入审批通过·待建 ERP 申请。";
    case "需求终止":
      return "审批链已结束。这不是新购完成。";
    case "审批通过·待建 ERP 申请":
      return "后续下单、到货、验收、建卡不在本壳。";
  }
}

const ROLE_HINT: Record<Role, string> = {
  "申请人·生产": "填单时可编辑。只显示原料码，不显示物料编码、名称、规格、单位和包装规则。",
  "申请人·非生产": "填单时可编辑，可以看到并选择完整物料。",
  "申请人上级": "表头和明细只读。待上级审批或询价后待上级时，可以通过或驳回。",
  "固资采购员": "审批时只读，可以通过或驳回。待询价时填写询价结果。生产单能否看完整物料，规格未确认。",
  "采购执行": "审批通过后查看单号、物料、数量和地址。这里不能做金蝶下单。",
  "使用人/保管人": "待验收及之后才查看规格、数量、验收和资产编码。本壳没有做到那一步。",
  "资产管理员": "待建卡及之后查看验收结论和资产字段。本壳没有建卡页面。",
  "财务": "只看票和付款相关信息。金额、供应商、票状态都还待确认。",
  "管理者": "只读这一张单的进度：状态、责任人、是否关闭。没有看板。",
};

export function roleHint(role: Role, status: Status, sheet: Sheet): string {
  const base = ROLE_HINT[role];
  if (isApplicant(role) && status === "待询价") {
    return `${base} 现在可以补充货物名称和特殊要求；询价完成后可以补原料码。`;
  }
  if (isApplicant(role) && status !== "草稿") {
    return `${base} 提交之后字段锁定，只能看这张单。`;
  }
  if (role === "固资采购员" || role === "采购执行") {
    if (sheet.applicantKind === "生产") {
      return `${base} 本单由生产申请人提交，完整物料显示为待确认。`;
    }
    if (sheet.applicantKind === "非生产") {
      return `${base} 本单由非生产申请人提交，可以只读看到完整物料。`;
    }
  }
  return base;
}

export function gatedMessage(role: Role): string {
  switch (role) {
    case "采购执行":
      return "采购执行要等状态变成「审批通过·待建 ERP 申请」，才查看单号、物料、数量和地址。现在还没到。";
    case "使用人/保管人":
      return "使用人/保管人从待验收开始查看物料规格、数量和资产编码，并参与验收、确认贴标。本原型停在审批表，进不了验收。";
    case "资产管理员":
      return "资产管理员从待建卡开始查看验收结论和资产字段。建卡不在这个原型里。";
    default:
      return "当前角色在这个阶段不查看整张申请表。";
  }
}

export function progressOf(status: Status, sheet: Sheet): ProgressStep[] {
  if (status === "需求终止") {
    return [
      { label: "草稿", kind: "done" },
      { label: "待上级审批", kind: "done" },
      { label: "待询价", kind: "done" },
      { label: "需求终止", kind: "current" },
    ];
  }
  const labels: Status[] = [
    "草稿",
    "待上级审批",
    ...(sheet.line.needInquiry === "是" ? (["待询价", "询价后待上级"] as Status[]) : []),
    "待固资采购员审批",
    "审批通过·待建 ERP 申请",
  ];
  const index = labels.indexOf(status);
  return labels.map((label, step) => ({
    label,
    kind: step < index ? "done" : step === index ? "current" : "todo",
  }));
}

export function validateSubmit(sheet: Sheet): FieldErrors {
  const errors: FieldErrors = {};
  if (!sheet.employeeId) errors.employeeId = "请选择员工";
  if (!sheet.applyDate) errors.applyDate = "请填写申请日期";
  if (!sheet.org) errors.org = "请选择申请组织";
  if (!sheet.assetType) errors.assetType = "请选择资产类型";
  if (!sheet.purchaseType) errors.purchaseType = "请选择采购申请类型";
  if (sheet.purchaseType === "其他" && !sheet.purchasePath) errors.purchasePath = "请选择采购路径";
  if (!sheet.currency) errors.currency = "请选择币别";
  if (!sheet.line.needInquiry) errors.needInquiry = "请选择是否需要询价";
  if (!sheet.line.quantity.trim()) errors.quantity = "请填写申请数量";
  else if (!/^\d+(\.\d+)?$/.test(sheet.line.quantity.trim()) || Number(sheet.line.quantity) <= 0) {
    errors.quantity = "请填写大于 0 的数字";
  }
  if (sheet.line.needInquiry === "是" && !sheet.line.goodsName.trim()) {
    errors.goodsName = "询价时请填写货物名称";
  }
  if (sheet.line.needInquiry === "否" && !sheet.line.materialCode) {
    errors.materialCode = "不询价时请选择原料码";
  }
  return errors;
}

export function validateInquiry(sheet: Sheet): FieldErrors {
  const errors: FieldErrors = {};
  if (!sheet.line.inquiryResult) errors.inquiryResult = "请选择询价结果";
  return errors;
}

export type ApplyResult =
  | { ok: true; status: Status; sheet: Sheet; notice: string; tone: Tone }
  | { ok: false; errors: FieldErrors; notice: string };

export function applyAction(action: ActionName, role: Role, status: Status, sheet: Sheet): ApplyResult {
  if (!actionsFor(role, status).includes(action)) {
    return { ok: false, errors: {}, notice: "当前角色不能执行这个操作。" };
  }
  if (action === "保存") {
    return {
      ok: true,
      status,
      sheet,
      tone: "info",
      notice: "已保存在这页的演示状态里，没有写入飞书。刷新页面会丢掉。",
    };
  }
  if (action === "提交" && isApplicant(role) && status === "草稿") {
    const errors = validateSubmit(sheet);
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors, notice: "还有必填项没填完。" };
    }
    return {
      ok: true,
      status: "待上级审批",
      sheet: { ...sheet, applicantKind: role === "申请人·生产" ? "生产" : "非生产" },
      tone: "ok",
      notice: "已提交。表单已锁定。下一状态：待上级审批，请申请人上级处理。",
    };
  }
  if (action === "提交" && role === "固资采购员" && status === "待询价") {
    const errors = validateInquiry(sheet);
    if (Object.keys(errors).length > 0) {
      return { ok: false, errors, notice: "请先选择询价结果。" };
    }
    if (sheet.line.inquiryResult === "需求终止") {
      return {
        ok: true,
        status: "需求终止",
        sheet,
        tone: "warn",
        notice: "询价结果为需求终止。审批链在此结束，这不是新购完成。",
      };
    }
    return {
      ok: true,
      status: "询价后待上级",
      sheet,
      tone: "ok",
      notice: "询价结果已提交。下一状态：询价后待上级，等待申请人上级再次审批。",
    };
  }
  if (action === "通过" && role === "申请人上级" && status === "待上级审批") {
    if (sheet.line.needInquiry === "是") {
      return {
        ok: true,
        status: "待询价",
        sheet,
        tone: "ok",
        notice: "已通过。下一状态：待询价。固资采购员填写询价结果后可继续。",
      };
    }
    return {
      ok: true,
      status: "待固资采购员审批",
      sheet,
      tone: "ok",
      notice: "已通过。无需询价，下一状态：待固资采购员审批。",
    };
  }
  if (action === "通过" && role === "申请人上级" && status === "询价后待上级") {
    return {
      ok: true,
      status: "待固资采购员审批",
      sheet,
      tone: "ok",
      notice: "已通过。下一状态：待固资采购员审批。",
    };
  }
  if (action === "通过" && role === "固资采购员" && status === "待固资采购员审批") {
    return {
      ok: true,
      status: "审批通过·待建 ERP 申请",
      sheet,
      tone: "ok",
      notice: "已通过。下一状态：审批通过·待建 ERP 申请。审批通过不等于新购完成，本壳不生成金蝶单据。",
    };
  }
  if (action === "驳回") {
    return {
      ok: true,
      status: "草稿",
      sheet,
      tone: "warn",
      notice: "已驳回，已退回草稿。申请人可以修改后再提交。",
    };
  }
  return { ok: false, errors: {}, notice: "当前角色不能执行这个操作。" };
}
