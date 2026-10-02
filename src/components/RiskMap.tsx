import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Region, ThreatLevel, EventType, Hotspot } from '../types';
import { Flame, CloudRain, Sun, Layers, Eye, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

interface RiskMapProps {
  regions: Region[];
  selectedRegion: Region | null;
  onSelectRegion: (region: Region) => void;
  activeFilter: 'todos' | EventType | 'critico' | 'normal';
  onFilterChange: (filter: 'todos' | EventType | 'critico' | 'normal') => void;
  isLoadingLive?: boolean;
}

const CARTO_API_KEY = 'cb1_46ww_1_807b82adb8b51ce1799b934d';

type MapTileStyle = 'voyager' | 'dark' | 'satellite';

const TILE_CONFIG: Record<MapTileStyle, { url: string; attribution: string; name: string }> = {
  voyager: {
    url: `https://basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    name: 'Carto Voyager',
  },
  dark: {
    url: `https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}.png?key=${CARTO_API_KEY}`,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO</a>',
    name: 'Carto Dark Tático',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri World Imagery, Maxar, Earthstar Geographics',
    name: 'Satélite Real',
  },
};

export const RiskMap: React.FC<RiskMapProps> = ({
  regions,
  selectedRegion,
  onSelectRegion,
  activeFilter,
  onFilterChange,
  isLoadingLive = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const hotspotsLayerRef = useRef<L.LayerGroup | null>(null);

  const [showHotspots, setShowHotspots] = useState(true);
  const [mapStyle, setMapStyle] = useState<MapTileStyle>('voyager');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Central Brazil
    const map = L.map(mapContainerRef.current, {
      center: [-15.7801, -47.9292],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
      zoomControl: false,
    });

    const activeConfig = TILE_CONFIG[mapStyle];
    const baseTile = L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: 19,
    });
    baseTile.addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    const hotspotsLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    hotspotsLayerRef.current = hotspotsLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Base Tile on style switch
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Remove existing tile layer
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const activeConfig = TILE_CONFIG[mapStyle];
    L.tileLayer(activeConfig.url, {
      attribution: activeConfig.attribution,
      maxZoom: 19,
    }).addTo(map);
  }, [mapStyle]);

  // Update Markers and Hotspots
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !hotspotsLayerRef.current) return;
    const markersLayer = markersLayerRef.current;
    const hotspotsLayer = hotspotsLayerRef.current;

    markersLayer.clearLayers();
    hotspotsLayer.clearLayers();

    // Filter regions based on active filter
    const filteredRegions = regions.filter((reg) => {
      if (activeFilter === 'todos') return true;
      if (activeFilter === 'critico') return reg.risk.level === 'critico' || reg.risk.overallRisk >= 75;
      if (activeFilter === 'normal') return reg.risk.level === 'baixo' || reg.risk.overallRisk <= 37;
      return reg.risk.dominantThreat === activeFilter;
    });

    // Render Regions
    filteredRegions.forEach((region) => {
      const isSelected = selectedRegion?.id === region.id;
      const threatColor =
        region.risk.level === 'critico'
          ? '#ef4444'
          : region.risk.level === 'alto'
          ? '#f59e0b'
          : region.risk.level === 'atencao'
          ? '#eab308'
          : '#10b981';

      const iconEmoji =
        region.risk.dominantThreat === 'incendio' ? '🔥' : region.risk.dominantThreat === 'chuva' ? '🌧️' : '☀️';

      // Circle representing monitoring buffer zone
      const circle = L.circle([region.latitude, region.longitude], {
        radius: (region.radiusKm || 40) * 1000,
        color: threatColor,
        weight: isSelected ? 3 : 1.5,
        fillColor: threatColor,
        fillOpacity: isSelected ? 0.25 : 0.12,
        dashArray: isSelected ? '4, 4' : undefined,
      });

      circle.on('click', () => {
        onSelectRegion(region);
      });
      circle.addTo(markersLayer);

      // Custom HTML Marker Pin with Temperature
      const customPinHtml = `
        <div class="relative group cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-transform ${
          isSelected ? 'scale-125 z-50' : 'hover:scale-110'
        }">
          <div class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow-xl border backdrop-blur-md transition-all ${
            region.risk.level === 'critico'
              ? 'bg-red-950/90 text-red-200 border-red-500/80 shadow-red-900/50'
              : region.risk.level === 'alto'
              ? 'bg-amber-950/90 text-amber-200 border-amber-500/80 shadow-amber-900/50'
              : region.risk.level === 'atencao'
              ? 'bg-yellow-950/90 text-yellow-200 border-yellow-500/80 shadow-yellow-900/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/80 shadow-emerald-900/50'
          }">
            <span class="text-xs">${iconEmoji}</span>
            <span class="font-bold tracking-tight text-[11px] whitespace-nowrap">${region.name}</span>
            <span class="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/40 text-amber-300 font-bold border border-white/10">
              ${region.weather.temperature.toFixed(0)}°
            </span>
          </div>
          ${
            isSelected
              ? `<div class="absolute -inset-1 rounded-full border-2 border-white animate-ping opacity-30 pointer-events-none"></div>`
              : ''
          }
        </div>
      `;

      const customIcon = L.divIcon({
        html: customPinHtml,
        className: 'custom-region-marker',
        iconSize: [130, 36],
        iconAnchor: [65, 18],
      });

      const marker = L.marker([region.latitude, region.longitude], { icon: customIcon });

      const popupHtml = `
        <div style="font-family: system-ui, sans-serif; min-width: 200px; color: #f1f5f9; background: #0f172a; padding: 10px; border-radius: 12px; border: 1px solid #334155;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #1e293b; padding-bottom: 6px; margin-bottom: 8px;">
            <div>
              <strong style="font-size: 13px; color: #ffffff; display: block;">${region.name} (${region.state})</strong>
              <span style="font-size: 10px; color: #94a3b8;">${region.weather.conditionText || region.biome}</span>
            </div>
            <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${threatColor}25; color: ${threatColor}; border: 1px solid ${threatColor}60; text-transform: uppercase;">
              ${region.risk.level}
            </span>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px;">
            <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
              <span style="font-size: 9px; color: #94a3b8; display: block;">TEMPERATURA</span>
              <strong style="color: #fbbf24; font-size: 13px;">${region.weather.temperature.toFixed(1)}°C</strong>
              <span style="font-size: 9px; color: #64748b; display: block;">Sensação: ${region.weather.heatIndex?.toFixed(1) || region.weather.temperature.toFixed(1)}°C</span>
            </div>
            <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
              <span style="font-size: 9px; color: #94a3b8; display: block;">UMIDADE AR</span>
              <strong style="color: #38bdf8; font-size: 13px;">${region.weather.humidity}%</strong>
              <span style="font-size: 9px; color: #64748b; display: block;">${region.weather.humidity < 25 ? '⚠️ Muito Baixa' : 'Estável'}</span>
            </div>
            <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
              <span style="font-size: 9px; color: #94a3b8; display: block;">CHUVA (24H)</span>
              <strong style="color: #60a5fa; font-size: 11px;">${region.weather.precipitation} mm</strong>
              <span style="font-size: 9px; color: #64748b; display: block;">Prev: ${region.weather.precipitationForecast} mm</span>
            </div>
            <div style="background: #1e293b; padding: 6px; border-radius: 6px;">
              <span style="font-size: 9px; color: #94a3b8; display: block;">VENTO</span>
              <strong style="color: #e2e8f0; font-size: 11px;">${region.weather.windSpeed.toFixed(0)} km/h</strong>
              <span style="font-size: 9px; color: #64748b; display: block;">Direção ${region.weather.windDirection}</span>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { closeButton: false });

      marker.on('click', () => {
        onSelectRegion(region);
      });
      marker.addTo(markersLayer);
    });

    // Render Satellite Hotspots
    if (showHotspots) {
      const allHotspots: Hotspot[] = regions.flatMap((r) => r.hotspots);

      allHotspots.forEach((hs) => {
        const hotspotHtml = `
          <div class="relative cursor-pointer group -translate-x-1/2 -translate-y-1/2">
            <div class="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-red-600 to-yellow-400 border border-white/80 shadow-lg shadow-red-600/70 flex items-center justify-center animate-pulse">
              <span class="text-[9px]">🔥</span>
            </div>
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center z-50 pointer-events-none">
              <div class="bg-slate-900/95 border border-slate-700 text-slate-100 rounded px-2 py-1 text-[10px] whitespace-nowrap shadow-2xl backdrop-blur-md">
                <span class="font-bold text-red-400">${hs.source}</span> • FRP ${hs.frp} MW (${hs.satellite})
              </div>
            </div>
          </div>
        `;

        const hotspotIcon = L.divIcon({
          html: hotspotHtml,
          className: 'custom-hotspot-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const hsMarker = L.marker([hs.latitude, hs.longitude], { icon: hotspotIcon });
        hsMarker.bindTooltip(
          `<strong>Foco de Calor (${hs.source})</strong><br/>
           Satélite: ${hs.satellite}<br/>
           Potência Radiativa (FRP): ${hs.frp} MW<br/>
           Confiança: ${hs.confidence}%<br/>
           <em>Anomalia que requer verificação</em>`,
          { className: 'leaflet-tactical-tooltip', direction: 'top' }
        );
        hsMarker.addTo(hotspotsLayer);
      });
    }
  }, [regions, selectedRegion, activeFilter, showHotspots]);

  // Center on selected region when changed
  useEffect(() => {
    if (
      !mapInstanceRef.current ||
      !selectedRegion ||
      typeof selectedRegion.latitude !== 'number' ||
      typeof selectedRegion.longitude !== 'number' ||
      isNaN(selectedRegion.latitude) ||
      isNaN(selectedRegion.longitude)
    )
      return;

    try {
      mapInstanceRef.current.flyTo([selectedRegion.latitude, selectedRegion.longitude], 6.5, {
        duration: 1.2,
        easeLinearity: 0.25,
      });
    } catch (err) {
      console.warn('Erro ao mover mapa para coordenadas da região:', err);
    }
  }, [selectedRegion]);

  const normalCount = regions.filter((r) => r.risk.level === 'baixo' || r.risk.overallRisk <= 37).length;
  const fireCount = regions.filter((r) => r.risk.dominantThreat === 'incendio').length;
  const heatCount = regions.filter((r) => r.risk.dominantThreat === 'calor').length;
  const rainCount = regions.filter((r) => r.risk.dominantThreat === 'chuva').length;
  const criticalCount = regions.filter((r) => r.risk.level === 'critico' || r.risk.overallRisk >= 75).length;

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
      {/* Map Element */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Filter Chips Bar */}
      <div className="absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg pointer-events-auto">
          <button
            onClick={() => onFilterChange('todos')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'todos'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            Todas as Cidades ({regions.length})
          </button>
          <button
            onClick={() => onFilterChange('normal')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'normal'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/50 shadow'
                : 'text-slate-400 hover:text-emerald-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            Clima Estável ({normalCount})
          </button>
          <button
            onClick={() => onFilterChange('incendio')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'incendio'
                ? 'bg-amber-600/30 text-amber-300 border border-amber-500/50 shadow'
                : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/60'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            Fogo & Queimadas ({fireCount})
          </button>
          <button
            onClick={() => onFilterChange('calor')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'calor'
                ? 'bg-orange-600/30 text-orange-300 border border-orange-500/50 shadow'
                : 'text-slate-400 hover:text-orange-300 hover:bg-slate-800/60'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-orange-400" />
            Calor Extremo ({heatCount})
          </button>
          <button
            onClick={() => onFilterChange('chuva')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'chuva'
                ? 'bg-cyan-600/30 text-cyan-300 border border-cyan-500/50 shadow'
                : 'text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
            Chuvas & Enchentes ({rainCount})
          </button>
          <button
            onClick={() => onFilterChange('critico')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'critico'
                ? 'bg-red-600/30 text-red-300 border border-red-500/50 shadow'
                : 'text-slate-400 hover:text-red-300 hover:bg-slate-800/60'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            Apenas Críticos ({criticalCount})
          </button>
        </div>

        {/* Tactical Map Toggles */}
        <div className="flex items-center gap-2 p-1.5 bg-slate-900/85 backdrop-blur-md border border-slate-800 rounded-xl shadow-lg pointer-events-auto text-xs">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-all ${
              showHotspots
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:bg-slate-800/60'
            }`}
            title="Exibir focos térmicos de satélite"
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Focos Orbitais</span>
          </button>

          <div className="flex items-center rounded-lg bg-slate-950/80 p-0.5 border border-slate-700/60">
            <button
              onClick={() => setMapStyle('voyager')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mapStyle === 'voyager'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Carto Voyager Oficial (API Key ativada)"
            >
              Voyager (CARTO)
            </button>
            <button
              onClick={() => setMapStyle('dark')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mapStyle === 'dark'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Carto Dark Tático"
            >
              Dark
            </button>
            <button
              onClick={() => setMapStyle('satellite')}
              className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                mapStyle === 'satellite'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Satélite de Alta Resolução"
            >
              Satélite
            </button>
          </div>
        </div>
      </div>

      {/* Floating Status & Legend */}
      <div className="absolute bottom-4 left-4 z-10 p-3 bg-slate-900/90 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-2xl max-w-xs text-xs space-y-2 pointer-events-auto">
        <div className="flex items-center justify-between font-semibold text-slate-300 border-b border-slate-800 pb-1.5">
          <span>Escala Território Seguro</span>
          <span className="text-[10px] text-slate-500 font-mono">0 a 100 pts</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20"></span>
            <span className="text-slate-300">Baixo (0-37)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 ring-2 ring-yellow-500/20"></span>
            <span className="text-slate-300">Atenção (38-57)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-amber-500/20"></span>
            <span className="text-slate-300">Alto (58-77)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-red-500/20 animate-pulse"></span>
            <span className="text-slate-300">Crítico (78-100)</span>
          </div>
        </div>
        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <span className="text-xs">🔥</span>
            <span>Foco de calor (NASA FIRMS / INPE)</span>
          </div>
          <span className="italic text-slate-500">Requer checagem</span>
        </div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => mapInstanceRef.current?.zoomIn()}
          className="p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 shadow-lg"
          title="Aproximar zoom"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => mapInstanceRef.current?.zoomOut()}
          className="p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 shadow-lg"
          title="Afastar zoom"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([-15.7801, -47.9292], 4);
            }
          }}
          className="p-2 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 shadow-lg"
          title="Visão Geral do Brasil"
        >
          <Eye className="w-4 h-4" />
        </button>
      </div>

      {/* Live sync indicator */}
      {isLoadingLive && (
        <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-30">
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl text-slate-200">
            <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />
            <span className="text-sm font-medium">Sincronizando telemetria meteorológica em tempo real...</span>
          </div>
        </div>
      )}
    </div>
  );
};
