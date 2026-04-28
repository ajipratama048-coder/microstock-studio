import { useState, useEffect } from "react";

// ─── GHIBLI PALETTE ───────────────────────────────────────────
// Dark: deep forest night, warm ember accents, aged parchment text
// Light: aged washi paper, forest ink, warm amber
const THEME = {
  dark: {
    bg0:"#141810",    // deep forest floor
    bg1:"#181D13",    // slightly lifted
    bg2:"#1E2418",    // card surface
    bg3:"#242B1E",    // elevated
    bdr:"#2C3424",    // border subtle
    bdr2:"#374030",   // border medium
    tx0:"#D4CCAA",    // warm parchment — primary
    tx1:"#9A9278",    // aged paper — secondary
    tx2:"#615A44",    // faded ink — muted
    tx3:"#3A3428",    // very faded
    acc:"#7AAA60",    // forest green (Totoro)
    accB:"#C4924A",   // amber fire (Calcifer)
    accC:"#6A90AA",   // sky blue (Nausicaä)
    urg:"#C46848",    // terracotta urgent
    done:"#6A9E6A",   // soft done green
    toggle:"☀️",
  },
  light: {
    bg0:"#F0EAD8",    // aged washi
    bg1:"#EAE3CF",    // parchment
    bg2:"#E3DBCA",    // card
    bg3:"#DDD4C0",    // elevated card
    bdr:"#C8BFA8",    // border
    bdr2:"#B0A890",   // border medium
    tx0:"#2C2820",    // dark forest ink — primary
    tx1:"#5A5040",    // medium ink — secondary
    tx2:"#7A7060",    // faded — muted
    tx3:"#A09080",    // very faded
    acc:"#4A7A38",    // deep forest green
    accB:"#A06C28",   // dark amber
    accC:"#3A6880",   // deep sky
    urg:"#9A4030",    // deep urgent
    done:"#4A7A4A",   // done green
    toggle:"🌙",
  }
};

const MONTHS = [
  {n:"Januari",  emoji:"❄️",  season:"Musim Dingin"},
  {n:"Februari", emoji:"🌸",  season:"Awal Semi"},
  {n:"Maret",    emoji:"🌱",  season:"Semi Baru"},
  {n:"April",    emoji:"🍃",  season:"Hijau Muda"},
  {n:"Mei",      emoji:"🌿",  season:"Daun Segar"},
  {n:"Juni",     emoji:"🌧️", season:"Musim Hujan"},
  {n:"Juli",     emoji:"☀️",  season:"Puncak Panas"},
  {n:"Agustus",  emoji:"🌾",  season:"Akhir Panas"},
  {n:"September",emoji:"🍂",  season:"Awal Gugur"},
  {n:"Oktober",  emoji:"🍁",  season:"Puncak Gugur"},
  {n:"November", emoji:"🍄",  season:"Akhir Gugur"},
  {n:"Desember", emoji:"🌨️", season:"Awal Dingin"},
];

const DAYS = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"];

// Month accent pairs [primary, secondary]
const SEASON_ACC = [
  ["#6A90AA","#9AB8C8"],["#C4909A","#D4A8B0"],["#7AA870","#9AC890"],
  ["#7A9E68","#A8C888"],["#7AAA60","#C4924A"],["#6A88AA","#88A8C8"],
  ["#C4924A","#D4AA60"],["#C46848","#D48868"],["#B08840","#C8A858"],
  ["#B86040","#D07858"],["#906040","#A87858"],["#6A90AA","#8AAAC8"],
];

const TYPES = {
  vector:   {label:"Vector",   short:"VEC"},
  texture:  {label:"Texture",  short:"TEX"},
  template: {label:"Template", short:"TPL"},
};
const PRIO = {
  high:   {label:"Tinggi"},
  medium: {label:"Menengah"},
  low:    {label:"Rendah"},
};

const pad = n => String(n).padStart(2,"0");

// ─── EVENT DATA (semua deadline sudah fix: H-14 minimum) ─────
const EVT = {
  "2026-05-01":[{
    id:"e501",title:"Labour Day — Worker Illustration",type:"vector",priority:"high",
    desc:"Worker flat set — helmet, tools, solidarity hands. Min 3 pose berbeda. Upload segera karena H-0.",
    eventDate:"1 Mei 2026", uploadDl:"Segera — H-0",
    kw:["labour day vector","workers may flat","industry worker solidarity","labour day illustration"],
    tasks:[
      {l:"Sketsa 3 pose karakter pekerja",dl:"Hari ini"},
      {l:"Lineart + coloring semua pose",dl:"2 Mei"},
      {l:"Export .AI + .EPS",dl:"3 Mei"},
      {l:"Export JPG preview 4MP+",dl:"3 Mei"},
      {l:"Upload & metadata di platform",dl:"4 Mei"},
    ]
  }],
  "2026-05-07":[{
    id:"e507",title:"Organic Abstract Texture Pack #1",type:"texture",priority:"high",
    desc:"3 variasi: warm terracotta, cool teal, neutral stone. JPG 5000px+. Fondasi portofolio — evergreen.",
    eventDate:"Evergreen",uploadDl:"Evergreen — kapan saja",
    kw:["abstract organic background","fluid blob texture","modern art wallpaper","contemporary background"],
    tasks:[
      {l:"Variasi warm — terracotta palette",dl:"1 Mei"},
      {l:"Variasi cool — teal palette",dl:"3 Mei"},
      {l:"Variasi neutral — stone palette",dl:"5 Mei"},
      {l:"Export JPG 5000px tiap variasi",dl:"6 Mei"},
      {l:"Upload ketiga file sekaligus",dl:"7 Mei"},
    ]
  }],
  "2026-05-10":[
    {id:"e510a",title:"Mother's Day — Illustration",type:"vector",priority:"high",
    desc:"Ibu & anak, floral wreath, floral frame. Min 3 variasi komposisi.",
    eventDate:"10 Mei 2026",uploadDl:"26 Apr (H-14)",
    kw:["mother's day flat illustration","mom child vector","floral mother greeting","mothers day art"],
    tasks:[
      {l:"Komposisi 1 — ibu & anak duduk",dl:"20 Apr"},
      {l:"Komposisi 2 — floral wreath frame",dl:"22 Apr"},
      {l:"Komposisi 3 — hands & flower",dl:"23 Apr"},
      {l:"Export .AI + .EPS + JPG preview",dl:"25 Apr"},
      {l:"Upload + 50 keyword",dl:"26 Apr"},
    ]},
    {id:"e510b",title:"Mother's Day — Template Pack",type:"template",priority:"high",
    desc:"Greeting card A4 + social media 1080×1080. Font-free, placeholder teks.",
    eventDate:"10 Mei 2026",uploadDl:"26 Apr (H-14)",
    kw:["mothers day card template","mom greeting design","family celebration layout","spring floral template"],
    tasks:[
      {l:"Layout A4 card",dl:"21 Apr"},
      {l:"Layout 1080×1080 feed",dl:"22 Apr"},
      {l:"Outline semua font",dl:"24 Apr"},
      {l:"Export + upload",dl:"26 Apr"},
    ]},
  ],
  "2026-05-14":[{
    id:"e514",title:"Kenaikan Yesus Kristus",type:"vector",priority:"low",
    desc:"Dove, cross silhouette, light beam. Palette putih, biru muda, gold.",
    eventDate:"14 Mei 2026",uploadDl:"30 Apr (H-14)",
    kw:["ascension day vector","christian holiday illustration","dove cross silhouette","religious background"],
    tasks:[
      {l:"Dove + cross silhouette",dl:"27 Apr"},
      {l:"Light ray / glory effect",dl:"28 Apr"},
      {l:"Export + upload",dl:"30 Apr"},
    ]
  }],
  "2026-05-20":[{
    id:"e520",title:"World Bee Day + Botanical Pack",type:"vector",priority:"medium",
    desc:"Bee & honey illustration + seamless honeycomb pattern. Dua konten satu tema = efisien.",
    eventDate:"20 Mei 2026",uploadDl:"6 Mei (H-14)",
    kw:["bee day vector","honey botanical illustration","seamless bee pattern","honeycomb seamless"],
    tasks:[
      {l:"Lebah flat illustration",dl:"1 Mei"},
      {l:"Honey jar & comb elements",dl:"3 Mei"},
      {l:"Seamless honeycomb tile",dl:"4 Mei"},
      {l:"Export + upload",dl:"6 Mei"},
    ]
  }],
  "2026-05-21":[{
    id:"e521",title:"Cultural Diversity Day",type:"vector",priority:"medium",
    desc:"Multicultural flat people — diverse faces, hands together, globe unity.",
    eventDate:"21 Mei 2026",uploadDl:"7 Mei (H-14)",
    kw:["cultural diversity illustration","multicultural people flat","inclusion diversity vector"],
    tasks:[
      {l:"6 karakter diverse",dl:"3 Mei"},
      {l:"Komposisi hands together",dl:"5 Mei"},
      {l:"Globe unity element",dl:"6 Mei"},
      {l:"Export + upload",dl:"7 Mei"},
    ]
  }],
  "2026-05-24":[{
    id:"e524",title:"Hari Raya Waisak",type:"vector",priority:"medium",
    desc:"Lotus mandala, Buddha silhouette modern, spiritual ornament.",
    eventDate:"24 Mei 2026",uploadDl:"10 Mei (H-14)",
    kw:["vesak day vector","lotus mandala illustration","buddhist spiritual art","waisak background"],
    tasks:[
      {l:"Lotus mandala detail",dl:"6 Mei"},
      {l:"Buddha silhouette minimalis",dl:"8 Mei"},
      {l:"Spiritual ornament border",dl:"9 Mei"},
      {l:"Export + upload",dl:"10 Mei"},
    ]
  }],
  "2026-05-27":[
    {id:"e527a",title:"⭐ Idul Adha — Illustration Set",type:"vector",priority:"high",
    desc:"Target 5–7 aset: lantern, kambing, masjid, geometric border, arabesque. Momen terbesar Q2.",
    eventDate:"27 Mei 2026",uploadDl:"13 Mei (H-14)",
    kw:["eid al adha vector","islamic celebration illustration","qurban sacrifice flat","mosque silhouette eid"],
    tasks:[
      {l:"Lantern Idul Adha flat",dl:"5 Mei"},
      {l:"Kambing (goat) vector",dl:"6 Mei"},
      {l:"Masjid + bulan sabit silhouette",dl:"7 Mei"},
      {l:"Islamic geometric border",dl:"8 Mei"},
      {l:"Arabesque ornament",dl:"9 Mei"},
      {l:"Bulan & bintang icon set",dl:"10 Mei"},
      {l:"Quality check semua file",dl:"12 Mei"},
      {l:"Upload semua aset",dl:"13 Mei ⚠️"},
    ]},
    {id:"e527b",title:"Idul Adha — Template Pack",type:"template",priority:"high",
    desc:"Poster A4 + stories 1080×1920 + feed 1080×1080.",
    eventDate:"27 Mei 2026",uploadDl:"13 Mei (H-14)",
    kw:["eid al adha template","idul adha poster design","islamic greeting card","eid mubarak layout"],
    tasks:[
      {l:"Layout A4 portrait",dl:"8 Mei"},
      {l:"Layout stories 1080×1920",dl:"9 Mei"},
      {l:"Layout feed 1080×1080",dl:"10 Mei"},
      {l:"Font outline check",dl:"11 Mei"},
      {l:"Export + upload",dl:"13 Mei ⚠️"},
    ]},
    {id:"e527c",title:"Islamic Geometric Seamless Pattern",type:"texture",priority:"high",
    desc:"Arabesque seamless reusable. Evergreen + event-driven. Green & gold.",
    eventDate:"27 Mei 2026",uploadDl:"13 Mei (H-14)",
    kw:["islamic geometric pattern seamless","arabesque texture","muslim ornament tile","ramadan pattern"],
    tasks:[
      {l:"Desain tile arabesque",dl:"9 Mei"},
      {l:"Test seamless 4 arah",dl:"10 Mei"},
      {l:"Export JPG 5000px + EPS",dl:"12 Mei"},
      {l:"Upload",dl:"13 Mei ⚠️"},
    ]},
  ],
  "2026-05-31":[{
    id:"e531",title:"Modern Batik Pattern Set",type:"vector",priority:"high",
    desc:"3–5 variasi: Kawung, Parang, Mega Mendung kontemporer. Niche terkuat — langka di platform global.",
    eventDate:"Evergreen",uploadDl:"Evergreen — kapan saja",
    kw:["batik pattern vector","indonesian traditional seamless","modern batik design","kawung parang batik"],
    tasks:[
      {l:"Batik Kawung modern",dl:"15–17 Mei"},
      {l:"Batik Parang kontemporer",dl:"18–20 Mei"},
      {l:"Mega Mendung reinterpretasi",dl:"20–23 Mei"},
      {l:"Variasi warna 2–3 per motif",dl:"23–26 Mei"},
      {l:"Export EPS + JPG semua",dl:"28 Mei"},
      {l:"Upload + keyword Indonesia",dl:"31 Mei"},
    ]
  }],
  "2026-06-01":[
    {id:"e601a",title:"Hari Lahir Pancasila — Vector",type:"vector",priority:"high",
    desc:"Garuda stylized modern, geometric merah putih, 5 simbol sila.",
    eventDate:"1 Jun 2026",uploadDl:"18 Mei (H-14)",
    kw:["pancasila day vector","indonesia national day illustration","garuda pancasila geometric"],
    tasks:[
      {l:"Garuda stylized modern",dl:"12 Mei"},
      {l:"Geometric merah putih pattern",dl:"14 Mei"},
      {l:"5 sila simbolik visual",dl:"15 Mei"},
      {l:"Export + upload",dl:"18 Mei"},
    ]},
    {id:"e601b",title:"Pancasila — Poster Template",type:"template",priority:"high",
    desc:"Poster A3 + stories 1080×1920. Merah putih palette.",
    eventDate:"1 Jun 2026",uploadDl:"18 Mei (H-14)",
    kw:["pancasila template poster","indonesia national day design","merah putih layout"],
    tasks:[
      {l:"Layout poster A3",dl:"14 Mei"},
      {l:"Layout stories 9:16",dl:"15 Mei"},
      {l:"Font-free check",dl:"16 Mei"},
      {l:"Export + upload",dl:"18 Mei"},
    ]},
  ],
  "2026-06-05":[{
    id:"e605",title:"World Environment Day",type:"vector",priority:"high",
    desc:"Eco flat — bumi hijau, daur ulang, renewable energy, zero waste icons.",
    eventDate:"5 Jun 2026",uploadDl:"22 Mei (H-14)",
    kw:["environment day vector","eco sustainability illustration","green earth flat","ecology icon set"],
    tasks:[
      {l:"Earth/globe flat illustration",dl:"16 Mei"},
      {l:"Recycle icon set 10+",dl:"17 Mei"},
      {l:"Renewable energy icons",dl:"18 Mei"},
      {l:"Zero waste visual",dl:"19 Mei"},
      {l:"Export + upload",dl:"22 Mei"},
    ]
  }],
  "2026-06-08":[{
    id:"e608",title:"World Oceans Day — Marine Texture",type:"texture",priority:"medium",
    desc:"Marine seamless + ocean wave pattern + coral reef flat. Teal & deep blue.",
    eventDate:"8 Jun 2026",uploadDl:"25 Mei (H-14)",
    kw:["ocean day texture","marine seamless pattern","wave ocean background","coral reef vector"],
    tasks:[
      {l:"Wave seamless pattern",dl:"19 Mei"},
      {l:"Marine deep blue texture",dl:"21 Mei"},
      {l:"Coral reef flat element",dl:"22 Mei"},
      {l:"Export + upload",dl:"25 Mei"},
    ]
  }],
  "2026-06-17":[{
    id:"e617",title:"1 Muharam 1448H — Islamic New Year",type:"vector",priority:"high",
    desc:"Crescent & star, hijri calendar visual, kaligrafi-inspired ornament. Green & gold.",
    eventDate:"17 Jun 2026",uploadDl:"3 Jun (H-14)",
    kw:["islamic new year vector","muharram illustration","1448 hijri art","muslim new year crescent"],
    tasks:[
      {l:"Crescent moon & star flat",dl:"29 Mei"},
      {l:"Hijri typography ornament",dl:"31 Mei"},
      {l:"Kaligrafi-inspired border",dl:"1 Jun"},
      {l:"Export + upload",dl:"3 Jun"},
    ]
  }],
  "2026-06-21":[
    {id:"e621a",title:"Father's Day — Illustration",type:"vector",priority:"high",
    desc:"Father-child flat: outdoor, membaca, memasak. Warm earthy maskulin.",
    eventDate:"21 Jun 2026",uploadDl:"7 Jun (H-14)",
    kw:["father's day flat illustration","dad child vector","father greeting card","fathers day art"],
    tasks:[
      {l:"Scene 1 — outdoor/olahraga",dl:"1 Jun"},
      {l:"Scene 2 — membaca bersama",dl:"3 Jun"},
      {l:"Scene 3 — memasak bareng",dl:"4 Jun"},
      {l:"Export + upload",dl:"7 Jun"},
    ]},
    {id:"e621b",title:"Father's Day — Template",type:"template",priority:"high",
    desc:"Card A4 + social media 1080px. Tone maskulin, warm earthy.",
    eventDate:"21 Jun 2026",uploadDl:"7 Jun (H-14)",
    kw:["fathers day template","dad card design layout","father appreciation poster"],
    tasks:[
      {l:"Layout A4 card",dl:"3 Jun"},
      {l:"Layout 1080px square",dl:"4 Jun"},
      {l:"Font check + outline",dl:"5 Jun"},
      {l:"Export + upload",dl:"7 Jun"},
    ]},
    {id:"e621c",title:"Summer Solstice + World Music Day",type:"texture",priority:"medium",
    desc:"Warm golden texture + music instrument vector paralel.",
    eventDate:"21 Jun 2026",uploadDl:"7 Jun (H-14)",
    kw:["summer solstice texture","music day vector","instrument illustration flat","warm summer background"],
    tasks:[
      {l:"Summer golden texture pack",dl:"4 Jun"},
      {l:"Music instrument flat icons 5+",dl:"5 Jun"},
      {l:"Export + upload",dl:"7 Jun"},
    ]},
  ],
  "2026-07-04":[{
    id:"e704",title:"US Independence Day",type:"vector",priority:"medium",
    desc:"Americana flat — stars & stripes, fireworks, red/white/blue. Pasar AS terbesar.",
    eventDate:"4 Jul 2026",uploadDl:"20 Jun (H-14)",
    kw:["independence day vector","4th july illustration","americana stars stripes","usa patriotic flat"],
    tasks:[
      {l:"Stars & stripes seamless pattern",dl:"13 Jun"},
      {l:"Fireworks silhouette set",dl:"15 Jun"},
      {l:"Americana flat icons",dl:"16 Jun"},
      {l:"Poster template USA",dl:"18 Jun"},
      {l:"Export + upload",dl:"20 Jun"},
    ]
  }],
  "2026-07-10":[{
    id:"e710",title:"Tropical Summer Texture Pack",type:"texture",priority:"high",
    desc:"Palm leaf seamless, tropical fruit pattern, ocean teal. Demand tinggi buyer belahan bumi utara.",
    eventDate:"Evergreen",uploadDl:"Evergreen — kapan saja",
    kw:["tropical seamless pattern","summer palm texture","beach background vector","exotic tropical botanical"],
    tasks:[
      {l:"Palm leaf seamless pattern",dl:"1–3 Jul"},
      {l:"Tropical fruit elements",dl:"3–5 Jul"},
      {l:"Ocean teal texture",dl:"5–7 Jul"},
      {l:"Hibiscus flat illustration",dl:"7 Jul"},
      {l:"Export bundle + upload",dl:"10 Jul"},
    ]
  }],
  "2026-07-20":[{
    id:"e720",title:"⚠️ Pre-production HUT RI ke-81",type:"vector",priority:"high",
    desc:"MULAI SEKARANG. Upload deadline 27 Jul (H-21 dari 17 Agt). Target 8–12 aset.",
    eventDate:"17 Agt 2026",uploadDl:"27 Jul (H-21)",
    kw:["indonesia independence day vector","garuda illustration","merah putih pattern","hut ri 81"],
    tasks:[
      {l:"Riset & kumpulkan referensi visual",dl:"16 Jul"},
      {l:"Garuda Pancasila stylized modern",dl:"17–18 Jul"},
      {l:"Ornamen Jawa & Bali kontemporer",dl:"18–19 Jul"},
      {l:"Ornamen Dayak & Minang",dl:"19–20 Jul"},
      {l:"Wayang kulit modern silhouette",dl:"20–21 Jul"},
      {l:"Peta Indonesia vector stylized",dl:"21 Jul"},
      {l:"Rumah adat silhouette 4 suku",dl:"22 Jul"},
      {l:"Produksi & finalisasi semua .AI",dl:"22–25 Jul"},
      {l:"Export .EPS + JPG semua aset",dl:"25–26 Jul"},
      {l:"Upload + metadata Indonesia",dl:"27 Jul ⚠️"},
    ]
  }],
  "2026-07-30":[{
    id:"e730",title:"International Friendship Day",type:"vector",priority:"low",
    desc:"Community togetherness — diverse hands, friendship circle, warmth.",
    eventDate:"30 Jul 2026",uploadDl:"16 Jul (H-14)",
    kw:["friendship day vector","community togetherness illustration","diverse friends flat"],
    tasks:[
      {l:"Diverse hands composition",dl:"13 Jul"},
      {l:"Friendship circle illustration",dl:"14 Jul"},
      {l:"Export + upload",dl:"16 Jul"},
    ]
  }],
  "2026-08-10":[{
    id:"e810",title:"Back to School — Global",type:"vector",priority:"medium",
    desc:"School supplies flat, education icon set, notebook seamless. Demand global Agustus.",
    eventDate:"Agustus 2026",uploadDl:"Awal Agustus",
    kw:["back to school vector","education flat icon set","school supplies illustration","pencil notebook pattern"],
    tasks:[
      {l:"10+ school supplies icon",dl:"1–3 Agt"},
      {l:"Seamless notebook pattern",dl:"3–5 Agt"},
      {l:"Poster template ID & internasional",dl:"5–8 Agt"},
      {l:"Export + upload",dl:"10 Agt"},
    ]
  }],
  "2026-08-17":[
    {id:"e817a",title:"🇮🇩 HUT RI ke-81 — Main Vector Set",type:"vector",priority:"high",
    desc:"PELUANG EMAS. Konten Indonesia autentik sangat langka di platform global. Target 8–12 aset.",
    eventDate:"17 Agt 2026",uploadDl:"27 Jul (H-21)",
    kw:["indonesia independence day vector","garuda pancasila illustration","indonesian ornament batik","merah putih pattern","nusantara traditional art"],
    tasks:[
      {l:"Garuda Pancasila stylized",dl:"17 Jul"},
      {l:"Merah putih geometric pattern",dl:"18 Jul"},
      {l:"Ornamen Jawa kontemporer",dl:"19 Jul"},
      {l:"Ornamen Bali kontemporer",dl:"19 Jul"},
      {l:"Ornamen Dayak reinterpretasi",dl:"20 Jul"},
      {l:"Wayang kulit modern",dl:"21 Jul"},
      {l:"Peta Indonesia vector",dl:"22 Jul"},
      {l:"Rumah adat 4 suku silhouette",dl:"23 Jul"},
      {l:"Batik motif versi HUT",dl:"24 Jul"},
      {l:"Rempah & flora lokal flat",dl:"25 Jul"},
      {l:"Quality check semua",dl:"26 Jul"},
      {l:"Upload + keyword Indonesia",dl:"27 Jul ⚠️"},
    ]},
    {id:"e817b",title:"HUT RI — Poster & Template Bundle",type:"template",priority:"high",
    desc:"Poster A2/A3 + twibbon 1:1 + stories 9:16 + banner web.",
    eventDate:"17 Agt 2026",uploadDl:"27 Jul (H-21)",
    kw:["hut ri 81 template","indonesia independence poster","17 agustus design","twibbon merah putih"],
    tasks:[
      {l:"Poster A2/A3",dl:"22 Jul"},
      {l:"Twibbon 1:1",dl:"23 Jul"},
      {l:"Stories 9:16",dl:"24 Jul"},
      {l:"Web banner",dl:"25 Jul"},
      {l:"Font-free check",dl:"26 Jul"},
      {l:"Export + upload",dl:"27 Jul ⚠️"},
    ]},
    {id:"e817c",title:"Merah Putih Geometric Texture",type:"texture",priority:"high",
    desc:"Seamless pattern merah putih geometric modern. Versatile sepanjang tahun.",
    eventDate:"17 Agt 2026",uploadDl:"27 Jul (H-21)",
    kw:["merah putih pattern seamless","indonesia national colors texture","red white geometric background"],
    tasks:[
      {l:"Desain tile geometric",dl:"23 Jul"},
      {l:"Test seamless 4 arah",dl:"24 Jul"},
      {l:"Export JPG 5000px + EPS",dl:"25 Jul"},
      {l:"Upload",dl:"27 Jul ⚠️"},
    ]},
  ],
  "2026-08-26":[{
    id:"e826",title:"Maulid Nabi Muhammad SAW",type:"vector",priority:"high",
    desc:"Islamic art: ornament green & gold, masjid, lantern. Reuse & variasikan dari Idul Adha.",
    eventDate:"26 Agt 2026",uploadDl:"12 Agt (H-14)",
    kw:["maulid nabi vector","prophet birthday islamic art","green gold islamic ornament","mawlid al nabi"],
    tasks:[
      {l:"Variasi ornament green & gold baru",dl:"6 Agt"},
      {l:"Lantern versi Maulid",dl:"7 Agt"},
      {l:"Masjid silhouette versi 2",dl:"8 Agt"},
      {l:"Template poster Maulid",dl:"10 Agt"},
      {l:"Export + upload",dl:"12 Agt"},
    ]
  }],
  "2026-09-10":[{
    id:"e910",title:"Autumn Season Batch",type:"texture",priority:"medium",
    desc:"Harvest texture, pumpkin seamless, maple leaf. Warm amber/brown. Upload sekarang = siap Oktober.",
    eventDate:"Evergreen Sep–Nov",uploadDl:"10 Sep — upload segera",
    kw:["autumn texture","fall season pattern","harvest background seamless","pumpkin vector warm fall"],
    tasks:[
      {l:"Maple leaf seamless pattern",dl:"1–3 Sep"},
      {l:"Pumpkin + harvest texture",dl:"3–5 Sep"},
      {l:"Warm amber background set",dl:"5–7 Sep"},
      {l:"Autumn botanical flat",dl:"7–9 Sep"},
      {l:"Export bundle + upload",dl:"10 Sep"},
    ]
  }],
  "2026-10-10":[{
    id:"e1010",title:"⚠️ Halloween — Produksi & Upload",type:"vector",priority:"high",
    desc:"Upload sekarang (H-21 dari 31 Okt). Demand spike terbesar Oktober — jangan kelewat.",
    eventDate:"31 Okt 2026",uploadDl:"10 Okt (H-21)",
    kw:["halloween vector spooky","horror flat icons","dark halloween pattern","witch bat pumpkin illustration"],
    tasks:[
      {l:"Spooky flat icon set 10+",dl:"1–3 Okt"},
      {l:"Dark cobweb seamless pattern",dl:"3–5 Okt"},
      {l:"Moonlight background texture",dl:"5–7 Okt"},
      {l:"Halloween party template",dl:"7–9 Okt"},
      {l:"Export semua file",dl:"9 Okt"},
      {l:"Upload",dl:"10 Okt ⚠️"},
    ]
  }],
  "2026-10-31":[{
    id:"e1031",title:"Halloween Live — Pantau Performa",type:"vector",priority:"medium",
    desc:"Aset Halloween harusnya sudah live. Pantau download & revenue. Evaluasi keyword.",
    eventDate:"31 Okt 2026",uploadDl:"Sudah live sejak 10 Okt",
    kw:["halloween vector flat","spooky icon set","witch bat pumpkin ghost","halloween clipart"],
    tasks:[
      {l:"Cek performa aset di dashboard",dl:"31 Okt"},
      {l:"Optimasi keyword yang kurang perform",dl:"31 Okt"},
      {l:"Catat insight untuk Halloween 2027",dl:"31 Okt"},
    ]
  }],
  "2026-11-01":[{
    id:"e1101",title:"⚠️ Start Christmas Production",type:"vector",priority:"high",
    desc:"MULAI SEKARANG. Upload deadline 24 Nov (H-30 dari 25 Des). 10–15 aset. Desember = bulan terbesar.",
    eventDate:"25 Des 2026",uploadDl:"24 Nov (H-30)",
    kw:["christmas vector","holiday illustration","santa flat design","xmas ornament pattern"],
    tasks:[
      {l:"Santa Claus flat vector",dl:"1–4 Nov"},
      {l:"Christmas tree geometric",dl:"4–6 Nov"},
      {l:"Ornament balls set",dl:"6–8 Nov"},
      {l:"Reindeer flat illustration",dl:"8–9 Nov"},
      {l:"Snowflake collection 8+ variasi",dl:"9–10 Nov"},
      {l:"Gift box icon set",dl:"10–11 Nov"},
      {l:"Seamless xmas pattern (merah/hijau/gold)",dl:"11–13 Nov"},
      {l:"Snow bokeh texture",dl:"13–15 Nov"},
      {l:"Gift wrap seamless pattern",dl:"15–17 Nov"},
      {l:"Christmas template A4",dl:"17–19 Nov"},
      {l:"Stories template 9:16",dl:"19–20 Nov"},
      {l:"New Year Eve celebration set",dl:"20–22 Nov"},
      {l:"Export semua file",dl:"22–23 Nov"},
      {l:"Upload + keyword holiday",dl:"24 Nov ⚠️"},
    ]
  }],
  "2026-11-26":[{
    id:"e1126",title:"Thanksgiving (US) + Winter Warmth",type:"vector",priority:"medium",
    desc:"Turkey, pumpkin, cornucopia flat. Pasar AS besar. Produksi sebelum fokus ke Christmas.",
    eventDate:"26 Nov 2026",uploadDl:"12 Nov (H-14)",
    kw:["thanksgiving vector","harvest illustration flat","autumn feast cornucopia","giving thanks template"],
    tasks:[
      {l:"Turkey flat illustration",dl:"6 Nov"},
      {l:"Harvest cornucopia set",dl:"8 Nov"},
      {l:"Thanksgiving poster template",dl:"10 Nov"},
      {l:"Export + upload",dl:"12 Nov"},
    ]
  }],
  "2026-12-01":[
    {id:"e1201a",title:"Christmas Vector Set — Final Polish",type:"vector",priority:"high",
    desc:"Santa, tree geometric, ornament, reindeer, snowflake. Min 8 aset. Live 24 Nov.",
    eventDate:"25 Des 2026",uploadDl:"24 Nov (H-30)",
    kw:["christmas vector illustration","santa flat design","xmas ornament","reindeer illustration snowflake"],
    tasks:[
      {l:"Santa flat final polish",dl:"15 Nov"},
      {l:"Tree geometric final",dl:"16 Nov"},
      {l:"Ornament set final",dl:"17 Nov"},
      {l:"Reindeer + snowflake final",dl:"18 Nov"},
      {l:"Export bundle",dl:"22 Nov"},
      {l:"Upload + keyword",dl:"24 Nov"},
    ]},
    {id:"e1201b",title:"Christmas Texture Pack",type:"texture",priority:"high",
    desc:"Snow bokeh, gift wrap seamless (merah/hijau/gold), plaid holiday.",
    eventDate:"25 Des 2026",uploadDl:"24 Nov (H-30)",
    kw:["christmas texture background","snow pattern seamless","holiday bokeh","gift wrap pattern xmas"],
    tasks:[
      {l:"Snow bokeh background",dl:"15 Nov"},
      {l:"Gift wrap seamless merah/hijau",dl:"17 Nov"},
      {l:"Plaid holiday pattern gold",dl:"19 Nov"},
      {l:"Export + upload",dl:"24 Nov"},
    ]},
  ],
  "2026-12-25":[
    {id:"e1225a",title:"Christmas & NYE Bundle Template",type:"template",priority:"high",
    desc:"Poster + greeting card + social media kit. Christmas + NYE hitam/emas. Bundle = nilai lebih.",
    eventDate:"25 Des / 1 Jan",uploadDl:"24 Nov (H-30)",
    kw:["christmas template poster","holiday greeting card design","new year celebration layout","nye poster"],
    tasks:[
      {l:"Christmas poster template A4",dl:"15 Nov"},
      {l:"NYE poster template dark/gold",dl:"17 Nov"},
      {l:"Greeting card set A4",dl:"19 Nov"},
      {l:"Social media kit 1080px",dl:"21 Nov"},
      {l:"Export bundle + upload",dl:"24 Nov"},
    ]},
    {id:"e1225b",title:"New Year Eve 2027 — Celebration Set",type:"vector",priority:"high",
    desc:"Fireworks flat, champagne, confetti, party elements, countdown typography.",
    eventDate:"1 Jan 2027",uploadDl:"24 Nov (H-38)",
    kw:["new year eve vector","2027 celebration illustration","fireworks party flat","countdown new year"],
    tasks:[
      {l:"Fireworks flat set",dl:"15 Nov"},
      {l:"Champagne & confetti elements",dl:"17 Nov"},
      {l:"Party icons & balloon set",dl:"18 Nov"},
      {l:"Countdown typography layout",dl:"20 Nov"},
      {l:"Export + upload",dl:"24 Nov"},
    ]},
  ],
};

// ─── COMPONENT ────────────────────────────────────────────────
export default function App() {
  const today = new Date();
  const [isDark, setIsDark] = useState(true);
  const [month,  setMonth]  = useState(4);
  const [year,   setYear]   = useState(2026);
  const [sel,    setSel]    = useState(null);
  const [filt,   setFilt]   = useState("all");
  const [checks, setChecks] = useState({});
  const [open,   setOpen]   = useState(null);

  const T = isDark ? THEME.dark : THEME.light;
  const Mo = MONTHS[month];
  const [accA, accB] = SEASON_ACC[month];

  const typeColors = {
    vector:   {clr:T.acc,  bg:`${T.acc}18`},
    texture:  {clr:T.accC, bg:`${T.accC}18`},
    template: {clr:T.accB, bg:`${T.accB}18`},
  };
  const prioColors = {
    high:   {clr:T.urg,  bg:`${T.urg}18`},
    medium: {clr:T.accB, bg:`${T.accB}14`},
    low:    {clr:T.tx2,  bg:`${T.tx2}18`},
  };

  const nav = dir => {
    let m=month+dir, y=year;
    if(m<0){m=11;y--;} if(m>11){m=0;y++;}
    setMonth(m); setYear(y); setSel(null); setOpen(null);
  };

  const dKey = d => `${year}-${pad(month+1)}-${pad(d)}`;
  const getEv = d => {
    if(!d) return [];
    const all = EVT[dKey(d)]||[];
    return filt==="all" ? all : all.filter(e=>e.type===filt);
  };
  const isTdy = d => d===today.getDate()&&month===today.getMonth()&&year===today.getFullYear();
  const firstDow  = new Date(year,month,1).getDay();
  const daysInMon = new Date(year,month+1,0).getDate();
  const cells = [...Array(firstDow).fill(null),...Array.from({length:daysInMon},(_,i)=>i+1)];

  const mPfx  = `${year}-${pad(month+1)}`;
  const mKeys = Object.keys(EVT).filter(k=>k.startsWith(mPfx));
  const totEv = mKeys.reduce((s,k)=>s+EVT[k].length,0);
  const hiEv  = mKeys.reduce((s,k)=>s+EVT[k].filter(e=>e.priority==="high").length,0);

  const prog = ev => {
    const done=ev.tasks.filter((_,i)=>checks[`${ev.id}_${i}`]).length;
    return {done,total:ev.tasks.length,pct:Math.round((done/ev.tasks.length)*100)};
  };
  const toggle = (id,i) => setChecks(p=>({...p,[`${id}_${i}`]:!p[`${id}_${i}`]}));
  const selEvts = sel ? getEv(sel) : [];

  return (
    <div style={{background:T.bg0,color:T.tx0,fontFamily:"'Lora',Georgia,serif",
      minHeight:"100vh",display:"flex",flexDirection:"column",transition:"background .3s, color .3s"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',system-ui,sans-serif;}
        .hc:hover{background:${T.bg3} !important; transition:background .12s;}
        .hn:hover{background:${T.bg2} !important; color:${T.tx1} !important;}
        .pb:hover{opacity:.72;}
        .ch:hover{background:${T.bg3} !important;}
        .tr:hover{background:${T.bg3} !important;}
        ::-webkit-scrollbar{width:3px;}
        ::-webkit-scrollbar-thumb{background:${T.bdr2};border-radius:4px;}
        @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fin{animation:fadeUp .22s ease forwards;}
      `}</style>

      {/* ── HEADER ─────────────────── */}
      <div style={{height:"54px",padding:"0 22px",background:T.bg1,
        borderBottom:`1px solid ${T.bdr}`,
        display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,
        transition:"background .3s"}}>

        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <div style={{fontSize:"20px",lineHeight:1}}>{Mo.emoji}</div>
          <div>
            <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"14px",fontWeight:"600",
              color:T.tx0,letterSpacing:"0.01em"}}>
              Microstock Studio
            </div>
            <div style={{fontSize:"9.5px",color:T.tx3,letterSpacing:"0.04em",marginTop:"1px",
              fontFamily:"'DM Sans',system-ui"}}>
              Content Calendar 2026
            </div>
          </div>
        </div>

        <div style={{display:"flex",gap:"6px",alignItems:"center"}}>
          {/* Type filters */}
          {Object.entries(TYPES).map(([k,v])=>{
            const tc=typeColors[k];
            return (
              <button key={k} className="pb" onClick={()=>setFilt(filt===k?"all":k)} style={{
                fontSize:"10px",padding:"4px 11px",borderRadius:"20px",cursor:"pointer",
                fontFamily:"'DM Sans',system-ui",letterSpacing:"0.02em",
                border:`1px solid ${filt===k?tc.clr+"55":T.bdr}`,
                background:filt===k?tc.bg:"transparent",
                color:filt===k?tc.clr:T.tx3,transition:"all .15s"}}>
                {v.label}
              </button>
            );
          })}

          {/* Divider */}
          <div style={{width:"1px",height:"18px",background:T.bdr,margin:"0 4px"}}/>

          {/* Dark/Light toggle */}
          <button className="pb" onClick={()=>setIsDark(d=>!d)} style={{
            width:"34px",height:"34px",borderRadius:"50%",cursor:"pointer",
            border:`1px solid ${T.bdr}`,background:T.bg2,
            fontSize:"16px",display:"flex",alignItems:"center",justifyContent:"center",
            transition:"all .2s"}}>
            {T.toggle}
          </button>
        </div>
      </div>

      {/* ── BODY ────────────────────── */}
      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* ── SIDEBAR ──────────────── */}
        <div style={{width:"300px",flexShrink:0,borderRight:`1px solid ${T.bdr}`,
          display:"flex",flexDirection:"column",background:T.bg1,transition:"background .3s"}}>

          {/* Month nav */}
          <div style={{padding:"20px 18px 14px",borderBottom:`1px solid ${T.bdr}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"14px"}}>
              <div>
                <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"26px",fontWeight:"600",
                  lineHeight:1.1,letterSpacing:"-0.01em",
                  background:`linear-gradient(120deg,${accA},${accB})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                  {Mo.n}
                </div>
                <div style={{fontSize:"10px",color:T.tx3,marginTop:"4px",fontFamily:"'DM Sans',system-ui",
                  letterSpacing:"0.05em"}}>{Mo.season} · {year}</div>
              </div>
              <div style={{display:"flex",gap:"3px",marginTop:"4px"}}>
                {[["←",()=>nav(-1)],["○",()=>{setMonth(today.getMonth());setYear(today.getFullYear());setSel(null);}],["→",()=>nav(1)]].map(([l,fn],i)=>(
                  <button key={i} className="hn" onClick={fn} style={{
                    width:"28px",height:"28px",borderRadius:"8px",
                    border:`1px solid ${T.bdr}`,background:"transparent",
                    color:T.tx3,cursor:"pointer",fontSize:"12px",
                    fontFamily:"'DM Sans',system-ui",
                    transition:"all .15s",display:"flex",alignItems:"center",justifyContent:"center"}}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Stats bar */}
            <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
              <div style={{width:"3px",height:"28px",borderRadius:"2px",
                background:`linear-gradient(180deg,${accA},${accB}66)`}}/>
              <div>
                <div style={{fontSize:"10px",color:T.tx2,fontFamily:"'DM Sans',system-ui"}}>
                  {totEv>0?`${totEv} konten dijadwalkan`:"Tidak ada jadwal bulan ini"}
                </div>
                {hiEv>0&&(
                  <div style={{fontSize:"9.5px",color:T.urg,display:"flex",alignItems:"center",
                    gap:"4px",marginTop:"2px",fontFamily:"'DM Sans',system-ui"}}>
                    <div style={{width:"5px",height:"5px",borderRadius:"50%",background:T.urg}}/>
                    {hiEv} prioritas tinggi
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Day labels */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",
            padding:"10px 10px 3px"}}>
            {DAYS.map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:"9px",color:T.tx3,
                fontFamily:"'DM Sans',system-ui",fontWeight:"500",letterSpacing:"0.04em"}}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{flex:1,overflow:"auto",padding:"2px 10px 12px"}}>
            <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"2px"}}>
              {cells.map((d,i)=>{
                const ev=getEv(d);
                const hasPri=ev.some(e=>e.priority==="high");
                const isSel=d===sel, isTod=isTdy(d);
                const allDone=ev.length>0&&ev.every(e=>prog(e).done===e.tasks.length);
                return (
                  <div key={i} className={d?"hc":""} onClick={()=>{if(d){setSel(d===sel?null:d);setOpen(null);}}}
                    style={{height:"40px",borderRadius:"8px",padding:"4px 2px",
                      background:isSel?T.bg3:"transparent",
                      border:`1px solid ${isSel?T.bdr2:"transparent"}`,
                      cursor:d?"pointer":"default",position:"relative"}}>
                    {d&&<>
                      <div style={{width:"22px",height:"22px",borderRadius:"50%",margin:"0 auto",
                        display:"flex",alignItems:"center",justifyContent:"center",
                        background:isTod?`linear-gradient(135deg,${accA},${accB})`:"transparent"}}>
                        <span style={{fontSize:"10.5px",fontFamily:"'DM Sans',system-ui",
                          fontWeight:isTod?"600":"400",
                          color:isTod?( isDark?"#141810":"#F0EAD8" ):ev.length?T.tx1:T.tx3}}>
                          {d}
                        </span>
                      </div>
                      {/* event indicators */}
                      <div style={{display:"flex",gap:"1.5px",justifyContent:"center",marginTop:"2px"}}>
                        {ev.slice(0,4).map((e,ei)=>{
                          const tc=typeColors[e.type];
                          return <div key={ei} style={{width:"5px",height:"2.5px",borderRadius:"2px",
                            background:allDone?T.tx3:tc.clr,opacity:allDone?.3:.75}}/>;
                        })}
                      </div>
                      {hasPri&&!allDone&&(
                        <div style={{position:"absolute",top:"3px",right:"3px",
                          width:"4px",height:"4px",borderRadius:"50%",background:T.urg}}/>
                      )}
                      {allDone&&(
                        <div style={{position:"absolute",top:"2px",right:"4px",
                          fontSize:"8px",color:T.done}}>✓</div>
                      )}
                    </>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div style={{padding:"10px 12px 14px",borderTop:`1px solid ${T.bdr}`}}>
            <div style={{display:"flex",flexWrap:"wrap",gap:"8px"}}>
              {Object.entries(typeColors).map(([k,v])=>(
                <div key={k} style={{display:"flex",alignItems:"center",gap:"5px"}}>
                  <div style={{width:"10px",height:"3px",borderRadius:"2px",background:v.clr,opacity:.8}}/>
                  <span style={{fontSize:"9px",color:T.tx3,fontFamily:"'DM Sans',system-ui"}}>
                    {TYPES[k].label}
                  </span>
                </div>
              ))}
              <div style={{display:"flex",alignItems:"center",gap:"5px"}}>
                <div style={{width:"5px",height:"5px",borderRadius:"50%",background:T.urg}}/>
                <span style={{fontSize:"9px",color:T.tx3,fontFamily:"'DM Sans',system-ui"}}>Prioritas tinggi</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── MAIN PANEL ─────────────── */}
        <div style={{flex:1,overflow:"auto",padding:"24px 26px",background:T.bg0,transition:"background .3s"}}>
          {!sel ? (
            <div style={{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",
              flexDirection:"column",gap:"14px",opacity:.25,userSelect:"none"}}>
              <div style={{fontSize:"48px"}}>{Mo.emoji}</div>
              <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"14px",fontWeight:"400",
                color:T.tx1,textAlign:"center",lineHeight:2}}>
                Pilih tanggal untuk melihat<br/>jadwal & checklist produksi
              </div>
            </div>
          ) : (
            <div className="fin">
              {/* Date header */}
              <div style={{marginBottom:"20px",paddingBottom:"14px",
                borderBottom:`1px solid ${T.bdr}`}}>
                <div style={{display:"flex",alignItems:"baseline",justifyContent:"space-between"}}>
                  <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"20px",fontWeight:"600",
                    background:`linear-gradient(100deg,${accA},${accB})`,
                    WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                    letterSpacing:"0.01em"}}>
                    {Mo.emoji} {sel} {Mo.n} {year}
                  </div>
                  {selEvts.length>0&&(
                    <span style={{fontSize:"10px",color:T.tx3,fontFamily:"'DM Sans',system-ui"}}>
                      {selEvts.length} konten
                    </span>
                  )}
                </div>
              </div>

              {selEvts.length===0 ? (
                <div style={{background:T.bg2,borderRadius:"12px",padding:"20px 24px",
                  border:`1px solid ${T.bdr}`,
                  borderLeft:`3px solid ${accA}60`}}>
                  <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"12px",color:T.tx3,
                    marginBottom:"10px",fontStyle:"italic"}}>
                    Hari kosong — {Mo.season}
                  </div>
                  <div style={{fontFamily:"'DM Sans',system-ui",fontSize:"12px",
                    color:T.tx2,lineHeight:2.1}}>
                    → Produksi batch evergreen (texture, botanical pattern)<br/>
                    → Revisi & optimasi keyword aset yang sudah live<br/>
                    → Riset tren & analisis kompetitor di platform<br/>
                    → Istirahat, isi ulang energi kreatif ☕
                  </div>
                </div>
              ) : (
                <div style={{display:"flex",flexDirection:"column",gap:"10px"}}>
                  {selEvts.map(ev=>{
                    const {done,total,pct}=prog(ev);
                    const isOpen=open===ev.id;
                    const tc=typeColors[ev.type];
                    const pc=prioColors[ev.priority];
                    const r=13,circ=2*Math.PI*r;
                    const isUrgent=ev.uploadDl.includes("⚠️");

                    return (
                      <div key={ev.id} style={{
                        background:T.bg2,borderRadius:"12px",
                        border:`1px solid ${isOpen?tc.clr+"40":T.bdr}`,
                        borderLeft:`3px solid ${isOpen?tc.clr:T.bdr2}`,
                        overflow:"hidden",transition:"all .2s"}}>

                        {/* Card header */}
                        <div className="ch" onClick={()=>setOpen(isOpen?null:ev.id)}
                          style={{padding:"14px 16px",cursor:"pointer",display:"flex",
                            alignItems:"flex-start",gap:"12px",transition:"background .12s"}}>

                          {/* Progress ring */}
                          <div style={{position:"relative",width:"34px",height:"34px",flexShrink:0,marginTop:"1px"}}>
                            <svg width="34" height="34" style={{transform:"rotate(-90deg)"}}>
                              <circle cx="17" cy="17" r={r} fill="none" stroke={T.bdr2} strokeWidth="2"/>
                              <circle cx="17" cy="17" r={r} fill="none"
                                stroke={pct===100?T.done:tc.clr} strokeWidth="2"
                                strokeDasharray={circ} strokeDashoffset={circ*(1-pct/100)}
                                strokeLinecap="round"
                                style={{transition:"stroke-dashoffset .4s ease"}}/>
                            </svg>
                            <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
                              justifyContent:"center",fontSize:"8px",fontFamily:"'DM Sans',system-ui",
                              color:pct===100?T.done:T.tx2}}>
                              {pct===100?"✓":`${pct}%`}
                            </div>
                          </div>

                          <div style={{flex:1,minWidth:0}}>
                            <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"13px",
                              fontWeight:"500",color:T.tx0,lineHeight:"1.5",marginBottom:"7px"}}>
                              {ev.title}
                            </div>
                            {/* Badges */}
                            <div style={{display:"flex",gap:"5px",flexWrap:"wrap",marginBottom:"7px",
                              alignItems:"center"}}>
                              <span style={{fontSize:"9.5px",padding:"2px 9px",borderRadius:"20px",
                                background:tc.bg,color:tc.clr,fontFamily:"'DM Sans',system-ui"}}>
                                {TYPES[ev.type].label}
                              </span>
                              <span style={{fontSize:"9.5px",padding:"2px 9px",borderRadius:"20px",
                                background:pc.bg,color:pc.clr,fontFamily:"'DM Sans',system-ui"}}>
                                {PRIO[ev.priority].label}
                              </span>
                            </div>
                            {/* Upload deadline */}
                            <div style={{display:"inline-flex",alignItems:"center",gap:"6px",
                              borderRadius:"8px",padding:"3px 10px",
                              background:isUrgent?`${T.urg}15`:`${T.tx3}10`,
                              border:`1px solid ${isUrgent?T.urg+"44":T.bdr}`}}>
                              <span style={{fontSize:"9px",color:T.tx3,fontFamily:"'DM Sans',system-ui"}}>
                                Upload deadline
                              </span>
                              <span style={{width:"3px",height:"3px",borderRadius:"50%",
                                background:isUrgent?T.urg:T.tx3}}/>
                              <span style={{fontSize:"9.5px",fontWeight:"500",
                                color:isUrgent?T.urg:T.tx2,fontFamily:"'DM Sans',system-ui"}}>
                                {ev.uploadDl}
                              </span>
                            </div>
                            <div style={{fontSize:"9.5px",color:T.tx3,marginTop:"5px",
                              fontFamily:"'DM Sans',system-ui"}}>
                              {done}/{total} task selesai
                            </div>
                          </div>

                          <div style={{color:T.tx3,fontSize:"10px",marginTop:"5px",
                            transition:"transform .2s",transform:isOpen?"rotate(180deg)":"none"}}>
                            ▾
                          </div>
                        </div>

                        {/* Expanded panel */}
                        {isOpen&&(
                          <div style={{borderTop:`1px solid ${T.bdr}`,padding:"14px 16px"}}>
                            <p style={{fontFamily:"'DM Sans',system-ui",fontSize:"12px",
                              color:T.tx2,lineHeight:"1.9",marginBottom:"16px"}}>
                              {ev.desc}
                            </p>

                            {/* Checklist */}
                            <div style={{marginBottom:"14px"}}>
                              <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"10px",
                                color:T.tx3,marginBottom:"8px",fontStyle:"italic",
                                letterSpacing:"0.04em"}}>
                                Checklist Produksi
                              </div>
                              <div style={{display:"flex",flexDirection:"column",gap:"2px"}}>
                                {ev.tasks.map((task,ti)=>{
                                  const isDone=!!checks[`${ev.id}_${ti}`];
                                  const dlUrgent=task.dl&&task.dl.includes("⚠️");
                                  return (
                                    <div key={ti} className="tr"
                                      onClick={()=>toggle(ev.id,ti)}
                                      style={{display:"flex",alignItems:"center",gap:"9px",
                                        cursor:"pointer",padding:"5px 8px",borderRadius:"8px",
                                        background:isDone?T.bg3:"transparent",
                                        transition:"background .1s"}}>
                                      {/* Checkbox */}
                                      <div style={{
                                        width:"15px",height:"15px",borderRadius:"5px",flexShrink:0,
                                        border:`1.5px solid ${isDone?tc.clr:T.bdr2}`,
                                        background:isDone?`${tc.clr}60`:"transparent",
                                        display:"flex",alignItems:"center",justifyContent:"center",
                                        transition:"all .18s"}}>
                                        {isDone&&(
                                          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                            <path d="M1 3.5L3.5 6L8 1" stroke={tc.clr}
                                              strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        )}
                                      </div>
                                      {/* Label */}
                                      <span style={{flex:1,fontFamily:"'DM Sans',system-ui",
                                        fontSize:"11.5px",lineHeight:"1.55",
                                        color:isDone?T.tx3:T.tx1,
                                        textDecoration:isDone?"line-through":"none",
                                        transition:"color .15s"}}>
                                        {task.l}
                                      </span>
                                      {/* Task deadline */}
                                      {task.dl&&(
                                        <span style={{flexShrink:0,fontFamily:"'DM Sans',system-ui",
                                          fontSize:"9px",
                                          color:dlUrgent?T.urg:isDone?T.tx3:T.tx2,
                                          background:dlUrgent?`${T.urg}15`:"transparent",
                                          padding:dlUrgent?"1px 7px":"0",
                                          borderRadius:"6px",fontWeight:dlUrgent?"500":"400"}}>
                                          {task.dl}
                                        </span>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Keywords */}
                            <div style={{background:T.bg0,borderRadius:"10px",
                              padding:"10px 14px",border:`1px solid ${T.bdr}`,
                              transition:"background .3s"}}>
                              <div style={{fontFamily:"'Lora',Georgia,serif",fontSize:"9.5px",
                                color:T.tx3,marginBottom:"7px",fontStyle:"italic"}}>
                                Keywords untuk upload
                              </div>
                              <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                                {ev.kw.map((kw,ki)=>(
                                  <span key={ki} style={{fontFamily:"'DM Sans',system-ui",
                                    fontSize:"10px",color:T.tx2,
                                    background:T.bg2,padding:"2px 10px",
                                    borderRadius:"6px",lineHeight:"1.8",
                                    border:`1px solid ${T.bdr}`,
                                    transition:"background .3s"}}>
                                    {kw}
                                  </span>
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
          )}
        </div>
      </div>
    </div>
  );
}
