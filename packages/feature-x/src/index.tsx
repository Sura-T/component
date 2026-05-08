import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  Card,
  InputField,
  SectionHeader,
  SelectField,
  Stack
} from "@monorepo/ui-components";
import {
  composeValidators,
  email,
  formatDate,
  minLength,
  required,
  toTitleCase,
  validateObject
} from "@monorepo/utils";

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

type WizardPriority = "low" | "medium" | "high";

export interface TaskCreationWizardValues {
  title: string;
  ownerEmail: string;
  priority: WizardPriority;
  details: string;
}

export interface TaskCreationWizardProps {
  onSubmit?: (values: TaskCreationWizardValues) => void;
  onCancel?: () => void;
  initialValues?: Partial<TaskCreationWizardValues>;
}

const wizardPriorityOptions = [
  { label: "Low", value: "low" },
  { label: "Medium", value: "medium" },
  { label: "High", value: "high" }
] as const;

const titleValidator = composeValidators(required("Task title is required"), minLength(3));
const detailsValidator = composeValidators(required("Details are required"), minLength(10));
const emailValidator = composeValidators(
  required("Owner email is required"),
  email("Use a valid email")
);

function hasValidationErrors(errors: Partial<Record<keyof TaskCreationWizardValues, string>>): boolean {
  return Object.keys(errors).length > 0;
}

export function TaskCreationWizard({
  onSubmit,
  onCancel,
  initialValues
}: TaskCreationWizardProps) {
  const [values, setValues] = useState<TaskCreationWizardValues>({
    title: initialValues?.title ?? "",
    ownerEmail: initialValues?.ownerEmail ?? "",
    priority: initialValues?.priority ?? "medium",
    details: initialValues?.details ?? ""
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskCreationWizardValues, string>>>(
    {}
  );

  const canContinue = !hasValidationErrors(errors);

  function updateValue<K extends keyof TaskCreationWizardValues>(
    key: K,
    value: TaskCreationWizardValues[K]
  ) {
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

  return (
    <Card
      title="Feature X: Task Creation Wizard"
      actions={<Badge label={`Priority: ${toTitleCase(values.priority)}`} />}
    >
      <SectionHeader
        title="Create Task"
        subtitle="Collect required task details and validate before submitting."
      />

      <Stack gap="0.85rem">
        <InputField
          label="Task Title"
          value={values.title}
          onChange={(value) => updateValue("title", value)}
          placeholder="e.g. Prepare onboarding checklist"
          error={errors.title}
          required
        />
        <InputField
          label="Owner Email"
          type="email"
          value={values.ownerEmail}
          onChange={(value) => updateValue("ownerEmail", value)}
          placeholder="owner@example.com"
          error={errors.ownerEmail}
          required
        />
        <SelectField
          label="Priority"
          value={values.priority}
          options={wizardPriorityOptions.map((option) => ({
            label: option.label,
            value: option.value
          }))}
          onChange={(value) => updateValue("priority", value as WizardPriority)}
          error={errors.priority}
          required
        />
        <InputField
          label="Details"
          value={values.details}
          onChange={(value) => updateValue("details", value)}
          placeholder="Describe scope, acceptance criteria, and notes."
          error={errors.details}
          helperText="At least 10 characters"
          required
        />

        <Stack direction="row" gap="0.5rem" justify="flex-end">
          <Button label="Cancel" variant="secondary" onClick={onCancel} />
          <Button label={canContinue ? "Create Task" : "Fix Errors"} onClick={handleSubmit} />
        </Stack>
      </Stack>
    </Card>
  );
}
