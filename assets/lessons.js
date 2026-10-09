/* Lessons. <div data-widget="name"></div> placeholders are mounted by labs.js.
   check: question ids (from EXAMS) used for the end-of-lesson retrieval quiz. */

const LESSONS = [
{
  id:"choose", title:"Pick the right test", mins:8, color:"var(--c1)",
  hook:"Most exam points start with one question: what kind of outcome is it?",
  body:`
<p>Every analysis in this course is chosen by answering two questions, in this order:</p>
<ol class="big-steps"><li><b>What is the outcome (Y)?</b> A number on a scale (continuous) or a category (yes/no)?</li><li><b>What are the predictors (X)?</b> How many, and are they groups or numbers?</li></ol>
<div data-widget="decider"></div>
<h3>The whole course on one table</h3>
<table class="tbl grid-tbl">
<tr><th>Outcome ↓ / Predictor →</th><th>1 categorical (2 groups)</th><th>1 categorical (3+ groups)</th><th>2 categorical</th><th>1 continuous</th><th>Several (any type)</th></tr>
<tr><th>Continuous</th><td>t-test</td><td>One-way ANOVA</td><td>Two-way ANOVA</td><td>Correlation / simple linear regression</td><td>Multiple linear regression</td></tr>
<tr><th>Continuous, same people 3+ times</th><td colspan="5">Repeated measures ANOVA (2 times → paired t-test)</td></tr>
<tr><th>Binary (yes/no)</th><td>Chi-square</td><td>Chi-square</td><td colspan="1">Logistic regression</td><td>Logistic regression</td><td>Logistic regression</td></tr>
</table>
<h3>Describing, not testing</h3>
<p>If the question says <i>typical</i>, <i>average</i>, or <i>variability</i>, it wants a descriptive statistic, not a test:</p>
<ul class="chips"><li><b>Mean</b> — typical value, symmetric data</li><li><b>Median</b> — typical value, skewed data or outliers</li><li><b>Standard deviation</b> — variability / spread</li></ul>
<h3>Reading equations</h3>
<table class="tbl"><tr><th>Equation</th><th>Test</th></tr>
<tr><td>Y = β₀ + β₁X₁ + ε</td><td>Simple linear regression (1 predictor)</td></tr>
<tr><td>Y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε</td><td>Multiple linear regression</td></tr>
<tr><td>P(Y) = 1 / (1 + e<sup>−(β₀ + β₁X₁ + …)</sup>)</td><td>Logistic regression</td></tr></table>
<p>Drill this with interleaved practice: <a href="#/labs/drill">Labs → Test picker drill</a>.</p>`,
  check:["m34","fv5","fv9","fv12"], explainBack:"Explain to a classmate how you'd decide between a t-test, one-way ANOVA, and logistic regression."
},
{
  id:"describe", title:"Describing data: mean, median, SD", mins:6, color:"var(--c2)",
  hook:"One billionaire walks into a bar. The mean income soars; the median doesn't move.",
  body:`
<p><b>Central tendency</b> = the "typical" value. <b>Variability</b> = how spread out values are.</p>
<div data-widget="skew"></div>
<div class="two">
<div class="callout"><h4>Mean</h4><p>Add up, divide by n. Uses every value's size, so it is <b>pulled toward the tail</b>. Use for symmetric (normal) data: sugar intake, height.</p></div>
<div class="callout"><h4>Median</h4><p>The middle value when sorted. Depends only on order, so it <b>resists outliers</b>. Use for skewed data: income, healthcare costs, wait times.</p></div>
</div>
<p><b>Quick skew check:</b> mean &gt; median → right-skewed (long tail of big values). County income: mean 57.8 &gt; median 53.9 → right skew.</p>
<p><b>Standard deviation</b> is the typical distance of observations from the mean. Small SD → values bunch together; large SD → spread out. "Quantify variability" on an exam = SD.</p>`,
  check:["m10","m15","m35","m33"], explainBack:"Why would a hospital report median wait time instead of mean wait time?"
},
{
  id:"slr", title:"Correlation & simple linear regression", mins:10, color:"var(--c3)",
  hook:"Drawing the best straight line through a cloud of points and reading what it says.",
  body:`
<div class="anatomy">
  <div class="eq big">Ŷ = <span class="tag t0">b₀</span> + <span class="tag t1">b₁</span>X</div>
  <div class="anat-key"><p><span class="tag t0">b₀ intercept</span> predicted Y when X = 0</p><p><span class="tag t1">b₁ slope</span> change in Y for every 1-unit increase in X</p></div>
</div>
<p>Example: <b>Minutes of sleep = 480 − 15 × (cups of coffee per day)</b>. Intercept 480: someone with no coffee is predicted to sleep 480 minutes. Slope −15: each extra daily cup → 15 fewer minutes.</p>
<h3>Play with it</h3>
<p>Click the plot to add points. Drag the sliders to generate new data. Watch how one far-away point can drag the line — that's an <b>influential observation</b>.</p>
<div data-widget="sandbox"></div>
<h3>Correlation vs regression</h3>
<table class="tbl"><tr><th></th><th>Correlation (r)</th><th>Simple linear regression</th></tr>
<tr><td>Question</td><td>Do X and Y move together? How strongly?</td><td>How much does Y change when X changes? Predict Y.</td></tr>
<tr><td>Output</td><td>r from −1 to +1</td><td>b₀, b₁, R², F</td></tr>
<tr><td>Variables</td><td>Both continuous, symmetric roles</td><td>Outcome Y, predictor X</td></tr>
<tr><td>Link</td><td colspan="2">In simple regression, R² = r². r = 0.5 → R² = 0.25 (25% explained)</td></tr></table>
<h3>Three numbers to interpret</h3>
<div class="three">
<div class="callout"><h4>F statistic</h4><p>Is the model better than just using the mean? <i>"The model with staffing is significantly better at explaining variance in clinic wait time than an intercept-only model (F(1, 228) = 64.0; p &lt; .001)."</i></p></div>
<div class="callout"><h4>R²</h4><p>Share of the outcome's variability explained. <i>"About 22% of the variability in wait time was explained by the model."</i></p></div>
<div class="callout"><h4>Slope</h4><p>t-test of H₀: slope = 0. <i>"For every additional staff member per shift, wait time decreased by 3.6 minutes (p &lt; .001)."</i></p></div>
</div>`,
  check:["m2","f1","m1"], explainBack:"In your own words: what's the difference between the intercept and the slope? Use an example from public health."
},
{
  id:"mlr", title:"Multiple linear regression", mins:18, color:"var(--c4)",
  hook:"Same line idea, more predictors — and every slope now comes with 'holding the others constant'.",
  body:`
<div class="eq big">Ŷ = b₀ + b₁X₁ + b₂X₂ + … + bₖXₖ</div>
<h3>The four steps</h3>
<div data-widget="pipeline"></div>
<h3>Step 1 · The assumptions</h3>
<p>Memory hook: <b>CINLHR + M</b>. Each card shows what passing and failing looks like.</p>
<div data-widget="assumptions"></div>
<p><b>If assumptions fail:</b> transform or recode variables and re-check; use a different model; or report descriptive and visual statistics instead.</p>
<h3>Step 2 · Run it</h3>
<pre class="code">model &lt;- lm(obesity_pct ~ inactive_pct + income_k + rural, data = counties)
summary(model)
# set a reference group for a categorical predictor if needed:
counties$rural &lt;- relevel(factor(counties$rural), ref = "no")</pre>
<h3>Step 3 · Outliers & influential values</h3>
<table class="tbl"><tr><th>Measure</th><th>What it catches</th><th>Cutoff</th><th>R</th></tr>
<tr><td>Standardized residual</td><td>Badly predicted Y (z-score of residual)</td><td>|z| &gt; 1.96 (some: &gt; 3)</td><td><code>rstandard()</code></td></tr>
<tr><td>Leverage</td><td>Unusual X values (0–1)</td><td>&gt; 2k/n, k = predictors + 1</td><td><code>hatvalues()</code></td></tr>
<tr><td>Cook's distance</td><td>Changes the fitted line when removed</td><td>&gt; 4/n (some: &gt; 1)</td><td><code>cooks.distance()</code></td></tr></table>
<div data-widget="cutoffs"></div>
<p>First check flagged rows for data entry errors. Example: a 60-minute wait typed as 600, or "2-3" visits stored as 23. Fix or remove problems, re-run, and report what you did.</p>
<h3>Step 4 · Interpret and report</h3>
<p>Hover or tap each piece of this R output to see what it means.</p>
<div data-widget="decoder"></div>
<h3>Hypotheses</h3>
<div class="two"><div class="callout"><h4>Overall model (F test)</h4><p>H₀: all coefficients = 0.<br>H<sub>A</sub>: at least one coefficient ≠ 0.<br><i>Plain language: the model explains more variability than chance.</i></p></div>
<div class="callout"><h4>Each predictor (t test)</h4><p>H₀: this coefficient = 0.<br>H<sub>A</sub>: this coefficient ≠ 0.<br><i>Significant → the variable helps explain the outcome.</i></p></div></div>
<p><b>Comparing models:</b> a partial F test checks whether a 4-variable model beats a 1-variable model: <code>anova(reduced, full)</code>. Significant → the full model is better.</p>
<div data-widget="sentence"></div>`,
  check:["m5","m17","m18","m19","f15"], explainBack:"Explain what 'holding other variables constant' means and why multiple regression needs it."
},
{
  id:"logistic", title:"Logistic regression", mins:20, color:"var(--c5)",
  hook:"When the outcome is yes/no, a straight line breaks. Bend it into an S.",
  body:`
<p>Public health outcomes are often binary: smoker/non-smoker, vaccinated/not, cancer yes/no. Code the outcome you want to predict as <b>1</b>.</p>
<h3>Why not a straight line?</h3>
<p>A line can predict probabilities below 0 or above 1. The fix is a <b>link function</b>: the <b>logit</b> (log-odds).</p>
<div data-widget="ladder"></div>
<ol class="steps"><li>The mean of a 0/1 variable is a probability: (1+0+1+1+0)/5 = 0.60.</li><li>Odds = p / (1 − p) range from 0 to ∞.</li><li>Log-odds ln[p/(1−p)] range from −∞ to +∞ — so we can set them equal to a regression equation: ln[p/(1−p)] = b₀ + b₁X₁.</li><li>Solve for p and you get the S-curve: <b>p = 1 / (1 + e<sup>−(b₀ + b₁X₁)</sup>)</b>.</li></ol>
<h3>Explore the S-curve</h3>
<div data-widget="sigmoid"></div>
<h3>What changes vs linear regression</h3>
<table class="tbl"><tr><th></th><th>Linear</th><th>Logistic (a GLM)</th></tr>
<tr><td>Outcome</td><td>Continuous</td><td>Binary 0/1</td></tr>
<tr><td>Estimation</td><td>OLS — minimize squared residuals</td><td>MLE — maximize probability of observed data</td></tr>
<tr><td>Linearity</td><td>X and Y</td><td>X and log-odds of Y</td></tr>
<tr><td>Normal outcome / errors?</td><td>Yes</td><td>No (errors still independent)</td></tr>
<tr><td>Coefficient</td><td>Change in Y</td><td>Change in log-odds → exp() = odds ratio</td></tr>
<tr><td>Test statistic</td><td>t</td><td>z (Wald)</td></tr>
<tr><td>R function</td><td><code>lm()</code></td><td><code>glm(..., family = binomial("logit"))</code></td></tr></table>
<h3>Other GLMs</h3>
<p>Binary → binary logistic · Ordinal → ordered logistic · 3+ unordered categories → multinomial logit · Skewed counts → Poisson / negative binomial.</p>
<h3>Odds ratios: say it right</h3>
<div class="two"><div class="callout ok"><h4>Say</h4><ul><li>"Regular exercisers have 35% lower odds of depression (OR = 0.65)."</li><li>"People with a provider have 2.34 times the odds of vaccination…"</li><li>"The odds are 1.03 times as high for every one-year increase in age."</li></ul></div>
<div class="callout bad"><h4>Avoid</h4><ul><li>"20% lower probability"</li><li>"3.1 times as likely"</li><li>"explains 31%"</li></ul></div></div>
<p><b>Percent change:</b> OR &gt; 1 → (OR − 1) × 100% higher odds. OR &lt; 1 → (1 − OR) × 100% lower odds. <b>Significant</b> when the 95% CI doesn't include 1.</p>
<div data-widget="forest"></div>
<h3>From probability to prediction</h3>
<p>Example: the vaccination model predicts p = 0.71 for a 65-year-old with a provider. Since 0.71 ≥ 0.50, it predicts <b>vaccinated</b>.</p>
<h3>Things that go wrong</h3>
<div data-widget="separation"></div>
<p><b>Parsimony:</b> only include predictors with explanatory benefit. Fit the full model, then remove ones that don't contribute.</p>
<h3>In R</h3>
<pre class="code">levels(factor(d$bikes_to_work))   # first level = reference group (coded 0)
m &lt;- glm(bikes_to_work ~ near_bike_lane + owns_car + commute_km + grew_up_cycling,
         data = d, family = binomial("logit"))
summary(m)                          # betas = log-odds, z values
exp(cbind(OR = coef(m), confint(m)))   # odds ratios + 95% CI
odds.n.ends::odds.n.ends(m)         # ORs, model chi-square, % correctly predicted</pre>`,
  check:["m3","m4","m6","m7","f3"], explainBack:"Explain why we take the log of the odds, and then why we exponentiate the coefficient again."
},
{
  id:"anova", title:"t-test, ANOVA family & chi-square", mins:10, color:"var(--c6)",
  hook:"Comparing group means — and what to do after the F-test says 'something differs'.",
  body:`
<div data-widget="anovaviz"></div>
<table class="tbl"><tr><th>Test</th><th>Outcome</th><th>Groups</th><th>Example</th></tr>
<tr><td>Independent t-test</td><td>Continuous</td><td>2 independent groups</td><td>Cholesterol: Drug A vs Drug B</td></tr>
<tr><td>Paired t-test</td><td>Continuous</td><td>Same people, 2 times</td><td>BP before vs after a program</td></tr>
<tr><td>One-way ANOVA</td><td>Continuous</td><td>1 factor, 3+ groups</td><td>Sodium intake across 4 age groups</td></tr>
<tr><td>Two-way ANOVA</td><td>Continuous</td><td>2 factors + interaction</td><td>Lung function by gender × smoking</td></tr>
<tr><td>Repeated measures ANOVA</td><td>Continuous</td><td>Same people, 3+ times</td><td>Anxiety at baseline, 3 mo, 6 mo</td></tr>
<tr><td>Chi-square</td><td>Categorical</td><td>Categorical</td><td>Vaccination by insurance status</td></tr></table>
<h3>ANOVA logic</h3>
<p>H₀: all group means are equal. <b>F = between-group variability ÷ within-group variability.</b> If groups differ a lot compared to the noise inside them, F is large.</p>
<p>Assumptions: continuous outcome, independent observations, normality within groups, <b>equal variances</b> (Levene's test). Repeated measures adds <b>sphericity</b>.</p>
<h3>Omnibus → post-hoc</h3>
<p>ANOVA's F is an <b>omnibus</b> test: it tells you <i>some</i> mean differs, not <i>which</i>. With 3+ groups, follow a significant F with <b>post-hoc</b> pairwise tests (Tukey HSD, Bonferroni) that control the Type I error inflation from many comparisons.</p>
<div data-widget="typeone"></div>
<h3>Two-way ANOVA: the interaction</h3>
<p>Two main effects + one interaction. An interaction means the effect of one factor depends on the other: e.g., smoking lowers lung function more in men than in women. On a plot, non-parallel lines = interaction.</p>`,
  check:["f4","f9","f6","m30"], explainBack:"Explain to a friend why we can't just run six t-tests instead of one ANOVA for four groups."
}
];

/* ---- Lessons added from Weeks 1–5 ---- */
LESSONS.splice(0, 0, {
  id: "biostats", title: "Biostats warm-up: testing basics", mins: 8, color: "var(--c6)",
  hook: "Before any model: what a hypothesis test actually does, and which simple test fits which question.",
  body: `
<h3>How every hypothesis test works</h3>
<ol class="steps"><li><b>Assume nothing is going on</b> (the null hypothesis: no difference, no association).</li><li><b>Measure how far the data are from 'nothing'</b> with a test statistic (t, F, χ², z).</li><li><b>Ask how surprising that is</b> if the null were true: the p-value.</li><li><b>Decide:</b> p &lt; .05 → reject the null ("statistically significant").</li><li><b>Then ask if it matters:</b> look at the effect size (difference, slope, OR, r). Significant ≠ important.</li></ol>
<h3>Parametric tests and their non-parametric partners</h3>
<p>Parametric tests assume roughly normal data. When data are skewed, ordinal, small, or full of outliers, use the rank-based partner.</p>
<table class="tbl"><tr><th>Question</th><th>Parametric (normal data)</th><th>Non-parametric</th></tr>
<tr><td>Two independent groups</td><td>Independent-samples t-test</td><td>Mann-Whitney U (Wilcoxon rank-sum)</td></tr>
<tr><td>Same people, two times</td><td>Paired t-test</td><td>Wilcoxon signed-rank</td></tr>
<tr><td>Sample vs known value</td><td>One-sample t-test</td><td>One-sample Wilcoxon</td></tr>
<tr><td>3+ groups</td><td>One-way ANOVA</td><td>Kruskal-Wallis</td></tr>
<tr><td>Two continuous variables</td><td>Pearson's r</td><td>Spearman's rho</td></tr>
<tr><td>Two categorical variables</td><td colspan="2">Chi-square (post-hoc: standardized residuals &gt; |1.96| when larger than 2×2)</td></tr></table>
<h3>Reading Pearson's r</h3>
<p>From −1 (perfect negative line) through 0 (no linear relationship) to +1 (perfect positive). It's an effect size: about ±.1 small, ±.3 medium, ±.6 large. Square it for the shared variance: r = .5 → 25%. And correlation is not causation.</p>
<h3>Population, sample, and the central limit theorem</h3>
<p>We measure a <b>sample</b> to learn about a <b>population</b>. The central limit theorem says that with a large enough sample, sample <i>means</i> are approximately normally distributed, which is why t-tests and regression work reasonably well in practice.</p>
<h3>Statistical vs practical significance</h3>
<div class="two"><div class="callout"><h4>Statistical</h4><p>Unlikely due to chance (p &lt; .05). Tells you <i>whether</i>.</p></div><div class="callout"><h4>Practical</h4><p>Big enough to matter. Tells you <i>how much</i>. Big samples make tiny effects significant.</p></div></div>
<p>Practice set with answers: <a href="#/exam/wk1/study">Biostatistics basics</a>.</p>`,
  check: ["b12", "b16", "b20", "b26"], explainBack: "Explain the difference between a p-value and an effect size, using the TV-and-BMI example."
});
LESSONS.splice(LESSONS.findIndex(l => l.id === "mlr"), 0, {
  id: "variables", title: "Variables, dummies & building a model", mins: 10, color: "var(--c1)",
  hook: "Regression only understands numbers. Here's how groups become numbers, and how to decide what goes in the model.",
  body: `
<h3>Four types of variables</h3>
<table class="tbl"><tr><th>Type</th><th>What it is</th><th>Examples</th><th>In a regression</th></tr>
<tr><td>Continuous</td><td>Numbers on a scale</td><td>Cups of coffee per day, commute distance, minutes of sleep</td><td>"For every one-unit increase…"</td></tr>
<tr><td>Binary</td><td>Two categories (0/1)</td><td>Smoking status, intervention group</td><td>"Compared to the 0 group…"</td></tr>
<tr><td>Categorical</td><td>Groups, no order</td><td>Race, gender</td><td>Dummy variables vs a reference</td></tr>
<tr><td>Ordinal</td><td>Ordered groups</td><td>Education, income brackets</td><td>Usually dummies; multi-item scales are usually treated as continuous</td></tr></table>
<h3>Dummy variables</h3>
<p>A variable with <b>k</b> categories becomes <b>k − 1</b> columns of 0s and 1s. The category without a column is the <b>reference group</b>, and every coefficient compares a category to it.</p>
<table class="tbl"><tr><th>Income</th><th>$25K–&lt;$50K dummy</th><th>$50K+ dummy</th></tr><tr><td>&lt;$25K (reference)</td><td>0</td><td>0</td></tr><tr><td>$25K–&lt;$50K</td><td>1</td><td>0</td></tr><tr><td>$50K+</td><td>0</td><td>1</td></tr></table>
<p class="takeaway">"Compared to the &lt;$25K group, households earning $50K or more ate on average 1.4 more servings of vegetables per day, holding all other variables constant."</p>
<p>Tip: if some categories have very few people, combine them (8 income brackets → 3).</p>
<h3>Reading a 0/1 coefficient</h3>
<div class="three"><div class="callout"><h4>6 − 2(vaccinated)</h4><p>Unvaccinated: 6 sick days a year. Vaccinated: 2 fewer (4).</p></div><div class="callout"><h4>118 + 6(smoker)</h4><p>Non-smokers: 118 mmHg. Smokers: 6 higher (124).</p></div><div class="callout"><h4>5,200 + 1,800(owns dog)</h4><p>Non-owners: 5,200 steps. Dog owners: 1,800 more (7,000).</p></div></div>
<h3>How variables enter the model</h3>
<table class="tbl"><tr><th>Method</th><th>How</th><th>Verdict</th></tr>
<tr><td>Hierarchical</td><td>You choose the order: known predictors first, new ones in a later block</td><td>Best: theory-driven; shows what new variables add</td></tr>
<tr><td>Forced entry</td><td>All at once</td><td>Fine with good theoretical reasons for each variable</td></tr>
<tr><td>Stepwise</td><td>Computer picks by semi-partial correlation</td><td>Exploration only</td></tr></table>
<p><b>Unadjusted vs adjusted:</b> the unadjusted model has only the predictor of interest; the adjusted model adds covariates such as demographics ("after adjusting for demographic factors…"). Report <b>adjusted R²</b> when you have several predictors: it only rises if a new predictor really helps.</p>
<p>Step by step: <a href="#/guides/dummy">Guide: categorical predictors</a>.</p>`,
  check: ["e2", "e11", "e13", "e14"], explainBack: "Explain why a variable with 4 categories needs only 3 dummy variables."
});
(function () {
  const m = LESSONS.find(l => l.id === "mlr");
  m.body = m.body.replace(`<p><b>If assumptions fail:</b>`, `<table class="tbl"><tr><th>Check</th><th>Tool</th><th>Rule</th></tr>
<tr><td>Independence</td><td>Study design</td><td>No test. Clusters (classrooms, families, same doctor, repeated measures) fail.</td></tr>
<tr><td>Normality</td><td>Histogram, Q-Q plot</td><td>Skewed? Transform: log, square root, cube root, inverse</td></tr>
<tr><td>Linearity</td><td>Scatterplot + LOESS</td><td>Continuous predictors only</td></tr>
<tr><td>Homoscedasticity</td><td>Breusch-Pagan</td><td><b>p &lt; .05 → NOT met</b></td></tr>
<tr><td>Independent residuals</td><td>Durbin-Watson</td><td><b>p &lt; .05 → NOT met</b></td></tr>
<tr><td>Normal residuals</td><td>Histogram of residuals</td><td>Bell-shaped</td></tr>
<tr><td>Multicollinearity</td><td>VIF or correlation</td><td><b>VIF &gt; 5 or r &gt; .7</b> → problem</td></tr></table>
<p>Full walkthrough: <a href="#/guides/assume">Guide: check the 7 assumptions</a>.</p>
<p><b>If assumptions fail:</b>`);
})();
(function () { const o = ["biostats", "describe", "choose", "slr", "variables", "mlr", "logistic", "anova"]; LESSONS.sort((a, b) => o.indexOf(a.id) - o.indexOf(b.id)); })();
