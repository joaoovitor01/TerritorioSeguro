import { WeatherData, Hotspot, RiskScores, ThreatLevel, EventType, ImpactAssessment, Alert, FactorBreakdown } from '../types';

export function calculateHeatIndex(tempC: number, humidity: number): number {
  // Rothfusz regression simplified for Celsius
  if (tempC < 27 || humidity < 40) return tempC;
  const T = tempC;
  const R = humidity;
  const c1 = -8.78469475556;
  const c2 = 1.61139411;
  const c3 = 2.33854883889;
  const c4 = -0.14611605;
  const c5 = -0.012308094;
  const c6 = -0.0164248277778;
  const c7 = 0.002211732;
  const c8 = 0.00072546;
  const c9 = -0.000003582;

  const hi = c1 + c2 * T + c3 * R + c4 * T * R + c5 * T * T + c6 * R * R + c7 * T * T * R + c8 * T * R * R + c9 * T * T * R * R;
  return Math.round(hi * 10) / 10;
}

export function calculateHeatRisk(weather: WeatherData): { score: number; factors: FactorBreakdown[] } {
  const factors: FactorBreakdown[] = [];

  // Temp component (0 to 100)
  // Baseline: 25°C = 0, 42°C+ = 100
  let tempScore = 0;
  if (weather.temperature >= 42) tempScore = 100;
  else if (weather.temperature >= 25) {
    tempScore = ((weather.temperature - 25) / (42 - 25)) * 100;
  }
  factors.push({
    label: 'Temperatura do Ar',
    value: `${weather.temperature.toFixed(1)}°C`,
    weight: Math.round(tempScore),
    status: weather.temperature >= 38 ? 'danger' : weather.temperature >= 32 ? 'warning' : 'favorable',
  });

  // Humidity component (inverse: low humidity aggravates heat stress & dehydration)
  // 60% = 0, 15% or less = 100
  let humScore = 0;
  if (weather.humidity <= 15) humScore = 100;
  else if (weather.humidity <= 60) {
    humScore = ((60 - weather.humidity) / (60 - 15)) * 100;
  }
  factors.push({
    label: 'Umidade Relativa',
    value: `${weather.humidity}%`,
    weight: Math.round(humScore),
    status: weather.humidity <= 20 ? 'danger' : weather.humidity <= 35 ? 'warning' : 'favorable',
  });

  // Heat Index component
  const hi = calculateHeatIndex(weather.temperature, weather.humidity);
  let hiScore = 0;
  if (hi >= 44) hiScore = 100;
  else if (hi >= 28) {
    hiScore = ((hi - 28) / (44 - 28)) * 100;
  }
  factors.push({
    label: 'Sensação Térmica (Índice)',
    value: `${hi.toFixed(1)}°C`,
    weight: Math.round(hiScore),
    status: hi >= 40 ? 'danger' : hi >= 34 ? 'warning' : 'favorable',
  });

  const finalScore = Math.min(100, Math.round(tempScore * 0.45 + humScore * 0.25 + hiScore * 0.30));
  return { score: finalScore, factors };
}

export function calculateRainRisk(weather: WeatherData, proximityToRivers: string = 'moderada'): { score: number; factors: FactorBreakdown[] } {
  const factors: FactorBreakdown[] = [];

  // 1. Forecast precipitation in 24h
  // 0mm = 0, 100mm+ = 100
  const rainForecastScore = Math.min(100, (weather.precipitationForecast / 90) * 100);
  factors.push({
    label: 'Previsão de Chuva (24h)',
    value: `${weather.precipitationForecast.toFixed(0)} mm`,
    weight: Math.round(rainForecastScore),
    status: weather.precipitationForecast >= 60 ? 'danger' : weather.precipitationForecast >= 30 ? 'warning' : 'favorable',
  });

  // 2. Accumulated past 24h
  const rainAccumScore = Math.min(100, (weather.precipitation / 80) * 100);
  factors.push({
    label: 'Chuva Acumulada Recente',
    value: `${weather.precipitation.toFixed(0)} mm`,
    weight: Math.round(rainAccumScore),
    status: weather.precipitation >= 50 ? 'danger' : weather.precipitation >= 25 ? 'warning' : 'favorable',
  });

  // 3. Soil moisture / saturation
  const soilMoisture = weather.soilMoisture ?? 50;
  const soilScore = Math.min(100, (soilMoisture / 95) * 100);
  factors.push({
    label: 'Saturação do Solo',
    value: `${soilMoisture}%`,
    weight: Math.round(soilScore),
    status: soilMoisture >= 80 ? 'danger' : soilMoisture >= 60 ? 'warning' : 'favorable',
  });

  // River proximity modifier
  const riverWeight = proximityToRivers === 'critica' ? 1.2 : proximityToRivers === 'moderada' ? 1.0 : 0.8;

  const rawScore = (rainForecastScore * 0.50 + rainAccumScore * 0.30 + soilScore * 0.20) * riverWeight;
  const finalScore = Math.min(100, Math.round(rawScore));

  return { score: finalScore, factors };
}

export function calculateFireRisk(
  weather: WeatherData,
  hotspotsCount: number,
  vegetationStatus: string,
  totalFRP: number
): { score: number; factors: FactorBreakdown[] } {
  const factors: FactorBreakdown[] = [];

  // 1. Temperature factor: >30 starts, 40+ max
  const tempScore = weather.temperature < 25 ? 10 : Math.min(100, ((weather.temperature - 25) / 16) * 100);
  factors.push({
    label: 'Temperatura Ambiente',
    value: `${weather.temperature.toFixed(1)}°C`,
    weight: Math.round(tempScore),
    status: weather.temperature >= 36 ? 'danger' : weather.temperature >= 31 ? 'warning' : 'favorable',
  });

  // 2. Low humidity: <30% critical
  const humScore = weather.humidity > 70 ? 5 : Math.min(100, ((70 - weather.humidity) / 55) * 100);
  factors.push({
    label: 'Déficit de Umidade',
    value: `${weather.humidity}%`,
    weight: Math.round(humScore),
    status: weather.humidity <= 22 ? 'danger' : weather.humidity <= 35 ? 'warning' : 'favorable',
  });

  // 3. Days without rain: 0 days = 0, 20+ days = 100
  const dryDaysScore = Math.min(100, (weather.daysWithoutRain / 20) * 100);
  factors.push({
    label: 'Estiagem (Dias sem Chuva)',
    value: `${weather.daysWithoutRain} dias`,
    weight: Math.round(dryDaysScore),
    status: weather.daysWithoutRain >= 14 ? 'danger' : weather.daysWithoutRain >= 7 ? 'warning' : 'favorable',
  });

  // 4. Wind speed: >25 km/h accelerates propagation
  const windScore = Math.min(100, (weather.windSpeed / 35) * 100);
  factors.push({
    label: 'Velocidade do Vento',
    value: `${weather.windSpeed.toFixed(0)} km/h`,
    weight: Math.round(windScore),
    status: weather.windSpeed >= 25 ? 'danger' : weather.windSpeed >= 16 ? 'warning' : 'favorable',
  });

  // 5. Vegetation dryness factor
  let vegScore = 20;
  if (vegetationStatus === 'muito seca') vegScore = 95;
  else if (vegetationStatus === 'seca') vegScore = 75;
  else if (vegetationStatus === 'moderada') vegScore = 45;
  factors.push({
    label: 'Biomassa e Vegetação',
    value: vegetationStatus,
    weight: vegScore,
    status: vegScore >= 70 ? 'danger' : vegScore >= 40 ? 'warning' : 'favorable',
  });

  // 6. Satellite Hotspots (anomalias térmicas)
  let hotspotBonus = 0;
  if (hotspotsCount > 0) {
    // each hotspot + FRP raises confirmed thermal anomaly presence
    hotspotBonus = Math.min(30, hotspotsCount * 8 + Math.min(15, totalFRP / 20));
  }
  factors.push({
    label: 'Focos de Calor (Satélite)',
    value: `${hotspotsCount} anomalia(s) térmicas`,
    weight: Math.round(hotspotBonus * 3.3),
    status: hotspotsCount >= 2 ? 'danger' : hotspotsCount === 1 ? 'warning' : 'favorable',
  });

  const baseMeteorologicalRisk = tempScore * 0.22 + humScore * 0.24 + dryDaysScore * 0.20 + windScore * 0.16 + vegScore * 0.18;
  const finalScore = Math.min(100, Math.round(baseMeteorologicalRisk * 0.8 + hotspotBonus));

  return { score: finalScore, factors };
}

export function classifyThreatLevel(score: number): ThreatLevel {
  if (score >= 78) return 'critico';
  if (score >= 58) return 'alto';
  if (score >= 38) return 'atencao';
  return 'baixo';
}

export function getThreatLevelColor(level: ThreatLevel): {
  bg: string;
  border: string;
  text: string;
  badge: string;
  hex: string;
  dotColor: string;
} {
  switch (level) {
    case 'critico':
      return {
        bg: 'bg-red-950/40',
        border: 'border-red-600/60',
        text: 'text-red-400',
        badge: 'bg-red-500/20 text-red-300 border-red-500/50',
        hex: '#ef4444',
        dotColor: 'bg-red-500',
      };
    case 'alto':
      return {
        bg: 'bg-amber-950/40',
        border: 'border-amber-600/60',
        text: 'text-amber-400',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-500/50',
        hex: '#f59e0b',
        dotColor: 'bg-amber-500',
      };
    case 'atencao':
      return {
        bg: 'bg-yellow-950/40',
        border: 'border-yellow-600/60',
        text: 'text-yellow-400',
        badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/50',
        hex: '#eab308',
        dotColor: 'bg-yellow-500',
      };
    case 'baixo':
    default:
      return {
        bg: 'bg-emerald-950/30',
        border: 'border-emerald-600/40',
        text: 'text-emerald-400',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        hex: '#10b981',
        dotColor: 'bg-emerald-500',
      };
  }
}

export function evaluateRegionRisk(
  weather: WeatherData,
  hotspots: Hotspot[],
  vegetationStatus: string,
  proximityToRivers: string = 'moderada'
): RiskScores {
  const totalFRP = hotspots.reduce((acc, h) => acc + h.frp, 0);

  const heat = calculateHeatRisk(weather);
  const rain = calculateRainRisk(weather, proximityToRivers);
  const fire = calculateFireRisk(weather, hotspots.length, vegetationStatus, totalFRP);

  let dominantThreat: EventType = 'calor';
  let highestScore = heat.score;

  if (rain.score > highestScore) {
    highestScore = rain.score;
    dominantThreat = 'chuva';
  }
  if (fire.score > highestScore) {
    highestScore = fire.score;
    dominantThreat = 'incendio';
  }

  const overallRisk = Math.round(highestScore * 0.75 + ((heat.score + rain.score + fire.score) / 3) * 0.25);
  const level = classifyThreatLevel(highestScore);

  return {
    heatRisk: heat.score,
    rainRisk: rain.score,
    fireRisk: fire.score,
    overallRisk,
    dominantThreat,
    level,
    factors: {
      heat: heat.factors,
      rain: rain.factors,
      fire: fire.factors,
    },
  };
}

export function calculateImpact(
  risk: RiskScores,
  population: number,
  ruralAreaRatio: number,
  proximityToRivers: 'distante' | 'moderada' | 'critica',
  proximityToResidences: 'isolado' | 'periferia' | 'centro urbano'
): ImpactAssessment {
  // Vulnerability computation
  const vulnerableRatio = 0.24; // ~24% vulnerable in general demographics
  let popMultiplier = 0.5;
  if (population > 500000) popMultiplier = 1.0;
  else if (population > 100000) popMultiplier = 0.8;
  else if (population > 30000) popMultiplier = 0.65;
  else popMultiplier = 0.45;

  let threatExposure = 0;
  if (risk.dominantThreat === 'calor') {
    // Urban centers have heat islands
    threatExposure = proximityToResidences === 'centro urbano' ? 0.9 : 0.6;
  } else if (risk.dominantThreat === 'chuva') {
    // Proximity to rivers drastically multiplies flood impact
    threatExposure = proximityToRivers === 'critica' ? 1.0 : proximityToRivers === 'moderada' ? 0.65 : 0.3;
  } else {
    // Fire: rural areas and peri-urban interfaces have high biomass and structure threat
    threatExposure = ruralAreaRatio > 50 ? 0.85 : 0.7;
  }

  const baseImpactScore = Math.min(100, Math.round(risk.overallRisk * 0.4 + (popMultiplier * 100) * 0.35 + (threatExposure * 100) * 0.25));

  const estimatedAffected = Math.round(population * (threatExposure * (risk.overallRisk / 100) * 0.18));
  const vulnerableCount = Math.round(estimatedAffected * vulnerableRatio);

  const criticalInfra = [];
  if (risk.dominantThreat === 'calor') {
    criticalInfra.push('Rede de Distribuição de Energia Elétrica (Pico de Carga)', 'Unidades Básicas de Saúde (UBS)', 'Centros Comunitários');
  } else if (risk.dominantThreat === 'chuva') {
    criticalInfra.push('Pontes e Vias Arteriais Ribeirinhas', 'Sistema de Drenagem e Galerias Pluviais', 'Estações de Bombeamento');
  } else {
    criticalInfra.push('Corredores Ecológicos e Unidades de Conservação', 'Linhas de Transmissão de Alta Tensão', 'Propriedades Rurais e Silvicultura');
  }

  const priorityScore = Math.min(100, Math.round(risk.overallRisk * 0.45 + baseImpactScore * 0.55));

  return {
    score: baseImpactScore,
    estimatedPopulationAffected: Math.max(120, estimatedAffected),
    vulnerableGroupsCount: Math.max(35, vulnerableCount),
    proximityToRivers,
    proximityToResidences,
    ruralAreaRatio,
    criticalInfrastructure: criticalInfra,
    priorityScore,
  };
}

export function generateAlertContent(
  regionName: string,
  state: string,
  risk: RiskScores,
  weather: WeatherData,
  impact: ImpactAssessment,
  hotspots: Hotspot[],
  leadTimeHours: number
): Alert {
  const threat = risk.dominantThreat;
  const level = risk.level;
  const now = new Date();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const leadTimeNotice = `Antecedência estimada de alerta: ${leadTimeHours.toFixed(1)}h antes do ápice de risco.`;

  if (threat === 'calor') {
    const isCritical = level === 'critico';
    return {
      id: `alert-heat-${Date.now()}`,
      regionId: regionName.toLowerCase().replace(/\s+/g, '-'),
      regionName,
      state,
      type: 'calor',
      severity: level,
      title: isCritical ? '☀️ ALERTA CRÍTICO DE ONDA DE CALOR EXTREMO' : '☀️ AVISO DE ATENÇÃO: CALOR INTENSO',
      headline: `Condições severas de calor e baixa umidade em ${regionName} (${state}).`,
      citizenMessage: {
        overview: `A região de ${regionName} atinge níveis elevados de estresse térmico (${weather.temperature.toFixed(0)}°C e umidade de ${weather.humidity}%). Há risco significativo de desidratação e mal-estar térmico.`,
        keyPoints: [
          `Temperatura máxima esperada: ${weather.temperature.toFixed(0)}°C`,
          `Umidade relativa do ar em patamar seco: ${weather.humidity}%`,
          `Índice de calor sob o sol: ${((weather.heatIndex ?? weather.temperature) + 3).toFixed(0)}°C`,
        ],
        recommendations: [
          '💧 Beba água com regularidade ao longo do dia, mesmo sem sentir sede.',
          '☀️ Evite exposição solar direta e exercícios físicos ao ar livre entre 10h e 16h.',
          '👥 Redobre a atenção com idosos, crianças pequenas e pessoas acamadas.',
          '🏠 Mantenha ambientes ventilados e umidifique cômodos com recipientes de água ou toalhas úmidas.',
        ],
      },
      operationalMessage: {
        technicalSummary: `Índice de risco térmico calculado em ${risk.heatRisk}/100. Pressão esperada sobre a rede básica de saúde e picos de demanda energética por climatização.`,
        meteorologicalState: `Temp: ${weather.temperature}°C | UR: ${weather.humidity}% | Vento: ${weather.windSpeed} km/h (${weather.windDirection})`,
        responseChecklist: [
          'Acionar protocolo de alerta térmico na Atenção Primária à Saúde (UBS).',
          'Instalação de pontos de hidratação e nebulização em terminais urbanos.',
          'Reforçar orientação sobre interrupção de trabalhos pesados a céu aberto.',
        ],
        priorityRating: impact.priorityScore,
      },
      createdAt: timeStr,
      leadTimeNotice,
      verifiedStatus: 'risco_preventivo',
    };
  }

  if (threat === 'chuva') {
    const isCritical = level === 'critico';
    return {
      id: `alert-rain-${Date.now()}`,
      regionId: regionName.toLowerCase().replace(/\s+/g, '-'),
      regionName,
      state,
      type: 'chuva',
      severity: level,
      title: isCritical ? '🌧️ ALERTA VERMELHO: CHUVA INTENSA E RISCO DE ENCHENTE' : '🌧️ ALERTA DE CHUVA FORTE E ALAGAMENTOS',
      headline: `Previsão de precipitação severa com solo saturado em ${regionName} (${state}).`,
      citizenMessage: {
        overview: `Previsão de volumes de chuva de até ${weather.precipitationForecast.toFixed(0)} mm nas próximas horas sobre bacias vulneráveis de ${regionName}. Risco iminente de enxurradas e transbordamento fluvial.`,
        keyPoints: [
          `Volume previsto (24h): ${weather.precipitationForecast.toFixed(0)} mm`,
          `Chuva recente acumulada: ${weather.precipitation.toFixed(0)} mm`,
          `Saturação do solo: ${weather.soilMoisture ?? 70}% (alto escoamento superficial)`,
        ],
        recommendations: [
          '⚠️ Nunca tente atravessar ruas alagadas ou pontilhões cobertos de água.',
          '🌊 Moradores próximos a encostas ou margens de rios devem buscar abrigo seguro ao primeiro sinal de elevação.',
          '⚡ Desligue aparelhos elétricos e o quadro geral caso a água ameace invadir a residência.',
          '🎒 Mantenha documentos e medicamentos em sacos plásticos impermeáveis.',
        ],
      },
      operationalMessage: {
        technicalSummary: `Risco hidrológico em ${risk.rainRisk}/100 com vulnerabilidade fluvial ${impact.proximityToRivers}. Monitoramento contínuo de réguas telemétricas e encostas instáveis.`,
        meteorologicalState: `Acum 24h: ${weather.precipitation}mm | Prev 24h: ${weather.precipitationForecast}mm | Solo: ${weather.soilMoisture}%`,
        responseChecklist: [
          'Prontidão da Defesa Civil e Corpo de Bombeiros nos pontos focais de transbordamento.',
          'Vistoria em pontes, bueiros e comportas de contenção de cheias.',
          'Preparação de ginásios e abrigos municipais emergenciais com kits de acolhimento.',
          'Disparo de alertas sonoros ou SMS georreferenciado para áreas ribeirinhas.',
        ],
        priorityRating: impact.priorityScore,
      },
      createdAt: timeStr,
      leadTimeNotice,
      verifiedStatus: 'risco_preventivo',
    };
  }

  // Incêndio / Foco de Calor
  const hasHotspots = hotspots.length > 0;
  const totalFRP = hotspots.reduce((a, b) => a + b.frp, 0);

  return {
    id: `alert-fire-${Date.now()}`,
    regionId: regionName.toLowerCase().replace(/\s+/g, '-'),
    regionName,
    state,
    type: 'incendio',
    severity: level,
    title: hasHotspots
      ? '🔥 ALERTA DE FOCO DE CALOR & PROPAGAÇÃO'
      : '🔥 AVISO METEOROLÓGICO: RISCO CRÍTICO DE INCÊNDIO',
    headline: hasHotspots
      ? `Anomalia térmica detectada por satélite em ${regionName} sob atmosfera hiper-seca.`
      : `Condições atmosféricas altamente favoráveis à ignição e propagação de fogo em ${regionName}.`,
    citizenMessage: {
      overview: hasHotspots
        ? `Os satélites de monitoramento identificaram anomalia térmica recente na região de ${regionName}. O vento moderado a forte e a vegetação ressecada facilitam a rápida propagação de focos.`
        : `A região enfrenta ${weather.daysWithoutRain} dias consecutivos sem chuva, baixa umidade (${weather.humidity}%) e ventos de ${weather.windSpeed} km/h, criando ambiente propício a queimadas.`,
      keyPoints: [
        `Focos / anomalias térmicas registradas: ${hotspots.length}`,
        `Estiagem: ${weather.daysWithoutRain} dias sem precipitação`,
        `Vento condutor: ${weather.windSpeed} km/h (Direção: ${weather.windDirection})`,
        `Status da biomassa: ${weather.temperature > 35 ? 'Extremamente inflamável' : 'Seca'}`,
      ],
      recommendations: [
        '🚫 Proibido realizar queima controlada, limpeza de pasto com fogo ou fogueiras.',
        '⚠️ Um foco de calor detectado por satélite requer verificação in loco pelas autoridades.',
        '🚗 Em rodovias com fumaça, reduza a velocidade, mantenha faróis acesos e vidros fechados.',
        '📞 Avise imediatamente o Corpo de Bombeiros (193) ou Defesa Civil (199) ao avistar fumaça densa.',
      ],
    },
    operationalMessage: {
      technicalSummary: `Índice de risco de fogo ${risk.fireRisk}/100. ${hotspots.length} foco(s) detectados por sensores orbitais (FRP total: ${totalFRP.toFixed(1)} MW). Alta taxa de propagação.`,
      meteorologicalState: `Temp: ${weather.temperature}°C | UR: ${weather.humidity}% | Vento: ${weather.windSpeed} km/h ${weather.windDirection} | Dias secos: ${weather.daysWithoutRain}`,
      firePowerMW: totalFRP,
      responseChecklist: [
        'Despachar equipe de brigadistas comunitários ou Corpo de Bombeiros para averiguação nas coordenadas do foco.',
        'Verificar imagens orbitais recentes do sensor VIIRS / GOES-16.',
        'Alertar propriedades rurais vizinhas e unidades de conservação no cone de vento.',
        'Fiscalizar uso irregular do fogo em faixas de domínio de rodovias.',
      ],
      priorityRating: impact.priorityScore,
    },
    createdAt: timeStr,
    leadTimeNotice,
    verifiedStatus: hasHotspots ? 'anomalia_detectada' : 'risco_preventivo',
  };
}
