import type { CSSProperties, PropsWithChildren, ReactNode } from "react";
export type ButtonVariant = "primary" | "secondary";
export interface ButtonProps {
    label: string;
    onClick?: () => void;
    variant?: ButtonVariant;
}
export declare function Button({ label, onClick, variant }: ButtonProps): import("react/jsx-runtime").JSX.Element;
export interface CardProps extends PropsWithChildren {
    title: string;
    actions?: ReactNode;
}
export declare function Card({ title, actions, children }: CardProps): import("react/jsx-runtime").JSX.Element;
export interface BadgeProps {
    label: string;
}
export declare function Badge({ label }: BadgeProps): import("react/jsx-runtime").JSX.Element;
export interface StackProps extends PropsWithChildren {
    direction?: "row" | "column";
    gap?: string;
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    wrap?: CSSProperties["flexWrap"];
}
export declare function Stack({ direction, gap, align, justify, wrap, children }: StackProps): import("react/jsx-runtime").JSX.Element;
export interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
}
export declare function SectionHeader({ title, subtitle, action }: SectionHeaderProps): import("react/jsx-runtime").JSX.Element;
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
export declare function InputField({ id, label, name, value, placeholder, type, onChange, helperText, error, required, disabled }: InputFieldProps): import("react/jsx-runtime").JSX.Element;
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
export declare function SelectField({ id, label, name, value, options, onChange, placeholder, helperText, error, required, disabled }: SelectFieldProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=index.d.ts.map