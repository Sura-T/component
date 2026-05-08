import { useMemo, useState } from "react";
import {
  DeadlineCalendarStrip,
  TaskBoardWithFilters,
  type DeadlineItem,
  type Task
} from "@monorepo/feature-x";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { getDateRangeFrom, toDateKey, toTitleCase } from "@monorepo/utils";

const boardTasks: Task[] = [
  {
    id: "event-task-1",
    title: "confirm hall booking",
    status: "doing",
    createdAt: "2026-05-09T08:30:00.000Z"
  },
  {
    id: "event-task-2",
    title: "speaker equipment check",
    status: "todo",
    createdAt: "2026-05-10T07:00:00.000Z"
  },
  {
    id: "event-task-3",
    title: "publish registration form",
    status: "done",
    createdAt: "2026-05-08T15:30:00.000Z"
  }
];

const boardDeadlines: DeadlineItem[] = [
  {
    id: "deadline-1",
    title: "venue final confirmation",
    dueDate: "2026-05-09T10:00:00.000Z",
    status: "due",
    category: "logistics"
  },
  {
    id: "deadline-2",
    title: "event poster delivery",
    dueDate: "2026-05-11T12:00:00.000Z",
    status: "planned",
    category: "communications"
  },
  {
    id: "deadline-3",
    title: "security checklist submission",
    dueDate: "2026-05-12T09:00:00.000Z",
    status: "planned",
    category: "operations"
  }
];

export function EventManagementBoardApp() {
  const [selectedDate, setSelectedDate] = useState<string>(toDateKey(new Date()));
  const [tasks, setTasks] = useState<Task[]>(boardTasks);
  const planningDays = useMemo(() => getDateRangeFrom(new Date(), 7), []);

  const selectedDateTasks = useMemo(
    () => tasks.filter((task) => toDateKey(task.createdAt) === selectedDate),
    [tasks, selectedDate]
  );

  function addFollowUpTask() {
    setTasks((currentTasks) => [
      {
        id: `event-task-${currentTasks.length + 1}`,
        title: "new event follow-up",
        status: "todo",
        createdAt: new Date().toISOString()
      },
      ...currentTasks
    ]);
  }

  return (
    <Stack gap="1rem">
      <Card
        title="System A: Event Management Board"
        actions={
          <Stack direction="row" gap="0.5rem" align="center">
            <Badge label={`${planningDays.length} day window`} />
            <Badge label={`${selectedDateTasks.length} tasks on selected day`} />
          </Stack>
        }
      >
        <SectionHeader
          title="Tamirat Kebede - Event Operations"
          subtitle={`Selected day: ${selectedDate}`}
        />
      </Card>

      <DeadlineCalendarStrip
        deadlines={boardDeadlines}
        onDateSelect={(dateKey) => setSelectedDate(dateKey)}
      />

      <Card title="Daily Task Snapshot">
        <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
          {selectedDateTasks.map((task) => (
            <li key={task.id} style={{ marginBottom: "0.5rem" }}>
              {toTitleCase(task.title)}
            </li>
          ))}
        </ul>
      </Card>

      <TaskBoardWithFilters tasks={tasks} onCreateTask={addFollowUpTask} />
    </Stack>
  );
}

export default EventManagementBoardApp;
