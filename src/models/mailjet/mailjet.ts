import Contact from "./contact";

export interface StageMeta {
  key: string;
  name: string;
  desc: string;
}

export const stages: StageMeta[] = [
  { key: "new_signup", name: "New signup", desc: "Signed up for the waitlist" },
  { key: "onboarding", name: "Onboarding", desc: "We wanna onboard you" },
  { key: "onboarding_survey_received", name: "Onboarding survey received", desc: "We received your survey" },
  { key: "scheduling_onboarding", name: "Scheduling onboarding", desc: "We wanna schedule an onboarding call" },
  { key: "onboarding_completed", name: "Onboarding completed", desc: "After call follow up" },
];

function unknown(key: string): StageMeta {
  return {
    key,
    name: key,
    desc: `Unknown stage ${key}`,
  };
}

export function getStageMeta(key: string): StageMeta {
  const matching = stages.filter(s => s.key === key);

  if (matching.length === 0) {
    return unknown(key);
  }

  return matching[0];
}


export function getContactStage(contact: Contact): StageMeta | undefined {
  const matching = contact ? contact.Properties.filter(p => p.Name === 'stage') : [];

  if (matching.length === 0) {
    return undefined;
  }

  return getStageMeta(matching[0].Value);
}