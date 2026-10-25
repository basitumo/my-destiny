import { useState } from "react";
import {
  ROLES,
  actionsFor,
  applyAction,
  blankSheet,
  dutyFor,
  roleHint,
  sampleSheet,
  screenKind,
  withMaterialCode,
  type ActionName,
  type FieldErrors,
  type Role,
  type Sheet,
  type Status,
} from "./domain";
import { FormScreen } from "./FormScreen";
import { ExecuteScreen, FinanceScreen, GatedScreen, ManagerScreen } from "./OtherScreens";
import { Badge, Banner } from "./ui";

interface Notice {
  tone: "info" | "ok" | "warn" | "err";
  text: string;
}

export function App() {
  const [role, setRole] = useState<Role>("申请人·非生产");
  const [status, setStatus] = useState<Status>("草稿");
  const [sheet, setSheet] = useState<Sheet>(() => blankSheet());
  const [notice, setNotice] = useState<Notice | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [fileKey, setFileKey] = useState(0);

  const actions = actionsFor(role, status);
  const kind = screenKind(role, status);

  function onPatch(partial: Partial<Sheet>) {
    setSheet((prev) => {
      const next = { ...prev, ...partial };
      if (partial.purchaseType && partial.purchaseType !== "其他") next.purchasePath = "";
      return next;
    });
  }

  function onLine(partial: Partial<Sheet["line"]>) {
    setSheet((prev) => {
      let line = { ...prev.line, ...partial };
      if (partial.needInquiry === "否") {
        line = { ...line, goodsName: "", inquiryResult: "", inquiryFileName: "" };
      }
      if (partial.needInquiry === "是") {
        line = withMaterialCode(line, "");
      }
      if (partial.inquiryResult && partial.inquiryResult !== "询价完成") {
        line = { ...line, inquiryFileName: "" };
      }
      return { ...prev, line };
    });
  }

  function onMaterial(code: string) {
    setSheet((prev) => ({ ...prev, line: withMaterialCode(prev.line, code) }));
  }

  function onAction(action: ActionName) {
    const result = applyAction(action, role, status, sheet);
    if (!result.ok) {
      setErrors(result.errors);
      setNotice({ tone: "err", text: result.notice });
      const first = Object.keys(result.errors)[0];
      if (first) {
        requestAnimationFrame(() => {
          document.getElementById(`f-${first}`)?.scrollIntoView({ block: "center" });
        });
      }
      return;
    }
    setErrors({});
    setStatus(result.status);
    setSheet(result.sheet);
    setNotice({ tone: result.tone, text: result.notice });
  }

  function loadSample() {
    setSheet(sampleSheet());
    setStatus("草稿");
    setErrors({});
    setFileKey((value) => value + 1);
    setNotice({
      tone: "info",
      text: "已载入示例数据，流程回到草稿。姓名、部门和物料都是虚构的。",
    });
  }

  function resetDemo() {
    setSheet(blankSheet());
    setStatus("草稿");
    setErrors({});
    setFileKey((value) => value + 1);
    setNotice(null);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="topbar-inner">
          <div>
            <h1>固资采购申请</h1>
            <p className="sub">原型壳 · 规格 v0.1 · 未接飞书/金蝶 · 非业务验收</p>
          </div>
          <div className="status-wrap">
            <Badge status={status} />
            <p className="duty">当前责任：{dutyFor(status, sheet.assetType)}</p>
          </div>
        </div>
      </header>
      <main className="main">
        <section className="panel demo-panel">
          <label htmlFor="role">你正在以这个角色查看</label>
          <select
            id="role"
            data-testid="role-switcher"
            value={role}
            onChange={(event) => setRole(event.target.value as Role)}
          >
            {ROLES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <p className="hint">{roleHint(role, status, sheet)}</p>
          <div className="demo-actions">
            <button type="button" className="btn ghost" data-testid="load-sample" onClick={loadSample}>
              载入示例数据
            </button>
            <button type="button" className="btn ghost" onClick={resetDemo}>
              重置演示
            </button>
          </div>
        </section>

        {sheet.isSample ? (
          <div className="banner banner-info" data-testid="sample-banner">
            示例数据。姓名、部门和物料都是虚构的，只为看界面。
          </div>
        ) : null}
        {notice ? <Banner tone={notice.tone} text={notice.text} /> : null}

        {kind === "form" ? (
          <FormScreen
            role={role}
            status={status}
            sheet={sheet}
            errors={errors}
            fileKey={fileKey}
            actions={actions}
            onPatch={onPatch}
            onLine={onLine}
            onMaterial={onMaterial}
            onAction={onAction}
          />
        ) : null}
        {kind === "manager" ? <ManagerScreen status={status} sheet={sheet} /> : null}
        {kind === "finance" ? <FinanceScreen /> : null}
        {kind === "gated" ? <GatedScreen role={role} status={status} sheet={sheet} /> : null}
        {kind === "execute" ? <ExecuteScreen sheet={sheet} /> : null}
      </main>
    </div>
  );
}
