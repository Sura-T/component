import { useState } from "react";
import { TaskCreationWizard, type TaskCreationWizardValues } from "@monorepo/feature-x";
import { UserProfileStatusPanel } from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate } from "@monorepo/utils";

export function StaffOnboardingApp() {
  const [draftCount, setDraftCount] = useState(0);
  const [latestTaskOwner, setLatestTaskOwner] = useState<string | null>(null);

  function handleCreateTask(values: TaskCreationWizardValues) {
    setDraftCount((current) => current + 1);
    setLatestTaskOwner(values.ownerEmail);
  }

  return (
    <Stack gap="1rem">
      <Card
        title="System A: Staff Onboarding Workflow"
        actions={<Badge label={`${draftCount} intake tasks`} />}
      >
        <SectionHeader
          title="Abdi Esayas - Onboarding Assembly"
          subtitle={
            latestTaskOwner
              ? `Latest owner: ${latestTaskOwner}`
              : `Session started ${formatDate(new Date())}`
          }
        />
      </Card>

      <TaskCreationWizard onSubmit={handleCreateTask} />
      <UserProfileStatusPanel />
    </Stack>
  );
}

export default StaffOnboardingApp;
