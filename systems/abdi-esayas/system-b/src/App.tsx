import { useState } from "react";
import { TaskCreationWizard, type TaskCreationWizardValues } from "@monorepo/feature-x";
import {
  UserProfileStatusPanel,
  type UserProfileStatusValues
} from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { toTitleCase } from "@monorepo/utils";

export function SupportTicketIntakeApp() {
  const [submittedTickets, setSubmittedTickets] = useState(0);
  const [latestReporter, setLatestReporter] = useState<string>("Not provided");
  const [agentStatus, setAgentStatus] = useState<UserProfileStatusValues["status"]>("active");

  function handleTicketSubmit(values: TaskCreationWizardValues) {
    setSubmittedTickets((current) => current + 1);
    setLatestReporter(values.ownerEmail);
  }

  function handleProfileSave(values: UserProfileStatusValues) {
    setAgentStatus(values.status);
  }

  return (
    <Stack gap="1rem">
      <Card
        title="System B: Support Ticket Intake Module"
        actions={<Badge label={`${submittedTickets} submitted`} />}
      >
        <SectionHeader
          title="Abdi Esayas - Support Intake Assembly"
          subtitle={`Reporter: ${latestReporter} | Agent status: ${toTitleCase(agentStatus)}`}
        />
      </Card>

      <TaskCreationWizard onSubmit={handleTicketSubmit} />
      <UserProfileStatusPanel onSave={handleProfileSave} />
    </Stack>
  );
}

export default SupportTicketIntakeApp;
