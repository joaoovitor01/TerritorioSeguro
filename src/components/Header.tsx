import React, { useState, useEffect } from 'react';
import {
  Flame,
  Radio,
  RefreshCw,
  Sliders,
  Info,
  Bell,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Region } from '../types';
import { TerritorioSeguroLogo } from './TerritorioSeguroLogo';

interface HeaderProps {
  regions: Region[];
  activeView: 'map' | 'simulator';
  onViewChange: (view: 'map' | 'simulator') => void;
  onRefreshLiveData: () => void;
  isLoadingLive: boolean;
  onOpenAboutUs: () => void;
  lastSyncedText: string;
}

export const Header: React.FC<HeaderProps> = ({
  regions,
  activeView,
  onViewChange,
  onRefreshLiveData,
  isLoadingLive,
  onOpenAboutUs,
  lastSyncedText,
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZone: 'America/Sao_Paulo',
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const criticalCount = regions.filter((r) => r.risk.level === 'critico').length;
  const highCount = regions.filter((r) => r.risk.level === 'alto').length;
  const totalHotspots = regions.reduce((acc, r) => acc + r.hotspots.length, 0);

  return (
    <header className="w-full bg-slate-950 border-b border-slate-800/80 sticky top-0 z-40 px-4 py-3 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Mission Tag */}
        <div className="flex items-center gap-3">
          <TerritorioSeguroLogo size="md" />

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-500/20 text-red-300 border border-red-500/30">
                Eixo A • Alertas Locais
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Transformando dados ambientais em tempo para agir
            </p>
          </div>
        </div>

        {/* Global Telemetry Chips */}
        <div className="hidden lg:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">Brasília:</span>
            <strong className="text-white font-mono">{timeStr || '15:45:22'} BRT</strong>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-400">Alertas Ativos:</span>
            <strong className="text-red-400 font-mono">{criticalCount} Críticos</strong>
            <span className="text-slate-500">•</span>
            <strong className="text-amber-400 font-mono">{highCount} Altos</strong>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-400">Focos Orbitais:</span>
            <strong className="text-white font-mono">{totalHotspots}</strong>
          </div>
        </div>

        {/* Action Controls & Navigation Views */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Mode Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => onViewChange('map')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeView === 'map'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mapa & Alertas
            </button>
            <button
              onClick={() => onViewChange('simulator')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeView === 'simulator'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              Simulador
            </button>
          </div>

          {/* Sync Open-Meteo Live Data */}
          <button
            onClick={onRefreshLiveData}
            disabled={isLoadingLive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-cyan-300 hover:text-cyan-200 transition-all cursor-pointer disabled:opacity-50"
            title={`Última sincronização: ${lastSyncedText}`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLive ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Dados Reais Open-Meteo</span>
          </button>

          {/* About Us Modal Trigger */}
          <button
            onClick={onOpenAboutUs}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-amber-950/40 transition-all cursor-pointer"
            title="Conheça a plataforma Território Seguro e seus objetivos"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Sobre Nós</span>
          </button>
        </div>
      </div>
    </header>
  );
};
