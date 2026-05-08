import { Badge, Button, Card } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";

export interface Task {
  id: string;
  title: string;
  status: "todo" | "doing" | "done";
  createdAt: string;
}

export function completionRate(tasks: Task[]): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completed = tasks.filter((task) => task.status === "done").length;
  return Math.round((completed / tasks.length) * 100);
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
