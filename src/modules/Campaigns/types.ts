export type CampaignStatus = 'COMPLETED' | 'ACTIVE' | 'UPCOMING' | 'CANCELED';

export interface CampaignMaterial {
  id: string;
  name: string;
  type: 'POSTER' | 'VIDEO' | 'PRESENTATION' | 'OTHER';
  url: string;
  uploaded_at: string;
}

export interface CampaignAction {
  id: string;
  name: string;
  date: string;
  type: 'LECTURE' | 'WORKSHOP' | 'SCREENING' | 'OTHER';
  participants_count: number;
  status: 'PLANNED' | 'DONE';
  evidence_url?: string;
}

export interface Campaign {
  id: string;
  month: string;
  theme: string;
  color: string;
  status: CampaignStatus;
  description: string;
  materials: CampaignMaterial[];
  actions: CampaignAction[];
  start_date: string;
  end_date: string;
  budget?: number;
  responsible?: string;
}
