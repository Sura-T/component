import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, useState } from "react";
import { TaskBoardWithFilters } from "@monorepo/feature-x";
import { ActivityFeedWithSeverity } from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { toTitleCase } from "@monorepo/utils";
const plannerTasks = [
    {
        id: "planner-1",
        title: "prepare ai assignment",
        status: "doing",
        createdAt: "2026-05-08T07:30:00.000Z"
    },
    {
        id: "planner-2",
        title: "database revision",
        status: "todo",
        createdAt: "2026-05-08T08:00:00.000Z"
    },
    {
        id: "planner-3",
        title: "ui feedback review",
        status: "done",
        createdAt: "2026-05-07T15:45:00.000Z"
    }
];
const plannerFeed = [
    {
        id: "planner-activity-1",
        actor: "course portal",
        action: "Deadline reminder sent for AI assignment.",
        occurredAt: "2026-05-08T09:10:00.000Z",
        level: "warning"
    },
    {
        id: "planner-activity-2",
        actor: "study group",
        action: "Weekly collaboration session scheduled.",
        occurredAt: "2026-05-08T08:40:00.000Z",
        level: "info"
    }
];
export function StudentPlannerApp() {
    const [tasks, setTasks] = useState(plannerTasks);
    const [feedItems, setFeedItems] = useState(plannerFeed);
    const studentName = toTitleCase("surafel takele");
    const doneCount = useMemo(() => tasks.filter((task) => task.status === "done").length, [tasks]);
    function handleAddStudyTask() {
        const newTask = {
            id: `planner-${tasks.length + 1}`,
            title: "new study item",
            status: "todo",
            createdAt: new Date().toISOString()
        };
        setTasks((currentTasks) => [newTask, ...currentTasks]);
        setFeedItems((currentItems) => [
            {
                id: `planner-activity-${currentItems.length + 1}`,
                actor: "planner",
                action: "Study item added to weekly plan.",
                occurredAt: new Date().toISOString(),
                level: "info"
            },
            ...currentItems
        ]);
    }
    return (_jsxs(Stack, { gap: "1rem", children: [_jsx(Card, { title: "System B: Student Planner", actions: _jsx(Badge, { label: `${doneCount}/${tasks.length} completed` }), children: _jsx(SectionHeader, { title: `${studentName} - Weekly Plan`, subtitle: "Personal planning surface assembled from reusable group packages." }) }), _jsx(TaskBoardWithFilters, { tasks: tasks, onCreateTask: handleAddStudyTask }), _jsx(ActivityFeedWithSeverity, { items: feedItems })] }));
}
export default StudentPlannerApp;
