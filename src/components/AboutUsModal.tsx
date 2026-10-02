import React from 'react';
import {
  X,
  Info,
  Target,
  Shield,
  Sun,
  CloudRain,
  Flame,
  Clock,
  HeartHandshake,
  Users,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { TerritorioSeguroLogo } from './TerritorioSeguroLogo';

interface AboutUsModalProps {
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <TerritorioSeguroLogo size="sm" />
            <div className="border-l border-slate-800 pl-3">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                Sobre Nós — Plataforma Território Seguro
              </h3>
              <p className="text-xs text-slate-400">
                Monitoramento Inteligente e Alerta Antecipado de Eventos Climáticos Extremos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-200 text-xs md:text-sm leading-relaxed">
          {/* Hero Statement */}
          <div className="p-5 md:p-6 rounded-2xl bg-gradient-to-br from-amber-950/40 via-red-950/25 to-slate-950 border border-amber-500/30 text-center space-y-3">
            <span className="px-3 py-1 rounded-full text-[11px] uppercase tracking-widest text-amber-400 font-bold bg-amber-500/10 border border-amber-500/30 inline-block">
              Nossa Missão & Propósito
            </span>
            <h2 className="text-lg md:text-2xl font-black text-white tracking-tight leading-snug">
              “Um evento extremo não começa quando o problema aparece. Antes dele, existem sinais.”
            </h2>
            <p className="text-amber-200/90 font-medium text-sm md:text-base italic">
              Território Seguro — Transformando dados ambientais em tempo para agir.
            </p>
          </div>

          {/* Quem Somos */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-amber-400" /> Quem Somos e Visão Geral
            </h4>
            <p className="text-slate-300 leading-relaxed">
              O <strong>Território Seguro</strong> é uma plataforma de monitoramento contínuo e alerta antecipado criada para
              transformar dados meteorológicos, ambientais e orbitais de satélites em informações simples, transparentes e
              acionáveis.
            </p>
            <p className="text-slate-300 leading-relaxed">
              Em vez de sobrecarregar cidadãos e equipes de resposta com planilhas e gráficos impenetráveis, o Território Seguro
              constrói uma ponte direta entre a ciência de dados geoespacial e a proteção da vida humana:
            </p>

            <div className="flex flex-wrap items-center justify-between gap-1 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] font-mono text-center">
              <span className="text-cyan-300 font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800">
                Dados Ambientais
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-slate-300 px-2 py-1 bg-slate-950 rounded border border-slate-800">
                Tratamento & Cruzamento
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-amber-300 font-semibold px-2 py-1 bg-slate-950 rounded border border-slate-800">
                Cálculo de Risco
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-purple-300 px-2 py-1 bg-slate-950 rounded border border-slate-800">
                Análise de Impacto
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="text-red-300 font-bold px-2 py-1 bg-red-950 rounded border border-red-800">
                Alerta à População
              </span>
            </div>
          </div>

          {/* Os 3 Eixos de Atuação */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-amber-400" /> Nossos 3 Grandes Pilares de Monitoramento
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-sm">
                  <Sun className="w-5 h-5 text-orange-400" />
                  <span>☀️ Calor Extremo</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Monitoramento de estresse térmico, sensação sob o sol e umidade crítica, prevenindo desidratação, insolação
                  e colapsos em idosos, crianças e trabalhadores ao ar livre.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                  <CloudRain className="w-5 h-5 text-cyan-400" />
                  <span>🌧️ Chuvas e Enchentes</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Cruzamento de precipitação prevista e acumulada com saturação do solo e relevo de calhas de rios,
                  antecipando riscos de transbordamento e deslizamento.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <Flame className="w-5 h-5 text-red-400" />
                  <span>🔥 Focos de Calor e Fogo</span>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed">
                  Contextualização de anomalias térmicas orbitais (NASA FIRMS / INPE) cruzadas com estiagem, ventos fortes
                  e vegetação seca para antecipar propagação de queimadas.
                </p>
              </div>
            </div>
          </div>

          {/* O Objetivo do Projeto */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-emerald-400" /> Objetivos do Projeto
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Objetivo Geral:</strong> Desenvolver uma infraestrutura inteligente e intuitiva capaz de
                  identificar regiões sob risco iminente de desastres climáticos, estimar seu impacto potencial e entregar
                  alertas geolocalizados antes que o desastre se consume.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Ganho de Antecedência (Lead Time):</strong> Proporcionar uma janela preventiva real (de 3 a 6
                  horas antes do pico do evento), garantindo tempo para reforço de aceiros, preparação de unidades de saúde e
                  evacuação preventiva de áreas ribeirinhas.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Diferenciação Ética e Metodológica:</strong> Tratar focos térmicos de satélite como anomalias que
                  necessitam de verificação técnica, combatendo o pânico desnecessário e orientando a resposta das brigadas.
                </span>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Comunicação Bidirecional:</strong> Entregar uma versão clara para o cidadão comum (foco em
                  cuidados de vida) e uma versão técnica para a Defesa Civil (telemetria, FRP em MW e checklist de despacho).
                </span>
              </div>
            </div>
          </div>

          {/* Nosso Diferencial */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h5 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" /> Antecipação vs. Reação Tardia
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                A maioria das plataformas convencionais apenas notifica quando a chuva já inundou ou o fogo já tomou conta.
                O Território Seguro avalia a evolução da curva atmosférica para agir antes do dano.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h5 className="font-bold text-white text-xs uppercase flex items-center gap-1.5">
                <Users className="w-4 h-4 text-cyan-400" /> Risco Físico vs. Impacto Humano
              </h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Distinguimos uma área de alto risco com pouca habitação de uma região de risco moderado cercada por escolas,
                hospitais e comunidades vulneráveis, priorizando o socorro onde as vidas estão em perigo.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-mono">
            Território Seguro • Sistema Inteligente de Proteção Climática
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:bg-amber-400 transition-colors cursor-pointer"
          >
            Entendido, Explorar Plataforma
          </button>
        </div>
      </div>
    </div>
  );
};
