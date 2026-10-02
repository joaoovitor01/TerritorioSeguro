import React, { useState } from 'react';
import { evaluateRegionRisk, calculateImpact, generateAlertContent, getThreatLevelColor } from '../services/riskEngine';
import { WeatherData, Hotspot } from '../types';
import { Sliders, Sparkles, RefreshCw, Flame, Sun, CloudRain, ShieldCheck, AlertCircle } from 'lucide-react';

interface ScenarioSimulatorProps {
  onApplyToRegion?: (customWeather: WeatherData, hotspotsCount: number, vegStatus: string) => void;
  theme?: 'dark' | 'light';
}

export const ScenarioSimulator: React.FC<ScenarioSimulatorProps> = ({ onApplyToRegion, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  const [temperature, setTemperature] = useState<number>(38);
  const [humidity, setHumidity] = useState<number>(22);
  const [windSpeed, setWindSpeed] = useState<number>(26);
  const [daysWithoutRain, setDaysWithoutRain] = useState<number>(16);
  const [rainForecast, setRainForecast] = useState<number>(0);
  const [hotspotsCount, setHotspotsCount] = useState<number>(2);
  const [vegetation, setVegetation] = useState<'muito seca' | 'seca' | 'moderada' | 'umida'>('muito seca');
  const [riverProximity, setRiverProximity] = useState<'distante' | 'moderada' | 'critica'>('moderada');
  const [populationSize, setPopulationSize] = useState<number>(150000);

  // Compute live
  const simulatedWeather: WeatherData = {
    temperature,
    humidity,
    precipitation: rainForecast > 30 ? 40 : 0,
    precipitationForecast: rainForecast,
    windSpeed,
    windDirection: 'NE',
    daysWithoutRain,
    heatIndex: temperature + 2,
    soilMoisture: rainForecast > 40 ? 88 : Math.max(12, 100 - humidity * 1.5),
    updatedAt: 'Simulador Dinâmico',
  };

  const dummyHotspots: Hotspot[] = Array.from({ length: hotspotsCount }).map((_, i) => ({
    id: `sim-hs-${i}`,
    latitude: -15.0,
    longitude: -50.0,
    satellite: 'NOAA-20 (VIIRS)',
    confidence: 90,
    frp: 65,
    timestamp: 'Agora',
    source: 'NASA FIRMS',
    municipality: 'Cenário Simulado',
    state: 'BR',
    biome: 'Cerrado/Pantanal',
  }));

  const risk = evaluateRegionRisk(simulatedWeather, dummyHotspots, vegetation, riverProximity);
  const impact = calculateImpact(risk, populationSize, 60, riverProximity, 'periferia');
  const alert = generateAlertContent(
    'Cenário Customizado',
    'BR',
    risk,
    simulatedWeather,
    impact,
    dummyHotspots,
    4.0
  );
  const threatColor = getThreatLevelColor(risk.level);

  // Presets
  const applyPreset = (preset: 'fogo' | 'chuva' | 'calor' | 'seguro') => {
    if (preset === 'fogo') {
      setTemperature(39);
      setHumidity(19);
      setWindSpeed(30);
      setDaysWithoutRain(22);
      setRainForecast(0);
      setHotspotsCount(3);
      setVegetation('muito seca');
      setRiverProximity('moderada');
    } else if (preset === 'chuva') {
      setTemperature(21);
      setHumidity(94);
      setWindSpeed(24);
      setDaysWithoutRain(0);
      setRainForecast(85);
      setHotspotsCount(0);
      setVegetation('umida');
      setRiverProximity('critica');
    } else if (preset === 'calor') {
      setTemperature(41);
      setHumidity(24);
      setWindSpeed(15);
      setDaysWithoutRain(14);
      setRainForecast(0);
      setHotspotsCount(0);
      setVegetation('seca');
      setRiverProximity('moderada');
    } else {
      setTemperature(24);
      setHumidity(65);
      setWindSpeed(12);
      setDaysWithoutRain(3);
      setRainForecast(5);
      setHotspotsCount(0);
      setVegetation('moderada');
      setRiverProximity('distante');
    }
  };

  return (
    <div
      className={`border rounded-2xl p-5 shadow-2xl space-y-6 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900 shadow-md'
      }`}
    >
      <div
        className={`flex flex-wrap items-center justify-between gap-3 border-b pb-4 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-500" />
            <h3 className={`text-base font-bold tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Laboratório de Cenários Climáticos (What-If)
            </h3>
          </div>
          <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Teste como variações de temperatura, umidade, vento e focos orbitais reconfiguram o algoritmo de risco em tempo real.
          </p>
        </div>

        {/* Presets */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className={`mr-1 ${isDark ? 'text-slate-500' : 'text-slate-400 font-medium'}`}>Cenários Prontos:</span>
          <button
            onClick={() => applyPreset('fogo')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-red-950/60 hover:bg-red-900 text-red-300 border-red-800'
                : 'bg-red-50 hover:bg-red-100 text-red-700 border-red-200'
            }`}
          >
            <Flame className="w-3 h-3 text-red-500" />
            Queimada Severa
          </button>
          <button
            onClick={() => applyPreset('chuva')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-cyan-950/60 hover:bg-cyan-900 text-cyan-300 border-cyan-800'
                : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-700 border-cyan-200'
            }`}
          >
            <CloudRain className="w-3 h-3 text-cyan-500" />
            Enxurrada / Cheia
          </button>
          <button
            onClick={() => applyPreset('calor')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-orange-950/60 hover:bg-orange-900 text-orange-300 border-orange-800'
                : 'bg-orange-50 hover:bg-orange-100 text-orange-700 border-orange-200'
            }`}
          >
            <Sun className="w-3 h-3 text-orange-500" />
            Onda Térmica
          </button>
          <button
            onClick={() => applyPreset('seguro')}
            className={`px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all flex items-center gap-1 cursor-pointer ${
              isDark
                ? 'bg-emerald-950/60 hover:bg-emerald-900 text-emerald-300 border-emerald-800'
                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200'
            }`}
          >
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            Estável
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Temperature */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Temperatura do Ar</span>
                <strong className="text-amber-500 font-mono text-sm">{temperature}°C</strong>
              </div>
              <input
                type="range"
                min="15"
                max="46"
                step="1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>15°C (Ameno)</span>
                <span>46°C (Extremo)</span>
              </div>
            </div>

            {/* Humidity */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Umidade Relativa</span>
                <strong
                  className={`font-mono text-sm ${humidity <= 20 ? 'text-red-500' : 'text-cyan-600 dark:text-cyan-400'}`}
                >
                  {humidity}%
                </strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="1"
                value={humidity}
                onChange={(e) => setHumidity(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>10% (Desértico)</span>
                <span>100% (Saturado)</span>
              </div>
            </div>

            {/* Wind Speed */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Velocidade do Vento</span>
                <strong className={`font-mono text-sm ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {windSpeed} km/h
                </strong>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="1"
                value={windSpeed}
                onChange={(e) => setWindSpeed(Number(e.target.value))}
                className="w-full accent-slate-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Calmo (0 km/h)</span>
                <span>Ventania (60 km/h)</span>
              </div>
            </div>

            {/* Days without rain */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Estiagem (Dias sem Chuva)</span>
                <strong className="text-orange-500 font-mono text-sm">{daysWithoutRain} dias</strong>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="1"
                value={daysWithoutRain}
                onChange={(e) => setDaysWithoutRain(Number(e.target.value))}
                className="w-full accent-orange-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 dias (Recente)</span>
                <span>40 dias (Seca Crítica)</span>
              </div>
            </div>

            {/* Rain Forecast */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Previsão de Chuva (24h)</span>
                <strong className="text-blue-500 font-mono text-sm">{rainForecast} mm</strong>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="5"
                value={rainForecast}
                onChange={(e) => setRainForecast(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 mm</span>
                <span>140 mm (Torrencial)</span>
              </div>
            </div>

            {/* Hotspots Count */}
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex justify-between text-xs">
                <span className={isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}>Focos de Calor Orbitais</span>
                <strong className="text-red-500 font-mono text-sm">{hotspotsCount} focos</strong>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="1"
                value={hotspotsCount}
                onChange={(e) => setHotspotsCount(Number(e.target.value))}
                className="w-full accent-red-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Sem anomalia)</span>
                <span>8 (Múltiplos focos)</span>
              </div>
            </div>
          </div>

          {/* Selectors for Vegetation & Rivers */}
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <label className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                Condição da Vegetação
              </label>
              <select
                value={vegetation}
                onChange={(e) => setVegetation(e.target.value as any)}
                className={`w-full rounded-lg text-xs p-2 border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="muito seca">Muito Seca (Altamente Inflamável)</option>
                <option value="seca">Seca</option>
                <option value="moderada">Moderada</option>
                <option value="umida">Úmida / Preservada</option>
              </select>
            </div>

            <div
              className={`p-3 rounded-xl border space-y-1.5 ${
                isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <label className={`text-xs block ${isDark ? 'text-slate-400' : 'text-slate-600 font-medium'}`}>
                Proximidade com Calha de Rio
              </label>
              <select
                value={riverProximity}
                onChange={(e) => setRiverProximity(e.target.value as any)}
                className={`w-full rounded-lg text-xs p-2 border ${
                  isDark
                    ? 'bg-slate-900 border-slate-700 text-slate-200'
                    : 'bg-white border-slate-300 text-slate-800'
                }`}
              >
                <option value="critica">Crítica (Planície Inundável)</option>
                <option value="moderada">Moderada (Distância Média)</option>
                <option value="distante">Distante (Área Elevada)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live Recalculated Output Column */}
        <div
          className={`lg:col-span-5 flex flex-col justify-between p-4 rounded-xl border space-y-4 ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Diagnóstico Algorítmico do Modelo
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border ${threatColor.badge}`}>
                {risk.level}
              </span>
            </div>

            {/* Gauge Scores */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>☀️ Calor</span>
                <div className="text-lg font-bold font-mono text-orange-500">{risk.heatRisk}</div>
              </div>
              <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>🌧️ Chuva</span>
                <div className="text-lg font-bold font-mono text-cyan-500">{risk.rainRisk}</div>
              </div>
              <div className={`p-2.5 rounded-lg border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                <span className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>🔥 Incêndio</span>
                <div className="text-lg font-bold font-mono text-red-500">{risk.fireRisk}</div>
              </div>
            </div>

            {/* Impact score */}
            <div
              className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>
                Consequência / Impacto Estimado:
              </span>
              <span className="font-mono font-bold text-amber-500 text-sm">{impact.score}/100</span>
            </div>

            {/* Generated Alert Snippet */}
            <div
              className={`p-3 rounded-lg border ${threatColor.border} space-y-1.5 ${
                isDark ? 'bg-slate-900/50' : 'bg-white shadow-sm'
              }`}
            >
              <div className={`text-xs font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <AlertCircle className="w-4 h-4 text-amber-500" />
                {alert.title}
              </div>
              <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                {alert.citizenMessage.overview}
              </p>
            </div>
          </div>

          <div className="pt-2 text-[11px] text-slate-500 italic">
            * O Motor de Risco calcula pesos matemáticos transparentes entre as 6 variáveis meteorológicas,
            conforme especificado na Seção 12 do projeto.
          </div>
        </div>
      </div>
    </div>
  );
};
