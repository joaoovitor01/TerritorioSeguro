import React, { useState, useRef, useEffect } from 'react';
import { buildInitialRegions } from './services/mockData';
import { Region, ThreatLevel, EventType } from './types';
import { Header } from './components/Header';
import { RiskMap } from './components/RiskMap';
import { RegionDetailPanel } from './components/RegionDetailPanel';
import { RiskEvolutionChart } from './components/RiskEvolutionChart';
import { ScenarioSimulator } from './components/ScenarioSimulator';
import { BroadcastModal } from './components/BroadcastModal';
import { AboutUsModal } from './components/AboutUsModal';
import { fetchLiveWeather, searchBrazilianCities, GeocodedCity } from './services/weatherApi';
import { evaluateRegionRisk, calculateImpact, generateAlertContent } from './services/riskEngine';
import {
  Flame,
  Sun,
  CloudRain,
  MapPin,
  Clock,
  Sparkles,
  Layers,
  ShieldAlert,
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Loader2,
  Check,
  Info,
} from 'lucide-react';

export default function App() {
  const [regions, setRegions] = useState<Region[]>(() => buildInitialRegions());
  const [selectedRegion, setSelectedRegion] = useState<Region>(() => regions[0]);
  const [activeFilter, setActiveFilter] = useState<'todos' | EventType | 'critico' | 'normal'>('todos');
  const [activeView, setActiveView] = useState<'map' | 'simulator'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineCityResults, setOnlineCityResults] = useState<GeocodedCity[]>([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [isAddingCityId, setIsAddingCityId] = useState<number | null>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  // Online search for any city in Brazil
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setOnlineCityResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      try {
        const results = await searchBrazilianCities(searchQuery);
        setOnlineCityResults(results);
      } catch {
        setOnlineCityResults([]);
      } finally {
        setIsSearchingOnline(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSelectOnlineCity = async (city: GeocodedCity) => {
    setIsAddingCityId(city.id);
    setActiveFilter('todos');

    const existing = regions.find(
      (r) =>
        r.name.toLowerCase() === city.name.toLowerCase() ||
        (Math.abs(r.latitude - city.latitude) < 0.12 && Math.abs(r.longitude - city.longitude) < 0.12)
    );

    if (existing) {
      setSelectedRegion(existing);
      setSearchQuery('');
      setOnlineCityResults([]);
      setIsAddingCityId(null);
      return;
    }

    try {
      const liveWeather = await fetchLiveWeather(city.latitude, city.longitude);
      const risk = evaluateRegionRisk(liveWeather, [], 'moderada', 'moderada');
      const impact = calculateImpact(risk, city.population || 80000, 25, 'moderada', 'centro urbano');
      const activeAlert = generateAlertContent(city.name, city.admin1 || 'BR', risk, liveWeather, impact, [], 4.0);

      const hours = [8, 10, 12, 14, 16, 18, 20];
      const hourlyTrends = hours.map((hour) => {
        const hourFactor = Math.sin(((hour - 8) / 12) * Math.PI);
        const temp = Math.round((liveWeather.temperature - 3 + hourFactor * 4) * 10) / 10;
        const hum = Math.max(15, Math.round(liveWeather.humidity + 10 - hourFactor * 15));
        const fireR = Math.min(100, Math.max(5, Math.round(risk.fireRisk - 10 + hourFactor * 15)));
        const heatR = Math.min(100, Math.max(5, Math.round(risk.heatRisk - 8 + hourFactor * 12)));
        const overall = Math.max(fireR, heatR, risk.rainRisk);
        return {
          time: `${String(hour).padStart(2, '0')}:00`,
          hour,
          temperature: temp,
          humidity: hum,
          rain: liveWeather.precipitationForecast,
          fireRisk: fireR,
          heatRisk: heatR,
          rainRisk: risk.rainRisk,
          overallRisk: overall,
        };
      });

      const newRegion: Region = {
        id: `geo-${city.id}-${Date.now()}`,
        name: city.name,
        state: city.admin1 ? city.admin1.slice(0, 2).toUpperCase() : 'BR',
        biome: 'Brasil',
        latitude: city.latitude,
        longitude: city.longitude,
        radiusKm: 35,
        vegetationStatus: 'moderada',
        population: city.population || 80000,
        weather: liveWeather,
        hotspots: [],
        risk,
        impact,
        hourlyTrends,
        leadTimeHours: 4.0,
        activeAlert,
      };

      setRegions((prev) => [newRegion, ...prev]);
      setSelectedRegion(newRegion);
      setSearchQuery('');
      setOnlineCityResults([]);
    } catch (err) {
      console.error('Erro ao adicionar cidade pesquisada:', err);
    } finally {
      setIsAddingCityId(null);
    }
  };

  const [isLoadingLive, setIsLoadingLive] = useState(false);
  const [lastSyncedText, setLastSyncedText] = useState('Padrão de Calibração');

  const [broadcastTargetRegion, setBroadcastTargetRegion] = useState<Region | null>(null);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);

  // Sync Live Data from Open-Meteo
  const handleRefreshLiveData = async () => {
    setIsLoadingLive(true);
    try {
      const updatedRegions = await Promise.all(
        regions.map(async (reg) => {
          try {
            const liveWeather = await fetchLiveWeather(reg.latitude, reg.longitude);
            const risk = evaluateRegionRisk(
              liveWeather,
              reg.hotspots,
              reg.vegetationStatus,
              reg.impact.proximityToRivers
            );
            const impact = calculateImpact(
              risk,
              reg.population,
              reg.impact.ruralAreaRatio,
              reg.impact.proximityToRivers,
              reg.impact.proximityToResidences
            );
            const activeAlert = generateAlertContent(
              reg.name,
              reg.state,
              risk,
              liveWeather,
              impact,
              reg.hotspots,
              reg.leadTimeHours
            );

            return {
              ...reg,
              weather: liveWeather,
              risk,
              impact,
              activeAlert,
            };
          } catch (err) {
            console.error(`Erro ao atualizar região ${reg.name}:`, err);
            return reg;
          }
        })
      );

      setRegions(updatedRegions);
      // update selected if needed
      const currentSelected = updatedRegions.find((r) => r.id === selectedRegion.id) || updatedRegions[0];
      setSelectedRegion(currentSelected);

      const now = new Date();
      setLastSyncedText(`Sincronizado às ${now.toLocaleTimeString('pt-BR')}`);
    } catch (error) {
      console.error('Falha geral na sincronização Open-Meteo:', error);
    } finally {
      setIsLoadingLive(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Header */}
      <Header
        regions={regions}
        activeView={activeView}
        onViewChange={setActiveView}
        onRefreshLiveData={handleRefreshLiveData}
        isLoadingLive={isLoadingLive}
        onOpenAboutUs={() => setIsAboutUsOpen(true)}
        lastSyncedText={lastSyncedText}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* VIEW 1: MAPA & PAINEL DE ALERTA */}
        {activeView === 'map' && (
          <div className="space-y-6">
            {/* Search and Regional Carousel Navigation Bar */}
            {(() => {
              const baseRegions =
                activeFilter === 'todos'
                  ? regions
                  : activeFilter === 'critico'
                  ? regions.filter((r) => r.risk.level === 'critico' || r.risk.overallRisk >= 75)
                  : activeFilter === 'normal'
                  ? regions.filter((r) => r.risk.level === 'baixo' || r.risk.overallRisk <= 37)
                  : regions.filter((r) => r.risk.dominantThreat === activeFilter);

              const displayedRegions = baseRegions.filter((reg) => {
                if (!searchQuery.trim()) return true;
                const q = searchQuery.toLowerCase().trim();
                return (
                  reg.name.toLowerCase().includes(q) ||
                  reg.state.toLowerCase().includes(q) ||
                  reg.biome.toLowerCase().includes(q)
                );
              });

              return (
                <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 shadow-xl space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* Search Input for Cities in Real-Time */}
                    <div className="relative flex-1 min-w-[280px] max-w-lg">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        {isSearchingOnline ? (
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </div>

                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            if (displayedRegions.length > 0) {
                              setSelectedRegion(displayedRegions[0]);
                              setActiveFilter('todos');
                              setSearchQuery('');
                              setOnlineCityResults([]);
                            } else if (onlineCityResults.length > 0) {
                              handleSelectOnlineCity(onlineCityResults[0]);
                            }
                          } else if (e.key === 'Escape') {
                            setSearchQuery('');
                            setOnlineCityResults([]);
                          }
                        }}
                        placeholder="Pesquisar qualquer cidade do Brasil (ex: São Paulo, Manaus, Gramado, Ouro Preto)..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder-slate-500 outline-none transition-all shadow-inner"
                      />

                      {searchQuery && (
                        <button
                          onClick={() => {
                            setSearchQuery('');
                            setOnlineCityResults([]);
                          }}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded cursor-pointer"
                          title="Limpar pesquisa"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Online Geocoding Results Dropdown for Any City in Brazil */}
                      {(onlineCityResults.length > 0 || (searchQuery.trim().length >= 2 && isSearchingOnline)) && (
                        <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-slate-800/80 max-h-72 overflow-y-auto">
                          <div className="p-2 text-[11px] font-bold text-amber-400 bg-slate-950 flex items-center justify-between sticky top-0 z-10 border-b border-slate-800">
                            <span className="flex items-center gap-1.5">
                              {isSearchingOnline && <Loader2 className="w-3 h-3 animate-spin text-amber-400" />}
                              Cidades do Brasil Encontradas (Satélite / Open-Meteo)
                            </span>
                            <span className="text-[10px] text-slate-400">Clique para adicionar ao mapa</span>
                          </div>

                          {onlineCityResults.map((c) => {
                            const isAdding = isAddingCityId === c.id;
                            return (
                              <button
                                key={c.id}
                                onClick={() => handleSelectOnlineCity(c)}
                                disabled={isAddingCityId !== null}
                                className={`w-full text-left p-2.5 hover:bg-slate-800/90 flex items-center justify-between text-xs transition-colors cursor-pointer group ${
                                  isAdding ? 'bg-amber-500/10' : ''
                                }`}
                              >
                                <div>
                                  <strong className="text-white group-hover:text-amber-300 font-semibold">{c.name}</strong>
                                  <span className="text-slate-400 ml-1.5 font-mono text-[11px]">
                                    {c.admin1 ? c.admin1 : 'Brasil'}
                                  </span>
                                </div>
                                <span className={`text-[10px] px-2.5 py-1 rounded font-semibold border flex items-center gap-1 transition-all ${
                                  isAdding
                                    ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40 group-hover:bg-amber-500 group-hover:text-slate-950'
                                }`}>
                                  {isAdding ? (
                                    <>
                                      <Loader2 className="w-3 h-3 animate-spin" />
                                      Adicionando ao Mapa...
                                    </>
                                  ) : (
                                    <>
                                      + Adicionar ao Mapa
                                    </>
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Counter & Left/Right Carousel Controls */}
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="hidden sm:inline">
                        {displayedRegions.length} de {regions.length} localidades
                      </span>

                      <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={scrollLeft}
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/80 transition-all cursor-pointer font-bold shadow active:scale-95"
                          title="Cidades anteriores (<)"
                          aria-label="Cidades anteriores"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={scrollRight}
                          className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 border border-slate-700/80 transition-all cursor-pointer font-bold shadow active:scale-95"
                          title="Próximas cidades (>)"
                          aria-label="Próximas cidades"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Scrollable Cities Track */}
                  <div
                    ref={carouselRef}
                    className="flex items-center gap-2 overflow-x-auto pb-1.5 scroll-smooth scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent text-xs"
                  >
                    {displayedRegions.length === 0 ? (
                      <div className="py-2 px-3 text-xs text-slate-400 italic">
                        Nenhuma cidade encontrada para &quot;{searchQuery}&quot;. Tente outro termo ou limpe a busca.
                      </div>
                    ) : (
                      displayedRegions.map((reg) => {
                        const isSelected = reg.id === selectedRegion.id;
                        const emoji =
                          reg.risk.dominantThreat === 'incendio'
                            ? '🔥'
                            : reg.risk.dominantThreat === 'chuva'
                            ? '🌧️'
                            : '☀️';

                        return (
                          <button
                            key={reg.id}
                            onClick={() => setSelectedRegion(reg)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-amber-500/20 border-amber-500 text-white font-bold shadow-lg shadow-amber-950/30 ring-1 ring-amber-500/50'
                                : 'bg-slate-950 border-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-800'
                            }`}
                            title={`${reg.name} (${reg.state}) - Risco ${reg.risk.level.toUpperCase()} (${reg.risk.overallRisk} pts)`}
                          >
                            <span>{emoji}</span>
                            <span className="font-medium">{reg.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">({reg.state})</span>
                            <span
                              className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                                reg.risk.level === 'critico'
                                  ? 'bg-red-950 text-red-300 border border-red-800/60'
                                  : reg.risk.level === 'alto'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                                  : 'bg-slate-800 text-slate-400 border border-slate-700'
                              }`}
                            >
                              {reg.risk.overallRisk}
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Split Grid: Map + Detail Panel */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Map (7 cols on lg) */}
              <div className="lg:col-span-7 h-[580px]">
                <RiskMap
                  regions={regions}
                  selectedRegion={selectedRegion}
                  onSelectRegion={(reg) => setSelectedRegion(reg)}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  isLoadingLive={isLoadingLive}
                />
              </div>

              {/* Detail Panel (5 cols on lg) */}
              <div className="lg:col-span-5 h-[580px]">
                <RegionDetailPanel
                  region={selectedRegion}
                  onOpenBroadcast={(reg) => setBroadcastTargetRegion(reg)}
                />
              </div>
            </div>

            {/* Evolution & Lead-Time Chart */}
            <RiskEvolutionChart region={selectedRegion} />
          </div>
        )}

        {/* VIEW 2: WHAT-IF SCENARIO SIMULATOR */}
        {activeView === 'simulator' && (
          <ScenarioSimulator
            onApplyToRegion={(customWeather, hotspotsCount, vegStatus) => {
              // Allows pushing scenario to selected region
              const dummyHotspots = Array.from({ length: hotspotsCount }).map((_, i) => ({
                id: `applied-hs-${i}`,
                latitude: selectedRegion.latitude + (Math.random() - 0.5) * 0.2,
                longitude: selectedRegion.longitude + (Math.random() - 0.5) * 0.2,
                satellite: 'NOAA-20 (VIIRS)' as const,
                confidence: 92,
                frp: 75,
                timestamp: 'Agora',
                source: 'NASA FIRMS' as const,
                municipality: selectedRegion.name,
                state: selectedRegion.state,
                biome: selectedRegion.biome,
              }));

              const risk = evaluateRegionRisk(
                customWeather,
                dummyHotspots,
                vegStatus,
                selectedRegion.impact.proximityToRivers
              );
              const impact = calculateImpact(
                risk,
                selectedRegion.population,
                selectedRegion.impact.ruralAreaRatio,
                selectedRegion.impact.proximityToRivers,
                selectedRegion.impact.proximityToResidences
              );
              const activeAlert = generateAlertContent(
                selectedRegion.name,
                selectedRegion.state,
                risk,
                customWeather,
                impact,
                dummyHotspots,
                selectedRegion.leadTimeHours
              );

              const updatedRegion: Region = {
                ...selectedRegion,
                weather: customWeather,
                hotspots: dummyHotspots,
                risk,
                impact,
                activeAlert,
              };

              setRegions((prev) => prev.map((r) => (r.id === selectedRegion.id ? updatedRegion : r)));
              setSelectedRegion(updatedRegion);
              setActiveView('map');
            }}
          />
        )}
      </main>

      {/* Broadcast Alert Modal */}
      {broadcastTargetRegion && (
        <BroadcastModal
          region={broadcastTargetRegion}
          onClose={() => setBroadcastTargetRegion(null)}
        />
      )}

      {/* About Us Modal */}
      {isAboutUsOpen && <AboutUsModal onClose={() => setIsAboutUsOpen(false)} />}

      {/* Clean Technical Footer */}
      <footer className="w-full bg-slate-950 border-t border-slate-800/80 py-6 px-4 mt-auto text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white tracking-wide">Território Seguro</span>
            <span>•</span>
            <span>Plataforma Inteligente de Proteção e Monitoramento Territorial</span>
            <span>•</span>
            <span className="text-amber-500/90 font-medium">Eixo A — Alertas Locais de Risco</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span>Fontes: NASA FIRMS API, INPE Programa Queimadas, Open-Meteo, IBGE</span>
            <span>•</span>
            <span className="italic text-slate-400">“Transformando dados ambientais em tempo para agir.”</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
