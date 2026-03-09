export type ClosingStatus = 'OPEN' | 'REVIEW' | 'CLOSED' | 'REOPENED';
export type IssueSeverity = 'CRITICAL' | 'IMPORTANT' | 'INFO';
export type IssueStatus = 'OPEN' | 'DONE' | 'IGNORED';

export interface ClosingMonth {
  id: string;
  tenant_id: string;
  month: string; // YYYY-MM
  status: ClosingStatus;
  closed_by?: string;
  closed_at?: string;
  reopen_reason?: string;
  created_at: string;
}

export interface ClosingIssue {
  id: string;
  month_id: string;
  module: string;
  severity: IssueSeverity;
  ref_type: string;
  ref_id: string;
  message: string;
  suggestion: string;
  status: IssueStatus;
  resolved_by?: string;
  resolved_at?: string;
}

export interface ClosingRule {
  id: string;
  tenant_id: string;
  code: string;
  label: string;
  description: string;
  severity: IssueSeverity;
  is_enabled: boolean;
}

export interface ClosingSummary {
  totalIssues: number;
  criticalIssues: number;
  importantIssues: number;
  modulesOk: number;
  reportsGenerated: number;
  evidencesCount: number;
  progressByModule: {
    module: string;
    total: number;
    done: number;
    status: 'OK' | 'PENDING' | 'CRITICAL';
  }[];
}
