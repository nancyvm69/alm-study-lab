/* "Start from zero": a beginner track. One idea per step, everyday stories, a picture for each, course words last.
   All examples are original. Uses ols(), rng(), randn(), clamp() from labs.js. */

/* ---------- tiny chart kit (SVG strings) ---------- */
function plot(o, inner) {
  const W = o.w || 560, H = o.h || 300, P = { l: 56, r: 18, t: 18, b: 46 };
  const X = v => P.l + (v - o.x[0]) / (o.x[1] - o.x[0]) * (W - P.l - P.r);
  const Y = v => H - P.b - (v - o.y[0]) / (o.y[1] - o.y[0]) * (H - P.t - P.b);
  let s = `<svg viewBox="0 0 ${W} ${H}" class="chart grid-bg" role="img" aria-label="${o.alt || ""}">`;
  (o.yt || []).forEach(v => { s += `<line x1="${X(o.x[0])}" x2="${X(o.x[1])}" y1="${Y(v)}" y2="${Y(v)}" class="gl"/><text x="${P.l - 8}" y="${Y(v) + 4}" class="tick" text-anchor="end">${v}</text>`; });
  (o.xt || []).forEach(v => { const lab = Array.isArray(v) ? v[1] : v, val = Array.isArray(v) ? v[0] : v; s += `<text x="${X(val)}" y="${H - P.b + 18}" class="tick" text-anchor="middle">${lab}</text>`; });
  s += `<line x1="${X(o.x[0])}" x2="${X(o.x[1])}" y1="${Y(o.y[0])}" y2="${Y(o.y[0])}" class="axis"/><line x1="${X(o.x[0])}" x2="${X(o.x[0])}" y1="${Y(o.y[0])}" y2="${Y(o.y[1])}" class="axis"/>`;
  if (o.xl) s += `<text x="${(X(o.x[0]) + X(o.x[1])) / 2}" y="${H - 6}" class="lbl" text-anchor="middle">${o.xl}</text>`;
  if (o.yl) s += `<text x="14" y="${(Y(o.y[0]) + Y(o.y[1])) / 2}" class="lbl" text-anchor="middle" transform="rotate(-90 14 ${(Y(o.y[0]) + Y(o.y[1])) / 2})">${o.yl}</text>`;
  return s + inner(X, Y) + `</svg>`;
}
const dots = (pts, X, Y, cls = "dot", r = 6) => pts.map(p => `<circle cx="${X(p[0])}" cy="${Y(p[1])}" r="${r}" class="${p[2] || cls}"/>`).join("");
const note = (x, y, t, cls = "lbl") => `<text x="${x}" y="${y}" class="${cls}">${t}</text>`;
const COFFEE = [[0, 8.2], [0, 7.7], [1, 7.9], [1, 7.4], [2, 7.6], [2, 7.2], [3, 7.4], [3, 7.0], [4, 6.9], [4, 7.2], [5, 6.8], [5, 6.5]];

/* ---------- the steps ---------- */
const BASICS = [
{ id: "variables", part: "Describing things", title: "What is a variable?", idea: "A variable is anything that can be different from one person to the next.",
  story: `<p>Picture eight friends. Their <b>heights</b> are different. Their <b>eye colors</b> are different. Each of those things is a <b>variable</b>: it <i>varies</i>.</p>
  <p>There are two main kinds:</p>
  <ul><li><b>Number variables</b>: you can measure them on a scale. Height, hours of sleep, blood pressure, age.</li><li><b>Group variables</b>: they sort people into boxes. Eye color, smoker or not, vaccinated or not.</li></ul>
  <p>Why it matters: <b>the kind of variable decides which tool you use later.</b> That's the single most useful habit in this whole course.</p>`,
  chart: () => plot({ x: [150, 190], y: [0, 2], xt: [150, 160, 170, 180, 190], xl: "Height (cm): a number variable", alt: "Eight dots spread along a height scale", h: 170 }, (X, Y) => dots([[158, 1], [162, 1], [165, 1], [168, 1], [171, 1], [174, 1], [179, 1], [185, 1]], X, Y, "dot", 9))
    + `<div class="icons-row" aria-label="Eye color: a group variable"><span class="ic" style="--i:var(--c5)">Brown ×4</span><span class="ic" style="--i:var(--c1)">Blue ×2</span><span class="ic" style="--i:var(--teal)">Green ×2</span></div><p class="cap">Eye color: a group variable. You count people in each box instead of measuring.</p>`,
  words: [["Number variable", "Continuous variable"], ["Group variable", "Categorical variable"], ["Two-box group (yes/no)", "Binary or dichotomous variable"], ["The thing you want to explain", "Outcome, or dependent variable (Y)"], ["The thing you use to explain it", "Predictor, or independent variable (X)"]],
  check: { q: "\"Number of cigarettes smoked per day\" is a…", options: ["Number variable", "Group variable"], answer: 0, why: "You can count it on a scale (0, 5, 20…), so it's a number (continuous) variable." } },

{ id: "typical", part: "Describing things", title: "The typical value: mean vs median", idea: "The mean is the average. The median is the middle. One huge value can fool the mean but not the median.",
  story: `<p>Five houses on a street sell for $200K, $220K, $250K, $270K… and one mansion for <b>$2 million</b>.</p>
  <ul><li><b>Mean</b> (add them up, divide by 5): about <b>$588K</b>. No house actually costs anything near that.</li><li><b>Median</b> (line them up, take the middle one): <b>$250K</b>. That's what a normal house costs.</li></ul>
  <p>The mansion drags the mean upward. The median doesn't care how big the biggest one is.</p>
  <p class="rule">Rule of thumb: <b>Lopsided data or a few extreme values → median. Nice balanced data → mean.</b></p>`,
  chart: () => plot({ x: [0, 6], y: [0, 2100], yt: [0, 500, 1000, 1500, 2000], xt: [[1, "A"], [2, "B"], [3, "C"], [4, "D"], [5, "Mansion"]], yl: "Price ($K)", alt: "Bar chart of five house prices with mean and median lines" }, (X, Y) => {
    const v = [200, 220, 250, 270, 2000]; let s = v.map((p, i) => `<rect x="${X(i + 1) - 22}" y="${Y(p)}" width="44" height="${Y(0) - Y(p)}" class="bar ${i === 4 ? "hotbar" : ""}"/>`).join("");
    s += `<line x1="${X(0.3)}" x2="${X(5.7)}" y1="${Y(588)}" y2="${Y(588)}" class="m-line"/>${note(X(2.3), Y(588) - 8, "mean $588K", "lbl m-line")}`;
    s += `<line x1="${X(0.3)}" x2="${X(5.7)}" y1="${Y(250)}" y2="${Y(250)}" class="md-line"/>${note(X(0.4), Y(250) - 8, "median $250K", "lbl md-line")}`; return s; }),
  words: [["Average", "Mean"], ["Middle value", "Median"], ["Lopsided, with a long tail", "Skewed"], ["Balanced bell shape", "Normal distribution"]],
  check: { q: "Hospital bills: most are a few thousand dollars, a handful are over $500,000. Which describes a typical bill?", options: ["Mean", "Median"], answer: 1, why: "The few huge bills would drag the mean up. The median shows the ordinary bill." } },

{ id: "spread", part: "Describing things", title: "Spread: how scattered things are", idea: "Two groups can have the same average but be very different. Spread tells you how far people usually are from the average.",
  story: `<p>Two classes both average <b>75</b> on a test.</p><ul><li>In <b>Class A</b>, almost everyone got 70 to 80.</li><li>In <b>Class B</b>, scores run from 45 to 100.</li></ul>
  <p>Same average, very different classes. The <b>standard deviation</b> (SD) puts a number on that: it's roughly <i>how far a typical person is from the average</i>. Class A's SD is small (about 3). Class B's is big (about 15).</p>
  <p class="rule">If a question says <b>"how much does it vary"</b> or <b>"variability"</b>, the answer is the standard deviation.</p>`,
  chart: () => plot({ x: [40, 105], y: [0, 3], xt: [40, 50, 60, 70, 80, 90, 100], xl: "Test score", alt: "Two rows of dots: class A bunched near 75, class B spread widely", h: 220 }, (X, Y) => {
    const a = [70, 71, 72, 73, 74, 75, 75, 76, 77, 78, 79, 80], b = [45, 52, 58, 64, 70, 75, 75, 80, 86, 92, 98, 100];
    return dots(a.map((v, i) => [v, 2 + (i % 2) * 0.18]), X, Y, "dot", 6) + dots(b.map((v, i) => [v, 1 + (i % 2) * 0.18]), X, Y, "dot c2", 6)
      + note(X(41), Y(2) - 14, "Class A: small spread (SD ≈ 3)") + note(X(41), Y(1) - 14, "Class B: big spread (SD ≈ 15)")
      + `<line x1="${X(75)}" x2="${X(75)}" y1="${Y(0.4)}" y2="${Y(2.8)}" class="half"/>` + note(X(75) + 4, Y(2.75), "average 75", "tick"); }),
  words: [["How scattered the values are", "Spread, variability"], ["Typical distance from the average", "Standard deviation (SD)"], ["SD squared", "Variance"], ["Spread of the middle half", "Interquartile range (IQR), used with the median"]],
  check: { q: "A nurse wants to describe how much daily patient numbers bounce around. Which number?", options: ["Mean", "Median", "Standard deviation"], answer: 2, why: "\"Bounce around\" = variability = standard deviation." } },

{ id: "relationship", part: "Two things together", title: "Seeing a relationship", idea: "To see whether two number variables go together, put one on each axis. Each dot is one person.",
  story: `<p>We ask 12 people two questions: <b>How many cups of coffee do you drink a day?</b> and <b>How many hours did you sleep?</b></p>
  <p>Each person becomes one dot: across for coffee, up for sleep. Now look at the cloud of dots. It drifts <b>downhill</b>: people who drink more coffee tend to sleep a bit less.</p>
  <p>This picture is called a <b>scatterplot</b>. It's the first thing to draw whenever both variables are numbers.</p>`,
  chart: () => plot({ x: [-0.5, 5.5], y: [6, 8.6], xt: [0, 1, 2, 3, 4, 5], yt: [6, 6.5, 7, 7.5, 8, 8.5], xl: "Cups of coffee per day", yl: "Hours of sleep", alt: "Scatterplot drifting downhill" }, (X, Y) =>
    dots(COFFEE, X, Y) + `<circle cx="${X(3)}" cy="${Y(7.0)}" r="11" class="ring"/>` + note(X(3) + 16, Y(7.0) + 4, "this person: 3 cups, 7 hours", "tick")),
  words: [["Dot picture of two number variables", "Scatterplot"], ["Across (horizontal) axis", "X, the predictor"], ["Up (vertical) axis", "Y, the outcome"]],
  check: { q: "In a scatterplot, one dot stands for…", options: ["One person (or one unit we measured)", "The average", "The whole group"], answer: 0, why: "Every dot is one observation, usually one person." } },

{ id: "correlation", part: "Two things together", title: "Correlation: how tightly they go together", idea: "Correlation (r) is a number from −1 to +1. The sign says uphill or downhill. The size says how tight.",
  story: `<p>Look at the three pictures below.</p><ul><li><b>Uphill and tight</b>: r near <b>+1</b>. Taller people weigh more.</li><li><b>No pattern</b>: r near <b>0</b>. Shoe size and test scores.</li><li><b>Downhill and tight</b>: r near <b>−1</b>. More coffee, less sleep.</li></ul>
  <p>Rough guide: about ±0.1 is small, ±0.3 medium, ±0.6 or more large.</p>
  <p class="rule">Going together is <b>not</b> the same as one causing the other. Ice cream sales and sunburns rise together because of sunshine, not because ice cream burns you.</p>`,
  chart: () => { const r = rng(9); const mk = (s) => Array.from({ length: 30 }, () => { const x = r() * 10; return [x, clamp(5 + s * (x - 5) + randn(r) * (s === 0 ? 2 : 0.8), 0.3, 9.7)]; });
    const mini = (pts, lab) => `<div class="mini3">${plot({ x: [0, 10], y: [0, 10], w: 220, h: 200, alt: lab }, (X, Y) => dots(pts, X, Y, "dot", 4))}<p class="cap">${lab}</p></div>`;
    return `<div class="three-charts">${mini(mk(0.85), "r ≈ +0.9 (uphill)")}${mini(mk(0), "r ≈ 0 (no pattern)")}${mini(mk(-0.85), "r ≈ −0.9 (downhill)")}</div>`; },
  words: [["How tightly two numbers go together", "Correlation, Pearson's r"], ["r squared", "Coefficient of determination: the share of variation they have in common"], ["Rank-based version for lopsided data", "Spearman's rho"]],
  check: { q: "r = −0.8 means…", options: ["A strong downhill relationship", "A weak relationship", "No relationship", "One causes the other"], answer: 0, why: "Negative = downhill; 0.8 is close to 1, so it's strong. It still doesn't prove cause." } },

{ id: "line", part: "Drawing the line", title: "The line: a recipe for predicting", idea: "A regression line is a recipe: start at a value, then add or subtract the same amount for each step of X.",
  story: `<p>Draw the straight line that runs through the middle of the coffee dots. It works like a recipe:</p>
  <p class="eq">Sleep = <span class="tag t0">7.9 hours</span> <span class="tag t1">− 0.24 hours</span> × cups of coffee</p>
  <ul><li><span class="tag t0">Start value: 7.9</span>. Someone who drinks <b>no</b> coffee is predicted to sleep about 7.9 hours. That's where the line touches the left edge.</li>
  <li><span class="tag t1">Change per step: −0.24</span>. <b>Each extra cup</b> means about 0.24 hours (about 15 minutes) less sleep.</li></ul>
  <p>To predict: someone with 3 cups → 7.9 − 0.24 × 3 = <b>7.2 hours</b>.</p>`,
  chart: () => { const f = ols(COFFEE); return plot({ x: [-0.5, 5.5], y: [6, 8.6], xt: [0, 1, 2, 3, 4, 5], yt: [6, 6.5, 7, 7.5, 8, 8.5], xl: "Cups of coffee per day", yl: "Hours of sleep", alt: "Scatterplot with a downward line; start value and slope marked" }, (X, Y) =>
    dots(COFFEE, X, Y) + `<line x1="${X(-0.5)}" y1="${Y(f.b0 - 0.5 * f.b1)}" x2="${X(5.5)}" y2="${Y(f.b0 + 5.5 * f.b1)}" class="fit"/>`
    + `<circle cx="${X(0)}" cy="${Y(f.b0)}" r="7" class="dot hot"/>` + note(X(0) + 12, Y(f.b0) - 12, `start: ${f.b0.toFixed(1)} h`, "lbl t0txt")
    + `<path d="M${X(2)} ${Y(f.b0 + 2 * f.b1)} H${X(3)} V${Y(f.b0 + 3 * f.b1)}" class="step"/>` + note(X(3) + 8, Y(f.b0 + 2.6 * f.b1), `1 cup more → ${f.b1.toFixed(2)} h`, "lbl t1txt")); },
  words: [["Start value (when X is 0)", "Intercept, b₀"], ["Change for each 1-unit step in X", "Slope, coefficient, b₁ (β)"], ["The recipe", "Regression equation: Ŷ = b₀ + b₁X"], ["One X, number outcome", "Simple linear regression"]],
  check: { q: "Steps per day = 5,000 + 1,500 × (owns a dog). What does 1,500 mean?", options: ["Dog owners walk 1,500 more steps a day on average", "Everyone walks 1,500 steps", "Dog owners walk 1,500 steps total"], answer: 0, why: "Owning a dog switches 'owns a dog' from 0 to 1, adding 1,500 steps." } },

{ id: "residual", part: "Drawing the line", title: "Misses: how far off each guess is", idea: "No line hits every dot. The gap between a real dot and the line is a miss, called a residual.",
  story: `<p>The pink sticks show how far each person's real sleep is from what the line predicted.</p><ul><li>A dot <b>above</b> the line: slept <b>more</b> than predicted (a positive miss).</li><li>A dot <b>below</b>: slept <b>less</b> than predicted (a negative miss).</li></ul>
  <p>Regression picks the one line that makes these misses as small as possible overall. Squaring them first stops positives and negatives from cancelling out, which is why it's called <b>least squares</b>.</p>`,
  chart: () => { const f = ols(COFFEE); return plot({ x: [-0.5, 5.5], y: [6, 8.6], xt: [0, 1, 2, 3, 4, 5], yt: [6, 6.5, 7, 7.5, 8, 8.5], xl: "Cups of coffee per day", yl: "Hours of sleep", alt: "Line with vertical sticks from each dot to the line" }, (X, Y) =>
    COFFEE.map(p => `<line x1="${X(p[0])}" x2="${X(p[0])}" y1="${Y(p[1])}" y2="${Y(f.b0 + f.b1 * p[0])}" class="resid thick"/>`).join("") + `<line x1="${X(-0.5)}" y1="${Y(f.b0 - 0.5 * f.b1)}" x2="${X(5.5)}" y2="${Y(f.b0 + 5.5 * f.b1)}" class="fit"/>` + dots(COFFEE, X, Y)); },
  words: [["A miss (real minus predicted)", "Residual, error"], ["Picking the line with the smallest squared misses", "Ordinary least squares (OLS)"], ["A miss turned into a z-score", "Standardized residual"]],
  check: { q: "A person's real sleep is 6.5 h; the line predicted 7.2 h. Their residual is…", options: ["−0.7 (slept less than predicted)", "+0.7", "7.2"], answer: 0, why: "Residual = real − predicted = 6.5 − 7.2 = −0.7." } },

{ id: "rsquared", part: "Drawing the line", title: "How good is the line? (R²)", idea: "R² is the share of the up-and-down in Y that the line explains. 0% = useless, 100% = perfect.",
  story: `<p>On the left, the dots hug the line: knowing X tells you a lot about Y. On the right, dots are everywhere: the line helps only a little.</p>
  <p><b>R² = 0.80</b> means "the line explains <b>80%</b> of why people's Y values differ." The other 20% is due to things we didn't measure.</p>
  <p>A second question: is the line better than just guessing the average for everyone? The <b>F-test</b> answers that with a yes or no (using its p-value).</p>`,
  chart: () => { const r = rng(4); const mk = (n) => Array.from({ length: 28 }, () => { const x = r() * 10; return [x, clamp(2 + 0.6 * x + randn(r) * n, 0.2, 9.8)]; });
    const a = mk(0.6), b = mk(2.4), fa = ols(a), fb = ols(b);
    const mini = (pts, f, lab) => `<div class="mini2">${plot({ x: [0, 10], y: [0, 10], w: 280, h: 230, alt: lab }, (X, Y) => dots(pts, X, Y, "dot", 4) + `<line x1="${X(0)}" y1="${Y(f.b0)}" x2="${X(10)}" y2="${Y(f.b0 + 10 * f.b1)}" class="fit"/>`)}<p class="cap">${lab}: R² = ${f.r2.toFixed(2)} → explains ${Math.round(f.r2 * 100)}%</p></div>`;
    return `<div class="two-charts">${mini(a, fa, "Tight")}${mini(b, fb, "Loose")}</div>`; },
  words: [["Share explained by the model", "R² (R-squared)"], ["R² adjusted for how many X's you used", "Adjusted R²"], ["Is the model better than the average?", "F-test / F statistic"], ["Guessing the average for everyone", "Intercept-only model"]],
  check: { q: "R² = 0.25 means…", options: ["The model explains 25% of the variation in Y", "25% of people were predicted correctly", "The slope is 0.25"], answer: 0, why: "R² is the share of variation explained. Say it as a percent." } },

{ id: "pvalue", part: "Real or luck?", title: "Real or just luck? (p-values)", idea: "A p-value answers: if nothing were really going on, how surprising would this result be? Small p (below .05) = too surprising to be just luck.",
  story: `<p>A friend flips a coin 10 times and gets <b>9 heads</b>. Is the coin rigged?</p>
  <p>Start by assuming it's <b>fair</b> (nothing is going on). That assumption is the <b>null hypothesis</b>. A fair coin <i>usually</i> lands 4, 5 or 6 heads. Getting 9 or more happens only about <b>1 time in 100</b> (p ≈ .01).</p>
  <p>That's so rare we stop believing the coin is fair. When p is below <b>.05</b> (1 in 20), we call a result <b>statistically significant</b>.</p>
  <p class="rule">In regression, the "nothing going on" idea is "the slope is 0." A small p-value for a slope means the relationship probably isn't luck.</p>`,
  chart: () => { const pr = Array.from({ length: 11 }, (_, k) => { let c = 1; for (let i = 0; i < k; i++) c = c * (10 - i) / (i + 1); return c / 1024; });
    return plot({ x: [-0.7, 10.7], y: [0, 0.27], yt: [0, 0.05, 0.1, 0.15, 0.2, 0.25], xt: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], xl: "Number of heads in 10 flips of a FAIR coin", yl: "Chance", alt: "Bar chart of a fair coin's results, with 9 and 10 heads highlighted as rare" }, (X, Y) =>
      pr.map((p, k) => `<rect x="${X(k) - 16}" y="${Y(p)}" width="32" height="${Y(0) - Y(p)}" class="bar ${k >= 9 ? "hotbar" : ""}"/>`).join("") + note(X(6.6), Y(0.12), "9+ heads: about 1% chance", "lbl m-line")); },
  words: [["\"Nothing is going on\"", "Null hypothesis (H₀)"], ["\"Something is going on\"", "Alternative hypothesis (Hₐ)"], ["How surprising, if nothing were going on", "p-value"], ["The 1-in-20 cutoff", "α = .05"], ["Too surprising to be luck", "Statistically significant"]],
  check: { q: "A slope has p = .30. What do you conclude?", options: ["Not significant: it could easily be luck", "Significant", "30% of Y is explained"], answer: 0, why: ".30 is much bigger than .05, so the pattern could easily be chance." } },

{ id: "ci", part: "Real or luck?", title: "A range of believable values (confidence intervals)", idea: "A 95% confidence interval is a range where the true value probably sits. If the range includes \"no effect,\" the result isn't significant.",
  story: `<p>Our 12 people say each cup of coffee costs 0.24 hours of sleep. A different 12 people would give a slightly different number. The 95% confidence interval gives the believable range: <b>−0.33 to −0.16</b>.</p>
  <p>Then just ask: <b>does the range include "no effect"?</b></p><ul><li>For a slope, "no effect" is <b>0</b>.</li><li>For an odds ratio (later), "no effect" is <b>1</b>.</li></ul>
  <p>Range doesn't touch the line → significant. Range crosses it → not significant. Narrow range → precise. Wide range → unsure.</p>`,
  chart: () => plot({ x: [-1, 1], y: [0, 4], xt: [-1, -0.5, 0, 0.5, 1], xl: "Slope (0 = no effect)", alt: "Three confidence intervals, one crossing zero", h: 240 }, (X, Y) => {
    const rows = [[-0.24, -0.33, -0.16, "Coffee: −0.33 to −0.16 → significant", 3], [0.10, -0.25, 0.45, "Shoe size: −0.25 to 0.45 → crosses 0, not significant", 2], [0.55, 0.30, 0.80, "Exercise: 0.30 to 0.80 → significant", 1]];
    return `<line x1="${X(0)}" x2="${X(0)}" y1="${Y(0.3)}" y2="${Y(3.8)}" class="half"/>` + rows.map(r => { const sig = r[2] < 0 || r[1] > 0; return `<line x1="${X(r[1])}" x2="${X(r[2])}" y1="${Y(r[4])}" y2="${Y(r[4])}" class="ci ${sig ? "sig" : ""}"/><rect x="${X(r[0]) - 6}" y="${Y(r[4]) - 6}" width="12" height="12" class="pt ${sig ? "sig" : ""}"/>` + note(X(-0.98), Y(r[4]) - 12, r[3], "tick"); }).join(""); }),
  words: [["Range of believable values", "95% confidence interval (CI)"], ["Slope's 'no effect' value", "0"], ["Odds ratio's 'no effect' value", "1"]],
  check: { q: "A slope's 95% CI is −2.1 to 0.4. Significant?", options: ["No, the range includes 0", "Yes, it's mostly negative", "Yes, it excludes 1"], answer: 0, why: "It crosses 0, so 'no effect' is still believable." } },

{ id: "constant", part: "More than one cause", title: "Holding other things constant", idea: "Multiple regression uses several X's at once, so each one's effect is measured while the others are kept the same.",
  story: `<p>Across many days, <b>ice cream sales</b> and <b>sunburns</b> rise together. Does ice cream cause sunburn? No. <b>Sunny weather</b> causes both.</p>
  <p>Look at the picture: within <b>sunny days only</b> (orange), ice cream doesn't change sunburns. Within <b>cloudy days only</b> (blue), same. The overall uphill pattern came from mixing the two kinds of day.</p>
  <p>Putting "sunny" into the model <b>holds it constant</b>: we compare days with the same weather. Then ice cream's slope drops to about zero.</p>
  <p class="rule">Every multiple regression slope gets this phrase: "<b>…holding the other variables constant</b>."</p>`,
  chart: () => { const r = rng(12); const pts = []; for (let i = 0; i < 16; i++) pts.push([1 + r() * 4, 1.2 + r() * 1.6, "dot c0"]); for (let i = 0; i < 16; i++) pts.push([5 + r() * 4, 6 + r() * 1.6, "dot sun"]);
    return plot({ x: [0, 10], y: [0, 9], xt: [[1, "low"], [9, "high"]], yt: [], xl: "Ice cream sales", yl: "Sunburns", alt: "Two clusters: cloudy days low-left, sunny days high-right; flat within each" }, (X, Y) =>
      dots(pts, X, Y, "dot", 6) + `<line x1="${X(0.5)}" y1="${Y(0.6)}" x2="${X(9.5)}" y2="${Y(8.4)}" class="ghostline"/>` + note(X(6.3), Y(5.1), "overall: looks uphill", "tick")
      + `<line x1="${X(1)}" x2="${X(5)}" y1="${Y(2)}" y2="${Y(2)}" class="fit"/><line x1="${X(5)}" x2="${X(9)}" y1="${Y(6.8)}" y2="${Y(6.8)}" class="fit"/>`
      + note(X(1), Y(3.4), "cloudy days: flat", "lbl") + note(X(5.3), Y(8.3), "sunny days: flat", "lbl")); },
  words: [["Several X's in one model", "Multiple linear regression"], ["Keeping the others the same", "Holding constant, controlling for, adjusting for"], ["A hidden third thing driving both", "Confounder"], ["Two X's that are near-duplicates", "Multicollinearity (e.g., weight and BMI)"]],
  check: { q: "Why add age to a model of BMI and diabetes?", options: ["To compare people of the same age, so age can't fake the BMI result", "To make R² smaller", "Because age is the outcome"], answer: 0, why: "Older people tend to have higher BMI and more diabetes. Holding age constant removes that." } },

{ id: "switch", part: "More than one cause", title: "Groups as on/off switches", idea: "A yes/no variable becomes a switch: 0 = off (the comparison group), 1 = on. Its slope is the difference between the groups.",
  story: `<p>Sick days per year = <b>6 − 2 × (vaccinated)</b>.</p><ul><li>Switch off (not vaccinated, 0): 6 − 2×0 = <b>6 days</b>.</li><li>Switch on (vaccinated, 1): 6 − 2×1 = <b>4 days</b>.</li></ul>
  <p>So the "−2" just means: <b>vaccinated people average 2 fewer sick days than unvaccinated people.</b> The "off" group is called the <b>reference group</b>; everything is compared to it.</p>
  <p>Three or more groups? One switch per group, except the reference. Four regions → three switches.</p>`,
  chart: () => plot({ x: [0, 3], y: [0, 7], yt: [0, 2, 4, 6], xt: [[1, "Not vaccinated (0)"], [2, "Vaccinated (1)"]], yl: "Sick days per year", alt: "Two bars, 6 and 4", h: 260 }, (X, Y) =>
    `<rect x="${X(1) - 40}" y="${Y(6)}" width="80" height="${Y(0) - Y(6)}" class="bar"/><rect x="${X(2) - 40}" y="${Y(4)}" width="80" height="${Y(0) - Y(4)}" class="bar alt"/>`
    + note(X(1) - 10, Y(6) - 8, "6") + note(X(2) - 10, Y(4) - 8, "4") + `<path d="M${X(1) + 46} ${Y(6)} H${X(2) + 50} V${Y(4)}" class="step"/>` + note(X(2) + 56, Y(5), "−2 days", "lbl t1txt")),
  words: [["On/off switch variable", "Dummy variable (coded 0/1)"], ["The 'off' group everyone is compared to", "Reference group"], ["k groups need…", "k − 1 dummy variables"]],
  check: { q: "Blood pressure = 118 + 6 × (smoker). Smokers' predicted BP is…", options: ["124", "118", "6"], answer: 0, why: "Switch on: 118 + 6 × 1 = 124." } },

{ id: "checkup", part: "Checking the work", title: "Check-up before trusting the line", idea: "Regression's answers are only trustworthy if the data follow a few rules. Look at the misses: they should be a shapeless, even band.",
  story: `<p>Think of a pre-flight checklist. The main ones, in plain words:</p>
  <ul><li>The outcome is a <b>number</b>.</li><li>Each person is <b>separate</b>: no one counted twice, no clusters like siblings.</li><li>The pattern is a <b>straight line</b>, not a curve.</li><li>The misses are <b>evenly spread</b>: not a funnel.</li><li>The X's aren't <b>near-duplicates</b> of each other.</li></ul>
  <p>The fastest check: plot the misses. <b>Left</b>: a shapeless band, good. <b>Right</b>: a funnel that gets wider, a problem called non-constant variance.</p>`,
  chart: () => { const r = rng(7); const good = Array.from({ length: 40 }, () => [r() * 10, randn(r) * 1.1]); const bad = Array.from({ length: 40 }, () => { const x = r() * 10; return [x, randn(r) * (0.2 + x * 0.32)]; });
    const mini = (pts, lab) => `<div class="mini2">${plot({ x: [0, 10], y: [-4.5, 4.5], w: 280, h: 220, yt: [0], xl: "Predicted value", alt: lab }, (X, Y) => `<line x1="${X(0)}" x2="${X(10)}" y1="${Y(0)}" y2="${Y(0)}" class="half"/>` + dots(pts, X, Y, "dot", 4))}<p class="cap">${lab}</p></div>`;
    return `<div class="two-charts">${mini(good, "Good: even band of misses")}${mini(bad, "Problem: funnel shape")}</div>`; },
  words: [["Pre-flight checklist", "Assumptions"], ["Each person separate", "Independence of observations"], ["Straight-line pattern", "Linearity"], ["Even spread of misses", "Homoscedasticity (funnel = heteroscedasticity)"], ["X's that are near-duplicates", "Multicollinearity"], ["Tests that say 'fails' when p < .05", "Breusch-Pagan (even spread), Durbin-Watson (independent misses)"]],
  check: { q: "The misses form a funnel that widens to the right. Which rule is broken?", options: ["Even spread (homoscedasticity)", "Straight line", "Independence"], answer: 0, why: "A widening funnel means the spread isn't constant." } },

{ id: "oddone", part: "Checking the work", title: "The odd one out", idea: "One unusual point can drag the whole line. Find these points, check them for typos, then decide.",
  story: `<p>Ten clinics, and the line shows more staff → shorter waits. Then one clinic with plenty of staff reports a <b>95-minute</b> wait. Someone typed 95 instead of 35.</p>
  <p>The dashed line shows how far that one point drags the line. That's an <b>influential</b> point.</p>
  <p>Three ways to spot trouble: points the line <b>misses badly</b>, points with <b>unusual X values</b>, and points that <b>move the line</b> when you remove them.</p>
  <p class="rule">Don't delete points just because they're odd. First check for typos. Fix real errors, keep real data, and say what you did.</p>`,
  chart: () => { const base = [[2, 58], [3, 54], [4, 50], [5, 47], [6, 44], [7, 40], [8, 38], [9, 34], [10, 31], [3.5, 52]]; const odd = [9.5, 95]; const f0 = ols(base), f1 = ols([...base, odd]);
    return plot({ x: [1, 11], y: [20, 100], xt: [2, 4, 6, 8, 10], yt: [20, 40, 60, 80, 100], xl: "Staff per shift", yl: "Wait (minutes)", alt: "Line pulled upward by one odd point" }, (X, Y) =>
      `<line x1="${X(1)}" y1="${Y(f0.b0 + f0.b1)}" x2="${X(11)}" y2="${Y(f0.b0 + 11 * f0.b1)}" class="fit"/><line x1="${X(1)}" y1="${Y(f1.b0 + f1.b1)}" x2="${X(11)}" y2="${Y(f1.b0 + 11 * f1.b1)}" class="ghostline"/>`
      + dots(base, X, Y) + `<circle cx="${X(odd[0])}" cy="${Y(odd[1])}" r="8" class="dot hot"/>` + note(X(5.4), Y(93), "odd clinic: 95 typed instead of 35", "tick") + note(X(1.3), Y(26), "solid: without it · dashed: with it", "tick")); },
  words: [["Missed badly by the line", "Outlier (standardized residual beyond ±1.96)"], ["Unusual X values", "High leverage (above 2k/n)"], ["Moves the line", "Influential (Cook's distance above 4/n)"]],
  check: { q: "A flagged point turns out to be a typo. What do you do?", options: ["Fix it (or remove it), re-run, and report it", "Ignore it", "Delete every flagged point"], answer: 0, why: "Real errors get fixed; real data stay; always say what you did." } },

{ id: "yesno", part: "Yes/no outcomes", title: "When the outcome is yes or no", idea: "If Y is yes/no, a straight line breaks. Logistic regression bends it into an S-curve that stays between 0% and 100%.",
  story: `<p>Will someone carry an umbrella? It depends on the forecast's chance of rain. Each dot is a person: <b>top row = carried one (1)</b>, <b>bottom row = didn't (0)</b>.</p>
  <p>A straight line would predict silly things like "120% chance of carrying an umbrella." The <b>S-curve</b> stays between 0 and 1. It's flat at the ends and steep in the middle.</p>
  <p>Reading it: at a 60% forecast, follow up to the curve and across: about <b>a 75% chance</b> this person carries an umbrella. Above 50% → we predict "yes".</p>`,
  chart: () => { const r = rng(3); const p = x => 1 / (1 + Math.exp(-(x - 45) / 8)); const pts = Array.from({ length: 40 }, () => { const x = r() * 100; const y = r() < p(x) ? 1 : 0; return [x, y + (y ? -0.03 : 0.03) * r()]; });
    return plot({ x: [0, 100], y: [-0.05, 1.05], xt: [0, 20, 40, 60, 80, 100], yt: [0, 0.5, 1], xl: "Forecast chance of rain (%)", yl: "Chance of carrying an umbrella", alt: "S-shaped curve through yes and no dots" }, (X, Y) => {
      let path = ""; for (let x = 0; x <= 100; x++) path += (x ? "L" : "M") + X(x) + " " + Y(p(x));
      return dots(pts, X, Y, "dot soft", 5) + `<path d="${path}" class="fit curve"/>` + `<line x1="${X(60)}" x2="${X(60)}" y1="${Y(0)}" y2="${Y(p(60))}" class="guide"/><line x1="${X(0)}" x2="${X(60)}" y1="${Y(p(60))}" y2="${Y(p(60))}" class="guide"/><circle cx="${X(60)}" cy="${Y(p(60))}" r="7" class="dot hot"/>` + note(X(62), Y(p(60)) + 18, `60% forecast → ${Math.round(p(60) * 100)}% chance`, "lbl"); }); },
  words: [["Yes/no outcome", "Binary outcome (coded 1/0)"], ["The S-curve model", "Logistic regression"], ["Predicted chance", "Predicted probability, P(Y)"], ["S-curve formula", "P(Y) = 1 / (1 + e^−(b₀ + b₁X))"]],
  check: { q: "Which outcome needs logistic regression?", options: ["Got the flu this year (yes/no)", "Blood pressure", "Hours of sleep"], answer: 0, why: "Yes/no outcome → logistic." } },

{ id: "odds", part: "Yes/no outcomes", title: "Odds and odds ratios", idea: "Odds compare yes to no. An odds ratio compares the odds of two groups. Above 1 = higher odds, below 1 = lower, exactly 1 = no difference.",
  story: `<p><b>Odds</b> are betting language. In Group A, 3 of 4 people got a flu shot: 3 yes for every 1 no. Odds = <b>3 to 1 = 3</b>. (The probability is 3 out of 4 = 75%. Odds and probability are different ways to say it.)</p>
  <p>In Group B, 2 of 4 got one: odds = 2 to 2 = <b>1</b>.</p>
  <p><b>Odds ratio</b> = Group A's odds ÷ Group B's odds = 3 ÷ 1 = <b>3</b>. "Group A has <b>3 times the odds</b> of getting a flu shot."</p>
  <ul><li>OR = 1.4 → 40% higher odds.</li><li>OR = 0.7 → 30% lower odds.</li><li>OR = 1 → no difference.</li></ul>
  <p class="rule">Say "odds," not "likely" or "chance," and check that the CI doesn't include <b>1</b>.</p>`,
  chart: () => { const person = (x, y, yes) => `<g transform="translate(${x} ${y})"><circle cx="0" cy="-16" r="9" class="${yes ? "pyes" : "pno"}"/><rect x="-11" y="-5" width="22" height="26" rx="8" class="${yes ? "pyes" : "pno"}"/></g>`;
    let s = `<svg viewBox="0 0 560 230" class="chart" role="img" aria-label="Icon arrays: group A 3 of 4 vaccinated, group B 2 of 4">`;
    s += note(20, 34, "Group A: odds 3 to 1 = 3"); [1, 1, 1, 0].forEach((v, i) => s += person(50 + i * 44, 80, v));
    s += note(300, 34, "Group B: odds 2 to 2 = 1"); [1, 1, 0, 0].forEach((v, i) => s += person(330 + i * 44, 80, v));
    s += `<rect x="20" y="140" width="520" height="58" rx="10" class="orbox"/>` + note(40, 175, "Odds ratio = 3 ÷ 1 = 3 → Group A has 3 times the odds", "lbl big");
    s += `<g transform="translate(250 220)"><circle cx="0" cy="-6" r="5" class="pyes"/></g>` + note(262, 218, "= got a flu shot", "tick") + `<g transform="translate(400 220)"><circle cx="0" cy="-6" r="5" class="pno"/></g>` + note(412, 218, "= didn't", "tick");
    return s + `</svg>`; },
  words: [["Yes ÷ no", "Odds = p / (1 − p)"], ["Group A's odds ÷ Group B's odds", "Odds ratio (OR) = e^β"], ["What logistic coefficients are measured in", "Log-odds (logit); exponentiate to get the OR"], ["'No difference' for an OR", "1"]],
  check: { q: "OR = 0.6 for exercise and depression means…", options: ["Exercisers have 40% lower odds of depression", "60% lower odds", "Exercise explains 60%"], answer: 0, why: "(1 − 0.6) × 100 = 40% lower odds." } },

{ id: "groups", part: "Comparing groups", title: "Comparing groups' averages", idea: "To compare average scores between groups: 2 groups → t-test. 3 or more → ANOVA. ANOVA asks whether the groups differ more than people within a group do.",
  story: `<p>Three fertilizers, ten plants each. We measure height.</p><ul><li>Two fertilizers to compare? Use a <b>t-test</b>.</li><li>Three or more? Use <b>ANOVA</b>.</li></ul>
  <p>ANOVA compares two kinds of spread: how far apart the <b>group averages</b> are (the black bars), versus how scattered plants are <b>inside each group</b>. If the averages are far apart compared with the scatter, the F number is big and the groups really differ.</p>
  <p>ANOVA only says "<i>some</i> group is different." To find <i>which</i>, do follow-up comparisons (post-hoc tests).</p>`,
  chart: () => { const r = rng(5); const g = [[18, "A"], [24, "B"], [21, "C"]];
    return plot({ x: [0, 4], y: [10, 32], yt: [10, 15, 20, 25, 30], xt: [[1, "Fertilizer A"], [2, "Fertilizer B"], [3, "Fertilizer C"]], yl: "Plant height (cm)", alt: "Three groups of dots with group averages" }, (X, Y) =>
      g.map(([m], i) => { const pts = Array.from({ length: 10 }, (_, k) => [i + 1 - 0.25 + (k % 5) * 0.12, m + randn(r) * 2, "dot soft c" + i]); return dots(pts, X, Y, "dot", 5) + `<line x1="${X(i + 0.65)}" x2="${X(i + 1.35)}" y1="${Y(m)}" y2="${Y(m)}" class="meanbar"/>`; }).join("")); },
  words: [["Compare 2 group averages", "t-test (paired t-test if same people twice)"], ["Compare 3+ group averages", "One-way ANOVA"], ["Two grouping variables at once", "Two-way ANOVA (plus their interaction)"], ["Same people measured 3+ times", "Repeated measures ANOVA"], ["'Some group differs' test", "Omnibus test"], ["Finding which groups differ", "Post-hoc tests (Tukey, Bonferroni)"], ["Two group variables, counts", "Chi-square test"]],
  check: { q: "Comparing average wait time across 4 clinics needs…", options: ["One-way ANOVA", "t-test", "Logistic regression"], answer: 0, why: "Number outcome, one grouping variable with 4 groups." } },

{ id: "together", part: "Putting it together", title: "Putting it all together", idea: "Always ask the same first question: what kind of outcome is it? The answer picks the tool.",
  story: `<div class="pick-grid">
   <div class="pk"><b>Describing one variable?</b><span>Balanced → mean · Lopsided → median · How scattered → SD</span></div>
   <div class="pk"><b>Outcome is a number</b><span>1 number X → simple regression · several X's → multiple regression · comparing group averages → t-test (2) / ANOVA (3+)</span></div>
   <div class="pk"><b>Outcome is yes/no</b><span>Logistic regression → odds ratios</span></div>
   <div class="pk"><b>Two group variables, counts</b><span>Chi-square</span></div></div>
  <p>Then the same five moves every time: <b>1</b> name the outcome, <b>2</b> pick the tool, <b>3</b> check the rules, <b>4</b> run it, <b>5</b> say the result in plain words.</p>
  <p>You now know every big idea in the course. Next, the lessons go one level deeper with real-looking output, and the answer templates give you the sentences.</p>`,
  chart: () => `<div data-widget="decider"></div>`,
  words: [["Pick the tool from the outcome type", "Choosing the statistical test"], ["Say it in plain words", "Interpretation, using the answer templates"]],
  check: { q: "Outcome: 'readmitted to hospital within 30 days (yes/no)'. Predictors: age and number of medications. Tool?", options: ["Logistic regression", "Multiple linear regression", "ANOVA"], answer: 0, why: "Yes/no outcome → logistic, whatever the predictors are." } }
];

/* lesson ↔ beginner step links, and a plain-words summary for each lesson */
const PLAIN = {
  biostats: ["A test asks: could this pattern just be luck? If p is below .05, we say probably not.", ["pvalue", "ci"]],
  describe: ["Average for balanced data, middle value for lopsided data, SD for how scattered.", ["typical", "spread"]],
  choose: ["Look at the outcome first. Number, yes/no, or groups. That picks the tool.", ["variables", "together"]],
  slr: ["Draw the best straight line through the dots: a start value plus a change per step.", ["relationship", "correlation", "line", "residual", "rsquared"]],
  variables: ["Groups become on/off switches. Each switch is compared to one reference group.", ["variables", "switch"]],
  mlr: ["Same line idea with several X's. Each X's effect is measured with the others held still.", ["constant", "checkup", "oddone"]],
  logistic: ["Yes/no outcomes use an S-curve, and results come out as odds ratios.", ["yesno", "odds"]],
  anova: ["Are group averages farther apart than people within a group? If so, the groups differ.", ["groups"]]
};

/* ---------- views ---------- */
S.basics = S.basics || {};
route(/^\/basics$/, () => {
  const done = BASICS.filter(b => S.basics[b.id]).length; const parts = [...new Set(BASICS.map(b => b.part))];
  view().innerHTML = `<h1>Start from zero</h1><p class="lede">${BASICS.length} short steps, one idea each. Everyday stories first, a picture for every idea, and the course words only at the end of each step. About 3 minutes per step.</p>
  <div class="meter"><div style="width:${done / BASICS.length * 100}%"></div></div><p class="small">${done} of ${BASICS.length} steps done${done ? ` · <a href="#/basics/${(BASICS.find(b => !S.basics[b.id]) || BASICS[0]).id}">Continue</a>` : ` · <a href="#/basics/${BASICS[0].id}">Begin with step 1</a>`}</p>
  ${parts.map(p => `<h2>${p}</h2><ol class="zlist">${BASICS.map((b, i) => [b, i]).filter(([b]) => b.part === p).map(([b, i]) => `<li class="${S.basics[b.id] ? "done" : ""}"><a href="#/basics/${b.id}"><span class="zn">${i + 1}</span><span><b>${b.title}</b><span>${b.idea}</span></span></a></li>`).join("")}</ol>`).join("")}
  <h2>Everyday words → course words</h2><div class="tblwrap"><table class="tbl xlate"><tr><th>When you think…</th><th>The course says…</th></tr>${BASICS.flatMap(b => b.words).map(w => `<tr><td>${w[0]}</td><td>${w[1]}</td></tr>`).join("")}</table></div>`;
});
route(/^\/basics\/([\w-]+)$/, (id) => {
  const i = BASICS.findIndex(b => b.id === id); const b = BASICS[i]; if (!b) { location.hash = "#/basics"; return; }
  const nx = BASICS[i + 1], pv = BASICS[i - 1];
  view().innerHTML = `<nav class="crumb"><a href="#/basics">Start from zero</a> / Step ${i + 1} of ${BASICS.length} · ${b.part}</nav>
  <div class="zbar">${BASICS.map((x, k) => `<a href="#/basics/${x.id}" class="${k === i ? "on" : S.basics[x.id] ? "done" : ""}" aria-label="Step ${k + 1}: ${x.title}"></a>`).join("")}</div>
  <article class="zstep"><h1>${b.title}</h1><p class="bigidea"><span>The idea</span>${b.idea}</p>
  <div class="zgrid"><div class="zstory">${b.story}</div><figure class="zfig">${b.chart()}</figure></div>
  <section class="zwords"><h2>Now the course words</h2><table class="tbl xlate"><tr><th>Everyday words</th><th>Course words</th></tr>${b.words.map(w => `<tr><td>${w[0]}</td><td><b>${w[1]}</b></td></tr>`).join("")}</table></section>
  <section class="zcheck"><h2>Quick check</h2><p class="q">${b.check.q}</p><div class="opts">${b.check.options.map((o, k) => `<button class="opt" data-k="${k}">${o}</button>`).join("")}</div><div class="fb"></div></section>
  <nav class="pager">${pv ? `<a href="#/basics/${pv.id}">Previous: ${pv.title}</a>` : `<a href="#/basics">All steps</a>`}${nx ? `<a href="#/basics/${nx.id}">Next: ${nx.title}</a>` : `<a href="#/learn">On to the lessons</a>`}</nav></article>`;
  view().querySelectorAll(".zcheck [data-k]").forEach(btn => btn.onclick = () => {
    const ok = +btn.dataset.k === b.check.answer;
    view().querySelectorAll(".zcheck [data-k]").forEach((x, k) => { x.disabled = true; if (k === b.check.answer) x.classList.add("right"); });
    if (!ok) btn.classList.add("wrong");
    $(".zcheck .fb").innerHTML = `<p class="${ok ? "good" : "badtxt"}">${ok ? "Yes!" : "Not quite."}</p><p>${b.check.why}</p>${nx ? `<a class="btn" href="#/basics/${nx.id}">Next step</a>` : `<a class="btn" href="#/learn">Go to the lessons</a>`}`;
    S.basics[b.id] = true; touchDay(); save();
    const dots = view().querySelectorAll(".zbar a"); dots[i].classList.add("done");
  });
  touchDay();
});
