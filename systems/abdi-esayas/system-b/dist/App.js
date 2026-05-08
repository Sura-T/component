import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TaskCreationWizard } from "@monorepo/feature-x";
import { UserProfileStatusPanel } from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { toTitleCase } from "@monorepo/utils";
export function SupportTicketIntakeApp() {
    const [submittedTickets, setSubmittedTickets] = useState(0);
    const [latestReporter, setLatestReporter] = useState("Not provided");
    const [agentStatus, setAgentStatus] = useState("active");
    function handleTicketSubmit(values) {
        setSubmittedTickets((current) => current + 1);
        setLatestReporter(values.ownerEmail);
    }
    function handleProfileSave(values) {
        setAgentStatus(values.status);
    }
    return (_jsxs(Stack, { gap: "1rem", children: [_jsx(Card, { title: "System B: Support Ticket Intake Module", actions: _jsx(Badge, { label: `${submittedTickets} submitted` }), children: _jsx(SectionHeader, { title: "Abdi Esayas - Support Intake Assembly", subtitle: `Reporter: ${latestReporter} | Agent status: ${toTitleCase(agentStatus)}` }) }), _jsx(TaskCreationWizard, { onSubmit: handleTicketSubmit }), _jsx(UserProfileStatusPanel, { onSave: handleProfileSave })] }));
}
export default SupportTicketIntakeApp;
