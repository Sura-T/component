import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";
const taskStatusOptions = ["all", "todo", "doing", "done"];
export function completionRate(tasks) {
    if (tasks.length === 0) {
        return 0;
    }
    const completed = tasks.filter((task) => task.status === "done").length;
    return Math.round((completed / tasks.length) * 100);
}
export function filterTasks(tasks, filter) {
    if (filter === "all") {
        return tasks;
    }
    return tasks.filter((task) => task.status === filter);
}
export function TaskBoard({ tasks, onCreateTask }) {
    const completed = completionRate(tasks);
    return (_jsxs(Card, { title: "Feature X: Task Board", actions: _jsx(Badge, { label: `${completed}% complete` }), children: [_jsx("ul", { style: { margin: 0, paddingInlineStart: "1.25rem" }, children: tasks.map((task) => (_jsxs("li", { style: { marginBottom: "0.5rem" }, children: [_jsx("strong", { children: toTitleCase(task.title) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: ["Created: ", formatDate(task.createdAt)] })] }, task.id))) }), _jsx("div", { style: { marginTop: "0.75rem" }, children: _jsx(Button, { label: "Add Task", onClick: onCreateTask }) })] }));
}
export function TaskBoardWithFilters({ tasks, onCreateTask, defaultFilter = "all", onFilterChange }) {
    const [activeFilter, setActiveFilter] = useState(defaultFilter);
    const filteredTasks = useMemo(() => filterTasks(tasks, activeFilter), [activeFilter, tasks]);
    const filteredCompletion = completionRate(filteredTasks);
    return (_jsxs(Card, { title: "Feature X: Task Board With Filters", actions: _jsxs(Stack, { direction: "row", gap: "0.5rem", align: "center", children: [_jsx(Badge, { label: `${filteredTasks.length}/${tasks.length} visible` }), _jsx(Badge, { label: `${filteredCompletion}% complete` })] }), children: [_jsx(SectionHeader, { title: "Task Filters", subtitle: "Filter by workflow status and keep only relevant tasks visible." }), _jsx(Stack, { direction: "row", gap: "0.5rem", wrap: "wrap", children: taskStatusOptions.map((filter) => (_jsx(Button, { label: toTitleCase(filter), onClick: () => {
                        setActiveFilter(filter);
                        onFilterChange?.(filter);
                    }, variant: activeFilter === filter ? "primary" : "secondary" }, filter))) }), _jsx("ul", { style: { margin: "1rem 0 0 0", paddingInlineStart: "1.25rem" }, children: filteredTasks.map((task) => (_jsxs("li", { style: { marginBottom: "0.5rem" }, children: [_jsx("strong", { children: toTitleCase(task.title) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: ["Status: ", toTitleCase(task.status), " | Created: ", formatDate(task.createdAt)] })] }, task.id))) }), _jsx("div", { style: { marginTop: "0.75rem" }, children: _jsx(Button, { label: "Add Task", onClick: onCreateTask }) })] }));
}
