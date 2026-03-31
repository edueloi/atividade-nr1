import React, { useMemo, useState } from 'react';
import {
  Search,
  Download,
  Eye,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  Lock,
  X,
  ExternalLink,
  FolderOpen,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { mockEvidences } from '../Evidence/mockData.js';
import { Evidence } from '../Evidence/types.js';
import {
  downloadEvidenceCatalogPdf,
  previewEvidenceCatalogPdf,
  downloadEvidenceCsv,
  downloadEvidenceItemPdf,
  previewEvidenceItemPdf,
} from './clientPortalUtils.js';

interface ClientEvidenceViewProps {
  tenant: {
    name: string;
  };
}

export function ClientEvidenceView({ tenant }: ClientEvidenceViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(null);

  const evidences = useMemo(() => (
    mockEvidences.filter((evidence) => {
      const searchable = `${evidence.title} ${evidence.origin} ${evidence.sector} ${evidence.unit} ${evidence.tags.join(' ')}`.toLowerCase();
      return searchable.includes(searchTerm.toLowerCase());
    })
  ), [searchTerm]);

  const approvedCount = useMemo(
    () => mockEvidences.filter((item) => item.status === 'Vinculada' || item.status === 'Aprovada').length,
    [],
  );

  return (
    <div className="space-y-8 pb-8">
      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="rounded-[32px] border border-zinc-200 bg-white p-8 shadow-sm">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">
            <FolderOpen size={14} />
            Evidências homologadas
          </div>
          <h1 className="mt-4 text-4xl font-black tracking-tight text-zinc-900">Consulta visual do contrato</h1>
          <p className="mt-3 max-w-3xl text-sm font-medium leading-relaxed text-zinc-500">
            O cliente visualiza somente arquivos já homologados para o contrato {tenant.name}.
            Nesta área é possível abrir as evidências, baixar fichas em PDF e exportar o catálogo em PDF ou CSV.
          </p>
        </div>

        <div className="rounded-[32px] border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-600 p-3 text-white">
              <Lock size={22} />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-emerald-700">Modo protegido</p>
              <h2 className="text-xl font-black text-zinc-900">Sem upload ou exclusão</h2>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <StatusCard label="Arquivos visíveis" value={String(mockEvidences.length)} />
            <StatusCard label="Homologadas" value={String(approvedCount)} />
            <StatusCard label="Exportações" value="PDF / CSV" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          icon={<FileText size={20} />}
          title="Catálogo em PDF"
          description="Resumo formal com origem, setor e data das evidências liberadas."
          primaryLabel="Baixar PDF"
          secondaryLabel="Visualizar"
          onPrimary={() => downloadEvidenceCatalogPdf(tenant.name, mockEvidences)}
          onSecondary={() => previewEvidenceCatalogPdf(tenant.name, mockEvidences)}
        />
        <ActionCard
          icon={<FileSpreadsheet size={20} />}
          title="Planilha CSV"
          description="Exportação tabular para consulta externa e conferência do cliente."
          primaryLabel="Baixar CSV"
          secondaryLabel="Baixar"
          onPrimary={() => downloadEvidenceCsv(tenant.name, mockEvidences)}
          onSecondary={() => downloadEvidenceCsv(tenant.name, mockEvidences)}
        />
        <ActionCard
          icon={<ImageIcon size={20} />}
          title="Fichas individuais"
          description="Cada evidência pode ser aberta e exportada em PDF direto da galeria."
          primaryLabel="Abrir galeria"
          secondaryLabel="Consultar"
          onPrimary={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' })}
          onSecondary={() => window.scrollTo({ top: document.body.scrollHeight / 3, behavior: 'smooth' })}
        />
        <ActionCard
          icon={<Lock size={20} />}
          title="Privacidade"
          description="Somente imagens e metadados homologados aparecem para este perfil."
          primaryLabel="Somente leitura"
          secondaryLabel="Bloqueado"
          onPrimary={() => undefined}
          onSecondary={() => undefined}
          disabled
        />
      </section>

      <section className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">Galeria de evidências</h2>
            <p className="text-sm font-medium text-zinc-500">
              Consulte fotos, comprovantes e registros visuais liberados para o cliente.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Buscar por título, setor ou tag..."
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-12 pr-4 text-sm text-zinc-700 outline-none transition focus:border-zinc-300 focus:bg-white"
            />
          </div>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {evidences.map((evidence) => (
            <button
              key={evidence.id}
              onClick={() => setSelectedEvidence(evidence)}
              className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:border-zinc-300"
            >
              <div className="aspect-[4/3] overflow-hidden bg-zinc-100">
                <img
                  src={evidence.thumbUrl}
                  alt={evidence.title}
                  className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-3 p-5">
                <div className="flex items-center justify-between gap-4">
                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                    {evidence.origin}
                  </span>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                    {evidence.status}
                  </span>
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">{evidence.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">{evidence.unit} · {evidence.sector}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {evidence.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>

        {evidences.length === 0 && (
          <div className="mt-6 rounded-[28px] border border-dashed border-zinc-200 bg-zinc-50 px-6 py-10 text-center text-sm text-zinc-500">
            Nenhuma evidência encontrada para o filtro informado.
          </div>
        )}
      </section>

      <AnimatePresence>
        {selectedEvidence && (
          <EvidencePreviewModal
            tenantName={tenant.name}
            evidence={selectedEvidence}
            onClose={() => setSelectedEvidence(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryLabel: string;
  secondaryLabel: string;
  onPrimary: () => void;
  onSecondary: () => void;
  disabled?: boolean;
}

function ActionCard({
  icon,
  title,
  description,
  primaryLabel,
  secondaryLabel,
  onPrimary,
  onSecondary,
  disabled = false,
}: ActionCardProps) {
  return (
    <div className="rounded-[28px] border border-zinc-200 bg-white p-6 shadow-sm">
      <div className="inline-flex rounded-2xl bg-zinc-900 p-3 text-white">{icon}</div>
      <h3 className="mt-5 text-lg font-black text-zinc-900">{title}</h3>
      <p className="mt-2 min-h-[68px] text-sm leading-relaxed text-zinc-500">{description}</p>

      <div className="mt-5 flex gap-2">
        <button
          onClick={onPrimary}
          disabled={disabled}
          className={`flex-1 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
            disabled ? 'cursor-not-allowed bg-zinc-100 text-zinc-400' : 'bg-zinc-900 text-white hover:bg-zinc-800'
          }`}
        >
          {primaryLabel}
        </button>
        <button
          onClick={onSecondary}
          disabled={disabled}
          className={`rounded-2xl border px-4 py-3 text-xs font-black uppercase tracking-[0.18em] transition ${
            disabled
              ? 'cursor-not-allowed border-zinc-100 text-zinc-300'
              : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'
          }`}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

interface StatusCardProps {
  label: string;
  value: string;
}

function StatusCard({ label, value }: StatusCardProps) {
  return (
    <div className="rounded-2xl border border-white bg-white/80 px-4 py-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-zinc-900">{value}</p>
    </div>
  );
}

interface EvidencePreviewModalProps {
  tenantName: string;
  evidence: Evidence;
  onClose: () => void;
}

function EvidencePreviewModal({ tenantName, evidence, onClose }: EvidencePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[36px] border border-zinc-200 bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 bg-zinc-50 px-6 py-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Consulta do cliente</p>
            <h3 className="text-2xl font-black text-zinc-900">{evidence.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl border border-zinc-200 p-3 text-zinc-500 transition hover:bg-white hover:text-zinc-900"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid flex-1 gap-0 overflow-y-auto lg:grid-cols-[1.2fr_0.8fr]">
          <div className="bg-zinc-950">
            <img
              src={evidence.fileUrl}
              alt={evidence.title}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="space-y-6 p-6">
            <div className="space-y-3">
              <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700">
                {evidence.origin}
              </span>
              <p className="text-sm leading-relaxed text-zinc-600">
                {evidence.description || 'Sem descrição adicional para esta evidência.'}
              </p>
            </div>

            <div className="grid gap-3 rounded-[28px] border border-zinc-100 bg-zinc-50 p-5 text-sm text-zinc-600">
              <MetadataRow label="Contrato" value={tenantName} />
              <MetadataRow label="Unidade" value={evidence.unit} />
              <MetadataRow label="Setor" value={evidence.sector} />
              <MetadataRow label="Tipo" value={evidence.type} />
              <MetadataRow label="Registro" value={evidence.date} />
              <MetadataRow label="Upload" value={evidence.uploadDate} />
              <MetadataRow label="Responsável" value={evidence.createdBy} />
            </div>

            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tags</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {evidence.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-500">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <button
                onClick={() => previewEvidenceItemPdf(tenantName, evidence)}
                className="rounded-2xl bg-zinc-900 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-zinc-800"
              >
                <span className="inline-flex items-center gap-2">
                  <Eye size={14} />
                  Visualizar ficha PDF
                </span>
              </button>
              <button
                onClick={() => downloadEvidenceItemPdf(tenantName, evidence)}
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-600 transition hover:bg-zinc-50"
              >
                <span className="inline-flex items-center gap-2">
                  <Download size={14} />
                  Baixar ficha PDF
                </span>
              </button>
              <button
                onClick={() => window.open(evidence.fileUrl, '_blank', 'noopener,noreferrer')}
                className="rounded-2xl border border-zinc-200 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-zinc-600 transition hover:bg-zinc-50"
              >
                <span className="inline-flex items-center gap-2">
                  <ExternalLink size={14} />
                  Abrir arquivo original
                </span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface MetadataRowProps {
  label: string;
  value: string;
}

function MetadataRow({ label, value }: MetadataRowProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</span>
      <span className="text-right font-semibold text-zinc-700">{value}</span>
    </div>
  );
}
