import { useId, type ReactNode } from "react";
import type { Status } from "./domain";

export function Field({
  id,
  label,
  required,
  hint,
  error,
  tag,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  tag?: string;
  children: ReactNode;
}) {
  return (
    <div className="field">
      <label htmlFor={id}>
        {label}
        {required ? (
          <span className="req" aria-hidden="true">
            *
          </span>
        ) : null}
        {required ? <span className="sr">必填</span> : null}
        {tag ? <span className="tag">{tag}</span> : null}
      </label>
      {children}
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function Badge({ status }: { status: Status }) {
  const tone =
    status === "草稿"
      ? "draft"
      : status === "待询价"
        ? "wait"
        : status === "需求终止"
          ? "stop"
          : status === "审批通过·待建 ERP 申请"
            ? "go"
            : "pending";
  return (
    <span className={`badge badge-${tone}`} data-testid="status-badge">
      {status}
    </span>
  );
}

export function Banner({ tone, text }: { tone: string; text: string }) {
  return (
    <div className={`banner banner-${tone}`} role="status" data-testid="banner">
      {text}
    </div>
  );
}

export function PendingField({ label }: { label: string }) {
  const id = useId();
  return (
    <Field id={id} label={label} tag="待确认" hint="规格未定，不能填写。">
      <input id={id} value="待确认" disabled />
    </Field>
  );
}
