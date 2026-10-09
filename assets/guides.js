/* Step-by-step guides. Each: when, logic (why it works), visual (infographic HTML or widget), steps [title, plain text, code?], write (template ids), mistakes. */
const flow = (items) => `<div class="flow">${items.map(([k, v]) => `<div class="fl"><b>${k}</b><span>${v}</span></div>`).join("")}</div>`;

const GUIDES = [
{
  id: "approach", title: "How to approach any ALM question", group: "Start here", mins: 4,
  when: "Every time: on homework, on the exam, on your final project.",
  logic: "Almost every decision in this course follows from one fact: the type of outcome. Once you know the outcome type, the model, the assumptions, the output and the interpretation sentences all follow. So always start there, and don't touch R until you can say what the outcome is.",
  visual: flow([["Question", "What are we trying to learn?"], ["Outcome", "Continuous? Binary? Groups?"], ["Model", "lm, glm, ANOVA…"], ["Check", "Assumptions & outliers"], ["Explain", "Templates → plain words"]]),
  steps: [
    ["Restate the question in one sentence", "Write \"Does X predict Y among [who]?\" If you can't, reread the prompt. Underline the outcome."],
    ["Name the outcome and its type", "Continuous number (BMI, SBP, score) → linear family. Yes/no → logistic. Comparing group means → t-test or ANOVA. Two categorical variables → chi-square."],
    ["List the predictors and their types", "Continuous predictors get 'per one-unit' sentences. Group predictors get 'compared to the reference group' sentences."],
    ["Choose the model", "Use the test chooser if unsure. Say out loud why: \"because the outcome is ___.\""],
    ["Check assumptions before trusting results", "Linear: the 7 assumptions. Logistic: binary outcome, independence, linearity of the logit, no multicollinearity, no complete separation."],
    ["Run it and read the output top to bottom", "Model significance (F or χ²) → fit (R²) → each predictor (estimate, p, CI)."],
    ["Write it in plain language", "Use the answer templates. Every number you report gets a sentence that a non-statistician could follow."],
    ["Add meaning and limits", "What does this mean for public health? What can't it tell us (causation, unexplained variance)?"]
  ],
  write: ["t-choose", "t-writeup"],
  mistakes: ["Starting with R before deciding the model.", "Treating a yes/no outcome as continuous.", "Reporting numbers without a sentence explaining them."]
},
{
  id: "choose", title: "How to choose the right test", group: "Start here", mins: 5,
  when: "Section V of every exam, the first question of any analysis, the final project proposal.",
  logic: "Each test is built for a particular combination of outcome type and predictor type. Match the combination and you've matched the test. Words like 'typical', 'average' or 'variability' mean they want a descriptive statistic, not a test.",
  widget: "decider",
  steps: [
    ["Is it asking to describe or to test?", "'Typical value' or 'variability' → mean, median or SD. Anything with 'predict', 'compare', 'associated', 'differ' → a test."],
    ["Describing? Pick the statistic", "Symmetric data → mean. Skewed or outliers → median. Spread → standard deviation."],
    ["Testing? Identify the outcome type", "Continuous, binary, or categorical counts."],
    ["Continuous outcome: count groups or predictors", "2 groups → t-test. 3+ groups, 1 factor → one-way ANOVA. 2 factors → two-way ANOVA. Same people 3+ times → repeated measures ANOVA. 1 continuous predictor → simple linear regression (or correlation for strength only). 2+ predictors → multiple linear regression."],
    ["Binary outcome", "Logistic regression (chi-square if it's just two categorical variables in a table)."],
    ["Equation given?", "Y = b₀ + b₁X → simple linear. More b's → multiple linear. P(Y) = 1/(1 + e^−…) → logistic."],
    ["Write your justification", "\"I'd use ___ because the outcome is ___ and the predictors are ___.\""]
  ],
  write: ["t-choose"],
  mistakes: ["Picking correlation when the question says 'predict'.", "Picking one-way ANOVA for repeated measurements of the same people.", "Forgetting median for skewed 'typical' questions."]
},
{
  id: "slr", title: "How to run and interpret simple linear regression in R", group: "Linear regression", mins: 8,
  when: "One continuous outcome, one predictor (Weeks 2–3).",
  logic: "Regression draws the line that makes the squared distances from the points to the line as small as possible (least squares). Then three questions: is the line better than just using the mean (F)? How much does it explain (R²)? How steep is it, and is that slope different from 0 (t, CI)?",
  widget: "sandbox",
  steps: [
    ["Load the data and look at it", "Check the outcome is continuous. Make a scatterplot.", "clinics <- read.csv(\"clinic_waits.csv\")\nlibrary(ggplot2)\nggplot(clinics, aes(x = staff_per_shift, y = wait_min)) + geom_point() + geom_smooth(method = \"lm\")"],
    ["Fit the model", "Outcome on the left of ~, predictor on the right. Name the model so you can reuse it.", "wait.by.staff <- lm(formula = wait_min ~ staff_per_shift, data = clinics, na.action = na.exclude)"],
    ["Get the summary", "This prints the coefficients, R² and F.", "summary(wait.by.staff)"],
    ["Write the equation", "Read the Estimate column: Wait = 64.3 − 3.6(staff per shift)."],
    ["Interpret F", "F(1, 228) = 64.0, p < .001 → the model with staffing explains significantly more variance than an intercept-only model."],
    ["Interpret R²", "0.219 → about 22% of the variability in wait time is explained."],
    ["Interpret the slope with a CI", "Each extra staff member → 3.6 minutes shorter wait (95% CI −4.5 to −2.7). The CI excludes 0, so it's significant.", "confint(wait.by.staff)"]
  ],
  write: ["t-f", "t-r2", "t-slope-c", "t-ci", "t-int"],
  mistakes: ["Swapping outcome and predictor in the formula.", "Reporting R² as a decimal without saying 'percent of variability explained'.", "Interpreting a non-significant intercept as a finding."]
},
{
  id: "dummy", title: "How to use categorical predictors (dummy variables)", group: "Linear regression", mins: 6,
  when: "Any predictor that is a group: gender, urban/non-urban, income bracket, race.",
  logic: "Regression needs numbers, so each category becomes a 0/1 'dummy' column, except one: the reference group. Every dummy's coefficient is the difference between that group and the reference, holding the other predictors constant.",
  visual: `<table class="tbl"><tr><th>Income</th><th>dummy: $25K–&lt;$50K</th><th>dummy: $50K+</th></tr><tr><td>&lt;$25K (reference)</td><td>0</td><td>0</td></tr><tr><td>$25K–&lt;$50K</td><td>1</td><td>0</td></tr><tr><td>$50K+</td><td>0</td><td>1</td></tr></table><p class="small">3 categories → 2 dummies. The reference is the row of all zeros.</p>`,
  steps: [
    ["Count the categories (k)", "You need k − 1 dummy variables. R makes them for you when the variable is a factor."],
    ["Choose a sensible reference group", "Usually the largest group, the 'unexposed' group, or the natural baseline (lowest income). Check what R chose with levels(); the first level is the reference.", "levels(factor(d$income))\nd$income <- relevel(factor(d$income), ref = \"<$25K\")"],
    ["Check the cell sizes", "Very small categories give unstable estimates. Combine sparse categories (e.g., merge 8 income brackets into 3)."],
    ["Run the model", "Each non-reference category appears as its own row, e.g., urbanyes.", "lm(wait_min ~ staff_per_shift + urban, data = clinics, na.action = na.exclude)"],
    ["Interpret each dummy against the reference", "\"Compared to non-urban clinics, urban clinics' waits were 7.5 minutes longer, controlling for staffing (p < .001).\""]
  ],
  write: ["t-slope-g", "t-dummy", "t-int"],
  mistakes: ["Saying 'for each one-unit increase in gender'.", "Comparing two non-reference groups to each other using their coefficients.", "Forgetting which group is the reference."]
},
{
  id: "assume", title: "How to check the 7 assumptions of linear regression", group: "Linear regression", mins: 10,
  when: "Step 1 of every linear regression. Project walkthrough, Q3.",
  logic: "Regression's p-values and CIs are only trustworthy if the data behave the way the math assumes. Each assumption has a quick check; a few have a formal test where p < .05 means 'failed'. If something fails: transform and re-check, use a different model, or report descriptives instead.",
  widget: "assumptions",
  steps: [
    ["C · Continuous outcome", "Look at the variable. Is it a number on a scale? Make a histogram.", "hist(d$BMI)"],
    ["I · Independent observations", "No test; judge the study design. It fails for students in classrooms, siblings in families, patients of the same doctor, repeated measures of a person."],
    ["N · Normal continuous variables", "Histograms or Q-Q plots of each continuous variable. Skewed? Try log, square root, cube root or inverse, then re-check.", "qqnorm(d$BMI); qqline(d$BMI)\nd$logBMI <- log(d$BMI)"],
    ["L · Linearity", "Scatterplot of each continuous predictor with the outcome plus a LOESS curve. A bending curve = not linear. Doesn't apply to categorical predictors.", "ggplot(d, aes(Age, BMI)) + geom_point() + geom_smooth(method = \"loess\") + geom_smooth(method = \"lm\", color = \"red\")"],
    ["H · Homoscedasticity", "Breusch-Pagan test. Null = constant variance, so p < .05 → NOT met.", "lmtest::bptest(model)"],
    ["R · Residuals independent and normal", "Durbin-Watson: null = independent, so p < .05 → NOT met. Then a histogram of residuals should look bell-shaped.", "lmtest::dwtest(model)\nhist(residuals(model))"],
    ["M · No perfect multicollinearity", "VIF > 5 or correlation between predictors > .7 is a problem. Options: drop one, combine, or keep if you aren't interpreting those coefficients.", "car::vif(model)\ncor(d[, c(\"Age\", \"Poverty\")], use = \"complete.obs\")"],
    ["Summarize what passed and failed", "One sentence listing which were met and which weren't, plus what you did about it."]
  ],
  write: ["t-assume", "t-mc"],
  mistakes: ["Reading Breusch-Pagan or Durbin-Watson backwards: p < .05 means the assumption FAILED.", "Checking linearity for a categorical predictor.", "Not saying what you did after a failure."]
},
{
  id: "outliers", title: "How to find outliers and influential values", group: "Linear regression", mins: 8,
  when: "Step 3 of every linear regression. Project walkthrough Q5 and the diagnostics practice set.",
  logic: "Three different measures catch three different problems. Standardized residuals catch points the line predicts badly. Leverage catches unusual predictor values. Cook's distance catches points that actually move the line. A point that trips several measures deserves the closest look.",
  widget: "cutoffs",
  steps: [
    ["Add the three diagnostics to your data", "One new column per measure.", "diag <- clinics %>%\n  mutate(standardres = rstandard(model),\n         lever = hatvalues(model),\n         cooks.dist = cooks.distance(model))"],
    ["Compute the cutoffs", "Standardized residuals: |z| > 1.96. Leverage: 2k/n, k = predictors + 1. Cook's D: 4/n."],
    ["Filter the flagged rows", "Count each list.", "diag %>% filter(abs(standardres) > 1.96)\ndiag %>% filter(lever > 2 * (4 + 1) / n())\ndiag %>% filter(cooks.dist > 4 / n())"],
    ["Find the 'problem' observations", "Rows flagged on more than one measure (e.g., residual AND Cook's D) are your problem list.", "problems <- diag %>% filter(abs(standardres) > 1.96 & cooks.dist > 4 / n())"],
    ["Characterize them", "Compare their values to the sample means. Add the predicted value to see over- or under-prediction.", "problems %>% mutate(predicted = predict(model, newdata = .)) %>%\n  select(clinic, wait_min, predicted, staff_per_shift, urban)\nsummary(clinics)"],
    ["Answer 'actual vs predicted' questions", "Residual = actual − predicted. Positive residual → actually further than predicted; negative → closer than predicted."],
    ["Look for data entry errors", "A 60-minute wait typed as 600; \"2-3\" stored as 23. Correct or remove real errors, re-run the model, report what changed."],
    ["Decide and report", "No errors? Keep them and say so. Expect ~5% beyond ±1.96 by chance, so 4–5% flagged is normal."]
  ],
  write: ["t-outliers"],
  mistakes: ["Deleting outliers just because they're flagged.", "Using the wrong k (it's predictors + 1).", "Forgetting to say what characterized the flagged points."]
},
{
  id: "mlr-report", title: "How to interpret and report multiple regression", group: "Linear regression", mins: 8,
  when: "Step 4 of every regression; every 'interpret the output' question.",
  logic: "Read the output in the same order every time so nothing gets missed. Every slope in multiple regression is a 'holding the others constant' slope, so the phrase isn't optional.",
  widget: "decoder",
  steps: [
    ["State the model and sample", "\"A multiple linear regression examined whether X1, X2 and X3 were associated with Y among n participants.\" Use the n after missingness."],
    ["Model significance: F", "F(df1, df2) = __, p __ → better than an intercept-only model?"],
    ["Model fit: adjusted R²", "As a percent of variability explained."],
    ["Each predictor, one sentence each", "Value, direction, significance, CI. Continuous → per one-unit. Group → compared to reference. Non-significant → 'was not significantly associated'."],
    ["Assumptions sentence", "Which passed, which failed, what you did."],
    ["Outliers sentence", "How many, cutoffs, what characterized them, kept or removed."],
    ["Limitation and meaning", "Observational = association. Low R² = much unexplained. Public health takeaway."]
  ],
  write: ["t-writeup", "t-f", "t-r2", "t-slope-c", "t-slope-g", "t-ns", "t-assume", "t-outliers"],
  mistakes: ["Dropping the minus sign on a negative coefficient.", "Using Multiple R² instead of adjusted R² for multiple regression.", "Comparing raw betas across different units to pick the 'strongest'."]
},
{
  id: "logistic", title: "How to run and interpret logistic regression", group: "Logistic regression", mins: 10,
  when: "Any yes/no outcome. The bike-commute logistic activity.",
  logic: "A straight line can predict impossible probabilities, so logistic regression models the log-odds instead, which can take any value. The coefficients are therefore on the log-odds scale; exponentiate them to get odds ratios, which are what you interpret.",
  widget: "sigmoid",
  steps: [
    ["Code the outcome 0/1", "1 = the outcome you're predicting (smoker = 1 to predict smoking; quit = 1 to predict cessation). Treat 'Pass' or 'Don't know' as missing."],
    ["Check the levels and reference groups", "The first level is the reference (coded 0).", "levels(factor(d$bikes_to_work))"],
    ["Check the assumptions", "Binary outcome; independence; linearity of the logit for continuous predictors; no multicollinearity (VIF); no complete separation (cross-tab each categorical predictor with the outcome); ~10 events per predictor.", "table(d$near_bike_lane, d$bikes_to_work)\ncar::vif(m)"],
    ["Fit the model", "glm with family = binomial.", "m <- glm(bikes_to_work ~ near_bike_lane + owns_car + commute_km + grew_up_cycling,\n         data = d, family = binomial(\"logit\"))\nsummary(m)"],
    ["Get odds ratios and CIs", "Exponentiate.", "exp(cbind(OR = coef(m), confint(m)))\nodds.n.ends::odds.n.ends(m)"],
    ["Model significance", "Model chi-square (null deviance − residual deviance) with its p-value: is the model better than baseline?"],
    ["Interpret each OR", "OR > 1: (OR − 1)×100% higher odds. OR < 1: (1 − OR)×100% lower odds. Significant if the CI excludes 1. Use 'odds', never 'likely'."],
    ["Optional: predicted probability", "Plug values into P = 1/(1 + e^−(b₀ + b₁X₁ + …)). Above .50 → predicted to have the outcome."]
  ],
  write: ["t-or-c", "t-or-low", "t-or-g", "t-or-ns", "t-or-get", "t-prob", "t-h-log"],
  mistakes: ["Interpreting the raw β as an odds ratio.", "Saying 'times as likely' or 'probability' for an OR.", "Ignoring a warning about fitted probabilities of 0 or 1 (complete separation)."]
},
{
  id: "or", title: "How to read an odds ratio and its confidence interval", group: "Logistic regression", mins: 4,
  when: "Any OR table: Practice exam A Q6, Q22; Practice exam B Q3, Q18–19, Q25.",
  logic: "An OR of 1 means the odds are the same in both groups. So the only questions are: which side of 1 is it on, how far, and does the CI stay on that side?",
  widget: "forest",
  steps: [
    ["Which side of 1?", "> 1 = higher odds (risk). < 1 = lower odds (protective). = 1 = none."],
    ["How much?", "Above 1: (OR − 1) × 100% higher. Below 1: (1 − OR) × 100% lower. Big ORs: say 'times the odds' (3.0 times)."],
    ["Does the CI cross 1?", "Both ends above 1 or both below 1 → significant. One end on each side → not significant, no matter how big the OR."],
    ["Per what?", "Continuous: per one unit (scale up with OR^k). Group: compared to the reference group."],
    ["Write the sentence", "Use the OR templates."]
  ],
  write: ["t-or-c", "t-or-low", "t-or-g", "t-or-ns", "t-orrange"],
  mistakes: ["'1.3% higher odds' for OR = 1.3 (it's 30%).", "Calling OR = 22 significant when its CI is 0.9–152."]
},
{
  id: "anova", title: "How to answer ANOVA questions", group: "Groups & ANOVA", mins: 6,
  when: "Comparing means of a continuous outcome across groups (ANOVA unit).",
  logic: "ANOVA asks whether the differences between group means are large compared to the natural spread within groups (F = between ÷ within). It tells you that something differs, not what, so a post-hoc test follows when there are 3+ groups.",
  widget: "anovaviz",
  steps: [
    ["Count the factors and check for repeated measures", "1 factor → one-way. 2 factors → two-way (main effects + interaction). Same people 3+ times → repeated measures."],
    ["State the hypotheses", "H₀: all means equal. Hₐ: at least one differs."],
    ["Check assumptions", "Continuous outcome, independence (except repeated measures), normality within groups, equal variances (Levene's test); sphericity for repeated measures."],
    ["Read the F", "F(df1, df2) = __, p __."],
    ["If significant with 3+ groups, run post-hoc tests", "Tukey HSD or Bonferroni to find which pairs differ.", "TukeyHSD(aov(Y ~ group, data = d))"],
    ["Two-way: interpret the interaction first", "A significant interaction means the effect of one factor depends on the other."]
  ],
  write: ["t-h-anova", "t-anova", "t-2way", "t-omni", "t-posthoc"],
  mistakes: ["Stopping at a significant F without post-hoc tests.", "Using one-way ANOVA when the same people are measured repeatedly."]
},
{
  id: "essay", title: "How to write a short-answer or essay response", group: "Writing", mins: 4,
  when: "Section IV of the exams, homework write-ups.",
  logic: "Graders look for specific elements (the rubric). A predictable structure makes sure each one is there: define, explain why, give a concrete public health example, connect to what you'd do next.",
  visual: flow([["Define", "Plain-language definition"], ["Why", "Why it matters / when used"], ["Example", "Specific public health case"], ["So what", "Follow-up, limitation or implication"]]),
  steps: [
    ["Answer the question in your first sentence", "No warm-up. \"Multicollinearity is…\""],
    ["Explain why or when", "The logic: why the method exists or what goes wrong without it."],
    ["Give a concrete public health example", "Name real variables: 'HbA1c at baseline, 6 and 12 months', not 'some outcome over time'."],
    ["Mention the follow-up or limitation", "Post-hoc tests, assumptions, causation."],
    ["Respect the length", "\"40 words or less\" means it. \"1 paragraph\" ≈ 4–6 sentences."],
    ["Check against the rubric", "In this site, tick the rubric boxes after comparing with the model answer."]
  ],
  write: ["t-omni", "t-posthoc", "t-orrange", "t-ph"],
  mistakes: ["Giving a vague example with no variables.", "Writing everything you know instead of what was asked."]
},
{
  id: "design", title: "How to design a study (essay & final project)", group: "Writing", mins: 6,
  when: "Study-design essay questions; a project proposal and final project.",
  logic: "Your outcome's type determines the analysis. A good design names the outcome, the main predictor, the confounders and the data source, then matches the model to the outcome.",
  visual: flow([["Question", "Does X predict Y in population P?"], ["Data", "Source, sample, n"], ["Variables", "Y + type, X, confounders"], ["Analysis", "Model matched to Y"], ["Checks", "Assumptions, limitations"]]),
  steps: [
    ["Write a focused research question", "Does [exposure] predict [outcome] among [population]?"],
    ["Choose a data source", "Existing data (NHANES, BRFSS, EHR, county data) or new data (survey)."],
    ["Describe the sample", "Who, where, when, roughly how many, inclusion criteria."],
    ["Name the outcome and its type", "This picks your model: continuous → linear, binary → logistic, group means → ANOVA."],
    ["Name the main predictor and the confounders", "Confounders relate to both the exposure and the outcome (age, sex, income, insurance…)."],
    ["State the analysis and checks", "Model, assumptions you'll check, what you'll report (β or OR with 95% CI)."],
    ["Name one limitation", "E.g., observational → association, not causation; self-selection; missing data."]
  ],
  write: ["t-design", "t-choose"],
  mistakes: ["A binary outcome analyzed with linear regression.", "No confounders listed.", "No data source."]
}
];
