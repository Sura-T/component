import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, InputField, SectionHeader, SelectField, Stack } from "@monorepo/ui-components";
import { buildQueryString, composeValidators, email, formatDate, required, toTitleCase, validateObject } from "@monorepo/utils";
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
const digestFilters = ["all", "unread", "warning", "info"];
export function filterNotificationDigest(items, filter, searchTerm) {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const byFilter = items.filter((item) => {
        if (filter === "all") {
            return true;
        }
        if (filter === "unread") {
            return !item.isRead;
        }
        return item.level === filter;
    });
    if (!normalizedSearch) {
        return byFilter;
    }
    return byFilter.filter((item) => {
        const combinedValue = `${item.title} ${item.message} ${item.recipient}`.toLowerCase();
        return combinedValue.includes(normalizedSearch);
    });
}
export function unreadDigestCount(items) {
    return items.filter((item) => !item.isRead).length;
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
export function NotificationDigestList({ items, defaultFilter = "all", onVisibleItemsChange }) {
    const [activeFilter, setActiveFilter] = useState(defaultFilter);
    const [searchTerm, setSearchTerm] = useState("");
    const visibleItems = useMemo(() => filterNotificationDigest(items, activeFilter, searchTerm), [items, activeFilter, searchTerm]);
    const queryPreview = useMemo(() => buildQueryString({
        filter: activeFilter,
        search: searchTerm || undefined,
        unread: unreadDigestCount(visibleItems)
    }), [activeFilter, searchTerm, visibleItems]);
    useEffect(() => {
        onVisibleItemsChange?.(visibleItems);
    }, [visibleItems, onVisibleItemsChange]);
    return (_jsxs(Card, { title: "Feature Y: Notification Digest List", actions: _jsxs(Stack, { direction: "row", gap: "0.5rem", align: "center", children: [_jsx(Badge, { label: `${unreadDigestCount(visibleItems)} unread` }), _jsx(Badge, { label: `${visibleItems.length} visible` })] }), children: [_jsx(SectionHeader, { title: "Digest Filters", subtitle: "Filter unread and warning notifications for monitoring workflows." }), _jsxs("label", { style: {
                    color: "#374151",
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem"
                }, children: ["Search notification", _jsx("input", { onChange: (event) => setSearchTerm(event.target.value), placeholder: "Search title, message, recipient...", style: {
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            display: "block",
                            marginTop: "0.35rem",
                            padding: "0.45rem 0.55rem",
                            width: "100%"
                        }, value: searchTerm })] }), _jsx(Stack, { direction: "row", gap: "0.5rem", wrap: "wrap", children: digestFilters.map((filter) => (_jsx(Button, { label: toTitleCase(filter), onClick: () => setActiveFilter(filter), variant: activeFilter === filter ? "primary" : "secondary" }, filter))) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem", marginTop: "0.85rem" }, children: ["Query preview: ", queryPreview || "(empty)"] }), _jsx("ul", { style: { margin: "0.85rem 0 0 0", paddingInlineStart: "1.25rem" }, children: visibleItems.map((item) => (_jsxs("li", { style: { marginBottom: "0.75rem" }, children: [_jsxs("div", { style: { display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }, children: [_jsx("strong", { children: item.title }), _jsx(Badge, { label: toTitleCase(item.level) })] }), _jsx("div", { children: item.message }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: [toTitleCase(item.channel), " | ", item.recipient, " | ", formatDate(item.createdAt)] })] }, item.id))) })] }));
}
