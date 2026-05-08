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
