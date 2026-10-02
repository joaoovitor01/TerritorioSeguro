export type ThreatLevel = 'baixo' | 'atencao' | 'alto' | 'critico';

export type EventType = 'calor' | 'chuva' | 'incendio';

export interface WeatherData {
  temperature: number; // °C
  humidity: number; // %
  precipitation: number; // mm (past 24h)
  precipitationForecast: number; // mm (next 24h)
  windSpeed: number; // km/h
  windDirection: string; // N, NE, E, SE, S, SW, W, NW
  daysWithoutRain: number;
  heatIndex?: number;
  soilMoisture?: number; // %
  conditionText?: string; // e.g. 'Ensolarado', 'Chuvoso', 'Céu Aberto'
  updatedAt: string;
}

export interface Hotspot {
  id: string;
  latitude: number;
  longitude: number;
  satellite: 'NOAA-20 (VIIRS)' | 'NOAA-21 (VIIRS)' | 'Aqua (MODIS)' | 'Terra (MODIS)' | 'GOES-16';
  confidence: number; // 0 - 100%
  frp: number; // Fire Radiative Power (MW)
  timestamp: string;
  source: 'NASA FIRMS' | 'INPE Queimadas';
  municipality: string;
  state: string;
  biome: string;
}

export interface FactorBreakdown {
  label: string;
  value: string;
  weight: number; // contribution 0 - 100
  status: 'favorable' | 'warning' | 'danger';
}

export interface RiskScores {
  heatRisk: number; // 0 - 100
  rainRisk: number; // 0 - 100
  fireRisk: number; // 0 - 100
  overallRisk: number; // 0 - 100
  dominantThreat: EventType;
  level: ThreatLevel;
  factors: {
    heat: FactorBreakdown[];
    rain: FactorBreakdown[];
    fire: FactorBreakdown[];
  };
}

export interface ImpactAssessment {
  score: number; // 0 - 100
  estimatedPopulationAffected: number;
  vulnerableGroupsCount: number; // elderly, children, respiratory patients
  proximityToRivers: 'distante' | 'moderada' | 'critica';
  proximityToResidences: 'isolado' | 'periferia' | 'centro urbano';
  ruralAreaRatio: number; // 0 - 100%
  criticalInfrastructure: string[];
  priorityScore: number; // (Risk * 0.45) + (Impact * 0.55)
}

export interface RegionHourlyForecast {
  time: string;
  hour: number;
  temperature: number;
  humidity: number;
  rain: number;
  fireRisk: number;
  heatRisk: number;
  rainRisk: number;
  overallRisk: number;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  biome: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  vegetationStatus: 'muito seca' | 'seca' | 'moderada' | 'umida';
  population: number;
  weather: WeatherData;
  hotspots: Hotspot[];
  risk: RiskScores;
  impact: ImpactAssessment;
  hourlyTrends: RegionHourlyForecast[];
  leadTimeHours: number; // Antecedência em horas
  activeAlert?: Alert;
}

export interface Alert {
  id: string;
  regionId: string;
  regionName: string;
  state: string;
  type: EventType;
  severity: ThreatLevel;
  title: string;
  headline: string;
  citizenMessage: {
    overview: string;
    keyPoints: string[];
    recommendations: string[];
  };
  operationalMessage: {
    technicalSummary: string;
    meteorologicalState: string;
    firePowerMW?: number;
    responseChecklist: string[];
    priorityRating: number;
  };
  createdAt: string;
  leadTimeNotice: string;
  verifiedStatus: 'anomalia_detectada' | 'investigacao_solicitada' | 'confirmada' | 'risco_preventivo';
}

export interface PipelineLog {
  id: string;
  timestamp: string;
  source: 'NASA FIRMS' | 'INPE Queimadas' | 'Open-Meteo' | 'Motor de Risco';
  status: 'coletado' | 'tratado' | 'validado' | 'cruzado' | 'alerta_emitido';
  message: string;
  payloadPreview?: string;
}
