import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { TaskCreationWizard } from "@monorepo/feature-x";
import { UserProfileStatusPanel } from "@monorepo/feature-y";
import { Badge, Card, SectionHeader, Stack } from "@monorepo/ui-components";
import { formatDate } from "@monorepo/utils";
export function StaffOnboardingApp() {
    const [draftCount, setDraftCount] = useState(0);
    const [latestTaskOwner, setLatestTaskOwner] = useState(null);
    function handleCreateTask(values) {
        setDraftCount((current) => current + 1);
        setLatestTaskOwner(values.ownerEmail);
    }
    return (_jsxs(Stack, { gap: "1rem", children: [_jsx(Card, { title: "System A: Staff Onboarding Workflow", actions: _jsx(Badge, { label: `${draftCount} intake tasks` }), children: _jsx(SectionHeader, { title: "Abdi Esayas - Onboarding Assembly", subtitle: latestTaskOwner
                        ? `Latest owner: ${latestTaskOwner}`
                        : `Session started ${formatDate(new Date())}` }) }), _jsx(TaskCreationWizard, { onSubmit: handleCreateTask }), _jsx(UserProfileStatusPanel, {})] }));
}
export default StaffOnboardingApp;
