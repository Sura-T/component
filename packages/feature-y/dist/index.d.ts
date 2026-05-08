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
export interface NotificationDigestItem {
    id: string;
    recipient: string;
    title: string;
    message: string;
    level: ActivityItem["level"];
    channel: "email" | "in-app" | "sms";
    createdAt: string;
    isRead: boolean;
}
export type NotificationDigestFilter = "all" | "unread" | "warning" | "info";
export declare function filterNotificationDigest(items: NotificationDigestItem[], filter: NotificationDigestFilter, searchTerm: string): NotificationDigestItem[];
export declare function unreadDigestCount(items: NotificationDigestItem[]): number;
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
export interface NotificationDigestListProps {
    items: NotificationDigestItem[];
    defaultFilter?: NotificationDigestFilter;
    onVisibleItemsChange?: (visibleItems: NotificationDigestItem[]) => void;
}
export declare function NotificationDigestList({ items, defaultFilter, onVisibleItemsChange }: NotificationDigestListProps): import("react/jsx-runtime").JSX.Element;
export type AnnouncementChannel = "web" | "email" | "mobile";
export interface AnnouncementItem {
    id: string;
    title: string;
    body: string;
    publishedAt: string;
    channel: AnnouncementChannel;
    audience?: string;
}
export interface AnnouncementTimelineProps {
    announcements: AnnouncementItem[];
    rangeStart?: string | Date;
    rangeEnd?: string | Date;
    onDateSelect?: (dateKey: string) => void;
}
export declare function AnnouncementTimeline({ announcements, rangeStart, rangeEnd, onDateSelect }: AnnouncementTimelineProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map