export default interface Contact {
  CreatedAt: string;
  DeliveredCount: number;
  Email: string;
  ExclusionFromCampaignsUpdatedAt: string;
  ID: number;
  IsExcludedFromCampaigns: boolean;
  IsOptInPending: boolean;
  IsSpamComplaining: boolean;
  LastActivityAt: string;
  LastUpdateAt: string;
  Name: string;
  UnsubscribedAt: string;
  UnsubscribedBy: string;
}