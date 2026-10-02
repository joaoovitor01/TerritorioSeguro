import React, { useState } from 'react';
import { Region, ThreatLevel, EventType } from '../types';
import { getThreatLevelColor } from '../services/riskEngine';
import {
  Flame,
  Sun,
  CloudRain,
  ShieldAlert,
  Users,
  Compass,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  AlertTriangle,
  Send,
  Building2,
  Clock,
  Radio,
  FileText,
  ChevronRight,
  Info,
} from 'lucide-react';

interface RegionDetailPanelProps {
  region: Region;
  onOpenBroadcast: (region: Region) => void;
  onClose?: () => void;
  theme?: 'dark' | 'light';
}

export const RegionDetailPanel: React.FC<RegionDetailPanelProps> = ({
  region,
  onOpenBroadcast,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';
  const [viewMode, setViewMode] = useState<'citizen' | 'operational'>('citizen');
  const [activeTab, setActiveTab] = useState<'risco' | 'impacto' | 'fatores' | 'satelite'>('risco');

  const threatColor = getThreatLevelColor(region.risk.level);
  const alert = region.activeAlert;

  const threatIcon = (threat: EventType) => {
    switch (threat) {
      case 'incendio':
        return <Flame className="w-4 h-4 text-amber-400" />;
      case 'calor':
        return <Sun className="w-4 h-4 text-orange-400" />;
      case 'chuva':
        return <CloudRain className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-2xl shadow-2xl overflow-hidden transition-colors border ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Banner / Region Header */}
      <div className={`p-4 border-b ${threatColor.border} ${threatColor.bg} transition-colors`}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-white tracking-tight">{region.name}</span>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold bg-slate-800/80 text-slate-300 border border-slate-700">
                {region.state}
              </span>
              <span className="text-xs text-slate-400 font-medium">{region.biome}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Antecedência: <strong className="text-white">{region.leadTimeHours}h</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                População: <strong className="text-white">{region.population.toLocaleString('pt-BR')}</strong>
              </span>
            </div>
          </div>

          {/* Threat Badge */}
          <div className="flex flex-col items-end">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-md flex items-center gap-1.5 ${threatColor.badge}`}
            >
              <span className={`w-2 h-2 rounded-full ${threatColor.dotColor} animate-pulse`} />
              Risco {region.risk.level}
            </span>
            <span className="text-[11px] font-mono text-slate-400 mt-1">Score: {region.risk.overallRisk}/100</span>
          </div>
        </div>

        {/* Live Weather & Climate Snapshot (Intuitive and Visible) */}
        <div className={`mt-3.5 p-3 rounded-xl border space-y-2.5 ${
          isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-white/90 border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className={`text-2xl font-black font-mono tracking-tight ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                {region.weather.temperature.toFixed(1)}°C
              </span>
              <div>
                <span className={`text-xs font-bold block ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {region.weather.conditionText || 'Clima Atual'}
                </span>
                <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Sensação Térmica: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{region.weather.heatIndex?.toFixed(1) || region.weather.temperature.toFixed(1)}°C</strong>
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className={`px-2 py-0.5 rounded text-[10px] font-mono border font-bold inline-block ${
                isDark ? 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80' : 'bg-cyan-50 text-cyan-800 border-cyan-200'
              }`}>
                {region.weather.updatedAt}
              </span>
            </div>
          </div>

          {/* Quick 4-Metrics Grid */}
          <div className="grid grid-cols-4 gap-1.5 text-center text-xs">
            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
              <span className={`text-[9px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>UMIDADE</span>
              <strong className={`text-xs ${region.weather.humidity < 25 ? 'text-red-500' : isDark ? 'text-cyan-300' : 'text-cyan-700'}`}>
                {region.weather.humidity}%
              </strong>
            </div>
            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
              <span className={`text-[9px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CHUVA 24H</span>
              <strong className={`text-xs ${isDark ? 'text-blue-300' : 'text-blue-600'}`}>
                {region.weather.precipitation} mm
              </strong>
            </div>
            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
              <span className={`text-[9px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>PREVISÃO</span>
              <strong className={`text-xs ${isDark ? 'text-indigo-300' : 'text-indigo-600'}`}>
                {region.weather.precipitationForecast} mm
              </strong>
            </div>
            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-900 border-slate-800/80' : 'bg-slate-100 border-slate-200'}`}>
              <span className={`text-[9px] block font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>VENTO</span>
              <strong className={`text-xs ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                {region.weather.windSpeed.toFixed(0)} km/h
              </strong>
            </div>
          </div>
        </div>

        {/* 3 Pillars Score Strip */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div
            className={`p-2.5 rounded-xl border transition-all ${
              region.risk.dominantThreat === 'calor'
                ? 'bg-orange-950/40 border-orange-500/50 shadow-md shadow-orange-900/20 ring-1 ring-orange-500/30'
                : 'bg-slate-950/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">☀️ Calor</span>
              <span className="font-mono font-bold text-orange-400">{region.risk.heatRisk}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-full transition-all duration-500"
                style={{ width: `${region.risk.heatRisk}%` }}
              />
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border transition-all ${
              region.risk.dominantThreat === 'chuva'
                ? 'bg-cyan-950/40 border-cyan-500/50 shadow-md shadow-cyan-900/20 ring-1 ring-cyan-500/30'
                : 'bg-slate-950/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">🌧️ Chuva</span>
              <span className="font-mono font-bold text-cyan-400">{region.risk.rainRisk}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-blue-400 to-cyan-500 h-full transition-all duration-500"
                style={{ width: `${region.risk.rainRisk}%` }}
              />
            </div>
          </div>

          <div
            className={`p-2.5 rounded-xl border transition-all ${
              region.risk.dominantThreat === 'incendio'
                ? 'bg-red-950/40 border-red-500/50 shadow-md shadow-red-900/20 ring-1 ring-red-500/30'
                : 'bg-slate-950/50 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="flex items-center gap-1">🔥 Incêndio</span>
              <span className="font-mono font-bold text-red-400">{region.risk.fireRisk}</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-amber-400 to-red-500 h-full transition-all duration-500"
                style={{ width: `${region.risk.fireRisk}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('risco')}
          className={`py-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'risco'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Alerta Ativo
        </button>
        <button
          onClick={() => setActiveTab('fatores')}
          className={`py-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'fatores'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Fatores Climáticos
        </button>
        <button
          onClick={() => setActiveTab('impacto')}
          className={`py-2.5 px-3 border-b-2 transition-all ${
            activeTab === 'impacto'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Impacto & População
        </button>
        <button
          onClick={() => setActiveTab('satelite')}
          className={`py-2.5 px-3 border-b-2 transition-all flex items-center gap-1 ${
            activeTab === 'satelite'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Focos Satélite
          {region.hotspots.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-red-500/20 text-red-400 border border-red-500/30">
              {region.hotspots.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* TAB 1: ALERTA ATIVO */}
        {activeTab === 'risco' && alert && (
          <div className="space-y-4">
            {/* Audience View Switcher */}
            <div className="flex items-center justify-between p-1 bg-slate-950 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('citizen')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'citizen'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                Visão Cidadão / População
              </button>
              <button
                onClick={() => setViewMode('operational')}
                className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'operational'
                    ? 'bg-slate-700 text-white font-bold shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Defesa Civil & Operações
              </button>
            </div>

            {/* Alert Header Box */}
            <div className={`p-4 rounded-xl border ${threatColor.border} bg-slate-950/70 space-y-2`}>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                  {threatIcon(region.risk.dominantThreat)}
                  {alert.title}
                </span>
                <span className="text-[11px] font-mono text-slate-400">{alert.createdAt} BRT</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">{alert.headline}</p>
              <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-950/40 p-2 rounded-lg border border-amber-500/30">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{alert.leadTimeNotice}</span>
              </div>
            </div>

            {/* Citizen View Mode */}
            {viewMode === 'citizen' ? (
              <div className="space-y-4">
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-amber-400" />
                    O que está acontecendo na sua região
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.citizenMessage.overview}</p>

                  <div className="mt-3 space-y-1.5 border-t border-slate-800/80 pt-2.5">
                    {alert.citizenMessage.keyPoints.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-emerald-400" />
                    Recomendações Práticas de Segurança
                  </h4>
                  <div className="space-y-2">
                    {alert.citizenMessage.recommendations.map((rec, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs text-slate-200 leading-relaxed flex items-start gap-2"
                      >
                        <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Operational / Civil Defense View Mode */
              <div className="space-y-4">
                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                      <Radio className="w-4 h-4 text-red-400" />
                      Diagnóstico Técnico Operacional
                    </h4>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800">
                      Prioridade: {alert.operationalMessage.priorityRating}/100
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.operationalMessage.technicalSummary}</p>
                  <div className="mt-2.5 p-2 bg-slate-900 rounded font-mono text-[11px] text-cyan-300 border border-slate-800">
                    {alert.operationalMessage.meteorologicalState}
                  </div>
                  {alert.operationalMessage.firePowerMW !== undefined && alert.operationalMessage.firePowerMW > 0 && (
                    <div className="mt-2 text-xs text-amber-300 flex items-center justify-between bg-amber-950/30 p-2 rounded border border-amber-900/50">
                      <span>Potência Radiativa Total do Fogo (FRP):</span>
                      <strong className="font-mono">{alert.operationalMessage.firePowerMW.toFixed(1)} MW</strong>
                    </div>
                  )}
                </div>

                <div className="bg-slate-950/50 p-3.5 rounded-xl border border-slate-800/80">
                  <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-amber-400" />
                    Protocolo de Despacho & Ações Imediatas
                  </h4>
                  <div className="space-y-2">
                    {alert.operationalMessage.responseChecklist.map((action, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                      >
                        <input
                          type="checkbox"
                          id={`op-chk-${idx}`}
                          className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950"
                        />
                        <label htmlFor={`op-chk-${idx}`} className="cursor-pointer">
                          {action}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Broadcast Action Button */}
            <button
              onClick={() => onOpenBroadcast(region)}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-red-600 to-amber-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-950/50 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Simular Disparo de Alerta (SMS / Sirene / População)
            </button>
          </div>
        )}

        {/* TAB 2: FATORES CLIMÁTICOS */}
        {activeTab === 'fatores' && (
          <div className="space-y-4">
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                <Thermometer className="w-4 h-4 text-amber-400" />
                Telemetria Atmosférica Atual
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Temperatura</div>
                  <div className="text-base font-bold text-white mt-0.5">{region.weather.temperature.toFixed(1)}°C</div>
                  <div className="text-[10px] text-slate-500">Sensação: {region.weather.heatIndex?.toFixed(1)}°C</div>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Umidade Relativa</div>
                  <div
                    className={`text-base font-bold mt-0.5 ${
                      region.weather.humidity <= 25 ? 'text-red-400' : 'text-slate-200'
                    }`}
                  >
                    {region.weather.humidity}%
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {region.weather.humidity <= 20 ? 'Alerta Crítico' : 'Condição Monitorada'}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Vento de Superfície</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {region.weather.windSpeed.toFixed(0)} km/h
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-cyan-400" />
                    Direção: {region.weather.windDirection}
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/90 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Estiagem / Chuva</div>
                  <div className="text-base font-bold text-white mt-0.5">
                    {region.weather.daysWithoutRain} dias s/ chuva
                  </div>
                  <div className="text-[10px] text-slate-500">Previsão 24h: {region.weather.precipitationForecast} mm</div>
                </div>
              </div>
            </div>

            {/* Factor breakdown according to dominant threat */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Pesos do Motor de Risco ({region.risk.dominantThreat.toUpperCase()})
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Normalização 0-100</span>
              </div>

              <div className="space-y-2">
                {(
                  region.risk.dominantThreat === 'calor'
                    ? region.risk.factors.heat
                    : region.risk.dominantThreat === 'chuva'
                    ? region.risk.factors.rain
                    : region.risk.factors.fire
                ).map((factor, i) => (
                  <div key={i} className="p-2 rounded bg-slate-900 border border-slate-800/80 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">{factor.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400">{factor.value}</span>
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[10px] ${
                            factor.status === 'danger'
                              ? 'bg-red-950 text-red-400 border border-red-800'
                              : factor.status === 'warning'
                              ? 'bg-amber-950 text-amber-400 border border-amber-800'
                              : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          }`}
                        >
                          {factor.weight}%
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-slate-950 h-1 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className={`h-full ${
                          factor.status === 'danger'
                            ? 'bg-red-500'
                            : factor.status === 'warning'
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${factor.weight}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: IMPACTO & POPULAÇÃO */}
        {activeTab === 'impacto' && (
          <div className="space-y-4">
            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                  Índice de Consequência e Impacto
                </span>
                <span className="text-base font-bold font-mono text-amber-400">{region.impact.score}/100</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">População Sob Alerta</span>
                  <div className="text-sm font-bold text-white mt-0.5">
                    {region.impact.estimatedPopulationAffected.toLocaleString('pt-BR')} pessoas
                  </div>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[11px]">Grupos Vulneráveis</span>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {region.impact.vulnerableGroupsCount.toLocaleString('pt-BR')} (idosos/crianças)
                  </div>
                </div>
              </div>

              <div className="text-xs space-y-2 border-t border-slate-800 pt-3 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Proximidade com Bacias Fluviais:</span>
                  <strong className="capitalize text-white">{region.impact.proximityToRivers}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Área Residencial / Rural:</span>
                  <strong className="capitalize text-white">
                    {region.impact.proximityToResidences} ({region.impact.ruralAreaRatio}% rural)
                  </strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Prioridade Integrada de Resposta:</span>
                  <strong className="font-mono text-red-400 text-sm">
                    {region.impact.priorityScore}/100
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-cyan-400" />
                Infraestruturas Críticas Mapeadas
              </h4>
              <div className="space-y-1.5">
                {region.impact.criticalInfrastructure.map((infra, idx) => (
                  <div
                    key={idx}
                    className="p-2 rounded bg-slate-900 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <span>{infra}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: FOCOS SATÉLITE */}
        {activeTab === 'satelite' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>NASA FIRMS & INPE Queimadas</span>
              <span className="text-amber-400 font-semibold">{region.hotspots.length} anomalias térmicas</span>
            </div>

            {region.hotspots.length === 0 ? (
              <div className="p-6 text-center rounded-xl bg-slate-950/40 border border-slate-800 text-slate-400 text-xs">
                Nenhum foco de calor ativo ou anomalia térmica detectada nesta área nas últimas 24 horas.
              </div>
            ) : (
              <div className="space-y-2.5">
                {region.hotspots.map((hs) => (
                  <div key={hs.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                        <span className="font-bold text-white">{hs.source}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-300 font-mono border border-red-800">
                        FRP: {hs.frp} MW
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                      <div>
                        Sensor: <strong className="text-slate-200">{hs.satellite}</strong>
                      </div>
                      <div>
                        Confiança: <strong className="text-slate-200">{hs.confidence}%</strong>
                      </div>
                      <div>
                        Horário: <strong className="text-slate-200">{hs.timestamp}</strong>
                      </div>
                      <div>
                        Coordenadas: <strong className="font-mono text-slate-300">{hs.latitude.toFixed(3)}, {hs.longitude.toFixed(3)}</strong>
                      </div>
                    </div>

                    <div className="p-1.5 rounded bg-slate-900 text-[10px] text-amber-300/80 italic">
                      ⚠️ Anomalia térmica registrada por sensor orbital. Requer validação em campo pelas brigadas.
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
