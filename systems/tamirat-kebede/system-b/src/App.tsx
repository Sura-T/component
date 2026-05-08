import { useMemo, useState } from "react";
import {
  AnnouncementTimeline,
  NotificationDigestList,
  type AnnouncementItem,
  type NotificationDigestItem
} from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { getDateRange, groupEventsByDate } from "@monorepo/utils";

const portalAnnouncements: AnnouncementItem[] = [
  {
    id: "announcement-1",
    title: "Campus weekend orientation",
    body: "Orientation schedule updated for incoming students.",
    publishedAt: "2026-05-09T08:00:00.000Z",
    channel: "web",
    audience: "All Students"
  },
  {
    id: "announcement-2",
    title: "Library night extension",
    body: "Library closes at 10 PM during exam week.",
    publishedAt: "2026-05-10T07:30:00.000Z",
    channel: "email",
    audience: "Undergraduate"
  },
  {
    id: "announcement-3",
    title: "Lab maintenance notice",
    body: "Computer labs unavailable Saturday morning.",
    publishedAt: "2026-05-11T06:45:00.000Z",
    channel: "mobile",
    audience: "Engineering Department"
  }
];

const portalDigest: NotificationDigestItem[] = [
  {
    id: "portal-digest-1",
    recipient: "student-services",
    title: "New orientation broadcast",
    message: "Orientation notice published to all channels.",
    level: "info",
    channel: "in-app",
    createdAt: "2026-05-09T08:05:00.000Z",
    isRead: false
  },
  {
    id: "portal-digest-2",
    recipient: "security-office",
    title: "Maintenance schedule reminder",
    message: "Ensure alternative lab access during downtime.",
    level: "warning",
    channel: "email",
    createdAt: "2026-05-11T06:50:00.000Z",
    isRead: false
  }
];

export function CampusUpdatePortalApp() {
  const [selectedTimelineDay, setSelectedTimelineDay] = useState<string | null>(null);
  const [visibleDigestItems, setVisibleDigestItems] =
    useState<NotificationDigestItem[]>(portalDigest);

  const groupedAnnouncements = useMemo(
    () => groupEventsByDate(portalAnnouncements, (item) => item.publishedAt),
    []
  );
  const timelineDays = useMemo(() => {
    const first = portalAnnouncements[0]?.publishedAt ?? new Date();
    const last = portalAnnouncements[portalAnnouncements.length - 1]?.publishedAt ?? new Date();
    return getDateRange(first, last);
  }, []);

  return (
    <Stack gap="1rem">
      <Card
        title="System B: Campus Update Portal"
        actions={
          <Stack direction="row" gap="0.5rem" align="center">
            <Badge label={`${timelineDays.length} timeline days`} />
            <Badge label={`${visibleDigestItems.length} digest entries`} />
          </Stack>
        }
      >
        <SectionHeader
          title="Tamirat Kebede - Campus Communications"
          subtitle={
            selectedTimelineDay
              ? `Selected timeline day: ${selectedTimelineDay}`
              : "Pick a day in the timeline to focus updates."
          }
        />
      </Card>

      <AnnouncementTimeline
        announcements={portalAnnouncements}
        onDateSelect={(dateKey) => setSelectedTimelineDay(dateKey)}
      />

      <Card title="Announcement Grouping Preview">
        <ul style={{ margin: 0, paddingInlineStart: "1.25rem" }}>
          {Object.entries(groupedAnnouncements).map(([day, items]) => (
            <li key={day} style={{ marginBottom: "0.5rem" }}>
              {day}: {items.length} announcements
            </li>
          ))}
        </ul>
      </Card>

      <NotificationDigestList
        items={portalDigest}
        onVisibleItemsChange={setVisibleDigestItems}
      />
    </Stack>
  );
}

export default CampusUpdatePortalApp;
