export interface HateoasLink {
  href: string;
  method?: string;
}

export interface HateoasLinks {
  self: HateoasLink;
  first?: HateoasLink;
  prev?: HateoasLink;
  next?: HateoasLink;
  last?: HateoasLink;
}

export interface ReportResponseDto {
  id: number;
  reportedProfileId: number;
  reporterId: string;
  reason: string;
  details?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  _links: HateoasLinks;
}

export interface ReportsListResponseDto {
  reports: ReportResponseDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  _links: {
    self: HateoasLink;
    first?: HateoasLink;
    prev?: HateoasLink;
    next?: HateoasLink;
    last?: HateoasLink;
  };
}

export interface ReportsQueryParams {
  page?: number;
  limit?: number;
  profileId?: number;
  reporterId?: string;
  status?: string;
}

export interface TopOffender {
  profileId: number;
  reportCount: number;
  latestReportDate: Date;
}
