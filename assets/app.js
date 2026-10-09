/* ALM Study Lab — app shell, router, question engine, flashcards, progress. */

/* ---------------- storage ---------------- */
const KEY = "alm-study-lab-v1";
let S = { q: {}, cards: {}, notes: {}, days: [], drill: { ok: 0, n: 0 }, lessons: {} };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch (e) { }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } };
const today = () => new Date().toISOString().slice(0, 10);
function touchDay() { if (!S.days.includes(today())) { S.days.push(today()); save(); } }
window.recordDrill = ok => { S.drill.n++; if (ok) S.drill.ok++; touchDay(); save(); };

const ALLQ = {}; EXAMS.forEach(ex => ex.sections.forEach(sec => sec.questions.forEach(q => { q.exam = ex.id; ALLQ[q.id] = q; })));
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const $ = (s, r = document) => r.querySelector(s);
const view = () => $("#view");

/* ---------------- grading helpers ---------------- */
const norm = s => String(s).toLowerCase().replace(/[^a-z0-9./ -]/g, " ").replace(/\s+/g, " ").trim();
function blankOk(input, accept) { const v = norm(input); if (!v) return false; return accept.some(a => { const n = norm(a); return v === n || (" " + v + " ").includes(" " + n + " "); }); }
function record(q, ok, score) {
  const prev = S.q[q.id] || { tries: 0 };
  S.q[q.id] = { ...prev, ok, score: score ?? (ok ? 1 : 0), tries: (prev.tries || 0) + 1, ts: Date.now(), conf: prev.pendingConf ?? prev.conf, pendingConf: undefined };
  touchDay(); save();
}

/* ---------------- question renderer ---------------- */
function renderQ(q, opts = {}) {
  const mode = opts.mode || "study"; // study | exam
  const el = document.createElement("article"); el.className = "q-card"; el.id = "q-" + q.id; el.dataset.type = q.type;
  const st = S.q[q.id]; const badge = st ? (st.score >= 0.8 ? `<span class="badge ok">mastered</span>` : st.score > 0 ? `<span class="badge mid">in progress</span>` : `<span class="badge no">review</span>`) : "";
  let body = "";
  if (q.pre) body += q.pre;
  if (q.type === "mc") body += `<div class="choices">${q.options.map((o, i) => `<button class="choice" data-i="${i}"><span class="letter">${"abcd"[i]}</span><span>${o}</span></button>`).join("")}</div>`;
  if (q.type === "circle") body += `<div class="choices">${q.options.map((o, i) => `<label class="choice chk"><input type="checkbox" value="${i}"><span>${o}</span></label>`).join("")}</div><button class="btn" data-check>Check</button>`;
  if (q.type === "blank") body += `<div class="blank-row"><input class="blank" placeholder="Type your answer" aria-label="Answer"><button class="btn" data-check>Check</button></div>`;
  if (q.type === "blank2") body += `<div class="blank-row"><input class="blank" data-k="0" placeholder="First blank" aria-label="First blank"><input class="blank" data-k="1" placeholder="Second blank" aria-label="Second blank"><button class="btn" data-check>Check</button></div>`;
  if (q.type === "pick") body += `<div class="choices pills">${q.options.map(o => `<button class="choice pill" data-o="${esc(o)}">${o}</button>`).join("")}</div>`;
  if (q.type === "short") body += `<textarea class="essay" rows="5" placeholder="Write your answer first. Retrieval beats rereading.">${esc(S.notes[q.id] || "")}</textarea><div class="row"><button class="btn" data-reveal>Compare with model answer</button><span class="small wc"></span></div>`;
  const auto = q.type !== "short";
  el.innerHTML = `<header><span class="qnum">${q.num}</span><div class="prompt">${q.prompt}</div>${badge}</header>${body}
    ${auto && mode === "study" ? `<div class="conf" role="group" aria-label="Confidence"><span class="small">How sure are you?</span><button data-c="1">Guessing</button><button data-c="2">Fairly sure</button><button data-c="3">Certain</button></div>` : ""}
    <div class="feedback" hidden></div>`;
  const fb = $(".feedback", el);
  const showFb = (ok, extra = "") => {
    if (mode === "exam" && !el.dataset.revealed) return;
    fb.hidden = false; fb.className = "feedback " + (ok === null ? "" : ok ? "is-ok" : "is-no");
    fb.innerHTML = (ok === null ? "" : `<p class="verdict">${ok ? "Correct." : "Not quite."}</p>`) + extra + `<div class="explain"><h5>Step by step</h5>${q.explain}</div>${typeof deeper === "function" ? deeper(q) : ""}`;
  };
  el.grade = () => { // used in exam mode on submit
    el.dataset.revealed = 1; const res = el._result; if (q.type === "short") { reveal(); return null; }
    if (!res) { showFb(false, `<p>No answer given. ${answerText(q)}</p>`); return 0; }
    showFb(res.ok, res.extra); return res.ok ? 1 : 0;
  };
  const answerText = q => q.type === "mc" ? `Answer: <b>${"abcd"[q.answer]}) ${q.options[q.answer]}</b>` : q.type === "circle" ? `Answer: ${q.answer.map(i => "<b>" + q.options[i] + "</b>").join(", ")}` : q.type === "pick" ? `Answer: <b>${q.answer.join(" or ")}</b>` : `Answer: <b>${q.display}</b>`;
  const finish = (ok, extra) => { el._result = { ok, extra }; record(q, ok); if (mode === "study") showFb(ok, extra); else el.classList.add("answered"); };

  el.querySelectorAll(".conf [data-c]").forEach(b => b.onclick = () => { el.querySelectorAll(".conf button").forEach(x => x.classList.toggle("on", x === b)); S.q[q.id] = { ...(S.q[q.id] || {}), pendingConf: +b.dataset.c }; save(); });
  if (q.type === "mc") el.querySelectorAll(".choice").forEach(b => b.onclick = () => {
    if (el._result && mode === "study") return; const i = +b.dataset.i;
    el.querySelectorAll(".choice").forEach(x => x.classList.remove("sel")); b.classList.add("sel");
    if (mode === "study") { el.querySelectorAll(".choice").forEach((x, j) => { x.disabled = true; if (j === q.answer) x.classList.add("right"); }); if (i !== q.answer) b.classList.add("wrong"); }
    finish(i === q.answer, i === q.answer ? "" : `<p>${answerText(q)}</p>`);
  });
  if (q.type === "pick") el.querySelectorAll(".choice").forEach(b => b.onclick = () => {
    if (el._result && mode === "study") return; const ok = q.answer.includes(b.dataset.o);
    el.querySelectorAll(".choice").forEach(x => x.classList.remove("sel")); b.classList.add("sel");
    if (mode === "study") { el.querySelectorAll(".choice").forEach(x => { x.disabled = true; if (q.answer.includes(x.dataset.o)) x.classList.add("right"); }); if (!ok) b.classList.add("wrong"); }
    finish(ok, ok ? "" : `<p>${answerText(q)}</p>`);
  });
  const chk = $("[data-check]", el);
  if (chk) chk.onclick = () => {
    if (q.type === "circle") { const sel = [...el.querySelectorAll("input:checked")].map(x => +x.value); const ok = sel.length === q.answer.length && sel.every(i => q.answer.includes(i)); finish(ok, ok ? "" : `<p>${answerText(q)}</p>`); }
    if (q.type === "blank") { const v = $(".blank", el).value; const ok = blankOk(v, q.accept); finish(ok, ok ? `<p>Accepted answer: <b>${q.display}</b></p>` : `<p>${answerText(q)}</p>`); }
    if (q.type === "blank2") { const vs = [...el.querySelectorAll(".blank")].map(x => x.value); const ok = vs.every((v, k) => blankOk(v, q.accept[k])); finish(ok, `<p>${answerText(q)}</p>`); }
  };
  el.querySelectorAll(".blank").forEach(i => i.onkeydown = e => { if (e.key === "Enter") chk.click(); });
  const ta = $(".essay", el);
  if (ta) { const wc = $(".wc", el); const upd = () => { const n = ta.value.trim().split(/\s+/).filter(Boolean).length; wc.textContent = n ? `${n} words` : ""; }; ta.oninput = () => { S.notes[q.id] = ta.value; save(); upd(); }; upd(); }
  function reveal() {
    fb.hidden = false; fb.className = "feedback";
    fb.innerHTML = `<div class="model"><h5>Model answer</h5>${q.model}</div>
      ${q.rubric ? `<div class="rubric"><h5>Score yourself: tick what your answer included</h5>${q.rubric.map((r, i) => `<label><input type="checkbox" data-r="${i}"> ${r}</label>`).join("")}<p class="small rscore"></p></div>` : ""}
      <div class="explain"><h5>Step by step</h5>${q.explain}</div>${typeof deeper === "function" ? deeper(q) : ""}`;
    const boxes = fb.querySelectorAll("[data-r]");
    const prevR = (S.q[q.id] || {}).rub || [];
    boxes.forEach((b, i) => { b.checked = !!prevR[i]; b.onchange = () => { const arr = [...boxes].map(x => x.checked); const sc = arr.filter(Boolean).length / arr.length; S.q[q.id] = { ...(S.q[q.id] || {}), rub: arr, score: sc, ok: sc >= 0.8, ts: Date.now(), tries: ((S.q[q.id] || {}).tries || 0) + (S.q[q.id]?.rub ? 0 : 1) }; touchDay(); save(); $(".rscore", fb).textContent = `Self-score: ${Math.round(sc * 100)}%`; }; });
    if (prevR.length) $(".rscore", fb).textContent = `Self-score: ${Math.round(((S.q[q.id] || {}).score || 0) * 100)}%`;
  }
  const rv = $("[data-reveal]", el); if (rv) rv.onclick = () => { if (mode === "exam" && !el.dataset.revealed) { el.classList.add("answered"); rv.textContent = "Saved. Model answer appears when you submit."; return; } reveal(); };
  return el;
}

/* ---------------- views ---------------- */
const ROUTES = [];
const route = (re, fn) => ROUTES.push([re, fn]);
function go() {
  const hash = location.hash.slice(1) || "/";
  for (const [re, fn] of ROUTES) { const m = hash.match(re); if (m) { stopTimer(); view().innerHTML = ""; fn(...m.slice(1)); const seg = "/" + (hash.split("/")[1] || ""); const alias = { "/exam": "/exams" }; document.querySelectorAll(".nav a").forEach(a => a.classList.toggle("on", a.getAttribute("href").slice(1) === (alias[seg] || seg))); window.scrollTo(0, 0); mountWidgets(view()); const h1 = $("h1", view()); if (h1 && !hash.startsWith("/search")) { h1.tabIndex = -1; h1.focus({ preventScroll: true }); } return; } }
  location.hash = "#/";
}
window.addEventListener("hashchange", go);

/* ----- mastery calc ----- */
function mastery() {
  const by = {}; Object.values(ALLQ).forEach(q => q.tags.forEach(t => { by[t] = by[t] || { n: 0, done: 0, sum: 0 }; by[t].n++; const s = S.q[q.id]; if (s && s.score !== undefined) { by[t].done++; by[t].sum += s.score; } }));
  return Object.entries(by).map(([t, v]) => ({ t, label: TOPICS[t] || t, n: v.n, done: v.done, pct: v.done ? v.sum / v.done : null, cover: v.done / v.n })).sort((a, b) => b.n - a.n);
}
function dueCards() { const now = Date.now(); return CARDS.map((c, i) => i).filter(i => !S.cards[i] || S.cards[i].due <= now); }
function streak() { let n = 0; const d = new Date(); for (; ;) { const k = d.toISOString().slice(0, 10); if (S.days.includes(k)) { n++; d.setDate(d.getDate() - 1); } else break; } return n; }

/* ----- home: see sections.js ----- */
route(/^\/$/, () => renderHome());
function masteryChart(m) {
  const rows = m.slice(0, 14);
  return `<div class="mchart" role="img" aria-label="Mastery by topic">${rows.map(r => `<div class="mrow"><span class="ml">${r.label}</span><div class="mtrack"><div class="mfill ${r.pct >= .8 ? "hi" : r.pct >= .5 ? "md" : "lo"}" style="width:${Math.max(4, r.pct * 100)}%"></div></div><span class="mv">${Math.round(r.pct * 100)}%<small> · ${r.done}/${r.n}</small></span></div>`).join("")}</div>`;
}
function heroAnim() {
  const s = $("#hero-svg"); if (!s) return; const r = rng(42); const pts = Array.from({ length: 22 }, () => { const x = 0.5 + r() * 9; return [x, clamp(1.5 + 0.7 * x + randn(r) * 1.1, 0.3, 9.7)]; });
  const X = v => 20 + v * 38, Y = v => 280 - v * 26; const f = ols(pts);
  let html = ""; for (let g = 0; g <= 10; g++) html += `<line x1="${X(g)}" x2="${X(g)}" y1="${Y(0)}" y2="${Y(10)}" class="gl"/><line x1="${X(0)}" x2="${X(10)}" y1="${Y(g)}" y2="${Y(g)}" class="gl"/>`;
  pts.forEach(([x, y], i) => html += `<line class="resid h-res" style="--d:${i}" x1="${X(x)}" x2="${X(x)}" y1="${Y(y)}" y2="${Y(f.b0 + f.b1 * x)}"/><circle class="dot h-dot" style="--d:${i}" cx="${X(x)}" cy="${Y(y)}" r="5"/>`);
  html += `<line id="hero-line" class="fit" x1="${X(0)}" x2="${X(10)}" y1="${Y(5)}" y2="${Y(5)}"/>`;
  s.innerHTML = html;
  const line = $("#hero-line"); const eq = $("#hero-eq");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const set = (t) => { const b1 = f.b1 * t, c0 = 5 + (f.b0 - 5) * t; line.setAttribute("y1", Y(c0)); line.setAttribute("y2", Y(c0 + b1 * 10)); eq.textContent = `Ŷ = ${c0.toFixed(2)} + ${b1.toFixed(2)}X`; s.querySelectorAll(".h-res").forEach((l, i) => l.setAttribute("y2", Y(c0 + b1 * pts[i][0]))); };
  if (reduce) { set(1); s.classList.add("shown"); return; }
  s.classList.add("shown"); let t0 = null; const step = ts => { if (!t0) t0 = ts; const t = clamp((ts - t0 - 900) / 1800, 0, 1); set(1 - Math.pow(1 - t, 3)); if (t < 1 && document.body.contains(s)) requestAnimationFrame(step); }; requestAnimationFrame(step);
}

/* ----- learn ----- */
route(/^\/learn$/, () => {
  view().innerHTML = `<h1>Lessons</h1><p class="lede">Each lesson: a hook, a plain-language explanation, an interactive figure, then a short check from your real exams. Do them in order the first time.</p>
  <div class="lesson-list">${LESSONS.map((l, i) => { const ch = l.check.filter(id => S.q[id]?.score !== undefined).length; return `<a class="lesson-card" href="#/learn/${l.id}" style="--lc:${l.color}"><span class="ln">${i + 1}</span><div><h3>${l.title}</h3><p>${l.hook}</p><span class="small">${l.mins} min · check ${ch}/${l.check.length}</span></div></a>`; }).join("")}</div>`;
});
route(/^\/learn\/([\w-]+)$/, (id) => {
  const i = LESSONS.findIndex(l => l.id === id); const l = LESSONS[i]; if (!l) { location.hash = "#/"; return; }
  const nx = LESSONS[i + 1], pv = LESSONS[i - 1];
  view().innerHTML = `<nav class="crumb"><a href="#/learn">Lessons</a> / ${l.title}</nav><article class="lesson" style="--lc:${l.color}"><h1>${l.title}</h1><p class="hook">${l.hook}</p>${typeof PLAIN !== "undefined" && PLAIN[l.id] ? `<div class="plainbox"><b>In plain words:</b> ${PLAIN[l.id][0]}<span>New to this? Do these short beginner steps first: ${PLAIN[l.id][1].map(z => { const b = BASICS.find(x => x.id === z); return `<a href="#/basics/${z}">${b.title}</a>`; }).join(" · ")}</span></div>` : ""}${l.body}
  <section class="check"><h2>Check yourself</h2><p class="small">From your actual exams. Answer before scrolling back up.</p><div class="qs"></div>
  <div class="explain-back"><h3>Explain it back</h3><p>${l.explainBack}</p><textarea rows="4" data-eb placeholder="Write it as if teaching someone. Gaps show up fast.">${esc(S.notes["eb-" + l.id] || "")}</textarea></div></section>
  <nav class="pager">${pv ? `<a href="#/learn/${pv.id}">Previous: ${pv.title}</a>` : "<span></span>"}${nx ? `<a href="#/learn/${nx.id}">Next: ${nx.title}</a>` : `<a href="#/exams">On to the exams</a>`}</nav></article>`;
  const qs = $(".qs", view()); l.check.forEach(qid => qs.appendChild(renderQ(ALLQ[qid])));
  $("[data-eb]", view()).oninput = e => { S.notes["eb-" + l.id] = e.target.value; save(); };
  S.lessons[id] = Date.now(); touchDay(); save();
});

/* ----- labs ----- */
const LABS = [
  ["drill", "Test picker drill", "Ten shuffled scenarios. Pick the analysis. The fastest way to bank Section V points."],
  ["yohago", "Bike commute lab", "Fit a logistic model on editable survey data. Break it with complete separation."],
  ["sandbox", "Regression sandbox", "Add points, see slope, R², F, leverage and Cook's D update live."],
  ["sigmoid", "Logistic curve explorer", "Move b₀ and b₁ and watch probabilities and odds ratios respond."],
  ["forest", "CI crosses 1?", "Odds-ratio significance, drawn and drilled."],
  ["sentence", "Sentence builder", "Turn any coefficient or OR into an exam-ready sentence."],
  ["decoder", "R output decoder", "Every number in summary(lm) explained."],
  ["cutoffs", "Outlier cutoff calculator", "2k/n, 4/n and expected residuals for any n."],
  ["ladder", "Probability ↔ odds ↔ log-odds", "See the logit transformation."],
  ["anovaviz", "What makes F big?", "Between- vs within-group variability."],
  ["typeone", "Multiple comparisons", "Why post-hoc tests exist."],
  ["skew", "Mean vs median", "Watch an outlier pull the mean."],
  ["decider", "Test chooser", "A step-by-step decision tree."]
];
route(/^\/labs$/, () => { view().innerHTML = `<h1>Labs</h1><p class="lede">Hands-on tools. Change a number, see what happens, then explain why.</p><div class="lab-grid">${LABS.map(l => `<a class="lab-card" href="#/labs/${l[0]}"><h3>${l[1]}</h3><p>${l[2]}</p></a>`).join("")}</div>`; });
route(/^\/labs\/([\w-]+)$/, (id) => { const l = LABS.find(x => x[0] === id); if (!l) { location.hash = "#/"; return; } view().innerHTML = `<nav class="crumb"><a href="#/labs">Labs</a> / ${l[1]}</nav><h1>${l[1]}</h1><p class="lede">${l[2]}</p><div data-widget="${id}"></div>`; touchDay(); });

/* ----- exams ----- */
route(/^\/exams$/, () => {
  view().innerHTML = `<h1>Exams & assignments</h1><p class="lede">Study mode checks each answer as you go. Exam mode hides feedback, runs a timer, and grades when you submit.</p>
  <div class="exam-list">${EXAMS.map(ex => { const qs = ex.sections.flatMap(s => s.questions); const d = qs.filter(q => S.q[q.id]?.score !== undefined); const avg = d.length ? d.reduce((a, q) => a + S.q[q.id].score, 0) / d.length : 0; return `<div class="exam-card"><h3>${ex.title}</h3><p>${ex.blurb}</p><div class="meter"><div style="width:${d.length / qs.length * 100}%"></div></div><span class="small">${d.length}/${qs.length} attempted${d.length ? ` · average ${Math.round(avg * 100)}%` : ""}</span><div class="row"><a class="btn" href="#/exam/${ex.id}/study">Study mode</a><a class="btn ghost" href="#/exam/${ex.id}/exam">Exam mode</a></div></div>`; }).join("")}</div>
  <p><a class="btn ghost" data-reset href="#/exams">Reset all exam progress</a></p>`;
  $("[data-reset]").onclick = (e) => { e.preventDefault(); const b = e.target; if (b.dataset.confirm) { S.q = {}; save(); go(); } else { b.dataset.confirm = 1; b.textContent = "Click again to erase your answers"; } };
});
let timerId = null; const stopTimer = () => { if (timerId) clearInterval(timerId); timerId = null; };
route(/^\/exam\/([\w-]+)\/(study|exam)$/, (id, mode) => {
  const ex = EXAMS.find(e => e.id === id); if (!ex) { location.hash = "#/"; return; }
  view().innerHTML = `<nav class="crumb"><a href="#/exams">Exams</a> / ${ex.title}</nav><h1>${ex.title}</h1>
  <div class="modebar"><div class="seg"><a href="#/exam/${id}/study" class="${mode === "study" ? "on" : ""}">Study mode</a><a href="#/exam/${id}/exam" class="${mode === "exam" ? "on" : ""}">Exam mode</a></div>${mode === "exam" ? `<span class="timer" aria-live="off">0:00</span>` : ""}<div class="toc">${ex.sections.map((s, i) => `<a href="#/exam/${id}/${mode}" data-sec="${i}">${(s.title.split("·")[1]||s.title).replace("Interpreting R output","R output").trim()}</a>`).join("")}</div></div>
  <div class="exam-body"></div>${mode === "exam" ? `<div class="submitbar"><button class="btn big" data-submit>Submit and grade</button></div>` : ""}`;
  const body = $(".exam-body"); const cards = [];
  ex.sections.forEach((sec, i) => { const s = document.createElement("section"); s.className = "exam-sec"; s.id = "sec-" + i; s.innerHTML = `<h2>${sec.title}</h2>${sec.intro || ""}`; sec.questions.forEach(q => { const c = renderQ(q, { mode }); cards.push(c); s.appendChild(c); }); body.appendChild(s); });
  view().querySelectorAll("[data-sec]").forEach(a => a.onclick = e => { e.preventDefault(); $("#sec-" + a.dataset.sec).scrollIntoView({ behavior: "smooth" }); });
  if (mode === "exam") {
    const t0 = Date.now(); timerId = setInterval(() => { const s = Math.floor((Date.now() - t0) / 1000); const t = $(".timer"); if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; }, 1000);
    $("[data-submit]").onclick = () => {
      stopTimer(); let pts = 0, n = 0; cards.forEach(c => { const r = c.grade(); if (r !== null) { pts += r; n++; } });
      const essays = cards.length - n;
      $(".submitbar").innerHTML = `<div class="scorecard"><span class="t-v">${pts}/${n}</span><p>auto-graded questions correct (${Math.round(pts / n * 100)}%). ${essays} written answers now show model answers and rubrics; tick the boxes to self-score them.</p></div>`;
      body.scrollIntoView({ behavior: "smooth" });
    };
  }
});

/* ----- mixed practice (interleaving) ----- */
route(/^\/mix(\?weak)?$/, (weak) => {
  let pool = Object.values(ALLQ).filter(q => q.type !== "short");
  if (weak) { const m = mastery().filter(x => x.pct !== null).sort((a, b) => a.pct - b.pct).slice(0, 4).map(x => x.t); const wp = pool.filter(q => q.tags.some(t => m.includes(t))); if (wp.length >= 5) pool = wp; }
  const unseen = pool.filter(q => !S.q[q.id]), missed = pool.filter(q => S.q[q.id] && S.q[q.id].score < 1), rest = pool.filter(q => S.q[q.id]?.score === 1);
  const shuffle = a => a.sort(() => Math.random() - 0.5);
  const pick = [...shuffle(missed).slice(0, 4), ...shuffle(unseen), ...shuffle(rest)].slice(0, 9);
  const essays = Object.values(ALLQ).filter(q => q.type === "short"); const essay = shuffle(essays.filter(q => !(S.q[q.id]?.score >= 0.8)))[0] || shuffle(essays)[0];
  view().innerHTML = `<h1>${weak ? "Weak-spot practice" : "Mixed quiz"}</h1><p class="lede">Nine quick questions shuffled across every exam, plus one written answer. Mixing topics feels harder than doing one at a time, and that difficulty is what makes it stick.</p><div class="qs"></div><div class="row"><a class="btn big" href="#/mix${weak ? "?weak" : ""}" data-again>New set</a></div>`;
  const qs = $(".qs"); shuffle(pick).forEach((q, i) => { const ex = EXAMS.find(e => e.id === q.exam); const c = renderQ(q); c.insertAdjacentHTML("afterbegin", `<div class="src">From ${ex.title}</div>`); qs.appendChild(c); });
  const c = renderQ(essay); c.insertAdjacentHTML("afterbegin", `<div class="src">Written answer · ${EXAMS.find(e => e.id === essay.exam).title}</div>`); qs.appendChild(c);
  $("[data-again]").onclick = e => { e.preventDefault(); go(); };
});

/* ----- cheat sheet ----- */
route(/^\/sheet$/, () => {
  view().innerHTML = `<h1>One-page cheat sheet</h1><p class="lede">Everything you'd want on an index card. Use your browser's Print to save it as a PDF.</p>
  <div class="sheet">
  <div><h3>Pick the test</h3><p>Continuous Y: 2 groups → t-test · 3+ → one-way ANOVA · 2 factors → two-way · same people 3+ times → RM ANOVA · 1 continuous X → SLR/correlation · several X → MLR.<br>Binary Y → logistic. Two categorical → chi-square.<br>Skewed → median · symmetric → mean · spread → SD.</p></div>
  <div><h3>Linear regression</h3><p>Ŷ = b₀ + b₁X₁ + … · b₀ = Y when X's = 0 · b₁ = change in Y per 1 unit X, holding others constant.<br>F: better than intercept-only? R²: % variance explained. t = b/SE.</p></div>
  <div><h3>MLR assumptions: CINLHR + M</h3><p>Continuous outcome · Independent obs · Normal variables · Linearity · Homoscedasticity · Residuals independent & normal · no perfect Multicollinearity (VIF).</p></div>
  <div><h3>Outliers & influence</h3><p>Std. residual |z| &gt; 1.96 · Leverage &gt; 2k/n (k = predictors + 1) · Cook's D &gt; 4/n. Check data errors first; report what you kept.</p></div>
  <div><h3>Logistic regression</h3><p>ln[p/(1−p)] = b₀ + b₁X · P(Y) = 1/(1+e<sup>−(b₀+b₁X₁+…)</sup>) · β = Δ log-odds · OR = e<sup>β</sup> · z instead of t · MLE not OLS · glm(family = binomial).</p></div>
  <div><h3>Odds ratios</h3><p>OR &gt; 1: (OR−1)×100% higher odds · OR &lt; 1: (1−OR)×100% lower odds · OR = 1 none · significant if CI excludes 1 · say "odds", never "likely".</p></div>
  <div><h3>Logistic assumptions</h3><p>Binary outcome · independence · linearity of the logit · no multicollinearity · no complete separation · ~10 events per predictor.</p></div>
  <div><h3>ANOVA</h3><p>H₀: all means equal · F = between ÷ within · equal variances (Levene) · omnibus → post-hoc (Tukey, Bonferroni) · two-way adds interaction · RM needs sphericity.</p></div>
  <div><h3>Assumption test rules</h3><p>Breusch-Pagan p &lt; .05 → variance NOT constant · Durbin-Watson p &lt; .05 → residuals NOT independent · VIF &gt; 5 or r &gt; .7 → multicollinearity · independence: judge the design · skewed → log / sqrt / cube root / inverse.</p></div>
  <div><h3>Simple tests</h3><p>2 groups → t-test (Mann-Whitney) · same people twice → paired t · vs known value → one-sample t · Pearson r (Spearman) · r ±.1/.3/.6 = small/medium/large · CI for a slope includes 0 → not significant.</p></div>
  <div><h3>Write-up order</h3><p>F(df1, df2) = __, p · adj R² as % · each β: value, direction, p, CI · assumptions met/failed · outliers found & decision · limitation.</p></div>
  </div><p class="small">To print, use your browser's Print command (Ctrl/Cmd + P) on the published GitHub site. For every term, see <a href="#/define">Definitions</a>; for the sentences, <a href="#/templates">Answer templates</a>.</p>`;
});

/* ----- about the method ----- */
route(/^\/how$/, () => {
  view().innerHTML = `<h1>How this site helps you learn</h1><p class="lede">Each feature is built on a study technique with strong evidence behind it.</p>
  <table class="tbl"><tr><th>Technique</th><th>What it means</th><th>Where it lives here</th></tr>
  <tr><td>Retrieval practice</td><td>Pulling answers out of memory strengthens them more than rereading.</td><td>Every lesson ends with real exam questions; essays ask you to write first.</td></tr>
  <tr><td>Spaced repetition</td><td>Reviewing just before you forget, at growing intervals.</td><td>Flashcard boxes: 1, 3, 7, 14, 30 days.</td></tr>
  <tr><td>Interleaving</td><td>Mixing problem types trains you to recognize which tool fits.</td><td>Mixed quiz, test picker drill.</td></tr>
  <tr><td>Worked examples</td><td>Seeing every step before solving on your own.</td><td>"Step by step" panels on every question.</td></tr>
  <tr><td>Dual coding</td><td>Pairing words with visuals.</td><td>Interactive figures in each lesson.</td></tr>
  <tr><td>Self-explanation</td><td>Explaining why, in your own words.</td><td>"Explain it back" boxes.</td></tr>
  <tr><td>Concrete steps</td><td>Breaking a skill into small, ordered actions you can tick off.</td><td>Step-by-step guides with checklists.</td></tr>
  <tr><td>Sentence frames</td><td>Memorized structures free up attention for the content.</td><td>Answer templates with recall practice and a template flashcard deck.</td></tr>
  <tr><td>Metacognition</td><td>Knowing what you don't know.</td><td>Confidence ratings, "confident but wrong", mastery chart.</td></tr></table>
  <p class="small">Your progress is saved in this browser only. Clearing site data or switching devices starts fresh.</p>`;
});

document.addEventListener("DOMContentLoaded", () => { go(); });
