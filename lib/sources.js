const CDC_NNDSS_URL = 'https://data.cdc.gov/resource/x9gk-5huc.json';
const HANTAFLOW_URL = 'https://hantaflow.com/api/signals.json';
const WHO_DON_URL = 'https://www.who.int/api/news/diseaseoutbreaknews';

const US_JURISDICTIONS = new Set([
  'ALABAMA','ALASKA','ARIZONA','ARKANSAS','CALIFORNIA','COLORADO','CONNECTICUT','DELAWARE',
  'DISTRICT OF COLUMBIA','FLORIDA','GEORGIA','HAWAII','IDAHO','ILLINOIS','INDIANA','IOWA',
  'KANSAS','KENTUCKY','LOUISIANA','MAINE','MARYLAND','MASSACHUSETTS','MICHIGAN','MINNESOTA',
  'MISSISSIPPI','MISSOURI','MONTANA','NEBRASKA','NEVADA','NEW HAMPSHIRE','NEW JERSEY',
  'NEW MEXICO','NEW YORK','NEW YORK CITY','NORTH CAROLINA','NORTH DAKOTA','OHIO','OKLAHOMA',
  'OREGON','PENNSYLVANIA','RHODE ISLAND','SOUTH CAROLINA','SOUTH DAKOTA','TENNESSEE','TEXAS',
  'UTAH','VERMONT','VIRGINIA','WASHINGTON','WEST VIRGINIA','WISCONSIN','WYOMING'
]);

const COUNTRY_META = {
  AR: { name: 'Argentina', lat: -38.42, lon: -63.62, region: 'Americhe' },
  AT: { name: 'Austria', lat: 47.52, lon: 14.55, region: 'Europa' },
  AU: { name: 'Australia', lat: -25.27, lon: 133.78, region: 'Asia-Pacifico' },
  BE: { name: 'Belgio', lat: 50.50, lon: 4.47, region: 'Europa' },
  BG: { name: 'Bulgaria', lat: 42.73, lon: 25.49, region: 'Europa' },
  BO: { name: 'Bolivia', lat: -16.29, lon: -63.59, region: 'Americhe' },
  BR: { name: 'Brasile', lat: -14.24, lon: -51.93, region: 'Americhe' },
  CA: { name: 'Canada', lat: 56.13, lon: -106.35, region: 'Americhe' },
  CH: { name: 'Svizzera', lat: 46.82, lon: 8.23, region: 'Europa' },
  CL: { name: 'Cile', lat: -35.68, lon: -71.54, region: 'Americhe' },
  CN: { name: 'Cina', lat: 35.86, lon: 104.20, region: 'Asia-Pacifico' },
  CO: { name: 'Colombia', lat: 4.57, lon: -74.30, region: 'Americhe' },
  CV: { name: 'Capo Verde', lat: 16.00, lon: -24.01, region: 'Africa' },
  CY: { name: 'Cipro', lat: 35.13, lon: 33.43, region: 'Europa' },
  CZ: { name: 'Cechia', lat: 49.82, lon: 15.47, region: 'Europa' },
  DE: { name: 'Germania', lat: 51.17, lon: 10.45, region: 'Europa' },
  DK: { name: 'Danimarca', lat: 56.26, lon: 9.50, region: 'Europa' },
  EE: { name: 'Estonia', lat: 58.60, lon: 25.01, region: 'Europa' },
  ES: { name: 'Spagna', lat: 40.46, lon: -3.75, region: 'Europa' },
  FI: { name: 'Finlandia', lat: 61.92, lon: 25.75, region: 'Europa' },
  FR: { name: 'Francia', lat: 46.23, lon: 2.21, region: 'Europa' },
  GB: { name: 'Regno Unito', lat: 55.38, lon: -3.44, region: 'Europa' },
  GR: { name: 'Grecia', lat: 39.07, lon: 21.82, region: 'Europa' },
  HR: { name: 'Croazia', lat: 45.10, lon: 15.20, region: 'Europa' },
  HU: { name: 'Ungheria', lat: 47.16, lon: 19.50, region: 'Europa' },
  IE: { name: 'Irlanda', lat: 53.14, lon: -7.69, region: 'Europa' },
  IS: { name: 'Islanda', lat: 64.96, lon: -19.02, region: 'Europa' },
  IT: { name: 'Italia', lat: 41.87, lon: 12.57, region: 'Europa' },
  JP: { name: 'Giappone', lat: 36.20, lon: 138.25, region: 'Asia-Pacifico' },
  KR: { name: 'Corea del Sud', lat: 35.91, lon: 127.77, region: 'Asia-Pacifico' },
  LI: { name: 'Liechtenstein', lat: 47.17, lon: 9.56, region: 'Europa' },
  LT: { name: 'Lituania', lat: 55.17, lon: 23.88, region: 'Europa' },
  LU: { name: 'Lussemburgo', lat: 49.82, lon: 6.13, region: 'Europa' },
  LV: { name: 'Lettonia', lat: 56.88, lon: 24.60, region: 'Europa' },
  MT: { name: 'Malta', lat: 35.94, lon: 14.38, region: 'Europa' },
  MX: { name: 'Messico', lat: 23.63, lon: -102.55, region: 'Americhe' },
  NL: { name: 'Paesi Bassi', lat: 52.13, lon: 5.29, region: 'Europa' },
  NO: { name: 'Norvegia', lat: 60.47, lon: 8.47, region: 'Europa' },
  NZ: { name: 'Nuova Zelanda', lat: -40.90, lon: 174.89, region: 'Asia-Pacifico' },
  PA: { name: 'Panama', lat: 8.54, lon: -80.78, region: 'Americhe' },
  PE: { name: 'Perù', lat: -9.19, lon: -75.02, region: 'Americhe' },
  PL: { name: 'Polonia', lat: 51.92, lon: 19.15, region: 'Europa' },
  PT: { name: 'Portogallo', lat: 39.40, lon: -8.22, region: 'Europa' },
  PY: { name: 'Paraguay', lat: -23.44, lon: -58.44, region: 'Americhe' },
  RO: { name: 'Romania', lat: 45.94, lon: 24.97, region: 'Europa' },
  RS: { name: 'Serbia', lat: 44.02, lon: 21.01, region: 'Europa' },
  RU: { name: 'Russia', lat: 61.52, lon: 105.32, region: 'Europa' },
  SE: { name: 'Svezia', lat: 60.13, lon: 18.64, region: 'Europa' },
  SI: { name: 'Slovenia', lat: 46.15, lon: 14.99, region: 'Europa' },
  SK: { name: 'Slovacchia', lat: 48.67, lon: 19.70, region: 'Europa' },
  TR: { name: 'Turchia', lat: 38.96, lon: 35.24, region: 'Europa' },
  TW: { name: 'Taiwan', lat: 23.70, lon: 120.96, region: 'Asia-Pacifico' },
  UA: { name: 'Ucraina', lat: 48.38, lon: 31.17, region: 'Europa' },
  US: { name: 'Stati Uniti', lat: 39.83, lon: -98.58, region: 'Americhe' },
  UY: { name: 'Uruguay', lat: -32.52, lon: -55.77, region: 'Americhe' },
  VE: { name: 'Venezuela', lat: 6.42, lon: -66.59, region: 'Americhe' },
  ZA: { name: 'Sudafrica', lat: -30.56, lon: 22.94, region: 'Africa' }
};

const COUNTRY_ALIASES = [
  ['US', ['united states', 'usa', 'u.s.', 'america', 'american', 'california', 'nebraska', 'oregon', 'illinois', 'new mexico', 'utah', 'maryland', 'minnesota', 'new jersey', 'kansas']],
  ['GB', ['united kingdom', 'uk', 'britain', 'british', 'england', 'scotland', 'wales']],
  ['AR', ['argentina', 'andes virus', 'andv', 'ushuaia', 'patagonia']],
  ['ES', ['spain', 'spanish', 'tenerife', 'canary islands', 'canarie', 'granadilla']],
  ['IT', ['italy', 'italian', 'italia', 'milano', 'milan']],
  ['FR', ['france', 'french', 'francia', 'paris']],
  ['NL', ['netherlands', 'dutch', 'paesi bassi', 'olanda', 'rotterdam']],
  ['CV', ['cabo verde', 'cape verde', 'capo verde']],
  ['IE', ['ireland', 'irish', 'irlanda']],
  ['DE', ['germany', 'german', 'germania']],
  ['CH', ['switzerland', 'swiss', 'zurich', 'svizzera']],
  ['AU', ['australia', 'australian']],
  ['ZA', ['south africa', 'south african', 'johannesburg', 'sudafrica']],
  ['RU', ['russia', 'russian']],
  ['TR', ['turkey', 'turkish', 'turchia']],
  ['MX', ['mexico', 'mexican', 'messico']],
  ['CL', ['chile', 'chilean', 'cile']],
  ['BR', ['brazil', 'brasil', 'brasile']],
  ['BO', ['bolivia', 'bolivian']],
  ['PY', ['paraguay']],
  ['UY', ['uruguay']],
  ['CA', ['canada', 'canadian']],
  ['CN', ['china', 'chinese', 'cina']],
  ['JP', ['japan', 'japanese', 'giappone']],
  ['KR', ['korea', 'korean', 'corea']],
  ['TW', ['taiwan', 'taipei']],
  ['FI', ['finland', 'finnish', 'finlandia']],
  ['SE', ['sweden', 'swedish', 'svezia']],
  ['NO', ['norway', 'norwegian', 'norvegia']],
  ['AT', ['austria', 'austrian']],
  ['BE', ['belgium', 'belgio']],
  ['BG', ['bulgaria', 'bulgarian']],
  ['PL', ['poland', 'polish', 'polonia']],
  ['RO', ['romania', 'romanian']],
  ['RS', ['serbia', 'serbian']],
  ['SI', ['slovenia', 'slovenian']],
  ['SK', ['slovakia', 'slovak']],
  ['CZ', ['czech', 'czechia', 'cechia']],
  ['HR', ['croatia', 'croazia']],
  ['HU', ['hungary', 'hungarian', 'ungheria']],
  ['GR', ['greece', 'greek', 'grecia']],
  ['PT', ['portugal', 'portuguese', 'portogallo']],
  ['DK', ['denmark', 'danish', 'danimarca']],
  ['LT', ['lithuania', 'lituania']],
  ['LV', ['latvia', 'lettonia']],
  ['EE', ['estonia']]
];

const ECDC_EU_2023 = [
  { iso: 'AT', country: 'Austria', cases: 97, rate: 1.1, status: 'reported' },
  { iso: 'BE', country: 'Belgio', cases: 99, rate: null, status: 'reported_rate_not_calculated' },
  { iso: 'BG', country: 'Bulgaria', cases: 6, rate: 0.1, status: 'reported' },
  { iso: 'HR', country: 'Croazia', cases: 2, rate: 0.1, status: 'reported' },
  { iso: 'CY', country: 'Cipro', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'CZ', country: 'Cechia', cases: 11, rate: 0.1, status: 'reported' },
  { iso: 'DK', country: 'Danimarca', cases: null, rate: null, status: 'no_data_reported' },
  { iso: 'EE', country: 'Estonia', cases: 19, rate: 1.4, status: 'reported' },
  { iso: 'FI', country: 'Finlandia', cases: 806, rate: 14.5, status: 'reported' },
  { iso: 'FR', country: 'Francia', cases: 50, rate: 0.1, status: 'reported' },
  { iso: 'DE', country: 'Germania', cases: 335, rate: 0.4, status: 'reported' },
  { iso: 'GR', country: 'Grecia', cases: 1, rate: 0.0, status: 'reported' },
  { iso: 'HU', country: 'Ungheria', cases: 11, rate: 0.1, status: 'reported' },
  { iso: 'IS', country: 'Islanda', cases: null, rate: null, status: 'no_data_reported' },
  { iso: 'IE', country: 'Irlanda', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'IT', country: 'Italia', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'LV', country: 'Lettonia', cases: 4, rate: 0.2, status: 'reported' },
  { iso: 'LI', country: 'Liechtenstein', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'LT', country: 'Lituania', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'LU', country: 'Lussemburgo', cases: 5, rate: 0.8, status: 'reported' },
  { iso: 'MT', country: 'Malta', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'NL', country: 'Paesi Bassi', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'NO', country: 'Norvegia', cases: 15, rate: 0.3, status: 'reported' },
  { iso: 'PL', country: 'Polonia', cases: 43, rate: 0.1, status: 'reported' },
  { iso: 'PT', country: 'Portogallo', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'RO', country: 'Romania', cases: 6, rate: 0.0, status: 'reported' },
  { iso: 'SK', country: 'Slovacchia', cases: 154, rate: 2.8, status: 'reported' },
  { iso: 'SI', country: 'Slovenia', cases: 64, rate: 3.0, status: 'reported' },
  { iso: 'ES', country: 'Spagna', cases: 0, rate: 0.0, status: 'reported' },
  { iso: 'SE', country: 'Svezia', cases: 157, rate: 1.5, status: 'reported' }
];

const CURRENT_OFFICIAL_EVENTS = [
  {
    id: 'mv-hondius-andes-2026',
    title: 'Cluster Andes hantavirus collegato alla nave MV Hondius',
    disease: 'Andes virus',
    scope: 'Multi-country',
    status: 'In monitoraggio',
    asOf: '2026-05-13',
    source: 'ECDC',
    casesTotal: 11,
    confirmed: 8,
    probable: 2,
    inconclusive: 1,
    deaths: 3,
    riskEurope: 'Molto basso per la popolazione generale',
    riskGlobal: 'Basso secondo WHO per la popolazione generale',
    summary: 'Evento multi-paese collegato a viaggio su nave da crociera. I dati evento sono separati dalla sorveglianza annuale.',
    sourceUrl: 'https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak',
    locations: [
      { iso: 'ES', role: 'Porto di arrivo e risposta sanitaria, Tenerife' },
      { iso: 'NL', role: 'Nave battente bandiera olandese e pazienti trasferiti' },
      { iso: 'ZA', role: 'Paziente ospedalizzato secondo WHO' },
      { iso: 'CH', role: 'Paziente ospedalizzato secondo WHO' },
      { iso: 'CV', role: 'Tappa/evacuazioni mediche' },
      { iso: 'AR', role: 'Porto di partenza del viaggio' },
      { iso: 'GB', role: 'Notifica IHR iniziale menzionata da WHO/CDC' },
      { iso: 'DE', role: 'Test successivi su precedente caso sospetto' }
    ],
    timeline: [
      {
        date: '2026-05-04',
        label: 'WHO DON599',
        detail: 'Sette casi identificati, inclusi tre decessi.',
        url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON599'
      },
      {
        date: '2026-05-08',
        label: 'WHO DON600',
        detail: 'Otto casi riportati, sei confermati in laboratorio e tutti Andes virus.',
        url: 'https://www.who.int/emergencies/disease-outbreak-news/item/2026-DON600'
      },
      {
        date: '2026-05-13',
        label: 'ECDC update',
        detail: 'Undici casi riportati: otto confermati, due probabili e uno inconclusivo.',
        url: 'https://www.ecdc.europa.eu/en/infectious-disease-topics/hantavirus-infection/surveillance-and-updates/andes-hantavirus-outbreak'
      }
    ]
  }
];

function withTimeout(ms = 8000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return { controller, timer };
}

async function fetchJson(url, label, ms = 8000) {
  const { controller, timer } = withTimeout(ms);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'accept': 'application/json',
        'user-agent': 'HantaWatch/1.2 public-health-monitor'
      }
    });

    if (!response.ok) throw new Error(`${label}: HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

function numberValue(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getCountryFromText(item) {
  const explicit = String(item.countryIso2 || item.country || '').toUpperCase();
  if (COUNTRY_META[explicit]) return explicit;

  const text = `${item.title || ''} ${item.summary || ''} ${item.description || ''} ${item.source || ''}`.toLowerCase();

  for (const [iso, aliases] of COUNTRY_ALIASES) {
    if (aliases.some(alias => text.includes(alias))) return iso;
  }

  return null;
}

function signalKind(item) {
  const text = `${item.source || ''} ${item.category || ''} ${item.url || ''}`.toLowerCase();
  const institutional = ['who', 'ecdc', 'cdc', 'paho', 'promed', 'ministry', 'ministero', 'public health', 'gov', 'government', 'rki', 'nhs', 'nicd'];
  return institutional.some(word => text.includes(word)) ? 'institutional' : 'public';
}

function normalizeSignal(item, sourceName = null) {
  return {
    title: item.title || item.Title || item.name || item.Name || 'Avviso hantavirus',
    url: item.url || item.Url || item.link || item.Link || item.ItemDefaultUrl || '#',
    source: sourceName || item.source || item.Source || 'Fonte pubblica',
    publishedAt: item.publishedAt || item.date || item.Date || item.PublicationDate || item.LastModified || null,
    summary: item.summary || item.description || item.Summary || item.Excerpt || '',
    countryIso2: item.countryIso2 || item.country || null
  };
}

async function getCdcUsData(year) {
  const params = new URLSearchParams({
    '$select': 'states,year,week,label,m1,m1_flag,m3,m3_flag,location1,location2,geocode',
    '$where': `lower(label) like '%hantavirus%' and year='${year}'`,
    '$limit': '50000'
  });

  const rows = await fetchJson(`${CDC_NNDSS_URL}?${params.toString()}`, 'CDC NNDSS');

  const officialRows = rows.filter(row => {
    const area = String(row.states || row.location1 || '').toUpperCase().trim();
    return US_JURISDICTIONS.has(area);
  });

  const maxWeek = Math.max(0, ...officialRows.map(row => numberValue(row.week)));
  const latestRows = officialRows.filter(row => numberValue(row.week) === maxWeek);

  const ytd = latestRows.reduce((sum, row) => sum + numberValue(row.m3), 0);
  const latestWeekCases = latestRows.reduce((sum, row) => sum + numberValue(row.m1), 0);

  const weekly = [];
  for (let week = 1; week <= 53; week++) {
    weekly.push({
      week,
      cases: officialRows
        .filter(row => numberValue(row.week) === week)
        .reduce((sum, row) => sum + numberValue(row.m1), 0)
    });
  }

  const byArea = new Map();
  latestRows.forEach(row => {
    const area = String(row.states || row.location1 || 'Area non indicata').toUpperCase().trim();
    if (!byArea.has(area)) byArea.set(area, { area, ytd: 0, latestWeekCases: 0 });
    const current = byArea.get(area);
    current.ytd += numberValue(row.m3);
    current.latestWeekCases += numberValue(row.m1);
  });

  return {
    sourceId: 'cdc-nndss-weekly',
    label: 'CDC NNDSS Weekly Data',
    coverage: 'Stati Uniti',
    year: Number(year),
    latestWeek: maxWeek,
    totalYtd: ytd,
    latestWeekCases,
    activeAreas: [...byArea.values()].filter(row => row.ytd > 0).length,
    weekly: weekly.filter(row => row.week <= Math.max(maxWeek, 1)),
    areas: [...byArea.values()].sort((a, b) => b.ytd - a.ytd),
    sourceUrl: 'https://data.cdc.gov/NNDSS/NNDSS-Weekly-Data/x9gk-5huc/about_data'
  };
}

function getEcdcEuropeData() {
  const withCases = ECDC_EU_2023.filter(row => Number(row.cases || 0) > 0);

  return {
    sourceId: 'ecdc-aer-2023',
    label: 'ECDC Annual Epidemiological Report 2023',
    coverage: 'EU/EEA',
    year: 2023,
    retrievedFromTessy: '2024-11-06',
    published: '2025-03-07',
    totalCases: 1885,
    notificationRate: 0.4,
    reportingCountries: 28,
    countriesWithCases: 19,
    countries: ECDC_EU_2023,
    topCountries: withCases.slice().sort((a, b) => Number(b.cases || 0) - Number(a.cases || 0)).slice(0, 10),
    notes: [
      'Dato annuale ufficiale, non aggiornamento in tempo reale.',
      'Belgio: tasso non calcolato nel report per cambio del sistema di sorveglianza.',
      'Danimarca e Islanda: nessun dato riportato nel report 2023.'
    ],
    attribution: 'Data provided by ECDC based on data reported by EU/EEA Member States.',
    sourceUrl: 'https://www.ecdc.europa.eu/en/publications-data/hantavirus-infection-annual-epidemiological-report-2023'
  };
}

async function getHantaflowSignals() {
  try {
    const data = await fetchJson(HANTAFLOW_URL, 'Hantaflow', 8000);
    const raw = Array.isArray(data.signals) ? data.signals : [];
    return raw.map(item => normalizeSignal(item));
  } catch (error) {
    return [];
  }
}

async function getWhoDonSignals() {
  try {
    const data = await fetchJson(WHO_DON_URL, 'WHO Disease Outbreak News', 8000);
    const items = data.value || data.items || data.results || [];
    return items
      .map(item => normalizeSignal(item, 'WHO Disease Outbreak News'))
      .filter(item => `${item.title} ${item.summary}`.toLowerCase().includes('hanta'));
  } catch (error) {
    return [];
  }
}

function uniqueSignals(signals) {
  const seen = new Set();
  const result = [];

  for (const item of signals) {
    const key = String(item.url || item.title || '').toLowerCase().trim();
    if (!key || seen.has(key)) continue;
    seen.add(key);

    const iso = getCountryFromText(item);
    result.push({
      ...item,
      countryIso2: iso,
      countryName: iso && COUNTRY_META[iso] ? COUNTRY_META[iso].name : null,
      kind: signalKind(item)
    });
  }

  return result.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));
}

function buildMapPoints(europe, usa, signals, events) {
  const points = new Map();

  function ensure(iso) {
    const meta = COUNTRY_META[iso];
    if (!meta) return null;

    if (!points.has(iso)) {
      points.set(iso, {
        iso,
        name: meta.name,
        lat: meta.lat,
        lon: meta.lon,
        region: meta.region,
        official: [],
        events: [],
        signals: [],
        score: 0
      });
    }

    return points.get(iso);
  }

  for (const row of europe.countries) {
    if (row.status === 'no_data_reported') continue;
    const point = ensure(row.iso);
    if (!point) continue;

    point.official.push({
      source: 'ECDC',
      year: europe.year,
      label: 'Sorveglianza annuale EU/EEA',
      cases: row.cases,
      rate: row.rate,
      status: row.status,
      sourceUrl: europe.sourceUrl
    });

    point.score += Number(row.cases || 0) > 0 ? 5 + Math.sqrt(Number(row.cases || 0)) : 1;
  }

  if (usa && COUNTRY_META.US) {
    const point = ensure('US');
    point.official.push({
      source: 'CDC',
      year: usa.year,
      label: 'Sorveglianza settimanale USA',
      cases: usa.totalYtd,
      latestWeekCases: usa.latestWeekCases,
      latestWeek: usa.latestWeek,
      sourceUrl: usa.sourceUrl
    });
    point.score += Number(usa.totalYtd || 0) > 0 ? 6 + Math.sqrt(Number(usa.totalYtd || 0)) : 2;
  }

  for (const event of events) {
    for (const location of event.locations || []) {
      const point = ensure(location.iso);
      if (!point) continue;

      point.events.push({
        eventId: event.id,
        title: event.title,
        role: location.role,
        asOf: event.asOf,
        casesTotal: event.casesTotal,
        confirmed: event.confirmed,
        deaths: event.deaths,
        source: event.source,
        sourceUrl: event.sourceUrl
      });

      point.score += 14;
    }
  }

  for (const signal of signals) {
    if (!signal.countryIso2) continue;
    const point = ensure(signal.countryIso2);
    if (!point) continue;

    point.signals.push({
      title: signal.title,
      url: signal.url,
      source: signal.source,
      publishedAt: signal.publishedAt,
      kind: signal.kind
    });
    point.score += signal.kind === 'institutional' ? 4 : 2;
  }

  return [...points.values()]
    .map(point => ({
      ...point,
      officialCasesTotal: point.official.reduce((sum, row) => sum + Number(row.cases || 0), 0),
      officialRecordCount: point.official.length,
      eventCount: point.events.length,
      signalCount: point.signals.length,
      institutionalSignalCount: point.signals.filter(row => row.kind === 'institutional').length,
      latestSignal: point.signals.slice().sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0))[0] || null
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

async function collectMonitorData({ year }) {
  const europe = getEcdcEuropeData();

  const [cdcResult, hantaflowSignals, whoSignals] = await Promise.allSettled([
    getCdcUsData(year),
    getHantaflowSignals(),
    getWhoDonSignals()
  ]);

  const usa = cdcResult.status === 'fulfilled' ? cdcResult.value : null;
  const signals = uniqueSignals([
    ...(hantaflowSignals.status === 'fulfilled' ? hantaflowSignals.value : []),
    ...(whoSignals.status === 'fulfilled' ? whoSignals.value : [])
  ]);

  const mapPoints = buildMapPoints(europe, usa, signals, CURRENT_OFFICIAL_EVENTS);
  const countriesWithSignals = new Set(signals.filter(item => item.countryIso2).map(item => item.countryIso2)).size;

  return {
    generatedAt: new Date().toISOString(),
    status: {
      cdc: cdcResult.status === 'fulfilled' ? 'ok' : 'unavailable',
      ecdcAnnual: 'ok',
      ecdcEvents: 'ok',
      hantaflow: hantaflowSignals.status === 'fulfilled' ? 'ok' : 'unavailable',
      who: whoSignals.status === 'fulfilled' ? 'ok' : 'unavailable'
    },
    official: {
      europe,
      usa,
      currentEvents: CURRENT_OFFICIAL_EVENTS
    },
    signals: {
      total: signals.length,
      countriesWithSignals,
      items: signals.slice(0, 30)
    },
    mapPoints,
    sources: [
      {
        id: 'ecdc-aer-2023',
        name: 'ECDC Annual Epidemiological Report 2023',
        type: 'official_surveillance',
        coverage: 'EU/EEA',
        reliability: 'official',
        url: europe.sourceUrl
      },
      {
        id: 'ecdc-andes-2026',
        name: 'ECDC Andes hantavirus outbreak update',
        type: 'official_event_update',
        coverage: 'Multi-country',
        reliability: 'official',
        url: CURRENT_OFFICIAL_EVENTS[0].sourceUrl
      },
      {
        id: 'cdc-nndss-weekly',
        name: 'CDC NNDSS Weekly Data',
        type: 'official_surveillance',
        coverage: 'United States',
        reliability: 'official',
        url: 'https://data.cdc.gov/NNDSS/NNDSS-Weekly-Data/x9gk-5huc/about_data'
      },
      {
        id: 'who-don',
        name: 'WHO Disease Outbreak News',
        type: 'official_alerts',
        coverage: 'Global',
        reliability: 'official',
        url: 'https://www.who.int/emergencies/disease-outbreak-news'
      },
      {
        id: 'hantaflow',
        name: 'Hantaflow public signals',
        type: 'public_signals',
        coverage: 'Global',
        reliability: 'public_signal',
        url: 'https://hantaflow.com/'
      }
    ]
  };
}

module.exports = {
  collectMonitorData,
  COUNTRY_META
};
