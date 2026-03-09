export type ReportType = 'EXECUTIVE' | 'TECHNICAL' | 'AUDIT' | 'CSV' | 'ZIP';
export type ReportStatus = 'PROCESSING' | 'COMPLETED' | 'FAILED';
export type ReportFormat = 'PDF' | 'CSV' | 'ZIP' | 'XLSX';

export interface ReportJob {
  id: string;
  name: string;
  type: ReportType;
  format: ReportFormat;
  status: ReportStatus;
  progress: number;
  created_at: string;
  completed_at?: string;
  file_url?: string;
  error_msg?: string;
  params: {
    month: string;
    unitId: string;
    sectorId?: string;
    modules: string[];
    privacy: {
      aggregatedOnly: boolean;
      hideSensitiveAttachments: boolean;
      minResponsesNR1?: number;
      hideOpenTextNR1: boolean;
    };
  };
  generated_by: string;
}

export interface ReportTemplate {
  id: string;
  name: string;
  type: ReportType;
  modules: string[];
  privacy: {
    aggregatedOnly: boolean;
    hideSensitiveAttachments: boolean;
    minResponsesNR1?: number;
    hideOpenTextNR1: boolean;
  };
  isDefault?: boolean;
  alwaysAllUnits?: boolean;
}

export interface ShareLink {
  id: string;
  token: string;
  report_id: string;
  report_name: string;
  report_type: ReportType;
  expires_at: string;
  views_count: number;
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  has_password?: boolean;
}
