/* Interactive widgets. Each widget is mount(el). Pure SVG + DOM, no libraries. */

const NS = "http://www.w3.org/2000/svg";
const h = (tag, attrs = {}, html = "") => { const e = document.createElement(tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (html) e.innerHTML = html; return e; };
const fmt = (x, d = 2) => (Math.abs(x) < 1e-4 && x !== 0) ? x.toExponential(1) : Number(x).toFixed(d);
const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
function svgEl(tag, attrs) { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); return e; }
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }
function randn(r) { let u = 0, v = 0; while (u === 0) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function normCdf(z) { const t = 1 / (1 + 0.2316419 * Math.abs(z)); const d = 0.3989423 * Math.exp(-z * z / 2); let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274)))); return z > 0 ? 1 - p : p; }
function pfmt(p) { return p < 0.001 ? "< .001" : "= " + p.toFixed(3).replace(/^0/, ""); }
function slider(label, min, max, step, val, id) {
  return `<label class="sl"><span>${label} <output id="${id}-o">${val}</output></span><input type="range" id="${id}" min="${min}" max="${max}" step="${step}" value="${val}"></label>`;
}

const WIDGETS = {};

/* ---------------------------------------------------------- decider */
WIDGETS.decider = (el) => {
  const tree = {
    start: { q: "What kind of question is it?", opts: [["Describe one variable (typical value or spread)", "desc"], ["Test a relationship or difference", "out"]] },
    desc: { q: "What do you want to describe?", opts: [["Typical value, data roughly symmetric", "=Mean"], ["Typical value, data skewed / outliers", "=Median"], ["How spread out the values are", "=Standard deviation"]] },
    out: { q: "What is the outcome (Y)?", opts: [["Continuous number (BP, BMI, score)", "cont"], ["Binary yes/no (smoker, diabetes)", "bin"], ["Categorical counts in a table, two categorical variables", "=Chi-square"]] },
    cont: { q: "What are the predictors / groups?", opts: [["One grouping variable with 2 groups", "=t-test"], ["One grouping variable with 3+ groups", "=One-way ANOVA (then post-hoc)"], ["Two grouping variables (and their interaction)", "=Two-way ANOVA"], ["Same people measured 3+ times", "=Repeated measures ANOVA"], ["One continuous predictor", "cont1"], ["Two or more predictors", "=Multiple linear regression"]] },
    cont1: { q: "Do you want to predict Y, or just measure how strongly they move together?", opts: [["Predict Y / slope", "=Simple linear regression"], ["Strength of association (r)", "=Correlation"]] },
    bin: { q: "How many predictors?", opts: [["One categorical predictor (compare counts)", "=Chi-square (or logistic regression)"], ["Any continuous predictor, or several predictors", "=Logistic regression"]] }
  };
  const path = [];
  el.classList.add("widget", "decider");
  const render = (node) => {
    let html = `<div class="crumbs">${path.map(p => `<span>${p}</span>`).join("")}</div>`;
    if (node.startsWith("=")) {
      html += `<div class="result"><div class="small">Use</div><div class="answer">${node.slice(1)}</div><button class="btn ghost" data-r>Start over</button></div>`;
    } else {
      const n = tree[node];
      html += `<p class="q">${n.q}</p><div class="opts">${n.opts.map((o, i) => `<button class="opt" data-i="${i}">${o[0]}</button>`).join("")}</div>`;
    }
    el.innerHTML = `<div class="w-title">Test chooser</div>` + html;
    el.querySelectorAll("[data-i]").forEach(b => b.onclick = () => { const o = tree[node].opts[+b.dataset.i]; path.push(o[0]); render(o[1]); });
    const r = el.querySelector("[data-r]"); if (r) r.onclick = () => { path.length = 0; render("start"); };
  };
  render("start");
};

/* ---------------------------------------------------------- skew */
WIDGETS.skew = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Mean vs median: drag the outlier</div>${slider("Largest income ($k)", 60, 2000, 10, 60, "sk")}<div class="svgwrap"></div><p class="w-read"></p>`;
  const base = [28, 31, 33, 35, 36, 38, 40, 41, 43, 45, 47, 50, 52, 55];
  const W = 640, H = 150;
  const draw = () => {
    const out = +el.querySelector("#sk").value; el.querySelector("#sk-o").textContent = out;
    const d = [...base, out].sort((a, b) => a - b);
    const mean = d.reduce((a, b) => a + b) / d.length, med = d[Math.floor(d.length / 2)];
    const max = Math.max(200, out * 1.05); const x = v => 20 + (v / max) * (W - 40);
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart" });
    s.appendChild(svgEl("line", { x1: 20, x2: W - 20, y1: 100, y2: 100, class: "axis" }));
    d.forEach((v, i) => s.appendChild(svgEl("circle", { cx: x(v), cy: 92 - (i % 3) * 9, r: 6, class: v === out ? "dot hot" : "dot" })));
    [[mean, "mean", "m-line", 30], [med, "median", "md-line", 54]].forEach(([v, lab, c, y]) => {
      s.appendChild(svgEl("line", { x1: x(v), x2: x(v), y1: y + 6, y2: 104, class: c }));
      const t = svgEl("text", { x: x(v) + 4, y, class: "lbl " + c }); t.textContent = `${lab} ${v.toFixed(1)}`; s.appendChild(t);
    });
    for (let v = 0; v <= max; v += max > 1000 ? 500 : 50) { const t = svgEl("text", { x: x(v), y: 122, class: "tick", "text-anchor": "middle" }); t.textContent = v; s.appendChild(t); }
    const w = el.querySelector(".svgwrap"); w.innerHTML = ""; w.appendChild(s);
    el.querySelector(".w-read").innerHTML = `Mean <b>${mean.toFixed(1)}</b> vs median <b>${med.toFixed(1)}</b>. ${mean - med > 10 ? "The mean has been dragged toward the tail; report the <b>median</b>." : "Roughly symmetric — mean and median agree."}`;
  };
  el.querySelector("#sk").oninput = draw; draw();
};

/* ---------------------------------------------------------- regression sandbox */
function ols(pts) {
  const n = pts.length; const mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n;
  let sxx = 0, sxy = 0, syy = 0; pts.forEach(([x, y]) => { sxx += (x - mx) ** 2; sxy += (x - mx) * (y - my); syy += (y - my) ** 2; });
  const b1 = sxy / sxx, b0 = my - b1 * mx; let sse = 0; pts.forEach(([x, y]) => sse += (y - b0 - b1 * x) ** 2);
  const r2 = 1 - sse / syy, r = Math.sign(b1) * Math.sqrt(Math.max(0, r2)); const mse = sse / (n - 2);
  const F = (syy - sse) / mse;
  const lev = pts.map(([x]) => 1 / n + (x - mx) ** 2 / sxx);
  const cook = pts.map(([x, y], i) => { const e = y - b0 - b1 * x; return (e * e / (2 * mse)) * (lev[i] / (1 - lev[i]) ** 2); });
  const sres = pts.map(([x, y], i) => (y - b0 - b1 * x) / Math.sqrt(mse * (1 - lev[i])));
  return { b0, b1, r2, r, F, lev, cook, sres, n };
}
WIDGETS.sandbox = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Regression sandbox</div>
  <div class="ctrls">${slider("True slope", -2, 2, 0.1, 0.8, "sb-s")}${slider("Noise", 0, 4, 0.1, 1.5, "sb-n")}${slider("Points", 8, 80, 1, 30, "sb-k")}</div>
  <div class="row"><button class="btn" data-new>New sample</button><label class="tog"><input type="checkbox" data-res checked> Show residuals</label><span class="small">Tap the plot to add a point.</span></div>
  <div class="svgwrap"></div><div class="stats"></div>`;
  const W = 640, H = 340, P = 36; const xs = v => P + v / 10 * (W - 2 * P), ys = v => H - P - v / 10 * (H - 2 * P);
  let pts = [], added = null, seed = 7;
  const gen = () => {
    const r = rng(seed++); const s = +el.querySelector("#sb-s").value, n = +el.querySelector("#sb-n").value, k = +el.querySelector("#sb-k").value;
    pts = []; for (let i = 0; i < k; i++) { const x = 1 + r() * 8; const y = clamp(5 + s * (x - 5) + randn(r) * n, 0.2, 9.8); pts.push([x, y]); } added = null; draw();
  };
  const draw = () => {
    ["sb-s", "sb-n", "sb-k"].forEach(id => el.querySelector("#" + id + "-o").textContent = el.querySelector("#" + id).value);
    const f = ols(pts); const showR = el.querySelector("[data-res]").checked;
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart grid-bg" });
    for (let g = 0; g <= 10; g++) { s.appendChild(svgEl("line", { x1: xs(g), x2: xs(g), y1: ys(0), y2: ys(10), class: "gl" })); s.appendChild(svgEl("line", { x1: xs(0), x2: xs(10), y1: ys(g), y2: ys(g), class: "gl" })); }
    s.appendChild(svgEl("line", { x1: xs(0), x2: xs(10), y1: ys(0), y2: ys(0), class: "axis" })); s.appendChild(svgEl("line", { x1: xs(0), x2: xs(0), y1: ys(0), y2: ys(10), class: "axis" }));
    const tx = svgEl("text", { x: W - P, y: H - 8, class: "tick", "text-anchor": "end" }); tx.textContent = "X (predictor)"; s.appendChild(tx);
    const ty = svgEl("text", { x: P + 4, y: P - 12, class: "tick" }); ty.textContent = "Y (outcome)"; s.appendChild(ty);
    if (showR) pts.forEach(([x, y]) => s.appendChild(svgEl("line", { x1: xs(x), x2: xs(x), y1: ys(y), y2: ys(f.b0 + f.b1 * x), class: "resid" })));
    if (added) { const others = pts.filter(p => p !== added); const g = ols(others); s.appendChild(svgEl("line", { x1: xs(0), y1: ys(g.b0), x2: xs(10), y2: ys(g.b0 + g.b1 * 10), class: "fit ghostline" })); }
    s.appendChild(svgEl("line", { x1: xs(0), y1: ys(f.b0), x2: xs(10), y2: ys(f.b0 + f.b1 * 10), class: "fit" }));
    const cut = 4 / f.n;
    pts.forEach(([x, y], i) => s.appendChild(svgEl("circle", { cx: xs(x), cy: ys(y), r: pts[i] === added ? 8 : 5, class: "dot" + (f.cook[i] > cut ? " flag" : "") + (pts[i] === added ? " hot" : "") })));
    s.onclick = (ev) => { const b = s.getBoundingClientRect(); const x = ((ev.clientX - b.left) / b.width * W - P) / (W - 2 * P) * 10, y = (H - P - (ev.clientY - b.top) / b.height * H) / (H - 2 * P) * 10; if (x < 0 || x > 10 || y < 0 || y > 10) return; added = [x, y]; pts.push(added); draw(); };
    const w = el.querySelector(".svgwrap"); w.innerHTML = ""; w.appendChild(s);
    const nflag = f.cook.filter(c => c > cut).length;
    let extra = "";
    if (added) { const i = pts.indexOf(added); extra = `<div class="stat wide"><span>Your point</span>std. residual <b>${fmt(f.sres[i])}</b> · leverage <b>${fmt(f.lev[i], 3)}</b> (cutoff 2k/n = ${fmt(4 / f.n, 3)}) · Cook's D <b>${fmt(f.cook[i], 3)}</b> (cutoff 4/n = ${fmt(cut, 3)}). ${f.cook[i] > cut ? "<b>Influential</b>: the dashed line is the fit without it." : "Not influential."}</div>`; }
    el.querySelector(".stats").innerHTML = `<div class="stat"><span>Equation</span>Ŷ = ${fmt(f.b0)} ${f.b1 < 0 ? "−" : "+"} ${fmt(Math.abs(f.b1))}X</div><div class="stat"><span>r</span>${fmt(f.r)}</div><div class="stat"><span>R²</span>${fmt(f.r2)} → ${Math.round(f.r2 * 100)}% explained</div><div class="stat"><span>F(1, ${f.n - 2})</span>${fmt(f.F, 1)}</div><div class="stat"><span>Cook's D &gt; 4/n</span>${nflag} point${nflag === 1 ? "" : "s"} (ringed)</div>${extra}`;
  };
  ["sb-s", "sb-n", "sb-k"].forEach(id => el.querySelector("#" + id).oninput = gen);
  el.querySelector("[data-new]").onclick = gen; el.querySelector("[data-res]").onchange = draw; gen();
};

/* ---------------------------------------------------------- pipeline */
WIDGETS.pipeline = (el) => {
  const steps = [["Check assumptions", "CINLHR + M. Fail? Transform, change model, or report descriptives."], ["Run the model", "lm(Y ~ X1 + X2 + X3). Double-check formula; set reference groups."], ["Outliers & influence", "Std. residuals > 1.96 · leverage > 2k/n · Cook's D > 4/n. Look for data errors."], ["Interpret & report", "β, direction, p, 95% CI · F, df, p · R², adj R² · assumptions & diagnostics."]];
  el.classList.add("pipeline");
  el.innerHTML = steps.map((s, i) => `<div class="pstep"><div class="pnum">${i + 1}</div><h4>${s[0]}</h4><p>${s[1]}</p></div>`).join("");
};

/* ---------------------------------------------------------- assumptions */
WIDGETS.assumptions = (el) => {
  const W = 160, H = 100; const r = rng(3);
  const mk = (fn) => { let s = `<svg viewBox="0 0 ${W} ${H}" class="mini">`; s += fn(); return s + "</svg>"; };
  const scatter = (f) => () => { let o = `<line x1="8" y1="92" x2="152" y2="92" class="axis"/><line x1="8" y1="8" x2="8" y2="92" class="axis"/>`; for (let i = 0; i < 40; i++) { const x = 12 + i * 3.5; const y = f(x, i); o += `<circle cx="${x}" cy="${clamp(y, 10, 90)}" r="2.6" class="dot"/>`; } return o; };
  const hist = (heights) => () => heights.map((v, i) => `<rect x="${12 + i * 14}" y="${92 - v}" width="12" height="${v}" class="bar"/>`).join("") + `<line x1="8" y1="92" x2="152" y2="92" class="axis"/>`;
  const items = [
    ["C", "Continuous outcome", "Y is measured on a numeric scale (BMI, SBP).", "Y is yes/no → use logistic.", hist([10, 30, 55, 70, 55, 30, 10, 4, 2, 1]), () => `<rect x="30" y="20" width="40" height="72" class="bar"/><rect x="90" y="50" width="40" height="42" class="bar bad"/><text x="50" y="16" class="tick" text-anchor="middle">0</text><text x="110" y="46" class="tick" text-anchor="middle">1</text>`],
    ["I", "Independent observations", "Each person counted once; no clusters.", "Repeated measures of same people, households, clinics.", () => Array.from({ length: 12 }, (_, i) => `<circle cx="${20 + (i % 6) * 24}" cy="${30 + Math.floor(i / 6) * 40}" r="7" class="dot"/>`).join(""), () => [0, 1, 2].map(g => `<ellipse cx="${30 + g * 50}" cy="50" rx="22" ry="30" class="clus"/>` + [0, 1, 2].map(k => `<circle cx="${30 + g * 50}" cy="${30 + k * 20}" r="6" class="dot"/>`).join("")).join("")],
    ["N", "Normal variables", "Histograms look bell-shaped; Q-Q points on the line.", "Long tail (BMI, income) → try a log transform.", hist([4, 12, 30, 55, 72, 55, 30, 12, 4, 1]), hist([72, 55, 34, 20, 12, 8, 5, 3, 2, 1])],
    ["L", "Linearity", "Points follow a straight-ish trend.", "Curved pattern; a line misses it.", scatter((x) => 90 - x * 0.5 + randn(r) * 6), scatter((x) => 20 + (x - 80) ** 2 / 90 + randn(r) * 4)],
    ["H", "Homoscedasticity", "Residuals: even band around zero.", "Fan / funnel shape.", scatter((x) => 50 + randn(r) * 8), scatter((x) => 50 + randn(r) * (x - 5) / 4.5)],
    ["R", "Residuals independent & normal", "Durbin-Watson ≈ 2; residual Q-Q on the line.", "Patterned residuals; skewed residual histogram.", hist([3, 10, 28, 52, 66, 52, 28, 10, 3, 1]), hist([2, 6, 50, 70, 40, 20, 14, 10, 8, 6])],
    ["M", "No perfect multicollinearity", "Predictors are not near-duplicates. VIF < 5.", "Pregnancies vs. number of children; VIF > 10.", scatter((x) => 50 + randn(r) * 22), scatter((x) => 95 - x * 0.55 + randn(r) * 2)]
  ];
  el.classList.add("assume-grid");
  el.innerHTML = items.map((it, i) => `<div class="acard" data-state="pass"><div class="aletter">${it[0]}</div><h4>${it[1]}</h4>
    <div class="aviz"><div class="pass">${mk(it[4])}<p>✔ ${it[2]}</p></div><div class="fail">${mk(it[5])}<p>✘ ${it[3]}</p></div></div>
    <div class="seg"><button data-s="pass" class="on">Passes</button><button data-s="fail">Fails</button></div></div>`).join("");
  el.querySelectorAll(".acard").forEach(c => c.querySelectorAll("[data-s]").forEach(b => b.onclick = () => { c.dataset.state = b.dataset.s; c.querySelectorAll("[data-s]").forEach(x => x.classList.toggle("on", x === b)); }));
};

/* ---------------------------------------------------------- cutoffs */
WIDGETS.cutoffs = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Cutoff calculator</div><div class="row"><label class="num">Sample size n <input type="number" id="cu-n" value="3100" min="5"></label><label class="num">Number of predictors <input type="number" id="cu-p" value="3" min="1"></label></div><div class="stats" id="cu-o"></div>`;
  const go = () => {
    const n = +el.querySelector("#cu-n").value, p = +el.querySelector("#cu-p").value, k = p + 1;
    el.querySelector("#cu-o").innerHTML = `<div class="stat"><span>k = predictors + 1</span>${k}</div><div class="stat"><span>Leverage cutoff 2k/n</span>2×${k}/${n} = <b>${fmt(2 * k / n, 5)}</b></div><div class="stat"><span>Cook's D cutoff 4/n</span>4/${n} = <b>${fmt(4 / n, 5)}</b></div><div class="stat"><span>Std. residuals beyond ±1.96 by chance</span>≈ 5% × ${n} = <b>${Math.round(0.05 * n)}</b></div>`;
  };
  el.querySelectorAll("input").forEach(i => i.oninput = go); go();
};

/* ---------------------------------------------------------- R output decoder */
WIDGETS.decoder = (el) => {
  const parts = {
    est: "<b>Estimate</b> = the β (slope). For inactive_pct, 0.42: each extra percentage point of inactivity → obesity 0.42 points higher, holding income and rural status constant.",
    se: "<b>Std. Error</b> = how uncertain the estimate is. Smaller = more precise. 95% CI ≈ β ± 1.96 × SE.",
    t: "<b>t value</b> = Estimate ÷ Std. Error. Far from 0 (|t| > ~2) → significant. In logistic output this column is <b>z value</b>.",
    p: "<b>Pr(&gt;|t|)</b> = p-value for H₀: β = 0. Below .05 → significant. <code>&lt;2e-16</code> means essentially 0; write p &lt; .001.",
    int: "<b>(Intercept)</b> = predicted obesity % for a non-rural county with 0% inactivity and $0 income. Not meaningful by itself.",
    cat: "<b>income_k</b>: −0.06. Each extra $1,000 of median income → 0.06 points lower obesity. Keep the minus sign!",
    cat2: "<b>ruralyes</b>: R names the non-reference level. Rural vs non-rural (reference): 0.85 points higher.",
    rse: "<b>Residual standard error</b>: typical distance of observed from predicted obesity (≈ 3.4 points). <b>3096 df</b> = n − k = 3100 − 4.",
    miss: "<b>Deleted due to missingness</b>: rows with any NA in the model variables are dropped. Report your analytic n (3,100).",
    r2: "<b>Multiple R²</b> 0.41 → 41% of obesity variability explained. <b>Adjusted R²</b> penalizes extra predictors; report it for multiple regression.",
    f: "<b>F-statistic</b> 717.2 on 3 and 3096 DF, p &lt; .001 → the model beats an intercept-only (mean) model. Write: F(3, 3096) = 717.2, p &lt; .001."
  };
  el.classList.add("widget", "decoder");
  const s = (k, t) => `<span class="hot" data-k="${k}" tabindex="0">${t}</span>`;
  el.innerHTML = `<div class="w-title">R output decoder</div><pre class="rout">Coefficients:
               ${s("est", "Estimate")}  ${s("se", "Std. Error")}  ${s("t", "t value")}  ${s("p", "Pr(>|t|)")}
${s("int", "(Intercept)")}      18.500      0.600     30.83    <2e-16 ***
inactive_pct      0.420      0.020     21.00    <2e-16 ***
${s("cat", "income_k")}         -0.060      0.008     -7.50   7.3e-14 ***
${s("cat2", "ruralyes")}          0.850      0.210      4.05   5.3e-05 ***

${s("rse", "Residual standard error: 3.42 on 3096 degrees of freedom")}
  ${s("miss", "(42 observations deleted due to missingness)")}
${s("r2", "Multiple R-squared:  0.4100,   Adjusted R-squared:  0.4094")}
${s("f", "F-statistic: 717.2 on 3 and 3096 DF,  p-value: < 2.2e-16")}</pre><div class="dec-out">Tap any highlighted part.</div>`;
  const out = el.querySelector(".dec-out");
  el.querySelectorAll(".hot").forEach(x => { const show = () => { out.innerHTML = parts[x.dataset.k]; el.querySelectorAll(".hot").forEach(y => y.classList.toggle("on", y === x)); }; x.onmouseenter = show; x.onclick = show; x.onfocus = show; });
};

/* ---------------------------------------------------------- sentence builder */
WIDGETS.sentence = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Interpretation sentence builder</div>
  <div class="form">
   <label>Model <select id="sn-m"><option value="lin">Linear (lm)</option><option value="log">Logistic (glm), using the OR</option></select></label>
   <label>Predictor type <select id="sn-t"><option value="c">Continuous</option><option value="g">Categorical (group vs reference)</option></select></label>
   <label>Predictor <input id="sn-x" value="exercise (minutes per day)"></label>
   <label>Comparison group <input id="sn-ref" value="non-shift workers" disabled></label>
   <label>Outcome <input id="sn-y" value="sleep quality score"></label>
   <label>Estimate (β or OR) <input id="sn-b" type="number" step="any" value="0.035"></label>
   <label>p-value <input id="sn-p" type="number" step="any" value="0.02"></label>
   <label>Other variables held constant <input id="sn-c" value="caffeine intake and shift work"></label>
  </div><div class="sentence" id="sn-o"></div>`;
  const $ = id => el.querySelector("#" + id);
  const go = () => {
    const m = $("sn-m").value, t = $("sn-t").value, x = $("sn-x").value, y = $("sn-y").value, b = +$("sn-b").value, p = +$("sn-p").value, c = $("sn-c").value, ref = $("sn-ref").value;
    $("sn-ref").disabled = t !== "g";
    const sig = p < 0.05; const ctrl = c ? `, holding ${c} constant` : ""; let s;
    if (m === "lin") {
      const dir = b >= 0 ? "higher" : "lower"; const amt = Math.abs(b);
      s = t === "c" ? `For every one-unit increase in ${x}, ${y} is ${fmt(amt)} units ${dir} on average${ctrl} (b = ${fmt(b)}, p ${pfmt(p)}).` : `${cap(x)} have ${y} ${fmt(amt)} units ${dir} than ${ref} on average${ctrl} (b = ${fmt(b)}, p ${pfmt(p)}).`;
    } else {
      if (b <= 0) { $("sn-o").innerHTML = "An odds ratio must be greater than 0."; return; }
      const pct = b >= 1 ? `${fmt((b - 1) * 100, 0)}% higher` : `${fmt((1 - b) * 100, 0)}% lower`;
      s = t === "c" ? `For every one-unit increase in ${x}, the odds of ${y} are ${fmt(b)} times as high (${pct} odds)${ctrl} (OR = ${fmt(b)}, p ${pfmt(p)}).` : `${cap(x)} have ${fmt(b)} times the odds of ${y} compared to ${ref} (${pct} odds)${ctrl} (OR = ${fmt(b)}, p ${pfmt(p)}).`;
    }
    $("sn-o").innerHTML = `<p>${s}</p><p class="small">${sig ? "✔ Significant at α = .05." : "✘ Not significant at α = .05: say \"was not significantly associated with\"."}</p>`;
  };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  el.querySelectorAll("input,select").forEach(i => i.oninput = go); go();
};

/* ---------------------------------------------------------- probability ladder */
WIDGETS.ladder = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Probability → odds → log-odds</div>${slider("Probability p", 0.01, 0.99, 0.01, 0.6, "ld")}<div class="ladder"></div>`;
  const go = () => {
    const p = +el.querySelector("#ld").value; el.querySelector("#ld-o").textContent = p.toFixed(2);
    const o = p / (1 - p), l = Math.log(o);
    const bar = (v, max, cls) => `<div class="lbar"><div class="${cls}" style="width:${clamp(v / max * 100, 1, 100)}%"></div></div>`;
    el.querySelector(".ladder").innerHTML = `
     <div class="lrow"><div class="lk">Probability<br><small>0 to 1</small></div>${bar(p, 1, "lb1")}<div class="lv">${p.toFixed(2)}</div></div>
     <div class="lrow"><div class="lk">Odds = p/(1−p)<br><small>0 to ∞</small></div>${bar(o, 20, "lb2")}<div class="lv">${p.toFixed(2)}/${(1 - p).toFixed(2)} = ${fmt(o)}</div></div>
     <div class="lrow"><div class="lk">Log-odds = ln(odds)<br><small>−∞ to +∞</small></div><div class="lbar center"><div class="lb3" style="${l >= 0 ? `left:50%;width:${clamp(l / 5 * 50, 0.5, 50)}%` : `right:50%;width:${clamp(-l / 5 * 50, 0.5, 50)}%`}"></div></div><div class="lv">ln(${fmt(o)}) = ${fmt(l)}</div></div>`;
  };
  el.querySelector("#ld").oninput = go; go();
};

/* ---------------------------------------------------------- sigmoid */
WIDGETS.sigmoid = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">The logistic curve: flu vaccination by age</div><div class="ctrls">${slider("b₀ (intercept)", -8, 4, 0.1, -2.6, "sg0")}${slider("b₁ (slope for age)", -0.3, 0.3, 0.005, 0.12, "sg1")}${slider("Age (X)", 0, 80, 1, 20, "sgx")}</div><div class="svgwrap"></div><div class="stats"></div>`;
  const W = 640, H = 300, P = 40; const xs = v => P + v / 80 * (W - 2 * P), ys = v => H - P - v * (H - 2 * P);
  const go = () => {
    const b0 = +el.querySelector("#sg0").value, b1 = +el.querySelector("#sg1").value, x0 = +el.querySelector("#sgx").value;
    ["sg0", "sg1", "sgx"].forEach(id => el.querySelector("#" + id + "-o").textContent = el.querySelector("#" + id).value);
    const p = x => 1 / (1 + Math.exp(-(b0 + b1 * x)));
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart grid-bg" });
    [0, .25, .5, .75, 1].forEach(v => { s.appendChild(svgEl("line", { x1: xs(0), x2: xs(80), y1: ys(v), y2: ys(v), class: v === .5 ? "half" : "gl" })); const t = svgEl("text", { x: P - 6, y: ys(v) + 4, class: "tick", "text-anchor": "end" }); t.textContent = v; s.appendChild(t); });
    for (let a = 0; a <= 80; a += 10) { const t = svgEl("text", { x: xs(a), y: H - P + 16, class: "tick", "text-anchor": "middle" }); t.textContent = a; s.appendChild(t); }
    const r = rng(11); for (let i = 0; i < 60; i++) { const a = r() * 80; const y = r() < p(a) ? 1 : 0; s.appendChild(svgEl("circle", { cx: xs(a), cy: ys(y) + (y ? 6 : -6) * r(), r: 3.5, class: "dot soft" })); }
    let d = ""; for (let a = 0; a <= 80; a += 0.5) d += (a ? "L" : "M") + xs(a) + " " + ys(p(a)); s.appendChild(svgEl("path", { d, class: "fit curve" }));
    s.appendChild(svgEl("line", { x1: xs(x0), x2: xs(x0), y1: ys(0), y2: ys(p(x0)), class: "guide" })); s.appendChild(svgEl("line", { x1: xs(0), x2: xs(x0), y1: ys(p(x0)), y2: ys(p(x0)), class: "guide" }));
    s.appendChild(svgEl("circle", { cx: xs(x0), cy: ys(p(x0)), r: 7, class: "dot hot" }));
    const w = el.querySelector(".svgwrap"); w.innerHTML = ""; w.appendChild(s);
    const pp = p(x0), OR = Math.exp(b1);
    el.querySelector(".stats").innerHTML = `<div class="stat wide"><span>Step by step at age ${x0}</span>log-odds = ${fmt(b0)} + ${fmt(b1, 3)}×${x0} = <b>${fmt(b0 + b1 * x0)}</b> → p = 1/(1 + e<sup>−(${fmt(b0 + b1 * x0)})</sup>) = <b>${pp.toFixed(2)}</b> → ${pp >= 0.5 ? "predicted <b>vaccinated</b> (p ≥ .50)" : "predicted <b>not vaccinated</b> (p &lt; .50)"}</div><div class="stat"><span>Odds ratio e<sup>b₁</sup></span>${fmt(OR, 3)} → ${OR >= 1 ? fmt((OR - 1) * 100, 1) + "% higher" : fmt((1 - OR) * 100, 1) + "% lower"} odds per year of age</div><div class="stat"><span>Tip</span>Set b₁ = 0: the curve goes flat (OR = 1, no association).</div>`;
  };
  el.querySelectorAll("input").forEach(i => i.oninput = go); go();
};

/* ---------------------------------------------------------- forest plot game */
WIDGETS.forest = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Does the CI cross 1? (Practice exam A Q6, drawn)</div><div class="svgwrap"></div><div class="row"><button class="btn" data-play>Quick-fire round</button><span class="score small"></span></div><div class="game"></div>`;
  const rows = [["OR 4.5 (0.8–25.0)", 4.5, 0.8, 25], ["OR 0.42 (0.25–0.71)", 0.42, 0.25, 0.71], ["OR 1.8 (1.1–2.9)", 1.8, 1.1, 2.9], ["OR 0.95 (0.60–1.50)", 0.95, 0.6, 1.5]];
  const draw = (rws, svgHolder) => {
    const W = 640, rowH = 44, H = rws.length * rowH + 40, L = 250; const lx = v => L + (Math.log10(v) + 2) / 5 * (W - L - 20);
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart" });
    s.appendChild(svgEl("line", { x1: lx(1), x2: lx(1), y1: 8, y2: H - 28, class: "half" }));
    [0.01, 0.1, 1, 10, 100, 1000].forEach(v => { const t = svgEl("text", { x: lx(v), y: H - 10, class: "tick", "text-anchor": "middle" }); t.textContent = v; s.appendChild(t); });
    rws.forEach((r, i) => {
      const y = 28 + i * rowH; const sig = r[2] > 1 || r[3] < 1;
      const t = svgEl("text", { x: 8, y: y + 5, class: "lbl" }); t.textContent = r[0]; s.appendChild(t);
      s.appendChild(svgEl("line", { x1: lx(r[2]), x2: lx(r[3]), y1: y, y2: y, class: sig ? "ci sig" : "ci" }));
      s.appendChild(svgEl("rect", { x: lx(r[1]) - 5, y: y - 5, width: 10, height: 10, class: sig ? "pt sig" : "pt" }));
    });
    svgHolder.innerHTML = ""; svgHolder.appendChild(s);
  };
  draw(rows, el.querySelector(".svgwrap"));
  let score = 0, tries = 0; const r = rng(Date.now() % 100000);
  const round = () => {
    const or = Math.exp(randn(r) * 1.1); const wid = 0.15 + r() * 1.2; const lo = or * Math.exp(-wid), hi = or * Math.exp(wid);
    const sig = lo > 1 || hi < 1; const g = el.querySelector(".game");
    g.innerHTML = `<p class="q">OR = <b>${fmt(or)}</b>, 95% CI <b>${fmt(lo)} – ${fmt(hi)}</b></p><div class="opts"><button class="opt" data-a="1">Significant</button><button class="opt" data-a="0">Not significant</button></div><div class="fb"></div>`;
    g.querySelectorAll("[data-a]").forEach(b => b.onclick = () => {
      tries++; const ok = (+b.dataset.a === 1) === sig; if (ok) score++;
      const pct = or >= 1 ? `${fmt((or - 1) * 100, 0)}% higher odds` : `${fmt((1 - or) * 100, 0)}% lower odds`;
      g.querySelector(".fb").innerHTML = `<p class="${ok ? "good" : "badtxt"}">${ok ? "Correct." : "Not quite."} The CI ${sig ? "does not include 1 → significant" : "includes 1 → not significant"}. In words: ${pct}.</p><button class="btn" data-next>Next</button>`;
      g.querySelectorAll("[data-a]").forEach(x => x.disabled = true);
      el.querySelector(".score").textContent = `${score}/${tries} correct`; g.querySelector("[data-next]").onclick = round;
    });
  };
  el.querySelector("[data-play]").onclick = round;
};

/* ---------------------------------------------------------- separation */
WIDGETS.separation = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Complete separation: adult or …?</div><div class="seg"><button data-m="a" class="on">A: adult vs teenager</button><button data-m="b">B: adult vs newborn</button></div><div class="svgwrap"></div><p class="w-read"></p>`;
  const go = (m) => {
    const W = 640, H = 260, P = 40, xs = v => P + v / 100 * (W - 2 * P), ys = v => H - P - v * (H - 2 * P); const r = rng(5);
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart grid-bg" });
    s.appendChild(svgEl("line", { x1: xs(0), x2: xs(100), y1: ys(0), y2: ys(0), class: "axis" }));
    for (let a = 0; a <= 100; a += 20) { const t = svgEl("text", { x: xs(a), y: H - P + 16, class: "tick", "text-anchor": "middle" }); t.textContent = a + " kg"; s.appendChild(t); }
    const g0 = m === "a" ? [15, 45] : [2, 8], g1 = m === "a" ? [35, 95] : [50, 95];
    for (let i = 0; i < 25; i++) { s.appendChild(svgEl("circle", { cx: xs(g0[0] + r() * (g0[1] - g0[0])), cy: ys(0) - 4 - r() * 6, r: 4, class: "dot soft" })); s.appendChild(svgEl("circle", { cx: xs(g1[0] + r() * (g1[1] - g1[0])), cy: ys(1) + 4 + r() * 6, r: 4, class: "dot" })); }
    const mid = m === "a" ? 40 : 29, slope = m === "a" ? 0.25 : 6; let d = "";
    for (let a = 0; a <= 100; a += 0.25) d += (a ? "L" : "M") + xs(a) + " " + ys(1 / (1 + Math.exp(-slope * (a - mid))));
    s.appendChild(svgEl("path", { d, class: "fit curve" }));
    const w = el.querySelector(".svgwrap"); w.innerHTML = ""; w.appendChild(s);
    el.querySelector(".w-read").innerHTML = m === "a" ? "Weights overlap, so the S-curve has a sensible slope. The model can estimate b₁." : "No overlap: every newborn is lighter than every adult. The best-fitting curve is a vertical step, so b₁ → ∞, SEs explode, and R warns <code>fitted probabilities numerically 0 or 1 occurred</code>. That's <b>complete separation</b>.";
  };
  el.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { el.querySelectorAll("[data-m]").forEach(x => x.classList.toggle("on", x === b)); go(b.dataset.m); });
  go("a");
};

/* ---------------------------------------------------------- ANOVA viz */
WIDGETS.anovaviz = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">What makes F big?</div><div class="ctrls">${slider("Distance between group means", 0, 3, 0.1, 1.2, "av-b")}${slider("Spread within groups", 0.3, 3, 0.1, 1, "av-w")}</div><div class="svgwrap"></div><div class="stats"></div>`;
  const go = () => {
    const b = +el.querySelector("#av-b").value, wv = +el.querySelector("#av-w").value; el.querySelector("#av-b-o").textContent = b; el.querySelector("#av-w-o").textContent = wv;
    const r = rng(21); const groups = [-b, 0, b].map(m => Array.from({ length: 20 }, () => 5 + m + randn(r) * wv));
    const W = 640, H = 240, P = 30; const ys = v => H - P - (v / 10) * (H - 2 * P);
    const s = svgEl("svg", { viewBox: `0 0 ${W} ${H}`, class: "chart grid-bg" });
    const all = groups.flat(); const gm = all.reduce((a, c) => a + c) / all.length;
    s.appendChild(svgEl("line", { x1: 40, x2: W - 20, y1: ys(gm), y2: ys(gm), class: "half" }));
    let ssb = 0, ssw = 0;
    groups.forEach((g, i) => {
      const cx = 140 + i * 180; const m = g.reduce((a, c) => a + c) / g.length; ssb += g.length * (m - gm) ** 2; g.forEach(v => ssw += (v - m) ** 2);
      g.forEach((v, j) => s.appendChild(svgEl("circle", { cx: cx - 30 + (j % 10) * 6, cy: ys(clamp(v, 0, 10)), r: 4, class: "dot soft c" + i })));
      s.appendChild(svgEl("line", { x1: cx - 50, x2: cx + 50, y1: ys(m), y2: ys(m), class: "fit" }));
      const t = svgEl("text", { x: cx, y: H - 8, class: "tick", "text-anchor": "middle" }); t.textContent = ["Group A", "Group B", "Group C"][i]; s.appendChild(t);
    });
    const F = (ssb / 2) / (ssw / (all.length - 3));
    const w = el.querySelector(".svgwrap"); w.innerHTML = ""; w.appendChild(s);
    el.querySelector(".stats").innerHTML = `<div class="stat"><span>MS between</span>${fmt(ssb / 2)}</div><div class="stat"><span>MS within</span>${fmt(ssw / 57)}</div><div class="stat"><span>F(2, 57) = between ÷ within</span><b>${fmt(F)}</b> ${F > 3.16 ? "→ significant (critical F ≈ 3.16)" : "→ not significant"}</div>`;
  };
  el.querySelectorAll("input").forEach(i => i.oninput = go); go();
};

/* ---------------------------------------------------------- familywise error */
WIDGETS.typeone = (el) => {
  el.classList.add("widget");
  el.innerHTML = `<div class="w-title">Why not just run lots of t-tests?</div>${slider("Number of groups", 2, 8, 1, 4, "t1")}<div class="stats"></div><div class="fwbar"><div></div></div>`;
  const go = () => {
    const g = +el.querySelector("#t1").value; el.querySelector("#t1-o").textContent = g; const c = g * (g - 1) / 2; const fw = 1 - 0.95 ** c;
    el.querySelector(".stats").innerHTML = `<div class="stat"><span>Pairwise comparisons</span>${g}×${g - 1}/2 = <b>${c}</b></div><div class="stat"><span>Chance of ≥ 1 false positive</span>1 − 0.95<sup>${c}</sup> = <b>${(fw * 100).toFixed(0)}%</b></div><div class="stat"><span>Bonferroni α per test</span>.05/${c} = <b>${(0.05 / c).toFixed(4)}</b></div>`;
    el.querySelector(".fwbar div").style.width = (fw * 100) + "%";
  };
  el.querySelector("#t1").oninput = go; go();
};

/* ---------------------------------------------------------- logistic fit (IRLS) */
function solve(A, b) { const n = A.length; const M = A.map((r, i) => [...r, b[i]]); for (let i = 0; i < n; i++) { let mx = i; for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[mx][i])) mx = k;[M[i], M[mx]] = [M[mx], M[i]]; if (Math.abs(M[i][i]) < 1e-12) return null; for (let k = 0; k < n; k++) if (k !== i) { const f = M[k][i] / M[i][i]; for (let j = i; j <= n; j++) M[k][j] -= f * M[i][j]; } } return M.map((r, i) => r[n] / r[i]); }
function inv(A) { const n = A.length; return A.map((_, j) => solve(A, A.map((_, i) => i === j ? 1 : 0))).reduce((acc, col, j) => { if (!col) return null; if (acc) col.forEach((v, i) => acc[i][j] = v); return acc; }, A.map(r => r.map(() => 0))); }
function logit(X, y) {
  const p = X[0].length; let b = Array(p).fill(0), it = 0, ll = 0, converged = false;
  for (; it < 50; it++) {
    const XtWX = Array.from({ length: p }, () => Array(p).fill(0)), XtWz = Array(p).fill(0); ll = 0;
    X.forEach((row, i) => { const eta = row.reduce((a, x, j) => a + x * b[j], 0); const mu = clamp(1 / (1 + Math.exp(-eta)), 1e-10, 1 - 1e-10); ll += y[i] * Math.log(mu) + (1 - y[i]) * Math.log(1 - mu); const w = mu * (1 - mu); const z = eta + (y[i] - mu) / w; for (let j = 0; j < p; j++) { XtWz[j] += row[j] * w * z; for (let k = 0; k < p; k++) XtWX[j][k] += row[j] * w * row[k]; } });
    const nb = solve(XtWX, XtWz); if (!nb) return { fail: true };
    const diff = Math.max(...nb.map((v, j) => Math.abs(v - b[j]))); b = nb; if (diff < 1e-7) { converged = true; break; }
  }
  const XtWX = Array.from({ length: p }, () => Array(p).fill(0));
  X.forEach(row => { const eta = row.reduce((a, x, j) => a + x * b[j], 0); const mu = 1 / (1 + Math.exp(-eta)); const w = Math.max(mu * (1 - mu), 1e-12); for (let j = 0; j < p; j++) for (let k = 0; k < p; k++) XtWX[j][k] += row[j] * w * row[k]; });
  const V = inv(XtWX); const se = V ? V.map((r, i) => Math.sqrt(Math.abs(r[i]))) : b.map(() => NaN);
  const ybar = y.reduce((a, c) => a + c) / y.length; const ll0 = y.reduce((a, c) => a + (c ? Math.log(ybar) : Math.log(1 - ybar)), 0);
  const correct = X.filter((row, i) => ((1 / (1 + Math.exp(-row.reduce((a, x, j) => a + x * b[j], 0)))) >= 0.5 ? 1 : 0) === y[i]).length;
  return { b, se, it, converged, ll, ll0, correct, n: y.length };
}
const CLASS_DATA = [
  [1, 0, 8, 0, 1], [1, 0, 5, 0, 1], [0, 1, 16, 1, 0], [0, 1, 12, 1, 0], [1, 0, 3, 0, 1], [0, 0, 10, 1, 1], [1, 1, 6, 0, 0], [0, 1, 18, 0, 0],
  [1, 0, 4, 1, 1], [0, 0, 14, 0, 0], [1, 0, 7, 0, 1], [0, 1, 20, 1, 1], [1, 1, 9, 1, 1], [0, 0, 11, 0, 1], [0, 1, 15, 0, 0], [1, 0, 2, 0, 0],
  [0, 0, 13, 1, 0], [1, 0, 6, 1, 1], [0, 1, 17, 0, 0], [1, 1, 12, 0, 1], [0, 0, 9, 0, 1], [1, 0, 10, 1, 0], [0, 1, 22, 1, 0], [1, 0, 5, 0, 1]
];
WIDGETS.yohago = (el) => {
  el.classList.add("widget");
  let data = CLASS_DATA.map(r => [...r]);
  const names = ["near_bike_lane", "owns_car", "commute_km", "grew_up_cycling", "bikes_to_work"];
  const render = () => {
    el.innerHTML = `<div class="w-title">Bike commute lab: fit the logistic model</div>
    <p class="small">24 made-up commuters (Yes = 1, No = 0). Edit any cell, add your own row, then fit. Try making everyone near a bike lane a cyclist to trigger complete separation.</p>
    <div class="tblwrap"><table class="tbl edit"><tr><th>ID</th>${names.map(n => `<th><code>${n}</code></th>`).join("")}<th></th></tr>
    ${data.map((r, i) => `<tr><td>${i + 1}</td>${r.map((v, j) => `<td><input data-r="${i}" data-c="${j}" value="${v}" inputmode="numeric" aria-label="${names[j]} row ${i + 1}"></td>`).join("")}<td><button class="x" data-del="${i}" aria-label="Delete row">×</button></td></tr>`).join("")}</table></div>
    <div class="row"><button class="btn ghost" data-add>Add a row</button><button class="btn" data-fit>Fit glm(bikes_to_work ~ ., family = binomial)</button><button class="btn ghost" data-reset>Reset data</button></div><div class="fitout"></div>`;
    el.querySelectorAll("input[data-r]").forEach(inp => inp.onchange = () => { data[+inp.dataset.r][+inp.dataset.c] = +inp.value || 0; });
    el.querySelectorAll("[data-del]").forEach(b => b.onclick = () => { data.splice(+b.dataset.del, 1); render(); });
    el.querySelector("[data-add]").onclick = () => { data.push([0, 0, 10, 0, 0]); render(); };
    el.querySelector("[data-reset]").onclick = () => { data = CLASS_DATA.map(r => [...r]); render(); };
    el.querySelector("[data-fit]").onclick = fit;
  };
  const fit = () => {
    const out = el.querySelector(".fitout");
    const bad = data.some(r => [0, 1, 3, 4].some(j => r[j] !== 0 && r[j] !== 1));
    if (bad) { out.innerHTML = `<p class="badtxt">Binary columns must be 0 or 1. Recode "Prefer not to say" as missing (delete the row) first.</p>`; return; }
    const X = data.map(r => [1, r[0], r[1], r[2], r[3]]), y = data.map(r => r[4]);
    const ev = Math.min(y.filter(v => v).length, y.filter(v => !v).length);
    const f = logit(X, y); if (f.fail) { out.innerHTML = `<p class="badtxt">The model can't be estimated: a predictor has no variation or duplicates another (perfect multicollinearity).</p>`; return; }
    const lab = ["(Intercept)", ...names.slice(0, 4)];
    const sep = !f.converged || f.b.some(v => Math.abs(v) > 12) || f.se.some(v => v > 50 || isNaN(v));
    const chi = 2 * (f.ll - f.ll0); const chiP = 1 - chi2cdf(chi, 4);
    let t = "Coefficients:\n                    Estimate  Std.Error  z value  Pr(>|z|)     OR    2.5%   97.5%\n";
    f.b.forEach((b, i) => { const z = b / f.se[i], p = 2 * (1 - normCdf(Math.abs(z))); t += `${lab[i].padEnd(19)}${fmt(b, 3).padStart(9)}${fmt(f.se[i], 3).padStart(11)}${fmt(z, 2).padStart(9)}${(p < .001 ? "<.001" : p.toFixed(3)).padStart(10)}${fmt(Math.exp(b), 2).padStart(8)}${fmt(Math.exp(b - 1.96 * f.se[i]), 2).padStart(8)}${fmt(Math.exp(b + 1.96 * f.se[i]), 2).padStart(8)}${p < .05 ? "  *" : ""}\n`; });
    t += `\nNull deviance: ${fmt(-2 * f.ll0, 1)}   Residual deviance: ${fmt(-2 * f.ll, 1)}\nModel chi-square(4) = ${fmt(chi, 2)}, p ${pfmt(chiP)}\nCorrectly predicted: ${f.correct}/${f.n} (${Math.round(f.correct / f.n * 100)}%)   iterations: ${f.it + 1}`;
    const iu = 1; const orU = Math.exp(f.b[iu]);
    out.innerHTML = `<pre class="rout">${t}</pre>
    ${sep ? `<div class="callout bad"><h4>Warning: complete (or quasi-) separation</h4><p>Estimates are huge and SEs explode. A predictor perfectly splits the outcome. Check cross-tabs; collect more data or drop/merge the variable.</p></div>` : ""}
    ${ev < 10 * 4 ? `<p class="small">Events per predictor = ${ev}/4 = ${(ev / 4).toFixed(1)} (rule of thumb ≥ 10). With a class-sized sample, expect wide CIs.</p>` : ""}
    <div class="callout"><h4>Read it</h4><p><b>Overall:</b> model χ²(4) = ${fmt(chi, 2)}, p ${pfmt(chiP)} → ${chiP < .05 ? "reject H₀; the model predicts better than baseline." : "fail to reject H₀; no better than baseline."}</p>
    <p><b>Bike lane:</b> commuters living near a protected bike lane have ${fmt(orU)} times the odds of biking to work compared to those who don't (${orU >= 1 ? fmt((orU - 1) * 100, 0) + "% higher" : fmt((1 - orU) * 100, 0) + "% lower"} odds), holding the others constant; 95% CI ${fmt(Math.exp(f.b[1] - 1.96 * f.se[1]))}–${fmt(Math.exp(f.b[1] + 1.96 * f.se[1]))} ${(Math.exp(f.b[1] - 1.96 * f.se[1]) > 1 || Math.exp(f.b[1] + 1.96 * f.se[1]) < 1) ? "excludes 1 → significant." : "includes 1 → not significant."}</p>
    <p><b>Commute distance:</b> OR = ${fmt(Math.exp(f.b[3]), 3)} per additional km.</p></div>`;
  };
  render();
};
function chi2cdf(x, k) { if (x <= 0) return 0; // regularized lower gamma P(k/2, x/2)
  const a = k / 2, z = x / 2; let sum = 1 / a, term = 1 / a; for (let n = 1; n < 200; n++) { term *= z / (a + n); sum += term; if (term < 1e-12) break; }
  const lg = (s) => { const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5]; let y = s, t = s + 5.5; t -= (s + 0.5) * Math.log(t); let ser = 1.000000000190015; c.forEach(v => ser += v / ++y); return -t + Math.log(2.5066282746310005 * ser / s); };
  return clamp(Math.exp(-z + a * Math.log(z) - lg(a)) * sum, 0, 1); }

/* ---------------------------------------------------------- interleaved test-picker drill */
const SCENARIOS = [
  ["Compare mean HbA1c between patients in a text-message program and usual care.", "t-test"],
  ["Compare mean steps per day across five neighborhoods.", "One-way ANOVA"],
  ["Does diet type (3 levels) and sex jointly affect LDL cholesterol?", "Two-way ANOVA"],
  ["Fatigue scores of the same patients at intake, 1 month, 2 months, and 6 months.", "Repeated measures ANOVA"],
  ["Is smoking status (yes/no) associated with having asthma (yes/no)?", "Chi-square"],
  ["Predict whether a patient is readmitted within 30 days (yes/no) from age, comorbidity count, and insurance.", "Logistic regression"],
  ["Predict systolic BP from potassium intake, waist size, and age.", "Multiple linear regression"],
  ["How strongly are county poverty rate and county obesity rate associated?", "Correlation"],
  ["Predict asthma ER visits from PM2.5 level alone.", "Simple linear regression"],
  ["Describe the typical length of hospital stay (strongly right-skewed).", "Median"],
  ["Describe the average height of adult women (normally distributed).", "Mean"],
  ["How variable is the number of daily vaccine doses given at a clinic?", "Standard deviation"],
  ["Does vaccination uptake (yes/no) differ across four regions?", "Chi-square"],
  ["Predict probability of food insecurity from household income (continuous).", "Logistic regression"],
  ["Does mean sleep duration differ between night-shift and day-shift nurses?", "t-test"],
  ["Does a walking program's effect on weight differ by gender? (program yes/no × gender, outcome weight)", "Two-way ANOVA"],
  ["Model BMI from physical activity minutes, age, and gender.", "Multiple linear regression"],
  ["Do mean wait times differ across three clinics?", "One-way ANOVA"]
];
const SC_OPTS = ["Mean", "Median", "Standard deviation", "t-test", "Chi-square", "Correlation", "Simple linear regression", "Multiple linear regression", "Logistic regression", "One-way ANOVA", "Two-way ANOVA", "Repeated measures ANOVA"];
WIDGETS.drill = (el) => {
  el.classList.add("widget");
  let order = [], i = 0, score = 0;
  const start = () => { order = [...SCENARIOS].sort(() => Math.random() - 0.5).slice(0, 10); i = 0; score = 0; ask(); };
  const ask = () => {
    if (i >= order.length) { el.innerHTML = `<div class="w-title">Test picker drill</div><div class="result"><div class="answer">${score}/10</div><p>${score >= 9 ? "Exam-ready on test selection." : "Run another round; the order shuffles each time, which is the point."}</p><button class="btn" data-again>Another round</button></div>`; el.querySelector("[data-again]").onclick = start; return; }
    const [s, a] = order[i];
    el.innerHTML = `<div class="w-title">Test picker drill · ${i + 1}/10 · score ${score}</div><p class="q">${s}</p><div class="opts grid">${SC_OPTS.map(o => `<button class="opt" data-o="${o}">${o}</button>`).join("")}</div><div class="fb"></div>`;
    el.querySelectorAll("[data-o]").forEach(b => b.onclick = () => {
      const ok = b.dataset.o === a; if (ok) score++;
      el.querySelectorAll("[data-o]").forEach(x => { x.disabled = true; if (x.dataset.o === a) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      el.querySelector(".fb").innerHTML = `<p class="${ok ? "good" : "badtxt"}">${ok ? "Correct" : "Answer: " + a}.</p><button class="btn" data-n>Next</button>`;
      el.querySelector("[data-n]").onclick = () => { i++; ask(); };
      if (window.recordDrill) window.recordDrill(ok);
    });
  };
  start();
};

function mountWidgets(root) { root.querySelectorAll("[data-widget]").forEach(el => { const f = WIDGETS[el.dataset.widget]; if (f && !el.dataset.mounted) { el.dataset.mounted = 1; try { f(el); } catch (e) { console.error(e); el.textContent = "This widget failed to load."; } } }); }
