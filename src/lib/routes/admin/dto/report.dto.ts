export interface ReportDto {
  reason: ReportReason;
  details: string
  reportedProfileId: number;
}

export enum ReportReason {
   INAPPROPRIATE_CONTENT,
   FAKE_PROFILE,
   HARASSMENT,
   SPAM,
   UNDERAGE,
   OTHER,
}
