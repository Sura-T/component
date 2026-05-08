import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card, InputField, SectionHeader, SelectField, Stack } from "@monorepo/ui-components";
import { buildQueryString, composeValidators, email, formatDate, getDateRangeFrom, groupEventsByDate, minLength, required, toDateKey, toTitleCase, validateObject } from "@monorepo/utils";
const taskStatusOptions = ["all", "todo", "doing", "done"];
const taskSortOptions = [
    "createdAt-desc",
    "createdAt-asc",
    "title-asc",
    "title-desc"
];
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
export function searchAndSortTasks(tasks, searchTerm, sortBy) {
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const filtered = normalizedSearch
        ? tasks.filter((task) => task.title.toLowerCase().includes(normalizedSearch))
        : [...tasks];
    return filtered.sort((left, right) => {
        if (sortBy === "createdAt-desc") {
            return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
        }
        if (sortBy === "createdAt-asc") {
            return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
        }
        if (sortBy === "title-desc") {
            return right.title.localeCompare(left.title);
        }
        return left.title.localeCompare(right.title);
    });
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
const wizardPriorityOptions = [
    { label: "Low", value: "low" },
    { label: "Medium", value: "medium" },
    { label: "High", value: "high" }
];
const titleValidator = composeValidators(required("Task title is required"), minLength(3));
const detailsValidator = composeValidators(required("Details are required"), minLength(10));
const emailValidator = composeValidators(required("Owner email is required"), email("Use a valid email"));
function hasValidationErrors(errors) {
    return Object.keys(errors).length > 0;
}
export function TaskCreationWizard({ onSubmit, onCancel, initialValues }) {
    const [values, setValues] = useState({
        title: initialValues?.title ?? "",
        ownerEmail: initialValues?.ownerEmail ?? "",
        priority: initialValues?.priority ?? "medium",
        details: initialValues?.details ?? ""
    });
    const [errors, setErrors] = useState({});
    const canContinue = !hasValidationErrors(errors);
    function updateValue(key, value) {
        setValues((current) => ({ ...current, [key]: value }));
        setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
    }
    function handleSubmit() {
        const nextErrors = validateObject(values, {
            title: titleValidator,
            ownerEmail: emailValidator,
            priority: required("Priority is required"),
            details: detailsValidator
        });
        setErrors(nextErrors);
        if (hasValidationErrors(nextErrors)) {
            return;
        }
        onSubmit?.(values);
    }
    return (_jsxs(Card, { title: "Feature X: Task Creation Wizard", actions: _jsx(Badge, { label: `Priority: ${toTitleCase(values.priority)}` }), children: [_jsx(SectionHeader, { title: "Create Task", subtitle: "Collect required task details and validate before submitting." }), _jsxs(Stack, { gap: "0.85rem", children: [_jsx(InputField, { label: "Task Title", value: values.title, onChange: (value) => updateValue("title", value), placeholder: "e.g. Prepare onboarding checklist", error: errors.title, required: true }), _jsx(InputField, { label: "Owner Email", type: "email", value: values.ownerEmail, onChange: (value) => updateValue("ownerEmail", value), placeholder: "owner@example.com", error: errors.ownerEmail, required: true }), _jsx(SelectField, { label: "Priority", value: values.priority, options: wizardPriorityOptions.map((option) => ({
                            label: option.label,
                            value: option.value
                        })), onChange: (value) => updateValue("priority", value), error: errors.priority, required: true }), _jsx(InputField, { label: "Details", value: values.details, onChange: (value) => updateValue("details", value), placeholder: "Describe scope, acceptance criteria, and notes.", error: errors.details, helperText: "At least 10 characters", required: true }), _jsxs(Stack, { direction: "row", gap: "0.5rem", justify: "flex-end", children: [_jsx(Button, { label: "Cancel", variant: "secondary", onClick: onCancel }), _jsx(Button, { label: canContinue ? "Create Task" : "Fix Errors", onClick: handleSubmit })] })] })] }));
}
export function TaskSearchAndSortPanel({ tasks, defaultSearch = "", defaultSort = "createdAt-desc", onVisibleTasksChange }) {
    const [searchTerm, setSearchTerm] = useState(defaultSearch);
    const [activeSort, setActiveSort] = useState(defaultSort);
    const visibleTasks = useMemo(() => searchAndSortTasks(tasks, searchTerm, activeSort), [tasks, searchTerm, activeSort]);
    const queryPreview = useMemo(() => buildQueryString({
        search: searchTerm || undefined,
        sort: activeSort,
        visible: visibleTasks.length
    }), [searchTerm, activeSort, visibleTasks.length]);
    useEffect(() => {
        onVisibleTasksChange?.(visibleTasks);
    }, [visibleTasks, onVisibleTasksChange]);
    return (_jsxs(Card, { title: "Feature X: Task Search and Sort Panel", actions: _jsx(Badge, { label: `${visibleTasks.length} matches` }), children: [_jsx(SectionHeader, { title: "Search Tasks", subtitle: "Search by title and sort by date or title for faster triage." }), _jsxs("label", { style: {
                    color: "#374151",
                    display: "block",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    marginBottom: "0.75rem"
                }, children: ["Search term", _jsx("input", { onChange: (event) => setSearchTerm(event.target.value), placeholder: "Search task title...", style: {
                            border: "1px solid #d1d5db",
                            borderRadius: "8px",
                            display: "block",
                            marginTop: "0.35rem",
                            padding: "0.45rem 0.55rem",
                            width: "100%"
                        }, value: searchTerm })] }), _jsx(Stack, { direction: "row", gap: "0.5rem", wrap: "wrap", children: taskSortOptions.map((option) => (_jsx(Button, { label: toTitleCase(option.replace(/-/g, " ")), onClick: () => setActiveSort(option), variant: activeSort === option ? "primary" : "secondary" }, option))) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem", marginTop: "0.85rem" }, children: ["Query preview: ", queryPreview || "(empty)"] }), _jsx("ul", { style: { margin: "0.85rem 0 0 0", paddingInlineStart: "1.25rem" }, children: visibleTasks.map((task) => (_jsxs("li", { style: { marginBottom: "0.5rem" }, children: [_jsx("strong", { children: toTitleCase(task.title) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: ["Status: ", toTitleCase(task.status), " | Created: ", formatDate(task.createdAt)] })] }, task.id))) })] }));
}
export function DeadlineCalendarStrip({ deadlines, anchorDate = new Date(), visibleDays = 7, onDateSelect }) {
    const dateRange = useMemo(() => getDateRangeFrom(anchorDate, visibleDays), [anchorDate, visibleDays]);
    const [selectedDate, setSelectedDate] = useState(() => toDateKey(anchorDate));
    useEffect(() => {
        if (!dateRange.includes(selectedDate) && dateRange.length > 0) {
            setSelectedDate(dateRange[0]);
        }
    }, [dateRange, selectedDate]);
    const groupedDeadlines = useMemo(() => groupEventsByDate(deadlines, (item) => item.dueDate), [deadlines]);
    const visibleDeadlines = groupedDeadlines[selectedDate] ?? [];
    const pendingCount = deadlines.filter((item) => item.status !== "completed").length;
    return (_jsxs(Card, { title: "Feature X: Deadline Calendar Strip", actions: _jsxs(Stack, { direction: "row", gap: "0.5rem", align: "center", children: [_jsx(Badge, { label: `${pendingCount} pending` }), _jsx(Badge, { label: `${visibleDeadlines.length} on selected day` })] }), children: [_jsx(SectionHeader, { title: "Deadline Window", subtitle: "Review due items by day and focus on urgent work." }), _jsx(Stack, { direction: "row", gap: "0.5rem", wrap: "wrap", children: dateRange.map((dateKey) => (_jsx(Button, { label: `${formatDate(dateKey)} (${(groupedDeadlines[dateKey] ?? []).length})`, onClick: () => {
                        setSelectedDate(dateKey);
                        onDateSelect?.(dateKey);
                    }, variant: selectedDate === dateKey ? "primary" : "secondary" }, dateKey))) }), _jsx("ul", { style: { margin: "0.9rem 0 0 0", paddingInlineStart: "1.25rem" }, children: visibleDeadlines.map((item) => (_jsxs("li", { style: { marginBottom: "0.6rem" }, children: [_jsx("strong", { children: toTitleCase(item.title) }), _jsxs("div", { style: { color: "#6b7280", fontSize: "0.85rem" }, children: [toTitleCase(item.status), item.category ? ` | ${toTitleCase(item.category)}` : ""] })] }, item.id))) })] }));
}
