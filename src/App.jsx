import { useState, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');`;

// ─── Demo Data — exact Ahrefs Batch Analysis format ─────────────────────────
const DEMO_CSV = `"#"\t"Target"\t"Mode"\t"IP"\t"Protocol"\t"URL Rating"\t"Domain Rating"\t"Ahrefs Rank"\t"Organic / Total Keywords"\t"Organic / Keywords (Top 3)"\t"Organic / Keywords (4-10)"\t"Organic / Keywords (11-20)"\t"Organic / Keywords (21-50)"\t"Organic / Keywords (51+)"\t"Organic / Traffic"\t"Organic / Value"\t"Organic / Top Countries"\t"Paid / Keywords"\t"Paid / Ads"\t"Paid / Traffic"\t"Paid / Cost"\t"Ref. domains / All"\t"Ref. domains / Followed"\t"Ref. domains / Not followed"\t"Ref. IPs / IPs"\t"Ref. IPs / Subnets"\t"Backlinks / All"\t"Backlinks / Followed"\t"Backlinks / Not followed"\t"Backlinks / Redirects"\t"Backlinks / Internal"\t"Outgoing domains / Followed"\t"Outgoing domains / All time"\t"Outgoing links / Followed"\t"Outgoing links / All time"
"1"\t"casinoreviewer.io/"\t"subdomains"\t"104.21.14.29"\t"both"\t"32"\t"54"\t"89302"\t"4210"\t"380"\t"890"\t"1200"\t"980"\t"760"\t"31000"\t"18240.50"\t"(mt, 18200)"\t""\t""\t""\t""\t"2100"\t"1890"\t"210"\t"1940"\t"880"\t"8430"\t"7920"\t"510"\t"90"\t"1200"\t"760"\t"762"\t"2100"\t"2105"
"2"\t"igamingnews.com/"\t"subdomains"\t"172.67.85.93"\t"both"\t"38"\t"55"\t"201034"\t"3180"\t"290"\t"710"\t"980"\t"760"\t"440"\t"22000"\t"14820.30"\t"(mt, 12000)"\t""\t""\t""\t""\t"1650"\t"1490"\t"160"\t"1580"\t"720"\t"5940"\t"5600"\t"340"\t"60"\t"890"\t"480"\t"481"\t"1340"\t"1342"
"3"\t"worldnews-today.com/"\t"subdomains"\t"104.21.14.156"\t"both"\t"31"\t"49"\t"143988"\t"9800"\t"780"\t"2100"\t"3200"\t"2400"\t"1320"\t"67000"\t"28900.00"\t"(us, 42000)"\t""\t""\t""\t""\t"4100"\t"3200"\t"900"\t"3800"\t"1700"\t"18200"\t"14800"\t"3400"\t"890"\t"4200"\t"1200"\t"1205"\t"3800"\t"3820"
"4"\t"digitaltrends-pro.com/"\t"subdomains"\t"104.21.63.141"\t"both"\t"29"\t"44"\t"329253"\t"5600"\t"410"\t"1200"\t"1800"\t"1500"\t"690"\t"28000"\t"15200.00"\t"(us, 22000)"\t""\t""\t""\t""\t"1980"\t"1650"\t"330"\t"1820"\t"840"\t"7200"\t"6100"\t"1100"\t"210"\t"1800"\t"670"\t"672"\t"2100"\t"2108"
"5"\t"localfootball.co.uk/"\t"subdomains"\t"104.21.27.86"\t"both"\t"35"\t"58"\t"263459"\t"4200"\t"320"\t"980"\t"1400"\t"1100"\t"400"\t"9200"\t"4800.00"\t"(gb, 8900)"\t""\t""\t""\t""\t"1890"\t"1520"\t"370"\t"1740"\t"800"\t"6800"\t"5600"\t"1200"\t"180"\t"1600"\t"540"\t"542"\t"1700"\t"1705"
"6"\t"megabonus-links.com/"\t"subdomains"\t"172.67.128.23"\t"both"\t"12"\t"41"\t"575853"\t"890"\t"60"\t"190"\t"280"\t"240"\t"120"\t"180"\t"90.00"\t"(cy, 120)"\t""\t""\t""\t""\t"3800"\t"820"\t"2980"\t"1200"\t"490"\t"48200"\t"10400"\t"37800"\t"120"\t"8900"\t"12000"\t"12100"\t"38000"\t"38200"
"7"\t"gamblingnews24.net/"\t"subdomains"\t"172.67.169.38"\t"both"\t"8"\t"22"\t"864132"\t"420"\t"28"\t"89"\t"120"\t"140"\t"43"\t"890"\t"380.00"\t"(uk, 780)"\t""\t""\t""\t""\t"180"\t"98"\t"82"\t"160"\t"70"\t"640"\t"340"\t"300"\t"18"\t"120"\t"4200"\t"4210"\t"13800"\t"13820"
"8"\t"casinomatch.de/"\t"subdomains"\t"172.67.168.107"\t"both"\t"41"\t"61"\t"176034"\t"6800"\t"520"\t"1800"\t"2100"\t"1600"\t"780"\t"19000"\t"9800.00"\t"(de, 18200)"\t""\t""\t""\t""\t"2800"\t"2520"\t"280"\t"2600"\t"1200"\t"9800"\t"9100"\t"700"\t"140"\t"2000"\t"430"\t"432"\t"1400"\t"1402"
"9"\t"linkfarm99.biz/"\t"subdomains"\t"104.26.15.57"\t"both"\t"9"\t"38"\t"1200634"\t"280"\t"18"\t"62"\t"98"\t"78"\t"24"\t"290"\t"140.00"\t"(cy, 180)"\t""\t""\t""\t""\t"6700"\t"1280"\t"5420"\t"2100"\t"890"\t"82000"\t"15600"\t"66400"\t"240"\t"14200"\t"8900"\t"8920"\t"28000"\t"28100"
"10"\t"slotsguide.com/"\t"subdomains"\t"104.21.14.99"\t"both"\t"22"\t"33"\t"720034"\t"1800"\t"120"\t"380"\t"560"\t"480"\t"260"\t"4500"\t"2100.00"\t"(mt, 3800)"\t""\t""\t""\t""\t"380"\t"320"\t"60"\t"350"\t"160"\t"1380"\t"1180"\t"200"\t"28"\t"320"\t"290"\t"292"\t"920"\t"924"`;

const DEMO_DESTINATION = {
  domain: "skycity.com",
  keywords: "online casino, live casino games, online casino Denmark, casino bonus Denmark, best online casino",
  gscData: null
};

// ─── Parse Ahrefs Batch Analysis TSV ─────────────────────────────────────────
function parseCSV(text) {
  const lines = text.trim().split("\n").filter(l => l.trim());
  if (lines.length < 2) return [];

  // Strip BOM if present, clean quotes, split on tab
  const clean = l => l.replace(/^\uFEFF/, "").split("\t").map(c => c.trim().replace(/^"|"$/g, ""));

  const headers = clean(lines[0]);
  const idx = h => headers.findIndex(x => x.toLowerCase().includes(h.toLowerCase()));

  // Column index map — works with Ahrefs Batch Analysis export
  const iTarget   = idx("Target");
  const iDR       = idx("Domain Rating");
  const iTraffic  = idx("Organic / Traffic");
  const iRefAll   = idx("Ref. domains / All");
  const iRefFollow= idx("Ref. domains / Followed");
  const iOutDom   = idx("Outgoing domains / Followed");
  const iCountry  = idx("Organic / Top Countries");
  const iUR       = idx("URL Rating");
  const iBackAll  = idx("Backlinks / All");
  const iBackFol  = idx("Backlinks / Followed");
  const iRefIPs   = idx("Ref. IPs / IPs");

  return lines.slice(1).map(line => {
    const cols = clean(line);
    const refAll    = parseFloat(cols[iRefAll])    || 0;
    const refFollow = parseFloat(cols[iRefFollow]) || 0;
    const dofollowPct = refAll > 0 ? Math.round((refFollow / refAll) * 100) : 0;

    // Extract primary country from "(us, 12000)" format
    const countryRaw = cols[iCountry] || "";
    const countryMatch = countryRaw.match(/\(([a-z]{2})/i);
    const country = countryMatch ? countryMatch[1].toUpperCase() : "";

    return {
      domain:           (cols[iTarget] || "").replace(/\/+$/, ""),
      dr:               cols[iDR]      || "0",
      organic_traffic:  cols[iTraffic] || "0",
      referring_domains: String(refAll),
      ref_domains_followed: String(refFollow),
      "dofollow_%":     String(dofollowPct),
      outgoing_domains: cols[iOutDom]  || "0",
      country,
      url_rating:       cols[iUR]      || "0",
      backlinks_all:    cols[iBackAll] || "0",
      backlinks_followed: cols[iBackFol] || "0",
      ref_ips:          cols[iRefIPs]  || "0",
      topics:           "", // not in Ahrefs export — Claude infers from domain
    };
  }).filter(r => r.domain && r.domain !== "#");
}

// ─── V1 Scoring ───────────────────────────────────────────────────────────────
const ACCEPTABLE_NICHES = ["casino", "gambling", "igaming", "slots", "news", "tech", "gaming", "finance", "sports betting"];
const BROAD_SPAM_TOPICS = ["cooking", "health", "food", "travel", "gardening", "fashion", "home", "beauty", "fitness", "recipe"];

function scoreV1(row, criteria, destinationDomain) {
  const issues = [];
  const flags  = [];
  let score = 100;

  const dr          = parseFloat(row.dr) || 0;
  const traffic     = parseFloat(row.organic_traffic) || 0;
  const refDomains  = parseFloat(row.referring_domains) || 0;
  const refFollowed = parseFloat(row.ref_domains_followed) || 0;
  const outDomains  = parseFloat(row.outgoing_domains) || 0;
  const dofollowPct = parseFloat(row["dofollow_%"]) || 0;
  const backlinkAll = parseFloat(row.backlinks_all) || 0;
  const refIPs      = parseFloat(row.ref_ips) || 0;
  const country     = (row.country || "").toUpperCase();
  const domain      = (row.domain || "").toLowerCase();

  // ── CRITERION 1: DR minimum ───────────────────────────────────────────────
  if (dr < criteria.minDR) {
    issues.push(`DR ${dr} below minimum ${criteria.minDR}`); score -= 35;
  }

  // ── CRITERION 2: Organic traffic minimum ─────────────────────────────────
  if (traffic < 100) {
    issues.push(`Near-zero traffic (${traffic}/mo) — site inactive or penalised`); score -= 80;
  } else if (traffic < criteria.minTraffic) {
    issues.push(`Traffic ${traffic.toLocaleString()}/mo below minimum ${criteria.minTraffic.toLocaleString()}`); score -= 30;
  }

  // ── CRITERION 3: Dofollow % of referring domains ──────────────────────────
  if (dofollowPct > 0 && dofollowPct < 25) {
    issues.push(`Dofollow ${dofollowPct}% — extremely low, strong PBN signal`); score -= 50;
  } else if (dofollowPct >= 25 && dofollowPct < criteria.minDofollow) {
    issues.push(`Dofollow ${dofollowPct}% below threshold of ${criteria.minDofollow}%`); score -= 15;
  }

  // ── CRITERION 4: Link balance (outgoing vs referring domains) ─────────────
  if (outDomains > 0 && refDomains > 0) {
    const bal = outDomains - refDomains;
    if (bal > 2000)      { issues.push(`Link balance: outgoing (${outDomains.toLocaleString()}) exceeds incoming (${refDomains.toLocaleString()}) by ${bal.toLocaleString()}`); score -= 35; }
    else if (bal > 1000) { issues.push(`Link balance: outgoing (${outDomains.toLocaleString()}) exceeds incoming (${refDomains.toLocaleString()}) by ${bal.toLocaleString()}`); score -= 25; }
    else if (bal > 500)  { flags.push(`Link balance warning: outgoing (${outDomains.toLocaleString()}) slightly exceeds incoming (${refDomains.toLocaleString()})`); score -= 15; }
  }
  if (outDomains > 5000) {
    issues.push(`Outgoing domains ${outDomains.toLocaleString()} — likely link seller or directory`); score -= 25;
  }

  // ── CRITERION 5: PBN signals ──────────────────────────────────────────────
  // Unnaturally high dofollow %
  if (dofollowPct > 97) {
    flags.push(`Dofollow ${dofollowPct}% — unnaturally high, no real site is 97%+ dofollow`); score -= 15;
  }
  // Backlink/RD ratio — link exchange pattern
  if (backlinkAll > 0 && refDomains > 50) {
    const ratio = backlinkAll / refDomains;
    if (ratio < 1.5) { flags.push(`Backlink/ref-domain ratio ${ratio.toFixed(1)} — very low, suggests link exchange network`); score -= 15; }
  }
  // Low IP diversity
  if (refDomains > 100 && refIPs > 0 && (refIPs / refDomains) < 0.4) {
    flags.push(`Low IP diversity: ${refIPs} IPs for ${refDomains} ref domains — possible private network`); score -= 15;
  }

  // ── CRITERION 6: Geo — local ccTLD check ─────────────────────────────────
  const localTLDs = [".co.uk",".de",".fr",".it",".es",".nl",".pl",".pt",".se",".no",".dk",".fi",".co.za",".com.au",".co.nz"];
  const isLocal = localTLDs.some(tld => domain.endsWith(tld));
  if (isLocal && criteria.targetGeo && !criteria.targetGeo.includes(country)) {
    flags.push(`Local ccTLD (${country}) — verify geo relevance to target market ${criteria.targetGeo}`); score -= 15;
  }

  // ── BLIND SPOT FLAGS — manual check recommended ───────────────────────────
  // DR/traffic mismatch — possible hidden traffic drop
  if (dr >= 60 && traffic > 100 && traffic < 10000) {
    flags.push(`⚠ Manual check: DR ${dr} but only ${traffic.toLocaleString()} traffic — verify traffic trend in Ahrefs`); score -= 15;
  } else if (dr >= 50 && traffic > 100 && traffic < 5000) {
    flags.push(`⚠ Manual check: DR ${dr} but only ${traffic.toLocaleString()} traffic — check for recent drops`); score -= 10;
  }
  // DR vs ref domains mismatch — inflated DR
  if (dr >= 50 && refDomains < 300) {
    flags.push(`⚠ Manual check: DR ${dr} but only ${refDomains} ref domains — DR may be inflated`); score -= 20;
  }

  score = Math.max(0, Math.min(100, score));
  const verdict = score >= 75 ? "approve" : score >= 50 ? "review" : "reject";
  return { ...row, score, verdict, issues, flags, method: "algo", aiAnalysis: null };
}

// ─── V2 Claude Enhancement ────────────────────────────────────────────────────
async function claudeEnhance(results, destination, apiKey = "") {
  const weak = results.filter(r => r.verdict === "approve" || r.verdict === "review");
  if (!weak.length) return results;

  const headers = { "Content-Type": "application/json" };
  if (apiKey.trim()) headers["x-api-key"] = apiKey.trim();

  const destContext = `Destination domain: ${destination.domain}
Target keywords: ${destination.keywords || "not provided"}
${destination.gscData ? `GSC top keywords: ${destination.gscData}` : ""}`;

  const prompt = `You are an experienced iGaming SEO link building specialist. Evaluate these domains as potential link placements for an iGaming/casino site.

${destContext}

Domains to evaluate (with metrics):
${weak.map(r => `- ${r.domain} | DR: ${r.dr} | Traffic: ${r.organic_traffic}/mo | Ref domains: ${r.referring_domains} | Dofollow%: ${r["dofollow_%"]}% | Outgoing domains: ${r.outgoing_domains} | Country: ${r.country} | Issues: ${r.issues.join("; ")} | Flags: ${r.flags.join("; ")}`).join("\n")}

For each domain:
1. Assess topical relevance to the destination (casino/iGaming)
2. Assess whether it looks like a genuine editorial site or a link network
3. Assess geo relevance to the destination's target market
4. Suggest 3 specific anchor texts (branded, target keyword, partial match or generic)
5. Recommend the most relevant destination URL on ${destination.domain} for the link

ANCHOR TEXT AND DESTINATION URL ARE REQUIRED FOR EVERY DOMAIN.

Return ONLY a raw JSON array, no markdown:
[{"domain":"...","verdict":"approve|review|reject","aiReasoning":"2 sentences","anchors":["anchor1","anchor2","anchor3"],"destinationUrl":"https://...","confidence":"high|medium|low"}]`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST", headers,
    body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 2000, messages: [{ role: "user", content: prompt }] }),
  });
  if (res.status === 401) throw new Error("AUTH_REQUIRED");
  if (!res.ok) throw new Error("API_ERROR");

  const data = await res.json();
  const text = data.content?.map(b => b.text || "").join("") || "";
  let ai = [];
  try { ai = JSON.parse(text.replace(/```json|```/g, "").trim()); } catch { return results; }

  return results.map(r => {
    const a = ai.find(x => x.domain === r.domain);
    if (!a) return r;
    return { ...r, verdict: a.verdict, aiAnalysis: a.aiReasoning, anchors: a.anchors || [], destinationUrl: a.destinationUrl || "", method: "claude", confidence: a.confidence };
  });
}

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportCSV(results, version) {
  const rows = [
    ["Domain", "DR", "Organic Traffic", "Referring Domains", "Dofollow %", "Topics", "Country", "Score", "Verdict", "Method", "Issues", "Flags", "AI Analysis", "Suggested Anchors", "Destination URL"],
    ...results.map(r => [
      r.domain, r.dr, r.organic_traffic, r.referring_domains, r["dofollow_%"] || r.dofollow_pct || r.dofollow_ || "",
      r.topics, r.country, r.score, r.verdict, r.method,
      (r.issues || []).join("; "), (r.flags || []).join("; "),
      r.aiAnalysis || "", (r.anchors || []).join(" | "), r.destinationUrl || ""
    ])
  ];
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  a.download = `link-qualifier-${version}-${Date.now()}.csv`;
  a.click();
}

// ─── Verdict styles ───────────────────────────────────────────────────────────
const VERDICT = {
  approve: { bg: "#edf7f2", border: "#c3e6d4", text: "#1a5c38", dot: "#2a7d4f", label: "✓ Approve" },
  review:  { bg: "#fef7ed", border: "#f5d9a8", text: "#7a4a10", dot: "#b87020", label: "⚠ Review"  },
  reject:  { bg: "#fdf0ef", border: "#f5c6c2", text: "#8b1a14", dot: "#c0392b", label: "✕ Reject"  },
};


// ─── Coverage Panel Data ──────────────────────────────────────────────────────
const COVERAGE = [
  { label: "DR minimum",              status: "auto",    note: "Hard threshold, instant deduction" },
  { label: "Organic traffic minimum", status: "auto",    note: "Hard threshold + near-zero kill" },
  { label: "Dofollow % of ref domains", status: "auto",  note: "Calculated from Ahrefs export columns" },
  { label: "Link balance",            status: "auto",    note: "Outgoing vs referring domain ratio" },
  { label: "PBN signals",             status: "auto",    note: "Dofollow %, BL/RD ratio, IP diversity, outgoing ceiling" },
  { label: "Geo / ccTLD relevance",   status: "auto",    note: "Local TLD vs target market mismatch" },
  { label: "Topic focus / niche fit", status: "partial", note: "No topic column in Ahrefs export — Claude V2 infers from domain name" },
  { label: "DR vs traffic mismatch",  status: "partial", note: "Flagged as manual check — confirms suspicious combos but not root cause" },
  { label: "Traffic trend (6mo)",     status: "manual",  note: "No historical data on Standard plan — check Ahrefs graph for shortlisted domains" },
  { label: "Prior link to destination", status: "manual", note: "Cannot query backlinks without Enterprise API — verify manually" },
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function LinkQualifier() {
  const [csvText, setCsvText] = useState("");
  const [csvFileName, setCsvFileName] = useState("");
  const [gscText, setGscText] = useState("");
  const [gscFileName, setGscFileName] = useState("");
  const [destDomain, setDestDomain] = useState("");
  const [destKeywords, setDestKeywords] = useState("");
  const [v1, setV1] = useState(null);
  const [v2, setV2] = useState(null);
  const [active, setActive] = useState("v1");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [expandedRow, setExpandedRow] = useState(null);

  // Editable criteria
  const [criteria, setCriteria] = useState({
    minDR: 30, minTraffic: 2500, minDofollow: 51, targetGeo: ""
  });

  const loadDemo = () => {
    setCsvText(DEMO_CSV); setCsvFileName("demo-broker-list.csv");
    setDestDomain(DEMO_DESTINATION.domain);
    setDestKeywords(DEMO_DESTINATION.keywords);
    setV1(null); setV2(null); setError(""); setFilter("all");
  };

  const handleFile = (e, setText, setName) => {
    const f = e.target.files[0]; if (!f) return;
    setName(f.name);
    const r = new FileReader(); r.onload = ev => setText(ev.target.result); r.readAsText(f);
  };

  const analyze = () => {
    setError("");
    if (!csvText.trim()) { setError("Please provide an Ahrefs CSV export or load the demo."); return; }
    if (!destDomain.trim()) { setError("Please enter a destination domain."); return; }
    const rows = parseCSV(csvText);
    if (!rows.length) { setError("Could not parse CSV. Check format."); return; }
    setLoading(true);
    setTimeout(() => {
      const scored = rows.map(r => scoreV1(r, criteria, destDomain));
      scored.sort((a, b) => b.score - a.score);
      setV1(scored); setV2(null); setActive("v1"); setFilter("all"); setExpandedRow(null);
      setLoading(false);
    }, 400);
  };

  const enhance = async (key = apiKey) => {
    if (!v1) return;
    setEnhancing(true); setError(""); setShowKey(false);
    try {
      const dest = { domain: destDomain, keywords: destKeywords, gscData: gscText || null };
      const enhanced = await claudeEnhance(v1, dest, key);
      setV2(enhanced); setActive("v2"); setFilter("all");
    } catch (e) {
      if (e.message === "AUTH_REQUIRED") setShowKey(true);
      else setError("Claude API error. Please try again.");
    }
    setEnhancing(false);
  };

  const cur = active === "v2" && v2 ? v2 : v1;
  const filtered = cur ? cur.filter(r => {
    if (filter === "approve") return r.verdict === "approve";
    if (filter === "review") return r.verdict === "review";
    if (filter === "reject") return r.verdict === "reject";
    if (filter === "claude") return r.method === "claude";
    return true;
  }) : [];

  const stats = cur ? {
    total: cur.length,
    approve: cur.filter(r => r.verdict === "approve").length,
    review: cur.filter(r => r.verdict === "review").length,
    reject: cur.filter(r => r.verdict === "reject").length,
    claude: cur.filter(r => r.method === "claude").length,
  } : null;

  const v1Approve = v1 ? v1.filter(r => r.verdict === "approve").length : 0;
  const v2Approve = v2 ? v2.filter(r => r.verdict === "approve").length : 0;

  return (
    <>
      <style>{`
        ${FONTS}
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        :root {
          --navy: #1a2744; --navy-mid: #243459; --navy-faint: #f2f4f9;
          --gold: #b87020; --gold-light: #fef7ed; --gold-mid: #f5d9a8;
          --paper: #f8f7f4; --border: #dde1ec; --white: #fff;
          --ink: #1a2744; --ink-mid: #4a5568; --ink-light: #8a95a8;
          --serif: 'Playfair Display', Georgia, serif;
          --sans: 'DM Sans', sans-serif;
          --mono: 'JetBrains Mono', monospace;
        }
        body { background: var(--paper); font-family: var(--sans); color: var(--ink); }
        .app { min-height: 100vh; }

        /* Header */
        .hdr {
          background: var(--navy); height: 64px; padding: 0 48px;
          display: flex; align-items: center; justify-content: space-between;
          position: sticky; top: 0; z-index: 100;
        }
        .hdr-l { display: flex; align-items: center; gap: 14px; }
        .hdr-badge {
          font-family: var(--mono); font-size: 10px; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--gold);
          border: 1px solid rgba(184,112,32,0.45); padding: 4px 10px; border-radius: 4px;
        }
        .hdr-title { font-family: var(--serif); font-size: 20px; color: #fff; font-weight: 700; }
        .hdr-r { display: flex; align-items: center; gap: 12px; }
        .hdr-by { font-family: var(--mono); font-size: 10px; color: rgba(255,255,255,0.28); }
        .demo-pill {
          font-family: var(--mono); font-size: 11px; background: transparent;
          border: 1px solid rgba(255,255,255,0.18); color: rgba(255,255,255,0.65);
          padding: 6px 16px; border-radius: 20px; cursor: pointer; transition: all 0.2s;
        }
        .demo-pill:hover { border-color: var(--gold); color: #e8a84a; }

        /* Main */
        .main { max-width: 1200px; margin: 0 auto; padding: 48px 40px 80px; }
        .sec-lbl { font-family: var(--mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold); margin-bottom: 6px; }
        .sec-ttl { font-family: var(--serif); font-size: 28px; font-weight: 700; color: var(--navy); margin-bottom: 24px; letter-spacing: -0.5px; }

        /* Input grid */
        .top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .bottom-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .card {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 12px; overflow: hidden; transition: border-color 0.2s;
        }
        .card:focus-within { border-color: var(--gold); }
        .card-hd {
          padding: 13px 18px; background: var(--navy-faint);
          border-bottom: 1px solid var(--border);
          display: flex; align-items: center; justify-content: space-between;
        }
        .card-lbl {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 1px; color: var(--navy-mid);
          display: flex; align-items: center; gap: 8px;
        }
        .card-dot { width: 7px; height: 7px; border-radius: 50%; }
        .file-btn {
          font-family: var(--mono); font-size: 10px; color: var(--ink-light);
          background: var(--white); border: 1px solid var(--border);
          padding: 5px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s;
        }
        .file-btn:hover { border-color: var(--gold); color: var(--gold); }
        .file-btn input { display: none; }
        .card-ta {
          width: 100%; height: 160px; background: var(--white);
          border: none; outline: none; resize: none;
          font-family: var(--mono); font-size: 10.5px; color: var(--ink-mid);
          line-height: 1.75; padding: 14px 18px;
        }
        .card-ta::placeholder { color: #c8cdd8; }
        .card-inp {
          width: 100%; background: var(--white); border: none; outline: none;
          font-family: var(--sans); font-size: 13px; color: var(--ink);
          padding: 14px 18px; line-height: 1.5;
        }
        .card-inp::placeholder { color: #c8cdd8; }

        /* Criteria panel */
        .criteria-panel {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 12px; padding: 18px 20px; margin-bottom: 20px;
        }
        .criteria-title {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          text-transform: uppercase; letter-spacing: 1px; color: var(--navy-mid);
          margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
        }
        .criteria-title::before { content: "⚙"; font-size: 12px; }
        .criteria-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
        .crit-item { display: flex; flex-direction: column; gap: 5px; }
        .crit-lbl { font-family: var(--mono); font-size: 10px; color: var(--ink-light); text-transform: uppercase; letter-spacing: 0.8px; }
        .crit-inp {
          background: var(--navy-faint); border: 1px solid var(--border);
          border-radius: 6px; padding: 7px 10px;
          font-family: var(--mono); font-size: 12px; color: var(--ink);
          outline: none; transition: border-color 0.2s;
        }
        .crit-inp:focus { border-color: var(--gold); }

        /* Actions */
        .actions { display: flex; align-items: center; gap: 14px; margin-bottom: 48px; }
        .btn-navy {
          font-family: var(--sans); font-size: 14px; font-weight: 600;
          background: var(--navy); color: #fff; border: none;
          padding: 12px 28px; border-radius: 8px; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .btn-navy:hover { background: var(--navy-mid); transform: translateY(-1px); box-shadow: 0 4px 16px rgba(26,39,68,0.2); }
        .btn-navy:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .btn-gold {
          font-family: var(--sans); font-size: 14px; font-weight: 600;
          background: var(--gold); color: #fff; border: none;
          padding: 12px 24px; border-radius: 8px; cursor: pointer;
          transition: all 0.2s; display: flex; align-items: center; gap: 8px;
        }
        .btn-gold:hover { background: #9a5e18; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(184,112,32,0.3); }
        .btn-gold:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }
        .err { font-family: var(--mono); font-size: 11px; color: #c0392b; }

        /* API key */
        .api-panel {
          background: var(--gold-light); border: 1px solid var(--gold-mid);
          border-radius: 10px; padding: 14px 20px;
          display: flex; gap: 10px; align-items: center;
          margin-bottom: 20px; flex-wrap: wrap;
        }
        .api-lbl { font-family: var(--mono); font-size: 11px; color: var(--gold); white-space: nowrap; }
        .api-inp {
          flex: 1; min-width: 200px; background: var(--white);
          border: 1px solid var(--gold-mid); border-radius: 6px;
          padding: 8px 14px; font-family: var(--mono); font-size: 12px;
          color: var(--ink); outline: none;
        }
        .api-inp:focus { border-color: var(--gold); }
        .api-go {
          font-family: var(--sans); font-size: 13px; font-weight: 600;
          background: var(--gold); color: #fff; border: none;
          padding: 8px 20px; border-radius: 6px; cursor: pointer;
        }

        /* Version switch */
        .res-bar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
        .ver-sw { display: flex; background: var(--white); border: 1px solid var(--border); border-radius: 8px; padding: 3px; gap: 3px; }
        .vsw {
          font-family: var(--mono); font-size: 11px; font-weight: 500;
          padding: 7px 18px; border-radius: 6px; border: none;
          cursor: pointer; transition: all 0.18s; background: transparent; color: var(--ink-light);
        }
        .vsw.v1on { background: var(--navy); color: #fff; }
        .vsw.v2on { background: var(--gold); color: #fff; }
        .vsw:disabled { opacity: 0.35; cursor: not-allowed; }
        .vsw-sc { font-size: 10px; opacity: 0.7; margin-left: 6px; }

        /* Callout */
        .callout {
          background: var(--gold-light); border: 1px solid var(--gold-mid);
          border-left: 4px solid var(--gold); border-radius: 10px;
          padding: 14px 20px; margin-bottom: 20px;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .callout-txt { font-size: 13px; color: var(--navy); line-height: 1.5; }
        .callout-txt strong { color: var(--gold); }
        .callout-r { font-family: var(--mono); font-size: 11px; color: var(--gold); }

        /* Summary stats */
        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 20px; }
        .sum-card {
          background: var(--white); border: 1px solid var(--border);
          border-radius: 10px; padding: 16px; text-align: center;
          cursor: pointer; transition: all 0.15s;
        }
        .sum-card:hover { transform: translateY(-1px); }
        .sum-num { font-family: var(--serif); font-size: 32px; font-weight: 700; line-height: 1; }
        .sum-lbl { font-family: var(--mono); font-size: 10px; color: var(--ink-light); text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; }
        .sum-card.sa { border-top: 3px solid #2a7d4f; }
        .sum-card.sr { border-top: 3px solid #b87020; }
        .sum-card.sx { border-top: 3px solid #c0392b; }

        /* Filter chips */
        .chips { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; align-items: center; }
        .chip-lbl { font-family: var(--mono); font-size: 10px; color: var(--ink-light); text-transform: uppercase; letter-spacing: 1px; }
        .chip {
          font-family: var(--mono); font-size: 11px; padding: 5px 13px;
          border-radius: 20px; border: 1px solid var(--border);
          background: var(--white); color: var(--ink-mid);
          cursor: pointer; transition: all 0.15s;
        }
        .chip:hover { border-color: var(--navy); color: var(--navy); }
        .chip.on { background: var(--navy); color: #fff; border-color: var(--navy); }
        .chip.on-gold { background: var(--gold); color: #fff; border-color: var(--gold); }

        /* Table */
        .tbl-card { background: var(--white); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
        .tbl-scroll { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; }
        thead tr { background: var(--navy-faint); border-bottom: 1px solid var(--border); }
        th { font-family: var(--mono); font-size: 10px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-light); padding: 11px 14px; text-align: left; white-space: nowrap; }
        tbody tr { border-bottom: 1px solid #f0f2f7; transition: background 0.12s; cursor: pointer; }
        tbody tr:hover { background: var(--navy-faint); }
        tbody tr:last-child { border-bottom: none; }
        tbody tr.expanded { background: #fafbfd; }
        td { padding: 11px 14px; font-size: 12px; vertical-align: middle; }

        .dom-cell { font-family: var(--mono); font-size: 11px; font-weight: 500; color: var(--navy); }
        .num-cell { font-family: var(--mono); font-size: 11px; color: var(--ink-mid); }
        .vpill {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 3px 10px; border-radius: 20px;
          font-family: var(--mono); font-size: 10px; font-weight: 500; border: 1px solid;
        }
        .vdot { width: 5px; height: 5px; border-radius: 50%; }
        .mtag { font-family: var(--mono); font-size: 10px; padding: 2px 8px; border-radius: 4px; display: inline-block; }
        .m-algo { background: var(--navy-faint); color: var(--navy-mid); }
        .m-claude { background: var(--gold-light); color: var(--gold); }
        .ai-tag { font-family: var(--mono); font-size: 9px; background: var(--gold-light); color: var(--gold); padding: 1px 6px; border-radius: 3px; margin-left: 6px; }

        .score-wrap { display: flex; align-items: center; gap: 8px; min-width: 80px; }
        .score-track { flex: 1; height: 3px; background: var(--border); border-radius: 2px; }
        .score-fill { height: 100%; border-radius: 2px; }
        .score-num { font-family: var(--mono); font-size: 10px; color: var(--ink-light); min-width: 28px; }

        /* Expanded row */
        .expand-row td { padding: 0; }
        .expand-inner {
          padding: 16px 20px; background: #fafbfd;
          border-top: 1px solid var(--border);
          display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;
        }
        .exp-section h4 { font-family: var(--mono); font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: var(--ink-light); margin-bottom: 8px; }
        .issue-tag {
          display: inline-block; font-family: var(--mono); font-size: 10px;
          background: #fdf0ef; color: #8b1a14; border: 1px solid #f5c6c2;
          padding: 2px 8px; border-radius: 4px; margin: 2px;
        }
        .flag-tag {
          display: inline-block; font-family: var(--mono); font-size: 10px;
          background: var(--gold-light); color: var(--gold); border: 1px solid var(--gold-mid);
          padding: 2px 8px; border-radius: 4px; margin: 2px;
        }
        .anchor-tag {
          display: inline-block; font-family: var(--mono); font-size: 11px;
          background: var(--navy-faint); color: var(--navy); border: 1px solid var(--border);
          padding: 3px 10px; border-radius: 4px; margin: 2px;
        }
        .ai-text { font-size: 12px; color: var(--ink-mid); line-height: 1.55; font-style: italic; }
        .dest-url { font-family: var(--mono); font-size: 11px; color: var(--gold); word-break: break-all; }
        .no-data { font-family: var(--mono); font-size: 11px; color: var(--ink-light); }

        /* Table footer */
        .tbl-foot { padding: 12px 16px; border-top: 1px solid var(--border); background: var(--navy-faint); display: flex; align-items: center; justify-content: space-between; }
        .fc { font-family: var(--mono); font-size: 11px; color: var(--ink-light); }
        .csv-btn { font-family: var(--mono); font-size: 11px; background: var(--white); border: 1px solid var(--border); color: var(--navy); padding: 6px 14px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
        .csv-btn:hover { border-color: var(--navy); }

        /* Empty */
        .empty { text-align: center; padding: 80px 20px; border: 2px dashed var(--border); border-radius: 12px; background: var(--white); }
        .es-ico { font-size: 36px; margin-bottom: 16px; opacity: 0.35; }
        .es-ttl { font-family: var(--serif); font-size: 22px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
        .es-sub { font-family: var(--mono); font-size: 11px; color: var(--ink-light); }

        .spin { display: inline-block; width: 13px; height: 13px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: sp 0.7s linear infinite; }
        @keyframes sp { to { transform: rotate(360deg); } }

        /* Coverage panel */
        .cov-panel { background: var(--white); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 48px; }
        .cov-hd { padding: 16px 20px; border-bottom: 1px solid var(--border); background: var(--navy-faint); display: flex; align-items: center; justify-content: space-between; }
        .cov-hd-l { font-family: var(--mono); font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 1px; color: var(--navy-mid); }
        .cov-legend { display: flex; gap: 16px; }
        .cov-leg { display: flex; align-items: center; gap: 5px; font-family: var(--mono); font-size: 10px; color: var(--ink-light); }
        .cov-dot { width: 8px; height: 8px; border-radius: 50%; }
        .cov-grid { display: grid; grid-template-columns: repeat(2, 1fr); }
        .cov-row { display: flex; align-items: flex-start; gap: 12px; padding: 12px 20px; border-bottom: 1px solid #f0f2f7; }
        .cov-row:nth-child(odd) { border-right: 1px solid #f0f2f7; }
        .cov-row:last-child, .cov-row:nth-last-child(2):nth-child(odd) { border-bottom: none; }
        .cov-icon { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; flex-shrink: 0; margin-top: 1px; }
        .cov-auto   { background: #edf7f2; color: #2a7d4f; }
        .cov-partial { background: var(--gold-light); color: var(--gold); }
        .cov-manual { background: #fdf0ef; color: #c0392b; }
        .cov-info { flex: 1; }
        .cov-lbl { font-family: var(--sans); font-size: 13px; font-weight: 500; color: var(--navy); margin-bottom: 2px; }
        .cov-note { font-family: var(--mono); font-size: 10px; color: var(--ink-light); line-height: 1.5; }

        @media (max-width: 768px) {
          .hdr { padding: 0 20px; }
          .main { padding: 28px 20px 60px; }
          .top-grid, .bottom-grid { grid-template-columns: 1fr; }
          .criteria-grid { grid-template-columns: repeat(2, 1fr); }
          .summary { grid-template-columns: 1fr; }
          .expand-inner { grid-template-columns: 1fr; }
          .cov-grid { grid-template-columns: 1fr; }
          .cov-row:nth-child(odd) { border-right: none; }
        }
      `}</style>

      <div className="app">
        <header className="hdr">
          <div className="hdr-l">
            <span className="hdr-badge">Tool</span>
            <span className="hdr-title">Link Qualifier</span>
          </div>
          <div className="hdr-r">
            <span className="hdr-by">by Samuel Ivanka</span>
            <button className="demo-pill" onClick={loadDemo}>⚡ load demo</button>
          </div>
        </header>

        <main className="main">
          <div className="sec-lbl">Input</div>

          {/* Top row — CSV + GSC */}
          <div className="top-grid">
            <div className="card">
              <div className="card-hd">
                <div className="card-lbl"><span className="card-dot" style={{background:"#b87020"}} />Broker URL List · Ahrefs CSV</div>
                <label className="file-btn">
                  <input type="file" accept=".csv" onChange={e => handleFile(e, setCsvText, setCsvFileName)} />
                  {csvFileName ? `📎 ${csvFileName}` : "upload .csv"}
                </label>
              </div>
              <textarea className="card-ta" value={csvText} onChange={e => setCsvText(e.target.value)} placeholder={"Paste your Ahrefs Batch Analysis export here (tab-separated).\nGo to Ahrefs → Batch Analysis → export as .csv\n\nThe tool auto-detects all columns: DR, Traffic, Ref. domains, Backlinks, Outgoing domains, Country..."} spellCheck={false} />
            </div>

            <div className="card">
              <div className="card-hd">
                <div className="card-lbl"><span className="card-dot" style={{background:"#2a7d4f"}} />GSC Export · optional</div>
                <label className="file-btn">
                  <input type="file" accept=".csv" onChange={e => handleFile(e, setGscText, setGscFileName)} />
                  {gscFileName ? `📎 ${gscFileName}` : "upload .csv"}
                </label>
              </div>
              <textarea className="card-ta" value={gscText} onChange={e => setGscText(e.target.value)} placeholder={"Optional: paste GSC keyword export to improve anchor text suggestions.\n\nKeyword,Clicks,Impressions,Position\nonline casino,1200,45000,8.2\nlive casino games,890,32000,6.4\n..."} spellCheck={false} />
            </div>
          </div>

          {/* Bottom row — destination */}
          <div className="bottom-grid">
            <div className="card">
              <div className="card-hd"><div className="card-lbl"><span className="card-dot" style={{background:"#1a2744"}} />Destination Domain</div></div>
              <input className="card-inp" value={destDomain} onChange={e => setDestDomain(e.target.value)} placeholder="e.g. skycity.com" />
            </div>
            <div className="card">
              <div className="card-hd"><div className="card-lbl"><span className="card-dot" style={{background:"#1a2744"}} />Target Keywords</div></div>
              <input className="card-inp" value={destKeywords} onChange={e => setDestKeywords(e.target.value)} placeholder="e.g. online casino, live casino games, online casino Denmark, casino bonus" />
            </div>
          </div>

          {/* Criteria panel */}
          <div className="criteria-panel">
            <div className="criteria-title">Qualification Criteria — edit to your standards</div>
            <div className="criteria-grid">
              <div className="crit-item">
                <span className="crit-lbl">Min DR</span>
                <input className="crit-inp" type="number" value={criteria.minDR} onChange={e => setCriteria(c => ({...c, minDR: +e.target.value}))} />
              </div>
              <div className="crit-item">
                <span className="crit-lbl">Min Monthly Traffic</span>
                <input className="crit-inp" type="number" value={criteria.minTraffic} onChange={e => setCriteria(c => ({...c, minTraffic: +e.target.value}))} />
              </div>
              <div className="crit-item">
                <span className="crit-lbl">Min Dofollow %</span>
                <input className="crit-inp" type="number" value={criteria.minDofollow} onChange={e => setCriteria(c => ({...c, minDofollow: +e.target.value}))} />
              </div>
              <div className="crit-item">
                <span className="crit-lbl">Target Geo (e.g. DK, SE)</span>
                <input className="crit-inp" type="text" value={criteria.targetGeo} onChange={e => setCriteria(c => ({...c, targetGeo: e.target.value.toUpperCase()}))} placeholder="optional" />
              </div>
            </div>
          </div>

          <div className="actions">
            <button className="btn-navy" onClick={analyze} disabled={loading || !csvText.trim()}>
              {loading ? <><span className="spin" />Analysing…</> : "→ Run Analysis"}
            </button>
            {error && <span className="err">{error}</span>}
          </div>

          {/* Results */}
          {v1 && (
            <>
              <div className="sec-lbl">Results</div>
              <div className="sec-ttl">Link qualification report.</div>

              {showKey && (
                <div className="api-panel">
                  <span className="api-lbl">Anthropic API Key</span>
                  <input className="api-inp" type="password" placeholder="sk-ant-…" value={apiKey} onChange={e => setApiKey(e.target.value)} />
                  <button className="api-go" onClick={() => enhance(apiKey)}>Run V2</button>
                </div>
              )}

              <div className="res-bar">
                <div className="ver-sw">
                  <button className={`vsw ${active === "v1" ? "v1on" : ""}`} onClick={() => setActive("v1")}>
                    V1 · Algorithmic <span className="vsw-sc">{v1Approve}/{v1.length} approved</span>
                  </button>
                  <button className={`vsw ${active === "v2" ? "v2on" : ""}`} onClick={() => v2 && setActive("v2")} disabled={!v2} style={{opacity: v2 ? 1 : 0.38}}>
                    V2 · Claude {v2 && <span className="vsw-sc">{v2Approve}/{v2.length} approved</span>}
                  </button>
                </div>
                {!v2 && (
                  <button className="btn-gold" onClick={() => enhance()} disabled={enhancing}>
                    {enhancing ? <><span className="spin" />Enhancing…</> : "✦ Enhance with Claude"}
                  </button>
                )}
              </div>

              {active === "v1" && !v2 && stats && stats.review + stats.reject > 0 && (
                <div className="callout">
                  <div className="callout-txt">
                    <strong>{stats.review + stats.reject} domains</strong> flagged for review or rejection.
                    Claude can assess topical relevance, geo fit, and suggest specific anchor text + destination URLs for each approved domain.
                  </div>
                  <div className="callout-r">⚠ {stats.reject} rejected · {stats.review} needs review</div>
                </div>
              )}

              {stats && (
                <div className="summary">
                  <div className="sum-card sa" onClick={() => setFilter(filter === "approve" ? "all" : "approve")}>
                    <div className="sum-num" style={{color:"#2a7d4f"}}>{stats.approve}</div>
                    <div className="sum-lbl">Approved</div>
                  </div>
                  <div className="sum-card sr" onClick={() => setFilter(filter === "review" ? "all" : "review")}>
                    <div className="sum-num" style={{color:"#b87020"}}>{stats.review}</div>
                    <div className="sum-lbl">Needs Review</div>
                  </div>
                  <div className="sum-card sx" onClick={() => setFilter(filter === "reject" ? "all" : "reject")}>
                    <div className="sum-num" style={{color:"#c0392b"}}>{stats.reject}</div>
                    <div className="sum-lbl">Rejected</div>
                  </div>
                </div>
              )}

              <div className="chips">
                <span className="chip-lbl">Filter</span>
                {[
                  {k:"all", l:`All (${stats?.total})`},
                  {k:"approve", l:`✓ Approved (${stats?.approve})`},
                  {k:"review", l:`⚠ Review (${stats?.review})`},
                  {k:"reject", l:`✕ Rejected (${stats?.reject})`},
                  ...(active === "v2" && stats?.claude > 0 ? [{k:"claude", l:`✦ Claude (${stats?.claude})`, gold:true}] : []),
                ].map(({k,l,gold}) => (
                  <button key={k} className={`chip ${filter===k ? (gold?"on-gold":"on") : ""}`} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>

              <div className="tbl-card">
                <div className="tbl-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th><th>Domain</th><th>DR</th><th>Traffic/mo</th>
                        <th>Ref. Domains</th><th>Dofollow %</th><th>Country</th>
                        <th>Score</th><th>Verdict</th><th>Method</th>
                        <th style={{width:20}}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((r, i) => {
                        const v = VERDICT[r.verdict] || VERDICT.review;
                        const bc = r.verdict === "approve" ? "#2a7d4f" : r.verdict === "review" ? "#b87020" : "#c0392b";
                        const isExp = expandedRow === r.domain;
                        const dofPct = r["dofollow_%"] || "—";
                        return [
                          <tr key={r.domain} className={isExp ? "expanded" : ""} onClick={() => setExpandedRow(isExp ? null : r.domain)}>
                            <td><span style={{fontFamily:"var(--mono)",fontSize:10,color:"#c8cdd8"}}>{String(i+1).padStart(2,"0")}</span></td>
                            <td>
                              <span className="dom-cell">{r.domain}</span>
                              {active === "v2" && r.method === "claude" && <span className="ai-tag">✦ AI</span>}
                            </td>
                            <td><span className="num-cell">{r.dr}</span></td>
                            <td><span className="num-cell">{Number(r.organic_traffic?.replace?.(/,/g,"")||r.organic_traffic||0).toLocaleString()}</span></td>
                            <td><span className="num-cell">{r.referring_domains || "—"}</span></td>
                            <td><span className="num-cell">{dofPct}{dofPct !== "—" ? "%" : ""}</span></td>
                            <td><span className="num-cell">{r.country || "—"}</span></td>
                            <td>
                              <div className="score-wrap">
                                <div className="score-track"><div className="score-fill" style={{width:`${r.score}%`,background:bc}} /></div>
                                <span className="score-num">{r.score}</span>
                              </div>
                            </td>
                            <td>
                              <span className="vpill" style={{background:v.bg,borderColor:v.border,color:v.text}}>
                                <span className="vdot" style={{background:v.dot}} />{v.label}
                              </span>
                            </td>
                            <td><span className={`mtag ${r.method === "claude" ? "m-claude" : "m-algo"}`}>{r.method === "claude" ? "✦ claude" : "algo"}</span></td>
                            <td style={{color:"#c8cdd8",fontSize:12}}>{isExp ? "▲" : "▼"}</td>
                          </tr>,
                          isExp && (
                            <tr key={`${r.domain}-exp`} className="expand-row">
                              <td colSpan={11}>
                                <div className="expand-inner">
                                  <div className="exp-section">
                                    <h4>Issues & Flags</h4>
                                    {r.issues?.length > 0
                                      ? r.issues.map((x,i) => <span key={i} className="issue-tag">{x}</span>)
                                      : <span className="no-data">No hard issues</span>}
                                    {r.flags?.length > 0 && r.flags.map((x,i) => <span key={i} className="flag-tag">{x}</span>)}
                                    {r.flags?.length === 0 && r.issues?.length === 0 && <span className="no-data">Clean</span>}
                                  </div>
                                  <div className="exp-section">
                                    <h4>Suggested Anchors</h4>
                                    {r.anchors?.length > 0
                                      ? r.anchors.map((a,i) => <span key={i} className="anchor-tag">{a}</span>)
                                      : <span className="no-data">Run V2 for anchor suggestions</span>}
                                    {r.destinationUrl && (
                                      <>
                                        <h4 style={{marginTop:10}}>Destination URL</h4>
                                        <span className="dest-url">{r.destinationUrl}</span>
                                      </>
                                    )}
                                  </div>
                                  <div className="exp-section">
                                    <h4>AI Analysis</h4>
                                    {r.aiAnalysis
                                      ? <p className="ai-text">{r.aiAnalysis}</p>
                                      : <span className="no-data">Run V2 for AI analysis</span>}
                                    <div style={{marginTop:8}}>
                                      <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink-light)"}}>Topics: </span>
                                      <span style={{fontFamily:"var(--mono)",fontSize:10,color:"var(--ink-mid)"}}>{r.topics || "—"}</span>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )
                        ];
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="tbl-foot">
                  <span className="fc">{filtered.length} of {cur?.length} domains</span>
                  <button className="csv-btn" onClick={() => exportCSV(cur, active)}>↓ Export CSV</button>
                </div>
              </div>
            </>
          )}

          {!v1 && (
            <div className="empty">
              <div className="es-ico">🔗</div>
              <div className="es-ttl">Ready to qualify your links.</div>
              <div className="es-sub">Load the demo or upload your Ahrefs CSV export to get started.</div>
            </div>
          )}

          {/* Coverage panel — bottom */}
          <div style={{marginTop: v1 ? 48 : 40}}>
            <div className="sec-lbl">Coverage</div>
            <div className="sec-ttl" style={{fontSize:22,marginBottom:16}}>What this tool checks.</div>
            <div className="cov-panel" style={{marginBottom:0}}>
              <div className="cov-hd">
                <span className="cov-hd-l">Criteria coverage</span>
                <div className="cov-legend">
                  <span className="cov-leg"><span className="cov-dot" style={{background:"#2a7d4f"}} />Auto-scored</span>
                  <span className="cov-leg"><span className="cov-dot" style={{background:"#b87020"}} />Partial</span>
                  <span className="cov-leg"><span className="cov-dot" style={{background:"#c0392b"}} />Manual check</span>
                </div>
              </div>
              <div className="cov-grid">
                {COVERAGE.map((c, i) => (
                  <div key={i} className="cov-row">
                    <div className={`cov-icon cov-${c.status}`}>
                      {c.status === "auto" ? "✓" : c.status === "partial" ? "~" : "!"}
                    </div>
                    <div className="cov-info">
                      <div className="cov-lbl">{c.label}</div>
                      <div className="cov-note">{c.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
