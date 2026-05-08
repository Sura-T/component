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
