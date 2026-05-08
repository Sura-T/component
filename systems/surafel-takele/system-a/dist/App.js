import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { TaskBoardWithFilters } from "@monorepo/feature-x";
import { ActivityFeedWithSeverity } from "@monorepo/feature-y";
import { Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate } from "@monorepo/utils";
const initialTasks = [
    {
        id: "ops-1",
        title: "server health check",
        status: "doing",
        createdAt: "2026-05-07T09:00:00.000Z"
    },
    {
        id: "ops-2",
        title: "user support triage",
        status: "todo",
        createdAt: "2026-05-07T11:10:00.000Z"
    },
    {
        id: "ops-3",
        title: "weekly report submission",
        status: "done",
        createdAt: "2026-05-06T08:00:00.000Z"
    }
];
const initialActivities = [
    {
        id: "activity-1",
        actor: "operations bot",
        action: "Raised server response-time warning.",
        occurredAt: "2026-05-08T06:45:00.000Z",
        level: "warning"
    },
    {
        id: "activity-2",
        actor: "support desk",
        action: "Resolved pending student request batch.",
        occurredAt: "2026-05-08T05:30:00.000Z",
        level: "info"
    }
];
const studentRows = [
    { name: "Surafel Takele", id: "ugr/25356/14", section: "2", year: "5th" },
    { name: "Gebriel Admasu", id: "ugr/25584/14", section: "2", year: "5th" },
    { name: "Abdi Esayas", id: "ugr/25381/14", section: "2", year: "5th" },
    { name: "Tamirat Kebede", id: "ugr/25349/14", section: "3", year: "5th" }
];
export function OperationsDashboardApp() {
    const [tasks, setTasks] = useState(initialTasks);
    const [activities, setActivities] = useState(initialActivities);
    const generatedAt = useMemo(() => formatDate(new Date(), "en-US", { dateStyle: "full" }), []);
    function handleCreateTask() {
        const nextId = `ops-${tasks.length + 1}`;
        const newTask = {
            id: nextId,
            title: "new operations action item",
            status: "todo",
            createdAt: new Date().toISOString()
        };
        setTasks((currentTasks) => [newTask, ...currentTasks]);
        setActivities((currentActivities) => [
            {
                id: `activity-${currentActivities.length + 1}`,
                actor: "system",
                action: "Created a new operations task from dashboard.",
                occurredAt: new Date().toISOString(),
                level: "info"
            },
            ...currentActivities
        ]);
    }
    return (_jsxs(Stack, { gap: "1rem", children: [_jsx(Card, { title: "System A: Operations Dashboard", children: _jsx(SectionHeader, { title: "Surafel Takele - Operations View", subtitle: `Generated on ${generatedAt}` }) }), _jsx(Card, { title: "Student Test Data (Submission Proof)", children: _jsxs("table", { style: {
                        borderCollapse: "collapse",
                        width: "100%"
                    }, children: [_jsx("thead", { children: _jsxs("tr", { style: { borderBottom: "1px solid #d1d5db" }, children: [_jsx("th", { style: { padding: "0.35rem 0", textAlign: "left" }, children: "Name" }), _jsx("th", { style: { padding: "0.35rem 0", textAlign: "left" }, children: "ID" }), _jsx("th", { style: { padding: "0.35rem 0", textAlign: "left" }, children: "Section" }), _jsx("th", { style: { padding: "0.35rem 0", textAlign: "left" }, children: "Year" })] }) }), _jsx("tbody", { children: studentRows.map((student) => (_jsxs("tr", { style: { borderBottom: "1px solid #e5e7eb" }, children: [_jsx("td", { style: { padding: "0.35rem 0" }, children: student.name }), _jsx("td", { style: { padding: "0.35rem 0" }, children: student.id }), _jsx("td", { style: { padding: "0.35rem 0" }, children: student.section }), _jsx("td", { style: { padding: "0.35rem 0" }, children: student.year })] }, student.id))) })] }) }), _jsx(TaskBoardWithFilters, { tasks: tasks, onCreateTask: handleCreateTask }), _jsx(ActivityFeedWithSeverity, { items: activities })] }));
}
export default OperationsDashboardApp;
