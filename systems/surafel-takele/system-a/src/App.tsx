import { useMemo, useState } from "react";
import { TaskBoardWithFilters, type Task } from "@monorepo/feature-x";
import { ActivityFeedWithSeverity, type ActivityItem } from "@monorepo/feature-y";
import { Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate } from "@monorepo/utils";

const initialTasks: Task[] = [
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

const initialActivities: ActivityItem[] = [
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
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const generatedAt = useMemo(
    () => formatDate(new Date(), "en-US", { dateStyle: "full" }),
    []
  );

  function handleCreateTask() {
    const nextId = `ops-${tasks.length + 1}`;
    const newTask: Task = {
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

  return (
    <Stack gap="1rem">
      <Card title="System A: Operations Dashboard">
        <SectionHeader
          title="Surafel Takele - Operations View"
          subtitle={`Generated on ${generatedAt}`}
        />
      </Card>

      <Card title="Student Test Data (Submission Proof)">
        <table
          style={{
            borderCollapse: "collapse",
            width: "100%"
          }}
        >
          <thead>
            <tr style={{ borderBottom: "1px solid #d1d5db" }}>
              <th style={{ padding: "0.35rem 0", textAlign: "left" }}>Name</th>
              <th style={{ padding: "0.35rem 0", textAlign: "left" }}>ID</th>
              <th style={{ padding: "0.35rem 0", textAlign: "left" }}>Section</th>
              <th style={{ padding: "0.35rem 0", textAlign: "left" }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {studentRows.map((student) => (
              <tr key={student.id} style={{ borderBottom: "1px solid #e5e7eb" }}>
                <td style={{ padding: "0.35rem 0" }}>{student.name}</td>
                <td style={{ padding: "0.35rem 0" }}>{student.id}</td>
                <td style={{ padding: "0.35rem 0" }}>{student.section}</td>
                <td style={{ padding: "0.35rem 0" }}>{student.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <TaskBoardWithFilters tasks={tasks} onCreateTask={handleCreateTask} />
      <ActivityFeedWithSeverity items={activities} />
    </Stack>
  );
}

export default OperationsDashboardApp;
