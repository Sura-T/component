export interface Task {
    id: string;
    title: string;
    status: "todo" | "doing" | "done";
    createdAt: string;
}
export type TaskStatusFilter = "all" | Task["status"];
export declare function completionRate(tasks: Task[]): number;
export declare function filterTasks(tasks: Task[], filter: TaskStatusFilter): Task[];
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
//# sourceMappingURL=index.d.ts.map