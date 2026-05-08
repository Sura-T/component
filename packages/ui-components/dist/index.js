import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const baseButtonStyle = {
    border: "1px solid transparent",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    padding: "0.5rem 0.75rem"
};
const buttonStyles = {
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
export function Button({ label, onClick, variant = "primary" }) {
    return (_jsx("button", { onClick: onClick, style: buttonStyles[variant], type: "button", children: label }));
}
const cardStyle = {
    background: "white",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "1rem"
};
const headingStyle = {
    color: "#111827",
    fontSize: "1rem",
    fontWeight: 700,
    margin: "0 0 0.5rem 0"
};
export function Card({ title, actions, children }) {
    return (_jsxs("section", { style: cardStyle, children: [_jsxs("header", { style: {
                    alignItems: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.75rem"
                }, children: [_jsx("h3", { style: headingStyle, children: title }), actions] }), _jsx("div", { children: children })] }));
}
export function Badge({ label }) {
    return (_jsx("span", { style: {
            background: "#eff6ff",
            borderRadius: "999px",
            color: "#1d4ed8",
            fontSize: "0.75rem",
            fontWeight: 600,
            padding: "0.15rem 0.5rem"
        }, children: label }));
}
export function Stack({ direction = "column", gap = "0.75rem", align = "stretch", justify = "flex-start", wrap = "nowrap", children }) {
    return (_jsx("div", { style: {
            alignItems: align,
            display: "flex",
            flexDirection: direction,
            flexWrap: wrap,
            gap,
            justifyContent: justify
        }, children: children }));
}
export function SectionHeader({ title, subtitle, action }) {
    return (_jsxs("header", { style: {
            alignItems: "flex-start",
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.75rem"
        }, children: [_jsxs("div", { children: [_jsx("h2", { style: {
                            color: "#111827",
                            fontSize: "1.1rem",
                            margin: 0
                        }, children: title }), subtitle ? (_jsx("p", { style: {
                            color: "#6b7280",
                            fontSize: "0.9rem",
                            margin: "0.25rem 0 0 0"
                        }, children: subtitle })) : null] }), action] }));
}
