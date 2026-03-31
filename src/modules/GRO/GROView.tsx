import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  AlertTriangle,
  ClipboardList,
  FileText,
  HardHat,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { seedGROData } from './groMockData.js';
import { loadActions, loadDocuments, loadEstablishments, loadInventory, loadSectors } from './groStorage.js';
import {
  ACTION_STATUS_LABEL,
  CLASSIFICATION_COLOR,
  CLASSIFICATION_LABEL,
  PRIORITY_COLOR,
  PRIORITY_LABEL,
  RISK_TYPE_COLOR,
  RISK_TYPE_LABEL,
  STATUS_COLOR,
  STATUS_LABEL,
  type GROActionItem,
  type GRODocument,
  type GROEstablishment,
  type GROSector,
  type RiskInventoryItem,
} from './types.js';

interface GROViewProps {
  tenant: { id: string; name: string };
  user: { name: string; role: string };
}

function SummaryCard({
  title,
  value,
  hint,
  icon,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-[28px] border border-zinc-200 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">{title}</p>
      <div className="text-3xl font-black text-zinc-900">{value}</div>
      <p className="text-sm text-zinc-500 mt-2">{hint}</p>
    </div>
  );
}

export function GROView({ tenant, user }: GROViewProps) {
  const [establishments, setEstablishments] = useState<GROEstablishment[]>([]);
  const [sectors, setSectors] = useState<GROSector[]>([]);
  const [inventory, setInventory] = useState<RiskInventoryItem[]>([]);
  const [actions, setActions] = useState<GROActionItem[]>([]);
  const [documents, setDocuments] = useState<GRODocument[]>([]);

  const loadData = () => {
    const currentInventory = loadInventory(tenant.id);
    if (tenant.id === 'toyota-br' && currentInventory.length === 0) {
      seedGROData(tenant.id);
    }

    setEstablishments(loadEstablishments(tenant.id));
    const currentSectors = loadSectors().filter((sector) =>
      loadEstablishments(tenant.id).some((establishment) => establishment.id === sector.establishmentId),
    );
    setSectors(currentSectors);
    setInventory(loadInventory(tenant.id));
    setActions(loadActions());
    setDocuments(loadDocuments(tenant.id));
  };

  useEffect(() => {
    loadData();
  }, [tenant.id]);

  const linkedActions = actions.filter((action) => inventory.some((risk) => risk.id === action.riskId));
  const psychosocialRisks = inventory.filter((risk) => risk.riskType === 'PSYCHOSOCIAL');
  const criticalRisks = inventory.filter(
    (risk) => risk.riskClassification === 'SUBSTANTIAL' || risk.riskClassification === 'INTOLERABLE',
  );
  const overdueActions = linkedActions.filter((action) => action.status === 'OVERDUE');

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-zinc-900">GRO / PGR</h1>
          <p className="text-zinc-500 font-medium">
            Inventario de riscos ocupacionais, plano de acao e documentos do programa de gerenciamento.
          </p>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-400 mt-2">
            {tenant.name} - responsavel atual {user.name}
          </p>
        </div>

        <button
          onClick={loadData}
          className="px-5 py-3 bg-white border border-zinc-200 rounded-2xl text-sm font-bold text-zinc-700 hover:bg-zinc-50 transition-colors flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Recarregar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5">
        <SummaryCard title="Riscos" value={inventory.length.toString()} hint={`${sectors.length} setores mapeados`} icon={<HardHat size={22} />} />
        <SummaryCard title="Psicossociais" value={psychosocialRisks.length.toString()} hint="itens integrados ao GRO" icon={<AlertTriangle size={22} />} />
        <SummaryCard title="Criticos" value={criticalRisks.length.toString()} hint="substancial ou intoleravel" icon={<ShieldCheck size={22} />} />
        <SummaryCard title="Acoes" value={linkedActions.length.toString()} hint={`${overdueActions.length} vencidas`} icon={<ClipboardList size={22} />} />
        <SummaryCard title="Documentos" value={documents.length.toString()} hint="inventario, plano e PGR" icon={<FileText size={22} />} />
      </div>

      {inventory.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded-[32px] p-10 shadow-sm">
          <h2 className="text-2xl font-black text-zinc-900 mb-2">Sem inventario carregado</h2>
          <p className="text-zinc-500 mb-6">
            Este contrato ainda nao tem dados GRO/PGR no prototipo. Para Toyota Brasil, o seed demo entra automaticamente.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.4fr)_360px] gap-8">
          <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-zinc-100">
              <h2 className="text-2xl font-black text-zinc-900">Inventario prioritario</h2>
              <p className="text-sm text-zinc-500">Riscos com maior nivel para tratamento e aprovacao.</p>
            </div>

            <div className="divide-y divide-zinc-100">
              {[...inventory]
                .sort((left, right) => right.riskLevel - left.riskLevel)
                .slice(0, 8)
                .map((risk) => (
                  <div key={risk.id} className="p-8">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${RISK_TYPE_COLOR[risk.riskType]}`}>
                        {RISK_TYPE_LABEL[risk.riskType]}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${CLASSIFICATION_COLOR[risk.riskClassification]}`}>
                        {CLASSIFICATION_LABEL[risk.riskClassification]}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${STATUS_COLOR[risk.status]}`}>
                        {STATUS_LABEL[risk.status]}
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-zinc-900 mb-2">{risk.hazardDescription}</h3>
                    <p className="text-sm text-zinc-500 mb-4">{risk.hazardSource}</p>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Setor</div>
                        <div className="text-sm font-black text-zinc-900">
                          {sectors.find((sector) => sector.id === risk.sectorId)?.name || risk.sectorId}
                        </div>
                      </div>
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Nivel</div>
                        <div className="text-sm font-black text-zinc-900">{risk.riskLevel}</div>
                      </div>
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Expostos</div>
                        <div className="text-sm font-black text-zinc-900">{risk.exposedWorkers}</div>
                      </div>
                      <div className="p-4 bg-zinc-50 rounded-2xl border border-zinc-200">
                        <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-zinc-400 mb-2">Versao</div>
                        <div className="text-sm font-black text-zinc-900">v{risk.version}</div>
                      </div>
                    </div>

                    <p className="text-sm text-zinc-600 mt-4">{risk.decision}</p>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
              <h2 className="text-xl font-black text-zinc-900 mb-6">Plano de acao</h2>
              <div className="space-y-4">
                {linkedActions.slice(0, 6).map((action) => (
                  <div key={action.id} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200">
                    <div className="flex items-center justify-between gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] ${PRIORITY_COLOR[action.priority]}`}>
                        {PRIORITY_LABEL[action.priority]}
                      </span>
                      <span className="text-xs font-bold text-zinc-400">{ACTION_STATUS_LABEL[action.status]}</span>
                    </div>
                    <div className="text-sm font-black text-zinc-900 mb-1">{action.action}</div>
                    <div className="text-xs text-zinc-500">{action.responsible}</div>
                    <div className="text-xs text-zinc-400 mt-2">Prazo {action.deadline}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
              <h2 className="text-xl font-black text-zinc-900 mb-6">Documentos</h2>
              <div className="space-y-4">
                {documents.map((document) => (
                  <div key={document.id} className="p-4 rounded-3xl bg-zinc-50 border border-zinc-200">
                    <div className="text-sm font-black text-zinc-900 mb-1">{document.name}</div>
                    <div className="text-xs text-zinc-500">v{document.version} - {document.generatedBy}</div>
                    <div className="text-xs text-zinc-400 mt-2">{document.generatedAt}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[34px] border border-zinc-200 shadow-sm p-8">
              <h2 className="text-xl font-black text-zinc-900 mb-4">Estabelecimentos</h2>
              <div className="space-y-3">
                {establishments.map((establishment) => (
                  <div key={establishment.id} className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200">
                    <div className="text-sm font-black text-zinc-900">{establishment.name}</div>
                    <div className="text-xs text-zinc-500">{establishment.address}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
