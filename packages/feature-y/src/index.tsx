import { Badge, Card } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  occurredAt: string;
  level: "info" | "warning";
}

function formatLevel(level: ActivityItem["level"]): string {
  return level === "warning" ? "Warning" : "Info";
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
