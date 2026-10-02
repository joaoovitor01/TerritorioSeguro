import React, { useState } from 'react';
import { Region, RegionHourlyForecast } from '../types';
import { TrendingUp, AlertTriangle, Clock, ArrowUpRight, Flame, Sun, CloudRain } from 'lucide-react';

interface RiskEvolutionChartProps {
  region: Region;
  theme?: 'dark' | 'light';
}

function generateFallbackHourlyTrends(
  baseTemp = 28,
  baseHum = 50,
  baseRain = 0,
  baseFire = 20,
  baseHeat = 20,
  baseRainRisk = 10
): RegionHourlyForecast[] {
  const hours = [8, 10, 12, 14, 16, 18, 20];
  return hours.map((hour) => {
    const hourFactor = Math.sin(((hour - 8) / 12) * Math.PI);
    const temp = Math.round((baseTemp - 3 + hourFactor * 4) * 10) / 10;
    const hum = Math.max(15, Math.round(baseHum + 10 - hourFactor * 15));
    const fireR = Math.min(100, Math.max(5, Math.round(baseFire - 10 + hourFactor * 15)));
    const heatR = Math.min(100, Math.max(5, Math.round(baseHeat - 8 + hourFactor * 12)));
    const overall = Math.max(fireR, heatR, baseRainRisk);
    return {
      time: `${String(hour).padStart(2, '0')}:00`,
      hour,
      temperature: temp,
      humidity: hum,
      rain: baseRain,
      fireRisk: fireR,
      heatRisk: heatR,
      rainRisk: baseRainRisk,
      overallRisk: overall,
    };
  });
}

export const RiskEvolutionChart: React.FC<RiskEvolutionChartProps> = ({ region, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const trends: RegionHourlyForecast[] =
    region?.hourlyTrends && region.hourlyTrends.length >= 2
      ? region.hourlyTrends
      : generateFallbackHourlyTrends(
          region?.weather?.temperature ?? 28,
          region?.weather?.humidity ?? 50,
          region?.weather?.precipitation ?? 0,
          region?.risk?.fireRisk ?? 20,
          region?.risk?.heatRisk ?? 20,
          region?.risk?.rainRisk ?? 10
        );

  const [selectedHourIdx, setSelectedHourIdx] = useState<number>(Math.max(0, trends.length - 3));
  const selectedPoint = trends[selectedHourIdx] || trends[0] || {
    time: '14:00',
    hour: 14,
    temperature: 28,
    humidity: 50,
    rain: 0,
    fireRisk: 20,
    heatRisk: 20,
    rainRisk: 10,
    overallRisk: 20,
  };

  // SVG dimensions
  const width = 600;
  const height = 180;
  const padding = { top: 20, right: 30, bottom: 30, left: 40 };

  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  // Points mapping with safe division
  const divisor = Math.max(1, trends.length - 1);
  const points = trends.map((t, i) => {
    const x = padding.left + (i / divisor) * graphWidth;
    const y = padding.top + graphHeight - ((t.overallRisk ?? 20) / 100) * graphHeight;
    return { x, y, data: t };
  });

  const lastPointX = points.length > 0 ? points[points.length - 1].x : width - padding.right;
  const firstPointX = points.length > 0 ? points[0].x : padding.left;

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = pathD
    ? `${pathD} L ${lastPointX} ${height - padding.bottom} L ${firstPointX} ${height - padding.bottom} Z`
    : '';

  // Determine trend slope
  const firstPoint = trends[0] || selectedPoint;
  const peakPoint = [...trends].sort((a, b) => (b.overallRisk ?? 0) - (a.overallRisk ?? 0))[0] || selectedPoint;
  const isRising = (peakPoint.overallRisk ?? 0) - (firstPoint.overallRisk ?? 0) > 15;

  return (
    <div className={`p-4 border rounded-2xl shadow-xl space-y-4 transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-amber-500" />
          <h3 className={`text-sm font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Evolução Temporal & Antecedência de Alerta (Lead Time)
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {isRising && (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-500 border border-amber-500/40">
              <ArrowUpRight className="w-3.5 h-3.5 text-amber-500" />
              Tendência de Aumento de Risco
            </span>
          )}
          <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-500 border border-red-500/40">
            <Clock className="w-3.5 h-3.5 text-red-500" />
            {region.leadTimeHours ?? 4}h de Antecedência
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className={`relative w-full overflow-hidden rounded-xl border p-2 ${
        isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-50 border-slate-200'
      }`}>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {/* Threshold Lines */}
          <line
            x1={padding.left}
            y1={padding.top + graphHeight * 0.22}
            x2={width - padding.right}
            y2={padding.top + graphHeight * 0.22}
            stroke="#ef4444"
            strokeDasharray="4 4"
            strokeOpacity="0.4"
          />
          <text
            x={width - padding.right - 5}
            y={padding.top + graphHeight * 0.22 - 4}
            fill="#ef4444"
            fontSize="9"
            textAnchor="end"
            opacity="0.8"
          >
            78+ Crítico
          </text>

          <line
            x1={padding.left}
            y1={padding.top + graphHeight * 0.42}
            x2={width - padding.right}
            y2={padding.top + graphHeight * 0.42}
            stroke="#f59e0b"
            strokeDasharray="4 4"
            strokeOpacity="0.3"
          />
          <text
            x={width - padding.right - 5}
            y={padding.top + graphHeight * 0.42 - 4}
            fill="#f59e0b"
            fontSize="9"
            textAnchor="end"
            opacity="0.7"
          >
            58+ Alto
          </text>

          {/* Area under curve */}
          <defs>
            <linearGradient id="riskGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ef4444" stopOpacity="0.35" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {areaD && <path d={areaD} fill="url(#riskGradient)" />}
          {pathD && <path d={pathD} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" />}

          {/* Points */}
          {points.map((p, i) => (
            <g
              key={i}
              className="cursor-pointer transition-transform hover:scale-125"
              onClick={() => setSelectedHourIdx(i)}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={selectedHourIdx === i ? 6 : 4}
                fill={selectedHourIdx === i ? '#ffffff' : '#f59e0b'}
                stroke="#0f172a"
                strokeWidth="2"
              />
              {/* Hour Label */}
              <text
                x={p.x}
                y={height - padding.bottom + 16}
                fill={selectedHourIdx === i ? '#ffffff' : '#94a3b8'}
                fontSize="10"
                fontWeight={selectedHourIdx === i ? 'bold' : 'normal'}
                textAnchor="middle"
              >
                {p.data.time}
              </text>
            </g>
          ))}
        </svg>

        {/* Selected Hour Insight Pill */}
        <div className="mt-2 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white bg-slate-800 px-2 py-0.5 rounded font-mono">
              {selectedPoint.time}
            </span>
            <span className="text-slate-400">
              Risco Projetado: <strong className="text-amber-400 font-mono">{selectedPoint.overallRisk}/100</strong>
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-orange-400" />
              {selectedPoint.temperature}°C
            </span>
            <span className="flex items-center gap-1">
              <span className="text-cyan-400 font-bold">💧</span>
              {selectedPoint.humidity}% UR
            </span>
            {selectedPoint.rain > 0 && (
              <span className="flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-400" />
                {selectedPoint.rain} mm
              </span>
            )}
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Fogo: {selectedPoint.fireRisk}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <span>
          <strong>Por que a antecedência importa?</strong> Detectando a evolução das variáveis (temperatura subindo e
          umidade caindo a partir das 10h), o sistema dispara o alerta com{' '}
          <strong className="text-white">{region.leadTimeHours ?? 4} horas de antecedência</strong> do pico extremo das 14h,
          dando tempo para produtores rurais reforçarem aceiros, hospitais prepararem leitos de desidratação e Defesa
          Civil posicionar viaturas.
        </span>
      </div>
    </div>
  );
};
