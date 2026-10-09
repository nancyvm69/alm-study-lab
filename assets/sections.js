/* Home (Start here), Guides, Templates, Definitions, Search, Flashcard decks. Loaded after app.js. */
S.path = S.path || {}; S.guides = S.guides || {}; S.tpl = S.tpl || {};
const slug = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const blanks = s => esc(s).replace(/\{\{(.+?)\}\}/g, '<span class="tok">$1</span>');
const plainTpl = s => s.replace(/\{\{(.+?)\}\}/g, "[$1]");
function copyBtn(text) { const b = document.createElement("button"); b.className = "copy"; b.type = "button"; b.textContent = "Copy"; b.onclick = (e) => { e.stopPropagation(); const done = () => { b.textContent = "Copied"; setTimeout(() => b.textContent = "Copy", 1500); }; try { navigator.clipboard.writeText(text).then(done, () => { b.textContent = "Select the text to copy"; }); } catch (err) { b.textContent = "Select the text to copy"; } }; return b; }

/* ---------- related links under answers ---------- */
const TAG_GUIDE = { "interpret": "mlr-report", "mlr": "mlr-report", "slr": "slr", "odds-ratio": "or", "ci": "or", "logistic": "logistic", "assumptions-mlr": "assume", "normality": "assume", "multicollinearity": "assume", "diagnostics": "outliers", "choose-test": "choose", "anova": "anova", "posthoc": "anova", "omnibus": "anova", "rm-anova": "anova", "study-design": "design", "public-health": "essay", "data": "dummy", "writing": "mlr-report", "r2": "slr", "fit": "slr", "hypothesis": "approach", "assumptions-logistic": "logistic", "separation": "logistic" };
const TAG_TPL = { "interpret": "linear", "mlr": "linear", "slr": "linear", "r2": "linear", "fit": "linear", "significance": "linear", "odds-ratio": "logistic", "logistic": "logistic", "hypothesis": "hyp", "assumptions-mlr": "checks", "diagnostics": "checks", "multicollinearity": "checks", "anova": "groups", "chisq": "groups", "posthoc": "concept", "omnibus": "concept", "study-design": "concept", "public-health": "concept", "choose-test": "concept", "confounding": "logistic" };
function deeper(q) {
  const g = [...new Set(q.tags.map(t => TAG_GUIDE[t]).filter(Boolean))].slice(0, 2).map(id => GUIDES.find(x => x.id === id)).filter(Boolean);
  const t = [...new Set(q.tags.map(t => TAG_TPL[t]).filter(Boolean))].slice(0, 1);
  if (!g.length && !t.length) return "";
  return `<p class="deeper">Go deeper: ${g.map(x => `<a href="#/guides/${x.id}">${x.title}</a>`).join(" · ")}${t.length ? `${g.length ? " · " : ""}<a href="#/templates/${t[0]}">Sentence templates: ${TPL_GROUPS.find(x => x[0] === t[0])[1]}</a>` : ""}</p>`;
}

/* ---------- course map (a typical semester sequence) ---------- */
const COURSE = [
  ["2026-08-26", "Intro to R, biostats review", [["Lesson", "#/learn/biostats"], ["Practice", "#/exam/wk1/study"]]],
  ["2026-09-02", "Simple linear regression", [["Lesson", "#/learn/slr"], ["Guide", "#/guides/slr"]]],
  ["2026-09-09", "Simple linear regression in R", [["Practice", "#/exam/wk25/study"]]],
  ["2026-09-16", "Multiple regression", [["Lesson", "#/learn/variables"], ["Guide", "#/guides/dummy"]]],
  ["2026-09-23", "Multiple regression: assumptions", [["Guide", "#/guides/assume"], ["Lesson", "#/learn/mlr"]]],
  ["2026-09-30", "Multiple regression: outliers, reporting", [["Guide", "#/guides/outliers"], ["Walkthrough", "#/exam/hw2/study"]]],
  ["2026-10-07", "Logistic regression", [["Lesson", "#/learn/logistic"], ["Activity", "#/exam/wk7/study"]]],
  ["2026-10-14", "Logistic regression", [["Guide", "#/guides/logistic"], ["Odds ratios", "#/guides/or"]]],
  ["2026-10-21", "Logistic regression", [["Study design", "#/guides/design"]]],
  ["2026-10-28", "One-way ANOVA", [["Lesson", "#/learn/anova"]]],
  ["2026-11-04", "Two-way ANOVA", [["Guide", "#/guides/anova"]]],
  ["2026-11-11", "Repeated measures design", [["Definitions", "#/define/anova"]]],
  ["2026-11-18", "Final exam review", [["Practice exam A", "#/exam/midway/study"], ["Practice exam B", "#/exam/final/study"]]],
  ["2026-12-02", "Final exam", [["Practice exam B, timed", "#/exam/final/exam"]]],
  ["2026-12-09", "Final project due", [["Study design", "#/guides/design"]]]
];

/* ---------- study paths ---------- */
const PATHS = {
  learn: { name: "Learning it the first time", sub: "One topic per sitting, in course order. Repeat this loop for each topic.", steps: [
    ["Read 'ALM in plain language' below", "#/"], ["Do the lesson for this week's topic, playing with its figure", "#/learn"], ["Answer the lesson's check questions before rereading", "#/learn"],
    ["Follow the matching step-by-step guide", "#/guides"], ["Practice saying that topic's answer templates in recall mode", "#/templates"], ["Do the matching practice set in study mode", "#/exams"],
    ["Review due flashcards (5 minutes, daily)", "#/cards"], ["Look up any unfamiliar word in Definitions", "#/define"]] },
  week: { name: "Exam in a week", sub: "One block per day. Mixing topics is part of the plan.", steps: [
    ["Day 1: Test picker drill ×2 and the 'choose the right test' guide", "#/labs/drill"], ["Day 2: Linear regression: guides for assumptions, outliers and reporting; Weeks 2–5 practice", "#/guides/assume"],
    ["Day 3: Logistic regression: lesson, odds ratio guide, logistic templates in recall mode", "#/learn/logistic"], ["Day 4: ANOVA, chi-square and the biostatistics basics set; definitions flashcards", "#/learn/anova"],
    ["Day 5: Practice exam A in exam mode (timed)", "#/exam/midway/exam"], ["Day 6: Weak-spot quiz and every template in recall mode", "#/mix?weak"],
    ["Day 7: Practice exam B in exam mode, then review every missed question's step-by-step", "#/exam/final/exam"]] },
  night: { name: "The night before", sub: "Light review only. Sleep matters more than one more hour.", steps: [
    ["Read the one-page cheat sheet once", "#/sheet"], ["Templates in recall mode: linear and logistic only", "#/templates/linear"], ["One round of the test picker drill", "#/labs/drill"],
    ["Clear today's due flashcards", "#/cards"], ["One mixed quiz, then stop", "#/mix"]] }
};

/* ---------- home ---------- */
function renderHome() {
  const total = Object.keys(ALLQ).length, done = Object.values(S.q).filter(s => s.score !== undefined).length;
  const m = mastery().filter(x => x.pct !== null); const weak = [...m].filter(x => x.done >= 1).sort((a, b) => a.pct - b.pct).slice(0, 3);
  const calib = Object.values(S.q).filter(s => s.conf === 3 && s.ok === false).length;
  const now = today(); let cur = -1; COURSE.forEach((c, i) => { if (c[0] <= now) cur = i; });
  const pk = S.pathChoice || "learn";
  view().innerHTML = `
  <section class="hero">
    <div class="hero-text"><h1>Applied Linear Modeling, one line at a time</h1>
    <p class="lede">Plain-language lessons, step-by-step guides, ready-made answer sentences, and every practice exam with worked solutions.</p>
    <div class="row"><a class="btn big" href="#/" data-jump="alm">Start here</a><a class="btn ghost big" href="#/" data-jump="path">Pick a study path</a></div></div>
    <div class="hero-viz" aria-hidden="true"><svg id="hero-svg" viewBox="0 0 420 300"></svg><div class="hero-eq" id="hero-eq">Ŷ = b₀ + b₁X</div></div>
  </section>

  <section class="panel" id="alm"><h2>ALM in plain language</h2>
   <div class="wwh">
    <div><h3>What it is</h3><p>Applied Linear Modeling is a family of methods that describe <b>how an outcome changes when other things change</b>. They all start from the equation of a line: a starting point plus a slope for each predictor.</p><p class="eq">Outcome = b₀ + b₁X₁ + b₂X₂ + …</p><p>Change the <b>type of outcome</b> and you move to a different member of the family.</p></div>
    <div><h3>Why public health uses it</h3><ul class="why">
      <li><b>Explain:</b> which factors go with an outcome (sodium and blood pressure).</li>
      <li><b>Adjust:</b> separate one factor's effect from confounders (BMI's link to diabetes, holding age constant).</li>
      <li><b>Predict:</b> estimate an outcome or risk for a person or county.</li>
      <li><b>Test:</b> whether a program or exposure makes a real difference.</li>
      <li><b>Inform:</b> give evidence for policy and practice.</li></ul></div>
   </div>
   <h3>The family at a glance</h3>
   <div class="family">
    <div class="fam-root"><b>One idea</b><span>a starting point + a slope for each predictor</span></div>
    <div class="fam-kids">
     <a class="fam" href="#/learn/mlr" style="--fc:var(--c4)"><span class="fk">Continuous outcome</span><b>Linear regression</b><span>lm(). Y changes by b per unit of X.</span></a>
     <a class="fam" href="#/learn/logistic" style="--fc:var(--c5)"><span class="fk">Yes/no outcome</span><b>Logistic regression</b><span>glm(binomial). Log-odds change by b; e<sup>b</sup> = odds ratio.</span></a>
     <a class="fam" href="#/learn/anova" style="--fc:var(--c6)"><span class="fk">Comparing group means</span><b>t-test / ANOVA</b><span>Regression with group predictors. F = between ÷ within.</span></a>
     <a class="fam" href="#/define/anova" style="--fc:var(--c3)"><span class="fk">Same people over time</span><b>Repeated measures</b><span>Accounts for related measurements.</span></a>
     <a class="fam" href="#/define/logistic" style="--fc:var(--c1)"><span class="fk">Count outcome</span><b>Poisson</b><span>Skewed counts like ER visits.</span></a>
    </div></div>
   <h3>How to approach any problem</h3>
   <ol class="approach">
    <li><b>Question</b><span>Say it in one sentence: does X predict Y among whom?</span></li>
    <li><b>Outcome</b><span>Continuous, yes/no, or group means? This picks the model.</span></li>
    <li><b>Model</b><span>Match it with the test chooser. Know why.</span></li>
    <li><b>Check</b><span>Assumptions first, then outliers.</span></li>
    <li><b>Explain</b><span>Use the answer templates to put every number into plain words.</span></li>
   </ol>
   <p><a href="#/guides/approach">Full step-by-step guide: approaching any ALM question</a></p>
  </section>

  <section class="panel" id="path"><h2>Your best path</h2>
   <div class="seg" role="tablist">${Object.entries(PATHS).map(([k, p]) => `<button role="tab" aria-selected="${k === pk}" class="${k === pk ? "on" : ""}" data-path="${k}">${p.name}</button>`).join("")}</div>
   <div class="pathbox"></div></section>

  <section class="panel"><h2>Course map</h2><p class="small">A typical semester sequence. This week is highlighted.</p>
   <ol class="cmap">${COURSE.map((c, i) => { const d = new Date(c[0] + "T12:00:00"); return `<li class="${i === cur ? "now" : i < cur ? "past" : ""}"><span class="cd">${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span><span class="ct">${c[1]}${i === cur ? ' <em class="badge mid">this week</em>' : ""}</span><span class="cl">${c[2].map(l => `<a href="${l[1]}">${l[0]}</a>`).join("")}</span></li>`; }).join("")}</ol></section>

  <section class="dash">
    <div class="tile"><span class="t-k">Questions attempted</span><span class="t-v">${done}<small>/${total}</small></span><div class="meter"><div style="width:${done / total * 100}%"></div></div></div>
    <div class="tile"><span class="t-k">Flashcards due</span><span class="t-v">${dueIn("key").length + dueIn("def").length + dueIn("tpl").length}</span><a href="#/cards">Review now</a></div>
    <div class="tile"><span class="t-k">Study streak</span><span class="t-v">${streak()}<small> day${streak() === 1 ? "" : "s"}</small></span><span class="small">Short daily sessions beat one long cram.</span></div>
    <div class="tile"><span class="t-k">Confident but wrong</span><span class="t-v">${calib}</span><span class="small">Rate your confidence before checking. These are your blind spots.</span></div>
  </section>
  <section class="panel"><h2>Where you stand</h2>${m.length ? masteryChart(m) : `<p>Answer a few questions and a topic-by-topic mastery chart appears here.</p>`}
  ${weak.length ? `<p class="next">Focus next on <b>${weak.map(w => w.label).join("</b>, <b>")}</b>. <a href="#/mix?weak">Practice your weakest topics</a></p>` : ""}</section>
  <p class="small integrity">All practice questions here are original. Model answers are for checking understanding; write graded work in your own words.</p>`;
  heroAnim();
  view().querySelectorAll("[data-jump]").forEach(a => a.onclick = e => { e.preventDefault(); document.getElementById(a.dataset.jump).scrollIntoView({ behavior: "smooth" }); });
  const drawPath = (k) => {
    const p = PATHS[k]; const st = S.path[k] || []; const n = st.filter(Boolean).length;
    $(".pathbox").innerHTML = `<p>${p.sub}</p><div class="meter"><div style="width:${n / p.steps.length * 100}%"></div></div><p class="small">${n} of ${p.steps.length} done</p>
    <ol class="checklist">${p.steps.map((s, i) => `<li><label><input type="checkbox" data-i="${i}" ${st[i] ? "checked" : ""}><span>${s[0]}</span></label><a href="${s[1]}">Go</a></li>`).join("")}</ol>
    <button class="btn ghost" data-clear>Clear checks</button>`;
    $(".pathbox").querySelectorAll("[data-i]").forEach(c => c.onchange = () => { S.path[k] = S.path[k] || []; S.path[k][+c.dataset.i] = c.checked; save(); drawPath(k); });
    $("[data-clear]").onclick = () => { S.path[k] = []; save(); drawPath(k); };
  };
  view().querySelectorAll("[data-path]").forEach(b => b.onclick = () => { S.pathChoice = b.dataset.path; save(); view().querySelectorAll("[data-path]").forEach(x => { x.classList.toggle("on", x === b); x.setAttribute("aria-selected", x === b); }); drawPath(b.dataset.path); });
  drawPath(pk);
}

/* ---------- guides ---------- */
route(/^\/guides$/, () => {
  const groups = [...new Set(GUIDES.map(g => g.group))];
  view().innerHTML = `<h1>Step-by-step guides</h1><p class="lede">Plain-language instructions for each task in the course. Each guide says when to use it, why it works, then walks you through it one step at a time, with the R code and the sentences to write.</p>
  ${groups.map(gr => `<h2>${gr}</h2><div class="guide-list">${GUIDES.filter(g => g.group === gr).map(g => { const st = S.guides[g.id] || []; const n = st.filter(Boolean).length; return `<a class="guide-card" href="#/guides/${g.id}"><h3>${g.title}</h3><p>${g.when}</p><span class="small">${g.steps.length} steps · ${g.mins} min${n ? ` · ${n}/${g.steps.length} done` : ""}</span></a>`; }).join("")}</div>`).join("")}`;
});
route(/^\/guides\/([\w-]+)$/, (id) => {
  const i = GUIDES.findIndex(g => g.id === id); const g = GUIDES[i]; if (!g) { location.hash = "#/"; return; }
  const nx = GUIDES[i + 1], pv = GUIDES[i - 1]; const st = S.guides[id] || [];
  view().innerHTML = `<nav class="crumb"><a href="#/guides">Guides</a> / ${g.group}</nav><h1>${g.title}</h1>
  <div class="two"><div class="callout"><h4>Use this when</h4><p>${g.when}</p></div><div class="callout ok"><h4>Why it works</h4><p>${g.logic}</p></div></div>
  ${g.visual ? `<div class="gvis">${g.visual}</div>` : ""}${g.widget ? `<div data-widget="${g.widget}"></div>` : ""}
  <h2>Steps</h2><div class="meter gmeter"><div></div></div><p class="small gcount"></p>
  <ol class="gsteps">${g.steps.map((s, k) => `<li class="${st[k] ? "done" : ""}"><div class="gs-head"><span class="gs-n">${k + 1}</span><h3>${s[0]}</h3><label class="gs-chk"><input type="checkbox" data-k="${k}" ${st[k] ? "checked" : ""}> Done</label></div><p>${esc(s[1])}</p>${s[2] ? `<div class="codewrap"><pre class="code">${esc(s[2])}</pre></div>` : ""}</li>`).join("")}</ol>
  <h2>What to write</h2><div class="tpl-mini"></div>
  <h2>Common mistakes</h2><ul class="mistakes">${g.mistakes.map(x => `<li>${x}</li>`).join("")}</ul>
  <nav class="pager">${pv ? `<a href="#/guides/${pv.id}">Previous: ${pv.title}</a>` : "<span></span>"}${nx ? `<a href="#/guides/${nx.id}">Next: ${nx.title}</a>` : `<a href="#/templates">On to the answer templates</a>`}</nav>`;
  view().querySelectorAll(".codewrap").forEach((w, k) => w.appendChild(copyBtn(w.textContent)));
  const upd = () => { const s = S.guides[id] || []; const n = s.filter(Boolean).length; $(".gmeter div").style.width = n / g.steps.length * 100 + "%"; $(".gcount").textContent = n === g.steps.length ? "All steps done." : `${n} of ${g.steps.length} steps done`; };
  view().querySelectorAll("[data-k]").forEach(c => c.onchange = () => { S.guides[id] = S.guides[id] || []; S.guides[id][+c.dataset.k] = c.checked; c.closest("li").classList.toggle("done", c.checked); save(); upd(); });
  upd();
  const box = $(".tpl-mini"); g.write.forEach(tid => { const t = TEMPLATES.find(x => x.id === tid); if (t) box.appendChild(tplCard(t, false, true)); });
  touchDay();
});

/* ---------- templates ---------- */
function tplCard(t, recall, compact) {
  const el = document.createElement("article"); el.className = "tpl" + (compact ? " compact" : ""); el.id = "tpl-" + t.id;
  const mastered = S.tpl[t.id]?.ok;
  el.innerHTML = `<header><h3>${t.name}</h3>${mastered ? `<span class="badge ok">can recall</span>` : ""}</header>
   <p class="cue"><span>When you see</span>${esc(t.cue)}</p>
   <div class="tbody">${recall ? `<textarea rows="3" placeholder="Say it or type it from memory, then reveal." aria-label="Your sentence"></textarea><button class="btn" data-rev>Reveal the template</button>` : ""}
   <div class="tsent" ${recall ? "hidden" : ""}><div class="ttext">${blanks(t.t)}</div>
   <div class="tex"><span class="small">${t.ill ? "Example (illustrative numbers)" : "Example from the course"}</span><p>${esc(t.ex)}</p></div>
   ${t.tips.length ? `<ul class="ttips">${t.tips.map(x => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
   ${recall ? `<div class="row"><span class="small">Did you get it?</span><button class="btn ghost" data-ok="0">Not yet</button><button class="btn" data-ok="1">Got it</button></div>` : ""}</div></div>`;
  const tt = $(".ttext", el); tt.appendChild(copyBtn(plainTpl(t.t)));
  const rv = $("[data-rev]", el); if (rv) rv.onclick = () => { $(".tsent", el).hidden = false; rv.hidden = true; };
  el.querySelectorAll("[data-ok]").forEach(b => b.onclick = () => { S.tpl[t.id] = { ok: b.dataset.ok === "1", ts: Date.now() }; touchDay(); save(); el.querySelector("header").innerHTML = `<h3>${t.name}</h3>${S.tpl[t.id].ok ? `<span class="badge ok">can recall</span>` : `<span class="badge no">practice again</span>`}`; });
  return el;
}
const FINDER = {
  model: [["linear", "Linear regression (lm)"], ["logistic", "Logistic regression (glm)"], ["groups", "t-test / ANOVA / chi-square"], ["any", "Not about one model"]],
  ask: { linear: [["coef", "Interpret a coefficient"], ["int", "The intercept"], ["f", "Is the model significant? (F)"], ["r2", "Model fit (R²)"], ["sig", "Which predictors are significant?"], ["pred", "A predicted value"], ["strong", "Strongest predictor"], ["hyp", "Hypotheses"], ["assume", "Assumptions"], ["out", "Outliers"], ["write", "Full write-up"]],
    logistic: [["coef", "Interpret an odds ratio"], ["beta", "What β means"], ["get", "How to get ORs"], ["prob", "A predicted probability"], ["adj", "\"Adjusted for…\""], ["hyp", "Hypotheses"], ["range", "OR < 1, = 1, > 1"]],
    groups: [["t", "t-test result"], ["anova", "ANOVA result"], ["two", "Interaction"], ["chi", "Chi-square result"], ["hyp", "Hypotheses"], ["post", "Post-hoc tests"]],
    any: [["choose", "Which test and why"], ["mc", "Multicollinearity"], ["omni", "Omnibus test"], ["ph", "Public health implications"], ["design", "Design a study"]] },
  xtype: [["c", "Continuous number"], ["g", "Group / yes-no"], ["ns", "It's not significant"]]
};
function findTpl(m, a, x) {
  const L = { coef: x === "ns" ? "t-ns" : x === "g" ? "t-slope-g" : "t-slope-c", int: "t-int", f: "t-f", r2: "t-r2", sig: "t-sig", pred: "t-pred", strong: "t-strong", hyp: "t-h-reg", assume: "t-assume", out: "t-outliers", write: "t-writeup" };
  const G = { coef: x === "ns" ? "t-or-ns" : x === "g" ? "t-or-g" : "t-or-c", beta: "t-beta", get: "t-or-get", prob: "t-prob", adj: "t-adj", hyp: "t-h-log", range: "t-orrange" };
  const P = { t: "t-ttest", anova: "t-anova", two: "t-2way", chi: "t-chi", hyp: "t-h-anova", post: "t-posthoc" };
  const A = { choose: "t-choose", mc: "t-mc", omni: "t-omni", ph: "t-ph", design: "t-design" };
  return ({ linear: L, logistic: G, groups: P, any: A })[m][a];
}
route(/^\/templates(?:\/(\w+))?$/, (grp) => {
  const recall = !!S.tplRecall; const g = grp || "all";
  const nOk = Object.values(S.tpl).filter(x => x.ok).length;
  view().innerHTML = `<h1>Answer templates</h1><p class="lede">Ready-made sentences for each type of question. Learn which words in a question point to which sentence, then practice saying it from memory until it's automatic.</p>
  <div class="finder panel"><h2>Which sentence do I need?</h2><div class="form">
   <label>The question is about <select id="fd-m">${FINDER.model.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></label>
   <label>It asks for <select id="fd-a"></select></label>
   <label id="fd-xl">The predictor is <select id="fd-x">${FINDER.xtype.map(o => `<option value="${o[0]}">${o[1]}</option>`).join("")}</select></label></div><div class="fd-out"></div></div>
  <div class="tpl-bar"><div class="chips-row">${[["all", "All"], ...TPL_GROUPS].map(([k, v]) => `<a class="chip ${g === k ? "on" : ""}" href="#/templates${k === "all" ? "" : "/" + k}">${v}</a>`).join("")}</div>
   <div class="seg"><button data-mode="0" class="${recall ? "" : "on"}">Read</button><button data-mode="1" class="${recall ? "on" : ""}">Recall practice</button></div></div>
  <p class="small">${recall ? "Recall mode: read the cue, say or type the sentence, then reveal and mark yourself." : "Blanks are highlighted. Copy puts the template on your clipboard with [brackets] for the blanks."} You can recall ${nOk} of ${TEMPLATES.length}.</p>
  <div class="tpl-list"></div>`;
  const list = $(".tpl-list");
  TPL_GROUPS.filter(([k]) => g === "all" || g === k).forEach(([k, v]) => { const h = document.createElement("h2"); h.textContent = v; list.appendChild(h); TEMPLATES.filter(t => t.g === k).forEach(t => list.appendChild(tplCard(t, recall))); });
  view().querySelectorAll("[data-mode]").forEach(b => b.onclick = () => { S.tplRecall = b.dataset.mode === "1"; save(); go(); });
  const fm = $("#fd-m"), fa = $("#fd-a"), fx = $("#fd-x");
  const fill = () => { fa.innerHTML = FINDER.ask[fm.value].map(o => `<option value="${o[0]}">${o[1]}</option>`).join(""); };
  const show = () => {
    $("#fd-xl").hidden = !(fa.value === "coef");
    const id = findTpl(fm.value, fa.value, fx.value); const t = TEMPLATES.find(x => x.id === id);
    $(".fd-out").innerHTML = ""; if (t) { $(".fd-out").appendChild(tplCard(t, false, true)); }
  };
  fm.onchange = () => { fill(); show(); }; fa.onchange = show; fx.onchange = show; fill(); show();
});

/* ---------- definitions ---------- */
route(/^\/define(?:\/([\w-]+))?$/, (target) => {
  const gset = new Set(GLOSS_GROUPS.map(x => x[0])); const grp = target && gset.has(target) ? target : null; const term = target && !grp ? target : null;
  view().innerHTML = `<h1>Definitions</h1><p class="lede">${GLOSSARY.length} terms in plain language, grouped the way the course builds them. Type to filter, or study them as flashcards.</p>
  <div class="def-bar"><input id="df-q" type="search" placeholder="Filter terms, e.g. leverage, odds, VIF" aria-label="Filter definitions"><a class="btn ghost" href="#/cards/def">Study as flashcards</a></div>
  <div class="chips-row">${[["all", "All"], ...GLOSS_GROUPS].map(([k, v]) => `<button class="chip ${(grp || "all") === k ? "on" : ""}" data-g="${k}">${v}</button>`).join("")}</div>
  <div class="defs"></div>`;
  let cg = grp || "all";
  const draw = () => {
    const q = norm($("#df-q").value);
    const box = $(".defs"); box.innerHTML = "";
    GLOSS_GROUPS.filter(([k]) => cg === "all" || k === cg).forEach(([k, v]) => {
      const items = GLOSSARY.filter(d => d[1] === k && (!q || norm(d[0] + " " + d[2] + " " + d[3]).includes(q)));
      if (!items.length) return;
      box.insertAdjacentHTML("beforeend", `<h2>${v}</h2><dl class="dlist">${items.map(d => `<div class="dterm" id="d-${slug(d[0])}"><dt>${esc(d[0])}</dt><dd>${esc(d[2])}${d[3] ? `<span class="dex">${esc(d[3])}</span>` : ""}${d[4] && d[4].length ? `<span class="drel">See also: ${d[4].map(r => `<a href="#/define/${slug(r)}">${esc(r)}</a>`).join(", ")}</span>` : ""}</dd></div>`).join("")}</dl>`);
    });
    if (!box.children.length) box.innerHTML = `<p>No terms match "${esc($("#df-q").value)}". Try a shorter word, or <a href="#/search/${encodeURIComponent($("#df-q").value)}">search the whole site</a>.</p>`;
  };
  $("#df-q").oninput = draw;
  view().querySelectorAll("[data-g]").forEach(b => b.onclick = () => { cg = b.dataset.g; view().querySelectorAll("[data-g]").forEach(x => x.classList.toggle("on", x === b)); draw(); });
  draw();
  if (term) { const best = GLOSSARY.find(d => slug(d[0]) === term) || GLOSSARY.find(d => slug(d[0]).startsWith(term)); if (best) { const el = document.getElementById("d-" + slug(best[0])); if (el) { el.classList.add("hl"); setTimeout(() => el.scrollIntoView({ block: "center" }), 50); } } }
});

/* ---------- search ---------- */
let SEARCH_IDX = null;
function buildIndex() {
  const strip = s => String(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
  const I = [];
  GLOSSARY.forEach(d => I.push({ type: "Definition", title: d[0], text: d[2] + " " + d[3], href: "#/define/" + slug(d[0]) }));
  GUIDES.forEach(g => { I.push({ type: "Guide", title: g.title, text: g.when + " " + g.logic + " " + g.steps.map(s => s.join(" ")).join(" "), href: "#/guides/" + g.id }); });
  TEMPLATES.forEach(t => I.push({ type: "Template", title: t.name, text: t.cue + " " + t.t + " " + t.ex, href: "#/templates/" + t.g }));
  LESSONS.forEach(l => I.push({ type: "Lesson", title: l.title, text: l.hook + " " + strip(l.body), href: "#/learn/" + l.id }));
  Object.values(ALLQ).forEach(q => { const ex = EXAMS.find(e => e.id === q.exam); I.push({ type: "Question", title: `${ex.title}, Q${q.num}`, text: strip(q.prompt) + " " + strip(q.model || "") + " " + strip(q.explain || ""), href: `#/exam/${q.exam}/study`, qid: q.id }); });
  CARDS.forEach(c => I.push({ type: "Flashcard", title: c[0], text: c[1], href: "#/cards/key" }));
  return I;
}
route(/^\/search\/?(.*)$/, (raw) => {
  const q = decodeURIComponent(raw || ""); const box = $("#site-search"); if (box && box.value !== q) box.value = q;
  SEARCH_IDX = SEARCH_IDX || buildIndex();
  const words = norm(q).split(" ").filter(w => w.length > 1);
  view().innerHTML = `<h1>Search</h1>`;
  if (!words.length) { view().insertAdjacentHTML("beforeend", `<p class="lede">Type in the search box to look across definitions, guides, templates, lessons, flashcards and every exam question.</p>`); return; }
  const scored = SEARCH_IDX.map(it => { const t = norm(it.title), x = norm(it.text); let s = 0; for (const w of words) { if (t.includes(w)) s += 5; else if (x.includes(w)) s += 1; else return null; } if (t === norm(q)) s += 10; return { ...it, s }; }).filter(Boolean).sort((a, b) => b.s - a.s);
  const order = ["Definition", "Guide", "Template", "Lesson", "Flashcard", "Question"];
  const hl = s => { let o = esc(s); words.forEach(w => { o = o.replace(new RegExp("(" + w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>"); }); return o; };
  const snip = (text) => { const n = norm(text); const i = n.indexOf(words[0]); const st = Math.max(0, i - 60); return (st ? "…" : "") + text.slice(st, st + 180) + "…"; };
  view().insertAdjacentHTML("beforeend", `<p class="lede">${scored.length} result${scored.length === 1 ? "" : "s"} for "${esc(q)}"</p>` + (scored.length ? order.map(type => { const r = scored.filter(x => x.type === type); if (!r.length) return ""; return `<h2>${type}s <span class="small">${r.length}</span></h2><ul class="results">${r.slice(0, 12).map(x => `<li><a href="${x.href}"${x.qid ? ` data-q="${x.qid}"` : ""}>${hl(x.title)}</a><p>${hl(snip(x.text.replace(/<[^>]+>/g, "")))}</p></li>`).join("")}</ul>`; }).join("") : `<p>Nothing matched. Try a single key word, like "residual", "odds" or "dummy".</p>`));
  view().querySelectorAll("[data-q]").forEach(a => a.onclick = () => { setTimeout(() => { const el = document.getElementById("q-" + a.dataset.q); if (el) { el.scrollIntoView({ block: "center" }); el.classList.add("hl"); } }, 120); });
});

/* ---------- flashcards with three decks ---------- */
const DECKS = {
  key: { name: "Key ideas", list: () => CARDS.map(c => [c[0], c[1], TOPICS[c[2]] || ""]) },
  def: { name: "Definitions", list: () => GLOSSARY.map(d => [d[0], d[2] + (d[3] ? `<span class="dex">${esc(d[3])}</span>` : ""), (GLOSS_GROUPS.find(g => g[0] === d[1]) || [])[1]]) },
  tpl: { name: "Answer templates", list: () => TEMPLATES.map(t => [t.cue, blanks(t.t), t.name]) }
};
const cardKey = (deck, i) => deck === "key" ? i : deck + i;
function dueIn(deck) { const now = Date.now(); return DECKS[deck].list().map((_, i) => i).filter(i => { const c = S.cards[cardKey(deck, i)]; return !c || c.due <= now; }); }
route(/^\/cards(?:\/(\w+))?$/, (deckArg) => {
  const deck = DECKS[deckArg] ? deckArg : (S.deck || "key"); S.deck = deck; save();
  const cards = DECKS[deck].list(); let due = dueIn(deck).sort(() => Math.random() - 0.5); let idx = 0, flipped = false, reviewed = 0;
  const counts = [0, 0, 0, 0, 0, 0]; cards.forEach((_, i) => counts[(S.cards[cardKey(deck, i)] || { box: 0 }).box]++);
  view().innerHTML = `<h1>Flashcards</h1><p class="lede">Recall the answer before flipping. "Got it" moves a card to a later box; "Missed it" sends it back to box 1 for tomorrow.</p>
   <div class="seg deckseg">${Object.entries(DECKS).map(([k, d]) => `<a href="#/cards/${k}" class="${k === deck ? "on" : ""}">${d.name} <small>${dueIn(k).length} due</small></a>`).join("")}</div>
   <div class="boxes" aria-label="Cards per box">${counts.map((c, b) => `<div class="box"><div class="bx" style="height:${8 + c / cards.length * 90}px"></div><span>${b === 0 ? "New" : "Box " + b}</span><b>${c}</b><small>${b === 0 ? "" : "every " + BOX_DAYS[b] + "d"}</small></div>`).join("")}</div><div class="cardzone"></div>`;
  const zone = $(".cardzone");
  const show = () => {
    if (idx >= due.length) { zone.innerHTML = `<div class="done"><p><b>${reviewed ? `${reviewed} reviewed.` : "Nothing due in this deck."}</b> Next cards come due tomorrow.</p><button class="btn" data-all>Practice all ${cards.length} anyway</button></div>`; $("[data-all]").onclick = () => { due = cards.map((_, i) => i).sort(() => Math.random() - 0.5); idx = 0; show(); }; return; }
    const c = cards[due[idx]]; flipped = false;
    zone.innerHTML = `<div class="small">${idx + 1} of ${due.length} · ${c[2] || ""}</div><button class="flash ${deck === "tpl" ? "tplcard" : ""}" aria-live="polite"><div class="front">${esc(c[0])}</div><div class="back">${c[1]}</div><span class="hint">Tap or press Space to flip</span></button><div class="row grade" hidden><button class="btn ghost" data-g="0">Missed it</button><button class="btn" data-g="1">Got it</button></div>`;
    const card = $(".flash", zone); const flip = () => { flipped = !flipped; card.classList.toggle("flipped", flipped); $(".grade", zone).hidden = !flipped; };
    card.onclick = flip; zone.querySelectorAll("[data-g]").forEach(b => b.onclick = () => grade(+b.dataset.g));
    document.onkeydown = e => { if (!$(".flash")) { document.onkeydown = null; return; } if (e.target.tagName === "INPUT") return; if (e.key === " ") { e.preventDefault(); flip(); } if (flipped && (e.key === "1" || e.key === "ArrowLeft")) grade(0); if (flipped && (e.key === "2" || e.key === "ArrowRight")) grade(1); };
  };
  const grade = ok => { const k = cardKey(deck, due[idx]); const cur = S.cards[k] || { box: 0 }; const box = ok ? Math.min(5, cur.box + 1) : 1; S.cards[k] = { box, due: Date.now() + BOX_DAYS[box] * 864e5 - 36e5 }; reviewed++; touchDay(); save(); idx++; show(); };
  show();
});
const BOX_DAYS = [0, 1, 3, 7, 14, 30];

/* ---------- sidebar search + theme ---------- */
document.addEventListener("DOMContentLoaded", () => {
  const box = $("#site-search"); let t = null;
  if (box) { box.oninput = () => { clearTimeout(t); t = setTimeout(() => { location.hash = "#/search/" + encodeURIComponent(box.value); }, 250); }; box.onkeydown = e => { if (e.key === "Escape") { box.value = ""; box.blur(); } }; }
  document.addEventListener("keydown", e => { if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); box && box.focus(); } });
});
window.addEventListener("hashchange", () => { const box = document.getElementById("site-search"); if (box && !location.hash.startsWith("#/search") && document.activeElement !== box) box.value = ""; });
