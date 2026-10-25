import {
  closedText,
  employeeById,
  gatedMessage,
  materialView,
  nextStepText,
  progressOf,
  showMaterialCode,
  type Role,
  type Sheet,
  type Status,
} from "./domain";
import { PendingField } from "./ui";

export function ManagerScreen({ status, sheet }: { status: Status; sheet: Sheet }) {
  const steps = progressOf(status, sheet);
  return (
    <section className="panel" data-testid="manager-screen">
      <h2>本单进度</h2>
      <p className="section-note">看板壳未做。这里只读这一张申请走到哪、谁负责、有没有关闭。</p>
      <dl className="facts">
        <div>
          <dt>是否关闭</dt>
          <dd>{closedText(status)}</dd>
        </div>
        <div>
          <dt>下一步</dt>
          <dd>{nextStepText(status, sheet)}</dd>
        </div>
      </dl>
      <ol className="steps">
        {steps.map((step) => (
          <li key={step.label} className={step.kind}>
            <span>{step.label}</span>
            {step.kind === "current" ? <span className="step-flag">当前</span> : null}
          </li>
        ))}
      </ol>
      {sheet.line.needInquiry === "否" ? <p className="hint">这条路径不询价，所以没有待询价。</p> : null}
      {sheet.line.needInquiry === "" ? (
        <p className="hint">如果明细里选择需要询价，路径会多出待询价和询价后待上级。</p>
      ) : null}
    </section>
  );
}

export function FinanceScreen() {
  return (
    <section className="panel" data-testid="finance-screen">
      <h2>票与付款</h2>
      <p className="section-note">这些字段规格还没定。收票和付款的主系统在金蝶，这页不能操作。</p>
      <PendingField label="金额" />
      <PendingField label="供应商" />
      <PendingField label="票状态" />
    </section>
  );
}

export function GatedScreen({ role, status, sheet }: { role: Role; status: Status; sheet: Sheet }) {
  return (
    <section className="panel" data-testid="gated-screen">
      <h2>当前阶段不可见整张表</h2>
      <p>{gatedMessage(role)}</p>
      <p className="hint">下一步：{nextStepText(status, sheet)}</p>
    </section>
  );
}

export function ExecuteScreen({ sheet }: { sheet: Sheet }) {
  const employee = employeeById(sheet.employeeId);
  const view = materialView("采购执行", sheet.applicantKind);
  const materialVisible = showMaterialCode(sheet.line);
  return (
    <section className="panel" data-testid="execute-screen">
      <h2>执行信息</h2>
      <p className="section-note">审批已经通过。这里只读单号、物料、数量和地址。不能在本壳关联金蝶。</p>
      <dl className="facts">
        <div>
          <dt>员工名称</dt>
          <dd>{employee?.name || "未填"}</dd>
        </div>
        <div>
          <dt>所属部门</dt>
          <dd>{employee?.dept || "未填"}</dd>
        </div>
        <div>
          <dt>申请组织</dt>
          <dd>{sheet.org || "未填"}</dd>
        </div>
        <div>
          <dt>申请数量</dt>
          <dd>{sheet.line.quantity || "未填"}</dd>
        </div>
        <div>
          <dt>原料码</dt>
          <dd>{materialVisible ? sheet.line.materialCode || "未填" : "询价完成后显示"}</dd>
        </div>
      </dl>
      {materialVisible && view === "pending" ? (
        <div className="material-box">
          <h3>
            物料信息
            <span className="tag">待确认</span>
          </h3>
          <p>待确认。生产单对采购侧是否可见完整物料，规格还没定。</p>
        </div>
      ) : null}
      {materialVisible && view === "show" ? (
        <div className="material-box" data-testid="execute-material">
          <h3>物料信息</h3>
          <dl className="facts">
            <div>
              <dt>物料编码</dt>
              <dd>{sheet.line.itemCode || "未填"}</dd>
            </div>
            <div>
              <dt>物料名称</dt>
              <dd>{sheet.line.itemName || "未填"}</dd>
            </div>
            <div>
              <dt>规格</dt>
              <dd>{sheet.line.spec || "未填"}</dd>
            </div>
            <div>
              <dt>单位</dt>
              <dd>{sheet.line.unit || "未填"}</dd>
            </div>
          </dl>
        </div>
      ) : null}
      <div className="field">
        <label>
          收货地址
          <span className="tag">待确认</span>
        </label>
        <input value="待确认" disabled />
      </div>
      <div className="field">
        <label htmlFor="erp-apply">ERP 采购申请单号</label>
        <input id="erp-apply" value="未接入" disabled />
        <p className="hint">本壳不回写金蝶单号。</p>
      </div>
      <div className="field">
        <label htmlFor="erp-po">ERP 采购订单号</label>
        <input id="erp-po" value="未接入" disabled />
      </div>
    </section>
  );
}
