import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";
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
