import { useState, useEffect, useRef } from "react";

// ─── PALETTE (dari referensi lo) ─────────────────────────────
const P = {
  garnet:   "#792E29",  // urgent / high priority / template
  raisin:   "#24201D",  // bg utama
  olive:    "#565538",  // vector / selected
  grullo:   "#ABA38F",  // secondary text / border
  timber:   "#D9D4C8",  // primary text / light surface
  // derived
  raisin2:  "#2E2924",  // card surface
  raisin3:  "#342E28",  // elevated card
  raisin4:  "#3C3530",  // hover
  garnetBg: "rgba(121,46,41,0.18)",
  oliveBg:  "rgba(86,85,56,0.22)",
  grulloBg: "rgba(171,163,143,0.14)",
  timberBg: "rgba(217,212,200,0.10)",
};

const MONTHS = [
  {n:"Januari",  e:"❄️",  s:"Musim Dingin"},
  {n:"Februari", e:"🌸",  s:"Awal Semi"},
  {n:"Maret",    e:"🌱",  s:"Semi Baru"},
  {n:"April",    e:"🍃",  s:"Hijau Muda"},
  {n:"Mei",      e:"🌿",  s:"Daun Segar"},
  {n:"Juni",     e:"🌧️", s:"Musim Hujan"},
  {n:"Juli",     e:"☀️",  s:"Puncak Panas"},
  {n:"Agustus",  e:"🌾",  s:"Akhir Panas"},
  {n:"September",e:"🍂",  s:"Awal Gugur"},
  {n:"Oktober",  e:"🍁",  s:"Puncak Gugur"},
  {n:"November", e:"🍄",  s:"Akhir Gugur"},
  {n:"Desember", e:"🌨️", s:"Awal Dingin"},
];
const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];
const pad = n => String(n).padStart(2,"0");

// Event type colors — mapped ke palette
const TC = {
  vector:   { bg:"#565538", text:"#D9D4C8", pill:"rgba(86,85,56,0.3)",  label:"Vector"   },
  texture:  { bg:"#7A6E5A", text:"#D9D4C8", pill:"rgba(122,110,90,0.3)",label:"Texture"  },
  template: { bg:"#792E29", text:"#D9D4C8", pill:"rgba(121,46,41,0.3)", label:"Template" },
};
const PC = {
  high:   { color:"#C4584A", bg:"rgba(196,88,74,0.15)"   },
  medium: { color:"#ABA38F", bg:"rgba(171,163,143,0.15)" },
  low:    { color:"#665E50", bg:"rgba(102,94,80,0.15)"   },
};

// ─── EVENT DATA ───────────────────────────────────────────────
const EVT = {
  "2026-05-01":[{id:"e501",title:"Labour Day — Worker Illustration",type:"vector",priority:"high",
    desc:"Worker flat set — helmet, tools, solidarity hands. Min 3 pose berbeda. Upload segera karena H-0.",
    uploadDl:"Segera — H-0",
    kw:["labour day vector","workers may flat","industry worker solidarity"],
    tasks:[{l:"Sketsa 3 pose karakter",dl:"Hari ini"},{l:"Lineart + coloring",dl:"2 Mei"},{l:"Export .AI + .EPS",dl:"3 Mei"},{l:"Export JPG preview 4MP+",dl:"3 Mei"},{l:"Upload & metadata",dl:"4 Mei"}]
  }],
  "2026-05-07":[{id:"e507",title:"Organic Abstract Texture Pack #1",type:"texture",priority:"high",
    desc:"3 variasi: warm terracotta, cool teal, neutral stone. JPG 5000px+. Fondasi portofolio.",
    uploadDl:"Evergreen",
    kw:["abstract organic background","fluid blob texture","modern art wallpaper"],
    tasks:[{l:"Variasi warm — terracotta",dl:"1 Mei"},{l:"Variasi cool — teal",dl:"3 Mei"},{l:"Variasi neutral — stone",dl:"5 Mei"},{l:"Export JPG 5000px",dl:"6 Mei"},{l:"Upload ketiga file",dl:"7 Mei"}]
  }],
  "2026-05-10":[
    {id:"e510a",title:"Mother's Day — Illustration",type:"vector",priority:"high",
      desc:"Ibu & anak, floral wreath, floral frame. Min 3 variasi komposisi.",uploadDl:"26 Apr (H-14)",
      kw:["mother's day flat illustration","mom child vector","floral mother greeting"],
      tasks:[{l:"Komposisi 1 — ibu & anak",dl:"20 Apr"},{l:"Komposisi 2 — floral wreath",dl:"22 Apr"},{l:"Komposisi 3 — hands & flower",dl:"23 Apr"},{l:"Export .AI + .EPS + JPG",dl:"25 Apr"},{l:"Upload + 50 keyword",dl:"26 Apr"}]},
    {id:"e510b",title:"Mother's Day — Template Pack",type:"template",priority:"high",
      desc:"Greeting card A4 + social media 1080×1080. Font-free, placeholder teks.",uploadDl:"26 Apr (H-14)",
      kw:["mothers day card template","mom greeting design","family celebration layout"],
      tasks:[{l:"Layout A4 card",dl:"21 Apr"},{l:"Layout 1080×1080 feed",dl:"22 Apr"},{l:"Outline semua font",dl:"24 Apr"},{l:"Export + upload",dl:"26 Apr"}]},
  ],
  "2026-05-14":[{id:"e514",title:"Kenaikan Yesus Kristus",type:"vector",priority:"low",
    desc:"Dove, cross silhouette, light beam. Palette putih, biru muda, gold.",uploadDl:"30 Apr (H-14)",
    kw:["ascension day vector","christian holiday illustration","dove cross silhouette"],
    tasks:[{l:"Dove + cross silhouette",dl:"27 Apr"},{l:"Light ray effect",dl:"28 Apr"},{l:"Export + upload",dl:"30 Apr"}]
  }],
  "2026-05-20":[{id:"e520",title:"World Bee Day + Botanical Pack",type:"vector",priority:"medium",
    desc:"Bee & honey illustration + seamless honeycomb pattern. Dua konten satu tema.",uploadDl:"6 Mei (H-14)",
    kw:["bee day vector","honey botanical illustration","seamless bee pattern"],
    tasks:[{l:"Lebah flat illustration",dl:"1 Mei"},{l:"Honey jar & comb elements",dl:"3 Mei"},{l:"Seamless honeycomb tile",dl:"4 Mei"},{l:"Export + upload",dl:"6 Mei"}]
  }],
  "2026-05-21":[{id:"e521",title:"Cultural Diversity Day",type:"vector",priority:"medium",
    desc:"Multicultural flat people — diverse faces, hands together, globe unity.",uploadDl:"7 Mei (H-14)",
    kw:["cultural diversity illustration","multicultural people flat","inclusion diversity"],
    tasks:[{l:"6 karakter diverse",dl:"3 Mei"},{l:"Komposisi hands together",dl:"5 Mei"},{l:"Globe unity element",dl:"6 Mei"},{l:"Export + upload",dl:"7 Mei"}]
  }],
  "2026-05-24":[{id:"e524",title:"Hari Raya Waisak",type:"vector",priority:"medium",
    desc:"Lotus mandala, Buddha silhouette modern, spiritual ornament.",uploadDl:"10 Mei (H-14)",
    kw:["vesak day vector","lotus mandala illustration","buddhist spiritual art"],
    tasks:[{l:"Lotus mandala detail",dl:"6 Mei"},{l:"Buddha silhouette",dl:"8 Mei"},{l:"Spiritual ornament border",dl:"9 Mei"},{l:"Export + upload",dl:"10 Mei"}]
  }],
  "2026-05-27":[
    {id:"e527a",title:"⭐ Idul Adha — Illustration Set",type:"vector",priority:"high",
      desc:"Target 5–7 aset: lantern, kambing, masjid, geometric border, arabesque. Momen terbesar Q2.",uploadDl:"13 Mei (H-14)",
      kw:["eid al adha vector","islamic celebration illustration","qurban sacrifice flat"],
      tasks:[{l:"Lantern Idul Adha flat",dl:"5 Mei"},{l:"Kambing (goat) vector",dl:"6 Mei"},{l:"Masjid + bulan sabit",dl:"7 Mei"},{l:"Islamic geometric border",dl:"8 Mei"},{l:"Arabesque ornament",dl:"9 Mei"},{l:"Bulan & bintang icon",dl:"10 Mei"},{l:"Quality check",dl:"12 Mei"},{l:"Upload semua aset",dl:"13 Mei ⚠️"}]},
    {id:"e527b",title:"Idul Adha — Template Pack",type:"template",priority:"high",
      desc:"Poster A4 + stories 1080×1920 + feed 1080×1080.",uploadDl:"13 Mei (H-14)",
      kw:["eid al adha template","idul adha poster design","islamic greeting card"],
      tasks:[{l:"Layout A4 portrait",dl:"8 Mei"},{l:"Layout stories 1080×1920",dl:"9 Mei"},{l:"Layout feed 1080×1080",dl:"10 Mei"},{l:"Font outline check",dl:"11 Mei"},{l:"Export + upload",dl:"13 Mei ⚠️"}]},
    {id:"e527c",title:"Islamic Geometric Pattern",type:"texture",priority:"high",
      desc:"Arabesque seamless reusable. Evergreen + event-driven. Green & gold.",uploadDl:"13 Mei (H-14)",
      kw:["islamic geometric pattern seamless","arabesque texture","muslim ornament tile"],
      tasks:[{l:"Desain tile arabesque",dl:"9 Mei"},{l:"Test seamless 4 arah",dl:"10 Mei"},{l:"Export JPG 5000px + EPS",dl:"12 Mei"},{l:"Upload",dl:"13 Mei ⚠️"}]},
  ],
  "2026-05-31":[{id:"e531",title:"Modern Batik Pattern Set",type:"vector",priority:"high",
    desc:"3–5 variasi: Kawung, Parang, Mega Mendung kontemporer. Niche terkuat — langka di platform global.",uploadDl:"Evergreen",
    kw:["batik pattern vector","indonesian traditional seamless","modern batik design"],
    tasks:[{l:"Batik Kawung modern",dl:"15–17 Mei"},{l:"Batik Parang kontemporer",dl:"18–20 Mei"},{l:"Mega Mendung reinterpretasi",dl:"20–23 Mei"},{l:"Variasi warna 2–3 per motif",dl:"23–26 Mei"},{l:"Export EPS + JPG",dl:"28 Mei"},{l:"Upload + keyword Indonesia",dl:"31 Mei"}]
  }],
  "2026-06-01":[
    {id:"e601a",title:"Hari Lahir Pancasila",type:"vector",priority:"high",
      desc:"Garuda stylized modern, geometric merah putih, 5 simbol sila.",uploadDl:"18 Mei (H-14)",
      kw:["pancasila day vector","indonesia national day illustration","garuda pancasila geometric"],
      tasks:[{l:"Garuda stylized modern",dl:"12 Mei"},{l:"Geometric merah putih",dl:"14 Mei"},{l:"5 sila simbolik visual",dl:"15 Mei"},{l:"Export + upload",dl:"18 Mei"}]},
    {id:"e601b",title:"Pancasila — Poster Template",type:"template",priority:"high",
      desc:"Poster A3 + stories 1080×1920. Merah putih palette.",uploadDl:"18 Mei (H-14)",
      kw:["pancasila template poster","indonesia national day design","merah putih layout"],
      tasks:[{l:"Layout poster A3",dl:"14 Mei"},{l:"Layout stories 9:16",dl:"15 Mei"},{l:"Font-free check",dl:"16 Mei"},{l:"Export + upload",dl:"18 Mei"}]},
  ],
  "2026-06-05":[{id:"e605",title:"World Environment Day",type:"vector",priority:"high",
    desc:"Eco flat — bumi hijau, daur ulang, renewable energy, zero waste icons.",uploadDl:"22 Mei (H-14)",
    kw:["environment day vector","eco sustainability illustration","green earth flat"],
    tasks:[{l:"Earth/globe flat illustration",dl:"16 Mei"},{l:"Recycle icon set 10+",dl:"17 Mei"},{l:"Renewable energy icons",dl:"18 Mei"},{l:"Zero waste visual",dl:"19 Mei"},{l:"Export + upload",dl:"22 Mei"}]
  }],
  "2026-06-08":[{id:"e608",title:"World Oceans Day — Texture",type:"texture",priority:"medium",
    desc:"Marine seamless + ocean wave pattern + coral reef flat.",uploadDl:"25 Mei (H-14)",
    kw:["ocean day texture","marine seamless pattern","wave ocean background"],
    tasks:[{l:"Wave seamless pattern",dl:"19 Mei"},{l:"Marine deep blue texture",dl:"21 Mei"},{l:"Coral reef flat element",dl:"22 Mei"},{l:"Export + upload",dl:"25 Mei"}]
  }],
  "2026-06-17":[{id:"e617",title:"1 Muharam 1448H",type:"vector",priority:"high",
    desc:"Crescent & star, hijri calendar visual, kaligrafi-inspired ornament.",uploadDl:"3 Jun (H-14)",
    kw:["islamic new year vector","muharram illustration","1448 hijri art"],
    tasks:[{l:"Crescent moon & star flat",dl:"29 Mei"},{l:"Hijri typography ornament",dl:"31 Mei"},{l:"Kaligrafi-inspired border",dl:"1 Jun"},{l:"Export + upload",dl:"3 Jun"}]
  }],
  "2026-06-21":[
    {id:"e621a",title:"Father's Day — Illustration",type:"vector",priority:"high",
      desc:"Father-child flat: outdoor, membaca, memasak. Warm earthy maskulin.",uploadDl:"7 Jun (H-14)",
      kw:["father's day flat illustration","dad child vector","fathers day art"],
      tasks:[{l:"Scene 1 — outdoor",dl:"1 Jun"},{l:"Scene 2 — membaca",dl:"3 Jun"},{l:"Scene 3 — memasak",dl:"4 Jun"},{l:"Export + upload",dl:"7 Jun"}]},
    {id:"e621b",title:"Father's Day — Template",type:"template",priority:"high",
      desc:"Card A4 + social media 1080px. Tone maskulin, warm earthy.",uploadDl:"7 Jun (H-14)",
      kw:["fathers day template","dad card design layout","father appreciation poster"],
      tasks:[{l:"Layout A4 card",dl:"3 Jun"},{l:"Layout 1080px square",dl:"4 Jun"},{l:"Font check + outline",dl:"5 Jun"},{l:"Export + upload",dl:"7 Jun"}]},
  ],
  "2026-07-04":[{id:"e704",title:"US Independence Day",type:"vector",priority:"medium",
    desc:"Americana flat — stars & stripes, fireworks, red/white/blue.",uploadDl:"20 Jun (H-14)",
    kw:["independence day vector","4th july illustration","americana stars stripes"],
    tasks:[{l:"Stars & stripes seamless",dl:"13 Jun"},{l:"Fireworks silhouette",dl:"15 Jun"},{l:"Americana flat icons",dl:"16 Jun"},{l:"Poster template",dl:"18 Jun"},{l:"Export + upload",dl:"20 Jun"}]
  }],
  "2026-07-10":[{id:"e710",title:"Tropical Summer Texture Pack",type:"texture",priority:"high",
    desc:"Palm leaf seamless, tropical fruit pattern, ocean teal.",uploadDl:"Evergreen",
    kw:["tropical seamless pattern","summer palm texture","beach background vector"],
    tasks:[{l:"Palm leaf seamless",dl:"1–3 Jul"},{l:"Tropical fruit elements",dl:"3–5 Jul"},{l:"Ocean teal texture",dl:"5–7 Jul"},{l:"Hibiscus flat illustration",dl:"7 Jul"},{l:"Export bundle + upload",dl:"10 Jul"}]
  }],
  "2026-07-20":[{id:"e720",title:"⚠️ Pre-prod HUT RI ke-81",type:"vector",priority:"high",
    desc:"MULAI SEKARANG. Upload deadline 27 Jul (H-21 dari 17 Agt). Target 8–12 aset.",uploadDl:"27 Jul (H-21)",
    kw:["indonesia independence day vector","garuda illustration","merah putih pattern"],
    tasks:[{l:"Riset & referensi visual",dl:"16 Jul"},{l:"Garuda Pancasila stylized",dl:"17–18 Jul"},{l:"Ornamen Jawa & Bali",dl:"18–19 Jul"},{l:"Ornamen Dayak & Minang",dl:"19–20 Jul"},{l:"Wayang kulit modern",dl:"20–21 Jul"},{l:"Peta Indonesia vector",dl:"21 Jul"},{l:"Rumah adat silhouette",dl:"22 Jul"},{l:"Produksi finalisasi .AI",dl:"22–25 Jul"},{l:"Export .EPS + JPG",dl:"25–26 Jul"},{l:"Upload + metadata",dl:"27 Jul ⚠️"}]
  }],
  "2026-07-30":[{id:"e730",title:"Friendship Day",type:"vector",priority:"low",
    desc:"Community togetherness — diverse hands, friendship circle.",uploadDl:"16 Jul (H-14)",
    kw:["friendship day vector","community togetherness illustration"],
    tasks:[{l:"Diverse hands composition",dl:"13 Jul"},{l:"Friendship circle",dl:"14 Jul"},{l:"Export + upload",dl:"16 Jul"}]
  }],
  "2026-08-10":[{id:"e810",title:"Back to School — Global",type:"vector",priority:"medium",
    desc:"School supplies flat, education icon set, notebook seamless.",uploadDl:"Awal Agustus",
    kw:["back to school vector","education flat icon set","school supplies illustration"],
    tasks:[{l:"10+ school supplies icon",dl:"1–3 Agt"},{l:"Seamless notebook pattern",dl:"3–5 Agt"},{l:"Poster template",dl:"5–8 Agt"},{l:"Export + upload",dl:"10 Agt"}]
  }],
  "2026-08-17":[
    {id:"e817a",title:"🇮🇩 HUT RI ke-81 — Main Set",type:"vector",priority:"high",
      desc:"PELUANG EMAS. Konten Indonesia autentik sangat langka di platform global. Target 8–12 aset.",uploadDl:"27 Jul (H-21)",
      kw:["indonesia independence day vector","garuda pancasila illustration","indonesian ornament batik"],
      tasks:[{l:"Garuda Pancasila stylized",dl:"17 Jul"},{l:"Merah putih geometric",dl:"18 Jul"},{l:"Ornamen Jawa kontemporer",dl:"19 Jul"},{l:"Ornamen Bali kontemporer",dl:"19 Jul"},{l:"Ornamen Dayak",dl:"20 Jul"},{l:"Wayang kulit modern",dl:"21 Jul"},{l:"Peta Indonesia vector",dl:"22 Jul"},{l:"Rumah adat 4 suku",dl:"23 Jul"},{l:"Batik motif versi HUT",dl:"24 Jul"},{l:"Rempah & flora lokal",dl:"25 Jul"},{l:"Quality check",dl:"26 Jul"},{l:"Upload + keyword",dl:"27 Jul ⚠️"}]},
    {id:"e817b",title:"HUT RI — Template Bundle",type:"template",priority:"high",
      desc:"Poster A2/A3 + twibbon 1:1 + stories 9:16 + banner web.",uploadDl:"27 Jul (H-21)",
      kw:["hut ri 81 template","indonesia independence poster","17 agustus design"],
      tasks:[{l:"Poster A2/A3",dl:"22 Jul"},{l:"Twibbon 1:1",dl:"23 Jul"},{l:"Stories 9:16",dl:"24 Jul"},{l:"Web banner",dl:"25 Jul"},{l:"Font-free check",dl:"26 Jul"},{l:"Export + upload",dl:"27 Jul ⚠️"}]},
    {id:"e817c",title:"Merah Putih Geometric Texture",type:"texture",priority:"high",
      desc:"Seamless pattern merah putih geometric modern.",uploadDl:"27 Jul (H-21)",
      kw:["merah putih pattern seamless","indonesia national colors texture"],
      tasks:[{l:"Desain tile geometric",dl:"23 Jul"},{l:"Test seamless 4 arah",dl:"24 Jul"},{l:"Export JPG 5000px + EPS",dl:"25 Jul"},{l:"Upload",dl:"27 Jul ⚠️"}]},
  ],
  "2026-08-26":[{id:"e826",title:"Maulid Nabi Muhammad SAW",type:"vector",priority:"high",
    desc:"Islamic art: ornament green & gold, masjid, lantern. Reuse dari Idul Adha.",uploadDl:"12 Agt (H-14)",
    kw:["maulid nabi vector","prophet birthday islamic art","green gold islamic ornament"],
    tasks:[{l:"Variasi ornament green & gold",dl:"6 Agt"},{l:"Lantern versi Maulid",dl:"7 Agt"},{l:"Masjid silhouette versi 2",dl:"8 Agt"},{l:"Template poster Maulid",dl:"10 Agt"},{l:"Export + upload",dl:"12 Agt"}]
  }],
  "2026-09-10":[{id:"e910",title:"Autumn Season Batch",type:"texture",priority:"medium",
    desc:"Harvest texture, pumpkin seamless, maple leaf. Upload sekarang = siap Oktober.",uploadDl:"10 Sep",
    kw:["autumn texture","fall season pattern","harvest background seamless"],
    tasks:[{l:"Maple leaf seamless",dl:"1–3 Sep"},{l:"Pumpkin + harvest texture",dl:"3–5 Sep"},{l:"Warm amber background",dl:"5–7 Sep"},{l:"Autumn botanical flat",dl:"7–9 Sep"},{l:"Export bundle + upload",dl:"10 Sep"}]
  }],
  "2026-10-10":[{id:"e1010",title:"⚠️ Halloween — Full Produksi",type:"vector",priority:"high",
    desc:"Upload hari ini (H-21 dari 31 Okt). Demand spike terbesar Oktober.",uploadDl:"10 Okt (H-21)",
    kw:["halloween vector spooky","horror flat icons","dark halloween pattern"],
    tasks:[{l:"Spooky flat icon set 10+",dl:"1–3 Okt"},{l:"Dark cobweb seamless",dl:"3–5 Okt"},{l:"Moonlight background texture",dl:"5–7 Okt"},{l:"Halloween party template",dl:"7–9 Okt"},{l:"Export + upload",dl:"10 Okt ⚠️"}]
  }],
  "2026-11-01":[{id:"e1101",title:"⚠️ Start Christmas Production",type:"vector",priority:"high",
    desc:"MULAI SEKARANG. Upload 24 Nov (H-30). 10–15 aset. Desember = bulan terbesar.",uploadDl:"24 Nov (H-30)",
    kw:["christmas vector","holiday illustration","santa flat design","xmas ornament"],
    tasks:[{l:"Santa Claus flat vector",dl:"1–4 Nov"},{l:"Christmas tree geometric",dl:"4–6 Nov"},{l:"Ornament balls set",dl:"6–8 Nov"},{l:"Reindeer flat illustration",dl:"8–9 Nov"},{l:"Snowflake collection",dl:"9–10 Nov"},{l:"Gift box icon set",dl:"10–11 Nov"},{l:"Seamless xmas pattern",dl:"11–13 Nov"},{l:"Snow bokeh texture",dl:"13–15 Nov"},{l:"Gift wrap seamless",dl:"15–17 Nov"},{l:"Christmas template A4",dl:"17–19 Nov"},{l:"Stories template 9:16",dl:"19–20 Nov"},{l:"New Year Eve set",dl:"20–22 Nov"},{l:"Export semua file",dl:"22–23 Nov"},{l:"Upload + keyword holiday",dl:"24 Nov ⚠️"}]
  }],
  "2026-11-26":[{id:"e1126",title:"Thanksgiving + Winter",type:"vector",priority:"medium",
    desc:"Turkey, pumpkin, cornucopia flat. Produksi sebelum fokus Christmas.",uploadDl:"12 Nov (H-14)",
    kw:["thanksgiving vector","harvest illustration flat","autumn feast cornucopia"],
    tasks:[{l:"Turkey flat illustration",dl:"6 Nov"},{l:"Harvest cornucopia set",dl:"8 Nov"},{l:"Thanksgiving poster template",dl:"10 Nov"},{l:"Export + upload",dl:"12 Nov"}]
  }],
  "2026-12-01":[
    {id:"e1201a",title:"Christmas Vector Set",type:"vector",priority:"high",
      desc:"Santa, tree geometric, ornament, reindeer, snowflake. Min 8 aset.",uploadDl:"24 Nov (H-30)",
      kw:["christmas vector illustration","santa flat design","xmas ornament"],
      tasks:[{l:"Santa flat final",dl:"15 Nov"},{l:"Tree geometric final",dl:"16 Nov"},{l:"Ornament set final",dl:"17 Nov"},{l:"Reindeer + snowflake",dl:"18 Nov"},{l:"Export bundle",dl:"22 Nov"},{l:"Upload + keyword",dl:"24 Nov"}]},
    {id:"e1201b",title:"Christmas Texture Pack",type:"texture",priority:"high",
      desc:"Snow bokeh, gift wrap seamless, plaid holiday.",uploadDl:"24 Nov (H-30)",
      kw:["christmas texture background","snow pattern seamless","holiday bokeh"],
      tasks:[{l:"Snow bokeh background",dl:"15 Nov"},{l:"Gift wrap seamless",dl:"17 Nov"},{l:"Plaid holiday pattern",dl:"19 Nov"},{l:"Export + upload",dl:"24 Nov"}]},
  ],
  "2026-12-25":[
    {id:"e1225a",title:"Christmas & NYE Template",type:"template",priority:"high",
      desc:"Poster + greeting card + social media kit. Christmas + NYE hitam/emas.",uploadDl:"24 Nov (H-30)",
      kw:["christmas template poster","holiday greeting card","new year celebration layout"],
      tasks:[{l:"Christmas poster template",dl:"15 Nov"},{l:"NYE poster template",dl:"17 Nov"},{l:"Greeting card set A4",dl:"19 Nov"},{l:"Social media kit 1080px",dl:"21 Nov"},{l:"Export bundle + upload",dl:"24 Nov"}]},
    {id:"e1225b",title:"New Year Eve 2027 — Set",type:"vector",priority:"high",
      desc:"Fireworks flat, champagne, confetti, party elements.",uploadDl:"24 Nov (H-38)",
      kw:["new year eve vector","2027 celebration illustration","fireworks party flat"],
      tasks:[{l:"Fireworks flat set",dl:"15 Nov"},{l:"Champagne & confetti",dl:"17 Nov"},{l:"Party icons & balloons",dl:"18 Nov"},{l:"Countdown typography",dl:"20 Nov"},{l:"Export + upload",dl:"24 Nov"}]},
  ],
};

export default function App() {
  const today = new Date();
  const [month,  setMonth]  = useState(4);
  const [year,   setYear]   = useState(2026);
  const [sel,    setSel]    = useState(null);
  const [filt,   setFilt]   = useState("all");
  const [checks, setChecks] = useState({});
  const [open,   setOpen]   = useState(null);
  const [sheet,  setSheet]  = useState(false); // bottom sheet open
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const sheetRef = useRef(null);

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  // close sheet on outside tap
  useEffect(() => {
    if (!sheet) return;
    const fn = e => { if (sheetRef.current && !sheetRef.current.contains(e.target)) { setSheet(false); } };
    setTimeout(() => document.addEventListener("mousedown", fn), 100);
    return () => document.removeEventListener("mousedown", fn);
  }, [sheet]);

  const nav = dir => {
    let m=month+dir, y=year;
    if(m<0){m=11;y--;} if(m>11){m=0;y++;}
    setMonth(m); setYear(y); setSel(null); setSheet(false); setOpen(null);
  };

  const pickDay = d => {
    if (!d) return;
    const evs = getEv(d);
    if (!evs.length) { setSel(d===sel?null:d); setSheet(false); return; }
    setSel(d); setOpen(null);
    setSheet(true);
  };

  const dKey = d => `${year}-${pad(month+1)}-${pad(d)}`;
  const getEv = d => { if(!d) return []; const a=EVT[dKey(d)]||[]; return filt==="all"?a:a.filter(e=>e.type===filt); };
  const isTdy = d => d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
  const firstDow  = new Date(year,month,1).getDay();
  const daysInMon = new Date(year,month+1,0).getDate();
  const cells = [...Array(firstDow).fill(null),...Array.from({length:daysInMon},(_,i)=>i+1)];

  const mPfx  = `${year}-${pad(month+1)}`;
  const mKeys = Object.keys(EVT).filter(k=>k.startsWith(mPfx));
  const hiEv  = mKeys.reduce((s,k)=>s+EVT[k].filter(e=>e.priority==="high").length,0);

  const prg = ev => { const d=ev.tasks.filter((_,i)=>checks[`${ev.id}_${i}`]).length; return {done:d,total:ev.tasks.length,pct:Math.round((d/ev.tasks.length)*100)}; };
  const tog = (id,i) => setChecks(p=>({...p,[`${id}_${i}`]:!p[`${id}_${i}`]}));
  const selEvts = sel ? getEv(sel) : [];
  const Mo = MONTHS[month];

  // ── CELL HEIGHT based on max events in month
  const maxInCell = Math.max(...cells.map(d => d ? getEv(d).length : 0), 1);
  const cellH = isMobile
    ? Math.max(64, Math.min(90, 52 + maxInCell * 16))
    : Math.max(80, Math.min(120, 60 + maxInCell * 18));

  return (
    <div style={{background:P.raisin,color:P.timber,fontFamily:"'DM Sans',system-ui,sans-serif",
      height:"100dvh",display:"flex",flexDirection:"column",overflow:"hidden"}}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${P.raisin3};border-radius:4px;}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        .cell:hover{background:${P.raisin3} !important;}
        .ch:hover{background:${P.raisin3} !important;}
        .tr:hover{background:${P.raisin3} !important;}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{background:P.raisin2,borderBottom:`1px solid ${P.raisin3}`,
        padding:isMobile?"10px 16px 8px":"12px 20px 10px",flexShrink:0}}>
        {/* top row */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"10px"}}>
          <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
            <span style={{fontSize:"20px"}}>{Mo.e}</span>
            <div>
              <div style={{fontFamily:"'Playfair Display',Georgia,serif",
                fontSize:isMobile?"20px":"22px",fontWeight:"600",
                color:P.timber,lineHeight:1,letterSpacing:"-0.01em"}}>{Mo.n}</div>
              <div style={{fontSize:"10px",color:P.grullo,marginTop:"2px"}}>{Mo.s} · {year}</div>
            </div>
          </div>
          <div style={{display:"flex",gap:"4px",alignItems:"center"}}>
            <button onClick={()=>nav(-1)} style={{...navBtn}}>‹</button>
            <button onClick={()=>{setMonth(today.getMonth());setYear(today.getFullYear());setSel(null);setSheet(false);}} style={{...navBtn,fontSize:"16px"}}>○</button>
            <button onClick={()=>nav(1)} style={{...navBtn}}>›</button>
          </div>
        </div>

        {/* filter pills */}
        <div style={{display:"flex",gap:"5px",alignItems:"center"}}>
          {[{k:"all",label:"Semua"},...Object.entries(TC).map(([k,v])=>({k,label:isMobile?k.slice(0,3).toUpperCase():v.label}))].map(({k,label})=>{
            const active = filt===k;
            const col = k==="all" ? P.timber : TC[k]?.bg;
            return (
              <button key={k} onClick={()=>setFilt(k)}
                style={{fontSize:"10px",padding:"4px 11px",borderRadius:"20px",cursor:"pointer",
                  border:`1px solid ${active?(k==="all"?P.grullo:col+"88"):P.raisin3}`,
                  background:active?(k==="all"?P.raisin3:col+"33"):"transparent",
                  color:active?(k==="all"?P.timber:P.timber):P.grullo,
                  fontWeight:active?"500":"400",transition:"all .15s"}}>
                {label}
              </button>
            );
          })}
          {hiEv>0&&<div style={{marginLeft:"auto",fontSize:"9.5px",color:PC.high.color,
            display:"flex",alignItems:"center",gap:"4px"}}>
            <div style={{width:"5px",height:"5px",borderRadius:"50%",background:PC.high.color}}/>
            {hiEv} urgent
          </div>}
        </div>
      </div>

      {/* ── DAY LABELS ── */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
        padding:"6px 8px 2px",background:P.raisin2,flexShrink:0,
        borderBottom:`1px solid ${P.raisin3}`}}>
        {DAYS.map((d,i)=>(
          <div key={d} style={{textAlign:"center",fontSize:"10px",fontWeight:"500",
            color:i===0?"#A06060":i===6?"#606080":P.grullo,letterSpacing:"0.04em"}}>{d}</div>
        ))}
      </div>

      {/* ── CALENDAR GRID ── */}
      <div style={{flex:1,overflow:"auto",padding:"4px 6px 80px"}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px"}}>
          {cells.map((d,i)=>{
            const ev = getEv(d);
            const hasPri = ev.some(e=>e.priority==="high");
            const isSel = d===sel, isTod = isTdy(d);
            const allDone = ev.length>0&&ev.every(e=>prg(e).done===e.tasks.length);
            return (
              <div key={i} className={d?"cell":""} onClick={()=>pickDay(d)}
                style={{minHeight:`${cellH}px`,borderRadius:"8px",padding:"5px 4px",
                  background:isSel?P.raisin3:"transparent",
                  border:`1px solid ${isSel?P.grullo+"44":"transparent"}`,
                  cursor:d?"pointer":"default",position:"relative",
                  transition:"background .12s"}}>
                {d&&<>
                  {/* date number */}
                  <div style={{display:"flex",alignItems:"center",justifyContent:"center",
                    width:isMobile?"22px":"24px",height:isMobile?"22px":"24px",
                    borderRadius:"50%",margin:"0 auto 3px",
                    background:isTod?P.garnet:"transparent"}}>
                    <span style={{fontSize:isMobile?"10.5px":"11px",fontWeight:isTod?"600":"400",
                      color:isTod?"#fff":ev.length?P.timber:P.grullo}}>
                      {d}
                    </span>
                  </div>

                  {/* event chips */}
                  <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                    {ev.slice(0,isMobile?2:3).map((e,ei)=>{
                      const t=TC[e.type];
                      const done=prg(e).pct===100;
                      return (
                        <div key={ei} style={{
                          background:done?P.raisin3:t.bg,
                          borderRadius:"3px",padding:isMobile?"1px 4px":"2px 5px",
                          display:"flex",alignItems:"center",gap:"3px",
                          opacity:done?0.5:1,
                          border:e.priority==="high"&&!done?`1px solid ${P.garnet}44`:"1px solid transparent",
                        }}>
                          {e.priority==="high"&&!done&&(
                            <div style={{width:"3px",height:"3px",borderRadius:"50%",background:P.garnet,flexShrink:0}}/>
                          )}
                          <span style={{fontSize:isMobile?"8px":"9px",color:P.timber,
                            fontWeight:"400",lineHeight:"1.3",
                            overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis",
                            opacity:done?0.6:1}}>
                            {e.title.replace(/^[⭐🇮🇩⚠️]\s*/,"")}
                          </span>
                        </div>
                      );
                    })}
                    {ev.length > (isMobile?2:3) && (
                      <div style={{fontSize:"8px",color:P.grullo,paddingLeft:"4px"}}>
                        +{ev.length-(isMobile?2:3)} lagi
                      </div>
                    )}
                  </div>

                  {/* all done badge */}
                  {allDone&&<div style={{position:"absolute",top:"4px",right:"4px",
                    fontSize:"7px",color:P.olive}}>✓</div>}
                </>}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM SHEET OVERLAY ── */}
      {sheet&&(
        <div style={{position:"fixed",inset:0,background:"rgba(24,20,16,0.6)",zIndex:50,
          animation:"fadeIn .2s ease"}}>
          <div ref={sheetRef}
            style={{position:"absolute",bottom:0,left:0,right:0,
              background:P.raisin2,borderRadius:"20px 20px 0 0",
              maxHeight:"82vh",display:"flex",flexDirection:"column",
              animation:"slideUp .28s cubic-bezier(.32,.72,0,1)"}}>

            {/* sheet handle */}
            <div style={{display:"flex",justifyContent:"center",padding:"10px 0 0"}}>
              <div style={{width:"36px",height:"4px",borderRadius:"2px",background:P.raisin4}}/>
            </div>

            {/* sheet header */}
            <div style={{padding:"12px 20px 10px",borderBottom:`1px solid ${P.raisin3}`,flexShrink:0}}>
              <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
                <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"17px",fontWeight:"600",
                  color:P.timber}}>
                  {Mo.e} {sel} {Mo.n} {year}
                </div>
                <button onClick={()=>setSheet(false)} style={{background:"transparent",border:"none",
                  color:P.grullo,cursor:"pointer",fontSize:"20px",lineHeight:1,padding:"0 0 0 12px"}}>×</button>
              </div>
              <div style={{fontSize:"10px",color:P.grullo,marginTop:"2px"}}>{selEvts.length} konten dijadwalkan</div>
            </div>

            {/* sheet content */}
            <div style={{overflow:"auto",padding:"14px 16px 32px",flex:1}}>
              {selEvts.length===0 ? (
                <div style={{background:P.raisin3,borderRadius:"12px",padding:"18px 20px",
                  borderLeft:`3px solid ${P.olive}55`}}>
                  <div style={{fontFamily:"'Playfair Display',Georgia,serif",fontSize:"12px",
                    color:P.grullo,marginBottom:"10px",fontStyle:"italic"}}>Hari Kosong</div>
                  <div style={{fontSize:"12px",color:P.grullo,lineHeight:2}}>
                    → Produksi batch evergreen<br/>
                    → Revisi keyword aset yang sudah live<br/>
                    → Riset tren & analisis kompetitor ☕
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"8px"}}>
                  {selEvts.map(ev=>{
                    const {done,total,pct}=prg(ev);
                    const isOpen=open===ev.id;
                    const Tv=TC[ev.type], Pv=PC[ev.priority];
                    const r=12, circ=2*Math.PI*r;
                    const isUrg=ev.uploadDl&&ev.uploadDl.includes("⚠️");
                    return (
                      <div key={ev.id} style={{background:P.raisin3,borderRadius:"12px",
                        border:`1px solid ${isOpen?Tv.bg+"88":"transparent"}`,
                        borderLeft:`3px solid ${isOpen?Tv.bg:P.raisin4}`,
                        overflow:"hidden",transition:"all .2s"}}>

                        {/* card header */}
                        <div className="ch" onClick={()=>setOpen(isOpen?null:ev.id)}
                          style={{padding:"12px 14px",cursor:"pointer",display:"flex",
                            alignItems:"flex-start",gap:"11px",transition:"background .12s"}}>

                          {/* progress ring */}
                          <div style={{position:"relative",width:"32px",height:"32px",flexShrink:0}}>
                            <svg width="32" height="32" style={{transform:"rotate(-90deg)"}}>
                              <circle cx="16" cy="16" r={r} fill="none" stroke={P.raisin} strokeWidth="2"/>
                              <circle cx="16" cy="16" r={r} fill="none"
                                stroke={pct===100?P.olive:Tv.bg} strokeWidth="2"
                                strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
                                strokeLinecap="round" style={{transition:"stroke-dashoffset .4s"}}/>
                            </svg>
                            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
                              justifyContent:"center",fontSize:"7.5px",color:pct===100?P.olive:P.grullo}}>
                              {pct===100?"✓":`${pct}%`}
                            </div>
                          </div>

                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontSize:"13px",fontWeight:"500",color:P.timber,
                              lineHeight:"1.45",marginBottom:"6px"}}>{ev.title}</div>
                            <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"6px"}}>
                              <span style={{fontSize:"9px",padding:"2px 9px",borderRadius:"20px",
                                background:Tv.pill,color:P.timber}}>{Tv.label}</span>
                              <span style={{fontSize:"9px",padding:"2px 9px",borderRadius:"20px",
                                background:Pv.bg,color:Pv.color}}>{["Tinggi","Menengah","Rendah"][["high","medium","low"].indexOf(ev.priority)]}</span>
                            </div>
                            <div style={{display:"inline-flex",alignItems:"center",gap:"5px",
                              borderRadius:"8px",padding:"3px 10px",
                              background:isUrg?`${P.garnet}22`:`${P.timber}08`,
                              border:`1px solid ${isUrg?P.garnet+"55":P.raisin4}`}}>
                              <span style={{fontSize:"8.5px",color:P.grullo}}>Upload deadline</span>
                              <span style={{width:"3px",height:"3px",borderRadius:"50%",background:isUrg?P.garnet:P.grullo}}/>
                              <span style={{fontSize:"9px",fontWeight:"500",color:isUrg?P.garnet:P.timber}}>{ev.uploadDl}</span>
                            </div>
                            <div style={{fontSize:"9px",color:P.grullo,marginTop:"5px"}}>{done}/{total} task selesai</div>
                          </div>

                          <div style={{color:P.grullo,fontSize:"10px",marginTop:"4px",
                            transition:"transform .2s",transform:isOpen?"rotate(180deg)":"none"}}>▾</div>
                        </div>

                        {/* expanded */}
                        {isOpen&&(
                          <div style={{borderTop:`1px solid ${P.raisin4}`,padding:"12px 14px"}}>
                            <p style={{fontSize:"12px",color:P.grullo,lineHeight:"1.9",marginBottom:"14px"}}>{ev.desc}</p>

                            {/* checklist */}
                            <div style={{marginBottom:"12px"}}>
                              <div style={{fontFamily:"'Playfair Display',Georgia,serif",
                                fontSize:"10px",color:P.grullo,marginBottom:"8px",fontStyle:"italic"}}>
                                Checklist Produksi
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                                {ev.tasks.map((task,ti)=>{
                                  const isDone=!!checks[`${ev.id}_${ti}`];
                                  const dlUrg=task.dl&&task.dl.includes("⚠️");
                                  return (
                                    <div key={ti} className="tr" onClick={()=>tog(ev.id,ti)}
                                      style={{display:"flex",alignItems:"center",gap:"9px",cursor:"pointer",
                                        padding:"6px 8px",borderRadius:"8px",
                                        background:isDone?P.raisin4+"88":"transparent",
                                        transition:"background .1s"}}>
                                      <div style={{width:"16px",height:"16px",borderRadius:"5px",flexShrink:0,
                                        border:`1.5px solid ${isDone?Tv.bg:P.raisin4}`,
                                        background:isDone?`${Tv.bg}60`:"transparent",
                                        display:"flex",alignItems:"center",justifyContent:"center",
                                        transition:"all .18s"}}>
                                        {isDone&&<svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                          <path d="M1 3.5L3.5 6L8 1" stroke={Tv.bg} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>}
                                      </div>
                                      <span style={{flex:1,fontSize:"12px",color:isDone?P.grullo:P.timber,
                                        textDecoration:isDone?"line-through":"none",lineHeight:1.5}}>{task.l}</span>
                                      {task.dl&&<span style={{flexShrink:0,fontSize:"9px",
                                        color:dlUrg?P.garnet:isDone?P.grullo:P.grullo,
                                        background:dlUrg?`${P.garnet}18`:"transparent",
                                        padding:dlUrg?"1px 7px":"0",borderRadius:"6px",
                                        fontWeight:dlUrg?"500":"400"}}>{task.dl}</span>}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* keywords */}
                            <div style={{background:P.raisin,borderRadius:"10px",padding:"10px 13px",
                              border:`1px solid ${P.raisin4}`}}>
                              <div style={{fontFamily:"'Playfair Display',Georgia,serif",
                                fontSize:"9.5px",color:P.grullo,marginBottom:"6px",fontStyle:"italic"}}>
                                Keywords
                              </div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                                {ev.kw.map((kw,ki)=>(
                                  <span key={ki} style={{fontSize:"10px",color:P.grullo,
                                    background:P.raisin2,padding:"2px 10px",borderRadius:"6px",
                                    border:`1px solid ${P.raisin4}`}}>{kw}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── BOTTOM TAB BAR ── */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,
        background:P.raisin2,borderTop:`1px solid ${P.raisin3}`,
        padding:"8px 20px 16px",display:"flex",justifyContent:"center",
        gap:"6px",flexWrap:"wrap",zIndex:10}}>
        {Object.entries(TC).map(([k,v])=>(
          <div key={k} style={{display:"flex",alignItems:"center",gap:"5px"}}>
            <div style={{width:"8px",height:"8px",borderRadius:"2px",background:v.bg}}/>
            <span style={{fontSize:"9px",color:P.grullo}}>{v.label}</span>
          </div>
        ))}
        <div style={{width:"1px",height:"14px",background:P.raisin3,margin:"0 4px"}}/>
        <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
          <div style={{width:"6px",height:"6px",borderRadius:"50%",background:P.garnet}}/>
          <span style={{fontSize:"9px",color:P.grullo}}>Prioritas tinggi</span>
        </div>
      </div>
    </div>
  );
}

// nav button style
const navBtn = {
  width:"30px",height:"30px",borderRadius:"8px",
  border:`1px solid ${P.raisin3}`,background:"transparent",
  color:P.grullo,cursor:"pointer",fontSize:"16px",
  display:"flex",alignItems:"center",justifyContent:"center",
  transition:"all .15s"
};
