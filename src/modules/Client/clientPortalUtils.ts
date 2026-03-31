import { Evidence } from '../Evidence/types.js';

export interface DashboardStatsData {
  participation: number;
  complaints_momentary: number;
  complaints_ambulatory: number;
  complaints_recurrent: number;
  complaints_resolved: number;
  absenteismo: number;
  rehabilitated: number;
}

export interface ComplaintBodyPartData {
  body_part: string;
  value: number;
}

export interface AttendanceSummaryData {
  participationByMonth: Array<{ month: string; rate: number }>;
  rankingBelowGoal: Array<{ sector: string; rate: number }>;
}

export interface AbsenteeismSummaryData {
  totalDaysLost: number;
  totalRecords: number;
  over15Rate: number;
  criticalSector: string;
  topCIDs: Array<{ group: string; count: number }>;
  weeklyImpact: Array<{ week: string; days: number }>;
  cidDistribution: Array<{ name: string; value: number }>;
  sectorRanking: Array<{ sector: string; days: number }>;
}

export interface AdmissionSummaryData {
  totalEvaluations: number;
  recommendedRate: number;
  restrictedRate: number;
  notRecommendedRate: number;
  topCriticalRoles: Array<{ role: string; count: number }>;
  resultDistribution: Array<{ name: string; value: number }>;
}

export interface ClientPortalSnapshot {
  tenantName: string;
  generatedAt: string;
  dashboard: DashboardStatsData;
  complaints: ComplaintBodyPartData[];
  attendance: AttendanceSummaryData;
  absenteeism: AbsenteeismSummaryData;
  admission: AdmissionSummaryData;
}

interface PdfSection {
  title: string;
  lines: string[];
}

interface PdfLine {
  text: string;
  fontSize: number;
  gapAfter: number;
}

const EMPTY_DASHBOARD: DashboardStatsData = {
  participation: 0,
  complaints_momentary: 0,
  complaints_ambulatory: 0,
  complaints_recurrent: 0,
  complaints_resolved: 0,
  absenteismo: 0,
  rehabilitated: 0,
};

const EMPTY_ATTENDANCE: AttendanceSummaryData = {
  participationByMonth: [],
  rankingBelowGoal: [],
};

const EMPTY_ABSENTEEISM: AbsenteeismSummaryData = {
  totalDaysLost: 0,
  totalRecords: 0,
  over15Rate: 0,
  criticalSector: 'Sem destaque',
  topCIDs: [],
  weeklyImpact: [],
  cidDistribution: [],
  sectorRanking: [],
};

const EMPTY_ADMISSION: AdmissionSummaryData = {
  totalEvaluations: 0,
  recommendedRate: 0,
  restrictedRate: 0,
  notRecommendedRate: 0,
  topCriticalRoles: [],
  resultDistribution: [],
};

function normalizeSnapshot(snapshot: Partial<ClientPortalSnapshot> & { tenantName: string }): ClientPortalSnapshot {
  return {
    tenantName: snapshot.tenantName,
    generatedAt: snapshot.generatedAt || new Date().toLocaleString('pt-BR'),
    dashboard: snapshot.dashboard || EMPTY_DASHBOARD,
    complaints: snapshot.complaints || [],
    attendance: snapshot.attendance || EMPTY_ATTENDANCE,
    absenteeism: snapshot.absenteeism || EMPTY_ABSENTEEISM,
    admission: snapshot.admission || EMPTY_ADMISSION,
  };
}

function sanitizeFileName(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9-_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

function escapeCsvValue(value: string | number) {
  const stringValue = String(value ?? '');
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function downloadBlob(filename: string, blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 30000);
}

function openBlob(blob: Blob) {
  const url = window.URL.createObjectURL(blob);
  const opened = window.open(url, '_blank', 'noopener,noreferrer');

  if (!opened) {
    downloadBlob('documento.pdf', blob);
  }

  window.setTimeout(() => window.URL.revokeObjectURL(url), 60000);
}

function wrapText(text: string, maxChars = 86) {
  if (!text.trim()) {
    return [''];
  }

  const words = text.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const candidate = currentLine ? `${currentLine} ${word}` : word;
    if (candidate.length <= maxChars) {
      currentLine = candidate;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
    }

    if (word.length <= maxChars) {
      currentLine = word;
      continue;
    }

    const chunks = word.match(new RegExp(`.{1,${maxChars}}`, 'g')) || [word];
    lines.push(...chunks.slice(0, -1));
    currentLine = chunks[chunks.length - 1];
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

function encodePdfHex(text: string) {
  let hex = '';

  for (let index = 0; index < text.length; index += 1) {
    let code = text.charCodeAt(index);
    if (code === 0x2013) code = 150;
    else if (code === 0x2014) code = 151;
    else if (code === 0x2018) code = 145;
    else if (code === 0x2019) code = 146;
    else if (code === 0x201C) code = 147;
    else if (code === 0x201D) code = 148;
    else if (code === 0x2022) code = 149;
    else if (code > 255) code = 63;
    
    hex += code.toString(16).padStart(2, '0').toUpperCase();
  }

  return `<${hex}>`;
}

function buildPdfBlob(title: string, subtitle: string, sections: PdfSection[]) {
  const lines: PdfLine[] = [
    { text: title, fontSize: 18, gapAfter: 18 },
    { text: subtitle, fontSize: 11, gapAfter: 20 },
  ];

  sections.forEach((section) => {
    lines.push({ text: section.title, fontSize: 13, gapAfter: 10 });
    section.lines.forEach((line) => {
      wrapText(line, 88).forEach((wrappedLine) => {
        lines.push({ text: wrappedLine, fontSize: 11, gapAfter: 6 });
      });
    });
    lines.push({ text: '', fontSize: 11, gapAfter: 6 });
  });

  const pages: PdfLine[][] = [];
  let currentPage: PdfLine[] = [];
  let currentY = 792;

  lines.forEach((line) => {
    const estimatedHeight = line.fontSize + line.gapAfter;
    if (currentY - estimatedHeight < 60 && currentPage.length > 0) {
      pages.push(currentPage);
      currentPage = [];
      currentY = 792;
    }

    currentPage.push(line);
    currentY -= estimatedHeight;
  });

  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  const objects: string[] = [];
  const pageObjectIds: number[] = [];
  const contentObjectIds: number[] = [];
  const fontObjectId = 3 + pages.length * 2;

  objects.push('1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj');

  pages.forEach((_, pageIndex) => {
    pageObjectIds.push(3 + pageIndex * 2);
    contentObjectIds.push(4 + pageIndex * 2);
  });

  const kids = pageObjectIds.map((pageId) => `${pageId} 0 R`).join(' ');
  objects.push(`2 0 obj << /Type /Pages /Count ${pages.length} /Kids [${kids}] >> endobj`);

  pages.forEach((pageLines, pageIndex) => {
    const pageObjectId = pageObjectIds[pageIndex];
    const contentObjectId = contentObjectIds[pageIndex];
    let y = 792;
    const commands = ['BT'];

    pageLines.forEach((line) => {
      if (line.text) {
        commands.push(`/F1 ${line.fontSize} Tf`);
        commands.push(`1 0 0 1 50 ${y} Tm`);
        commands.push(`${encodePdfHex(line.text)} Tj`);
      }
      y -= line.fontSize + line.gapAfter;
    });

    commands.push('ET');
    const stream = commands.join('\n');

    objects.push(
      `${pageObjectId} 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 ${fontObjectId} 0 R >> >> /Contents ${contentObjectId} 0 R >> endobj`
    );
    objects.push(`${contentObjectId} 0 obj << /Length ${stream.length} >> stream\n${stream}\nendstream endobj`);
  });

  objects.push(`${fontObjectId} 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >> endobj`);

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  for (let index = 1; index < offsets.length; index += 1) {
    pdf += `${String(offsets[index]).padStart(10, '0')} 00000 n \n`;
  }

  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;

  return new Blob([pdf], { type: 'application/pdf' });
}

function buildCsvBlob(rows: Array<Array<string | number>>) {
  const content = rows.map((row) => row.map(escapeCsvValue).join(';')).join('\r\n');
  return new Blob([`\uFEFF${content}`], { type: 'text/csv;charset=utf-8;' });
}

function buildExecutiveSections(snapshot: ClientPortalSnapshot): PdfSection[] {
  const complaintLines = snapshot.complaints.length > 0
    ? snapshot.complaints.map((item) => `${item.body_part}: ${item.value} registros`)
    : ['Sem distribuição de queixas no período selecionado.'];

  const attendanceLines = snapshot.attendance.participationByMonth.length > 0
    ? snapshot.attendance.participationByMonth.map((item) => `${item.month}: ${item.rate}% de participação`)
    : ['Sem histórico mensal de participação.'];

  return [
    {
      title: 'Resumo executivo',
      lines: [
        `Participação média consolidada: ${snapshot.dashboard.participation}%.`,
        `Queixas momentâneas: ${snapshot.dashboard.complaints_momentary}.`,
        `Queixas ambulatoriais: ${snapshot.dashboard.complaints_ambulatory}.`,
        `Casos recorrentes monitorados: ${snapshot.dashboard.complaints_recurrent}.`,
        `Taxa de reabilitação acompanhada: ${snapshot.dashboard.rehabilitated}%.`,
      ],
    },
    {
      title: 'Indicadores operacionais',
      lines: [
        `Dias perdidos por absenteísmo: ${snapshot.absenteeism.totalDaysLost}.`,
        `Registros totais de afastamento: ${snapshot.absenteeism.totalRecords}.`,
        `Participação de afastamentos acima de 15 dias: ${snapshot.absenteeism.over15Rate}%.`,
        `Setor crítico do período: ${snapshot.absenteeism.criticalSector}.`,
      ],
    },
    {
      title: 'Distribuição de queixas',
      lines: complaintLines,
    },
    {
      title: 'Histórico mensal de participação',
      lines: attendanceLines,
    },
    {
      title: 'Privacidade do portal',
      lines: [
        'Este documento contém somente dados agregados do contrato.',
        'Respostas individuais, campos abertos do NR-1 e anexos sensíveis permanecem ocultos no portal do cliente.',
      ],
    },
  ];
}

function buildHealthSections(snapshot: ClientPortalSnapshot): PdfSection[] {
  const cidLines = snapshot.absenteeism.topCIDs.length > 0
    ? snapshot.absenteeism.topCIDs.map((item) => `Grupo ${item.group}: ${item.count} ocorrências`)
    : ['Sem grupos de CID com destaque no período.'];

  const roleLines = snapshot.admission.topCriticalRoles.length > 0
    ? snapshot.admission.topCriticalRoles.map((item) => `${item.role}: ${item.count} casos críticos`)
    : ['Sem funções críticas registradas no período.'];

  const sectorLines = snapshot.absenteeism.sectorRanking.length > 0
    ? snapshot.absenteeism.sectorRanking.map((item) => `${item.sector}: ${item.days} dias perdidos`)
    : ['Sem ranking setorial disponível.'];

  return [
    {
      title: 'Panorama de saúde ocupacional',
      lines: [
        `Participação consolidada: ${snapshot.dashboard.participation}%.`,
        `Queixas resolvidas: ${snapshot.dashboard.complaints_resolved}.`,
        `Absenteísmo médio informado no dashboard: ${snapshot.dashboard.absenteismo}%.`,
        `Avaliações admissionais concluídas: ${snapshot.admission.totalEvaluations}.`,
      ],
    },
    {
      title: 'Absenteísmo e CID',
      lines: cidLines,
    },
    {
      title: 'Setores com maior impacto',
      lines: sectorLines,
    },
    {
      title: 'Funções críticas nas admissões',
      lines: roleLines,
    },
    {
      title: 'Leitura recomendada',
      lines: [
        'Manter o acompanhamento do setor crítico com maior volume de afastamentos.',
        'Reforçar intervenções ergonômicas nas regiões corporais com maior incidência de queixas.',
        'Preservar o compartilhamento somente em nível consolidado para o cliente final.',
      ],
    },
  ];
}

function buildEvidenceSections(tenantName: string, evidences: Evidence[]): PdfSection[] {
  const totalByOrigin = evidences.reduce<Record<string, number>>((accumulator, evidence) => {
    accumulator[evidence.origin] = (accumulator[evidence.origin] || 0) + 1;
    return accumulator;
  }, {});

  const originLines = Object.entries(totalByOrigin).length > 0
    ? Object.entries(totalByOrigin).map(([origin, total]) => `${origin}: ${total} evidência(s)`)
    : ['Nenhuma evidência homologada disponível.'];

  const evidenceLines = evidences.length > 0
    ? evidences.map((evidence) => `${evidence.title} | ${evidence.origin} | ${evidence.unit} / ${evidence.sector} | ${evidence.date}`)
    : ['Nenhuma evidência disponível para exportação.'];

  return [
    {
      title: 'Resumo do catálogo',
      lines: [
        `Contrato: ${tenantName}.`,
        `Total de evidências disponíveis: ${evidences.length}.`,
        `Exportação preparada em modo somente leitura para consulta do cliente.`,
      ],
    },
    {
      title: 'Distribuição por origem',
      lines: originLines,
    },
    {
      title: 'Itens disponíveis',
      lines: evidenceLines,
    },
  ];
}

function buildEvidenceItemSections(tenantName: string, evidence: Evidence): PdfSection[] {
  return [
    {
      title: 'Identificação',
      lines: [
        `Contrato: ${tenantName}.`,
        `Título: ${evidence.title}.`,
        `Origem: ${evidence.origin}.`,
        `Tipo: ${evidence.type}.`,
        `Status: ${evidence.status}.`,
      ],
    },
    {
      title: 'Localização',
      lines: [
        `Unidade: ${evidence.unit}.`,
        `Setor: ${evidence.sector}.`,
        `Data do registro: ${evidence.date}.`,
        `Data do upload: ${evidence.uploadDate}.`,
        `Responsável pelo envio: ${evidence.createdBy}.`,
      ],
    },
    {
      title: 'Descrição e tags',
      lines: [
        evidence.description || 'Sem descrição adicional.',
        `Tags: ${evidence.tags.join(', ') || 'Sem tags cadastradas.'}`,
      ],
    },
    {
      title: 'Vínculos',
      lines: evidence.links.length > 0
        ? evidence.links.map((link) => `${link.refType} | ${link.refName} | ${link.createdAt}`)
        : ['Nenhum vínculo operacional informado para esta evidência.'],
    },
  ];
}

export function downloadExecutiveReport(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  const blob = buildPdfBlob(
    `Portal do Cliente · ${snapshot.tenantName}`,
    `Relatório executivo em modo leitura | Gerado em ${snapshot.generatedAt}`,
    buildExecutiveSections(snapshot),
  );

  downloadBlob(
    `${sanitizeFileName(snapshot.tenantName)}-relatorio-executivo.pdf`,
    blob,
  );
}

export function previewExecutiveReport(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  openBlob(
    buildPdfBlob(
      `Portal do Cliente · ${snapshot.tenantName}`,
      `Relatório executivo em modo leitura | Gerado em ${snapshot.generatedAt}`,
      buildExecutiveSections(snapshot),
    ),
  );
}

export function downloadHealthReport(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  const blob = buildPdfBlob(
    `Saúde Ocupacional · ${snapshot.tenantName}`,
    `Consolidação de saúde e absenteísmo | Gerado em ${snapshot.generatedAt}`,
    buildHealthSections(snapshot),
  );

  downloadBlob(
    `${sanitizeFileName(snapshot.tenantName)}-saude-ocupacional.pdf`,
    blob,
  );
}

export function previewHealthReport(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  openBlob(
    buildPdfBlob(
      `Saúde Ocupacional · ${snapshot.tenantName}`,
      `Consolidação de saúde e absenteísmo | Gerado em ${snapshot.generatedAt}`,
      buildHealthSections(snapshot),
    ),
  );
}

export function downloadIndicatorsCsv(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  const rows: Array<Array<string | number>> = [
    ['Contrato', snapshot.tenantName],
    ['Gerado em', snapshot.generatedAt],
    [],
    ['Indicador', 'Valor'],
    ['Participação média', snapshot.dashboard.participation],
    ['Queixas momentâneas', snapshot.dashboard.complaints_momentary],
    ['Queixas ambulatoriais', snapshot.dashboard.complaints_ambulatory],
    ['Queixas recorrentes', snapshot.dashboard.complaints_recurrent],
    ['Queixas resolvidas', snapshot.dashboard.complaints_resolved],
    ['Absenteísmo dashboard', snapshot.dashboard.absenteismo],
    ['Reabilitação', snapshot.dashboard.rehabilitated],
    ['Dias perdidos', snapshot.absenteeism.totalDaysLost],
    ['Registros de afastamento', snapshot.absenteeism.totalRecords],
    ['Afastamentos >15 dias (%)', snapshot.absenteeism.over15Rate],
    [],
    ['Participação por mês', 'Taxa'],
    ...snapshot.attendance.participationByMonth.map((item) => [item.month, item.rate]),
    [],
    ['Queixas por região corporal', 'Quantidade'],
    ...snapshot.complaints.map((item) => [item.body_part, item.value]),
  ];

  downloadBlob(
    `${sanitizeFileName(snapshot.tenantName)}-indicadores.csv`,
    buildCsvBlob(rows),
  );
}

export function downloadAbsenteeismCsv(snapshotInput: Partial<ClientPortalSnapshot> & { tenantName: string }) {
  const snapshot = normalizeSnapshot(snapshotInput);
  const rows: Array<Array<string | number>> = [
    ['Contrato', snapshot.tenantName],
    ['Gerado em', snapshot.generatedAt],
    [],
    ['Semana', 'Dias perdidos'],
    ...snapshot.absenteeism.weeklyImpact.map((item) => [item.week, item.days]),
    [],
    ['Setor', 'Dias perdidos'],
    ...snapshot.absenteeism.sectorRanking.map((item) => [item.sector, item.days]),
    [],
    ['Grupo CID', 'Ocorrências'],
    ...snapshot.absenteeism.topCIDs.map((item) => [item.group, item.count]),
  ];

  downloadBlob(
    `${sanitizeFileName(snapshot.tenantName)}-absenteismo.csv`,
    buildCsvBlob(rows),
  );
}

export function downloadEvidenceCatalogPdf(tenantName: string, evidences: Evidence[]) {
  const blob = buildPdfBlob(
    `Catálogo de Evidências · ${tenantName}`,
    `Exportação homologada em modo leitura | Gerado em ${new Date().toLocaleString('pt-BR')}`,
    buildEvidenceSections(tenantName, evidences),
  );

  downloadBlob(
    `${sanitizeFileName(tenantName)}-catalogo-evidencias.pdf`,
    blob,
  );
}

export function previewEvidenceCatalogPdf(tenantName: string, evidences: Evidence[]) {
  openBlob(
    buildPdfBlob(
      `Catálogo de Evidências · ${tenantName}`,
      `Exportação homologada em modo leitura | Gerado em ${new Date().toLocaleString('pt-BR')}`,
      buildEvidenceSections(tenantName, evidences),
    ),
  );
}

export function downloadEvidenceCsv(tenantName: string, evidences: Evidence[]) {
  const rows: Array<Array<string | number>> = [
    ['Contrato', tenantName],
    ['Gerado em', new Date().toLocaleString('pt-BR')],
    [],
    ['Título', 'Origem', 'Tipo', 'Status', 'Unidade', 'Setor', 'Data', 'Responsável', 'Tags'],
    ...evidences.map((evidence) => [
      evidence.title,
      evidence.origin,
      evidence.type,
      evidence.status,
      evidence.unit,
      evidence.sector,
      evidence.date,
      evidence.createdBy,
      evidence.tags.join(', '),
    ]),
  ];

  downloadBlob(
    `${sanitizeFileName(tenantName)}-evidencias.csv`,
    buildCsvBlob(rows),
  );
}

export function downloadEvidenceItemPdf(tenantName: string, evidence: Evidence) {
  const blob = buildPdfBlob(
    `Ficha da Evidência · ${tenantName}`,
    `Documento de consulta do cliente | Gerado em ${new Date().toLocaleString('pt-BR')}`,
    buildEvidenceItemSections(tenantName, evidence),
  );

  downloadBlob(
    `${sanitizeFileName(tenantName)}-${sanitizeFileName(evidence.title)}.pdf`,
    blob,
  );
}

export function previewEvidenceItemPdf(tenantName: string, evidence: Evidence) {
  openBlob(
    buildPdfBlob(
      `Ficha da Evidência · ${tenantName}`,
      `Documento de consulta do cliente | Gerado em ${new Date().toLocaleString('pt-BR')}`,
      buildEvidenceItemSections(tenantName, evidence),
    ),
  );
}
