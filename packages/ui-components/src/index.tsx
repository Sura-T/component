import type { CSSProperties, PropsWithChildren, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary";

const baseButtonStyle: CSSProperties = {
  border: "1px solid transparent",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: 600,
  padding: "0.5rem 0.75rem"
};

const buttonStyles: Record<ButtonVariant, CSSProperties> = {
  primary: {
    ...baseButtonStyle,
    background: "#2563eb",
    color: "white"
  },
  secondary: {
    ...baseButtonStyle,
    background: "white",
    borderColor: "#2563eb",
    color: "#2563eb"
  }
};

export interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
}

export function Button({ label, onClick, variant = "primary" }: ButtonProps) {
  return (
    <button onClick={onClick} style={buttonStyles[variant]} type="button">
      {label}
    </button>
  );
}

const cardStyle: CSSProperties = {
  background: "white",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  padding: "1rem"
};

const headingStyle: CSSProperties = {
  color: "#111827",
  fontSize: "1rem",
  fontWeight: 700,
  margin: "0 0 0.5rem 0"
};

export interface CardProps extends PropsWithChildren {
  title: string;
  actions?: ReactNode;
}

export function Card({ title, actions, children }: CardProps) {
  return (
    <section style={cardStyle}>
      <header
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "0.75rem"
        }}
      >
        <h3 style={headingStyle}>{title}</h3>
        {actions}
      </header>
      <div>{children}</div>
    </section>
  );
}

export interface BadgeProps {
  label: string;
}

export function Badge({ label }: BadgeProps) {
  return (
    <span
      style={{
        background: "#eff6ff",
        borderRadius: "999px",
        color: "#1d4ed8",
        fontSize: "0.75rem",
        fontWeight: 600,
        padding: "0.15rem 0.5rem"
      }}
    >
      {label}
    </span>
  );
}

export interface StackProps extends PropsWithChildren {
  direction?: "row" | "column";
  gap?: string;
  align?: CSSProperties["alignItems"];
  justify?: CSSProperties["justifyContent"];
  wrap?: CSSProperties["flexWrap"];
}

export function Stack({
  direction = "column",
  gap = "0.75rem",
  align = "stretch",
  justify = "flex-start",
  wrap = "nowrap",
  children
}: StackProps) {
  return (
    <div
      style={{
        alignItems: align,
        display: "flex",
        flexDirection: direction,
        flexWrap: wrap,
        gap,
        justifyContent: justify
      }}
    >
      {children}
    </div>
  );
}

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function SectionHeader({ title, subtitle, action }: SectionHeaderProps) {
  return (
    <header
      style={{
        alignItems: "flex-start",
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "0.75rem"
      }}
    >
      <div>
        <h2
          style={{
            color: "#111827",
            fontSize: "1.1rem",
            margin: 0
          }}
        >
          {title}
        </h2>
        {subtitle ? (
          <p
            style={{
              color: "#6b7280",
              fontSize: "0.9rem",
              margin: "0.25rem 0 0 0"
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      {action}
    </header>
  );
}

const fieldContainerStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "0.35rem"
};

const labelStyle: CSSProperties = {
  color: "#374151",
  fontSize: "0.85rem",
  fontWeight: 600
};

const helperTextStyle: CSSProperties = {
  color: "#6b7280",
  fontSize: "0.8rem",
  margin: 0
};

const errorTextStyle: CSSProperties = {
  color: "#b91c1c",
  fontSize: "0.8rem",
  margin: 0
};

const baseFieldStyle: CSSProperties = {
  border: "1px solid #d1d5db",
  borderRadius: "8px",
  color: "#111827",
  fontSize: "0.9rem",
  padding: "0.5rem 0.65rem"
};

export interface InputFieldProps {
  id?: string;
  label: string;
  name?: string;
  value: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "search" | "tel" | "url";
  onChange: (value: string) => void;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function InputField({
  id,
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  helperText,
  error,
  required = false,
  disabled = false
}: InputFieldProps) {
  const inputId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined;

  return (
    <div style={fieldContainerStyle}>
      <label htmlFor={inputId} style={labelStyle}>
        {label}
        {required ? " *" : ""}
      </label>
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        id={inputId}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        style={{
          ...baseFieldStyle,
          borderColor: error ? "#dc2626" : baseFieldStyle.borderColor,
          opacity: disabled ? 0.7 : 1
        }}
        type={type}
        value={value}
      />
      {error ? (
        <p id={`${inputId}-error`} style={errorTextStyle}>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} style={helperTextStyle}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectFieldProps {
  id?: string;
  label: string;
  name?: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export function SelectField({
  id,
  label,
  name,
  value,
  options,
  onChange,
  placeholder,
  helperText,
  error,
  required = false,
  disabled = false
}: SelectFieldProps) {
  const selectId = id ?? name ?? label.toLowerCase().replace(/\s+/g, "-");
  const describedBy = error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined;

  return (
    <div style={fieldContainerStyle}>
      <label htmlFor={selectId} style={labelStyle}>
        {label}
        {required ? " *" : ""}
      </label>
      <select
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        disabled={disabled}
        id={selectId}
        name={name}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        style={{
          ...baseFieldStyle,
          backgroundColor: "white",
          borderColor: error ? "#dc2626" : baseFieldStyle.borderColor,
          opacity: disabled ? 0.7 : 1
        }}
        value={value}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${selectId}-error`} style={errorTextStyle}>
          {error}
        </p>
      ) : helperText ? (
        <p id={`${selectId}-helper`} style={helperTextStyle}>
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
