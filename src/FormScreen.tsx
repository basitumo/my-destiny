import {
  DEPTS,
  EMPLOYEES,
  MATERIALS,
  ORG,
  USERS,
  employeeById,
  materialView,
  showGoodsName,
  showInquiry,
  showInquiryFile,
  showMaterialCode,
  showPurchasePath,
  writable,
  type ActionName,
  type FieldErrors,
  type Role,
  type Sheet,
  type Status,
} from "./domain";
import { Field, PendingField } from "./ui";

export function FormScreen({
  role,
  status,
  sheet,
  errors,
  fileKey,
  actions,
  onPatch,
  onLine,
  onMaterial,
  onAction,
}: {
  role: Role;
  status: Status;
  sheet: Sheet;
  errors: FieldErrors;
  fileKey: number;
  actions: ActionName[];
  onPatch: (partial: Partial<Sheet>) => void;
  onLine: (partial: Partial<Sheet["line"]>) => void;
  onMaterial: (code: string) => void;
  onAction: (action: ActionName) => void;
}) {
  const employee = employeeById(sheet.employeeId);
  const line = sheet.line;
  const lock = (field: string) => !writable(role, status, field, sheet);
  const materialVisible = showMaterialCode(line);
  const materials = materialView(role, sheet.applicantKind);
  const hideMaterialNames = materials !== "show";

  return (
    <form
      className="panel form-card"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        if (actions.includes("提交")) onAction("提交");
      }}
    >
      <p className="section-note">带 * 的栏位提交时必填。灰色栏位是只读，或是还不能填的占位。</p>

      <h2>基本信息</h2>
      <Field
        id="f-employeeId"
        label="员工名称"
        required
        error={errors.employeeId}
        hint="演示用虚构员工。选定后带出部门和岗位。"
      >
        <select
          id="f-employeeId"
          value={sheet.employeeId}
          disabled={lock("employeeId")}
          onChange={(event) => onPatch({ employeeId: event.target.value })}
        >
          <option value="">请选择</option>
          {EMPLOYEES.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="f-dept" label="所属部门" hint="只读，跟随员工。">
        <input id="f-dept" value={employee?.dept ?? ""} placeholder="选择员工后自动带出" readOnly disabled />
      </Field>
      <Field id="f-post" label="就任岗位" hint="只读，跟随员工。">
        <input id="f-post" value={employee?.post ?? ""} placeholder="选择员工后自动带出" readOnly disabled />
      </Field>
      <Field id="f-applyDate" label="申请日期" required error={errors.applyDate}>
        <input
          id="f-applyDate"
          type="date"
          value={sheet.applyDate}
          disabled={lock("applyDate")}
          onChange={(event) => onPatch({ applyDate: event.target.value })}
        />
      </Field>

      <h2>采购信息</h2>
      <Field
        id="f-org"
        label="申请组织"
        required
        error={errors.org}
        hint="规格里的枚举目前只有这一家。是不是仅此一家，还待确认。"
      >
        <select
          id="f-org"
          value={sheet.org}
          disabled={lock("org")}
          onChange={(event) => onPatch({ org: event.target.value })}
        >
          <option value="">请选择</option>
          <option value={ORG}>{ORG}</option>
        </select>
      </Field>
      <Field
        id="f-assetType"
        label="资产类型"
        required
        error={errors.assetType}
        hint={
          sheet.assetType === "行政类"
            ? "路由：固资采购员（香橼）。人员是否仍在岗，待确认。"
            : sheet.assetType === "非行政类"
              ? "路由：固资采购员（苍术）。人员是否仍在岗，待确认。"
              : undefined
        }
      >
        <select
          id="f-assetType"
          value={sheet.assetType}
          disabled={lock("assetType")}
          onChange={(event) => onPatch({ assetType: event.target.value as Sheet["assetType"] })}
        >
          <option value="">请选择</option>
          <option value="行政类">行政类</option>
          <option value="非行政类">非行政类</option>
        </select>
      </Field>
      <Field
        id="f-purchaseType"
        label="采购申请类型"
        required
        error={errors.purchaseType}
        hint={sheet.purchaseType === "固定资产类" ? "固定资产默认走系统采购，不显示采购路径。" : undefined}
      >
        <select
          id="f-purchaseType"
          value={sheet.purchaseType}
          disabled={lock("purchaseType")}
          onChange={(event) => onPatch({ purchaseType: event.target.value as Sheet["purchaseType"] })}
        >
          <option value="">请选择</option>
          <option value="固定资产类">固定资产类</option>
          <option value="其他">其他</option>
        </select>
      </Field>
      {showPurchasePath(sheet) ? (
        <Field id="f-purchasePath" label="选择采购路径" required error={errors.purchasePath}>
          <select
            id="f-purchasePath"
            value={sheet.purchasePath}
            disabled={lock("purchasePath")}
            onChange={(event) => onPatch({ purchasePath: event.target.value as Sheet["purchasePath"] })}
          >
            <option value="">请选择</option>
            <option value="走系统采购">走系统采购</option>
            <option value="不走系统采购">不走系统采购</option>
          </select>
        </Field>
      ) : null}
      <Field id="f-currency" label="币别" required error={errors.currency}>
        <select
          id="f-currency"
          value={sheet.currency}
          disabled={lock("currency")}
          onChange={(event) => onPatch({ currency: event.target.value as Sheet["currency"] })}
        >
          <option value="人民币">人民币</option>
          <option value="美元">美元</option>
          <option value="日元">日元</option>
        </select>
      </Field>
      <Field id="f-contract" label="上传合同" hint="有合同时再选。文件只留在浏览器里，不会上传。">
        {lock("contract") ? (
          <input id="f-contract" value={sheet.contractFileName || "未上传"} disabled />
        ) : (
          <input
            id="f-contract"
            key={`contract-${fileKey}`}
            type="file"
            onChange={(event) => onPatch({ contractFileName: event.target.files?.[0]?.name ?? "" })}
          />
        )}
        {!lock("contract") && sheet.contractFileName ? (
          <p className="hint">已选择：{sheet.contractFileName}</p>
        ) : null}
      </Field>
      <PendingField label="采购模式/类型" />

      <h2>明细</h2>
      <p className="section-note">原型只放一行明细。</p>
      <Field id="f-needInquiry" label="是否需要询价" required error={errors.needInquiry}>
        <select
          id="f-needInquiry"
          value={line.needInquiry}
          disabled={lock("needInquiry")}
          onChange={(event) => onLine({ needInquiry: event.target.value as Sheet["line"]["needInquiry"] })}
        >
          <option value="">请选择</option>
          <option value="是">是</option>
          <option value="否">否</option>
        </select>
      </Field>
      {showGoodsName(line) ? (
        <Field id="f-goodsName" label="货物名称" required error={errors.goodsName}>
          <input
            id="f-goodsName"
            data-testid="goods-name"
            value={line.goodsName}
            disabled={lock("goodsName")}
            placeholder="询价时填写"
            onChange={(event) => onLine({ goodsName: event.target.value })}
          />
        </Field>
      ) : null}
      <Field id="f-quantity" label="申请数量" required error={errors.quantity}>
        <input
          id="f-quantity"
          inputMode="decimal"
          value={line.quantity}
          disabled={lock("quantity")}
          placeholder="例如 1"
          onChange={(event) => onLine({ quantity: event.target.value })}
        />
      </Field>
      <Field id="f-specialReq" label="特殊要求">
        <textarea
          id="f-specialReq"
          value={line.specialReq}
          disabled={lock("specialReq")}
          rows={3}
          placeholder="没有可以留空"
          onChange={(event) => onLine({ specialReq: event.target.value })}
        />
      </Field>

      {materialVisible ? (
        <Field
          id="f-materialCode"
          label="原料码"
          required={status === "草稿"}
          error={errors.materialCode}
          hint={
            materials === "hidden"
              ? "生产角色只看到原料码。"
              : materials === "pending"
                ? "完整物料待确认，这里只保留原料码。"
                : "选定后带出物料信息。演示编码，不连接金蝶。"
          }
        >
          <select
            id="f-materialCode"
            data-testid="material-code"
            value={line.materialCode}
            disabled={lock("materialCode")}
            onChange={(event) => onMaterial(event.target.value)}
          >
            <option value="">请选择</option>
            {MATERIALS.map((material) => (
              <option key={material.code} value={material.code}>
                {hideMaterialNames ? material.code : `${material.code} · ${material.name}`}
              </option>
            ))}
          </select>
        </Field>
      ) : (
        <p className="callout">原料码和物料信息在「不询价」或「询价完成」后出现。</p>
      )}

      {materialVisible && materials === "hidden" ? (
        <p className="callout" data-testid="material-hidden">
          物料信息已按生产角色隐藏，不显示编码、名称、规格、单位和包装规则。
        </p>
      ) : null}

      {materialVisible && materials === "pending" ? (
        <div className="material-box" data-testid="material-pending">
          <h3>
            物料信息
            <span className="tag">待确认</span>
          </h3>
          <p>待确认。生产单对采购侧是否可见完整物料，规格还没定，这里不展示。</p>
        </div>
      ) : null}

      {materialVisible && materials === "show" ? (
        <div className="material-box" data-testid="material-info">
          <h3>物料信息</h3>
          <Field id="f-itemCode" label="物料编码">
            <input id="f-itemCode" value={line.itemCode} placeholder="选择原料码后带出" disabled />
          </Field>
          <Field id="f-itemName" label="物料名称">
            <input id="f-itemName" value={line.itemName} placeholder="选择原料码后带出" disabled />
          </Field>
          <Field id="f-spec" label="规格">
            <input id="f-spec" value={line.spec} placeholder="选择原料码后带出" disabled />
          </Field>
          <Field id="f-unit" label="单位">
            <input id="f-unit" value={line.unit} placeholder="选择原料码后带出" disabled />
          </Field>
          <Field id="f-pack" label="包装规则">
            <input id="f-pack" value={line.packRule} placeholder="选择原料码后带出" disabled />
          </Field>
        </div>
      ) : null}

      <PendingField label="收货地址" />
      <Field id="f-userName" label="使用人" hint="演示名单，不连接飞书通讯录。">
        <select
          id="f-userName"
          value={line.userName}
          disabled={lock("userName")}
          onChange={(event) => onLine({ userName: event.target.value })}
        >
          <option value="">请选择</option>
          {USERS.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="f-userDept" label="使用部门">
        <select
          id="f-userDept"
          value={line.userDept}
          disabled={lock("userDept")}
          onChange={(event) => onLine({ userDept: event.target.value })}
        >
          <option value="">请选择</option>
          {DEPTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </Field>
      <Field id="f-expectDate" label="期望到货日期">
        <input
          id="f-expectDate"
          type="date"
          value={line.expectDate}
          disabled={lock("expectDate")}
          onChange={(event) => onLine({ expectDate: event.target.value })}
        />
      </Field>
      <Field id="f-inBudget" label="是否在当年预算">
        <select
          id="f-inBudget"
          value={line.inBudget}
          disabled={lock("inBudget")}
          onChange={(event) => onLine({ inBudget: event.target.value as Sheet["line"]["inBudget"] })}
        >
          <option value="">请选择</option>
          <option value="是">是</option>
          <option value="否">否</option>
        </select>
      </Field>
      <Field id="f-investment" label="投入情况">
        <select
          id="f-investment"
          value={line.investment}
          disabled={lock("investment")}
          onChange={(event) => onLine({ investment: event.target.value as Sheet["line"]["investment"] })}
        >
          <option value="">请选择</option>
          <option value="一般投入">一般投入</option>
          <option value="战略投入">战略投入</option>
        </select>
      </Field>
      {showInquiry(line) ? (
        <Field
          id="f-inquiryResult"
          label="询价结果"
          required={role === "固资采购员" && status === "待询价"}
          error={errors.inquiryResult}
          hint="询价环节填写。"
        >
          <select
            id="f-inquiryResult"
            data-testid="inquiry-result"
            value={line.inquiryResult}
            disabled={lock("inquiryResult")}
            onChange={(event) =>
              onLine({ inquiryResult: event.target.value as Sheet["line"]["inquiryResult"] })
            }
          >
            <option value="">请选择</option>
            <option value="询价完成">询价完成</option>
            <option value="需求终止">需求终止</option>
          </select>
        </Field>
      ) : null}
      {showInquiryFile(line) ? (
        <Field id="f-inquiryFile" label="询价附件" hint="询价完成时可以附上。文件不会上传。">
          {lock("inquiryFile") ? (
            <input id="f-inquiryFile" value={line.inquiryFileName || "未上传"} disabled />
          ) : (
            <input
              id="f-inquiryFile"
              key={`inquiry-${fileKey}`}
              type="file"
              onChange={(event) => onLine({ inquiryFileName: event.target.files?.[0]?.name ?? "" })}
            />
          )}
          {!lock("inquiryFile") && line.inquiryFileName ? (
            <p className="hint">已选择：{line.inquiryFileName}</p>
          ) : null}
        </Field>
      ) : null}
      <PendingField label="预算金额" />
      <PendingField label="投入性质" />
      <PendingField label="技术要求" />
      <PendingField label="已有合同审批" />

      {actions.length > 0 ? (
        <div className="actions">
          {actions.includes("保存") ? (
            <button type="button" className="btn ghost" onClick={() => onAction("保存")}>
              保存
            </button>
          ) : null}
          {actions.includes("驳回") ? (
            <button type="button" className="btn danger" data-testid="reject" onClick={() => onAction("驳回")}>
              驳回
            </button>
          ) : null}
          {actions.includes("通过") ? (
            <button type="button" className="btn primary" data-testid="approve" onClick={() => onAction("通过")}>
              通过
            </button>
          ) : null}
          {actions.includes("提交") ? (
            <button type="submit" className="btn primary" data-testid="submit">
              提交
            </button>
          ) : null}
        </div>
      ) : (
        <p className="callout">这个角色在「{status}」没有保存、提交、通过或驳回。</p>
      )}
    </form>
  );
}
