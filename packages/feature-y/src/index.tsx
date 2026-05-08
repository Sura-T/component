import { useMemo, useState } from "react";
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
  composeValidators,
  email,
  formatDate,
  required,
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
