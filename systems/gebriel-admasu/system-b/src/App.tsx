import { useMemo, useState } from "react";
import {
  ActivityFeedWithSeverity,
  NotificationDigestList,
  unreadDigestCount,
  type ActivityItem,
  type NotificationDigestItem
} from "@monorepo/feature-y";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { appendQueryParams, formatDate } from "@monorepo/utils";

const initialDigest: NotificationDigestItem[] = [
  {
    id: "digest-1",
    recipient: "lab-admin@school.edu",
    title: "Server storage threshold",
    message: "Storage usage exceeded 85% on shared monitor.",
    level: "warning",
    channel: "email",
    createdAt: "2026-05-08T07:40:00.000Z",
    isRead: false
  },
  {
    id: "digest-2",
    recipient: "operations-group",
    title: "Daily backup complete",
    message: "Backup finished successfully for all resources.",
    level: "info",
    channel: "in-app",
    createdAt: "2026-05-08T06:10:00.000Z",
    isRead: true
  }
];

const initialActivities: ActivityItem[] = [
  {
    id: "resource-activity-1",
    actor: "monitor daemon",
    action: "Auto-scaled read replica for class analytics workload.",
    occurredAt: "2026-05-08T07:55:00.000Z",
    level: "info"
  },
  {
    id: "resource-activity-2",
    actor: "monitor daemon",
    action: "Detected CPU spike on reporting node.",
    occurredAt: "2026-05-08T07:30:00.000Z",
    level: "warning"
  }
];

export function ResourceMonitorApp() {
  const [digestItems, setDigestItems] = useState<NotificationDigestItem[]>(initialDigest);
  const [visibleDigestItems, setVisibleDigestItems] =
    useState<NotificationDigestItem[]>(initialDigest);
  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  const unreadCount = useMemo(
    () => unreadDigestCount(visibleDigestItems),
    [visibleDigestItems]
  );

  const endpointPreview = useMemo(
    () =>
      appendQueryParams("/api/resource-monitor/digest", {
        unreadOnly: unreadCount > 0,
        visible: visibleDigestItems.length
      }),
    [unreadCount, visibleDigestItems.length]
  );

  function simulateRefresh() {
    const createdAt = new Date().toISOString();
    setDigestItems((currentItems) => [
      {
        id: `digest-${currentItems.length + 1}`,
        recipient: "resource-team",
        title: "Periodic resource heartbeat",
        message: "Refreshed health metrics from monitoring agent.",
        level: "info",
        channel: "in-app",
        createdAt,
        isRead: false
      },
      ...currentItems
    ]);

    setActivities((currentActivities) => [
      {
        id: `resource-activity-${currentActivities.length + 1}`,
        actor: "resource monitor",
        action: "Triggered manual refresh for digest list.",
        occurredAt: createdAt,
        level: "info"
      },
      ...currentActivities
    ]);
  }

  return (
    <Stack gap="1rem">
      <Card
        title="System B: Resource Monitor"
        actions={
          <Stack direction="row" gap="0.5rem" align="center">
            <Badge label={`${unreadCount} unread`} />
            <Badge label={`${visibleDigestItems.length} visible`} />
          </Stack>
        }
      >
        <SectionHeader
          title="Gebriel Admasu - Resource Monitoring Center"
          subtitle={`Generated on ${formatDate(new Date())}`}
          action={<Button label="Refresh feed" onClick={simulateRefresh} />}
        />

        <div style={{ color: "#6b7280", fontSize: "0.85rem" }}>
          API preview: {endpointPreview}
        </div>
      </Card>

      <NotificationDigestList
        items={digestItems}
        onVisibleItemsChange={setVisibleDigestItems}
      />
      <ActivityFeedWithSeverity items={activities} />
    </Stack>
  );
}

export default ResourceMonitorApp;
