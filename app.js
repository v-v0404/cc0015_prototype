/* Fit2Join prototype: all demo logic. Fictional people and sample data; not medical advice. */
(() => {
'use strict';

/* ---------- helpers ---------- */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const pad = n => String(n).padStart(2, '0');
const hm = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
const dmy = d => d.getDate() + ' ' + MONTHS[d.getMonth()] + ' ' + d.getFullYear();
const dayLabel = d => DAYS[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS[d.getMonth()];
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const byId = id => document.getElementById(id);
const setText = (id, t) => { const e = byId(id); if (e && e.textContent !== t) e.textContent = t; };
const setState = (id, s) => { const e = byId(id); if (e && e.dataset.state !== s) e.dataset.state = s; };
const setHTML = (id, h) => { const e = byId(id); if (e) e.innerHTML = h; };
const fmtV = v => v.toFixed(1);
let seed = 20261019;
const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
const noise = a => (rnd() - 0.5) * 2 * a;

const I = {
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/></svg>',
  cert:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="9" r="5.5"/><path d="M8.6 13.6 7 21l5-2.8 5 2.8-1.6-7.4"/></svg>',
  pen:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m14 4 6 6"/><path d="M17 7 8 16l-3 1 1-3 9-9"/><path d="m4 20 2-2"/></svg>',
  chat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
  bt:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 7 10 10-5 5V2l5 5L7 17"/></svg>',
  wifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0"/><path d="M5.5 12.5a10 10 0 0 1 13 0"/><path d="M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r=".8"/></svg>',
  nowifi:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9a15 15 0 0 1 20 0"/><path d="M9 16a5 5 0 0 1 6 0"/><path d="M3 3l18 18"/></svg>',
  batt:'<svg viewBox="0 0 26 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="19" height="10" rx="3"/><rect x="4.5" y="9.5" width="12" height="5" rx="1" fill="currentColor" stroke="none"/><path d="M23.5 10.5v3"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5 9-10"/></svg>',
  send:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></svg>',
  lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="2.5"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
  dot:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>',
  phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2.5" width="12" height="19" rx="3"/><path d="M11 18h2"/></svg>',
  cloud:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 9.5a4.3 4.3 0 0 1-.5 8.5z"/></svg>',
  people:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14a6 6 0 0 1 3.5 6"/></svg>',
};

/* ---------- fixed demo data (fictional people and places) ---------- */
const DOCTOR = { name:'Dr Lim Wei Ming', title:'Consultant Endocrinologist', clinic:'Riverside Diabetes Clinic', email:'dr.lim@riversideclinic.example' };
const ORG = { name:'Mr Tan', role:'Teacher-in-charge' };
const EVENT = { name:'Mt Ophir School Hike', place:'Gunung Ledang (Mt Ophir), Johor, Malaysia', code:'OPHIR-2026' };
const BUDDY = 'Marcus';
const ACTIVITIES = [
  { id:'hike', label:'Hiking and trekking' },
  { id:'kayak', label:'Kayaking and water sports' },
  { id:'camp', label:'Overnight camps' },
  { id:'ncc', label:'Uniformed group training (NCC)' },
  { id:'martial', label:'Martial arts' },
  { id:'altitude', label:'Climbs above 3,000 m' },
];
const CONDITIONS = [
  { id:'buddy', label:'A briefed buddy stays with him during the activity', on:true },
  { id:'cgm', label:'Wears his CGM and shares readings with the organiser', on:true },
  { id:'kit', label:'Carries 30 g fast-acting glucose and a glucagon kit', on:true },
  { id:'check', label:'Checks glucose before starting and starts between 7 and 10 mmol/L', on:true },
  { id:'solo', label:'No solo water activities', on:false },
];
const SCENARIOS = [
  { id:'normal', label:'In range', target:6.2, speed:0.28, missed:false, state:'ok' },
  { id:'dropping', label:'Dropping fast', target:4.3, speed:0.2, missed:false, state:'drop' },
  { id:'low', label:'Low', target:3.4, speed:0.55, missed:false, state:'low' },
  { id:'urgent', label:'Urgent low', target:2.7, speed:0.55, missed:false, state:'urgent' },
  { id:'high', label:'High', target:12.6, speed:0.4, missed:false, state:'high' },
  { id:'missed', label:'Missed insulin', target:11.4, speed:0.22, missed:true, state:'missed' },
  { id:'treated', label:'Treated, recovering', target:5.8, speed:0.25, missed:false, state:'ok' },
];
const SCRIPT = [
  { me:"Hi, I'm on the Mt Ophir hike. I went low (3.4) at checkpoint 2 and had 15 g of sugar. Is it OK to keep going?",
    reply:"Good job treating it quickly. Recheck your glucose now. If you're above 3.9 and feel well, have a slower snack such as a cereal bar before you set off again, and keep your CGM alerts on." },
  { me:"I'm at 5.2 now and feel fine.",
    reply:"Great. Your plan from Dr Lim says to snack every 60 to 90 minutes on long hikes. Let Marcus know you're OK, and tap “I'm OK” so Mr Tan sees it too." },
  { me:"Should I change my dinner insulin after hiking all day?",
    reply:"Many people need less insulin after a long active day, and lows can happen overnight. Use the after-exercise adjustment in your plan, check before bed and keep your overnight low alert on. If you're unsure, I can book a quick call with Dr Lim." },
  { me:"Thanks, that helps!",
    reply:"Anytime, Rain. I'm on call until 22:00. Enjoy the summit!" },
];

/* ---------- time anchors ---------- */
const NOW0 = new Date();
const eventStart = new Date(NOW0); eventStart.setHours(6, 0, 0, 0);
const accessEnd = new Date(NOW0); accessEnd.setDate(accessEnd.getDate() + 1); accessEnd.setHours(23, 59, 0, 0);
const minsAgo = m => new Date(Date.now() - m * 60000);

/* ---------- state ---------- */
function makeHistory(base, bump) {
  const h = [];
  for (let i = 0; i < 36; i++) h.push(base + bump * Math.exp(-((i - 13) ** 2) / 26) + noise(0.12));
  return h;
}
function freshState() {
  const hist = makeHistory(6.1, 1.6);
  hist[hist.length - 1] = 6.2;
  return {
    tab:'rain', rainScreen:'home', presenter:false,
    scenario:'normal', target:6.2, speed:0.28, missed:false,
    value:6.2, history:hist, online:true,
    cert:{ status:'none', sentAt:null, signedAt:null, validUntil:null, requested:['hike','kayak','camp','ncc','martial'],
      approved:[], conditions:[], sig:null, id:null,
      plan:{ before:'Check glucose 30 min before. Start between 7 and 10 mmol/L. Reduce breakfast insulin as Dr Lim advised.',
             during:'CGM alerts on. Snack every 60 to 90 min on long hikes. Carry 30 g fast-acting glucose in my hip-belt pocket.',
             night:'Check before bed. Long-acting dose at 22:00. Buddy knows where my glucagon is (backpack top pocket).',
             contact:'Mum, +65 9123 4567 (sample number)' } },
    shared:false,
    doses:[ { t:minsAgo(16 * 60), type:'Long-acting', units:16, note:'Bedtime' },
            { t:minsAgo(4 * 60 + 10), type:'Rapid-acting', units:4, note:'Breakfast, reduced for the hike' } ],
    log:[], queue:[],
    chat:[], chatStep:0,
    docOpen:false, emTab:null, accessEnded:false, watchDismissed:null,
    org:null,
    others:{
      aisha:{ name:'Aisha', buddy:'Priya', value:6.9, target:6.9, history:makeHistory(6.6, 1.2), valid:'3 Mar 2027' },
      junhao:{ name:'Jun Hao', buddy:'Daniel', value:7.6, target:7.7, history:makeHistory(7.2, 1.8), valid:'27 Jul 2027' },
    },
  };
}
let S = freshState();

/* persistence: per-viewer convenience only */
const KEY = 'fit2join-demo-v1';
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify({ cert:S.cert, shared:S.shared, doses:S.doses, docOpen:S.docOpen }));
  } catch (e) { /* storage unavailable: demo still works in memory */ }
}
function load() {
  try {
    const raw = localStorage.getItem(KEY); if (!raw) return;
    const d = JSON.parse(raw);
    if (d.cert) { S.cert = d.cert; ['sentAt','signedAt','validUntil'].forEach(k => { if (S.cert[k]) S.cert[k] = new Date(S.cert[k]); }); }
    if (Array.isArray(d.doses)) S.doses = d.doses.map(x => ({ ...x, t:new Date(x.t) }));
    S.shared = !!d.shared && S.cert.status === 'signed';
    S.docOpen = !!d.docOpen;
    if (S.shared) snapshotOrg();
  } catch (e) { /* ignore broken storage */ }
}

/* ---------- glucose logic ---------- */
function ledFor(v, missed) {
  if (v < 3.0) return { key:'urgent', label:'Urgent low', short:'URGENT LOW' };
  if (v < 3.9) return { key:'low', label:'Low', short:'LOW' };
  if (missed && v >= 8) return { key:'missed', label:'Missed insulin', short:'TAKE INSULIN' };
  if (v > 10) return { key:'high', label:'High', short:'HIGH' };
  return { key:'ok', label:'In range', short:'IN RANGE' };
}
function slopeOf(h) { const n = h.length; return (h[n - 1] - h[n - 3]) / 2; }
function arrowOf(h) {
  const s = slopeOf(h);
  if (s > 0.83) return '↑↑';
  if (s > 0.55) return '↑';
  if (s > 0.28) return '↗';
  if (s < -0.83) return '↓↓';
  if (s < -0.55) return '↓';
  if (s < -0.28) return '↘';
  return '→';
}
/* 'fast' = falling and a low is predicted within ~20 min (4 readings); 'near' = held just above low */
function dropInfo() {
  if (S.value < 3.9 || S.missed) return null;
  const s = slopeOf(S.history);
  if (s <= -0.28 && S.value + 4 * s < 3.9) return 'fast';
  if (S.scenario === 'dropping') return s <= -0.28 ? 'fast' : 'near';
  return null;
}
const isDropping = () => !!dropInfo();
const led = () => ledFor(S.value, S.missed);

function step(p) {
  if (p === S && S.scenario === 'dropping' && p.value > 4.15) {
    p.value = Math.max(4.1, p.value - 0.32 + noise(0.03));
    p.history.push(p.value); if (p.history.length > 36) p.history.shift();
    return;
  }
  const diff = p.target - p.value;
  p.value += diff * (p.speed || 0.15) + noise(Math.abs(diff) < 0.3 ? 0.07 : 0.04);
  p.value = Math.max(2.2, Math.min(22, p.value));
  p.history.push(p.value);
  if (p.history.length > 36) p.history.shift();
}
function snapshotOrg() { S.org = { value:S.value, history:S.history.slice(), missed:S.missed, at:new Date() }; }

/* ---------- events / alerts ---------- */
let nextId = 1;
function addLog(kind, text, opts = {}) {
  const e = { id:nextId++, t:new Date(), kind, text, toOrg:!!opts.toOrg && S.shared, by:opts.by || 'system', acked:false };
  e.delivered = e.toOrg ? S.online : false;
  S.log.push(e);
  if (e.toOrg && !S.online) S.queue.push(e);
  refreshFeeds();
  return e;
}
const SEVERE = ['low','urgent','missed','high'];
function alertText(kind, v) {
  return { low:`Low glucose: ${fmtV(v)} mmol/L`, urgent:`Urgent low: ${fmtV(v)} mmol/L`,
           missed:`Possible missed insulin dose (glucose ${fmtV(v)} and rising)`, high:`High glucose: ${fmtV(v)} mmol/L` }[kind];
}
let prevKey = 'ok', prevDrop = null;
function checkTransitions() {
  const k = led().key;
  const drop = dropInfo();
  if (k !== prevKey) {
    const easing = (prevKey === 'urgent' && k === 'low') || (prevKey === 'missed' && k === 'high');
    if (SEVERE.includes(k) && !easing) addLog(k, alertText(k, S.value), { toOrg:true });
    else if (k === 'ok' && SEVERE.includes(prevKey)) { resolveOpen(); addLog('ok', `Back in range: ${fmtV(S.value)} mmol/L`, { toOrg:true }); }
    prevKey = k; S.watchDismissed = null;
    if (k === 'ok' || k === 'high') S.emTab = null;
    onKeyChange();
  }
  if (drop !== prevDrop) {
    if (drop && !prevDrop) addLog('drop', 'Heading low. Low predicted in about 20 minutes.', { toOrg:false });
    prevDrop = drop;
    onKeyChange();
  }
}
function resolveOpen() { S.log.forEach(e => { if (SEVERE.includes(e.kind)) e.acked = true; }); }
function latestOrgAlert() {
  for (let i = S.log.length - 1; i >= 0; i--) {
    const e = S.log[i];
    if (e.toOrg && e.delivered && SEVERE.includes(e.kind)) return e.acked ? null : e;
  }
  return null;
}

/* ---------- small renderers ---------- */
/* dotted trace: one dot per 5-minute reading, the latest one glowing in the LED colour */
function chartSVG(hist, state, compact) {
  const w = 320, h = compact ? 72 : 150, padL = 4, padR = compact ? 8 : 30, padT = 10, padB = compact ? 6 : 22;
  const ymin = 2, ymax = 15;
  const X = i => padL + (i / (hist.length - 1)) * (w - padL - padR);
  const Y = v => padT + (1 - (Math.min(ymax, Math.max(ymin, v)) - ymin) / (ymax - ymin)) * (h - padT - padB);
  const n = hist.length, last = hist[n - 1];
  const dots = hist.slice(0, -1).map((v, i) => `<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="${compact ? 1.4 : 1.9}" fill-opacity="${(0.35 + 0.65 * i / n).toFixed(2)}"/>`).join('');
  const now = Date.now();
  const ticks = compact ? '' : [3, 2, 1, 0].map(k => {
    const x = X(Math.max(0, n - 1 - k * 12)), lbl = k === 0 ? 'NOW' : hm(new Date(now - k * 36e5));
    return `<line x1="${x}" x2="${x}" y1="${padT}" y2="${h - padB}" stroke="var(--line)" stroke-dasharray="1 4"/><text x="${x}" y="${h - 5}" font-size="9.5" fill="var(--faint)" text-anchor="${k === 3 ? 'start' : k === 0 ? 'end' : 'middle'}" letter-spacing=".08em" font-family="var(--font-body)">${lbl}</text>`;
  }).join('');
  const labels = compact ? '' :
    `<text x="${w - padR + 7}" y="${Y(10) + 3.5}" font-size="9.5" fill="var(--faint)" font-family="var(--font-mono)">10</text>
     <text x="${w - padR + 7}" y="${Y(3.9) + 3.5}" font-size="9.5" fill="var(--faint)" font-family="var(--font-mono)">3.9</text>`;
  return `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Glucose over the last 3 hours, now ${fmtV(last)} mmol/L">
    <rect x="${padL}" y="${Y(10)}" width="${w - padL - padR}" height="${Y(3.9) - Y(10)}" rx="6" fill="#ffffff" fill-opacity=".045"/>
    <line x1="${padL}" x2="${w - padR}" y1="${Y(3.9)}" y2="${Y(3.9)}" stroke="var(--led-low)" stroke-opacity=".45" stroke-dasharray="2 4"/>
    <line x1="${padL}" x2="${w - padR}" y1="${Y(10)}" y2="${Y(10)}" stroke="var(--led-high)" stroke-opacity=".45" stroke-dasharray="2 4"/>
    ${ticks}
    <g fill="var(--ink)">${dots}</g>
    <g class="st" data-state="${state}"><circle cx="${X(n - 1)}" cy="${Y(last)}" r="${compact ? 7 : 11}" fill="var(--c)" fill-opacity=".22"/><circle cx="${X(n - 1)}" cy="${Y(last)}" r="${compact ? 3.6 : 5}" fill="var(--c)" stroke="var(--bg)" stroke-width="1.5"/></g>
    ${labels}</svg>`;
}
const tirOf = h => Math.round(100 * h.filter(v => v >= 3.9 && v <= 10).length / h.length);
const trendAngle = h => Math.max(-90, Math.min(90, -slopeOf(h) * 110));
const ARROW_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 12h14"/><path d="m13 6.5 5.5 5.5-5.5 5.5"/></svg>';
function sigSVG(strokes) {
  if (!strokes) return '';
  const paths = strokes.map(s => 'M' + s.map(p => `${(p[0] * 300).toFixed(1)} ${(p[1] * 100).toFixed(1)}`).join(' L')).join(' ');
  return `<svg viewBox="0 0 300 100" aria-label="Doctor's signature"><path d="${paths}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function savedSignature() {
  const s1 = [], s2 = [], s3 = [];
  for (let i = 0; i <= 60; i++) { const t = i / 60; s1.push([0.08 + 0.5 * t, 0.55 - 0.28 * Math.sin(t * Math.PI * 3.2) * Math.exp(-t * 0.9) + 0.07 * Math.sin(t * Math.PI * 9)]); }
  for (let i = 0; i <= 40; i++) { const t = i / 40; s2.push([0.6 + 0.3 * t, 0.5 + 0.14 * Math.sin(t * Math.PI * 4) - 0.05 * t]); }
  for (let i = 0; i <= 20; i++) { const t = i / 20; s3.push([0.1 + 0.78 * t, 0.84 - 0.04 * t]); }
  return [s1, s2, s3];
}
function qrSVG(text) {
  let h = 0; for (const c of text) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const r = () => { h = (h * 1103515245 + 12345) >>> 0; return h / 4294967296; };
  const N = 25; let cells = '';
  const finder = (x, y) => (x >= 0 && x < 7 && y >= 0 && y < 7) ? ((x === 0 || x === 6 || y === 0 || y === 6) || (x > 1 && x < 5 && y > 1 && y < 5)) : null;
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    let f = finder(x, y); if (f === null) f = finder(x - (N - 7), y); if (f === null) f = finder(x, y - (N - 7));
    const inZone = (x < 8 && y < 8) || (x >= N - 8 && y < 8) || (x < 8 && y >= N - 8);
    const on = f !== null ? f : (inZone ? false : r() > 0.52);
    if (on) cells += `<rect x="${x}" y="${y}" width="1.02" height="1.02"/>`;
  }
  return `<svg viewBox="-1.5 -1.5 ${N + 3} ${N + 3}" role="img" aria-label="Certificate QR code (demo)"><rect x="-1.5" y="-1.5" width="${N + 3}" height="${N + 3}" fill="#ffffff"/><g fill="#1B1520">${cells}</g></svg>`;
}
const lastRapid = () => [...S.doses].reverse().find(d => d.type === 'Rapid-acting');
const lastDose = () => S.doses[S.doses.length - 1];
function toast(msg) {
  const t = byId('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Rain's phone ---------- */
function viewRain() {
  const nav = [['home','Home',I.home],['cert','Certificate',I.cert],['insulin','Insulin',I.pen],['chat','Nurse',I.chat]]
    .map(([id, label, ic]) => `<button class="nav-btn" data-action="go" data-screen="${id}" ${S.rainScreen === id ? 'aria-current="page"' : ''}>${ic}<span>${label}</span></button>`).join('');
  return `<section class="rain-layout" aria-label="Rain's phone app">
    <div class="phone"><div class="phone-screen">
      <div class="statusbar"><span id="phone-clock">${hm(new Date())}</span><span class="sb-right" id="sb-icons">${sbIcons()}</span></div>
      <div class="app-top"><div class="app-brand"><svg viewBox="0 0 30 30" aria-hidden="true"><rect x="1" y="1" width="28" height="28" rx="9" fill="var(--mauve-deep)"/><circle class="st" id="app-led" data-state="${led().key}" cx="15" cy="15" r="5.5" fill="var(--c)"/></svg>Fit2Join</div><div class="app-user" aria-label="Rain">R</div></div>
      <div class="app-body" id="app-body">${rainScreenHTML()}</div>
      ${S.rainScreen === 'chat' ? composerHTML() : ''}
      <nav class="app-nav" aria-label="App sections">${nav}</nav>
    </div></div>
  </section>`;
}
const sbIcons = () => `${I.bt}${S.online ? I.wifi : I.nowifi}${I.batt}`;
function rainScreenHTML() {
  if (S.rainScreen === 'cert') return rainCert();
  if (S.rainScreen === 'insulin') return rainInsulin();
  if (S.rainScreen === 'chat') return rainChat();
  return rainHome();
}
function connHTML() {
  return `<div class="conn">
    <span class="chip on">${I.bt} Sensor to phone</span>
    <span class="chip on">${I.bt} Watch</span>
    <span class="chip ${S.online ? 'on' : 'off'}">${S.online ? I.wifi : I.nowifi} ${S.online ? 'Internet' : 'No signal: alerts queued'}</span>
  </div>`;
}
function rainBannerHTML() {
  const l = led(), v = `<span id="rain-banner-val">${fmtV(S.value)}</span>`;
  const who = S.shared ? `${BUDDY} (buddy) and ${ORG.name} have been alerted.` : `${BUDDY} (buddy) has been alerted over Bluetooth.`;
  if (l.key === 'urgent') return `<div class="banner st" data-state="urgent" role="alert"><h4><span class="led-dot"></span>Urgent low: ${v} mmol/L</h4><p>Stop and treat now with 15 g fast-acting sugar. ${who}</p><div class="row"><button class="btn btn-sm btn-solid" data-action="treat">I've had 15 g sugar</button></div></div>`;
  if (l.key === 'low') return `<div class="banner st" data-state="low" role="alert"><h4><span class="led-dot"></span>Low: ${v} mmol/L</h4><p>Have 15 g fast-acting sugar (3 to 4 glucose tablets), then recheck in 15 minutes. ${who}</p><div class="row"><button class="btn btn-sm btn-solid" data-action="treat">I've had 15 g sugar</button></div></div>`;
  if (l.key === 'missed') { const d = lastRapid(); return `<div class="banner st" data-state="missed" role="alert"><h4><span class="led-dot"></span>Missed insulin dose?</h4><p>No rapid-acting insulin logged since ${d ? hm(new Date(d.t)) : 'this morning'}, and your glucose is rising (${v} mmol/L).</p><div class="row"><button class="btn btn-sm btn-solid" data-action="go" data-screen="insulin">Log a dose</button></div></div>`; }
  if (l.key === 'high') return `<div class="banner st" data-state="high"><h4><span class="led-dot"></span>High: ${v} mmol/L</h4><p>Check that you've taken your insulin and drink some water. Tell ${BUDDY} if you feel unwell.</p></div>`;
  const di = dropInfo();
  if (di === 'fast') return `<div class="banner st" data-state="drop"><h4><span class="led-dot"></span>Dropping fast</h4><p>Low predicted in about 20 minutes. Have a snack before you carry on.</p></div>`;
  if (di === 'near') return `<div class="banner st" data-state="drop"><h4><span class="led-dot"></span>Close to low: ${v} mmol/L</h4><p>Have a snack now and recheck in 15 minutes before you carry on.</p></div>`;
  return '';
}
function feedHTML(forOrg) {
  const items = S.log.filter(e => forOrg ? (e.toOrg && e.delivered) : true).slice(-6).reverse();
  if (!items.length) return `<li class="empty-note" style="display:block">${forOrg ? 'Nothing yet. Alerts and actions for this event appear here.' : 'No alerts today.'}</li>`;
  const stOf = k => ({ low:'low', urgent:'urgent', missed:'missed', high:'high', drop:'drop', ok:'ok' }[k] || 'off');
  return items.map(e => {
    const tag = forOrg ? '' : (e.toOrg ? (e.delivered ? `<span class="tag">Shared with ${ORG.name}</span>` : `<span class="tag q">Queued until signal returns</span>`) : '');
    return `<li class="st" data-state="${stOf(e.kind)}"><span class="t">${hm(e.t)}</span><span><span class="dot"></span>${esc(e.text)}${tag}</span></li>`;
  }).join('');
}
function rainHome() {
  const l = led(), d = lastDose();
  const certShort = S.cert.status === 'signed' ? 'Valid to ' + dmy(new Date(S.cert.validUntil)) : S.cert.status === 'pending' ? 'Waiting for doctor' : 'Not set up';
  const share = S.shared
    ? `${I.lock}<span>${ORG.name} (${EVENT.name}) can see your readings until ${dayLabel(accessEnd)}, ${hm(accessEnd)}. Then they are deleted.</span>`
    : `${I.lock}<span>Your readings are private. Nobody else can see them until you share your certificate with an event.</span>`;
  return `<div id="rain-banner">${rainBannerHTML()}</div>
    <div class="hero st" id="rain-reading" data-state="${l.key}">
      <div class="hero-stats">
        <div class="hero-stat"><span class="k">Time in range</span><span class="v"><span id="rain-tir">${tirOf(S.history)}</span><small>%</small></span><span class="s">Last 3 hours</span></div>
        <div class="hero-stat"><span class="k">Glucose</span><span class="v" id="rain-val">${fmtV(S.value)}</span><span class="s"><span class="led-dot"></span><span class="lbl" id="rain-state">${l.label}</span></span></div>
        <div class="trend-ring" role="img" aria-label="Trend"><span id="rain-trend-rot" style="display:grid;transform:rotate(${trendAngle(S.history).toFixed(0)}deg);transition:transform .6s ease">${ARROW_SVG}</span></div>
      </div>
      <div class="chart" id="rain-chart">${chartSVG(S.history, l.key)}</div>
      <div class="hero-foot"><span>mmol/L · a reading every 5 minutes</span><span id="rain-upd">Just now</span></div>
    </div>
    <div id="rain-conn">${connHTML()}</div>
    <div class="tiles">
      <button class="tile" data-action="go" data-screen="insulin"><span class="tile-k">Last insulin</span><span class="tile-v">${hm(new Date(d.t))} · ${d.units} u ${d.type === 'Rapid-acting' ? 'rapid' : 'long'}</span></button>
      <button class="tile" data-action="go" data-screen="cert"><span class="tile-k">Certificate</span><span class="tile-v">${certShort}</span></button>
    </div>
    <div class="share-line">${share}</div>
    <h3 class="sec-h">Recent alerts</h3>
    <ul class="feed" id="rain-feed">${feedHTML(false)}</ul>`;
}
function rainCert() {
  const c = S.cert;
  if (c.status === 'none') {
    const acts = ACTIVITIES.map(a => `<label class="check"><input type="checkbox" name="act" value="${a.id}" ${c.requested.includes(a.id) ? 'checked' : ''}> ${a.label}</label>`).join('');
    return `<h2 class="screen-title">Get your certificate</h2>
      <p class="hint">Your doctor reviews your plan and signs a digital certificate valid for 12 months. Organisers see what you're cleared for, not your medical file.</p>
      <form class="form card" id="cert-form" novalidate>
        <div class="field"><label for="f-doc">Doctor's email</label><input class="input" id="f-doc" type="email" value="${DOCTOR.email}" required></div>
        <div class="field"><span class="lbl">Activities I want to be cleared for</span><div class="checks">${acts}</div></div>
        <div class="field"><label for="f-before">Before the activity</label><textarea class="textarea" id="f-before">${esc(c.plan.before)}</textarea></div>
        <div class="field"><label for="f-during">During the activity</label><textarea class="textarea" id="f-during">${esc(c.plan.during)}</textarea></div>
        <div class="field"><label for="f-night">Overnight</label><textarea class="textarea" id="f-night">${esc(c.plan.night)}</textarea></div>
        <div class="field"><label for="f-contact">Emergency contact</label><input class="input" id="f-contact" value="${esc(c.plan.contact)}"></div>
        <p class="error" id="cert-error" hidden></p>
        <button class="btn btn-primary btn-block" type="submit">Send to ${DOCTOR.name} for signing</button>
      </form>`;
  }
  if (c.status === 'pending') {
    return `<h2 class="screen-title">Certificate</h2>
      <div class="card" style="display:flex;flex-direction:column;gap:12px">
        <div><strong>Waiting for ${DOCTOR.name} to sign</strong><p class="hint">Emailed to <span class="mono">${DOCTOR.email}</span> at ${hm(new Date(c.sentAt))}</p></div>
        <ol class="steps">
          <li class="done"><span class="step-dot">${I.check}</span>Plan sent to doctor</li>
          <li class="now"><span class="step-dot"></span>Doctor reviewing</li>
          <li><span class="step-dot"></span>Certificate issued</li>
        </ol>
        <p class="hint">Next: open the Doctor tab to see the request arrive.</p>
      </div>`;
  }
  const approved = ACTIVITIES.filter(a => c.approved.includes(a.id));
  const conds = CONDITIONS.filter(x => c.conditions.includes(x.id));
  const shareBlock = S.shared
    ? `<div class="card" style="display:flex;flex-direction:column;gap:8px"><strong>Shared with ${EVENT.name}</strong><p class="hint">${ORG.name} can see this certificate, your live readings and your emergency steps until ${dayLabel(accessEnd)}, ${hm(accessEnd)}. After that the data is deleted automatically.</p><button class="btn btn-sm" data-action="unshare">Stop sharing</button></div>`
    : `<form class="card form" id="share-form"><strong>Share with an event</strong>
        <div class="field"><label for="f-code">Event code from your organiser</label><input class="input mono" id="f-code" value="${EVENT.code}"></div>
        <p class="hint">${ORG.name} will see: this certificate, live glucose and LED colour, and your emergency steps. Access ends 24 hours after the event.</p>
        <button class="btn btn-primary btn-block" type="submit">Share with ${EVENT.name}</button></form>`;
  return `<h2 class="screen-title">Certificate</h2>
    <article class="certificate" aria-label="Fit2Join activity certificate">
      <div class="cert-head"><div><span class="k">Fit2Join activity certificate</span><h3>Rain</h3><span class="id">${c.id}</span></div><span class="valid-pill">Valid</span></div>
      <div class="cert-body">
        <div class="cert-row"><span class="k">Valid</span>${dmy(new Date(c.signedAt))} to ${dmy(new Date(c.validUntil))}</div>
        <div class="cert-row"><span class="k">Cleared for</span><div class="chips">${approved.map(a => `<span class="pill ok">${I.check}${a.label}</span>`).join('')}</div></div>
        ${conds.length ? `<div class="cert-row"><span class="k">Conditions</span><ul class="cond">${conds.map(x => `<li>${x.label}</li>`).join('')}</ul></div>` : ''}
        <div class="sig-row">
          <div><div class="sig">${sigSVG(c.sig)}</div><div class="who"><strong>${DOCTOR.name}</strong><br>${DOCTOR.title}<br><span class="muted">${DOCTOR.clinic}</span></div></div>
          <div><div class="qr">${qrSVG(c.id || 'F2J')}</div><div class="qr-cap">Scan to verify</div></div>
        </div>
      </div>
    </article>
    ${shareBlock}`;
}
function rainInsulin() {
  const list = [...S.doses].reverse().map(d => `<li><span class="t">${hm(new Date(d.t))}</span><span><strong>${d.units} u</strong> ${d.type.toLowerCase()}<span class="tag">${esc(d.note || '')}</span></span></li>`).join('');
  const missed = S.missed && led().key === 'missed';
  return `<h2 class="screen-title">Insulin</h2>
    ${missed ? `<div class="banner st" data-state="missed"><h4><span class="led-dot"></span>Dose may be missed</h4><p>Your glucose is rising and there's no rapid-acting dose since ${hm(new Date(lastRapid().t))}. Log it below if you've taken it, or take it now as your plan says.</p></div>` : ''}
    <div class="share-line">${I.dot}<span>A glucose sensor can't measure insulin. Doses come from your smart insulin pen (connected) or what you log here.</span></div>
    <form class="form card" id="dose-form">
      <strong>Log a dose</strong>
      <div class="tiles">
        <div class="field"><label for="f-type">Type</label><select class="select" id="f-type"><option>Rapid-acting</option><option>Long-acting</option></select></div>
        <div class="field"><label for="f-units">Units</label><input class="input" id="f-units" type="number" min="0.5" max="40" step="0.5" value="4"></div>
      </div>
      <div class="field"><label for="f-note">Note</label><input class="input" id="f-note" value="Lunch at the rest stop"></div>
      <button class="btn btn-primary btn-block" type="submit">Log dose</button>
    </form>
    <h3 class="sec-h">Today</h3>
    <ul class="feed">${list}</ul>
    <p class="hint">Next long-acting dose due at 22:00.</p>`;
}
function rainChat() {
  return `<div class="chat-head card"><div class="avatar">JT</div><div><strong>Nurse Joanne Tay</strong><div class="hint">Diabetes nurse educator</div><div class="oncall">On call until 22:00</div></div></div>
    <div class="chat-log" id="chat-log">${chatLogHTML()}</div>`;
}
function chatLogHTML(typing) {
  const msgs = S.chat.map(m => m.sys ? `<div class="sys">${esc(m.text)}</div>` : `<div class="msg ${m.me ? 'me' : 'them'}">${esc(m.text)}<span class="mt">${hm(m.t)}</span></div>`).join('');
  return `<div class="sys">Demo conversation with scripted replies. Not medical advice.</div>${msgs}${typing ? '<div class="typing" aria-label="Nurse is typing"><span></span><span></span><span></span></div>' : ''}`;
}
function composerHTML() {
  const next = SCRIPT[S.chatStep];
  return `<form class="composer" id="chat-form"><input class="input" id="f-msg" autocomplete="off" aria-label="Message to Nurse Joanne" placeholder="Message Nurse Joanne" value="${next ? esc(next.me) : ''}"><button class="send" type="submit" aria-label="Send">${I.send}</button></form>`;
}

/* ---------- Doctor ---------- */
function viewDoctor() {
  const c = S.cert, hasReq = c.status !== 'none';
  const unread = c.status === 'pending' && !S.docOpen;
  const req = hasReq ? `<button class="mail ${unread ? 'is-unread' : ''}" data-action="open-mail" aria-current="${S.docOpen}"><span class="from">${unread ? '<span class="unread"></span>' : ''}Fit2Join</span><span class="time">${hm(new Date(c.sentAt))}</span><span class="subj">Activity certificate request from Rain (23)${c.status === 'signed' ? ' · Signed' : ''}</span></button>` : '';
  return `<section class="portal" aria-label="Doctor's clinic portal">
    <header class="portal-bar"><div class="clinic"><span class="clinic-mark">RDC</span><div><strong>${DOCTOR.clinic}</strong><span>Clinician portal · Inbox</span></div></div><div class="doc-user"><span class="avatar" style="width:32px;height:32px;font-size:13px">WL</span>${DOCTOR.name}</div></header>
    <div class="portal-grid">
      <div class="inbox"><div class="inbox-h">Inbox</div>${req}
        <button class="mail dim" data-action="noop-mail"><span class="from">Lab results</span><span class="time">09:12</span><span class="subj">HbA1c batch ready (12 patients)</span></button>
        <button class="mail dim" data-action="noop-mail"><span class="from">Clinic admin</span><span class="time">Yesterday</span><span class="subj">Clinic roster for next month</span></button>
      </div>
      <div class="reader" id="reader">${readerHTML()}</div>
    </div>
  </section>`;
}
function readerHTML() {
  const c = S.cert;
  if (c.status === 'none') return `<div class="reader-empty">${I.mail}<strong>No certificate requests waiting</strong><span>When a patient sends an activity plan from the Fit2Join app, it arrives here by email for review and signature.</span></div>`;
  if (!S.docOpen) return `<div class="reader-empty">${I.mail}<strong>New request from Rain</strong><span>Open the Fit2Join message in the inbox to review it.</span></div>`;
  if (c.status === 'signed') {
    const approved = ACTIVITIES.filter(a => c.approved.includes(a.id)).map(a => a.label).join(', ');
    return `<div class="success"><div class="success-mark">${I.check}</div><h2 class="mail-subject">Certificate issued to Rain</h2>
      <p>Certificate <span class="mono">${c.id}</span> is valid until ${dmy(new Date(c.validUntil))}. Rain has been notified in the Fit2Join app.</p>
      <p class="muted">Cleared for: ${esc(approved)}.</p>
      <div class="actions"><button class="btn" data-action="tab" data-tab="rain">View Rain's app</button></div></div>`;
  }
  const valid = new Date(); valid.setFullYear(valid.getFullYear() + 1); valid.setDate(valid.getDate() - 1);
  const acts = ACTIVITIES.map(a => { const req = c.requested.includes(a.id); return `<label class="check"><input type="checkbox" name="appr" value="${a.id}" ${req ? 'checked' : ''}> ${a.label}${req ? '' : ' <span class="muted">(not requested)</span>'}</label>`; }).join('');
  const conds = CONDITIONS.map(x => `<label class="check"><input type="checkbox" name="cond" value="${x.id}" ${x.on ? 'checked' : ''}> ${x.label}</label>`).join('');
  return `<dl class="mail-meta"><dt>From</dt><dd>Fit2Join &lt;no-reply@fit2join.example&gt;</dd><dt>To</dt><dd>${DOCTOR.email}</dd><dt>Received</dt><dd>${dayLabel(new Date(c.sentAt))}, ${hm(new Date(c.sentAt))}</dd></dl>
    <h2 class="mail-subject">Activity certificate request: Rain, 23</h2>
    <p>Rain has asked you to review his activity plan and sign a Fit2Join certificate. Type 1 diabetes since age 1, on multiple daily injections.</p>
    <div><h3 style="font-size:15px;margin-bottom:8px">CGM summary, last 14 days <span class="sample-tag">Sample data</span></h3>
      <div class="stat-grid">
        <div class="stat"><span class="k">Time in range (3.9 to 10)</span><span class="v">78<small>%</small></span></div>
        <div class="stat"><span class="k">Time below 3.9</span><span class="v">2<small>%</small></span></div>
        <div class="stat"><span class="k">Lows needing help, past 12 months</span><span class="v">0</span></div>
        <div class="stat"><span class="k">Hypo awareness</span><span class="v" style="font-size:18px">Intact</span></div>
      </div></div>
    <div class="two-col">
      <div class="plan-q"><span><b>Before</b>${esc(c.plan.before)}</span><span><b>During</b>${esc(c.plan.during)}</span><span><b>Overnight</b>${esc(c.plan.night)}</span><span><b>Emergency contact</b>${esc(c.plan.contact)}</span></div>
      <form id="sign-form" class="form">
        <div class="field"><span class="lbl">Approve activities</span><div class="checks">${acts}</div></div>
        <div class="field"><span class="lbl">Conditions</span><div class="checks">${conds}</div></div>
        <p class="hint">Valid for 12 months, until ${dmy(valid)}.</p>
      </form>
    </div>
    <div class="sigpad-wrap"><span class="lbl" style="font-size:12.5px;font-weight:700;color:var(--muted)">Sign below</span>
      <canvas class="sigpad" id="sigpad" aria-label="Signature pad"></canvas>
      <div class="sig-tools"><button class="btn btn-sm" data-action="sig-saved">Use my saved signature</button><button class="btn btn-sm" data-action="sig-clear">Clear</button></div></div>
    <p class="error" id="sign-error" hidden></p>
    <div class="actions"><button class="btn btn-primary" id="sign-btn" data-action="sign" disabled>Sign and issue certificate</button><button class="btn" data-action="request-changes">Ask Rain for changes</button></div>`;
}
let sig = { strokes:[], drawing:false };
function initSigPad() {
  const cv = byId('sigpad'); if (!cv) return;
  sig = { strokes:[], drawing:false };
  const ctx = cv.getContext('2d');
  const fit = () => {
    const r = cv.getBoundingClientRect(), dpr = window.devicePixelRatio || 1;
    cv.width = Math.max(1, Math.round(r.width * dpr)); cv.height = Math.max(1, Math.round(r.height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); redraw();
  };
  const redraw = () => {
    const r = cv.getBoundingClientRect();
    ctx.clearRect(0, 0, r.width, r.height);
    ctx.strokeStyle = getComputedStyle(document.body).color; ctx.lineWidth = 2.4; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    sig.strokes.forEach(s => { ctx.beginPath(); s.forEach((p, i) => { const x = p[0] * r.width, y = p[1] * r.height; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.stroke(); });
    byId('sign-btn').disabled = sig.strokes.length === 0;
  };
  const pt = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width, (e.clientY - r.top) / r.height]; };
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); sig.drawing = true; sig.strokes.push([pt(e)]); redraw(); });
  cv.addEventListener('pointermove', e => { if (!sig.drawing) return; sig.strokes[sig.strokes.length - 1].push(pt(e)); redraw(); });
  const end = () => { sig.drawing = false; };
  cv.addEventListener('pointerup', end); cv.addEventListener('pointercancel', end);
  sig.redraw = redraw;
  fit();
}

/* ---------- Organiser ---------- */
function viewOrganiser() {
  const head = `<div class="org-head">
      <div><p class="eyebrow">Organiser app · ${ORG.name}, ${ORG.role}</p><h1>${EVENT.name}</h1><p class="meta">${EVENT.place} · Day 1 of 2 · Started ${hm(eventStart)}</p></div>
      <div class="access">${I.clock}<div style="flex:1;min-width:180px"><span class="k">Short-term access</span><span class="v">Readings visible until ${dayLabel(accessEnd)}, ${hm(accessEnd)}. Deleted automatically in <b id="org-countdown">${countdown()}</b>.</span></div>${S.accessEnded ? '' : '<button class="btn btn-sm" data-action="end-access">End access now</button>'}</div>
    </div>`;
  if (S.accessEnded) return head + `<div class="ended">${I.lock}<h2>Access ended</h2><p class="muted">All readings, alerts and certificates for this event have been deleted from the organiser app. Participants keep their own data.</p><button class="btn btn-sm" data-action="restore-access">Restore for the demo</button></div>`;
  return head + `<div id="org-alert">${orgAlertHTML()}</div>
    <div class="org-grid">
      <div class="org-main">
        <div class="summary" id="org-summary">${orgSummaryHTML()}</div>
        <div class="cards" id="org-cards">${rainCardHTML()}${otherCardHTML('aisha')}${otherCardHTML('junhao')}</div>
        <div><h3 class="sec-h" style="margin-bottom:8px">Event log</h3><ul class="log" id="org-log">${feedHTML(true)}</ul></div>
      </div>
      <aside class="panel" id="org-emergency">${emergencyHTML()}</aside>
    </div>`;
}
function countdown() {
  let ms = Math.max(0, accessEnd - new Date());
  const d = Math.floor(ms / 864e5); ms -= d * 864e5; const h = Math.floor(ms / 36e5); ms -= h * 36e5; const m = Math.floor(ms / 6e4);
  return `${d} d ${h} h ${pad(m)} m`;
}
function orgView() {
  // what the organiser can see for Rain right now
  if (!S.shared || !S.org) return null;
  return S.org;
}
function orgSummaryHTML() {
  const alerts = latestOrgAlert() ? 1 : 0;
  const certs = 2 + (S.shared ? 1 : 0);
  return `<span class="s"><b>3</b>participants with T1D</span><span class="s"><b>${alerts}</b>active alert${alerts === 1 ? '' : 's'}</span><span class="s"><b>${certs}/3</b>certificates shared and valid for hiking</span>`;
}
function orgAlertHTML() {
  const e = latestOrgAlert();
  if (!e) return '';
  const o = orgView(); const nowV = o ? fmtV(o.value) : '–';
  const state = e.kind;
  const actions = (state === 'low' || state === 'urgent')
    ? `<button class="btn btn-sm btn-solid" data-action="org-sugar">Mark: 15 g sugar given</button><button class="btn btn-sm" data-action="org-ack">Acknowledge</button>`
    : state === 'missed'
      ? `<button class="btn btn-sm btn-solid" data-action="org-remind">Remind Rain to take insulin</button><button class="btn btn-sm" data-action="org-ack">Acknowledge</button>`
      : `<button class="btn btn-sm" data-action="org-ack">Acknowledge</button>`;
  return `<div class="alert-banner st" data-state="${state}" role="alert"><div><strong><span class="led-dot"></span>Rain: ${esc(e.text)}</strong><span class="sub">Alert at ${hm(e.t)} · now <b id="org-alert-now">${nowV}</b> mmol/L · buddy ${BUDDY} also alerted</span></div><div class="actions">${actions}</div></div>`;
}
function rainCardHTML() {
  if (!S.shared) return `<article class="pcard waiting st" data-state="off"><header><div class="avatar">R</div><div><h3>Rain</h3><p>Buddy: ${BUDDY}</p></div><span class="state-pill"><span class="led-dot"></span>Not shared</span></header><p class="wait">Rain hasn't shared a certificate for this event yet. His readings appear here once he shares it from the Fit2Join app.</p></article>`;
  const o = orgView(), l = ledFor(o.value, o.missed);
  return `<article class="pcard st ${SEVERE.includes(l.key) ? 'is-alert' : ''}" id="pc-rain" data-state="${l.key}">
    <header><div class="avatar">R</div><div><h3>Rain</h3><p>Buddy: ${BUDDY}</p></div><span class="state-pill"><span class="led-dot"></span><span id="pc-rain-state">${l.label}</span></span></header>
    <div class="reading-main"><span class="big" id="pc-rain-val">${fmtV(o.value)}</span><span class="trend" id="pc-rain-trend">${arrowOf(o.history)}</span><span class="unit">mmol/L</span></div>
    <div class="chart" id="pc-rain-chart">${chartSVG(o.history, l.key, true)}</div>
    <footer><span id="pc-rain-upd">${updLine()}</span><span class="certok">Certificate valid to ${dmy(new Date(S.cert.validUntil))} · Hiking ${S.cert.approved.includes('hike') ? 'cleared' : 'not cleared'}</span></footer>
  </article>`;
}
function updLine() {
  if (!S.org) return '';
  return S.online ? 'Updated just now · via internet' : `<span class="offline">No signal since ${hm(S.org.at)}. Alerts still reach ${BUDDY}'s phone over Bluetooth.</span>`;
}
function otherCardHTML(k) {
  const p = S.others[k], l = ledFor(p.value, false);
  return `<article class="pcard st" id="pc-${k}" data-state="${l.key}">
    <header><div class="avatar">${p.name[0]}</div><div><h3>${p.name}</h3><p>Buddy: ${p.buddy}</p></div><span class="state-pill"><span class="led-dot"></span><span id="pc-${k}-state">${l.label}</span></span></header>
    <div class="reading-main"><span class="big" id="pc-${k}-val">${fmtV(p.value)}</span><span class="trend" id="pc-${k}-trend">${arrowOf(p.history)}</span><span class="unit">mmol/L</span></div>
    <div class="chart" id="pc-${k}-chart">${chartSVG(p.history, l.key, true)}</div>
    <footer><span>Updated just now · via internet</span><span class="certok">Certificate valid to ${p.valid} · Hiking cleared</span></footer>
  </article>`;
}
function emergencyHTML() {
  const o = orgView(); const k = o ? ledFor(o.value, o.missed).key : 'ok';
  const tab = S.emTab || ((k === 'missed' || k === 'high') ? 'high' : 'low');
  const lowBody = `<ol>
      <li>Stop the activity and have Rain sit down.</li>
      <li>Give 15 g fast-acting sugar: 3 to 4 glucose tablets or 150 ml of juice.</li>
      <li>Recheck after 15 minutes. Repeat if still below 3.9 mmol/L.</li>
      <li>Once above 3.9, give a snack before continuing.</li></ol>
    <div class="callout"><strong>If Rain can't swallow or is unconscious:</strong> give nothing by mouth, put him in the recovery position, give glucagon if you are trained, and call <b>999</b> (Malaysia) or <b>995</b> in Singapore.</div>`;
  const highBody = `<ol>
      <li>Ask Rain to check his glucose and whether he took his last insulin dose.</li>
      <li>If he missed it, he takes it as his plan says. He logs it in the app.</li>
      <li>Encourage water and a short rest.</li>
      <li>If above 14 mmol/L with nausea, vomiting, stomach pain or drowsiness, get medical help.</li></ol>`;
  return `<div class="panel-h"><h2>Emergency steps for Rain</h2>
      <div class="seg" role="group" aria-label="Choose emergency"><button data-action="em-tab" data-em="low" aria-pressed="${tab === 'low'}">Low sugar</button><button data-action="em-tab" data-em="high" aria-pressed="${tab === 'high'}">High or missed insulin</button></div></div>
    <div class="panel-b">${tab === 'low' ? lowBody : highBody}
      <div class="from-plan"><b>From Rain's signed plan</b><span>Fast-acting glucose: hip-belt pocket</span><span>Glucagon kit: backpack top pocket</span><span>Buddy: ${BUDDY}</span><span>Emergency contact: ${esc(S.cert.plan.contact)}</span></div>
      <button class="btn btn-sm" data-action="org-nurse">Chat with the on-call nurse</button>
      <p class="hint">Demo content for the prototype, not medical advice.</p></div>`;
}

/* ---------- Watch & sensor ---------- */
function viewWatch() {
  const l = led();
  const legend = [
    { s:'ok', n:'Green', r:'3.9 to 10.0 mmol/L', p:'In range. Carry on.' },
    { s:'high', n:'Amber', r:'above 10.0 mmol/L', p:'High. Check insulin, drink water.' },
    { s:'low', n:'Red', r:'below 3.9 mmol/L', p:'Low. Eat 15 g sugar now.' },
    { s:'urgent', n:'Flashing red', r:'below 3.0 mmol/L', p:'Urgent low. Stop and treat; buddy alerted.' },
    { s:'missed', n:'Purple', r:'dose not logged', p:'Missed insulin. Take or log your dose.' },
  ].map(x => `<div class="item st ${x.s === l.key ? 'is-now' : ''}" data-state="${x.s}" data-legend="${x.s}"><span class="name"><span class="led-dot"></span>${x.n}</span><span class="range">${x.r}</span><p>${x.p}</p></div>`).join('');
  return `<section aria-label="Watch and sensor">
    <div class="hw-intro"><h1>One colour, on every device</h1><p class="muted">The sensor's LED and the watch show the same state, so Rain, his buddy and the organiser can read it at a glance.</p></div>
    <div class="hw-row">
      <figure class="hw"><div class="watch"><div class="strap"></div><div class="watch-case" id="watch-case"><div class="watch-screen st" id="watch-screen" data-state="${l.key}">${watchFaceHTML()}</div><div class="crown"></div></div><div class="strap bottom"></div></div><figcaption>Smartwatch app</figcaption></figure>
      <figure class="hw"><div class="sensor-stage"><div class="sensor"><div class="sensor-led st" id="sensor-led" data-state="${l.key}" role="img" aria-label="Sensor LED: ${l.label}"></div></div></div><figcaption>Fit2Join sensor, worn on the upper arm</figcaption></figure>
    </div>
    <div class="legend" id="legend">${legend}</div>
    <div class="how">
      <div class="item">${I.bt}<span><strong>Bluetooth</strong><br>Sensor to phone and watch. Works with no phone signal, so alerts still reach Rain and his buddy on the trail.</span></div>
      <div class="item">${I.cloud}<span><strong>Internet</strong><br>Phone to the organiser's app. If signal drops, alerts queue and send when it returns.</span></div>
    </div>
  </section>`;
}
function watchStateText() { const l = led(); return l.key === 'ok' && dropInfo() ? 'HEADING LOW' : l.short; }
function watchAlertMode() { const k = led().key; return (k === 'low' || k === 'urgent' || k === 'missed') && S.watchDismissed !== k; }
function watchFaceHTML() {
  const l = led(), arrow = arrowOf(S.history);
  if (watchAlertMode()) {
    if (l.key === 'missed') return `<div class="wf-alert-title">INSULIN?</div><div class="wf-mid"><span class="wf-val" id="watch-val" style="font-size:44px">${fmtV(S.value)}</span><span class="wf-trend" id="watch-trend">${arrow}</span></div><div class="wf-msg">No dose logged.<br>Take your insulin.</div><div class="wf-btns"><button class="main" data-action="watch-log">Log dose</button><button data-action="watch-dismiss">Later</button></div>`;
    return `<div class="wf-alert-title">${l.key === 'urgent' ? 'URGENT LOW' : 'LOW'}</div><div class="wf-mid"><span class="wf-val" id="watch-val" style="font-size:48px">${fmtV(S.value)}</span><span class="wf-trend" id="watch-trend">${arrow}</span></div><div class="wf-msg">Eat 15 g sugar now</div><div class="wf-btns"><button class="main" data-action="treat">Treated</button><button data-action="watch-dismiss">Dismiss</button></div>`;
  }
  return `<div class="wf-top"><span id="watch-time">${hm(new Date())}</span>${I.bt}</div>
    <div class="wf-mid"><span class="wf-val" id="watch-val">${fmtV(S.value)}</span><span class="wf-trend" id="watch-trend">${arrow}</span></div>
    <div class="wf-unit">mmol/L</div><div class="wf-state" id="watch-state">${watchStateText()}</div>`;
}

/* ---------- presenter ---------- */
function renderPresenterGrid() {
  byId('pp-grid').innerHTML = SCENARIOS.map((s, i) => `<button class="pp-btn st" data-state="${s.state}" data-action="scenario" data-s="${s.id}" aria-pressed="${S.scenario === s.id}"><span class="led-dot"></span>${s.label}<kbd>${i + 1}</kbd></button>`).join('');
}
function setScenario(id) {
  const s = SCENARIOS.find(x => x.id === id); if (!s) return;
  S.scenario = id; S.target = s.target; S.speed = s.speed;
  if (id === 'missed') S.missed = true; else S.missed = false;
  renderPresenterGrid();
}

/* ---------- render ---------- */
function render() {
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', String(b.dataset.tab === S.tab)));
  const app = byId('app');
  app.innerHTML = ({ rain:viewRain, doctor:viewDoctor, organiser:viewOrganiser, watch:viewWatch })[S.tab]();
  if (S.tab === 'doctor') initSigPad();
  if (S.tab === 'rain' && S.rainScreen === 'chat') { const b = byId('app-body'); if (b) b.scrollTop = b.scrollHeight; }
  updateBadges();
  updateLive();
}
function updateBadges() {
  const db = byId('doc-badge'); db.hidden = !(S.cert.status === 'pending' && !S.docOpen);
  const ob = byId('org-badge'); ob.hidden = !latestOrgAlert();
}
function onKeyChange() {
  const l = led();
  if (S.tab === 'rain' && S.rainScreen === 'home') setHTML('rain-banner', rainBannerHTML());
  if (S.tab === 'rain' && S.rainScreen === 'insulin') { const b = byId('app-body'); const st = b ? b.scrollTop : 0; setHTML('app-body', rainInsulin()); if (b) b.scrollTop = st; }
  if (S.tab === 'organiser' && !S.accessEnded) {
    setHTML('org-alert', orgAlertHTML()); setHTML('org-summary', orgSummaryHTML()); setHTML('org-emergency', emergencyHTML());
    const card = byId('pc-rain'); if (card) card.classList.toggle('is-alert', SEVERE.includes(card.dataset.state));
  }
  if (S.tab === 'watch') {
    const sc = byId('watch-screen'); if (sc) { sc.innerHTML = watchFaceHTML(); sc.dataset.state = l.key; }
    const wc = byId('watch-case'); if (wc && watchAlertMode()) { wc.classList.remove('shake'); void wc.offsetWidth; wc.classList.add('shake'); }
    document.querySelectorAll('[data-legend]').forEach(el => el.classList.toggle('is-now', el.dataset.legend === l.key));
  }
  updateBadges();
}
function refreshFeeds() {
  if (S.tab === 'rain' && S.rainScreen === 'home') setHTML('rain-feed', feedHTML(false));
  if (S.tab === 'organiser' && !S.accessEnded) { setHTML('org-log', feedHTML(true)); setHTML('org-alert', orgAlertHTML()); setHTML('org-summary', orgSummaryHTML()); }
  updateBadges();
}
function updateLive() {
  const l = led(), arrow = arrowOf(S.history), v = fmtV(S.value);
  setState('logo-led', l.key); setState('presenter-toggle', l.key); setState('app-led', l.key);
  setState('pp-reading', l.key); setText('pp-val', v); setText('pp-label', isDropping() && l.key === 'ok' ? 'Dropping fast' : l.label);
  setText('phone-clock', hm(new Date()));
  if (S.tab === 'rain' && S.rainScreen === 'home') {
    setState('rain-reading', l.key); setText('rain-val', v); setText('rain-state', l.label); setText('rain-tir', String(tirOf(S.history)));
    const rot = byId('rain-trend-rot'); if (rot) rot.style.transform = `rotate(${trendAngle(S.history).toFixed(0)}deg)`;
    setText('rain-banner-val', v); setText('rain-upd', 'Just now');
    setHTML('rain-chart', chartSVG(S.history, l.key));
  }
  if (S.tab === 'organiser' && !S.accessEnded) {
    setText('org-countdown', countdown());
    const o = orgView();
    if (o) {
      const ol = ledFor(o.value, o.missed);
      setState('pc-rain', ol.key); setText('pc-rain-val', fmtV(o.value)); setText('pc-rain-trend', arrowOf(o.history)); setText('pc-rain-state', ol.label);
      setHTML('pc-rain-chart', chartSVG(o.history, ol.key, true)); setHTML('pc-rain-upd', updLine()); setText('org-alert-now', fmtV(o.value));
      const card = byId('pc-rain'); if (card) card.classList.toggle('is-alert', SEVERE.includes(ol.key));
    }
    ['aisha','junhao'].forEach(k => { const p = S.others[k], pl = ledFor(p.value, false);
      setState('pc-' + k, pl.key); setText(`pc-${k}-val`, fmtV(p.value)); setText(`pc-${k}-trend`, arrowOf(p.history)); setText(`pc-${k}-state`, pl.label);
      setHTML(`pc-${k}-chart`, chartSVG(p.history, pl.key, true)); });
  }
  if (S.tab === 'watch') {
    setState('watch-screen', l.key); setState('sensor-led', l.key);
    setText('watch-val', v); setText('watch-trend', arrow); setText('watch-time', hm(new Date())); setText('watch-state', watchStateText());
    const sl = byId('sensor-led'); if (sl) sl.setAttribute('aria-label', 'Sensor LED: ' + l.label);
  }
}

/* ---------- tick ---------- */
function tick() {
  step(S);
  step(S.others.aisha); step(S.others.junhao);
  if (Math.abs(S.others.aisha.value - S.others.aisha.target) < 0.2) S.others.aisha.target = 6.4 + rnd() * 1.4;
  if (Math.abs(S.others.junhao.value - S.others.junhao.target) < 0.2) S.others.junhao.target = 6.8 + rnd() * 1.8;
  if (S.shared && S.online) snapshotOrg();
  checkTransitions();
  updateLive();
}

/* ---------- actions ---------- */
function goTab(t) { S.tab = t; render(); window.scrollTo({ top:0 }); }
function treat(by) {
  if (by === 'org') addLog('action', `${ORG.name}: 15 g fast-acting sugar given`, { toOrg:true, by:'org' });
  else addLog('action', 'Rain treated a low with 15 g sugar', { toOrg:true, by:'rain' });
  const e = latestOrgAlert(); if (e) e.acked = true;
  setScenario('treated');
  S.watchDismissed = led().key;
  onKeyChange(); refreshFeeds();
  toast(by === 'org' ? 'Logged: sugar given. Rain and Marcus can see it.' : 'Logged. Glucose should rise in the next 15 minutes.');
}
function issueCert(approved, conditions, strokes) {
  const now = new Date(), until = new Date(now); until.setFullYear(until.getFullYear() + 1); until.setDate(until.getDate() - 1);
  Object.assign(S.cert, { status:'signed', signedAt:now, validUntil:until, approved, conditions, sig:strokes,
    id:'F2J-' + now.getFullYear() + '-' + String(4000 + Math.floor(rnd() * 5999)) });
  S.docOpen = true;
}
const actions = {
  tab:(el) => goTab(el.dataset.tab),
  go:(el) => { S.tab = 'rain'; S.rainScreen = el.dataset.screen; render(); },
  'toggle-presenter':() => togglePresenter(),
  scenario:(el) => { setScenario(el.dataset.s); tick(); toast('Scenario: ' + SCENARIOS.find(x => x.id === el.dataset.s).label); },
  treat:() => treat('rain'),
  'org-sugar':() => treat('org'),
  'org-ack':() => { const e = latestOrgAlert(); if (e) { e.acked = true; addLog('action', `${ORG.name} acknowledged: ${e.text}`, { toOrg:true, by:'org' }); } onKeyChange(); toast('Alert acknowledged'); },
  'org-remind':() => { const e = latestOrgAlert(); if (e) e.acked = true; addLog('action', `${ORG.name} reminded Rain to take his insulin`, { toOrg:true, by:'org' }); onKeyChange(); toast('Reminder sent to Rain\'s phone and watch'); },
  'org-nurse':() => toast('Demo: this opens a chat with the on-call nurse'),
  'em-tab':(el) => { S.emTab = el.dataset.em; setHTML('org-emergency', emergencyHTML()); },
  'end-access':() => { S.accessEnded = true; render(); toast('Access ended. Event data deleted.'); },
  'restore-access':() => { S.accessEnded = false; render(); },
  'watch-dismiss':() => { S.watchDismissed = led().key; onKeyChange(); },
  'watch-log':() => { S.tab = 'rain'; S.rainScreen = 'insulin'; render(); },
  'open-mail':() => { S.docOpen = true; save(); render(); },
  'noop-mail':() => toast('Sample email for the demo'),
  'sig-clear':() => { sig.strokes = []; sig.redraw && sig.redraw(); },
  'sig-saved':() => { sig.strokes = savedSignature(); sig.redraw && sig.redraw(); },
  'request-changes':() => toast('Demo: this sends a note back to Rain asking for changes'),
  sign:() => {
    const approved = [...document.querySelectorAll('input[name="appr"]:checked')].map(i => i.value);
    const conditions = [...document.querySelectorAll('input[name="cond"]:checked')].map(i => i.value);
    const err = byId('sign-error');
    if (!approved.length) { err.textContent = 'Approve at least one activity before signing.'; err.hidden = false; return; }
    if (!sig.strokes.length) { err.textContent = 'Add your signature first.'; err.hidden = false; return; }
    issueCert(approved, conditions, sig.strokes.map(s => s.map(p => [Math.max(0, Math.min(1, p[0])), Math.max(0, Math.min(1, p[1]))])));
    addLog('info', `${DOCTOR.name} signed your certificate (valid to ${dmy(S.cert.validUntil)})`);
    save(); render(); toast('Certificate issued. Rain has been notified.');
  },
  unshare:() => { S.shared = false; S.org = null; addLog('info', `Stopped sharing with ${EVENT.name}`); save(); render(); toast('Sharing stopped. The organiser can no longer see your data.'); },
  'ff-cert':() => {
    if (S.cert.status !== 'signed') { if (!S.cert.sentAt) S.cert.sentAt = minsAgo(30); issueCert(['hike','kayak','camp','ncc','martial'], CONDITIONS.filter(c => c.on).map(c => c.id), savedSignature()); }
    if (!S.shared) { S.shared = true; snapshotOrg(); addLog('info', `Certificate shared with ${EVENT.name}`); }
    save(); render(); toast('Certificate signed and shared with the hike');
  },
  reset:() => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    const keepPresenter = S.presenter; S = freshState(); S.presenter = keepPresenter; prevKey = 'ok'; prevDrop = null;
    renderPresenterGrid(); byId('pp-online').checked = true; render(); toast('Demo reset');
  },
};
document.addEventListener('click', e => {
  const t = e.target.closest('[data-action]'); if (!t) return;
  const fn = actions[t.dataset.action]; if (fn) { e.preventDefault(); fn(t, e); }
});
document.addEventListener('submit', e => {
  e.preventDefault();
  const f = e.target;
  if (f.id === 'cert-form') {
    const email = byId('f-doc').value.trim();
    const req = [...f.querySelectorAll('input[name="act"]:checked')].map(i => i.value);
    const err = byId('cert-error');
    if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Enter your doctor\'s email address.'; err.hidden = false; return; }
    if (!req.length) { err.textContent = 'Choose at least one activity.'; err.hidden = false; return; }
    Object.assign(S.cert.plan, { before:byId('f-before').value, during:byId('f-during').value, night:byId('f-night').value, contact:byId('f-contact').value });
    S.cert.requested = req; S.cert.status = 'pending'; S.cert.sentAt = new Date(); S.docOpen = false;
    addLog('info', `Activity plan emailed to ${DOCTOR.name} for signing`);
    save(); render(); toast(`Sent to ${DOCTOR.name}'s inbox`);
  }
  if (f.id === 'share-form') {
    const code = byId('f-code').value.trim().toUpperCase();
    if (code !== EVENT.code) { toast(`No event found for ${code || 'that code'}. Try ${EVENT.code}.`); return; }
    S.shared = true; snapshotOrg(); addLog('info', `Certificate shared with ${EVENT.name}`); save(); render(); toast(`Shared with ${ORG.name} until ${dayLabel(accessEnd)}`);
  }
  if (f.id === 'dose-form') {
    const units = parseFloat(byId('f-units').value);
    if (!(units > 0)) { toast('Enter the number of units'); return; }
    const type = byId('f-type').value;
    S.doses.push({ t:new Date(), type, units, note:byId('f-note').value });
    if (S.missed && type === 'Rapid-acting') resolveOpen();
    addLog('action', `Rain logged ${units} u ${type.toLowerCase()} insulin`, { toOrg:true, by:'rain' });
    if (S.missed && type === 'Rapid-acting') { S.missed = false; S.scenario = 'treated'; S.target = 7.2; S.speed = 0.2; renderPresenterGrid(); }
    save(); render(); toast('Dose logged');
  }
  if (f.id === 'chat-form') {
    const input = byId('f-msg'); const text = input.value.trim(); if (!text) return;
    S.chat.push({ me:true, text, t:new Date() }); input.value = '';
    const step = SCRIPT[S.chatStep]; S.chatStep++;
    setHTML('chat-log', chatLogHTML(true)); scrollChat();
    setTimeout(() => {
      S.chat.push({ me:false, text: step ? step.reply : 'Thanks, Rain. Message me any time during the hike.', t:new Date() });
      if (S.tab === 'rain' && S.rainScreen === 'chat') {
        setHTML('chat-log', chatLogHTML(false)); scrollChat();
        const nx = SCRIPT[S.chatStep]; const inp = byId('f-msg'); if (inp && !inp.value) inp.value = nx ? nx.me : '';
      }
    }, 1300);
  }
});
function scrollChat() { const b = byId('app-body'); if (b) b.scrollTop = b.scrollHeight; }
byId('pp-online').addEventListener('change', e => {
  S.online = e.target.checked;
  if (S.online) {
    const n = S.queue.length; S.queue.forEach(x => { x.delivered = true; }); S.queue = [];
    if (S.shared) snapshotOrg();
    if (n) toast(`Signal back: ${n} queued alert${n === 1 ? '' : 's'} sent to ${ORG.name}`); else toast('Internet on');
  } else toast('Internet off: Bluetooth alerts still work');
  setHTML('sb-icons', sbIcons()); setHTML('rain-conn', connHTML());
  if (S.tab === 'organiser') render(); else refreshFeeds();
});
function togglePresenter(force) {
  S.presenter = typeof force === 'boolean' ? force : !S.presenter;
  byId('presenter').hidden = !S.presenter;
  byId('presenter-toggle').setAttribute('aria-expanded', String(S.presenter));
}
document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  if (tag === 'input' || tag === 'textarea' || tag === 'select' || e.metaKey || e.ctrlKey || e.altKey) return;
  if (e.key === 'p' || e.key === 'P') { togglePresenter(); return; }
  if (S.presenter && /^[1-7]$/.test(e.key)) { const s = SCENARIOS[Number(e.key) - 1]; setScenario(s.id); tick(); toast('Scenario: ' + s.label); }
});
window.addEventListener('resize', () => { if (S.tab === 'doctor' && byId('sigpad')) { const strokes = sig.strokes; initSigPad(); sig.strokes = strokes; sig.redraw && sig.redraw(); } });

/* ---------- boot ---------- */
load();
renderPresenterGrid();
render();
setInterval(tick, 1500);
})();
