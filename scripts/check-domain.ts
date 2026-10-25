import assert from "node:assert/strict";
import {
  actionsFor,
  applyAction,
  blankSheet,
  materialView,
  sampleSheet,
  screenKind,
  showGoodsName,
  showMaterialCode,
  showPurchasePath,
} from "../src/domain.ts";

const empty = blankSheet();
const missing = applyAction("提交", "申请人·非生产", "草稿", empty);
assert.equal(missing.ok, false);

const sample = sampleSheet();
const submitted = applyAction("提交", "申请人·非生产", "草稿", sample);
assert.equal(submitted.ok, true);
if (!submitted.ok) throw new Error("submit");
assert.equal(submitted.status, "待上级审批");
assert.equal(submitted.sheet.applicantKind, "非生产");

const toBuyer = applyAction("通过", "申请人上级", "待上级审批", submitted.sheet);
assert.equal(toBuyer.ok, true);
if (!toBuyer.ok) throw new Error("approve");
assert.equal(toBuyer.status, "待固资采购员审批");

const done = applyAction("通过", "固资采购员", "待固资采购员审批", toBuyer.sheet);
assert.equal(done.ok, true);
if (!done.ok) throw new Error("buyer");
assert.equal(done.status, "审批通过·待建 ERP 申请");

const inquirySheet = {
  ...sample,
  line: { ...sample.line, needInquiry: "是" as const, goodsName: "示例·未编码器具", materialCode: "" },
};
const inquirySubmit = applyAction("提交", "申请人·生产", "草稿", inquirySheet);
assert.equal(inquirySubmit.ok, true);
if (!inquirySubmit.ok) throw new Error("inquiry submit");
assert.equal(inquirySubmit.sheet.applicantKind, "生产");
const toInquiry = applyAction("通过", "申请人上级", "待上级审批", inquirySubmit.sheet);
assert.equal(toInquiry.ok, true);
if (!toInquiry.ok) throw new Error("to inquiry");
assert.equal(toInquiry.status, "待询价");

const stopped = applyAction("提交", "固资采购员", "待询价", {
  ...toInquiry.sheet,
  line: { ...toInquiry.sheet.line, inquiryResult: "需求终止" },
});
assert.equal(stopped.ok, true);
if (!stopped.ok) throw new Error("stop");
assert.equal(stopped.status, "需求终止");

const quoted = applyAction("提交", "固资采购员", "待询价", {
  ...toInquiry.sheet,
  line: { ...toInquiry.sheet.line, inquiryResult: "询价完成" },
});
assert.equal(quoted.ok, true);
if (!quoted.ok) throw new Error("quoted");
assert.equal(quoted.status, "询价后待上级");

const rejected = applyAction("驳回", "申请人上级", "待上级审批", submitted.sheet);
assert.equal(rejected.ok, true);
if (!rejected.ok) throw new Error("reject");
assert.equal(rejected.status, "草稿");

assert.deepEqual(actionsFor("申请人·非生产", "草稿"), ["保存", "提交"]);
assert.deepEqual(actionsFor("申请人上级", "待上级审批"), ["通过", "驳回"]);
assert.deepEqual(actionsFor("管理者", "草稿"), []);
assert.equal(materialView("申请人·生产", "非生产"), "hidden");
assert.equal(materialView("固资采购员", "生产"), "pending");
assert.equal(materialView("申请人·非生产", "非生产"), "show");
assert.equal(screenKind("管理者", "草稿"), "manager");
assert.equal(screenKind("财务", "草稿"), "finance");
assert.equal(screenKind("采购执行", "草稿"), "gated");
assert.equal(screenKind("采购执行", "审批通过·待建 ERP 申请"), "execute");
assert.equal(showPurchasePath({ ...empty, purchaseType: "其他" }), true);
assert.equal(showPurchasePath(sample), false);
assert.equal(showGoodsName({ ...sample.line, needInquiry: "是" }), true);
assert.equal(showMaterialCode(sample.line), true);
assert.equal(showMaterialCode({ ...sample.line, needInquiry: "是", inquiryResult: "" }), false);

console.log("domain checks passed");
