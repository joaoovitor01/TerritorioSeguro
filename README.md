# Território Seguro — Plataforma Inteligente de Monitoramento e Alerta Climático

## 1. Visão geral

O **Território Seguro** é uma plataforma de monitoramento e alerta de eventos climáticos extremos criada para transformar dados ambientais complexos em informações simples, úteis e acionáveis para a população e para equipes responsáveis pela resposta a emergências.

A ideia central é:

> **Antes de um evento extremo causar danos, existem sinais que podem ser observados nos dados ambientais.**

O Território Seguro identifica esses sinais, analisa o nível de risco de uma região, estima o impacto potencial e transforma o resultado em alertas compreensíveis.

O projeto terá três grandes frentes:

- ☀️ **Calor extremo**
- 🌧️ **Chuvas intensas e risco de enchentes**
- 🔥 **Focos de calor e risco de incêndios**

O incêndio continua sendo um diferencial importante. Em vez de tratar o fogo apenas como um evento isolado, o sistema também analisa as condições que podem favorecer sua ocorrência e propagação, especialmente em áreas rurais e regiões com vegetação.

---

# 2. Recorte do Hackathon

## Eixo A — Alertas locais de risco

**Tema: Enchentes, calor extremo e saúde**

O Território Seguro será desenvolvido principalmente dentro do **Eixo A**, criando uma camada inteligente entre os dados ambientais e a população.

O sistema transforma:

```text
DADOS AMBIENTAIS
       ↓
TRATAMENTO
       ↓
ANÁLISE
       ↓
RISCO
       ↓
IMPACTO
       ↓
ALERTA
       ↓
POPULAÇÃO
```

A plataforma busca responder:

- Onde existe risco?
- Qual tipo de risco?
- Por que a região foi classificada dessa maneira?
- Qual pode ser o impacto?
- Quem precisa ser alertado?
- Existe tendência de aumento do risco?
- Qual informação prática deve ser transmitida?

---

# 3. Problema

Eventos climáticos extremos podem causar consequências graves para a população.

### ☀️ Calor extremo

Temperaturas muito elevadas podem aumentar a exposição da população ao calor intenso, especialmente para grupos mais vulneráveis.

Em áreas rurais e regiões com vegetação seca, temperaturas elevadas combinadas com baixa umidade e longos períodos sem chuva também podem contribuir para condições favoráveis à ocorrência e propagação de incêndios.

### 🌧️ Chuvas extremas

Chuvas intensas em curto período podem provocar alagamentos, enchentes, transbordamento de rios e interrupções de serviços.

### 🔥 Incêndios

Focos de calor detectados por satélite podem indicar uma anomalia térmica que merece investigação. Quando essa informação é cruzada com temperatura, umidade, precipitação, vento, vegetação e histórico, é possível construir uma avaliação mais contextualizada do risco.

O problema central é:

> **Os dados existem, mas precisam ser transformados em informação compreensível e acionável.**

---

# 4. Problema que o Território Seguro pretende solucionar

> **Como transformar grandes volumes de dados meteorológicos, ambientais e de satélite em alertas locais, claros e úteis para a população antes ou durante eventos climáticos extremos?**

O Território Seguro reduz a distância entre:

**dados → interpretação → decisão → alerta.**

Em vez de interpretar dezenas de indicadores, o usuário recebe:

- nível de risco;
- tipo de evento;
- localização;
- principais fatores;
- impacto potencial;
- evolução do risco;
- alerta correspondente.

---

# 5. Objetivo

## Objetivo geral

Desenvolver uma plataforma capaz de **monitorar condições ambientais, identificar regiões sob risco de eventos extremos, estimar seu impacto e transformar os resultados em alertas locais para a população**.

## Objetivos específicos

1. Coletar dados meteorológicos, ambientais e de satélite.
2. Processar e padronizar diferentes fontes.
3. Relacionar os dados a regiões geográficas.
4. Criar indicadores de risco.
5. Identificar condições favoráveis a calor extremo.
6. Identificar condições associadas a chuvas intensas e risco de enchentes.
7. Detectar e contextualizar focos de calor.
8. Avaliar condições ambientais relacionadas ao risco de incêndio.
9. Estimar o impacto potencial.
10. Criar um mapa de risco.
11. Gerar alertas locais.
12. Explicar de forma simples o motivo de cada alerta.
13. Acompanhar a evolução do risco.

---

# 6. Diferencial

O diferencial não é simplesmente possuir dados meteorológicos. O diferencial é **cruzar essas informações e transformá-las em uma camada de inteligência e comunicação**.

Dados isolados:

```text
Temperatura: 39°C
Umidade: 21%
Dias sem chuva: 14
Vento: 25 km/h
Foco de calor: 1
Vegetação: seca
```

O Território Seguro transforma isso em:

```text
🔥 RISCO DE INCÊNDIO: ELEVADO

Principais fatores:
• temperatura elevada
• baixa umidade
• período prolongado sem chuva
• vegetação seca
• foco de calor detectado

Área de atenção:
Região X

Impacto potencial:
ALTO
```

O sistema transforma **números em contexto**.

---

# 7. Risco e impacto

O Território Seguro separa duas perguntas.

## Risco

> **Quão favoráveis estão as condições para determinado evento ocorrer?**

Exemplo:

```text
Temperatura ↑
Umidade ↓
Chuva ↓
Vento ↑
Vegetação seca ↑
        ↓
Risco de incêndio ↑
```

## Impacto

> **Se o evento ocorrer, quais podem ser suas consequências naquela região?**

Podem ser considerados:

- população potencialmente afetada;
- proximidade de áreas residenciais;
- infraestrutura;
- proximidade de rios;
- uso e ocupação do solo;
- áreas rurais;
- vegetação;
- histórico de ocorrências;
- vulnerabilidade da região.

Assim, o sistema diferencia uma região de alto risco com baixo impacto potencial de outra com risco semelhante e grande quantidade de pessoas potencialmente afetadas.

---

# 8. Tipos de risco

## 8.1 Calor extremo

Indicadores:

- temperatura;
- umidade relativa;
- duração do período quente;
- previsão de temperatura;
- histórico climático;
- índice de calor, quando disponível.

Classificação inicial:

```text
🟢 Baixo
🟡 Atenção
🟠 Alto
🔴 Crítico
```

## 8.2 Chuva extrema / enchente

O Território Seguro possui um **módulo dedicado de enchentes e alagamentos**, onde o usuário pode identificar exatamente **onde a enchente está acontecendo em tempo real** e **onde pode ocorrer nas próximas horas** com base nas condições climáticas.

### 📍 Localização por Granularidade Fina:
- **Região**: Estado ou Bacia Hidrográfica (ex: Região Metropolitana de SP, Vale do Itajaí/SC, Bacia do Guaíba/RS, Região Serrana/RJ).
- **Cidade**: Município monitorado (ex: São Paulo, Blumenau, Porto Alegre, Franco da Rocha, Petrópolis).
- **Bairro / Ponto Crítico**: Bairro específico ou micro-região afetada (ex: Vila Prudente, Sarandi, Itoupava Norte, Alto da Serra).

### 🔍 Duas Frentes de Identificação:

1. **Onde ESTÁ tendo enchente/alagamento (Ocorrências Ativas em Tempo Real)**:
   - Identificação imediata de vias alagadas, rios/córregos transbordados e áreas de várzea inundadas.
   - Status dos pontos: 🔴 *Enchente / Alagamento Ativo* (Água acima da cota de emergência, vias interditadas).

2. **Onde PODE OCORRER enchente (Previsão e Modelagem de Risco Climático)**:
   - Estimativa antecipada baseada em dados meteorológicos e topográficos antes que o transbordamento aconteça.
   - Cruzamento de variáveis climáticas:
     - **Precipitação acumulada**: chuva registrada nas últimas 24h e 72h.
     - **Previsão de chuva torrencial**: volume em mm nas próximas 3h a 12h (frentes frias, tempestades convectivas).
     - **Cota de rios e córregos**: monitoramento do nível do rio em relação à cota de emergência.
     - **Saturação do solo (%)**: capacidade de absorção do solo encharcado.
     - **Drenagem e relevo local**: áreas de várzea, fundo de vale e microbacias urbanas.

### Status e Alertas de Enchente para o Usuário:
```text
🔴 Enchente / Alagamento Ativo   → Transbordamento confirmado / Vias cobertas por água
🟠 Alerta Vermelho (Risco Iminente) → Chuva extrema prevista + Solo 90%+ saturado
🟡 Risco Moderado de Alagamento  → Acúmulo significativo com atenção a pontos céticos
🟢 Situação Normal               → Fluxo pluvial normalizado
```

## 8.3 Incêndio

Indicadores:

- temperatura;
- umidade;
- precipitação;
- dias sem chuva;
- vento;
- condição da vegetação;
- histórico;
- focos de calor detectados por satélite.

Exemplo:

```text
Temperatura       → 38°C
Umidade           → 22%
Dias sem chuva    → 15
Vento             → 28 km/h
Vegetação         → seca
Foco de calor     → detectado

             ↓

🔥 RISCO DE INCÊNDIO: ALTO
```

### Importante

Um **foco de calor detectado por satélite não deve ser tratado automaticamente como incêndio confirmado**.

O sistema deve utilizar termos como:

- foco de calor;
- anomalia térmica;
- possível ocorrência;
- ocorrência que necessita de verificação.

---

# 9. Arquitetura geral

```text
                   FONTES DE DADOS
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   Meteorologia       Satélites       Histórico
        │                │                │
        └────────────────┼────────────────┘
                         ↓
                 INGESTÃO DE DADOS
                         ↓
                  TRATAMENTO/LIMPEZA
                         ↓
                 PADRONIZAÇÃO GEO
                         ↓
                 BANCO DE DADOS
                         ↓
                 MOTOR DE ANÁLISE
                         ↓
              ┌──────────┼──────────┐
              ↓          ↓          ↓
           CALOR       CHUVA      INCÊNDIO
              │          │          │
              └──────────┼──────────┘
                         ↓
                   CÁLCULO DE RISCO
                         ↓
                  ANÁLISE DE IMPACTO
                         ↓
                    MAPA DE RISCO
                         ↓
                     ALERTA LOCAL
                         ↓
                      POPULAÇÃO
```

---

# 10. Como os dados serão obtidos

O projeto não precisa construir infraestrutura própria de satélite. A estratégia é integrar fontes públicas.

## NASA FIRMS

O **NASA FIRMS — Fire Information for Resource Management System** disponibiliza dados de detecção de focos de calor por satélite e possui API.

Informações disponíveis incluem:

- latitude;
- longitude;
- data;
- horário;
- satélite;
- confiança;
- FRP;
- entre outras.

Fonte oficial:

https://firms.modaps.eosdis.nasa.gov/api/

O acesso à API utiliza uma chave gratuita (`MAP_KEY`).

## Programa Queimadas — INPE

O **Programa Queimadas do INPE** é uma fonte importante para o contexto brasileiro.

Entre os dados disponíveis estão:

- data/hora;
- satélite;
- estado;
- município;
- bioma;
- dias sem chuva;
- precipitação;
- risco de fogo;
- latitude;
- longitude;
- FRP.

Fonte oficial:

https://terrabrasilis.dpi.inpe.br/queimadas/portal/

O histórico permite analisar padrões passados e testar o comportamento do modelo.

## Dados meteorológicos

Além dos satélites, será utilizada uma fonte meteorológica com:

- temperatura;
- umidade;
- precipitação;
- velocidade e direção do vento;
- previsão;
- outros indicadores relevantes.

A fonte definitiva será escolhida considerando cobertura do Brasil, atualização, limites de uso e facilidade de integração.

---

# 11. Pipeline de dados

## Etapa 1 — Coleta

As APIs/fontes públicas são consultadas periodicamente.

```text
NASA FIRMS
     ↓
API
     ↓
Python
```

e:

```text
Fonte meteorológica
     ↓
API
     ↓
Python
```

## Etapa 2 — Tratamento

Os dados são limpos e padronizados.

Exemplos:

- remover registros inválidos;
- padronizar unidades;
- padronizar datas;
- remover duplicidades;
- tratar valores ausentes;
- verificar valores fora do esperado.

Exemplo:

```text
Temperatura = 500°C
```

deve ser identificado como possível problema de dado antes de entrar no modelo.

## Etapa 3 — Validação

```text
DADO RECEBIDO
      ↓
É válido?
   ↙     ↘
 NÃO      SIM
 ↓         ↓
descartar  continuar
```

## Etapa 4 — Geolocalização

```text
Latitude + Longitude
        ↓
Município
        ↓
Estado
        ↓
Bioma / região
        ↓
Área monitorada
```

## Etapa 5 — Cruzamento

```text
Meteorologia
      +
Satélite
      +
Histórico
      +
Geografia
      ↓
CONTEXTO DA REGIÃO
```

---

# 12. Motor de risco

O MVP pode começar com um **modelo de pontuação transparente**, antes de utilizar Machine Learning.

Cada variável pode ser normalizada em uma escala de 0 a 100.

Exemplo experimental:

```text
Temperatura      80
Umidade          90
Precipitação     85
Vento            70
Vegetação        80
Histórico        75
```

Resultado:

```text
Risco = 82/100

🔴 RISCO CRÍTICO
```

Os pesos iniciais são parâmetros do protótipo, não classificações oficiais. Eles deverão ser calibrados e validados com dados históricos.

---

# 13. Previsão de risco

O objetivo não é apenas identificar o que está acontecendo agora.

O sistema deverá acompanhar a evolução:

```text
08:00 → Risco 42
10:00 → Risco 55
12:00 → Risco 67
14:00 → Risco 81
```

Resultado:

```text
⚠️ TENDÊNCIA DE AUMENTO DO RISCO
```

Posteriormente, modelos de Machine Learning poderão aprender padrões históricos para estimar risco futuro.

Possíveis modelos:

- Random Forest;
- XGBoost;
- regressão logística;
- outros modelos adequados aos dados.

A validação deverá respeitar a ordem temporal para evitar vazamento de informação do futuro.

---

# 14. Sistema de alertas

O Território Seguro não deve simplesmente mostrar:

> “Risco 84.”

Ele deve transformar a classificação em uma mensagem clara.

### Calor

```text
☀️ ALERTA DE CALOR EXTREMO

Sua região apresenta condições de calor elevado.

Temperatura prevista: 39°C
Umidade: 23%

⚠️ Evite exposição prolongada ao calor.
💧 Mantenha hidratação.
👥 Atenção especial a pessoas mais vulneráveis.
```

### Chuva

```text
🌧️ ALERTA DE CHUVA INTENSA

Existe previsão de chuva intensa para sua região.

Precipitação prevista: 80 mm

⚠️ Evite áreas sujeitas a alagamento.
🌊 Atenção a regiões próximas a rios.
```

### Incêndio

```text
🔥 ALERTA DE FOCO DE CALOR

Foi detectada uma anomalia térmica próxima à sua região.

Condições ambientais:
• temperatura elevada
• baixa umidade
• período sem chuva
• vegetação seca

⚠️ A ocorrência necessita de verificação.
```

---

# 15. Público prioritário

Dependendo do evento, o sistema pode priorizar:

- moradores da área afetada;
- comunidades rurais;
- pessoas em áreas de risco;
- idosos;
- crianças;
- pessoas mais vulneráveis ao calor;
- equipes de emergência;
- Defesa Civil;
- órgãos municipais responsáveis.

O objetivo é que o alerta seja **relevante para quem recebe**.

---

# 16. Interface

A interface principal possui navegação simplificada por módulos temáticos (Incêndios, Enchentes e Calor Extremo), permitindo ao usuário alternar entre o mapa global de queimadas e a visualização detalhada de riscos climáticos.

## 🌊 Módulo Dedicado de Enchentes & Alagamentos

Nesta aba dedicada, o usuário conta com um sistema de **busca e filtro por Região, Cidade e Bairro**:

```text
🔍 FILTROS DE CONSULTA:
[ Selecionar Região ▾ ]  [ Selecionar Cidade ▾ ]  [ Pesquisar Bairro / Rua... ]

Status exibido ao selecionar o Bairro:
────────────────────────────────────────────────────────
📍 BAIRRO / LOCALIDADE: Vila Prudente (Córrego da Mooca) - São Paulo/SP
STATUS: 🔴 ALAGAMENTO ATIVO (Transbordamento de Córrego)

📊 DADOS CLIMÁTICOS & HIDROLÓGICOS DA LOCALIDADE:
• Chuva Acumulada (24h):  112 mm
• Previsão (Próx. 6h):    45 mm (Tempestade Convectiva)
• Nível do Córrego:       4.8 m (Cota de Emergência: 4.2 m - Transbordado)
• Saturação do Solo:      98% (Capacidade máxima atingida)

⚠️ ALERTA LOCAL: Vias intransitáveis na Av. Anhaia Mello.
🛡️ RECOMENDAÇÃO: Evitar deslocamento pela baixada e buscar vias elevadas.
────────────────────────────────────────────────────────
```

### Painel Geral do Mapa Interativo:

```text
🟢 Baixo
🟡 Atenção
🟠 Alto
🔴 Crítico
```

Ao selecionar uma região:

```text
REGIÃO / LOCALIDADE
───────────────

☀️ Calor Extremo
82/100

🌧️ Enchente / Alagamento
95/100 (🔴 Ativo)

🔥 Incêndio
91/100

IMPACTO POTENCIAL
84/100

───────────────

PRINCIPAIS FATORES

Chuva 24h: 112 mm
Previsão: 45 mm
Nível do Rio: 4.8 m (Transbordado)
Solo: 98% saturado
Focos: 1


───────────────

⚠️ ALERTA ATIVO
```

---

# 17. Banco de dados

Estrutura inicial:

## `regions`

```text
id
name
state
latitude
longitude
geometry
```

## `weather_data`

```text
id
region_id
timestamp
temperature
humidity
precipitation
wind_speed
wind_direction
```

## `satellite_hotspots`

```text
id
latitude
longitude
timestamp
satellite
confidence
frp
source
```

## `risk_scores`

```text
id
region_id
timestamp
heat_risk
rain_risk
fire_risk
impact_score
priority_score
```

## `alerts`

```text
id
region_id
type
severity
message
created_at
expires_at
status
```

## `preventive_actions`

```text
id
risk_type
severity
action
target_audience
```

---

# 18. Tecnologias

### Backend

- Python
- FastAPI

### Dados

- Pandas
- NumPy
- GeoPandas

### Banco

- PostgreSQL
- PostGIS

### Machine Learning

- scikit-learn
- XGBoost, se necessário

### Frontend

- React
- JavaScript ou TypeScript

### Mapas

- Leaflet
- MapLibre

### Fontes de dados

- NASA FIRMS
- INPE / Programa Queimadas
- API meteorológica escolhida para o MVP

---

# 19. Fluxo técnico

```text
                 ┌─────────────────┐
                 │ NASA FIRMS      │
                 └────────┬────────┘
                          │
                 ┌─────────────────┐
                 │ INPE            │
                 └────────┬────────┘
                          │
                 ┌─────────────────┐
                 │ API Meteorológica│
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ Python          │
                 │ Coleta          │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Tratamento      │
                 │ Limpeza         │
                 │ Padronização    │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ PostgreSQL      │
                 │ + PostGIS       │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Motor de Risco  │
                 └────────┬────────┘
                          ▼
             ┌────────────┼────────────┐
             ▼            ▼            ▼
          ☀️ Calor      🌧️ Chuva      🔥 Fogo
             │            │            │
             └────────────┼────────────┘
                          ▼
                 ┌─────────────────┐
                 │ Impacto         │
                 │ + Prioridade    │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Dashboard       │
                 │ + Mapa          │
                 └────────┬────────┘
                          ▼
                 ┌─────────────────┐
                 │ Sistema de      │
                 │ Alertas         │
                 └────────┬────────┘
                          ▼
                      POPULAÇÃO
```

---

# 20. Estratégia de desenvolvimento do MVP

O projeto deve ser desenvolvido por etapas.

## Fase 1 — Dados reais

Integrar:

1. fonte de focos de calor;
2. fonte meteorológica;
3. dados geográficos básicos.

**Objetivo:** visualizar dados reais no mapa.

## Fase 2 — Motor de risco

Criar:

- risco de calor;
- risco de chuva;
- risco de incêndio.

**Objetivo:** transformar dados em classificação compreensível.

## Fase 3 — Mapa

Mostrar:

- regiões;
- níveis de risco;
- focos de calor;
- alertas.

**Objetivo:** identificar rapidamente onde existe risco.

## Fase 4 — Alertas

Criar mensagens automáticas.

**Objetivo:** transformar análise em ação.

## Fase 5 — Impacto

Adicionar:

- população;
- infraestrutura;
- vulnerabilidade;
- proximidade de áreas críticas.

**Objetivo:** diferenciar risco de impacto.

## Fase 6 — Previsão

Adicionar análise temporal e, posteriormente, Machine Learning.

**Objetivo:** identificar tendências de aumento do risco.

---

# 21. Exemplo de funcionamento

Imagine uma região rural:

```text
Temperatura: 39°C
Umidade: 21%
Precipitação: 0 mm
Dias sem chuva: 16
Vento: 27 km/h
Vegetação: seca
Foco de calor: detectado
```

O sistema trata e valida os dados.

Depois cruza as informações.

Resultado:

```text
Calor extremo       → ALTO
Risco de incêndio   → ALTO
Impacto potencial   → ALTO
```

A região aparece em vermelho no mapa:

```text
🔴
```

E o sistema gera:

> 🔥 **ALERTA DE RISCO ELEVADO DE INCÊNDIO**
>
> Foi detectado um foco de calor em uma região com temperatura elevada, baixa umidade e período prolongado sem chuva.
>
> A ocorrência deve ser verificada.

A população próxima recebe uma mensagem apropriada, enquanto uma equipe responsável pode receber informações mais técnicas.

---

# 22. Limitações e cuidados

### Previsão não é certeza

O sistema trabalha com risco e estimativas.

### Foco de calor não é incêndio confirmado

Dados de satélite indicam anomalias térmicas que precisam ser contextualizadas e, quando necessário, verificadas.

### Pesos iniciais são experimentais

Os pesos do protótipo precisam ser calibrados e validados posteriormente.

### Alertas reais exigem integração institucional

No hackathon, os alertas podem ser demonstrados de forma simulada. Uma implementação real precisaria de protocolos e integração com órgãos responsáveis.

### O modelo precisa ser validado

Devem ser avaliados:

- precisão;
- recall;
- falsos positivos;
- falsos negativos;
- antecedência do alerta;
- desempenho por região e período.

---

# 23. Métrica de valor

Uma pergunta central para avaliar o Território Seguro será:

> **O sistema conseguiu identificar condições de risco antes de um evento ou antes de seu agravamento?**

Por isso, além da precisão, será importante medir a **antecedência do alerta**.

Exemplo:

```text
Evento observado:
18:00

Risco elevado identificado:
14:00

Antecedência:
4 horas
```

Isso ajuda a demonstrar o valor da antecipação.

---

# 24. Pitch

> **“Um evento extremo não começa quando o problema aparece. Antes dele, existem sinais.”**
>
> O Território Seguro é uma plataforma inteligente de monitoramento e alerta climático que transforma dados meteorológicos, ambientais e de satélite em informações que podem ser compreendidas e utilizadas pela população.
>
> Monitoramos três frentes principais: calor extremo, chuvas intensas e risco de incêndios.
>
> O sistema coleta dados de diferentes fontes, trata essas informações, relaciona os dados com regiões geográficas e calcula níveis de risco e impacto.
>
> Quando uma região apresenta condições preocupantes, o Território Seguro transforma essa análise em um alerta simples, indicando o que está acontecendo, onde está acontecendo e quem precisa ficar atento.
>
> No caso dos incêndios, o sistema combina temperatura, umidade, chuva, vento, vegetação, histórico e focos de calor detectados por satélite para contextualizar o risco.
>
> Dessa forma, o Território Seguro não espera apenas o desastre acontecer.
>
> **Ele busca identificar os sinais, antecipar o risco e transformar dados em tempo de reação.**

---

# 25. Frase central

> ## **Território Seguro — Transformando dados ambientais em tempo para agir.**

---

# 26. Resumo da solução

```text
                 FIREWATCH

      MONITORAMENTO CLIMÁTICO
                  │
       ┌──────────┼──────────┐
       │          │          │
      ☀️         🌧️         🔥
     Calor      Chuva      Fogo
       │          │          │
       └──────────┼──────────┘
                  ↓
          DADOS AMBIENTAIS
                  ↓
             TRATAMENTO
                  ↓
              ANÁLISE
                  ↓
        ┌─────────┴─────────┐
        ↓                   ↓
      RISCO              IMPACTO
        └─────────┬─────────┘
                  ↓
              PRIORIDADE
                  ↓
              ALERTA
                  ↓
              POPULAÇÃO
```

## Missão

**Transformar dados ambientais complexos em informações simples, contextualizadas e acionáveis para ajudar comunidades a se prepararem para eventos climáticos extremos.**
