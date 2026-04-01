import React, { useState, useEffect, useMemo, useCallback, useRef, createContext, useContext, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ScatterChart, Scatter, ComposedChart, Treemap,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ReferenceLine, ReferenceBand
} from 'recharts';
import {
  LayoutDashboard, Building2, Activity, Pill, GitCompare, FileDown,
  Menu, X, Search, Bell, ChevronDown, ChevronLeft, ChevronRight,
  Maximize2, Download, LogOut, User, Filter, Plus, Minus,
  TrendingUp, TrendingDown, Heart, Users, Syringe, ArrowUpRight,
  Package, Star, AlertTriangle, Check
} from 'lucide-react';

// ═══════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════
const AppContext = createContext();

// ═══════════════════════════════════════════
// CONSTANTS & COLORS
// ═══════════════════════════════════════════
const COLORS = {
  bg: '#060B18', card: '#0D1627', border: '#1F2D47',
  cyan: '#00D4FF', purple: '#7C3AED', emerald: '#10B981',
  amber: '#F59E0B', coral: '#FF6B6B', textPrimary: '#F0F6FF',
  textMuted: '#6B7FA3', sidebar: '#0A0F1E',
};
const CHART_COLORS = ['#00D4FF','#7C3AED','#10B981','#F59E0B','#FF6B6B','#3B82F6','#EC4899','#14B8A6','#F97316','#8B5CF6'];

const NIGERIAN_STATES = [
  'Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno',
  'Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT','Gombe',
  'Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara',
  'Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau',
  'Rivers','Sokoto','Taraba','Yobe','Zamfara'
];

const LGAS_BY_STATE = {
  'Abia':['Aba North','Aba South','Arochukwu','Bende','Ikwuano','Isiala Ngwa'],
  'Adamawa':['Demsa','Fufore','Ganye','Girei','Gombi','Yola North','Yola South'],
  'Akwa Ibom':['Abak','Eastern Obolo','Eket','Ikono','Ikot Abasi','Uyo'],
  'Anambra':['Aguata','Awka North','Awka South','Idemili North','Nnewi North','Onitsha'],
  'Bauchi':['Alkaleri','Bauchi','Bogoro','Dass','Gamawa','Tafawa Balewa'],
  'Bayelsa':['Brass','Ekeremor','Kolokuma','Nembe','Ogbia','Yenagoa'],
  'Benue':['Ado','Agatu','Buruku','Gboko','Guma','Makurdi','Otukpo'],
  'Borno':['Bama','Chibok','Damboa','Jere','Konduga','Maiduguri','Monguno'],
  'Cross River':['Akamkpa','Bekwarra','Calabar Municipal','Calabar South','Ikom','Ogoja'],
  'Delta':['Aniocha North','Burutu','Ethiope East','Oshimili South','Uvwie','Warri South'],
  'Ebonyi':['Abakaliki','Afikpo North','Ebonyi','Ikwo','Ishielu','Ohaukwu'],
  'Edo':['Akoko-Edo','Benin City','Egor','Ikpoba-Okha','Oredo','Ovia North'],
  'Ekiti':['Ado-Ekiti','Efon','Ekiti West','Gbonyin','Ido-Osi','Ikere'],
  'Enugu':['Aninri','Enugu East','Enugu North','Enugu South','Nsukka','Udi'],
  'FCT':['Abaji','Bwari','Gwagwalada','Kuje','Kwali','Municipal'],
  'Gombe':['Akko','Balanga','Billiri','Dukku','Gombe','Nafada','Yamaltu'],
  'Imo':['Aboh Mbaise','Ahiazu Mbaise','Ideato North','Owerri Municipal','Owerri North','Owerri West'],
  'Jigawa':['Auyo','Babura','Birnin Kudu','Dutse','Garki','Hadejia','Ringim'],
  'Kaduna':['Chikun','Giwa','Igabi','Kaduna North','Kaduna South','Kawo','Zaria'],
  'Kano':['Dala','Fagge','Gwale','Kano Municipal','Kumbotso','Nassarawa','Tarauni'],
  'Katsina':['Batagarawa','Daura','Dutsin-Ma','Funtua','Jibia','Katsina','Malumfashi'],
  'Kebbi':['Argungu','Bagudo','Birnin Kebbi','Bunza','Gwandu','Jega','Yauri'],
  'Kogi':['Adavi','Ajaokuta','Dekina','Idah','Kabba','Lokoja','Okene'],
  'Kwara':['Asa','Ilorin East','Ilorin South','Ilorin West','Moro','Offa','Oyun'],
  'Lagos':['Agege','Ajeromi-Ifelodun','Alimosho','Eti-Osa','Ikeja','Lagos Island','Surulere'],
  'Nasarawa':['Akwanga','Doma','Karu','Keffi','Lafia','Nasarawa','Toto'],
  'Niger':['Agaie','Bida','Bosso','Chanchaga','Kontagora','Minna','Suleja'],
  'Ogun':['Abeokuta North','Abeokuta South','Ado-Odo','Ifo','Ijebu Ode','Obafemi Owode','Sagamu'],
  'Ondo':['Akure North','Akure South','Idanre','Ile Oluji','Okitipupa','Ondo West','Owo'],
  'Osun':['Atakumosa','Ede North','Ife Central','Ife East','Ilesha West','Osogbo','Iwo'],
  'Oyo':['Afijio','Akinyele','Ibadan North','Ibadan South','Ido','Ogbomoso North','Oyo East'],
  'Plateau':['Barkin Ladi','Bassa','Jos East','Jos North','Jos South','Mangu','Riyom'],
  'Rivers':['Bonny','Eleme','Obio-Akpor','Okrika','Oyigbo','Port Harcourt','Tai'],
  'Sokoto':['Bodinga','Dange-Shuni','Gwadabawa','Illela','Sokoto North','Sokoto South','Wamako'],
  'Taraba':['Ardo Kola','Bali','Gashaka','Ibi','Jalingo','Takum','Wukari'],
  'Yobe':['Bursari','Damaturu','Fika','Geidam','Nguru','Potiskum','Yusufari'],
  'Zamfara':['Anka','Bakura','Bungudu','Gummi','Gusau','Kaura Namoda','Talata Mafara'],
};

const DIAGNOSES = ['Malaria','Typhoid Fever','Hypertension','Diabetes','Pneumonia','Diarrhea','Tuberculosis','Anemia','Skin Infections','Eye Infections','STIs','Malnutrition','Arthritis','Asthma','Urinary Tract Infection'];
const DRUGS = ['Artemether-Lumefantrine','Amoxicillin','Metformin','Lisinopril','ORS Sachets','Paracetamol','Cotrimoxazole','Vitamin A','Iron Supplements','Albendazole','Folic Acid','Omeprazole','Diazepam','Ciprofloxacin','Oral Contraceptives'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const VACCINE_TYPES = ['BCG','OPV','DPT','Measles','Hepatitis B','Yellow Fever'];

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

// ═══════════════════════════════════════════
// SEEDED RANDOM & DATA GENERATION
// ═══════════════════════════════════════════
function seededRandom(seed) {
  let s = seed;
  return function() {
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

    const monthlyTrend = MONTHS.map(m => ({
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
      state,
      lga,
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

const PHC_DATA = generatePHCData();

// National aggregates
const NATIONAL = {
  totalPHCs: 6247,
  totalVisits: 1847392,
  ancVisits: 312004,
  deliveries: 48203,
  immunisations: 891230,
  referrals: 23891,
  staffCount: 41203,
  drugAdequacy: 73,
};

// Generate national monthly trend
const NATIONAL_MONTHLY = MONTHS.map((m, i) => ({
  month: m,
  outpatient: 120000 + Math.sin(i * 0.5) * 30000 + (Math.random() * 10000 | 0),
  inpatient: 15000 + Math.sin(i * 0.7) * 4000 + (Math.random() * 2000 | 0),
  anc: 24000 + Math.cos(i * 0.4) * 6000 + (Math.random() * 2000 | 0),
}));

// Disease trend data
const DISEASE_TREND = MONTHS.map((m, i) => ({
  month: m,
  Malaria: 45000 + Math.sin(i * 0.6) * 15000 + (Math.random() * 5000 | 0),
  Typhoid: 18000 + Math.cos(i * 0.5) * 5000 + (Math.random() * 2000 | 0),
  Hypertension: 22000 + i * 400 + (Math.random() * 1500 | 0),
  Diabetes: 15000 + i * 300 + (Math.random() * 1000 | 0),
  Pneumonia: 12000 + Math.sin(i * 0.8 + 1) * 4000 + (Math.random() * 1500 | 0),
  Diarrhea: 14000 + Math.sin(i * 0.7) * 5000 + (Math.random() * 2000 | 0),
}));

// Drug dispensing trend
const DRUG_TREND = MONTHS.map((m, i) => ({
  month: m,
  Antimalarials: 35000 + Math.sin(i * 0.5) * 10000 + (Math.random() * 3000 | 0),
  Antibiotics: 28000 + Math.cos(i * 0.6) * 7000 + (Math.random() * 2000 | 0),
  Antihypertensives: 18000 + i * 500 + (Math.random() * 1500 | 0),
  Vitamins: 22000 + Math.sin(i * 0.4) * 5000 + (Math.random() * 2000 | 0),
}));

// Referrals vs follow-up
const REFERRAL_DATA = MONTHS.map((m, i) => ({
  month: m,
  referrals: 1800 + Math.sin(i * 0.5) * 500 + (Math.random() * 200 | 0),
  followUpRate: 55 + Math.cos(i * 0.4) * 15 + (Math.random() * 5 | 0),
}));

// Immunisation by vaccine
const IMMUN_DATA = MONTHS.map(m => ({
  month: m,
  BCG: 12000 + (Math.random() * 4000 | 0),
  OPV: 15000 + (Math.random() * 5000 | 0),
  DPT: 13000 + (Math.random() * 4000 | 0),
  Measles: 11000 + (Math.random() * 3000 | 0),
  'Hepatitis B': 10000 + (Math.random() * 3500 | 0),
  'Yellow Fever': 8000 + (Math.random() * 3000 | 0),
}));

// Heatmap day x hour data
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const HOURS = Array.from({ length: 12 }, (_, i) => `${7 + i}:00`);
const HEATMAP_DATA = DAYS.map(day =>
  HOURS.map(hour => ({
    day, hour,
    count: Math.floor(Math.random() * 100),
  }))
).flat();

// Top states by visits
const TOP_STATES = [
  { state: 'Lagos', visits: 245000 }, { state: 'Kano', visits: 198000 },
  { state: 'FCT', visits: 165000 }, { state: 'Rivers', visits: 142000 },
  { state: 'Oyo', visits: 128000 }, { state: 'Kaduna', visits: 121000 },
  { state: 'Anambra', visits: 108000 }, { state: 'Enugu', visits: 95000 },
  { state: 'Ogun', visits: 89000 }, { state: 'Delta', visits: 83000 },
];

// Treemap drug data
const DRUG_TREEMAP = [
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

// Diagnostics page data
const DISEASE_TREEMAP = [
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

const DISEASE_MONTH_MATRIX = DIAGNOSES.map(d => ({
  disease: d,
  months: MONTHS.map(() => Math.floor(Math.random() * 100)),
}));

const EPIDEMIC_DATA = MONTHS.map((m, i) => ({
  month: m,
  Cholera: 200 + Math.sin(i * 0.8) * 150 + (Math.random() * 80 | 0),
  Meningitis: 100 + Math.sin(i * 0.6 + 2) * 80 + (Math.random() * 40 | 0),
  Monkeypox: 50 + Math.sin(i * 0.5 + 1) * 30 + (Math.random() * 20 | 0),
}));

const AGE_DISTRIBUTION = [
  { name: '<5 years', value: 28, fill: CHART_COLORS[0] },
  { name: '5-17', value: 18, fill: CHART_COLORS[1] },
  { name: '18-35', value: 25, fill: CHART_COLORS[2] },
  { name: '36-60', value: 20, fill: CHART_COLORS[3] },
  { name: '60+', value: 9, fill: CHART_COLORS[4] },
];

// ═══════════════════════════════════════════
// STYLES (CSS-in-JS objects)
// ═══════════════════════════════════════════
const glassmorphism = {
  background: 'rgba(13,22,39,0.8)',
  backdropFilter: 'blur(12px)',
  WebkitBackdropFilter: 'blur(12px)',
  border: `1px solid ${COLORS.border}`,
  borderRadius: '16px',
  boxShadow: '0 0 40px rgba(0,212,255,0.04)',
};

const glassHover = '0 0 24px rgba(0,212,255,0.12)';

// ═══════════════════════════════════════════
// GLOBAL CSS STYLE TAG
// ═══════════════════════════════════════════
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=DM+Sans:wght@400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', sans-serif; background: ${COLORS.bg}; color: ${COLORS.textPrimary}; overflow-x: hidden; }

    ::-webkit-scrollbar { width: 4px; height: 4px; }
    ::-webkit-scrollbar-track { background: transparent; }
    ::-webkit-scrollbar-thumb { background: ${COLORS.cyan}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${COLORS.purple}; }

    .syne { font-family: 'Syne', sans-serif; }
    .dm { font-family: 'DM Sans', sans-serif; }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    @keyframes float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(80px, -60px) scale(1.1); }
      66% { transform: translate(-40px, 40px) scale(0.95); }
    }
    @keyframes float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(-60px, 80px) scale(1.05); }
      66% { transform: translate(50px, -30px) scale(0.9); }
    }
    @keyframes float3 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      33% { transform: translate(40px, 60px) scale(1.08); }
      66% { transform: translate(-80px, -50px) scale(0.92); }
    }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }

    @keyframes dotPulse {
      0%, 100% { opacity: 0.15; }
      50% { opacity: 0.3; }
    }

    .skeleton {
      background: linear-gradient(90deg, #0D1627 25%, #1F2D47 50%, #0D1627 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 8px;
    }

    .glow-number {
      font-family: 'Syne', sans-serif;
      font-weight: 800;
      text-shadow: 0 0 20px currentColor;
    }

    input:focus, select:focus {
      outline: none;
      border-color: ${COLORS.cyan} !important;
      box-shadow: 0 0 0 2px rgba(0,212,255,0.2);
    }

    .chart-card:hover {
      box-shadow: 0 0 24px rgba(0,212,255,0.15) !important;
    }

    .recharts-tooltip-wrapper { z-index: 1000 !important; }

    .btn-glow:hover {
      box-shadow: 0 0 20px rgba(0,212,255,0.4);
    }

    @keyframes slideInRight {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }

    .slide-panel { animation: slideInRight 0.3s ease-out; }
  `}</style>
);

// ═══════════════════════════════════════════
// UTILITY COMPONENTS
// ═══════════════════════════════════════════
const formatNumber = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n?.toLocaleString?.() ?? n;
};

const Skeleton = ({ width = '100%', height = 20, style = {} }) => (
  <div className="skeleton" style={{ width, height, ...style }} />
);

const Toast = memo(({ message, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 40, x: 20 }}
    animate={{ opacity: 1, y: 0, x: 0 }}
    exit={{ opacity: 0, y: 40 }}
    style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
      ...glassmorphism, padding: '14px 24px',
      borderLeft: `3px solid ${COLORS.cyan}`,
      display: 'flex', alignItems: 'center', gap: 10,
      fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: COLORS.textPrimary,
    }}
  >
    <Check size={16} color={COLORS.emerald} />
    {message}
    <button onClick={onClose} style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', marginLeft: 8 }}>
      <X size={14} />
    </button>
  </motion.div>
));

const DotGridBg = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15, pointerEvents: 'none' }}>
    <defs>
      <pattern id="dotgrid" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1" fill={COLORS.cyan} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.6;0.3" dur="4s" repeatCount="indefinite" />
        </circle>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#dotgrid)" />
  </svg>
);

// Sparkline SVG
const Sparkline = ({ data, color, width = 80, height = 28 }) => {
  const values = data || [30, 45, 35, 60, 42, 70, 55];
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const points = values.map((v, i) =>
    `${(i / (values.length - 1)) * width},${height - ((v - min) / range) * (height - 4) - 2}`
  ).join(' ');
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={points} opacity={0.8} />
    </svg>
  );
};

// Custom Recharts Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: COLORS.card, border: `1px solid ${COLORS.border}`,
      borderRadius: 10, padding: '10px 14px', fontSize: 13,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, marginBottom: 6, color: COLORS.textPrimary }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '2px 0', color: COLORS.textPrimary }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
          <span style={{ color: COLORS.textMuted }}>{p.name}:</span>
          <span style={{ fontWeight: 600 }}>{formatNumber(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// Chart Card Wrapper
const ChartCard = memo(({ title, subtitle, children, style = {}, fullWidth = false }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="chart-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...glassmorphism,
        padding: '20px',
        boxShadow: hovered ? glassHover : glassmorphism.boxShadow,
        transition: 'box-shadow 0.3s ease',
        gridColumn: fullWidth ? '1 / -1' : undefined,
        ...style,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <h3 className="syne" style={{ fontSize: 16, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 2 }}>{title}</h3>
          {subtitle && <p className="dm" style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>{subtitle}</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            aria-label="Fullscreen"
            onClick={() => window.alert('Fullscreen view coming soon')}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: COLORS.textMuted, display: 'flex' }}
          >
            <Maximize2 size={14} />
          </button>
          <button
            aria-label="Download"
            onClick={() => window.alert('Export coming soon')}
            style={{ background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 6, cursor: 'pointer', color: COLORS.textMuted, display: 'flex' }}
          >
            <Download size={14} />
          </button>
        </div>
      </div>
      {children}
    </motion.div>
  );
});

// ═══════════════════════════════════════════
// LOGIN PAGE
// ═══════════════════════════════════════════
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setTimeout(() => {
      if (email === 'admin@phc.ng' && password === 'phc2024') {
        onLogin(true);
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1200);
  };

  const inputStyle = (hasError) => ({
    width: '100%', padding: '14px 16px', background: 'rgba(6,11,24,0.8)',
    border: `1px solid ${hasError ? COLORS.coral : COLORS.border}`,
    borderRadius: 12, color: COLORS.textPrimary, fontSize: 15,
    fontFamily: "'DM Sans', sans-serif",
    boxShadow: hasError ? `0 0 12px rgba(255,107,107,0.3)` : 'none',
    transition: 'all 0.3s ease',
  });

  return (
    <div style={{ position: 'fixed', inset: 0, background: COLORS.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {/* Animated gradient orbs */}
      <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.cyan}20, transparent 70%)`, top: '10%', left: '15%', animation: 'float1 20s ease-in-out infinite', filter: 'blur(60px)' }} />
      <div style={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.purple}20, transparent 70%)`, bottom: '5%', right: '10%', animation: 'float2 25s ease-in-out infinite', filter: 'blur(80px)' }} />
      <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', background: `radial-gradient(circle, ${COLORS.emerald}15, transparent 70%)`, top: '50%', left: '60%', animation: 'float3 22s ease-in-out infinite', filter: 'blur(70px)' }} />

      <DotGridBg />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          ...glassmorphism, maxWidth: 420, width: '90%', padding: '48px 36px',
          position: 'relative', zIndex: 10,
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
            background: `rgba(0,212,255,0.1)`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: `0 0 30px rgba(0,212,255,0.2)`,
          }}>
            <Heart size={32} color={COLORS.cyan} />
          </div>
          <h1 className="syne" style={{ fontSize: 28, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 8 }}>
            PHC Intelligence Hub
          </h1>
          <p className="dm" style={{ fontSize: 14, color: COLORS.textMuted }}>
            Federal Ministry of Health — Nigeria
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="dm" style={{ display: 'block', fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>Email</label>
            <input
              type="email" value={email} onChange={e => { setEmail(e.target.value); setError(false); }}
              placeholder="Enter your email"
              style={inputStyle(error)}
            />
          </div>
          <div style={{ marginBottom: 24 }}>
            <label className="dm" style={{ display: 'block', fontSize: 13, color: COLORS.textMuted, marginBottom: 6 }}>Password</label>
            <input
              type="password" value={password} onChange={e => { setPassword(e.target.value); setError(false); }}
              placeholder="Enter your password"
              style={inputStyle(error)}
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{ color: COLORS.coral, fontSize: 13, marginBottom: 16, textAlign: 'center' }}
            >
              Invalid credentials. Please try again.
            </motion.p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="btn-glow"
            style={{
              width: '100%', padding: '14px', background: loading ? COLORS.border : COLORS.cyan,
              color: loading ? COLORS.textMuted : '#060B18', border: 'none', borderRadius: 14,
              fontSize: 16, fontWeight: 700, fontFamily: "'Syne', sans-serif", cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                style={{ width: 20, height: 20, border: `2px solid ${COLORS.textMuted}`, borderTopColor: 'transparent', borderRadius: '50%' }}
              />
            ) : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: 24, padding: '12px 16px', background: 'rgba(0,212,255,0.05)',
          borderRadius: 10, border: `1px solid rgba(0,212,255,0.1)`, textAlign: 'center',
        }}>
          <p className="dm" style={{ fontSize: 12, color: COLORS.textMuted, margin: 0 }}>
            Demo: <span style={{ color: COLORS.cyan }}>admin@phc.ng</span> / <span style={{ color: COLORS.cyan }}>phc2024</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════
const NAV_ITEMS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'directory', label: 'PHC Directory', icon: Building2 },
  { key: 'diagnostics', label: 'Diagnostics', icon: Activity },
  { key: 'drugs', label: 'Drug Dispensing', icon: Pill },
  { key: 'compare', label: 'Compare PHCs', icon: GitCompare },
  { key: 'reports', label: 'Reports', icon: FileDown },
];

const Sidebar = memo(({ collapsed, activePage, onNavigate, onLogout, onToggle }) => (
  <nav
    role="navigation"
    aria-label="Main navigation"
    style={{
      position: 'fixed', top: 0, left: 0, height: '100vh',
      width: collapsed ? 60 : 240, background: COLORS.sidebar,
      borderRight: `1px solid ${COLORS.border}`, transition: 'width 0.3s ease',
      display: 'flex', flexDirection: 'column', zIndex: 60, overflow: 'hidden',
    }}
  >
    <div style={{ padding: collapsed ? '16px 12px' : '16px 20px', borderBottom: `1px solid ${COLORS.border}`, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
      {!collapsed && <span className="syne" style={{ fontSize: 18, fontWeight: 800, color: COLORS.cyan }}>PHC Hub</span>}
      <button
        aria-label="Toggle sidebar"
        onClick={onToggle}
        style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', padding: 4, display: 'flex' }}
      >
        <Menu size={20} />
      </button>
    </div>

    <div style={{ flex: 1, padding: '12px 0', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
        const active = activePage === key;
        return (
          <button
            key={key}
            tabIndex={0}
            onClick={() => onNavigate(key)}
            aria-label={label}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: collapsed ? '12px 0' : '12px 20px',
              justifyContent: collapsed ? 'center' : 'flex-start',
              background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
              borderLeft: active ? `3px solid ${COLORS.cyan}` : '3px solid transparent',
              color: active ? COLORS.cyan : COLORS.textMuted,
              border: 'none', borderLeft: active ? `3px solid ${COLORS.cyan}` : '3px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s ease', width: '100%', fontSize: 14,
              fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 400,
            }}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </button>
        );
      })}
    </div>

    <div style={{
      padding: collapsed ? '16px 8px' : '16px 20px',
      borderTop: `1px solid ${COLORS.border}`,
      display: 'flex', alignItems: 'center', gap: 12,
      flexDirection: collapsed ? 'column' : 'row',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#fff',
        fontFamily: "'Syne', sans-serif", flexShrink: 0,
      }}>DA</div>
      {!collapsed && (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="syne" style={{ fontSize: 13, fontWeight: 700, color: COLORS.textPrimary, whiteSpace: 'nowrap' }}>Dr. Admin</div>
          <div className="dm" style={{ fontSize: 11, color: COLORS.textMuted }}>National Admin</div>
        </div>
      )}
      <button
        aria-label="Logout"
        onClick={onLogout}
        style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', padding: 4, display: 'flex' }}
      >
        <LogOut size={18} />
      </button>
    </div>
  </nav>
));

// ═══════════════════════════════════════════
// HEADER BAR
// ═══════════════════════════════════════════
const HeaderBar = memo(({ sidebarCollapsed, activePage, selectedState, setSelectedState, selectedLGA, setSelectedLGA, onToggleSidebar }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery || searchQuery.length < 2) return [];
    const q = searchQuery.toLowerCase();
    return PHC_DATA.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.state.toLowerCase().includes(q) ||
      p.lga.toLowerCase().includes(q)
    ).slice(0, 6);
  }, [searchQuery]);

  const lgas = useMemo(() =>
    selectedState && selectedState !== 'All' ? (LGAS_BY_STATE[selectedState] || []) : [],
    [selectedState]
  );

  const selectStyle = {
    padding: '8px 12px', background: 'rgba(13,22,39,0.9)', border: `1px solid ${COLORS.border}`,
    borderRadius: 10, color: COLORS.textPrimary, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
    cursor: 'pointer', minWidth: 130,
  };

  const breadcrumb = NAV_ITEMS.find(n => n.key === activePage)?.label || 'Overview';

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(6,11,24,0.95)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${COLORS.border}`,
      padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16,
    }}>
      <button aria-label="Toggle sidebar" onClick={onToggleSidebar} style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', display: 'flex', padding: 4 }}>
        <Menu size={20} />
      </button>

      <div className="dm" style={{ fontSize: 14, color: COLORS.textMuted, whiteSpace: 'nowrap' }}>
        Dashboard / <span style={{ color: COLORS.textPrimary }}>{breadcrumb}</span>
      </div>

      <div style={{ flex: 1, maxWidth: 400, position: 'relative', margin: '0 auto' }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }} />
          <input
            placeholder="Search PHC by name, state, or LGA..."
            value={searchQuery}
            onChange={e => { setSearchQuery(e.target.value); setShowSearch(true); }}
            onFocus={() => setShowSearch(true)}
            onBlur={() => setTimeout(() => setShowSearch(false), 200)}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: 'rgba(13,22,39,0.6)', border: `1px solid ${COLORS.border}`,
              borderRadius: 12, color: COLORS.textPrimary, fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          />
        </div>
        {showSearch && searchResults.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
            ...glassmorphism, padding: '8px 0', maxHeight: 300, overflowY: 'auto', zIndex: 100,
          }}>
            {searchResults.map(p => (
              <div key={p.id} style={{
                padding: '10px 16px', cursor: 'pointer', fontSize: 13,
                borderBottom: `1px solid ${COLORS.border}20`,
              }}
                onMouseDown={(e) => e.preventDefault()}
              >
                <div style={{ color: COLORS.textPrimary, fontWeight: 500 }}>{p.name}</div>
                <div style={{ color: COLORS.textMuted, fontSize: 11 }}>{p.state} · {p.lga}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <select value={selectedState} onChange={e => { setSelectedState(e.target.value); setSelectedLGA('All'); }} style={selectStyle}>
          <option value="All">All States</option>
          {NIGERIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {lgas.length > 0 && (
          <select value={selectedLGA} onChange={e => setSelectedLGA(e.target.value)} style={selectStyle}>
            <option value="All">All LGAs</option>
            {lgas.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        )}

        <div style={{ position: 'relative' }}>
          <button aria-label="Notifications" style={{ background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', display: 'flex', padding: 6 }}>
            <Bell size={20} />
          </button>
          <span style={{
            position: 'absolute', top: 0, right: 0, width: 16, height: 16, borderRadius: '50%',
            background: COLORS.amber, fontSize: 10, fontWeight: 700, color: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>3</span>
        </div>

        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: `linear-gradient(135deg, ${COLORS.cyan}, ${COLORS.purple})`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif",
        }}>DA</div>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════
// KPI STAT CARDS
// ═══════════════════════════════════════════
const KPI_CARDS_DATA = [
  { label: 'Total PHCs', value: NATIONAL.totalPHCs, change: 2.3, color: COLORS.cyan, icon: Building2, sparkline: [40,45,38,52,48,55,50] },
  { label: 'Total Visits', value: NATIONAL.totalVisits, change: 8.1, color: COLORS.emerald, icon: Users, sparkline: [120,135,128,145,152,148,160] },
  { label: 'ANC Visits', value: NATIONAL.ancVisits, change: 5.4, color: COLORS.purple, icon: Heart, sparkline: [22,25,23,28,26,30,29] },
  { label: 'Deliveries', value: NATIONAL.deliveries, change: 3.7, color: COLORS.coral, icon: Star, sparkline: [3,4,3.5,4.2,3.8,4.5,4.1] },
  { label: 'Immunisations', value: NATIONAL.immunisations, change: 12.5, color: COLORS.amber, icon: Syringe, sparkline: [60,68,65,72,75,78,82] },
  { label: 'Referrals', value: NATIONAL.referrals, change: -2.1, color: '#3B82F6', icon: ArrowUpRight, sparkline: [2.1,2.0,1.9,2.2,2.0,1.8,1.9] },
  { label: 'Staff Count', value: NATIONAL.staffCount, change: 1.2, color: '#EC4899', icon: User, sparkline: [38,39,38.5,40,39.5,41,41.2] },
  { label: 'Drug Adequacy', value: `${NATIONAL.drugAdequacy}%`, change: -3.4, color: '#14B8A6', icon: Package, sparkline: [78,76,75,74,73,72,73] },
];

const KPICards = memo(({ loading }) => (
  <div style={{
    display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8,
    scrollbarWidth: 'thin',
  }}>
    {KPI_CARDS_DATA.map((card, i) => {
      const Icon = card.icon;
      const isUp = card.change > 0;
      return (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: loading ? 0 : 1, y: loading ? 20 : 0 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          style={{
            ...glassmorphism, minWidth: 200, flex: '0 0 auto', padding: '18px 20px',
            borderLeft: `3px solid ${card.color}`,
            position: 'relative', overflow: 'hidden',
          }}
        >
          {loading ? (
            <div>
              <Skeleton height={14} width="60%" style={{ marginBottom: 8 }} />
              <Skeleton height={32} width="80%" style={{ marginBottom: 8 }} />
              <Skeleton height={12} width="40%" />
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 10,
                  background: `${card.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Icon size={16} color={card.color} />
                </div>
                <span className="dm" style={{ fontSize: 12, color: COLORS.textMuted, fontWeight: 500 }}>{card.label}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                <div>
                  <div className="glow-number" style={{ fontSize: 26, color: card.color, lineHeight: 1.1 }}>
                    {typeof card.value === 'number' ? formatNumber(card.value) : card.value}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6 }}>
                    {isUp ? <TrendingUp size={12} color={COLORS.emerald} /> : <TrendingDown size={12} color={COLORS.coral} />}
                    <span style={{ fontSize: 12, color: isUp ? COLORS.emerald : COLORS.coral, fontWeight: 600 }}>
                      {isUp ? '+' : ''}{card.change}%
                    </span>
                    <span style={{ fontSize: 11, color: COLORS.textMuted }}>vs last month</span>
                  </div>
                </div>
                <Sparkline data={card.sparkline} color={card.color} />
              </div>
            </>
          )}
        </motion.div>
      );
    })}
  </div>
));

// ═══════════════════════════════════════════
// OVERVIEW PAGE
// ═══════════════════════════════════════════
const OverviewPage = memo(() => {
  const [loading, setLoading] = useState(true);
  useEffect(() => { const t = setTimeout(() => setLoading(false), 1200); return () => clearTimeout(t); }, []);

  const visitTypeData = [
    { name: 'Outpatient', value: 1200000, fill: COLORS.cyan },
    { name: 'Inpatient', value: 180000, fill: COLORS.purple },
    { name: 'ANC', value: 312000, fill: COLORS.emerald },
    { name: 'Immunisation', value: 891000, fill: COLORS.amber },
  ];

  const topDiagnoses = useMemo(() => {
    const agg = {};
    PHC_DATA.forEach(p => {
      DIAGNOSES.forEach(d => { agg[d] = (agg[d] || 0) + (p.diagnoses[d] || 0); });
    });
    return DIAGNOSES.map(d => ({ name: d, count: agg[d] * 30 })).sort((a, b) => b.count - a.count);
  }, []);

  const radarData = [
    { dim: 'Staffing', value: 72 },
    { dim: 'Visit Rate', value: 85 },
    { dim: 'Satisfaction', value: 68 },
    { dim: 'Drug Avail.', value: 73 },
    { dim: 'Immunisation', value: 81 },
    { dim: 'Reporting', value: 65 },
  ];

  const scatterData = useMemo(() =>
    PHC_DATA.map((p, i) => ({
      x: p.visits.total,
      y: p.satisfactionScore,
      name: p.name,
      state: p.state,
      fill: CHART_COLORS[i % 6],
    })),
  []);

  const medianX = useMemo(() => {
    const sorted = [...PHC_DATA].sort((a, b) => a.visits.total - b.visits.total);
    return sorted[Math.floor(sorted.length / 2)].visits.total;
  }, []);
  const medianY = useMemo(() => {
    const sorted = [...PHC_DATA].sort((a, b) => a.satisfactionScore - b.satisfactionScore);
    return sorted[Math.floor(sorted.length / 2)].satisfactionScore;
  }, []);

  const weeklyData = useMemo(() => {
    return Array.from({ length: 13 }, (_, w) => {
      let sum = 0;
      PHC_DATA.forEach(p => { sum += p.weeklyTrend[w]?.visits || 0; });
      return { week: `W${w + 1}`, visits: sum * 30 };
    });
  }, []);

  const flatDrugTreemap = useMemo(() => {
    const items = [];
    DRUG_TREEMAP.forEach(cat => {
      cat.children.forEach(drug => {
        items.push({ name: drug.name, size: drug.size, fill: drug.fill, category: cat.name });
      });
    });
    return items;
  }, []);

  const totalVisitsDonut = visitTypeData.reduce((s, d) => s + d.value, 0);

  if (loading) {
    return (
      <div>
        <KPICards loading={true} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 20, marginTop: 24 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ ...glassmorphism, padding: 20 }}>
              <Skeleton height={18} width="50%" style={{ marginBottom: 12 }} />
              <Skeleton height={250} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <KPICards loading={false} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 20, marginTop: 24,
      }}>
        {/* ROW 1 */}
        <ChartCard title="Monthly National Visits" subtitle="OPD, Inpatient & ANC trends over 12 months">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={NATIONAL_MONTHLY}>
              <defs>
                <linearGradient id="colorOPD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorIPD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.purple} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.purple} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorANC" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="outpatient" stackId="1" stroke={COLORS.cyan} fill="url(#colorOPD)" name="Outpatient" />
              <Area type="monotone" dataKey="inpatient" stackId="1" stroke={COLORS.purple} fill="url(#colorIPD)" name="Inpatient" />
              <Area type="monotone" dataKey="anc" stackId="1" stroke={COLORS.emerald} fill="url(#colorANC)" name="ANC" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Disease Trend Over Time" subtitle="Top 6 diseases — monthly case counts">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={DISEASE_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11, color: COLORS.textMuted }} />
              {['Malaria','Typhoid','Hypertension','Diabetes','Pneumonia','Diarrhea'].map((d, i) => (
                <Line key={d} type="monotone" dataKey={d} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS[i] }} name={d} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Visit Type Breakdown" subtitle="Distribution across service types">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={visitTypeData}
                cx="50%" cy="45%"
                innerRadius={60} outerRadius={90}
                paddingAngle={3}
                dataKey="value"
                animationBegin={0} animationDuration={800}
              >
                {visitTypeData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <text x="50%" y="42%" textAnchor="middle" fill={COLORS.textPrimary} style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20 }}>
                {formatNumber(totalVisitsDonut)}
              </text>
              <text x="50%" y="52%" textAnchor="middle" fill={COLORS.textMuted} style={{ fontFamily: 'DM Sans', fontSize: 11 }}>
                Total
              </text>
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROW 2 */}
        <ChartCard title="Top 15 Diagnoses Nationally" subtitle="Total case count across all PHCs" style={{ gridColumn: 'span 1' }}>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topDiagnoses} layout="vertical" margin={{ left: 100 }}>
              <defs>
                <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.cyan} />
                  <stop offset="100%" stopColor={COLORS.purple} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={11} width={95} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="url(#barGrad)" radius={[0, 6, 6, 0]} name="Cases" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Drug Dispensing Trend" subtitle="Monthly dispensing by drug category">
          <ResponsiveContainer width="100%" height={420}>
            <AreaChart data={DRUG_TREND}>
              <defs>
                {['Antimalarials','Antibiotics','Antihypertensives','Vitamins'].map((_, i) => (
                  <linearGradient key={i} id={`drugGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS[i]} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={CHART_COLORS[i]} stopOpacity={0} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {['Antimalarials','Antibiotics','Antihypertensives','Vitamins'].map((d, i) => (
                <Area key={d} type="monotone" dataKey={d} stackId="1" stroke={CHART_COLORS[i]} fill={`url(#drugGrad${i})`} name={d} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* FILLER for 2-col row */}
        <div />

        {/* ROW 3 */}
        <ChartCard title="PHC Performance Dimensions" subtitle="National average across 6 metrics">
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke={COLORS.border} />
              <PolarAngleAxis dataKey="dim" stroke={COLORS.textMuted} fontSize={11} />
              <PolarRadiusAxis stroke={COLORS.border} domain={[0, 100]} fontSize={10} />
              <Radar name="National Avg" dataKey="value" stroke={COLORS.cyan} fill={COLORS.cyan} fillOpacity={0.3} dot={{ r: 4, fill: COLORS.cyan }} />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="PHC Visits vs Satisfaction" subtitle="Each dot is one PHC — 200 sampled">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="x" name="Total Visits" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis dataKey="y" name="Satisfaction" stroke={COLORS.textMuted} fontSize={11} domain={[0, 100]} />
              <Tooltip content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload;
                return (
                  <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>
                    <div className="syne" style={{ fontWeight: 700, color: COLORS.textPrimary }}>{d.name}</div>
                    <div className="dm" style={{ color: COLORS.textMuted, fontSize: 11 }}>{d.state}</div>
                    <div style={{ marginTop: 4 }}>Visits: <b>{formatNumber(d.x)}</b></div>
                    <div>Satisfaction: <b>{d.y}%</b></div>
                  </div>
                );
              }} />
              <ReferenceLine x={medianX} stroke={COLORS.textMuted} strokeDasharray="3 3" />
              <ReferenceLine y={medianY} stroke={COLORS.textMuted} strokeDasharray="3 3" />
              <Scatter data={scatterData} fill={COLORS.cyan}>
                {scatterData.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Referrals vs Follow-up Rate" subtitle="Monthly referral volume & follow-up %">
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={REFERRAL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis yAxisId="left" stroke={COLORS.amber} fontSize={11} />
              <YAxis yAxisId="right" orientation="right" stroke={COLORS.cyan} fontSize={11} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="referrals" fill={COLORS.amber} name="Referrals" radius={[4, 4, 0, 0]} opacity={0.8} />
              <Line yAxisId="right" type="monotone" dataKey="followUpRate" stroke={COLORS.cyan} strokeWidth={2} name="Follow-up %" dot={{ r: 3, fill: COLORS.cyan }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROW 4 - Full width */}
        <ChartCard title="Top 10 States by Visits" subtitle="Aggregated monthly visit counts" fullWidth>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={TOP_STATES} layout="vertical" margin={{ left: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="state" stroke={COLORS.textMuted} fontSize={12} width={75} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="visits" name="Total Visits" radius={[0, 8, 8, 0]}>
                {TOP_STATES.map((_, i) => <Cell key={i} fill={CHART_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* ROW 5 */}
        <ChartCard title="Immunisation by Vaccine Type" subtitle="Monthly stacked breakdown by vaccine">
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={IMMUN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {VACCINE_TYPES.map((v, i) => (
                <Bar key={v} dataKey={v} stackId="a" fill={CHART_COLORS[i]} name={v} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="PHC Activity by Day × Hour" subtitle="Heatmap of facility activity intensity">
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(7, 36px)`, gap: 2 }}>
              <div />
              {DAYS.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: 10, color: COLORS.textMuted, padding: '4px 0' }}>{d}</div>
              ))}
              {HOURS.map((hour, hi) => (
                <React.Fragment key={hour}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 8 }}>{hour}</div>
                  {DAYS.map((day, di) => {
                    const cell = HEATMAP_DATA.find(c => c.day === day && c.hour === hour);
                    const intensity = cell ? cell.count / 100 : 0;
                    const bg = intensity < 0.3 ? COLORS.border : intensity < 0.6 ? `rgba(0,212,255,0.25)` : COLORS.cyan;
                    return (
                      <div
                        key={`${day}-${hour}`}
                        title={`${day} ${hour}: ${cell?.count || 0} activities`}
                        style={{
                          width: 36, height: 28, borderRadius: 4, background: bg,
                          opacity: 0.4 + intensity * 0.6, cursor: 'pointer', transition: 'all 0.2s',
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* ROW 6 */}
        <ChartCard title="Drug Dispensing by Category" subtitle="Proportional treemap of drug units dispensed">
          <ResponsiveContainer width="100%" height={300}>
            <Treemap
              data={flatDrugTreemap}
              dataKey="size"
              aspectRatio={4 / 3}
              stroke={COLORS.border}
              content={({ x, y, width, height, name, size, fill }) => {
                const showText = width > 50 && height > 30;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={fill || COLORS.cyan} stroke={COLORS.border} strokeWidth={1} rx={4} opacity={0.8} />
                    {showText && (
                      <>
                        <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={11} fontFamily="DM Sans" fontWeight={600}>{name}</text>
                        <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill={COLORS.textMuted} fontSize={10} fontFamily="DM Sans">{formatNumber(size)}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Weekly Visit Trends" subtitle="Current quarter — 13 weeks">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.cyan} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={COLORS.cyan} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="week" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceBand y1={weeklyData.reduce((s, d) => s + d.visits, 0) / 13 * 0.9} y2={weeklyData.reduce((s, d) => s + d.visits, 0) / 13 * 1.1} fill={COLORS.emerald} fillOpacity={0.05} />
              <Area type="monotone" dataKey="visits" stroke={COLORS.cyan} fill="url(#weeklyGrad)" strokeWidth={2} dot={{ r: 3, fill: COLORS.cyan }} name="Visits" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════
// PHC DIRECTORY PAGE
// ═══════════════════════════════════════════
const DirectoryPage = memo(() => {
  const { selectedState, selectedLGA } = useContext(AppContext);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState('visits.total');
  const [sortDir, setSortDir] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('All');
  const [minVisits, setMinVisits] = useState(0);
  const [minSatisfaction, setMinSatisfaction] = useState(0);
  const [selectedPHC, setSelectedPHC] = useState(null);
  const [showFilters, setShowFilters] = useState(true);
  const perPage = 50;

  const filtered = useMemo(() => {
    let result = [...PHC_DATA];
    if (selectedState && selectedState !== 'All') result = result.filter(p => p.state === selectedState);
    if (selectedLGA && selectedLGA !== 'All') result = result.filter(p => p.lga === selectedLGA);
    if (statusFilter !== 'All') result = result.filter(p => p.status === statusFilter);
    if (minVisits > 0) result = result.filter(p => p.visits.total >= minVisits);
    if (minSatisfaction > 0) result = result.filter(p => p.satisfactionScore >= minSatisfaction);

    const getVal = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);
    result.sort((a, b) => {
      const av = getVal(a, sortKey) ?? 0;
      const bv = getVal(b, sortKey) ?? 0;
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return result;
  }, [selectedState, selectedLGA, statusFilter, minVisits, minSatisfaction, sortKey, sortDir]);

  const scaledCount = Math.round((filtered.length / 200) * 6000);
  const totalPages = Math.ceil(filtered.length / perPage);
  const pageData = filtered.slice((page - 1) * perPage, page * perPage);

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const thStyle = {
    padding: '12px 14px', textAlign: 'left', fontSize: 12, fontWeight: 600,
    color: COLORS.textMuted, cursor: 'pointer', whiteSpace: 'nowrap',
    borderBottom: `1px solid ${COLORS.border}`, fontFamily: "'DM Sans', sans-serif",
    userSelect: 'none',
  };
  const tdStyle = { padding: '12px 14px', fontSize: 13, borderBottom: `1px solid ${COLORS.border}20`, color: COLORS.textPrimary };

  const SortIndicator = ({ field }) => {
    if (sortKey !== field) return null;
    return <span style={{ marginLeft: 4, fontSize: 10 }}>{sortDir === 'asc' ? '▲' : '▼'}</span>;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>PHC Directory</h2>
          <p className="dm" style={{ fontSize: 13, color: COLORS.textMuted, margin: '4px 0 0' }}>
            Showing <span style={{ color: COLORS.cyan, fontWeight: 600 }}>{filtered.length}</span> of <span style={{ color: COLORS.cyan }}>{scaledCount.toLocaleString()}</span> PHCs
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{
            ...glassmorphism, padding: '10px 18px', border: `1px solid ${COLORS.border}`,
            color: COLORS.textPrimary, cursor: 'pointer', borderRadius: 12, fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6, background: glassmorphism.background,
          }}>
            <Filter size={14} /> Filters
          </button>
          <button onClick={() => window.alert('Export coming soon')} className="btn-glow" style={{
            padding: '10px 18px', background: COLORS.cyan, color: '#060B18', border: 'none',
            borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <FileDown size={14} /> Export CSV
          </button>
        </div>
      </div>

      {showFilters && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{
          ...glassmorphism, padding: 20, marginBottom: 20,
          display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap',
        }}>
          <div>
            <label className="dm" style={{ fontSize: 11, color: COLORS.textMuted, display: 'block', marginBottom: 4 }}>Status</label>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} style={{
              padding: '8px 12px', background: 'rgba(6,11,24,0.8)', border: `1px solid ${COLORS.border}`,
              borderRadius: 8, color: COLORS.textPrimary, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
            }}>
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Reporting Issues">Reporting Issues</option>
            </select>
          </div>
          <div>
            <label className="dm" style={{ fontSize: 11, color: COLORS.textMuted, display: 'block', marginBottom: 4 }}>Min Visits: {minVisits}</label>
            <input type="range" min={0} max={20000} step={500} value={minVisits}
              onChange={e => { setMinVisits(+e.target.value); setPage(1); }}
              style={{ width: 140, accentColor: COLORS.cyan }}
            />
          </div>
          <div>
            <label className="dm" style={{ fontSize: 11, color: COLORS.textMuted, display: 'block', marginBottom: 4 }}>Min Satisfaction: {minSatisfaction}%</label>
            <input type="range" min={0} max={100} step={5} value={minSatisfaction}
              onChange={e => { setMinSatisfaction(+e.target.value); setPage(1); }}
              style={{ width: 140, accentColor: COLORS.cyan }}
            />
          </div>
          <button onClick={() => { setStatusFilter('All'); setMinVisits(0); setMinSatisfaction(0); setPage(1); }} style={{
            padding: '8px 16px', background: 'transparent', border: `1px solid ${COLORS.border}`,
            borderRadius: 8, color: COLORS.textMuted, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
          }}>Clear All</button>
        </motion.div>
      )}

      <div style={{ ...glassmorphism, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                <th style={thStyle} onClick={() => toggleSort('name')}>PHC Name<SortIndicator field="name" /></th>
                <th style={thStyle} onClick={() => toggleSort('state')}>State<SortIndicator field="state" /></th>
                <th style={thStyle} onClick={() => toggleSort('lga')}>LGA<SortIndicator field="lga" /></th>
                <th style={thStyle} onClick={() => toggleSort('visits.total')}>Total Visits<SortIndicator field="visits.total" /></th>
                <th style={thStyle} onClick={() => toggleSort('visits.anc')}>ANC<SortIndicator field="visits.anc" /></th>
                <th style={thStyle} onClick={() => toggleSort('deliveries')}>Deliveries<SortIndicator field="deliveries" /></th>
                <th style={thStyle} onClick={() => toggleSort('satisfactionScore')}>Satisfaction<SortIndicator field="satisfactionScore" /></th>
                <th style={thStyle} onClick={() => toggleSort('drugStockLevel')}>Drug Stock<SortIndicator field="drugStockLevel" /></th>
                <th style={thStyle}>Status</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageData.map(p => {
                const satColor = p.satisfactionScore < 50 ? COLORS.coral : p.satisfactionScore < 75 ? COLORS.amber : COLORS.emerald;
                const drugColor = p.drugStockLevel < 30 ? COLORS.coral : p.drugStockLevel < 70 ? COLORS.amber : COLORS.emerald;
                const statusColor = p.status === 'Active' ? COLORS.emerald : p.status === 'Inactive' ? COLORS.coral : COLORS.amber;
                return (
                  <tr key={p.id} style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                    onClick={() => setSelectedPHC(p)}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ ...tdStyle, fontWeight: 500 }}>{p.name}</td>
                    <td style={tdStyle}>{p.state}</td>
                    <td style={tdStyle}>{p.lga}</td>
                    <td style={tdStyle}>{p.visits.total.toLocaleString()}</td>
                    <td style={tdStyle}>{p.visits.anc.toLocaleString()}</td>
                    <td style={tdStyle}>{p.deliveries.toLocaleString()}</td>
                    <td style={{ ...tdStyle, color: satColor, fontWeight: 600 }}>{p.satisfactionScore}%</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden', maxWidth: 60 }}>
                          <div style={{ width: `${p.drugStockLevel}%`, height: '100%', background: drugColor, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 12, color: drugColor }}>{p.drugStockLevel}%</span>
                      </div>
                    </td>
                    <td style={tdStyle}>
                      <span style={{
                        padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                        background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}30`,
                        boxShadow: `0 0 8px ${statusColor}20`,
                      }}>{p.status}</span>
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedPHC(p); }}
                        style={{
                          padding: '6px 14px', background: 'rgba(0,212,255,0.1)', border: `1px solid ${COLORS.cyan}30`,
                          borderRadius: 8, color: COLORS.cyan, cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                        }}
                      >View</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px', borderTop: `1px solid ${COLORS.border}`,
        }}>
          <span className="dm" style={{ fontSize: 13, color: COLORS.textMuted }}>
            Page {page} of {totalPages}
          </span>
          <div style={{ display: 'flex', gap: 6 }}>
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{
              padding: '6px 12px', background: page <= 1 ? COLORS.border : 'rgba(0,212,255,0.1)',
              border: `1px solid ${COLORS.border}`, borderRadius: 8,
              color: page <= 1 ? COLORS.textMuted : COLORS.cyan, cursor: page <= 1 ? 'not-allowed' : 'pointer', fontSize: 12,
            }}>Prev</button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pn = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
              if (pn > totalPages) return null;
              return (
                <button key={pn} onClick={() => setPage(pn)} style={{
                  padding: '6px 12px', background: pn === page ? COLORS.cyan : 'rgba(0,212,255,0.05)',
                  border: `1px solid ${pn === page ? COLORS.cyan : COLORS.border}`, borderRadius: 8,
                  color: pn === page ? '#060B18' : COLORS.textMuted, cursor: 'pointer', fontSize: 12, fontWeight: pn === page ? 700 : 400,
                }}>{pn}</button>
              );
            })}
            <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{
              padding: '6px 12px', background: page >= totalPages ? COLORS.border : 'rgba(0,212,255,0.1)',
              border: `1px solid ${COLORS.border}`, borderRadius: 8,
              color: page >= totalPages ? COLORS.textMuted : COLORS.cyan, cursor: page >= totalPages ? 'not-allowed' : 'pointer', fontSize: 12,
            }}>Next</button>
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      <AnimatePresence>
        {selectedPHC && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedPHC(null)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 99 }}
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              style={{
                position: 'fixed', top: 0, right: 0, width: 420, height: '100vh',
                background: COLORS.card, borderLeft: `1px solid ${COLORS.border}`,
                zIndex: 100, overflowY: 'auto', padding: 24,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                <div>
                  <h3 className="syne" style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{selectedPHC.name}</h3>
                  <p className="dm" style={{ fontSize: 13, color: COLORS.textMuted, margin: '4px 0' }}>{selectedPHC.state} · {selectedPHC.lga}</p>
                  <span style={{
                    padding: '3px 10px', borderRadius: 12, fontSize: 11,
                    background: `${COLORS.purple}20`, color: COLORS.purple, fontWeight: 500,
                  }}>{selectedPHC.type}</span>
                </div>
                <button aria-label="Close panel" onClick={() => setSelectedPHC(null)} style={{
                  background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: 8, padding: 8, cursor: 'pointer', color: COLORS.textMuted, display: 'flex',
                }}>
                  <X size={18} />
                </button>
              </div>

              {/* Mini KPIs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                {[
                  { label: 'Visits', value: selectedPHC.visits.total, color: COLORS.cyan },
                  { label: 'ANC', value: selectedPHC.visits.anc, color: COLORS.purple },
                  { label: 'Staff', value: selectedPHC.staffCount, color: COLORS.emerald },
                  { label: 'Satisfaction', value: `${selectedPHC.satisfactionScore}%`, color: COLORS.amber },
                ].map(k => (
                  <div key={k.label} style={{
                    ...glassmorphism, padding: '12px 14px', borderLeft: `3px solid ${k.color}`,
                  }}>
                    <div className="dm" style={{ fontSize: 11, color: COLORS.textMuted }}>{k.label}</div>
                    <div className="glow-number" style={{ fontSize: 20, color: k.color }}>{typeof k.value === 'number' ? k.value.toLocaleString() : k.value}</div>
                  </div>
                ))}
              </div>

              {/* PHC trend chart */}
              <div style={{ ...glassmorphism, padding: 16, marginBottom: 16 }}>
                <h4 className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>12-Month Visit Trend</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <LineChart data={selectedPHC.monthlyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis stroke={COLORS.textMuted} fontSize={10} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="outpatient" stroke={COLORS.cyan} strokeWidth={2} dot={false} name="OPD" />
                    <Line type="monotone" dataKey="anc" stroke={COLORS.emerald} strokeWidth={2} dot={false} name="ANC" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* PHC visit type donut */}
              <div style={{ ...glassmorphism, padding: 16, marginBottom: 16 }}>
                <h4 className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Visit Breakdown</h4>
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={[
                      { name: 'OPD', value: selectedPHC.visits.outpatient, fill: COLORS.cyan },
                      { name: 'IPD', value: selectedPHC.visits.inpatient, fill: COLORS.purple },
                      { name: 'ANC', value: selectedPHC.visits.anc, fill: COLORS.emerald },
                    ]} innerRadius={35} outerRadius={55} paddingAngle={3} dataKey="value">
                      {[COLORS.cyan, COLORS.purple, COLORS.emerald].map((c, i) => <Cell key={i} fill={c} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top 8 diagnoses */}
              <div style={{ ...glassmorphism, padding: 16, marginBottom: 16 }}>
                <h4 className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Top 8 Diagnoses</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.entries(selectedPHC.diagnoses).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))}
                    layout="vertical" margin={{ left: 90 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis type="number" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={85} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.cyan} radius={[0, 4, 4, 0]} name="Cases" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top 8 drugs */}
              <div style={{ ...glassmorphism, padding: 16 }}>
                <h4 className="syne" style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>Top 8 Drugs</h4>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={Object.entries(selectedPHC.drugs).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, count]) => ({ name, count }))}
                    layout="vertical" margin={{ left: 100 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                    <XAxis type="number" stroke={COLORS.textMuted} fontSize={10} />
                    <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={95} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="count" fill={COLORS.purple} radius={[0, 4, 4, 0]} name="Units" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
});

// ═══════════════════════════════════════════
// COMPARE PHCs PAGE
// ═══════════════════════════════════════════
const ComparePage = memo(() => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];
    const q = searchTerm.toLowerCase();
    return PHC_DATA.filter(p =>
      !selectedIds.includes(p.id) &&
      (p.name.toLowerCase().includes(q) || p.state.toLowerCase().includes(q))
    ).slice(0, 6);
  }, [searchTerm, selectedIds]);

  const selectedPHCs = useMemo(() =>
    selectedIds.map(id => PHC_DATA.find(p => p.id === id)).filter(Boolean),
  [selectedIds]);

  const addPHC = (id) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds([...selectedIds, id]);
      setSearchTerm('');
    }
  };

  const removePHC = (id) => setSelectedIds(selectedIds.filter(x => x !== id));

  // Comparison metrics
  const METRICS = ['visits.total','visits.anc','deliveries','immunisations','staffCount','satisfactionScore','drugStockLevel','referrals'];
  const METRIC_LABELS = ['Total Visits','ANC','Deliveries','Immunisations','Staff','Satisfaction','Drug Stock','Referrals'];

  const getVal = (obj, key) => key.split('.').reduce((o, k) => o?.[k], obj);

  // Grouped monthly visits data
  const monthlyCompare = useMemo(() => {
    return MONTHS.map((m, mi) => {
      const row = { month: m };
      selectedPHCs.forEach(p => {
        row[p.name] = p.monthlyTrend[mi]?.outpatient || 0;
      });
      return row;
    });
  }, [selectedPHCs]);

  // Radar comparison
  const radarCompare = useMemo(() => {
    const dims = ['staffCount','visits.total','satisfactionScore','drugStockLevel','immunisations','referrals'];
    const dimLabels = ['Staffing','Visits','Satisfaction','Drug Avail.','Immunisation','Referrals'];
    return dimLabels.map((label, i) => {
      const row = { dim: label };
      selectedPHCs.forEach(p => {
        const v = getVal(p, dims[i]);
        // Normalize to 0-100 scale
        const maxVals = [45, 20000, 100, 100, 5000, 400];
        row[p.name] = Math.min(100, (v / maxVals[i]) * 100);
      });
      return row;
    });
  }, [selectedPHCs]);

  // Top 8 diagnoses comparison
  const diagCompare = useMemo(() => {
    if (selectedPHCs.length === 0) return [];
    const allDiag = new Set();
    selectedPHCs.forEach(p => Object.keys(p.diagnoses).forEach(d => allDiag.add(d)));
    const diagArr = [...allDiag];
    // Sort by average count across selected PHCs
    diagArr.sort((a, b) => {
      const avgA = selectedPHCs.reduce((s, p) => s + (p.diagnoses[a] || 0), 0) / selectedPHCs.length;
      const avgB = selectedPHCs.reduce((s, p) => s + (p.diagnoses[b] || 0), 0) / selectedPHCs.length;
      return avgB - avgA;
    });
    return diagArr.slice(0, 8).map(d => {
      const row = { name: d };
      selectedPHCs.forEach(p => { row[p.name] = p.diagnoses[d] || 0; });
      return row;
    });
  }, [selectedPHCs]);

  return (
    <div>
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>PHC Comparison Tool</h2>
      <p className="dm" style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 24 }}>Select 2 to 4 PHCs to compare side by side</p>

      {/* PHC Selector */}
      <div style={{ ...glassmorphism, padding: 20, marginBottom: 24 }}>
        <div style={{ position: 'relative', maxWidth: 400, marginBottom: 16 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: COLORS.textMuted }} />
          <input
            placeholder="Search PHC to add..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            disabled={selectedIds.length >= 4}
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: 'rgba(6,11,24,0.8)', border: `1px solid ${COLORS.border}`,
              borderRadius: 12, color: COLORS.textPrimary, fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              opacity: selectedIds.length >= 4 ? 0.5 : 1,
            }}
          />
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 4,
              background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 12,
              maxHeight: 200, overflowY: 'auto', zIndex: 50,
            }}>
              {searchResults.map(p => (
                <div key={p.id} onClick={() => addPHC(p.id)} style={{
                  padding: '10px 16px', cursor: 'pointer', borderBottom: `1px solid ${COLORS.border}20`, fontSize: 13,
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ fontWeight: 500, color: COLORS.textPrimary }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.state} · {p.lga}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {selectedPHCs.map((p, i) => (
            <div key={p.id} style={{
              ...glassmorphism, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
              borderLeft: `3px solid ${CHART_COLORS[i]}`,
            }}>
              <div>
                <div className="dm" style={{ fontWeight: 600, fontSize: 13, color: COLORS.textPrimary }}>{p.name}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{p.state} · {p.lga}</div>
              </div>
              <button onClick={() => removePHC(p.id)} aria-label={`Remove ${p.name}`} style={{
                background: 'rgba(255,107,107,0.1)', border: 'none', borderRadius: 6, padding: 4, cursor: 'pointer', color: COLORS.coral, display: 'flex',
              }}>
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedIds.length > 0 && (
            <button onClick={() => setSelectedIds([])} style={{
              background: 'none', border: 'none', color: COLORS.textMuted, cursor: 'pointer', fontSize: 12, textDecoration: 'underline',
            }}>Clear All</button>
          )}
        </div>
      </div>

      {selectedPHCs.length >= 2 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          <ChartCard title="Monthly Visits Comparison" subtitle="Outpatient visits per PHC">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={monthlyCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis stroke={COLORS.textMuted} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Bar key={p.id} dataKey={p.name} fill={CHART_COLORS[i]} name={p.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Diagnosis Comparison" subtitle="Top 8 diagnoses across selected PHCs">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={diagCompare} layout="vertical" margin={{ left: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={10} width={85} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Bar key={p.id} dataKey={p.name} fill={CHART_COLORS[i]} name={p.name} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Performance Radar" subtitle="Normalized scores overlaid">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarCompare}>
                <PolarGrid stroke={COLORS.border} />
                <PolarAngleAxis dataKey="dim" stroke={COLORS.textMuted} fontSize={10} />
                <PolarRadiusAxis domain={[0, 100]} stroke={COLORS.border} fontSize={9} />
                {selectedPHCs.map((p, i) => (
                  <Radar key={p.id} name={p.name} dataKey={p.name} stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.15} dot={{ r: 3, fill: CHART_COLORS[i] }} />
                ))}
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="12-Month Visit Trend" subtitle="Line comparison over time">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCompare}>
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
                <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
                <YAxis stroke={COLORS.textMuted} fontSize={11} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {selectedPHCs.map((p, i) => (
                  <Line key={p.id} type="monotone" dataKey={p.name} stroke={CHART_COLORS[i]} strokeWidth={2} dot={{ r: 3, fill: CHART_COLORS[i] }} name={p.name} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Comparison Table */}
          <ChartCard title="Metric Comparison Table" subtitle="Best in green, worst in red" fullWidth>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '10px 14px', textAlign: 'left', fontSize: 12, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}` }}>Metric</th>
                    {selectedPHCs.map((p, i) => (
                      <th key={p.id} style={{ padding: '10px 14px', textAlign: 'center', fontSize: 12, color: CHART_COLORS[i], borderBottom: `1px solid ${COLORS.border}`, fontWeight: 700 }}>{p.name}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {METRICS.map((m, mi) => {
                    const values = selectedPHCs.map(p => getVal(p, m));
                    const maxV = Math.max(...values);
                    const minV = Math.min(...values);
                    return (
                      <tr key={m}>
                        <td style={{ padding: '10px 14px', fontSize: 13, color: COLORS.textMuted, borderBottom: `1px solid ${COLORS.border}20` }}>{METRIC_LABELS[mi]}</td>
                        {selectedPHCs.map((p, i) => {
                          const v = getVal(p, m);
                          const isBest = v === maxV && values.filter(x => x === maxV).length === 1;
                          const isWorst = v === minV && values.filter(x => x === minV).length === 1;
                          return (
                            <td key={p.id} style={{
                              padding: '10px 14px', textAlign: 'center', fontSize: 14, fontWeight: 600,
                              borderBottom: `1px solid ${COLORS.border}20`,
                              background: isBest ? 'rgba(16,185,129,0.08)' : isWorst ? 'rgba(255,107,107,0.06)' : 'transparent',
                              color: isBest ? COLORS.emerald : isWorst ? COLORS.coral : COLORS.textPrimary,
                              fontFamily: "'Syne', sans-serif",
                            }}>
                              {typeof v === 'number' ? v.toLocaleString() : v}
                              {m === 'satisfactionScore' || m === 'drugStockLevel' ? '%' : ''}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </ChartCard>
        </div>
      )}

      {selectedPHCs.length < 2 && (
        <div style={{ textAlign: 'center', padding: 60, color: COLORS.textMuted }}>
          <GitCompare size={48} style={{ opacity: 0.3, marginBottom: 16 }} />
          <p className="dm" style={{ fontSize: 15 }}>Select at least 2 PHCs to begin comparison</p>
        </div>
      )}
    </div>
  );
});

// ═══════════════════════════════════════════
// DIAGNOSTICS PAGE
// ═══════════════════════════════════════════
const DiagnosticsPage = memo(() => {
  const flatDiseaseTM = useMemo(() => {
    const items = [];
    DISEASE_TREEMAP.forEach(cat => {
      cat.children.forEach(d => {
        items.push({ name: d.name, size: d.size, fill: d.fill, category: cat.name });
      });
    });
    return items;
  }, []);

  const choleraAlert = EPIDEMIC_DATA.some(d => d.Cholera > 340);
  const meningitisAlert = EPIDEMIC_DATA.some(d => d.Meningitis > 170);

  return (
    <div>
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Diagnostics Intelligence</h2>
      <p className="dm" style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 24 }}>Disease surveillance and diagnostic analytics</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <ChartCard title="Disease Burden by Category" subtitle="Treemap — larger blocks indicate more cases">
          <ResponsiveContainer width="100%" height={320}>
            <Treemap
              data={flatDiseaseTM}
              dataKey="size"
              stroke={COLORS.border}
              content={({ x, y, width, height, name, size, fill }) => {
                const show = width > 45 && height > 25;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={COLORS.border} strokeWidth={1} rx={4} opacity={0.8} />
                    {show && (
                      <>
                        <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={10} fontFamily="DM Sans" fontWeight={600}>{name}</text>
                        <text x={x + width / 2} y={y + height / 2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}>{formatNumber(size)}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Disease × Month Heatmap" subtitle="Intensity matrix — darker = more cases">
          <div style={{ overflowX: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: `140px repeat(12, 36px)`, gap: 2 }}>
              <div />
              {MONTHS.map(m => (
                <div key={m} style={{ textAlign: 'center', fontSize: 9, color: COLORS.textMuted, padding: '4px 0' }}>{m}</div>
              ))}
              {DISEASE_MONTH_MATRIX.map(row => (
                <React.Fragment key={row.disease}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, display: 'flex', alignItems: 'center', paddingRight: 6, whiteSpace: 'nowrap' }}>{row.disease}</div>
                  {row.months.map((val, mi) => {
                    const intensity = val / 100;
                    return (
                      <div
                        key={mi}
                        title={`${row.disease} — ${MONTHS[mi]}: ${val}`}
                        style={{
                          width: 36, height: 22, borderRadius: 3,
                          background: intensity < 0.3 ? COLORS.border : intensity < 0.6 ? `rgba(0,212,255,0.3)` : `rgba(0,212,255,${0.4 + intensity * 0.6})`,
                          cursor: 'pointer',
                        }}
                      />
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Epidemic Alert Tracker" subtitle={
          <span>
            Flagged diseases monitored against thresholds
            {(choleraAlert || meningitisAlert) && (
              <span style={{ color: COLORS.coral, marginLeft: 8, fontWeight: 600 }}>
                <AlertTriangle size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                Alert Active
              </span>
            )}
          </span>
        }>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={EPIDEMIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <ReferenceLine y={340} stroke={COLORS.coral} strokeDasharray="5 5" label={{ value: 'Cholera Threshold', fill: COLORS.coral, fontSize: 10 }} />
              <ReferenceLine y={170} stroke={COLORS.amber} strokeDasharray="5 5" label={{ value: 'Meningitis Threshold', fill: COLORS.amber, fontSize: 10 }} />
              <Line type="monotone" dataKey="Cholera" stroke={COLORS.coral} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Meningitis" stroke={COLORS.amber} strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Monkeypox" stroke={COLORS.purple} strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Age Group Distribution" subtitle="Patient demographics across all PHCs">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={AGE_DISTRIBUTION}
                cx="50%" cy="45%"
                outerRadius={90}
                dataKey="value"
                animationBegin={0} animationDuration={800}
                label={({ name, value }) => `${name}: ${value}%`}
              >
                {AGE_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════
// DRUG DISPENSING PAGE
// ═══════════════════════════════════════════
const DrugPage = memo(() => {
  const flatDrugTM = useMemo(() => {
    const items = [];
    DRUG_TREEMAP.forEach(cat => {
      cat.children.forEach(d => {
        items.push({ name: d.name, size: d.size, fill: d.fill });
      });
    });
    return items;
  }, []);

  const topDrugs = useMemo(() => {
    const agg = {};
    PHC_DATA.forEach(p => {
      DRUGS.forEach(d => { agg[d] = (agg[d] || 0) + (p.drugs[d] || 0); });
    });
    return DRUGS.map(d => ({ name: d, units: agg[d] * 30 })).sort((a, b) => b.units - a.units);
  }, []);

  return (
    <div>
      <h2 className="syne" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>Drug Dispensing Analytics</h2>
      <p className="dm" style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 24 }}>National drug dispensing trends and inventory</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
        <ChartCard title="Drug Dispensing Trend" subtitle="Monthly volumes by category">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={DRUG_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis dataKey="month" stroke={COLORS.textMuted} fontSize={11} />
              <YAxis stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {['Antimalarials','Antibiotics','Antihypertensives','Vitamins'].map((d, i) => (
                <Area key={d} type="monotone" dataKey={d} stackId="1" stroke={CHART_COLORS[i]} fill={CHART_COLORS[i]} fillOpacity={0.3} name={d} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Drug Dispensing Treemap" subtitle="Proportional distribution by drug">
          <ResponsiveContainer width="100%" height={320}>
            <Treemap data={flatDrugTM} dataKey="size" stroke={COLORS.border}
              content={({ x, y, width, height, name, size, fill }) => {
                const show = width > 50 && height > 28;
                return (
                  <g>
                    <rect x={x} y={y} width={width} height={height} fill={fill} stroke={COLORS.border} strokeWidth={1} rx={4} opacity={0.8} />
                    {show && (
                      <>
                        <text x={x + width / 2} y={y + height / 2 - 5} textAnchor="middle" fill="#fff" fontSize={10} fontWeight={600}>{name}</text>
                        <text x={x + width / 2} y={y + height / 2 + 9} textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize={9}>{formatNumber(size)}</text>
                      </>
                    )}
                  </g>
                );
              }}
            />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Top 15 Drugs Dispensed" subtitle="Units dispensed nationally" fullWidth>
          <ResponsiveContainer width="100%" height={420}>
            <BarChart data={topDrugs} layout="vertical" margin={{ left: 140 }}>
              <defs>
                <linearGradient id="drugBarGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={COLORS.purple} />
                  <stop offset="100%" stopColor={COLORS.cyan} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} />
              <XAxis type="number" stroke={COLORS.textMuted} fontSize={11} tickFormatter={formatNumber} />
              <YAxis type="category" dataKey="name" stroke={COLORS.textMuted} fontSize={11} width={135} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="units" fill="url(#drugBarGrad)" radius={[0, 6, 6, 0]} name="Units" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
});

// ═══════════════════════════════════════════
// REPORTS PAGE (placeholder)
// ═══════════════════════════════════════════
const ReportsPage = memo(() => (
  <div style={{ textAlign: 'center', padding: 80 }}>
    <FileDown size={64} color={COLORS.textMuted} style={{ opacity: 0.3, marginBottom: 20 }} />
    <h2 className="syne" style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>Reports Center</h2>
    <p className="dm" style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 24 }}>
      Download formatted reports for national and state-level PHC performance.
    </p>
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
      {['National Summary Report','State Performance Report','Drug Inventory Report','Immunisation Coverage Report'].map(r => (
        <button key={r} onClick={() => window.alert('Export coming soon')} className="btn-glow" style={{
          ...glassmorphism, padding: '14px 24px', border: `1px solid ${COLORS.border}`,
          color: COLORS.textPrimary, cursor: 'pointer', borderRadius: 14, fontSize: 14,
          fontFamily: "'DM Sans', sans-serif", display: 'flex', alignItems: 'center', gap: 8,
          background: glassmorphism.background,
        }}>
          <Download size={16} color={COLORS.cyan} /> {r}
        </button>
      ))}
    </div>
  </div>
));

// ═══════════════════════════════════════════
// MAIN DASHBOARD (POST-LOGIN)
// ═══════════════════════════════════════════
const Dashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedState, setSelectedState] = useState('All');
  const [selectedLGA, setSelectedLGA] = useState('All');
  const [toast, setToast] = useState(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handleLogout = useCallback(() => {
    showToast('Logged out successfully');
    setTimeout(() => onLogout(), 500);
  }, [onLogout, showToast]);

  const contextValue = useMemo(() => ({
    activePage, selectedState, selectedLGA, setSelectedState, setSelectedLGA,
  }), [activePage, selectedState, selectedLGA]);

  const renderPage = () => {
    switch (activePage) {
      case 'overview': return <OverviewPage />;
      case 'directory': return <DirectoryPage />;
      case 'compare': return <ComparePage />;
      case 'diagnostics': return <DiagnosticsPage />;
      case 'drugs': return <DrugPage />;
      case 'reports': return <ReportsPage />;
      default: return <OverviewPage />;
    }
  };

  return (
    <AppContext.Provider value={contextValue}>
      <div style={{ display: 'flex', minHeight: '100vh', background: COLORS.bg }}>
        <Sidebar
          collapsed={sidebarCollapsed}
          activePage={activePage}
          onNavigate={setActivePage}
          onLogout={handleLogout}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />

        <div style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 60 : 240,
          transition: 'margin-left 0.3s ease',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}>
          <HeaderBar
            sidebarCollapsed={sidebarCollapsed}
            activePage={activePage}
            selectedState={selectedState}
            setSelectedState={setSelectedState}
            selectedLGA={selectedLGA}
            setSelectedLGA={setSelectedLGA}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />

          <main style={{ flex: 1, padding: 24, position: 'relative', overflow: 'auto' }}>
            <DotGridBg />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePage}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3 }}
                >
                  {renderPage()}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>

        <AnimatePresence>
          {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </AnimatePresence>
      </div>
    </AppContext.Provider>
  );
};

// ═══════════════════════════════════════════
// ROOT COMPONENT
// ═══════════════════════════════════════════
const PHCDashboard = () => {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <>
      <GlobalStyles />
      <AnimatePresence mode="wait">
        {!authenticated ? (
          <motion.div key="login" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
            <LoginPage onLogin={() => setAuthenticated(true)} />
          </motion.div>
        ) : (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Dashboard onLogout={() => setAuthenticated(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PHCDashboard;
