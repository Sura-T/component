export interface Task {
    id: string;
    title: string;
    status: "todo" | "doing" | "done";
    createdAt: string;
}
export type TaskStatusFilter = "all" | Task["status"];
export type TaskSortOption = "createdAt-desc" | "createdAt-asc" | "title-asc" | "title-desc";
export declare function completionRate(tasks: Task[]): number;
export declare function filterTasks(tasks: Task[], filter: TaskStatusFilter): Task[];
export declare function searchAndSortTasks(tasks: Task[], searchTerm: string, sortBy: TaskSortOption): Task[];
export interface TaskBoardProps {
    tasks: Task[];
    onCreateTask?: () => void;
}
export declare function TaskBoard({ tasks, onCreateTask }: TaskBoardProps): import("react/jsx-runtime").JSX.Element;
export interface TaskBoardWithFiltersProps extends TaskBoardProps {
    defaultFilter?: TaskStatusFilter;
    onFilterChange?: (filter: TaskStatusFilter) => void;
}
export declare function TaskBoardWithFilters({ tasks, onCreateTask, defaultFilter, onFilterChange }: TaskBoardWithFiltersProps): import("react/jsx-runtime").JSX.Element;
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
export declare function TaskCreationWizard({ onSubmit, onCancel, initialValues }: TaskCreationWizardProps): import("react/jsx-runtime").JSX.Element;
export interface TaskSearchAndSortPanelProps {
    tasks: Task[];
    defaultSearch?: string;
    defaultSort?: TaskSortOption;
    onVisibleTasksChange?: (visibleTasks: Task[]) => void;
}
export declare function TaskSearchAndSortPanel({ tasks, defaultSearch, defaultSort, onVisibleTasksChange }: TaskSearchAndSortPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map