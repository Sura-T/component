import { useMemo, useState } from "react";
import { TaskBoardWithFilters, type Task } from "@monorepo/feature-x";
import { ActivityFeedWithSeverity, type ActivityItem } from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { toTitleCase } from "@monorepo/utils";

const plannerTasks: Task[] = [
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

const plannerFeed: ActivityItem[] = [
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
  const [tasks, setTasks] = useState<Task[]>(plannerTasks);
  const [feedItems, setFeedItems] = useState<ActivityItem[]>(plannerFeed);
  const studentName = toTitleCase("surafel takele");

  const doneCount = useMemo(
    () => tasks.filter((task) => task.status === "done").length,
    [tasks]
  );

  function handleAddStudyTask() {
    const newTask: Task = {
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

  return (
    <Stack gap="1rem">
      <Card
        title="System B: Student Planner"
        actions={<Badge label={`${doneCount}/${tasks.length} completed`} />}
      >
        <SectionHeader
          title={`${studentName} - Weekly Plan`}
          subtitle="Personal planning surface assembled from reusable group packages."
        />
      </Card>

      <TaskBoardWithFilters tasks={tasks} onCreateTask={handleAddStudyTask} />
      <ActivityFeedWithSeverity items={feedItems} />
    </Stack>
  );
}

export default StudentPlannerApp;
