import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { Badge, Button, Card, InputField, SectionHeader, SelectField, Stack } from "@monorepo/ui-components";
import { composeValidators, email, formatDate, minLength, required, toTitleCase, validateObject } from "@monorepo/utils";
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
