import React, { useState } from 'react';
import { Region, ThreatLevel } from '../types';
import { getThreatLevelColor } from '../services/riskEngine';
import {
  X,
  Send,
  Smartphone,
  Radio,
  Bell,
  CheckCircle2,
  Users,
  AlertTriangle,
  Clock,
  Volume2,
} from 'lucide-react';

interface BroadcastModalProps {
  region: Region;
  onClose: () => void;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({ region, onClose }) => {
  const [channel, setChannel] = useState<'sms' | 'push' | 'siren' | 'whatsapp'>('sms');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const alert = region.activeAlert;
  const threatColor = getThreatLevelColor(region.risk.level);

  const handleSend = () => {
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      setSentSuccess(true);
    }, 1200);
  };

  const getChannelPreviewText = () => {
    if (!alert) return '';
    if (channel === 'sms') {
      return `[DEFESA CIVIL ALERTA] ${alert.title.toUpperCase()} em ${region.name} (${region.state}). ${
        alert.headline
      } ${alert.citizenMessage.recommendations[0]} Informações: 199.`;
    }
    if (channel === 'whatsapp') {
      return `🚨 *TERRITÓRIO SEGURO — ALERTA OFICIAL*\n\n📍 *Região:* ${region.name} - ${region.state}\n⚠️ *Nível:* ${region.risk.level.toUpperCase()}\n\n${
        alert.citizenMessage.overview
      }\n\n*Recomendações:* \n${alert.citizenMessage.recommendations.map((r) => `• ${r}`).join('\n')}\n\n⏰ *Antecedência:* ${region.leadTimeHours}h antes do ápice de risco.`;
    }
    if (channel === 'push') {
      return `🔔 Território Seguro Alerta: Risco ${region.risk.level.toUpperCase()} em ${region.name}. Toque para ver rotas seguras e hidratação.`;
    }
    return `🔊 [SIRENE COMUNITÁRIA ATIVADA]: Sinais sonoros emitidos nos distritos de ${region.name}. Equipes de resposta a caminho.`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Central de Disparo de Alerta Multicanal
              </h3>
              <p className="text-[11px] text-slate-400">
                Emitir aviso emergencial geolocalizado para {region.name} ({region.state})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Target Summary Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Destinatários estimados:</span>
              <strong className="text-white font-mono">
                {region.impact.estimatedPopulationAffected.toLocaleString('pt-BR')} cidadãos
              </strong>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-slate-400">Antecedência de Proteção:</span>
              <strong className="text-amber-400 font-mono">{region.leadTimeHours} horas</strong>
            </div>
          </div>

          {/* Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Canal de Transmissão</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setChannel('sms');
                  setSentSuccess(false);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'sms'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                SMS Defesa Civil (40199)
              </button>

              <button
                onClick={() => {
                  setChannel('whatsapp');
                  setSentSuccess(false);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'whatsapp'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>💬 WhatsApp Bot</span>
              </button>

              <button
                onClick={() => {
                  setChannel('push');
                  setSentSuccess(false);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'push'
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                Push App Cidadão
              </button>

              <button
                onClick={() => {
                  setChannel('siren');
                  setSentSuccess(false);
                }}
                className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  channel === 'siren'
                    ? 'bg-red-500/20 text-red-300 border-red-500'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5" />
                Sirene Sonora
              </button>
            </div>
          </div>

          {/* Device Mockup Preview */}
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">
              Pré-visualização no Aparelho do Morador
            </span>
            <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-xs text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
              {getChannelPreviewText()}
            </div>
          </div>

          {/* Action Status */}
          {sentSuccess ? (
            <div className="p-3.5 bg-emerald-950/40 border border-emerald-500/60 rounded-xl flex items-center gap-3 text-emerald-300 text-xs animate-in zoom-in-95">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong>Alerta Transmitido com Sucesso!</strong>
                <p className="text-[11px] text-emerald-400/80 mt-0.5">
                  Pacote georreferenciado entregue às operadoras para disparo nas antenas ERB de {region.name}.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSend}
                disabled={isSending}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSending ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando via ERBs...
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    Disparar Alerta Imediato
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
