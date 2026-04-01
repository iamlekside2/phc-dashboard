import { CHART_COLORS } from '../styles/theme';
import {
  NIGERIAN_STATES, LGAS_BY_STATE, DIAGNOSES, DRUGS, MONTHS, DAYS, HOURS
} from './constants';

// ═══════════════════════════════════════════
// SEEDED RANDOM & PHC DATA GENERATION
// ═══════════════════════════════════════════
const PHC_NAME_PREFIXES = [
  'Oke-Aro','Kawo','Wuse II','Garki','Apo','Maitama','Gwarinpa','Karu','Nyanya','Kubwa',
  'Bwari','Lugbe','Jabi','Utako','Wuye','Mabushi','Katampe','Durumi','Gudu','Asokoro',
  'Agege','Surulere','Ikeja','Oshodi','Mushin','Ikorodu','Epe','Badagry','Apapa','Lekki',
  'Ogba','Yaba','Ojuelegba','Obalende','Marina','Festac','Ojo','Isolo','Ajah','Ikoyi',
  'Kano City','Fagge','Gwale','Nasarawa','Ungogo','Dala','Tarauni','Kumbotso','Madobi','Bichi',
  'Kaduna Central','Kawo','Rigasa','Barnawa','Kakuri','Tudun Wada','Malali','Sabon Gari','Zaria','Samaru',
  'Ibadan Central','Agodi','Mokola','Dugbe','Sango','Ojoo','Apata','Eleyele','Bodija','Challenge',
  'Enugu Central','New Haven','Independence','Coal Camp','Achara','Trans Ekulu','Abakpa','Emene','Nike','Ogui',
  'Calabar South','Marian','Ekorinim','Ikot Ansa','Edim Otop','Atimbo','Ekpo Abasi','Diamond Hill','Bogobiri','Henshaw',
  'Port Harcourt','Diobu','Borokiri','Rumuola','Eleme','Woji','Rukpokwu','Choba','Ozuoba','Rumuokoro',
  'Abeokuta','Ake','Ibara','Sapon','Lantoro','Onikolobo','Oke-Ilewo','Obantoko','Isale-Igbehin','Ago-Ika',
  'Akure','Alagbaka','Oke-Aro','Ondo Road','Shagari','Oba-Ile','Igbatoro','Arakale','Isolo','Oke-Ijebu',
  'Benin City','Uselu','Ugbowo','Sapele Road','Ikpoba Hill','Oluku','Aduwawa','GRA','Upper Mission','Ekenwan',
  'Owerri','Douglas','Wetheral','Royce','Amakohia','Orji','Umuguma','Naze','Ihiagwa','Nekede',
  'Jos','Bukuru','Angwan Rogo','Hwolshe','Tudun Wada','Angwan Rimi','Dogon Dutse','Zawan','Lamingo','Rayfield',
  'Maiduguri','Bolori','Gamboru','Yerwa','Lamisula','Pompomari','Jere','Konduga','Gwange','Old Maiduguri',
  'Ilorin','Tanke','Fate','Offa Road','GRA Ilorin','Oja-Oba','Adewole','Gaa-Akanbi','Ita-Amodu','Okelele',
  'Sokoto','Wamako','Arkilla','Mabera','Gawon Nama','Minanata','Runjin Sambo','Old Market','Tudun Wada','Gidan Igwai',
  'Uyo','Ikot Ekpene','Eket','Oron','Nsit Ibom','Abak','Itu','Etinan','Ikono','Uruan',
  'Makurdi','High Level','Wurukum','North Bank','Wadata','Kanshio','Agan','Modern Market','Ankpa','Gyado Villa'
];

const PHC_SUFFIXES = ['PHC','Health Centre','Primary Health Centre','Community Health Centre','Health Post','Model PHC'];

function seededRandom(seed) {
  let s = seed;
  return function () {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generatePHCData() {
  const rng = seededRandom(42);
  const rand = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
  const randF = (min, max) => +(rng() * (max - min) + min).toFixed(1);
  const pick = (arr) => arr[Math.floor(rng() * arr.length)];

  const phcs = [];
  for (let i = 0; i < 200; i++) {
    const state = NIGERIAN_STATES[i % NIGERIAN_STATES.length];
    const lgas = LGAS_BY_STATE[state] || ['Central'];
    const lga = pick(lgas);
    const namePrefix = PHC_NAME_PREFIXES[i % PHC_NAME_PREFIXES.length];
    const suffix = pick(PHC_SUFFIXES);
    const statuses = ['Active','Active','Active','Active','Inactive','Reporting Issues'];
    const status = pick(statuses);
    const outpatient = rand(800, 18000);
    const inpatient = rand(50, 2000);
    const anc = rand(100, 3000);
    const total = outpatient + inpatient + anc;

    const diagCounts = {};
    const shuffledDiag = [...DIAGNOSES].sort(() => rng() - 0.5);
    shuffledDiag.forEach((d, idx) => {
      diagCounts[d] = rand(Math.max(10, 800 - idx * 50), Math.max(50, 2500 - idx * 100));
    });

    const drugCounts = {};
    const shuffledDrugs = [...DRUGS].sort(() => rng() - 0.5);
    shuffledDrugs.forEach((d, idx) => {
      drugCounts[d] = rand(Math.max(20, 500 - idx * 30), Math.max(100, 3000 - idx * 120));
    });

    const monthlyTrend = MONTHS.map((m) => ({
      month: m,
      outpatient: rand(600, 2200),
      inpatient: rand(40, 250),
      anc: rand(50, 400),
    }));

    const weeklyTrend = Array.from({ length: 13 }, (_, w) => ({
      week: `W${w + 1}`,
      visits: rand(300, 1800),
    }));

    phcs.push({
      id: `PHC-${String(i + 1).padStart(4, '0')}`,
      name: `${namePrefix} ${suffix}`,
      state, lga,
      ward: `Ward ${rand(1, 12)}`,
      type: pick(['Type A', 'Type B', 'Type C']),
      status,
      visits: { total, outpatient, inpatient, anc },
      deliveries: rand(20, 800),
      immunisations: rand(200, 5000),
      referrals: rand(10, 400),
      staffCount: rand(5, 45),
      satisfactionScore: rand(25, 98),
      drugStockLevel: rand(10, 100),
      diagnoses: diagCounts,
      drugs: drugCounts,
      monthlyTrend,
      weeklyTrend,
      lastReportDate: `2026-0${rand(1, 3)}-${String(rand(1, 28)).padStart(2, '0')}`,
      coordinates: { lat: randF(4.0, 14.0), lng: randF(2.5, 14.5) },
    });
  }
  return phcs;
}

export const PHC_DATA = generatePHCData();

// ═══════════════════════════════════════════
// CHART / AGGREGATE DATA
// ═══════════════════════════════════════════

export const NATIONAL_MONTHLY = MONTHS.map((m, i) => ({
  month: m,
  outpatient: 120000 + Math.sin(i * 0.5) * 30000 + (Math.random() * 10000 | 0),
  inpatient: 15000 + Math.sin(i * 0.7) * 4000 + (Math.random() * 2000 | 0),
  anc: 24000 + Math.cos(i * 0.4) * 6000 + (Math.random() * 2000 | 0),
}));

export const DISEASE_TREND = MONTHS.map((m, i) => ({
  month: m,
  Malaria: 45000 + Math.sin(i * 0.6) * 15000 + (Math.random() * 5000 | 0),
  Typhoid: 18000 + Math.cos(i * 0.5) * 5000 + (Math.random() * 2000 | 0),
  Hypertension: 22000 + i * 400 + (Math.random() * 1500 | 0),
  Diabetes: 15000 + i * 300 + (Math.random() * 1000 | 0),
  Pneumonia: 12000 + Math.sin(i * 0.8 + 1) * 4000 + (Math.random() * 1500 | 0),
  Diarrhea: 14000 + Math.sin(i * 0.7) * 5000 + (Math.random() * 2000 | 0),
}));

export const DRUG_TREND = MONTHS.map((m, i) => ({
  month: m,
  Antimalarials: 35000 + Math.sin(i * 0.5) * 10000 + (Math.random() * 3000 | 0),
  Antibiotics: 28000 + Math.cos(i * 0.6) * 7000 + (Math.random() * 2000 | 0),
  Antihypertensives: 18000 + i * 500 + (Math.random() * 1500 | 0),
  Vitamins: 22000 + Math.sin(i * 0.4) * 5000 + (Math.random() * 2000 | 0),
}));

export const REFERRAL_DATA = MONTHS.map((m, i) => ({
  month: m,
  referrals: 1800 + Math.sin(i * 0.5) * 500 + (Math.random() * 200 | 0),
  followUpRate: 55 + Math.cos(i * 0.4) * 15 + (Math.random() * 5 | 0),
}));

export const IMMUN_DATA = MONTHS.map((m) => ({
  month: m,
  BCG: 12000 + (Math.random() * 4000 | 0),
  OPV: 15000 + (Math.random() * 5000 | 0),
  DPT: 13000 + (Math.random() * 4000 | 0),
  Measles: 11000 + (Math.random() * 3000 | 0),
  'Hepatitis B': 10000 + (Math.random() * 3500 | 0),
  'Yellow Fever': 8000 + (Math.random() * 3000 | 0),
}));

export const HEATMAP_DATA = DAYS.map((day) =>
  HOURS.map((hour) => ({
    day, hour,
    count: Math.floor(Math.random() * 100),
  }))
).flat();

export const TOP_STATES = [
  { state: 'Lagos', visits: 245000 }, { state: 'Kano', visits: 198000 },
  { state: 'FCT', visits: 165000 }, { state: 'Rivers', visits: 142000 },
  { state: 'Oyo', visits: 128000 }, { state: 'Kaduna', visits: 121000 },
  { state: 'Anambra', visits: 108000 }, { state: 'Enugu', visits: 95000 },
  { state: 'Ogun', visits: 89000 }, { state: 'Delta', visits: 83000 },
];

export const DRUG_TREEMAP = [
  { name: 'Antimalarials', children: [
    { name: 'Artemether-L.', size: 42000, fill: CHART_COLORS[0] },
    { name: 'Chloroquine', size: 18000, fill: CHART_COLORS[1] },
  ]},
  { name: 'Antibiotics', children: [
    { name: 'Amoxicillin', size: 38000, fill: CHART_COLORS[2] },
    { name: 'Cotrimoxazole', size: 22000, fill: CHART_COLORS[3] },
    { name: 'Ciprofloxacin', size: 15000, fill: CHART_COLORS[4] },
  ]},
  { name: 'Antihypertensives', children: [
    { name: 'Lisinopril', size: 28000, fill: CHART_COLORS[5] },
    { name: 'Amlodipine', size: 19000, fill: CHART_COLORS[6] },
  ]},
  { name: 'Vitamins & Supps', children: [
    { name: 'Vitamin A', size: 25000, fill: CHART_COLORS[7] },
    { name: 'Iron Supps', size: 21000, fill: CHART_COLORS[8] },
    { name: 'Folic Acid', size: 17000, fill: CHART_COLORS[9] },
  ]},
  { name: 'Others', children: [
    { name: 'Paracetamol', size: 45000, fill: CHART_COLORS[0] },
    { name: 'ORS Sachets', size: 30000, fill: CHART_COLORS[2] },
    { name: 'Metformin', size: 20000, fill: CHART_COLORS[4] },
    { name: 'Omeprazole', size: 14000, fill: CHART_COLORS[6] },
    { name: 'Oral Contracep.', size: 12000, fill: CHART_COLORS[8] },
  ]},
];

export const DISEASE_TREEMAP = [
  { name: 'Infectious', children: [
    { name: 'Malaria', size: 85000, fill: '#FF6B6B' },
    { name: 'Typhoid', size: 42000, fill: '#F97316' },
    { name: 'Pneumonia', size: 28000, fill: '#EC4899' },
    { name: 'Diarrhea', size: 32000, fill: '#F59E0B' },
    { name: 'TB', size: 15000, fill: '#FF6B6B' },
    { name: 'STIs', size: 18000, fill: '#F97316' },
  ]},
  { name: 'NCD', children: [
    { name: 'Hypertension', size: 48000, fill: '#7C3AED' },
    { name: 'Diabetes', size: 35000, fill: '#8B5CF6' },
    { name: 'Asthma', size: 12000, fill: '#7C3AED' },
    { name: 'Arthritis', size: 14000, fill: '#8B5CF6' },
  ]},
  { name: 'Nutritional', children: [
    { name: 'Anemia', size: 22000, fill: '#10B981' },
    { name: 'Malnutrition', size: 19000, fill: '#14B8A6' },
  ]},
  { name: 'Other', children: [
    { name: 'Skin Infect.', size: 16000, fill: '#3B82F6' },
    { name: 'Eye Infect.', size: 13000, fill: '#00D4FF' },
    { name: 'UTI', size: 20000, fill: '#3B82F6' },
  ]},
];

export const DISEASE_MONTH_MATRIX = DIAGNOSES.map((d) => ({
  disease: d,
  months: MONTHS.map(() => Math.floor(Math.random() * 100)),
}));

export const EPIDEMIC_DATA = MONTHS.map((m, i) => ({
  month: m,
  Cholera: 200 + Math.sin(i * 0.8) * 150 + (Math.random() * 80 | 0),
  Meningitis: 100 + Math.sin(i * 0.6 + 2) * 80 + (Math.random() * 40 | 0),
  Monkeypox: 50 + Math.sin(i * 0.5 + 1) * 30 + (Math.random() * 20 | 0),
}));

export const AGE_DISTRIBUTION = [
  { name: '<5 years', value: 28, fill: CHART_COLORS[0] },
  { name: '5-17', value: 18, fill: CHART_COLORS[1] },
  { name: '18-35', value: 25, fill: CHART_COLORS[2] },
  { name: '36-60', value: 20, fill: CHART_COLORS[3] },
  { name: '60+', value: 9, fill: CHART_COLORS[4] },
];
