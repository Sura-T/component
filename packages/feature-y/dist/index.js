import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Badge, Button, Card, InputField, SectionHeader, SelectField, Stack } from "@monorepo/ui-components";
import { composeValidators, email, formatDate, required, toTitleCase, validateObject } from "@monorepo/utils";
const levelOptions = ["all", "warning", "info"];
function formatLevel(level) {
    return level === "warning" ? "Warning" : "Info";
}
export function filterByLevel(items, level) {
    if (level === "all") {
        return items;
    }
    return items.filter((item) => item.level === level);
}
export function warningCount(items) {
    return items.filter((item) => item.level === "warning").length;
}
export function ActivityFeed({ items }) {
    return (_jsx(Card, { title: "Feature Y: Activity Feed", children: _jsx("ul", { style: { margin: 0, paddingInlineStart: "1.25rem" }, children: items.map((item) => (_jsxs("li", { style: { marginBottom: "0.75rem" }, children: [_jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }, children: [_jsx("strong", { children: toTitleCase(item.actor) }), _jsx(Badge, { label: formatLevel(item.level) })] }), _jsx("div", { children: item.action }), _jsx("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: formatDate(item.occurredAt) })] }, item.id))) }) }));
}
export function ActivityFeedWithSeverity({ items, defaultLevel = "all", onLevelChange }) {
    const [activeLevel, setActiveLevel] = useState(defaultLevel);
    const filteredItems = useMemo(() => filterByLevel(items, activeLevel), [items, activeLevel]);
    return (_jsxs(Card, { title: "Feature Y: Activity Feed With Severity", actions: _jsxs(Stack, { direction: "row", gap: "0.5rem", align: "center", children: [_jsx(Badge, { label: `${warningCount(filteredItems)} warnings` }), _jsx(Badge, { label: `${filteredItems.length}/${items.length} visible` })] }), children: [_jsx(SectionHeader, { title: "Severity Filters", subtitle: "Focus on warning-level activity when triaging operations." }), _jsx(Stack, { direction: "row", gap: "0.5rem", wrap: "wrap", children: levelOptions.map((level) => (_jsx(Button, { label: toTitleCase(level), onClick: () => {
                        setActiveLevel(level);
                        onLevelChange?.(level);
                    }, variant: activeLevel === level ? "primary" : "secondary" }, level))) }), _jsx("ul", { style: { margin: "1rem 0 0 0", paddingInlineStart: "1.25rem" }, children: filteredItems.map((item) => (_jsxs("li", { style: { marginBottom: "0.75rem" }, children: [_jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }, children: [_jsx("strong", { children: toTitleCase(item.actor) }), _jsx(Badge, { label: formatLevel(item.level) })] }), _jsx("div", { children: item.action }), _jsx("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: formatDate(item.occurredAt) })] }, item.id))) })] }));
}
const statusOptions = [
    { label: "Active", value: "active" },
    { label: "Away", value: "away" },
    { label: "Busy", value: "busy" }
];
const displayNameValidator = composeValidators(required("Display name is required"), (value) => (value.trim().length >= 2 ? null : "Display name is too short"));
const emailAddressValidator = composeValidators(required("Email address is required"), email("Provide a valid email address"));
function hasErrors(errors) {
    return Object.keys(errors).length > 0;
}
export function UserProfileStatusPanel({ initialValues, onSave }) {
    const [values, setValues] = useState({
        displayName: initialValues?.displayName ?? "",
        emailAddress: initialValues?.emailAddress ?? "",
        status: initialValues?.status ?? "active"
    });
    const [errors, setErrors] = useState({});
    const [savedAt, setSavedAt] = useState(null);
    function updateField(key, value) {
        setValues((current) => ({ ...current, [key]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
    }
    function handleSave() {
        const nextErrors = validateObject(values, {
            displayName: displayNameValidator,
            emailAddress: emailAddressValidator,
            status: required("Status is required")
        });
        setErrors(nextErrors);
        if (hasErrors(nextErrors)) {
            return;
        }
        setSavedAt(new Date().toISOString());
        onSave?.(values);
    }
    return (_jsxs(Card, { title: "Feature Y: User Profile Status Panel", actions: _jsx(Badge, { label: toTitleCase(values.status) }), children: [_jsx(SectionHeader, { title: "Profile Status", subtitle: "Update user profile basics and current availability." }), _jsxs(Stack, { gap: "0.85rem", children: [_jsx(InputField, { label: "Display Name", value: values.displayName, onChange: (value) => updateField("displayName", value), placeholder: "e.g. Abdi Esayas", error: errors.displayName, required: true }), _jsx(InputField, { label: "Email Address", type: "email", value: values.emailAddress, onChange: (value) => updateField("emailAddress", value), placeholder: "abdi@example.com", error: errors.emailAddress, required: true }), _jsx(SelectField, { label: "Current Status", value: values.status, options: statusOptions.map((option) => ({ label: option.label, value: option.value })), onChange: (value) => updateField("status", value), error: errors.status, required: true }), _jsxs(Stack, { direction: "row", align: "center", justify: "space-between", children: [_jsx("span", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: savedAt ? `Last saved: ${formatDate(savedAt)}` : "Not saved yet" }), _jsx(Button, { label: hasErrors(errors) ? "Resolve Errors" : "Save Profile", onClick: handleSave })] })] })] }));
}
