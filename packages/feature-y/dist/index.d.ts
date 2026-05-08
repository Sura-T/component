export interface ActivityItem {
    id: string;
    actor: string;
    action: string;
    occurredAt: string;
    level: "info" | "warning";
}
export type ActivityLevelFilter = "all" | ActivityItem["level"];
export declare function filterByLevel(items: ActivityItem[], level: ActivityLevelFilter): ActivityItem[];
export declare function warningCount(items: ActivityItem[]): number;
export interface ActivityFeedProps {
    items: ActivityItem[];
}
export declare function ActivityFeed({ items }: ActivityFeedProps): import("react/jsx-runtime").JSX.Element;
export interface ActivityFeedWithSeverityProps extends ActivityFeedProps {
    defaultLevel?: ActivityLevelFilter;
    onLevelChange?: (level: ActivityLevelFilter) => void;
}
export declare function ActivityFeedWithSeverity({ items, defaultLevel, onLevelChange }: ActivityFeedWithSeverityProps): import("react/jsx-runtime").JSX.Element;
type ProfileState = "active" | "away" | "busy";
export interface UserProfileStatusValues {
    displayName: string;
    emailAddress: string;
    status: ProfileState;
}
export interface UserProfileStatusPanelProps {
    initialValues?: Partial<UserProfileStatusValues>;
    onSave?: (values: UserProfileStatusValues) => void;
}
export declare function UserProfileStatusPanel({ initialValues, onSave }: UserProfileStatusPanelProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map