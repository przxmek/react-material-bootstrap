import Contact from "./contact";

export interface StageMeta {
  key: string;
  name: string;
  desc: string;
  subStages?: StageMeta[];
}

const STAGES: StageMeta[] = [
  // { key: "new_signup", name: "New signup", desc: "Signed up for the waitlist" },
  {
    key: "onboarding",
    name: "Onboarding",
    desc: "We wanna onboard you",
    subStages: [
      { key: "onboarding_ping_1", name: "Ping 1", desc: "We wanna onboard you (ping 1)" },
      { key: "onboarding_ping_2", name: "Ping 2", desc: "We wanna onboard you (ping 2)" },
      { key: "onboarding_ping_3", name: "Ping 3", desc: "We wanna onboard you (ping 3)" },
    ]
  },
  {
    key: "onboarding_survey_received",
    name: "Onboarding survey received",
    desc: "We received your survey"
  },
  {
    key: "scheduling_onboarding",
    name: "Scheduling onboarding",
    desc: "We wanna schedule an onboarding call",
    subStages: [
      { key: "scheduling_onboarding_ping_1", name: "Ping 1", desc: "We wanna schedule an onboarding call (ping 1)" },
      { key: "scheduling_onboarding_ping_2", name: "Ping 2", desc: "We wanna schedule an onboarding call (ping 2)" },
      { key: "scheduling_onboarding_ping_3", name: "Ping 3", desc: "We wanna schedule an onboarding call (ping 3)" },
    ]
  },
  {
    key: "onboarding_completed",
    name: "Onboarding completed",
    desc: "After call follow up"
  },
];

function unknown(key: string): StageMeta {
  return {
    key,
    name: key,
    desc: `Unknown stage ${key}`,
  };
}

export function getStages(): StageMeta[] {
  return STAGES;
}

export function getStagesFlat(): StageMeta[] {
  const stagesFlat = STAGES.flatMap(s => {
    return s.subStages ? [s, ...s.subStages] : [s];
  });

  return stagesFlat;
}

export function getStageMeta(key: string): StageMeta {
  const matching = getStagesFlat().filter(s => s.key === key);

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