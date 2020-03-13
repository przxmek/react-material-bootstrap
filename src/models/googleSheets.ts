export interface WaitlistSpreadsheet {
  "Team signups": Spreadsheet;
  "Onboarding survey": Spreadsheet;
  "Onboarding call": Spreadsheet;
  "NPS score": Spreadsheet;
  "Uninstall form": Spreadsheet;
}

export type Spreadsheet = string[][];

export interface StarterPack {
  name: string;
  snippets: StarterPackSnippet[];
}

export interface StarterPackSnippet {
  trigger: string;
  text: string;
}