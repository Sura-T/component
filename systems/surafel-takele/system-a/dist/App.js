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
    return (_jsxs(Stack, { gap: "1rem", children: [_jsx(Card, { title: "System A: Operations Dashboard", children: _jsx(SectionHeader, { title: "Surafel Takele - Operations View", subtitle: `Generated on ${generatedAt}` }) }), _jsx(TaskBoardWithFilters, { tasks: tasks, onCreateTask: handleCreateTask }), _jsx(ActivityFeedWithSeverity, { items: activities })] }));
}
export default OperationsDashboardApp;
