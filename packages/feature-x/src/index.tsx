import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";

export interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  createdAt: string;
}

export type TaskStatusFilter = "all" | Task["status"];

const taskStatusOptions: TaskStatusFilter[] = ["all", "todo", "doing", "done"];

export function completionRate(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.status === "done").length;
  return Math.round((completed / tasks.length) * 100);
}

export function filterTasks(tasks: Task[], filter: TaskStatusFilter): Task[] {
  if (filter === "all") {
    return tasks;
  }

  return tasks.filter((task) => task.status === filter);
}

export interface TaskBoardProps {
  tasks: Task[];
  onCreateTask?: () => void;
}

export function TaskBoard({ tasks, onCreateTask }: TaskBoardProps) {
  const completed = completionRate(tasks);

  return (
    <Card
      title="Feature X: Task Board"
      actions={<Badge label={`${completed}% complete`} />}
    >
      <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{toTitleCase(task.title)}</strong>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Created: {formatDate(task.createdAt)}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ marginTop: "0.75rem" }}>
        <Button label="Add Task" onClick={onCreateTask} />
      </div>
    </Card>
  );
}

export interface TaskBoardWithFiltersProps extends TaskBoardProps {
  defaultFilter?: TaskStatusFilter;
  onFilterChange?: (filter: TaskStatusFilter) => void;
}

export function TaskBoardWithFilters({
  tasks,
  onCreateTask,
  defaultFilter = "all",
  onFilterChange
}: TaskBoardWithFiltersProps) {
  const [activeFilter, setActiveFilter] = useState<TaskStatusFilter>(defaultFilter);

  const filteredTasks = useMemo(
    () => filterTasks(tasks, activeFilter),
    [activeFilter, tasks]
  );

  const filteredCompletion = completionRate(filteredTasks);

  return (
    <Card
      title="Feature X: Task Board With Filters"
      actions={
        <Stack direction="row" gap="0.5rem" align="center">
          <Badge label={`${filteredTasks.length}/${tasks.length} visible`} />
          <Badge label={`${filteredCompletion}% complete`} />
        </Stack>
      }
    >
      <SectionHeader
        title="Task Filters"
        subtitle="Filter by workflow status and keep only relevant tasks visible."
      />

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {taskStatusOptions.map((filter) => (
          <Button
            key={filter}
            label={toTitleCase(filter)}
            onClick={() => {
              setActiveFilter(filter);
              onFilterChange?.(filter);
            }}
            variant={activeFilter === filter ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <ul style={{ margin: "1rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {filteredTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{toTitleCase(task.title)}</strong>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Status: {toTitleCase(task.status)} | Created: {formatDate(task.createdAt)}
            </div>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: "0.75rem" }}>
        <Button label="Add Task" onClick={onCreateTask} />
      </div>
    </Card>
  );
}
