import { useState, useEffect } from "react";

// ── palette ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#fafaf8", card: "#fff", border: "#e4e4e0", muted: "#888",
  text: "#1a1a18", green: "#0F6E56", greenBg: "#E1F5EE",
  red: "#993C1D", redBg: "#FAECE7", blue: "#185FA5", blueBg: "#E6F1FB",
  amber: "#854F0B", amberBg: "#FAEEDA", gray: "#5F5E5A", grayBg: "#F1EFE8",
};

// ── MC questions ──────────────────────────────────────────────────────────────
const MC_QUESTIONS = [
  { id:"1a", q:"Which of the following indicates the strongest linear relationship?",
    opts:["r = 0.75","r = −0.95","r = 0.09","r = −0.65"], correct:1,
    explain:"Strength = |r|. Absolute values: 0.75, 0.95, 0.09, 0.65. Largest = 0.95 → r = −0.95. Sign doesn't matter for 'strongest.'" },
  { id:"1b", q:"Which statistic is unaffected by outliers?",
    opts:["Range","Mean","Standard deviation","Median"], correct:3,
    explain:"Range, Mean, and Std Dev all use extreme values → affected. Median = middle value only → NOT affected by outliers." },
  { id:"1c", q:"The histogram of exam scores has a large left tail. What is the approximate shape?",
    opts:["Nearly symmetric","Skewed to the left","Skewed to the right","Bimodal"], correct:1,
    explain:"Tail points LEFT → left-skewed (negatively skewed). Skew direction = where the long tail points." },
  { id:"1d", q:"P(A)=0.6 and P(B)=0.3. A and B are independent. What is P(A AND B)?",
    opts:["0.3","0.9","0.18","0.85"], correct:2,
    explain:"Independent: P(A∩B) = P(A)·P(B) = 0.6 × 0.3 = 0.18." },
  { id:"1e", q:"A card is drawn from a 52-card deck. What is P(Red or Jack)?",
    opts:["²³/₅₂","²/₁₃","⁷/₁₃","¹⁵/₂₆"], correct:2,
    explain:"P(R or J) = 26/52 + 4/52 − 2/52 (2 red jacks overlap) = 28/52 = 7/13." },
  { id:"1f", q:"SRS of n=64 from N(μ=76, σ=16). What is the distribution of X̄?",
    opts:["N(μ=76, σ=16)","N(μ=76, σ=2)","N(μ=76, σ=0.25)","N(μ=0, σ=1)"], correct:1,
    explain:"σ_x̄ = σ/√n = 16/√64 = 16/8 = 2. X̄ ~ N(76, 2). Mean unchanged; SE shrinks by √n." },
  { id:"1g", q:"Repair time is Uniform(1.5, 4.0). What is P(X > 2)?",
    opts:["0.4","0.8","0.25","0.6"], correct:1,
    explain:"f(x)=1/(4−1.5)=1/2.5. P(X>2) = (4−2)×(1/2.5) = 2/2.5 = 0.80." },
  { id:"1h", q:"Telephone survey of 1,502 adults found that 69% could identify the vice-president. Is 69% a parameter or statistic?",
    opts:["Parameter","Statistic"], correct:1,
    explain:"1,502 is a SAMPLE of US adults. A value from a sample = STATISTIC." },
  { id:"1i", q:"How large a sample do you need to estimate p within E=0.04 at 95% confidence (p unknown)?",
    opts:["1068","601","2403","490"], correct:1,
    explain:"p̂=0.5, z*=1.96. n=0.25×(1.96/0.04)²=0.25×2401=600.25 → round up → 601." },
  { id:"1j", q:'S={1,2,3,4,5,6,7,8,9,10}. Outcomes equally likely. What is P(E) where E = "odd number less than 9"?',
    opts:["0.4","0.5","0.55","0.6"], correct:0,
    explain:"Odd AND less than 9: {1,3,5,7} = 4 values. P(E)=4/10=0.4." },
  { id:"1k", q:"Charlotte divides her day into morning, afternoon, and evening, then randomly selects 3 observations per part. What sampling type?",
    opts:["Simple random","Stratified","Systematic","Cluster"], correct:1,
    explain:"Day divided into STRATA, then random sample from each → stratified sampling." },
  { id:"1l", q:'"Medal won in race" — qualitative or quantitative?',
    opts:["Qualitative","Quantitative"], correct:0,
    explain:"Bronze/Silver/Gold are categories → qualitative (categorical)." },
  { id:"1m", q:'"Number of pieces of lumber used to make a deck" — discrete or continuous?',
    opts:["Discrete","Continuous"], correct:0,
    explain:"Countable whole numbers = discrete. Continuous = measured with infinite precision." },
  { id:"1n", q:"H₀: μ=243,775 (home price), H₁: μ>243,775. Null hypothesis is NOT rejected. What is the correct conclusion?",
    opts:[
      "Not sufficient evidence that price has not changed",
      "Sufficient evidence price has not changed",
      "Not sufficient evidence that price has increased",
      "Sufficient evidence that price has increased"
    ], correct:2,
    explain:"Fail to reject H₀ → insufficient evidence for H₁. H₁ claimed increase → 'not sufficient evidence to conclude it increased.'" },
  { id:"1o", q:"H₀: μ=2, H₁: μ>2. Is this left-tailed, right-tailed, or two-tailed?",
    opts:["Left-tailed","Right-tailed","Two-tailed"], correct:1,
    explain:'">" in H₁ → right-tailed. Rule: < = left · > = right · ≠ = two-tailed.' },
];

// ── Free response questions ───────────────────────────────────────────────────
const FR_QUESTIONS = [
  { id:"q2a", section:"Q2 (a)", prompt:"Travel times: 8, 12, 15, 10, 5, 7 (n=6). Find the Mode, Mean, and Median.",
    fields:[
      { label:"Mode", answer:"none", alt:["no mode","none (no repeats)","no mode (all unique)"] },
      { label:"Mean (keep 3 decimals)", answer:"9.5", alt:["9.500"] },
      { label:"Median", answer:"9", alt:["9.0","9.00"] },
    ]},
  { id:"q2b", section:"Q2 (b)", prompt:"Same data: 8, 12, 15, 10, 5, 7. Find Q1 and Q3.",
    fields:[
      { label:"Q1", answer:"7", alt:["7.0"] },
      { label:"Q3", answer:"12", alt:["12.0"] },
    ]},
  { id:"q2c", section:"Q2 (c)", prompt:"Same data. Find the standard deviation s (3 decimal places).",
    fields:[
      { label:"s", answer:"3.619", alt:["3.62","3.618","3.6193"] },
    ]},
  { id:"q3a", section:"Q3 (a)", prompt:"Data: 17,23,34,15,35,45,36,53,58,88,22,31,55. Find the five-number summary.",
    fields:[
      { label:"Min", answer:"15" },
      { label:"Q1", answer:"22.5" },
      { label:"Median", answer:"35" },
      { label:"Q3", answer:"54" },
      { label:"Max", answer:"88" },
    ]},
  { id:"q3b", section:"Q3 (b)", prompt:"Same data. Are there outliers? Calculate the lower and upper fences (1.5 IQR rule).",
    fields:[
      { label:"IQR", answer:"31.5" },
      { label:"Lower fence", answer:"-24.75", alt:["-24.75","−24.75"] },
      { label:"Upper fence", answer:"101.25" },
      { label:"Outlier? (yes/no)", answer:"no", alt:["no outliers","none"] },
    ]},
  { id:"q5a", section:"Q5 (a)", prompt:"iPhone battery: N(μ=7, σ=0.8). What is P(X ≥ 6)?",
    fields:[
      { label:"z-score", answer:"-1.25", alt:["−1.25"] },
      { label:"P(X ≥ 6)", answer:"0.8944", alt:["0.894","0.8944"] },
    ]},
  { id:"q5b", section:"Q5 (b)", prompt:"Same distribution. What is P(X < 5)?",
    fields:[
      { label:"z-score", answer:"-2.50", alt:["−2.50","-2.5","−2.5"] },
      { label:"P(X < 5)", answer:"0.0062", alt:["0.006"] },
    ]},
  { id:"q5c", section:"Q5 (c)", prompt:"Same distribution. What talk time is the cutoff for the top 10%?",
    fields:[
      { label:"z* (from table)", answer:"1.28" },
      { label:"x (hours)", answer:"8.024", alt:["8.02"] },
    ]},
  { id:"q6a", section:"Q6 (a)", prompt:"Gallup: n=500, p=0.16. State μ and σ for the binomial approximation.",
    fields:[
      { label:"μ = np", answer:"80" },
      { label:"σ = √(np(1−p))", answer:"8.2", alt:["8.198","8.19","8.20"] },
    ]},
  { id:"q7a", section:"Q7 (a)", prompt:"Regression: r=0.782, x̄=272.6, ȳ=690.3, sx=23.34, sy=233. Find the slope b₁.",
    fields:[
      { label:"b₁ (3 decimals)", answer:"7.807", alt:["7.8066","7.806","7.8067"] },
    ]},
  { id:"q7b", section:"Q7 (b)", prompt:"Same problem. Find the intercept b₀.",
    fields:[
      { label:"b₀", answer:"-1437.779", alt:["-1437.78","-1437.7792","−1437.779","−1437.78"] },
    ]},
  { id:"q7c", section:"Q7 (c)", prompt:"Using your regression equation, predict ŷ when x = $300.",
    fields:[
      { label:"ŷ ($)", answer:"904.20", alt:["904.2","$904.20","904.201","904.2008"] },
    ]},
  { id:"q8a", section:"Q8 (a)", prompt:"College students table: Total=16,638; Males=7,317. Find P(Male).",
    fields:[
      { label:"P(Male)", answer:"0.4398", alt:["0.440","0.4399"] },
    ]},
  { id:"q8b", section:"Q8 (b)", prompt:"Same table. Females total=9,321; Females 18–24=5,668. Find P(18–24 | Female).",
    fields:[
      { label:"P(18–24 | Female)", answer:"0.6081", alt:["0.608","0.6080"] },
    ]},
  { id:"q9", section:"Q9", prompt:"Random sample: n=50, x̄=4.58, s=1.10. Compute 95% CI for mean. (Use t*=2.009, df=49)",
    fields:[
      { label:"Lower bound", answer:"4.2675", alt:["4.268","4.267"] },
      { label:"Upper bound", answer:"4.8925", alt:["4.892","4.893"] },
    ]},
  { id:"q10", section:"Q10", prompt:"Teen texting survey: n=800, x=272. Compute 90% CI for proportion. (Use z*=1.645)",
    fields:[
      { label:"p̂", answer:"0.34", alt:["0.340"] },
      { label:"Lower bound", answer:"0.3124", alt:["0.312"] },
      { label:"Upper bound", answer:"0.3676", alt:["0.368","0.3676"] },
    ]},
  { id:"q11", section:"Q11", prompt:"Dog Days: n=18, x̄=32.50, σ=8.10, μ₀=35, α=0.05. Left-tailed t-test.",
    fields:[
      { label:"t₀ (test statistic)", answer:"-1.31", alt:["−1.31","-1.310","−1.310"] },
      { label:"df", answer:"17" },
      { label:"Critical value −t_α", answer:"-1.740", alt:["−1.740","-1.74","−1.74"] },
      { label:"Reject H₀? (yes/no)", answer:"no", alt:["do not reject","fail to reject"] },
    ]},
  { id:"q12", section:"Q12", prompt:"Cavity trees: n=196, x=79, p₀=0.32, α=0.01. Right-tailed z-test.",
    fields:[
      { label:"p̂", answer:"0.4036", alt:["0.404","0.40","79/196"] },
      { label:"z₀ (test statistic)", answer:"2.49", alt:["2.494","2.493"] },
      { label:"P-value", answer:"0.0064", alt:["0.006","0.0063"] },
      { label:"Reject H₀? (yes/no)", answer:"yes", alt:["reject"] },
    ]},
];

// ── helpers ───────────────────────────────────────────────────────────────────
function normalize(str) {
  return String(str).toLowerCase().replace(/[$,\s]/g,"").replace("−","-");
}
function checkAnswer(input, correct, alts=[]) {
  const n = normalize(input);
  const c = normalize(correct);
  if (n === c) return true;
  return (alts||[]).some(a => normalize(a) === n);
}

// ── storage helpers ───────────────────────────────────────────────────────────
const STORAGE_KEY = "math282_scores_v2";
function loadScores() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch { return {}; }
}
function saveScores(s) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

// ── sub-components ────────────────────────────────────────────────────────────
function Tag({ color, bg, children }) {
  return <span style={{ fontSize:11, fontWeight:500, padding:"2px 7px", borderRadius:20, background:bg, color, marginLeft:6 }}>{children}</span>;
}

function MCCard({ q, onScore, saved }) {
  const [selected, setSelected] = useState(saved?.selected ?? null);
  const [submitted, setSubmitted] = useState(saved?.submitted ?? false);

  const correct = submitted ? selected === q.correct : null;

  function submit() {
    if (selected === null) return;
    setSubmitted(true);
    onScore(q.id, selected === q.correct, { selected, submitted: true });
  }
  function reset() {
    setSelected(null); setSubmitted(false);
    onScore(q.id, null, null);
  }

  return (
    <div style={{ background:C.card, border:`0.5px solid ${C.border}`, borderRadius:10, marginBottom:8, overflow:"hidden" }}>
      <div style={{ padding:"10px 14px" }}>
        <div style={{ fontSize:13, fontWeight:500, color:C.text, marginBottom:10 }}>{q.id}. {q.q}</div>
        {q.opts.map((opt, i) => {
          let bg = "#f5f5f2", border = `1px solid ${C.border}`, col = C.text;
          if (submitted) {
            if (i === q.correct) { bg = C.greenBg; border = `1px solid ${C.green}`; col = C.green; }
            else if (i === selected && i !== q.correct) { bg = C.redBg; border = `1px solid ${C.red}`; col = C.red; }
          } else if (selected === i) {
            bg = C.blueBg; border = `1px solid ${C.blue}`; col = C.blue;
          }
          return (
            <div key={i} onClick={() => !submitted && setSelected(i)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:7, marginBottom:4, background:bg, border, cursor:submitted?"default":"pointer", color:col, fontSize:13, transition:"background .1s" }}>
              <span style={{ fontWeight:500, minWidth:16 }}>{i+1}.</span> {opt}
              {submitted && i===q.correct && <span style={{ marginLeft:"auto" }}>✓</span>}
              {submitted && i===selected && i!==q.correct && <span style={{ marginLeft:"auto" }}>✗</span>}
            </div>
          );
        })}
        {submitted && (
          <div style={{ marginTop:8, fontSize:12, color:C.gray, background:C.grayBg, borderRadius:6, padding:"6px 10px" }}>
            💡 {q.explain}
          </div>
        )}
      </div>
      <div style={{ borderTop:`0.5px solid ${C.border}`, padding:"8px 14px", display:"flex", gap:8, alignItems:"center" }}>
        {!submitted
          ? <button onClick={submit} disabled={selected===null}
              style={{ fontSize:12, padding:"4px 12px", borderRadius:6, border:`0.5px solid ${C.border}`, background:selected===null?"#f0f0ee":C.text, color:selected===null?C.muted:"#fff", cursor:selected===null?"default":"pointer" }}>
              Check
            </button>
          : <>
              <Tag color={correct?C.green:C.red} bg={correct?C.greenBg:C.redBg}>{correct?"✓ Correct":"✗ Incorrect"}</Tag>
              <button onClick={reset} style={{ fontSize:11, padding:"3px 9px", borderRadius:6, border:`0.5px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer", marginLeft:4 }}>Retry</button>
            </>
        }
      </div>
    </div>
  );
}

function FRCard({ q, onScore, saved }) {
  const [vals, setVals] = useState(saved?.vals || q.fields.map(()=>""));
  const [results, setResults] = useState(saved?.results || null);
  const [showWork, setShowWork] = useState(false);

  function check() {
    const res = q.fields.map((f,i) => checkAnswer(vals[i], f.answer, f.alt));
    setResults(res);
    const score = res.filter(Boolean).length;
    onScore(q.id, score, q.fields.length, { vals, results: res });
  }
  function reset() {
    setVals(q.fields.map(()=>"")); setResults(null); setShowWork(false);
    onScore(q.id, null, q.fields.length, null);
  }

  const allCorrect = results && results.every(Boolean);
  const score = results ? results.filter(Boolean).length : null;

  return (
    <div style={{ background:C.card, border:`0.5px solid ${C.border}`, borderRadius:10, marginBottom:8, overflow:"hidden" }}>
      <div style={{ padding:"10px 14px" }}>
        <div style={{ fontSize:12, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".05em", marginBottom:4 }}>{q.section}</div>
        <div style={{ fontSize:13, color:C.text, marginBottom:10 }}>{q.prompt}</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:8 }}>
          {q.fields.map((f,i) => {
            let borderColor = C.border;
            let bg = "#f9f9f7";
            if (results) {
              borderColor = results[i] ? C.green : C.red;
              bg = results[i] ? C.greenBg : C.redBg;
            }
            return (
              <div key={i}>
                <label style={{ fontSize:11, color:C.muted, fontWeight:500, display:"block", marginBottom:3 }}>{f.label}</label>
                <input value={vals[i]} onChange={e=>{ const v=[...vals]; v[i]=e.target.value; setVals(v); }}
                  disabled={!!results}
                  placeholder="your answer"
                  style={{ width:"100%", padding:"6px 9px", borderRadius:6, border:`1px solid ${borderColor}`, background:bg, fontSize:13, color:C.text, outline:"none" }} />
                {results && !results[i] && (
                  <div style={{ fontSize:11, color:C.red, marginTop:2 }}>Answer: {f.answer}</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ borderTop:`0.5px solid ${C.border}`, padding:"8px 14px", display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        {!results
          ? <button onClick={check}
              style={{ fontSize:12, padding:"4px 12px", borderRadius:6, border:`0.5px solid ${C.border}`, background:C.text, color:"#fff", cursor:"pointer" }}>
              Check
            </button>
          : <>
              <Tag color={allCorrect?C.green:C.amber} bg={allCorrect?C.greenBg:C.amberBg}>
                {score}/{q.fields.length} correct
              </Tag>
              <button onClick={reset} style={{ fontSize:11, padding:"3px 9px", borderRadius:6, border:`0.5px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer" }}>Retry</button>
            </>
        }
      </div>
    </div>
  );
}

// ── Score summary ─────────────────────────────────────────────────────────────
function ScoreSummary({ mcScores, frScores }) {
  const mcDone = Object.values(mcScores).filter(v=>v!==null).length;
  const mcCorrect = Object.values(mcScores).filter(v=>v===true).length;
  const frTotal = FR_QUESTIONS.reduce((acc,q)=>acc+q.fields.length,0);
  const frCorrect = Object.values(frScores).reduce((acc,v)=>acc+(v||0),0);
  const frDone = Object.values(frScores).filter(v=>v!==null).length;
  const pct = mcDone+frDone===0 ? 0 : Math.round(((mcCorrect+frCorrect)/(mcDone+frTotal===0?1:MC_QUESTIONS.length+frTotal))*100);

  return (
    <div style={{ background:C.grayBg, borderRadius:10, padding:"12px 14px", border:`0.5px solid ${C.border}`, marginBottom:"1rem" }}>
      <div style={{ fontSize:11, fontWeight:600, color:C.muted, textTransform:"uppercase", letterSpacing:".06em", marginBottom:8 }}>Your Progress</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
        {[
          ["MC", `${mcCorrect}/${MC_QUESTIONS.length}`, mcCorrect===MC_QUESTIONS.length?C.green:C.text],
          ["Free Response", `${frCorrect}/${frTotal} fields`, frCorrect===frTotal?C.green:C.text],
          ["Answered", `${mcDone+frDone} / ${MC_QUESTIONS.length+FR_QUESTIONS.length}`, C.text],
        ].map(([label,val,col])=>(
          <div key={label} style={{ background:C.card, borderRadius:8, padding:"8px 10px", border:`0.5px solid ${C.border}` }}>
            <div style={{ fontSize:11, color:C.muted, marginBottom:2 }}>{label}</div>
            <div style={{ fontSize:18, fontWeight:500, color:col }}>{val}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [tab, setTab] = useState("mc");
  const [mcScores, setMcScores] = useState({});
  const [mcSaved, setMcSaved] = useState({});
  const [frScores, setFrScores] = useState({});
  const [frSaved, setFrSaved] = useState({});

  useEffect(() => {
    const s = loadScores();
    if (s.mcScores) setMcScores(s.mcScores);
    if (s.mcSaved) setMcSaved(s.mcSaved);
    if (s.frScores) setFrScores(s.frScores);
    if (s.frSaved) setFrSaved(s.frSaved);
  }, []);

  function handleMC(id, correct, data) {
    const ns = { ...mcScores, [id]: correct };
    const nd = { ...mcSaved, [id]: data };
    setMcScores(ns); setMcSaved(nd);
    saveScores({ mcScores:ns, mcSaved:nd, frScores, frSaved });
  }
  function handleFR(id, score, total, data) {
    const ns = { ...frScores, [id]: score };
    const nd = { ...frSaved, [id]: data };
    setFrScores(ns); setFrSaved(nd);
    saveScores({ mcScores, mcSaved, frScores:ns, frSaved:nd });
  }
  function resetAll() {
    setMcScores({}); setMcSaved({}); setFrScores({}); setFrSaved({});
    saveScores({});
  }

  const tabs = [["mc","Multiple Choice (Q1)"],["fr","Free Response (Q2–12)"],["score","Progress"]];

  return (
    <div style={{ fontFamily:"system-ui,sans-serif", maxWidth:720, margin:"0 auto", padding:"1rem 0", background:C.bg, minHeight:"100vh" }}>
      {/* Header */}
      <div style={{ marginBottom:"1rem", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
        <div>
          <div style={{ fontSize:16, fontWeight:600, color:C.text }}>MATH 282 — Practice Exam</div>
          <div style={{ fontSize:12, color:C.muted }}>Spring 2025 · All answers auto-graded</div>
        </div>
        <button onClick={resetAll} style={{ fontSize:11, padding:"4px 10px", borderRadius:6, border:`0.5px solid ${C.border}`, background:"transparent", color:C.muted, cursor:"pointer" }}>
          Reset all
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:4, marginBottom:"1rem", borderBottom:`1px solid ${C.border}`, paddingBottom:0 }}>
        {tabs.map(([id,label])=>(
          <button key={id} onClick={()=>setTab(id)}
            style={{ fontSize:13, padding:"7px 14px", border:"none", borderBottom:tab===id?`2px solid ${C.text}`:"2px solid transparent", background:"transparent", color:tab===id?C.text:C.muted, cursor:"pointer", fontWeight:tab===id?500:400, marginBottom:-1 }}>
            {label}
          </button>
        ))}
      </div>

      {tab==="score" && (
        <div>
          <ScoreSummary mcScores={mcScores} frScores={frScores} />
          <div style={{ fontSize:13, color:C.muted, padding:"0 2px" }}>
            Answer more questions on the MC and Free Response tabs to track your progress here. Hit "Reset all" to start fresh for a timed practice run.
          </div>
        </div>
      )}

      {tab==="mc" && (
        <div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:"1rem", padding:"0 2px" }}>
            15 questions · Select an answer and tap Check. Worked explanation reveals after each attempt.
          </div>
          {MC_QUESTIONS.map(q=>(
            <MCCard key={q.id} q={q} onScore={handleMC} saved={mcSaved[q.id]} />
          ))}
        </div>
      )}

      {tab==="fr" && (
        <div>
          <div style={{ fontSize:12, color:C.muted, marginBottom:"1rem", padding:"0 2px" }}>
            Type your answer in each box and tap Check. Keep 3 decimal places where required. Correct answers shown on miss.
          </div>
          {FR_QUESTIONS.map(q=>(
            <FRCard key={q.id} q={q} onScore={handleFR} saved={frSaved[q.id]} />
          ))}
        </div>
      )}
    </div>
  );
}
