import { useMemo, useState } from "react";
import {
  TaskBoardWithFilters,
  TaskSearchAndSortPanel,
  completionRate,
  type Task
} from "@monorepo/feature-x";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { buildQueryString, formatDate, toTitleCase } from "@monorepo/utils";

const attendanceTasks: Task[] = [
  {
    id: "attendance-1",
    title: "mark section a attendance",
    status: "doing",
    createdAt: "2026-05-08T06:20:00.000Z"
  },
  {
    id: "attendance-2",
    title: "review late arrivals",
    status: "todo",
    createdAt: "2026-05-08T06:50:00.000Z"
  },
  {
    id: "attendance-3",
    title: "publish attendance summary",
    status: "done",
    createdAt: "2026-05-07T14:00:00.000Z"
  }
];

const classRooms = ["section-a", "section-b", "section-c"] as const;

export function AttendanceTrackerApp() {
  const [activeClassRoom, setActiveClassRoom] = useState<(typeof classRooms)[number]>(
    "section-a"
  );
  const [tasks, setTasks] = useState<Task[]>(attendanceTasks);
  const [visibleTasks, setVisibleTasks] = useState<Task[]>(attendanceTasks);

  const completion = useMemo(() => completionRate(visibleTasks), [visibleTasks]);

  const queryPreview = useMemo(
    () =>
      buildQueryString({
        classId: activeClassRoom,
        generatedOn: new Date(),
        visibleTasks: visibleTasks.length
      }),
    [activeClassRoom, visibleTasks.length]
  );

  function handleCreateFollowUpTask() {
    const createdAt = new Date().toISOString();
    const newTask: Task = {
      id: `attendance-${tasks.length + 1}`,
      title: `follow-up for ${activeClassRoom}`,
      status: "todo",
      createdAt
    };

    setTasks((currentTasks) => [newTask, ...currentTasks]);
  }

  return (
    <Stack gap="1rem">
      <Card
        title="System A: Attendance Tracker"
        actions={
          <Stack direction="row" gap="0.5rem" align="center">
            <Badge label={`${visibleTasks.length} visible`} />
            <Badge label={`${completion}% completion`} />
          </Stack>
        }
      >
        <SectionHeader
          title="Gebriel Admasu - Class Attendance Operations"
          subtitle={`Last refreshed: ${formatDate(new Date())}`}
        />

        <Stack direction="row" gap="0.5rem" wrap="wrap">
          {classRooms.map((classRoom) => (
            <Button
              key={classRoom}
              label={toTitleCase(classRoom.replace("-", " "))}
              onClick={() => setActiveClassRoom(classRoom)}
              variant={activeClassRoom === classRoom ? "primary" : "secondary"}
            />
          ))}
        </Stack>

        <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.75rem" }}>
          Query preview: {queryPreview || "(empty)"}
        </div>
      </Card>

      <TaskSearchAndSortPanel tasks={tasks} onVisibleTasksChange={setVisibleTasks} />
      <TaskBoardWithFilters tasks={visibleTasks} onCreateTask={handleCreateFollowUpTask} />
    </Stack>
  );
}

export default AttendanceTrackerApp;
