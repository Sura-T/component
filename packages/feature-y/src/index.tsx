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
  getDateRange,
  groupEventsByDate,
  isDateWithinRange,
  required,
  toDateKey,
  toTitleCase,
  validateObject
} from "@monorepo/utils";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  occurredAt: string;
  level: "info" | "warning";
}

export type ActivityLevelFilter = "all" | ActivityItem["level"];

const levelOptions: ActivityLevelFilter[] = ["all", "warning", "info"];

function formatLevel(level: ActivityItem["level"]): string {
  return level === "warning" ? "Warning" : "Info";
}

export function filterByLevel(
  items: ActivityItem[],
  level: ActivityLevelFilter
): ActivityItem[] {
  if (level === "all") {
    return items;
  }

  return items.filter((item) => item.level === level);
}

export function warningCount(items: ActivityItem[]): number {
  return items.filter((item) => item.level === "warning").length;
}

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

const digestFilters: NotificationDigestFilter[] = ["all", "unread", "warning", "info"];

export function filterNotificationDigest(
  items: NotificationDigestItem[],
  filter: NotificationDigestFilter,
  searchTerm: string
): NotificationDigestItem[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  const byFilter = items.filter((item) => {
    if (filter === "all") {
      return true;
    }

    if (filter === "unread") {
      return !item.isRead;
    }

    return item.level === filter;
  });

  if (!normalizedSearch) {
    return byFilter;
  }

  return byFilter.filter((item) => {
    const combinedValue = `${item.title} ${item.message} ${item.recipient}`.toLowerCase();
    return combinedValue.includes(normalizedSearch);
  });
}

export function unreadDigestCount(items: NotificationDigestItem[]): number {
  return items.filter((item) => !item.isRead).length;
}

export interface ActivityFeedProps {
  items: ActivityItem[];
}

export function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <Card title="Feature Y: Activity Feed">
      <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
        {items.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <strong>{toTitleCase(item.actor)}</strong>
              <Badge label={formatLevel(item.level)} />
            </div>
            <div>{item.action}</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              {formatDate(item.occurredAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

export interface ActivityFeedWithSeverityProps extends ActivityFeedProps {
  defaultLevel?: ActivityLevelFilter;
  onLevelChange?: (level: ActivityLevelFilter) => void;
}

export function ActivityFeedWithSeverity({
  items,
  defaultLevel = "all",
  onLevelChange
}: ActivityFeedWithSeverityProps) {
  const [activeLevel, setActiveLevel] = useState<ActivityLevelFilter>(defaultLevel);
  const filteredItems = useMemo(() => filterByLevel(items, activeLevel), [items, activeLevel]);

  return (
    <Card
      title="Feature Y: Activity Feed With Severity"
      actions={
        <Stack direction="row" gap="0.5rem" align="center">
          <Badge label={`${warningCount(filteredItems)} warnings`} />
          <Badge label={`${filteredItems.length}/${items.length} visible`} />
        </Stack>
      }
    >
      <SectionHeader
        title="Severity Filters"
        subtitle="Focus on warning-level activity when triaging operations."
      />

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {levelOptions.map((level) => (
          <Button
            key={level}
            label={toTitleCase(level)}
            onClick={() => {
              setActiveLevel(level);
              onLevelChange?.(level);
            }}
            variant={activeLevel === level ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <ul style={{ margin: "1rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {filteredItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <strong>{toTitleCase(item.actor)}</strong>
              <Badge label={formatLevel(item.level)} />
            </div>
            <div>{item.action}</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              {formatDate(item.occurredAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

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

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Away", value: "away" },
  { label: "Busy", value: "busy" }
] as const;

const displayNameValidator = composeValidators(
  required("Display name is required"),
  (value: string) => (value.trim().length >= 2 ? null : "Display name is too short")
);
const emailAddressValidator = composeValidators(
  required("Email address is required"),
  email("Provide a valid email address")
);

function hasErrors(errors: Partial<Record<keyof UserProfileStatusValues, string>>): boolean {
  return Object.keys(errors).length > 0;
}

export function UserProfileStatusPanel({
  initialValues,
  onSave
}: UserProfileStatusPanelProps) {
  const [values, setValues] = useState<UserProfileStatusValues>({
    displayName: initialValues?.displayName ?? "",
    emailAddress: initialValues?.emailAddress ?? "",
    status: initialValues?.status ?? "active"
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UserProfileStatusValues, string>>>(
    {}
  );
  const [savedAt, setSavedAt] = useState<string | null>(null);

  function updateField<K extends keyof UserProfileStatusValues>(
    key: K,
    value: UserProfileStatusValues[K]
  ) {
    setValues((current) => ({ ...current, [key]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [key]: undefined }));
  }

  function handleSave() {
    const nextErrors = validateObject(values, {
      displayName: displayNameValidator,
      emailAddress: emailAddressValidator,
      status: required("Status is required")
    });

    setErrors(nextErrors);
    if (hasErrors(nextErrors)) {
      return;
    }

    setSavedAt(new Date().toISOString());
    onSave?.(values);
  }

  return (
    <Card
      title="Feature Y: User Profile Status Panel"
      actions={<Badge label={toTitleCase(values.status)} />}
    >
      <SectionHeader
        title="Profile Status"
        subtitle="Update user profile basics and current availability."
      />

      <Stack gap="0.85rem">
        <InputField
          label="Display Name"
          value={values.displayName}
          onChange={(value) => updateField("displayName", value)}
          placeholder="e.g. Abdi Esayas"
          error={errors.displayName}
          required
        />
        <InputField
          label="Email Address"
          type="email"
          value={values.emailAddress}
          onChange={(value) => updateField("emailAddress", value)}
          placeholder="abdi@example.com"
          error={errors.emailAddress}
          required
        />
        <SelectField
          label="Current Status"
          value={values.status}
          options={statusOptions.map((option) => ({ label: option.label, value: option.value }))}
          onChange={(value) => updateField("status", value as ProfileState)}
          error={errors.status}
          required
        />

        <Stack direction="row" align="center" justify="space-between">
          <span style={{ color: "#6b7280", fontSize: "0.85rem" }}>
            {savedAt ? `Last saved: ${formatDate(savedAt)}` : "Not saved yet"}
          </span>
          <Button
            label={hasErrors(errors) ? "Resolve Errors" : "Save Profile"}
            onClick={handleSave}
          />
        </Stack>
      </Stack>
    </Card>
  );
}

export interface NotificationDigestListProps {
  items: NotificationDigestItem[];
  defaultFilter?: NotificationDigestFilter;
  onVisibleItemsChange?: (visibleItems: NotificationDigestItem[]) => void;
}

export function NotificationDigestList({
  items,
  defaultFilter = "all",
  onVisibleItemsChange
}: NotificationDigestListProps) {
  const [activeFilter, setActiveFilter] =
    useState<NotificationDigestFilter>(defaultFilter);
  const [searchTerm, setSearchTerm] = useState("");

  const visibleItems = useMemo(
    () => filterNotificationDigest(items, activeFilter, searchTerm),
    [items, activeFilter, searchTerm]
  );

  const queryPreview = useMemo(
    () =>
      buildQueryString({
        filter: activeFilter,
        search: searchTerm || undefined,
        unread: unreadDigestCount(visibleItems)
      }),
    [activeFilter, searchTerm, visibleItems]
  );

  useEffect(() => {
    onVisibleItemsChange?.(visibleItems);
  }, [visibleItems, onVisibleItemsChange]);

  return (
    <Card
      title="Feature Y: Notification Digest List"
      actions={
        <Stack direction="row" gap="0.5rem" align="center">
          <Badge label={`${unreadDigestCount(visibleItems)} unread`} />
          <Badge label={`${visibleItems.length} visible`} />
        </Stack>
      }
    >
      <SectionHeader
        title="Digest Filters"
        subtitle="Filter unread and warning notifications for monitoring workflows."
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
        Search notification
        <input
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search title, message, recipient..."
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
        {digestFilters.map((filter) => (
          <Button
            key={filter}
            label={toTitleCase(filter)}
            onClick={() => setActiveFilter(filter)}
            variant={activeFilter === filter ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.85rem" }}>
        Query preview: {queryPreview || "(empty)"}
      </div>

      <ul style={{ margin: "0.85rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {visibleItems.map((item) => (
          <li key={item.id} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <strong>{item.title}</strong>
              <Badge label={toTitleCase(item.level)} />
            </div>
            <div>{item.message}</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              {toTitleCase(item.channel)} | {item.recipient} | {formatDate(item.createdAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

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

type AnnouncementChannelFilter = "all" | AnnouncementChannel;
const timelineChannelOptions: AnnouncementChannelFilter[] = ["all", "web", "email", "mobile"];

function sortNewestFirst(left: AnnouncementItem, right: AnnouncementItem): number {
  return new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime();
}

export function AnnouncementTimeline({
  announcements,
  rangeStart,
  rangeEnd,
  onDateSelect
}: AnnouncementTimelineProps) {
  const sortedAnnouncements = useMemo(
    () => [...announcements].sort(sortNewestFirst),
    [announcements]
  );

  const oldestAnnouncement = sortedAnnouncements[sortedAnnouncements.length - 1];
  const newestAnnouncement = sortedAnnouncements[0];
  const computedRangeStart = rangeStart ?? oldestAnnouncement?.publishedAt ?? new Date();
  const computedRangeEnd = rangeEnd ?? newestAnnouncement?.publishedAt ?? new Date();

  const timelineDays = useMemo(
    () => getDateRange(computedRangeStart, computedRangeEnd),
    [computedRangeStart, computedRangeEnd]
  );

  const [selectedDay, setSelectedDay] = useState<string>(() => toDateKey(computedRangeEnd));
  const [channelFilter, setChannelFilter] = useState<AnnouncementChannelFilter>("all");

  useEffect(() => {
    if (!timelineDays.includes(selectedDay) && timelineDays.length > 0) {
      setSelectedDay(timelineDays[timelineDays.length - 1]);
    }
  }, [timelineDays, selectedDay]);

  const groupedTimeline = useMemo(() => {
    const rangedAnnouncements = sortedAnnouncements.filter((item) =>
      isDateWithinRange(item.publishedAt, computedRangeStart, computedRangeEnd)
    );

    const filteredAnnouncements =
      channelFilter === "all"
        ? rangedAnnouncements
        : rangedAnnouncements.filter((item) => item.channel === channelFilter);

    return groupEventsByDate(filteredAnnouncements, (item) => item.publishedAt);
  }, [sortedAnnouncements, channelFilter, computedRangeStart, computedRangeEnd]);

  const visibleAnnouncements = groupedTimeline[selectedDay] ?? [];
  const queryPreview = buildQueryString({
    day: selectedDay,
    channel: channelFilter === "all" ? undefined : channelFilter,
    visible: visibleAnnouncements.length
  });

  return (
    <Card
      title="Feature Y: Announcement Timeline"
      actions={
        <Stack direction="row" gap="0.5rem" align="center">
          <Badge label={`${timelineDays.length} timeline days`} />
          <Badge label={`${visibleAnnouncements.length} announcements`} />
        </Stack>
      }
    >
      <SectionHeader
        title="Campus Announcement Timeline"
        subtitle="Navigate published updates by day and delivery channel."
      />

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {timelineChannelOptions.map((channel) => (
          <Button
            key={channel}
            label={toTitleCase(channel)}
            onClick={() => setChannelFilter(channel)}
            variant={channelFilter === channel ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <Stack direction="row" gap="0.5rem" wrap="wrap">
        {timelineDays.map((dateKey) => (
          <Button
            key={dateKey}
            label={`${formatDate(dateKey)} (${(groupedTimeline[dateKey] ?? []).length})`}
            onClick={() => {
              setSelectedDay(dateKey);
              onDateSelect?.(dateKey);
            }}
            variant={selectedDay === dateKey ? "primary" : "secondary"}
          />
        ))}
      </Stack>

      <div style={{ color: "#6b7280", fontSize: "0.85rem", marginTop: "0.75rem" }}>
        Query preview: {queryPreview || "(empty)"}
      </div>

      <ul style={{ margin: "0.85rem 0 0 0", paddingInlineStart: "1.25rem" }}>
        {visibleAnnouncements.map((announcement) => (
          <li key={announcement.id} style={{ marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "0.2rem" }}>
              <strong>{announcement.title}</strong>
              <Badge label={toTitleCase(announcement.channel)} />
            </div>
            <div>{announcement.body}</div>
            <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
              {announcement.audience ? `${announcement.audience} | ` : ""}
              {formatDate(announcement.publishedAt)}
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
