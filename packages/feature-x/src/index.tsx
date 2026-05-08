import { useEffect, useMemo, useState } from "react";
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
  buildQueryString,
  composeValidators,
  email,
  formatDate,
  getDateRangeFrom,
  groupEventsByDate,
  minLength,
  required,
  toDateKey,
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
export type TaskSortOption = "createdAt-desc" | "createdAt-asc" | "title-asc" | "title-desc";

const taskStatusOptions: TaskStatusFilter[] = ["all", "todo", "doing", "done"];
const taskSortOptions: TaskSortOption[] = [
  "createdAt-desc",
  "createdAt-asc",
  "title-asc",
  "title-desc"
];

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

export function searchAndSortTasks(
  tasks: Task[],
  searchTerm: string,
  sortBy: TaskSortOption
): Task[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const filtered = normalizedSearch
    ? tasks.filter((task) => task.title.toLowerCase().includes(normalizedSearch))
    : [...tasks];

  return filtered.sort((left, right) => {
    if (sortBy === "createdAt-desc") {
      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime();
    }

    if (sortBy === "createdAt-asc") {
      return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime();
    }

    if (sortBy === "title-desc") {
      return right.title.localeCompare(left.title);
    }

    return left.title.localeCompare(right.title);
  });
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

export interface TaskSearchAndSortPanelProps {
  tasks: Task[];
  defaultSearch?: string;
  defaultSort?: TaskSortOption;
  onVisibleTasksChange?: (visibleTasks: Task[]) => void;
}

export function TaskSearchAndSortPanel({
  tasks,
  defaultSearch = "",
  defaultSort = "createdAt-desc",
  onVisibleTasksChange
}: TaskSearchAndSortPanelProps) {
  const [searchTerm, setSearchTerm] = useState(defaultSearch);
  const [activeSort, setActiveSort] = useState<TaskSortOption>(defaultSort);

  const visibleTasks = useMemo(
    () => searchAndSortTasks(tasks, searchTerm, activeSort),
    [tasks, searchTerm, activeSort]
  );

  const queryPreview = useMemo(
    () =>
      buildQueryString({
        search: searchTerm || undefined,
        sort: activeSort,
        visible: visibleTasks.length
      }),
    [searchTerm, activeSort, visibleTasks.length]
  );

  useEffect(() => {
    onVisibleTasksChange?.(visibleTasks);
  }, [visibleTasks, onVisibleTasksChange]);

  return (
    <Card
      title="Feature X: Task Search and Sort Panel"
      actions={<Badge label={`${visibleTasks.length} matches`} />}
    >
      <SectionHeader
        title="Search Tasks"
        subtitle="Search by title and sort by date or title for faster triage."
      />

      <label
        style={{
          color: "#374151",
          display: "block",
          fontSize: "0.9rem",
          fontWeight: 600,
          marginBottom: "0.75rem"
        }}
      >
        Search term
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search task title..."
          style={{
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            display: "block",
            marginTop: "0.35rem",
            padding: "0.45rem 0.55rem",
            width: "100%"
          }}
          value={searchTerm}
        />
      </label>

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {taskSortOptions.map((option) => (
          <Button
            key={option}
            label={toTitleCase(option.replace(/-/g, " "))}
            onClick={() => setActiveSort(option)}
            variant={activeSort === option ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.85rem" }}>
        Query preview: {queryPreview || "(empty)"}
      </div>

      <ul style={{ margin: "0.85rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {visibleTasks.map((task) => (
          <li key={task.id} style={{ marginBottom: "0.5rem" }}>
            <strong>{toTitleCase(task.title)}</strong>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Status: {toTitleCase(task.status)} | Created: {formatDate(task.createdAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export type DeadlineStatus = "planned" | "due" | "overdue" | "completed";

export interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  status: DeadlineStatus;
  category?: string;
}

export interface DeadlineCalendarStripProps {
  deadlines: DeadlineItem[];
  anchorDate?: string | Date;
  visibleDays?: number;
  onDateSelect?: (dateKey: string) => void;
}

export function DeadlineCalendarStrip({
  deadlines,
  anchorDate = new Date(),
  visibleDays = 7,
  onDateSelect
}: DeadlineCalendarStripProps) {
  const dateRange = useMemo(
    () => getDateRangeFrom(anchorDate, visibleDays),
    [anchorDate, visibleDays]
  );
  const [selectedDate, setSelectedDate] = useState<string>(() => toDateKey(anchorDate));

  useEffect(() => {
    if (!dateRange.includes(selectedDate) && dateRange.length > 0) {
      setSelectedDate(dateRange[0]);
    }
  }, [dateRange, selectedDate]);

  const groupedDeadlines = useMemo(
    () => groupEventsByDate(deadlines, (item) => item.dueDate),
    [deadlines]
  );

  const visibleDeadlines = groupedDeadlines[selectedDate] ?? [];
  const pendingCount = deadlines.filter((item) => item.status !== "completed").length;

  return (
    <Card
      title="Feature X: Deadline Calendar Strip"
      actions={
        <Stack direction="row" gap="0.5rem" align="center">
          <Badge label={`${pendingCount} pending`} />
          <Badge label={`${visibleDeadlines.length} on selected day`} />
        </Stack>
      }
    >
      <SectionHeader
        title="Deadline Window"
        subtitle="Review due items by day and focus on urgent work."
      />

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {dateRange.map((dateKey) => (
          <Button
            key={dateKey}
            label={`${formatDate(dateKey)} (${(groupedDeadlines[dateKey] ?? []).length})`}
            onClick={() => {
              setSelectedDate(dateKey);
              onDateSelect?.(dateKey);
            }}
            variant={selectedDate === dateKey ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <ul style={{ margin: "0.9rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {visibleDeadlines.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.6rem" }}>
            <strong>{toTitleCase(item.title)}</strong>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              {toTitleCase(item.status)}
              {item.category ? ` | ${toTitleCase(item.category)}` : ""}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
