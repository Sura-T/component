import { useMemo, useState } from "react";
import { Badge, Button, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate, toTitleCase } from "@monorepo/utils";

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
