export type EvidenceType = 'Antes' | 'Depois' | 'Comprovante' | 'Campanha' | 'Auditoria';
export type EvidenceStatus = 'Rascunho' | 'Vinculada' | 'Aprovada' | 'Rejeitada';
export type EvidenceOrigin = 'NR1' | 'Ergonomia' | 'Eng' | 'Plano de Ação' | 'Aula' | 'Fisio' | 'Absenteísmo' | 'Campanhas';

export interface EvidenceLink {
  id: string;
  refType: 'ACTION_ITEM' | 'PLAN' | 'SECTOR' | 'PROJECT' | 'CLASS_SESSION' | 'FISIO_CASE' | 'NR1_CYCLE';
  refId: string;
  refName: string;
  note?: string;
  createdAt: string;
}

export interface Evidence {
  id: string;
  title: string;
  description?: string;
  unit: string;
  sector: string;
  origin: EvidenceOrigin;
  type: EvidenceType;
  status: EvidenceStatus;
  tags: string[];
  fileUrl: string;
  thumbUrl: string;
  date: string; // Data do registro
  uploadDate: string;
  createdBy: string;
  links: EvidenceLink[];
}

export interface BatchUpload {
  id: string;
  date: string;
  unit: string;
  sector: string;
  origin: EvidenceOrigin;
  type: EvidenceType;
  tags: string[];
  filesCount: number;
  status: 'Processando' | 'Concluído' | 'Erro';
}

export interface ExportJob {
  id: string;
  name: string;
  type: 'ZIP' | 'PDF' | 'CSV';
  date: string;
  status: 'Concluído' | 'Processando' | 'Erro';
  size: string;
  params: any;
}
