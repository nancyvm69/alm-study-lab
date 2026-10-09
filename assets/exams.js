/* ALM Study Lab — PUBLIC question bank.
   All questions, scenarios and numbers here are original practice material written for this site.
   Same question ids as the private version so lessons, guides and templates link correctly. */

const R = (s) => `<pre class="rout">${s}</pre>`;
const TESTS_A = ["mean","median","standard deviation","t test","chi square","anova","two way anova","logistic regression","correlation","linear regression"];
const TESTS_B = ["mean","median","standard deviation","t-test","chi square","simple linear regression","multiple linear regression","logistic regression","one-way ANOVA","two-way ANOVA","repeated measures ANOVA"];

const EXAMS = [
/* ============================================================ PRACTICE EXAM A */
{
  id: "midway", title: "Practice exam A", blurb: "Correlation, simple & multiple regression, logistic regression, assumptions, choosing a test.",
  sections: [
  { title: "Section I · Multiple choice", questions: [
    { id:"m1", num:1, type:"mc", tags:["correlation","choose-test"],
      prompt:"A researcher measures the association between daily screen time (hours) and a sleep quality score (0–21). A <b>correlation</b> is appropriate because both variables:",
      options:["Are continuous","Are categorical","Are normally distributed","Have equal variances"], answer:0,
      explain:`<ol class="steps"><li><b>Identify the variables.</b> Hours of screen time and a 0–21 score are both numbers on a scale: continuous.</li><li><b>What correlation needs:</b> two continuous variables; r runs from −1 to +1.</li><li><b>Rule out the rest.</b> Two categorical variables → chi-square. Normality is an extra condition for Pearson's r, not the reason to choose it. Equal variances is an ANOVA/t-test idea.</li></ol><p class="takeaway">Both continuous → correlation or regression. Both categorical → chi-square.</p>` },
    { id:"m2", num:2, type:"mc", tags:["slr"],
      prompt:"A simple linear regression predicts daily ER visits for heat illness from the day's maximum temperature (°F). The <b>intercept</b> is:",
      options:["The predicted number of heat-illness visits when the maximum temperature is 0 °F","The change in visits for each one-degree increase in temperature","The correlation between visits and temperature","The variance of daily visits"], answer:0,
      explain:`<ol class="steps"><li>Visits = b<sub>0</sub> + b<sub>1</sub>(Temperature).</li><li>Set temperature to 0 → Visits = b<sub>0</sub>. The intercept is the prediction when X = 0.</li><li>Here 0 °F is far outside the data, so the intercept has no practical meaning. That's common and fine to say.</li><li>Option B describes the slope.</li></ol>` },
    { id:"m3", num:3, type:"mc", tags:["logistic"],
      prompt:"In a logistic regression predicting flu vaccination (1 = vaccinated), the coefficient β for age represents:",
      options:["The change in the odds of vaccination per year of age","The change in the log-odds of vaccination per year of age","The change in the probability of vaccination per year of age","The probability of vaccination at age 1"], answer:1,
      explain:`<ol class="steps"><li>The model is linear on the log-odds scale: ln[p/(1−p)] = b<sub>0</sub> + b<sub>1</sub>(age).</li><li>So a one-year increase changes the <b>log-odds</b> by β.</li><li>e<sup>β</sup> is the odds <i>ratio</i> (a multiplicative change). The change in probability isn't constant along the S-curve.</li></ol>` },
    { id:"m4", num:4, type:"mc", tags:["odds-ratio"],
      prompt:"An odds ratio of 1.6 for living within 150 m of a highway and childhood asthma means:",
      options:["Highway proximity explains 16% of asthma cases","Living near a highway raises the odds of asthma by 1.6%","Children living near a highway have 1.6 times the odds of asthma compared to those who don't","The probability of asthma near a highway is 1.6"], answer:2,
      explain:`<ol class="steps"><li>OR = odds(exposed) ÷ odds(unexposed) = 1.6.</li><li>1.6 times the odds = (1.6 − 1) × 100 = <b>60% higher odds</b>.</li><li>A: ORs don't measure "% explained". B: it's 60%, not 1.6%. D: a probability can't exceed 1.</li></ol>` },
    { id:"m5", num:5, type:"mc", tags:["multicollinearity","mlr"],
      prompt:"A model predicts systolic blood pressure from body weight (kg), BMI, hours of sleep, and number of siblings. Which pair is <b>most likely</b> to be collinear?",
      options:["Hours of sleep and number of siblings","Body weight and BMI","BMI and number of siblings","None are likely to be collinear"], answer:1,
      explain:`BMI is calculated from weight (kg ÷ height²), so the two rise together almost in lockstep. With both in the model, standard errors inflate and the coefficients become unstable. Check VIF; keep one.` },
    { id:"m6", num:6, type:"circle", tags:["odds-ratio","ci"],
      prompt:"Select the odds ratios that are statistically significant.",
      options:["OR 4.5 (CI 0.8 – 25.0)","OR 0.42 (CI 0.25 – 0.71)","OR 1.8 (CI 1.1 – 2.9)","OR 0.95 (CI 0.60 – 1.50)"], answer:[1,2],
      explain:`<ol class="steps"><li>Rule: significant when the 95% CI does <b>not include 1</b>.</li><li>4.5 (0.8–25.0): crosses 1 → not significant, despite the large OR.</li><li>0.42 (0.25–0.71): all below 1 → significant (58% lower odds).</li><li>1.8 (1.1–2.9): all above 1 → significant.</li><li>0.95 (0.60–1.50): crosses 1 → not significant.</li></ol>` },
    { id:"m7", num:7, type:"mc", tags:["logistic","separation"],
      prompt:"A logistic model predicts whether an athlete is a professional jockey or a professional basketball player from height. It classifies everyone perfectly. Which logistic-specific problem is this?",
      options:["Complete separation","Over-dispersion","Heteroscedasticity","Non-linearity"], answer:0,
      explain:`Every jockey is shorter than every basketball player, so one height cut-point splits the groups perfectly. Maximum likelihood pushes the slope toward infinity and the estimates and SEs become meaningless. Perfect prediction in logistic regression is a warning sign, not a success.` }
  ]},
  { title: "Section II · Fill in the blank", questions: [
    { id:"m8", num:8, type:"blank", tags:["choose-test","slr"], prompt:"When the outcome is a number on a continuous scale (e.g., cholesterol), you use ________ regression.", accept:["linear","multiple linear","simple linear","ols"], display:"linear", explain:`Linear regression (simple or multiple) handles continuous outcomes.` },
    { id:"m9", num:9, type:"blank", tags:["logistic","choose-test"], prompt:"When the outcome is yes/no (e.g., hospitalized), you use ________ regression.", accept:["logistic","binary logistic","binomial logistic"], display:"logistic", explain:`Logistic regression models a 0/1 outcome.` },
    { id:"m10", num:10, type:"blank", tags:["descriptive"], prompt:"The ________ is pulled toward extreme values.", accept:["mean","the mean","average"], display:"mean", explain:`Example: hospital bills $2k, $3k, $3k, $4k, $90k → mean $20.4k, median $3k.` },
    { id:"m15", num:15, type:"blank", tags:["descriptive"], prompt:"The ________ is a typical value that resists extreme values.", accept:["median","the median"], display:"median", explain:`It depends only on the middle position.` },
    { id:"m16", num:16, type:"blank", tags:["logistic"], prompt:"Where lm() output shows a t value, glm() logistic output shows a ________ value.", accept:["z","z statistic","z value","wald","wald z","z-value","z-statistic"], display:"z (Wald z)", explain:`Both are estimate ÷ standard error.` }
  ]},
  { title: "Section III · R output, linear", intro: `<p>Questions 17–20: sleep quality score (0–21, higher = better) predicted by caffeine (mg/day), exercise (minutes/day), and shift work (yes/no).</p>` + R(`Call:
lm(SleepQuality ~ caffeine_mg + exercise_min + shift_work)

Coefficients:
(Intercept)     14.20   (SE = 1.80,  p < 0.001)
caffeine_mg     -0.012  (SE = 0.004, p = 0.003)
exercise_min     0.035  (SE = 0.015, p = 0.02)
shift_workyes   -1.40   (SE = 0.62,  p = 0.025)

Residual standard error: 3.1
Multiple R-squared: 0.27`), questions: [
    { id:"m17", num:17, type:"short", tags:["mlr","interpret"], prompt:"Interpret the coefficient for shift work.",
      model:`Shift workers have sleep quality scores that are, on average, <b>1.40 points lower</b> than non-shift workers, holding caffeine intake and exercise constant (b = −1.40, SE = 0.62, p = .025).`,
      rubric:["Direction (lower)","Size (1.40 points)","Compared to non-shift workers","Holding others constant","Significant (p = .025)"],
      explain:`<ol class="steps"><li>shift_workyes is a yes/no variable → the coefficient is a group difference, with "no" as the reference.</li><li>Negative sign → lower.</li><li>p = .025 &lt; .05 → significant.</li></ol>` },
    { id:"m18", num:18, type:"short", tags:["mlr","interpret"], prompt:"Interpret the coefficient for caffeine.",
      model:`For every additional milligram of caffeine per day, sleep quality <b>decreases by 0.012 points</b>, holding exercise and shift work constant (b = −0.012, p = .003). That's about <b>1.2 points per 100 mg</b> (roughly one cup of coffee).`,
      rubric:["Per one-unit (mg) increase","Decrease of 0.012","Holding others constant","Significant","(bonus) rescaled to a meaningful unit"],
      explain:`Tiny per-unit slopes often come from small units. Multiply by a sensible amount (100 mg) to make it meaningful.` },
    { id:"m19", num:19, type:"short", tags:["r2"], prompt:"What does R² = 0.27 tell you?",
      model:`About <b>27% of the variability</b> in sleep quality is explained by the model including caffeine, exercise, and shift work; 73% is unexplained.`, rubric:["27%","variability in sleep quality","explained by the model"], explain:`R² × 100 = percent explained.` },
    { id:"m20", num:20, type:"short", tags:["significance"], prompt:"Which predictors are significant at α = .05?",
      model:`<b>All three:</b> caffeine (p = .003), exercise (p = .02), and shift work (p = .025).`, rubric:["Caffeine","Exercise","Shift work"], explain:`Each p &lt; .05. The intercept isn't a predictor.` }
  ]},
  { title: "Section III · R output, logistic", intro:`<p>Questions 21–22: flu vaccination this season (1 = yes) predicted by age (years) and having a regular healthcare provider (yes/no).</p>` + R(`Call:
glm(vaccinated ~ age + has_provider, family = binomial)

Coefficients:
(Intercept)      -1.90  (SE = 0.50, p < 0.001)
age               0.03  (SE = 0.01, p = 0.003)
has_provideryes   0.85  (SE = 0.22, p < 0.001)

Null deviance: 812.4
Residual deviance: 741.9`), questions:[
    { id:"m21", num:21, type:"short", tags:["logistic","odds-ratio"], prompt:"How do you obtain odds ratios from this output? Compute them.",
      model:`<b>Exponentiate the coefficients:</b> OR = e<sup>β</sup>. Age: e<sup>0.03</sup> = 1.030. Provider: e<sup>0.85</sup> = 2.34. In R: <code>exp(coef(model))</code> and <code>exp(confint(model))</code>, or <code>odds.n.ends(model)</code>.`,
      rubric:["Exponentiate","Correct ORs","R code"], explain:`Raw β = log-odds. e<sup>β</sup> = odds ratio.` },
    { id:"m22", num:22, type:"short", tags:["odds-ratio","interpret"], prompt:"Interpret the age and provider odds ratios.", pre: R(`                  OR     2.5%   97.5%
(Intercept)     0.150   0.056   0.399
age             1.030   1.010   1.051
has_provideryes 2.340   1.520   3.601`),
      model:`<p><b>Age:</b> each additional year of age is associated with <b>3% higher odds</b> of flu vaccination, holding provider status constant (OR = 1.03, 95% CI 1.01–1.05). Over 10 years: 1.03<sup>10</sup> ≈ 1.35 times the odds.</p><p><b>Provider:</b> people with a regular provider have <b>2.34 times the odds</b> of being vaccinated compared to those without one, holding age constant (OR = 2.34, 95% CI 1.52–3.60).</p><p>Both CIs exclude 1 → both significant.</p>`,
      rubric:["Odds language","Age: 3% per year","Provider: 2.34× vs no provider","Holding the other constant","CIs exclude 1"], explain:`(OR − 1) × 100 for a percent; "times the odds" for big ORs; never "times as likely".` }
  ]},
  { title: "Section IV · Short answer", questions:[
    { id:"m26", num:26, type:"short", tags:["multicollinearity"], prompt:"In 40 words or less: what problem occurs when two predictors are highly correlated with each other?",
      model:`Multicollinearity: the model can't separate the predictors' unique effects, so standard errors inflate, confidence intervals widen, and coefficients become unstable or can even flip sign.`,
      rubric:["Names multicollinearity","Predictors correlated with each other","Consequence (SEs / instability)","≤ 40 words"], explain:`Detect with VIF (&gt; 5) or correlations (&gt; .7).` },
    { id:"m27", num:27, type:"short", tags:["assumptions-mlr"], prompt:"List the assumptions you'd check before trusting a multiple linear regression.",
      model:`<ol><li>Continuous outcome</li><li>Independent observations</li><li>Normally distributed continuous variables</li><li>Linearity (continuous predictors vs outcome)</li><li>Homoscedasticity (constant variance)</li><li>Independent, normally distributed residuals</li><li>No perfect multicollinearity</li></ol>`,
      rubric:["Continuous outcome","Independence","Normality","Linearity","Homoscedasticity","Residuals","Multicollinearity"], explain:`Memory hook: <b>CINLHR + M</b>.` },
    { id:"m28", num:28, type:"short", tags:["assumptions-logistic"], prompt:"Name three conditions a logistic regression should meet.",
      model:`Binary outcome; independent observations; linearity between continuous predictors and the log-odds; no multicollinearity; no complete separation; roughly 10+ events per predictor.`,
      rubric:["Binary outcome","Independence","Linearity of the logit","No multicollinearity / separation"], explain:`Logistic doesn't need a normal outcome, normal errors, or a straight X–Y line.` },
    { id:"m29", num:29, type:"short", tags:["logistic","equations"], prompt:"Write the general equation for the probability of an outcome with three predictors.",
      model:`<div class="eq">P(Y) = 1 / (1 + e<sup>−(b<sub>0</sub> + b<sub>1</sub>X<sub>1</sub> + b<sub>2</sub>X<sub>2</sub> + b<sub>3</sub>X<sub>3</sub>)</sup>)</div>`,
      rubric:["1 / (1 + e…)","Negative exponent","Linear part with three b's"], explain:`Linear part → negative exponent → 1/(1 + …). The result is always between 0 and 1.` },
    { id:"m30", num:30, type:"short", tags:["anova","omnibus"], prompt:"What does an omnibus test tell you, and what doesn't it tell you? Give an example.",
      model:`It tells you whether there is <b>any</b> overall difference or effect, but not <b>where</b>. Example: a one-way ANOVA comparing mean daily steps across five neighborhoods; a significant F means at least one neighborhood differs, and post-hoc tests (e.g., Tukey) show which. The regression F-test is also omnibus.`,
      rubric:["Any overall effect","Not where","Concrete example","Follow-up step"], explain:`"Omnibus" = for all.` },
    { id:"m31", num:31, type:"short", tags:["anova","posthoc"], prompt:"When are post-hoc tests needed? Give a specific example.",
      model:`After a <b>significant omnibus test with three or more groups</b>, to find which pairs differ while controlling the extra Type I error from many comparisons. Example: ANOVA shows mean HbA1c differs across three diet programs, F(2, 147) = 6.3, p = .002; Tukey HSD shows the low-carb group differs from the standard-diet group.`,
      rubric:["After significant omnibus","3+ groups","Which pairs","Type I error control","Example"], explain:`Tukey, Bonferroni, Games-Howell, Dunn.` }
  ]},
  { title: "Section V · Choose the test", intro:`<p>Options: ${TESTS_A.join(", ")}.</p>`, questions:[
    { id:"m32", num:32, type:"pick", options:TESTS_A, answer:["linear regression"], tags:["choose-test"], prompt:"Daily sodium intake (mg) and age predict LDL cholesterol (mg/dL).", explain:`Continuous outcome, two predictors → <b>(multiple) linear regression</b>.` },
    { id:"m33", num:33, type:"pick", options:TESTS_A, answer:["standard deviation"], tags:["choose-test","descriptive"], prompt:"Describe how spread out residents' daily step counts are.", explain:`Spread → <b>standard deviation</b>.` },
    { id:"m34", num:34, type:"pick", options:TESTS_A, answer:["logistic regression"], tags:["choose-test"], prompt:"Model the probability of missing a clinic appointment (yes/no) from travel distance and insurance type.", explain:`Binary outcome → <b>logistic regression</b>.` },
    { id:"m35", num:35, type:"pick", options:TESTS_A, answer:["median"], tags:["choose-test","descriptive"], prompt:"Report the typical hospital bill when a few bills are extremely large.", explain:`Skewed → <b>median</b>.` },
    { id:"m36", num:36, type:"pick", options:TESTS_A, answer:["mean"], tags:["choose-test","descriptive"], prompt:"Report the average adult height in a sample where height is normally distributed.", explain:`Symmetric → <b>mean</b>.` }
  ]}
  ]
},

/* ============================================================ PRACTICE EXAM B */
{
  id: "final", title: "Practice exam B", blurb: "Regression, logistic, ANOVA family, odds ratios, study design essay, 13 choose-the-test scenarios.",
  sections: [
  { title:"Section I · Multiple choice", questions:[
    { id:"f1", num:1, type:"mc", tags:["slr"], prompt:"In a simple linear regression of BMI on daily hours of TV watched, the <b>slope</b> is:",
      options:["Predicted BMI for someone who watches no TV","The average change in BMI for each additional hour of TV per day","The correlation between BMI and TV hours","The variance of BMI"], answer:1,
      explain:`Slope = change in Y per one-unit increase in X. Option A is the intercept.` },
    { id:"f2", num:2, type:"mc", tags:["chisq","choose-test"], prompt:"A chi-square test checks whether smoking status (smoker / non-smoker) differs by neighborhood type (urban / rural). Chi-square fits because both variables:",
      options:["Are continuous","Are categorical","Are normally distributed","Have equal variances"], answer:1, explain:`A 2×2 table of counts → chi-square.` },
    { id:"f3", num:3, type:"mc", tags:["odds-ratio"], prompt:"An odds ratio of 0.65 for regular exercise and depression means:",
      options:["Exercisers have 65% lower odds of depression","Exercisers have 35% lower odds of depression","Exercise explains 35% of depression","The probability of depression among exercisers is 0.65"], answer:1,
      explain:`OR &lt; 1 → (1 − 0.65) × 100 = <b>35% lower odds</b>. A common trap is reading 0.65 as "65% lower".` },
    { id:"f4", num:4, type:"mc", tags:["anova"], prompt:"An ANOVA comparing mean HbA1c across three diet programs tests whether:",
      options:["All group means are equal","The variances are equal","The residuals are independent","The sample sizes are equal"], answer:0, explain:`H<sub>0</sub>: μ<sub>1</sub> = μ<sub>2</sub> = μ<sub>3</sub>. Equal variances is an assumption, not the purpose.` },
    { id:"f5", num:5, type:"mc", tags:["logistic"], prompt:"In a logistic model of hospital readmission (1 = readmitted), β for number of medications is:",
      options:["The change in probability of readmission per extra medication","The change in log-odds of readmission per extra medication","The mean difference in medications between groups","The odds ratio"], answer:1, explain:`Raw β = log-odds. e<sup>β</sup> = OR.` }
  ]},
  { title:"Section II · Fill in the blank", questions:[
    { id:"f6", num:6, type:"blank", tags:["anova","assumptions"], prompt:"Levene's test checks the ANOVA assumption of ________ variances across groups.", accept:["equal","homogeneous","the same","similar","homogeneity of"], display:"equal (homogeneity of variance)", explain:`If violated, Welch's ANOVA is an option.` },
    { id:"f7", num:7, type:"blank2", tags:["assumptions-mlr","normality"], prompt:"A strongly right-skewed outcome such as hospital costs probably violates the ________ assumption of ________ regression.", accept:[["normality","normal","normally distributed","normal distribution"],["linear","multiple linear","simple linear"]], display:"normality · linear", explain:`Transform (log) and re-check, or choose another model.` },
    { id:"f8", num:8, type:"blank", tags:["logistic"], prompt:"The outcome in binary logistic regression has exactly ________ categories.", accept:["two","2","binary"], display:"two (coded 0/1)", explain:`Ordered or 3+ categories need ordinal or multinomial models.` },
    { id:"f9", num:9, type:"blank", tags:["anova"], prompt:"ANOVA's F = between-group variability ÷ ________-group variability.", accept:["within"], display:"within", explain:`Big F → group means differ more than the noise inside groups.` },
    { id:"f10", num:10, type:"blank", tags:["descriptive"], prompt:"For heavily skewed household income, the best typical value is the ________.", accept:["median","the median"], display:"median", explain:`Resistant to the long tail.` }
  ]},
  { title:"Section III · R output, linear", intro:`<p>Questions 11–17: HbA1c (%) predicted by sugary drinks per week, daily steps (in thousands), and age (years).</p>`+R(`Call:
lm(HbA1c ~ sugar_drinks + steps_k + age)

Coefficients:
(Intercept)    4.90  (SE = 0.40,  p < 0.001)
sugar_drinks   0.18  (SE = 0.05,  p < 0.001)
steps_k       -0.09  (SE = 0.04,  p = 0.03)
age            0.02  (SE = 0.006, p = 0.001)

Residual standard error: 0.82
Multiple R-squared: 0.33`), questions:[
    { id:"f11", num:11, type:"short", tags:["mlr","interpret"], prompt:"Interpret the coefficient for sugary drinks.",
      model:`Each additional sugary drink per week is associated with a <b>0.18 percentage-point higher HbA1c</b>, holding daily steps and age constant (b = 0.18, SE = 0.05, p &lt; .001).`, rubric:["Per one drink/week","+0.18","Holding steps & age constant","Significant"], explain:`t = 0.18/0.05 = 3.6.` },
    { id:"f12", num:12, type:"short", tags:["mlr","interpret"], prompt:"Interpret the coefficient for steps.",
      model:`Each additional 1,000 daily steps is associated with a <b>0.09 percentage-point lower HbA1c</b>, holding sugary drinks and age constant (b = −0.09, p = .03).`, rubric:["Per 1,000 steps (the unit!)","Lower by 0.09","Holding others constant","Significant"], explain:`Watch the unit: steps_k is in thousands.` },
    { id:"f13", num:13, type:"short", tags:["r2"], prompt:"What does R² = 0.33 tell you?",
      model:`About <b>33% of the variability in HbA1c</b> is explained by sugary drinks, steps and age; 67% is unexplained.`, rubric:["33%","variability in HbA1c","explained by the model"], explain:`R² × 100.` },
    { id:"f14", num:14, type:"short", tags:["significance"], prompt:"Which predictors are significant at α = .05?",
      model:`All three: sugary drinks (p &lt; .001), steps (p = .03), age (p = .001).`, rubric:["Sugary drinks","Steps","Age"], explain:`All p &lt; .05.` },
    { id:"f15", num:15, type:"short", tags:["mlr","interpret"], prompt:"Which predictor has the strongest evidence, and why can't you just compare the coefficients?",
      model:`<b>Sugary drinks</b> has the largest test statistic (t = 0.18/0.05 = 3.6), then age (t ≈ 3.3) and steps (t = −2.25). The raw coefficients can't be compared directly because the predictors use different units (drinks/week, thousands of steps, years); standardized coefficients would be needed. Sugary drinks and steps are also the modifiable ones.`,
      rubric:["Picks a predictor with justification","Uses t (or standardized β)","Explains the units problem"], explain:`Compute t = b/SE for each predictor.` },
    { id:"f16", num:16, type:"short", tags:["public-health"], prompt:"What are the public health implications? What would you recommend?",
      model:`More sugary drinks and fewer steps go with higher HbA1c, even accounting for age, and both can be changed. Recommend replacing sugary drinks with water and building daily walking (for example, working toward 7,000–8,000 steps). At the population level: clear beverage labeling, healthier drink options in schools and workplaces, and walkable neighborhoods. Limits: observational data show association, not causation, and 67% of variation is unexplained.`,
      rubric:["Connects finding to prevention","Individual recommendation","Population/policy recommendation","Limitation"], explain:`Finding → why it matters → individual action → policy action → limitation.` },
    { id:"f17", num:17, type:"short", tags:["assumptions-mlr"], prompt:"Name three assumptions of linear regression.",
      model:`Any three: continuous outcome; independent observations; normal continuous variables; linearity; homoscedasticity; independent and normal residuals; no perfect multicollinearity.`, rubric:["Three correct"], explain:`CINLHR + M.` }
  ]},
  { title:"Section III · R output, logistic", intro:`<p>Questions 18–22: hypertension (1 = yes) predicted by waist circumference (cm) and current smoking (yes/no).</p>`+R(`Call:
glm(hypertension ~ waist_cm + smoker, family = binomial)

Coefficients:
(Intercept)  -6.20  (SE = 1.10,  p < 0.001)
waist_cm      0.05  (SE = 0.012, p < 0.001)
smokeryes     0.40  (SE = 0.18,  p = 0.026)

exp(cbind(OR = coef(model), confint(model)))
                 OR     2.5 %   97.5 %
(Intercept)  0.0020   0.0002   0.0175
waist_cm     1.0513   1.0268   1.0763
smokeryes    1.4918   1.0483   2.1230`), questions:[
    { id:"f18", num:18, type:"short", tags:["odds-ratio","interpret"], prompt:"Interpret waist circumference (effect size, not just direction).",
      model:`Each additional centimeter of waist circumference is associated with <b>5.1% higher odds</b> of hypertension, holding smoking constant (OR = 1.051, 95% CI 1.027–1.076). Per 10 cm: 1.0513<sup>10</sup> ≈ <b>1.65 times the odds</b>.`,
      rubric:["5.1% per cm","Holding smoking constant","CI excludes 1","Odds language","(bonus) per 10 cm"], explain:`(1.0513 − 1) × 100 = 5.1%.` },
    { id:"f19", num:19, type:"short", tags:["odds-ratio","interpret"], prompt:"Interpret smoking (effect size).",
      model:`Smokers have <b>1.49 times the odds</b> of hypertension compared to non-smokers (49% higher odds), holding waist circumference constant (OR = 1.49, 95% CI 1.05–2.12, p = .026).`, rubric:["1.49× / 49% higher","vs non-smokers","Holding waist constant","CI excludes 1"], explain:`Group predictor → compare to the reference group.` },
    { id:"f20", num:20, type:"short", tags:["confounding","logistic"], prompt:"What does \"adjusted for smoking\" mean for the waist result?",
      model:`The waist–hypertension estimate holds smoking constant: it compares people with the <b>same smoking status</b>, so differences in smoking can't explain the association.`, rubric:["Holding smoking constant","Same smoking status","Removes confounding"], explain:`Synonyms: controlling for, net of.` },
    { id:"f21", num:21, type:"short", tags:["multicollinearity"], prompt:"If body weight were added and it was highly correlated with waist circumference, what would happen? Which assumption is involved?",
      model:`It would violate <b>no multicollinearity</b>. The model couldn't separate weight from waist, so standard errors would inflate and both ORs could become unstable or non-significant. Check VIF; keep one or combine them.`, rubric:["Multicollinearity","Consequences","VIF / fix"], explain:`Same concept as Practice exam A, Q5.` },
    { id:"f22", num:22, type:"short", tags:["assumptions-logistic"], prompt:"Name three assumptions of logistic regression.",
      model:`Binary outcome; independent observations; linearity of the logit for continuous predictors; no multicollinearity; no complete separation.`, rubric:["Three correct"], explain:`See Practice exam A, Q28.` }
  ]},
  { title:"Section IV · Short answer / essays", questions:[
    { id:"f23", num:23, type:"short", tags:["anova","rm-anova"], prompt:"Describe a situation that calls for repeated measures ANOVA, and explain why a regular one-way ANOVA would be wrong. (≈1 paragraph)",
      model:`Repeated measures ANOVA fits when the <b>same people</b> give a <b>continuous outcome three or more times</b>. Example: a smoking-cessation app measures participants' daily cigarettes at baseline, 1 month, and 3 months. A regular one-way ANOVA assumes independent observations, but measurements from one person are related. Repeated measures ANOVA separates between-person differences from within-person change, which also increases power. It assumes <b>sphericity</b> (checked with Mauchly's test, corrected with Greenhouse-Geisser).`,
      rubric:["Same people, 3+ times","Continuous outcome","Independence violated in one-way","Sphericity","Example"], explain:`Two time points → paired t-test.` },
    { id:"f24", num:24, type:"short", tags:["anova"], prompt:"Compare one-way and two-way ANOVA with a public health example of each. (≈1 paragraph)",
      model:`Both compare means of a continuous outcome across groups. <b>One-way</b>: one factor, e.g., mean daily screen time across four school grades. <b>Two-way</b>: two factors plus their <b>interaction</b>, e.g., whether a nutrition class (yes/no) and income level (low/high) affect fruit servings per day, and whether the class works differently by income level.`,
      rubric:["One vs two factors","Continuous outcome","Interaction explained","Example of each"], explain:`Two-way = 2 main effects + 1 interaction.` },
    { id:"f25", num:25, type:"short", tags:["odds-ratio"], prompt:"How do you interpret an odds ratio below 1, equal to 1, and above 1? (≈1 paragraph)",
      model:`OR = 1: no association. OR &gt; 1: higher odds with the exposure (risk factor), e.g., OR = 2.0 for secondhand smoke and childhood ear infections → twice the odds. OR &lt; 1: lower odds (protective), e.g., OR = 0.60 for handwashing and stomach illness → 40% lower odds. Significant when the 95% CI excludes 1. Say "odds", not "likely".`,
      rubric:["= 1 none","> 1 higher","< 1 lower","Examples","CI and 1"], explain:`Below 1: (1 − OR) × 100% lower.` },
    { id:"f26", num:26, type:"short", tags:["posthoc","anova"], prompt:"Why are post-hoc tests needed? Name three analyses that use them. (≈1 paragraph)",
      model:`An omnibus test only shows that <b>some</b> difference exists among 3+ groups. Post-hoc tests find <b>which</b> groups differ while adjusting for multiple comparisons (five groups mean 10 pairs; at α = .05 the chance of at least one false positive is 1 − 0.95<sup>10</sup> ≈ 40%). Used after: one-way ANOVA (Tukey), two-way ANOVA (simple effects), repeated measures ANOVA (Bonferroni), chi-square larger than 2×2 (standardized residuals), Kruskal-Wallis (Dunn).`,
      rubric:["Some vs which","Multiple comparisons","Three analyses"], explain:`Pairs = k(k−1)/2.` },
    { id:"f27", num:27, type:"short", tags:["study-design","choose-test"], prompt:"Design a study: question, data, sample, outcome and predictors, analysis. (≈2–3 paragraphs)",
      model:`<p><b>Question.</b> Among low-income families in a mid-sized city, does receiving farmers-market produce vouchers reduce household food insecurity after six months?</p><p><b>Data and sample.</b> A survey of about 800 families enrolled in WIC clinics, 400 of whom received vouchers through a city program. Outcome: <b>food insecure</b> (yes/no, from the USDA 6-item screener). Main predictor: <b>voucher receipt</b> (yes/no). Covariates: household size, income, SNAP participation, distance to the nearest grocery store, and baseline food insecurity.</p><p><b>Analysis.</b> Because the outcome is binary, <b>multiple logistic regression</b>, reporting ORs with 95% CIs. I'd check independence, linearity of the logit for continuous covariates, VIF, and complete separation. Limitation: families weren't randomized, so results show association, not causation.</p>`,
      rubric:["Research question","Data source","Sample","Outcome + type","Main predictor","Confounders","Matching analysis","Limitation"], explain:`Outcome type → model. Say it explicitly.` }
  ]},
  { title:"Section V · Choose the test", intro:`<p>Options: ${TESTS_B.join(", ")}.</p>`, questions:[
    { id:"fv1", num:"V1", type:"pick", options:TESTS_B, answer:["t-test"], tags:["choose-test"], prompt:"Compare mean HbA1c between patients using a glucose app and patients receiving usual care.", explain:`2 groups, continuous → <b>t-test</b>.` },
    { id:"fv2", num:"V2", type:"pick", options:TESTS_B, answer:["logistic regression"], tags:["choose-test"], prompt:"Whether housing status and employment predict any missed dialysis session (yes/no).", explain:`Binary outcome, two predictors → <b>logistic regression</b>.` },
    { id:"fv3", num:"V3", type:"pick", options:TESTS_B, answer:["multiple linear regression"], tags:["choose-test"], prompt:"Whether sleep hours and caffeine intake predict reaction time (ms).", explain:`Continuous outcome, 2 predictors → <b>multiple linear regression</b>.` },
    { id:"fv4", num:"V4", type:"pick", options:TESTS_B, answer:["one-way ANOVA"], tags:["choose-test"], prompt:"Compare mean commute time across five city districts.", explain:`One factor, 5 groups → <b>one-way ANOVA</b>.` },
    { id:"fv5", num:"V5", type:"pick", options:TESTS_B, answer:["two-way ANOVA"], tags:["choose-test"], prompt:"Whether diet type (3 levels) and sex jointly affect LDL cholesterol.", explain:`Two factors + "jointly" → <b>two-way ANOVA</b>.` },
    { id:"fv6", num:"V6", type:"pick", options:TESTS_B, answer:["median"], tags:["choose-test","descriptive"], prompt:"Describe the typical length of hospital stay (strongly right-skewed).", explain:`Skewed → <b>median</b>.` },
    { id:"fv7", num:"V7", type:"pick", options:TESTS_B, answer:["standard deviation"], tags:["choose-test","descriptive"], prompt:"Describe how much daily vaccine doses vary at a pharmacy.", explain:`Variability → <b>SD</b>.` },
    { id:"fv8", num:"V8", type:"pick", options:TESTS_B, answer:["logistic regression"], tags:["choose-test"], prompt:"Model the probability of a positive depression screen from age and social support score.", explain:`Binary outcome → <b>logistic</b>.` },
    { id:"fv9", num:"V9", type:"pick", options:TESTS_B, answer:["repeated measures ANOVA"], tags:["choose-test","rm-anova"], prompt:"Pain scores in the same patients at surgery, 2 weeks, 6 weeks, and 12 weeks.", explain:`Same people, 4 time points → <b>repeated measures ANOVA</b>.` },
    { id:"fv10", num:"V10", type:"pick", options:TESTS_B, answer:["simple linear regression"], tags:["choose-test"], prompt:"Whether daily pollen count predicts allergy-related clinic visits (both continuous).", explain:`One predictor → <b>simple linear regression</b>.` },
    { id:"fv11", num:"V11", type:"pick", options:TESTS_B, answer:["logistic regression"], tags:["choose-test","equations"], prompt:"P(Y) = 1 / (1 + e<sup>−(β0 + β1X1 + β2X2 + β3X3)</sup>). Which analysis?", explain:`Logistic function.` },
    { id:"fv12", num:"V12", type:"pick", options:TESTS_B, answer:["multiple linear regression"], tags:["choose-test","equations"], prompt:"Y = β0 + β1X1 + β2X2 + ε. Which analysis?", explain:`Two predictors → multiple.` },
    { id:"fv13", num:"V13", type:"pick", options:TESTS_B, answer:["simple linear regression"], tags:["choose-test","equations"], prompt:"Y = β0 + β1X1 + ε. Which analysis?", explain:`One predictor → simple.` }
  ]}
  ]
},

/* ============================================================ PROJECT WALKTHROUGH */
{
  id: "hw2", title: "Regression project walkthrough · county obesity",
  blurb: "A complete multiple regression from question to write-up, with one sign error to catch.",
  sections:[
  { title:"The setup", intro:`<p>Practice dataset (invented for this site): 3,142 U.S.-style counties. Question: <b>Are physical inactivity, median household income, and rural status associated with adult obesity prevalence?</b></p>`+R(`summary(counties[, c("obesity_pct","inactive_pct","income_k","rural")])

  obesity_pct     inactive_pct      income_k        rural
 Min.   :14.2    Min.   : 9.8    Min.   : 24.1    no :1,960
 1st Qu.:28.1    1st Qu.:21.0    1st Qu.: 46.3    yes:1,182
 Median :31.4    Median :25.2    Median : 53.9
 Mean   :31.0    Mean   :25.4    Mean   : 57.8
 3rd Qu.:34.2    3rd Qu.:29.6    3rd Qu.: 64.0
 Max.   :47.9    Max.   :44.7    Max.   :151.8
 NAs    :24      NAs    :18      NAs    :6`), questions:[
    { id:"h1", num:1, type:"short", tags:["study-design","mlr"], prompt:"Write the research question in a form multiple linear regression can answer.",
      model:`Among U.S. counties, are <b>physical inactivity</b> (%, continuous), <b>median household income</b> ($1,000s, continuous), and <b>rural status</b> (yes/no) associated with <b>adult obesity prevalence</b> (%, continuous outcome)?`, rubric:["Continuous outcome","3+ predictors","Population"], explain:`Population + continuous outcome + predictors + "associated".` },
    { id:"h2", num:2, type:"short", tags:["descriptive"], prompt:"What do the descriptive statistics tell you before modeling?",
      model:`<ul><li><b>Obesity</b>: mean 31.0 ≈ median 31.4 → roughly symmetric (slightly left-skewed).</li><li><b>Income</b>: mean 57.8 &gt; median 53.9, max 151.8 → <b>right-skewed</b>; consider log(income).</li><li><b>Rural</b>: 1,182 rural vs 1,960 non-rural.</li><li><b>Missing</b>: up to 48 counties dropped once all NAs are combined (here 42).</li></ul>`, rubric:["Mean vs median → skew","Missing data","Transformation idea"], explain:`Compare mean and median, scan min/max, count NAs.` }
  ]},
  { title:"Assumptions", questions:[
    { id:"h3", num:3, type:"short", tags:["assumptions-mlr"], prompt:"Which assumptions would you check, how, and what might you find?",
      model:`<table class="tbl"><tr><th>Assumption</th><th>Check</th><th>Likely result</th></tr>
      <tr><td>Continuous outcome</td><td>Look / histogram</td><td>✔</td></tr>
      <tr><td>Independent observations</td><td>Design</td><td>? Neighboring counties may be similar (spatial clustering)</td></tr>
      <tr><td>Normality</td><td>Histograms, Q-Q</td><td>✘ income skewed → try log</td></tr>
      <tr><td>Linearity</td><td>Scatter + LOESS</td><td>✔ inactivity; ? income may curve</td></tr>
      <tr><td>Homoscedasticity</td><td>Breusch-Pagan (p &lt; .05 = fails)</td><td>Check</td></tr>
      <tr><td>Independent residuals</td><td>Durbin-Watson (p &lt; .05 = fails)</td><td>Check</td></tr>
      <tr><td>Normal residuals</td><td>Residual histogram</td><td>Check</td></tr>
      <tr><td>Multicollinearity</td><td>VIF &gt; 5 or r &gt; .7</td><td>Inactivity and income may correlate; check</td></tr></table>`,
      rubric:["Lists assumptions","A check for each","Expected issues"], explain:`<pre class="code">m &lt;- lm(obesity_pct ~ inactive_pct + income_k + rural, data = counties)
lmtest::bptest(m); lmtest::dwtest(m); car::vif(m)
hist(residuals(m))</pre>` }
  ]},
  { title:"Run the model", intro:R(`Coefficients:
              Estimate  Std. Error  t value  Pr(>|t|)
(Intercept)    18.500     0.600      30.83    <2e-16 ***
inactive_pct    0.420     0.020      21.00    <2e-16 ***
income_k       -0.060     0.008      -7.50   7.3e-14 ***
ruralyes        0.850     0.210       4.05   5.3e-05 ***
---
Residual standard error: 3.42 on 3096 degrees of freedom
  (42 observations deleted due to missingness)
Multiple R-squared:  0.4100,   Adjusted R-squared:  0.4094
F-statistic: 717.2 on 3 and 3096 DF,  p-value: < 2.2e-16`), questions:[
    { id:"h4a", num:"4a", type:"mc", tags:["mlr","interpret"], prompt:"A classmate reports income as β = 0.06. What's wrong?",
      options:["Nothing","The sign: it's −0.06","It should be the t value","It should be exponentiated"], answer:1,
      explain:`The estimate is <b>−0.060</b>: higher income goes with <i>lower</i> obesity. Always keep the sign; it carries the direction.` },
    { id:"h4b", num:"4b", type:"mc", tags:["mlr","interpret"], prompt:"What does the intercept (18.5) represent?",
      options:["Average obesity in the sample","Predicted obesity % for a non-rural county with 0% inactivity and $0 income","Predicted obesity for a rural county","R²"], answer:1,
      explain:`All X = 0 and the reference group (non-rural). No county looks like that, so it isn't meaningful on its own.` },
    { id:"h4c", num:"4c", type:"blank", tags:["mlr","prediction"], prompt:"Predicted obesity % for a rural county with 25% inactivity and $55K income? (2 decimals)", accept:["26.55","26.6"], display:"26.55",
      explain:`<ol class="steps"><li>18.5 + 0.42(25) − 0.06(55) + 0.85(1)</li><li>= 18.5 + 10.5 − 3.3 + 0.85</li><li>= <b>26.55</b></li></ol>` }
  ]},
  { title:"Outliers & influential values", questions:[
    { id:"h5", num:5, type:"short", tags:["diagnostics"], prompt:"Using n = 3,100 and k = 4, find the cutoffs. The diagnostics flagged 148 large standardized residuals, 61 high-leverage counties, and 172 above the Cook's cutoff. Interpret.",
      model:`<table class="tbl"><tr><th>Measure</th><th>Cutoff</th><th>Found</th></tr><tr><td>Standardized residual</td><td>|z| &gt; 1.96</td><td>148 (4.8%)</td></tr><tr><td>Leverage</td><td>2k/n = 8/3100 = 0.0026</td><td>61</td></tr><tr><td>Cook's D</td><td>4/n = 4/3100 = 0.0013</td><td>172</td></tr></table><p>About 5% (≈155) would exceed ±1.96 by chance, so 148 is expected. High-leverage counties are likely the very high-income ones (the long income tail). Next: check the flagged rows for data errors; if none, keep them and report it, and consider log(income) to reduce leverage.</p>`,
      rubric:["Correct cutoffs","Compares to 5% expectation","Characterizes","Decision"], explain:`<pre class="code">diag &lt;- model.frame(m) %&gt;% mutate(sr = rstandard(m), lev = hatvalues(m), cd = cooks.distance(m))
diag %&gt;% filter(abs(sr) &gt; 1.96) %&gt;% nrow()</pre>` }
  ]},
  { title:"Write it up", questions:[
    { id:"h6", num:6, type:"short", tags:["mlr","interpret","r2","writing"], prompt:"Write a complete results paragraph.",
      model:`<p>A multiple linear regression examined whether physical inactivity, median household income, and rural status were associated with adult obesity prevalence across 3,100 counties with complete data. The model was significant, <b>F(3, 3096) = 717.2, p &lt; .001</b>, and explained about <b>41% of the variability</b> in obesity (adjusted R² = .409).</p><p>Each one-point increase in the percent of physically inactive adults was associated with a 0.42-point higher obesity prevalence (b = 0.42, p &lt; .001). Each additional $1,000 of median income was associated with a 0.06-point lower prevalence (b = −0.06, p &lt; .001). Rural counties had obesity prevalence 0.85 points higher than non-rural counties (b = 0.85, p &lt; .001), each holding the other predictors constant.</p><p>[Assumptions sentence.] 148 counties had standardized residuals beyond ±1.96, 61 exceeded the leverage cutoff (0.0026), and 172 exceeded the Cook's distance cutoff (0.0013); these were mostly very high-income counties, and none reflected data errors, so all were retained. County-level data describe places, not individuals.</p>`,
      rubric:["F with df and p","Adjusted R² as %","Each slope with direction","Group slope vs reference","Assumptions","Outliers","Limitation"], explain:`Order: model → fit → slopes → assumptions → diagnostics → limitation.` }
  ]}
  ]
},

/* ============================================================ LOGISTIC ACTIVITY */
{
  id:"wk7", title:"Logistic activity · who bikes to work?",
  blurb:"Choose the model, write hypotheses, and prepare the data. Then fit it in the lab.",
  sections:[
  { title:"The study", intro:`<p><b>Aim:</b> predict biking to work among adult commuters. Convenience sample from a workplace wellness survey.</p>
  <table class="tbl"><tr><th>Variable</th><th>Question</th><th>Type</th></tr>
  <tr><td><code>bikes_to_work</code> (outcome)</td><td>Do you usually bike to work?</td><td>Yes / No / Prefer not to say</td></tr>
  <tr><td><code>near_bike_lane</code></td><td>Is there a protected bike lane within 1 km of home?</td><td>Yes / No / Don't know</td></tr>
  <tr><td><code>owns_car</code></td><td>Does your household own a car?</td><td>Yes / No</td></tr>
  <tr><td><code>commute_km</code></td><td>One-way commute distance</td><td>Numeric</td></tr>
  <tr><td><code>grew_up_cycling</code></td><td>Did you bike regularly as a child?</td><td>Yes / No</td></tr></table>
  <div class="eq">P(bikes) = 1 / (1 + e<sup>−(b<sub>0</sub> + b<sub>1</sub>NearLane + b<sub>2</sub>OwnsCar + b<sub>3</sub>CommuteKm + b<sub>4</sub>GrewUpCycling)</sup>)</div>`, questions:[
    { id:"w1", num:1, type:"short", tags:["logistic","choose-test"], prompt:"Which model is most appropriate, and why?",
      model:`<b>Binary logistic regression.</b> The outcome (bikes to work: yes/no) is binary. Linear regression could predict probabilities below 0 or above 1 and would violate normality and constant variance. Logistic regression models the log-odds as a linear function of the four predictors, which can be binary or continuous.`,
      rubric:["Binary logistic","Outcome is binary","Why not linear"], explain:`Binary → logistic; ordinal → ordered logistic; 3+ categories → multinomial; counts → Poisson.` },
    { id:"w2", num:2, type:"short", tags:["hypothesis","logistic"], prompt:"Write the null and alternative hypotheses.",
      model:`<p><b>Overall.</b> H<sub>0</sub>: the four predictors don't improve prediction of biking over the intercept-only model (all b = 0). H<sub>A</sub>: the model predicts better than baseline (at least one b ≠ 0).</p><p><b>One predictor.</b> H<sub>0</sub>: living near a protected bike lane is not associated with the odds of biking (OR = 1). H<sub>A</sub>: OR ≠ 1.</p>`,
      rubric:["Null: no better than baseline","Alternative","(bonus) per-predictor with OR = 1"], explain:`Logistic null = no better than baseline.` },
    { id:"w3", num:3, type:"short", tags:["logistic","data-prep"], prompt:"Name two things you'd make sure of before running the model.",
      model:`<ul><li>Code the outcome 0/1 and set "Prefer not to say" / "Don't know" to missing; check <code>levels()</code>.</li><li>Enough events: about 10 cyclists per predictor (40+).</li><li>No complete separation: cross-tab each predictor with the outcome.</li><li>Multicollinearity: car ownership and commute distance may be related (VIF).</li></ul>`,
      rubric:["Two sound checks","Why each matters"], explain:`Then fit it with editable data in Labs → Bike commute lab.` }
  ]}
  ]
},

/* ============================================================ BIOSTATS BASICS */
{
  id: "wk1", title: "Biostatistics basics", blurb: "Center and spread, distributions, hypothesis testing, which simple test fits which question.",
  sections: [
  { title: "Describing data", questions: [
    { id: "b1", num: 1, type: "short", tags: ["descriptive"], prompt: "For the values 4, 6, 6, 7, 22: find the mean, median and mode, and say which best describes a typical value.",
      model: `Mean = 45/5 = <b>9</b>. Median = <b>6</b>. Mode = <b>6</b>. The 22 pulls the mean up, so the <b>median</b> is the better typical value.`, rubric: ["Mean 9", "Median 6", "Mode 6", "Median preferred, why"], explain: `Sort first; the middle of 5 values is the 3rd.` },
    { id: "b2", num: 2, type: "short", tags: ["descriptive"], prompt: "When is the mean the right measure of central tendency?", model: `For continuous data that are roughly <b>symmetric</b> with no extreme outliers.`, rubric: ["Symmetric/normal", "No outliers"], explain: `Mean and median agree in symmetric data.` },
    { id: "b3", num: 3, type: "short", tags: ["descriptive"], prompt: "When is the median the better choice?", model: `With <b>skewed</b> data, extreme outliers, or ordinal data.`, rubric: ["Skewed", "Outliers", "Ordinal"], explain: `Costs, incomes, lengths of stay.` },
    { id: "b4", num: 4, type: "mc", tags: ["descriptive"], prompt: "The measure of spread usually reported with a mean is:", options: ["IQR", "Standard deviation", "Mode", "Range of the median"], answer: 1, explain: `Mean ± SD; median (IQR).` },
    { id: "b4b", num: "4b", type: "mc", tags: ["descriptive"], prompt: "The measure of spread usually reported with a median is:", options: ["IQR", "Standard deviation", "Variance", "Mode"], answer: 0, explain: `Both based on sorted positions.` },
    { id: "b5", num: 5, type: "mc", tags: ["descriptive"], prompt: "True or false: a distribution can have two modes.", options: ["True", "False"], answer: 0, explain: `Bimodal, e.g., ages of people at a family event.` },
    { id: "b6", num: "6", type: "short", tags: ["descriptive"], prompt: "Describe a standard normal distribution and a left-skewed distribution.", model: `Standard normal: symmetric bell centered at 0 with SD 1; about 95% within ±1.96. Left (negative) skew: long tail toward low values; mean &lt; median (e.g., age at death in a wealthy country).`, rubric: ["Normal described", "Left skew: tail to the left, mean < median"], explain: `The tail points to the side the mean is pulled toward.` },
    { id: "b8", num: 8, type: "mc", tags: ["descriptive"], prompt: "Income in a city is right-skewed. Which is larger?", options: ["Mean", "Median", "Equal"], answer: 0, explain: `The long right tail drags the mean up.` }
  ]},
  { title: "Hypothesis testing", questions: [
    { id: "b9", num: 9, type: "short", tags: ["testing"], prompt: "What is a non-parametric test, and when would you use one?", model: `A test that doesn't assume a particular distribution (usually works with ranks). Use with skewed data, outliers, ordinal outcomes, or small samples. Examples: Mann-Whitney U, Spearman's rho, Kruskal-Wallis.`, rubric: ["No normality assumption", "When", "Example"], explain: `Slightly less power when data really are normal.` },
    { id: "b10", num: 10, type: "short", tags: ["testing"], prompt: "Population vs sample: what's the difference?", model: `The population is everyone you want conclusions about; the sample is the subset you measure to estimate population values.`, rubric: ["Population", "Sample"], explain: `Uncertainty from sampling → CIs and p-values.` },
    { id: "b11", num: 11, type: "short", tags: ["testing"], prompt: "Explain the central limit theorem in one or two sentences.", model: `With a large enough sample, the distribution of sample <b>means</b> is approximately normal around the population mean, even if the data themselves aren't normal.`, rubric: ["Sample means", "Approximately normal", "Large n"], explain: `It's about means, not raw data.` },
    { id: "b12", num: 12, type: "short", tags: ["testing", "hypothesis"], prompt: "What is a null hypothesis? Give one for a study comparing two blood pressure drugs.", model: `The no-effect statement. H₀: mean systolic BP is the same with Drug X and Drug Y.`, rubric: ["No effect/difference", "Concrete example"], explain: `We look for evidence to reject it.` }
  ]},
  { title: "Which test?", questions: [
    { id: "b13", num: 13, type: "blank", tags: ["choose-test"], prompt: "Mean cholesterol in vegetarians vs non-vegetarians (normal data): ________", accept: ["independent samples t test", "independent t test", "t test", "two sample t test", "t-test", "independent samples t-test"], display: "independent-samples t-test", explain: `Two separate groups.` },
    { id: "b14", num: 14, type: "blank", tags: ["choose-test"], prompt: "Weight of the same participants before and after a 12-week program: ________", accept: ["paired t test", "paired samples t test", "paired t-test", "paired", "dependent t test"], display: "paired t-test", explain: `Same people twice.` },
    { id: "b15", num: 15, type: "blank", tags: ["choose-test"], prompt: "Is a clinic's mean wait different from a 20-minute target? ________", accept: ["one sample t test", "one-sample t test", "one sample t-test", "one-sample t-test"], display: "one-sample t-test", explain: `Sample vs known value.` },
    { id: "b16", num: 16, type: "blank", tags: ["choose-test"], prompt: "Non-parametric version of the independent-samples t-test: ________", accept: ["mann whitney", "mann whitney u", "mann-whitney u", "mann-whitney", "wilcoxon rank sum", "wilcoxon rank-sum", "wilcoxon"], display: "Mann-Whitney U", explain: `Rank-based.` },
    { id: "b17", num: 17, type: "blank", tags: ["correlation"], prompt: "Association between two normally distributed continuous variables: ________", accept: ["pearson", "pearson's r", "pearsons r", "pearson correlation", "r", "correlation coefficient"], display: "Pearson's r", explain: `−1 to +1.` },
    { id: "b18", num: 18, type: "mc", tags: ["correlation"], prompt: "Relationship between hours of sleep and reaction time (ms):", options: ["Chi-square", "Phi", "Kruskal-Wallis", "Pearson's correlation"], answer: 3, explain: `Both continuous.` },
    { id: "b19", num: 19, type: "mc", tags: ["correlation"], prompt: "Pearson's r = +1 means:", options: ["No relationship", "A perfect positive linear relationship", "A weak positive relationship", "Causation"], answer: 1, explain: `Every point on an upward line.` },
    { id: "b20", num: 20, type: "blank", tags: ["correlation"], prompt: "Non-parametric alternative to Pearson's r: ________", accept: ["spearman", "spearman's rho", "spearmans rho", "spearman rho", "spearman correlation", "kendall", "kendall's tau"], display: "Spearman's rho", explain: `Ranks.` },
    { id: "b21", num: 21, type: "blank", tags: ["chisq"], prompt: "Association between insurance type and vaccination status: ________", accept: ["chi square", "chi-square", "chi squared", "chi-squared", "chisq"], display: "chi-square", explain: `Two categorical variables.` },
    { id: "b22", num: 22, type: "short", tags: ["chisq", "posthoc"], prompt: "When does a chi-square test need a follow-up (post-hoc) look?", model: `When it's <b>significant</b> and the table is <b>larger than 2×2</b>, to see which categories drive it.`, rubric: ["Significant", "> 2×2"], explain: `2×2 has only one comparison.` },
    { id: "b23", num: 23, type: "short", tags: ["chisq"], prompt: "How do you see which cells drive a significant chi-square?", model: `Standardized residuals: cells beyond about ±1.96 differ from expected.`, rubric: ["Standardized residuals", "±1.96"], explain: `chisq.test(tab)$stdres` }
  ]},
  { title: "Significance vs size", questions: [
    { id: "b24", num: 24, type: "mc", tags: ["odds-ratio", "testing"], prompt: "An odds ratio describes…", options: ["Effect size", "Statistical significance"], answer: 0, explain: `Its CI tells significance.` },
    { id: "b25", num: 25, type: "mc", tags: ["testing", "ci"], prompt: "A p-value describes…", options: ["Effect size", "Statistical significance"], answer: 1, explain: `p &lt; .05 → significant.` },
    { id: "b26", num: 26, type: "short", tags: ["testing"], prompt: "A study of 200,000 adults finds that each extra hour of weekly TV raises BMI by 0.01 (p &lt; .001). Statistically significant? Practically significant? Explain.",
      model: `Statistically significant (p &lt; .001), but probably <b>not practically significant</b>: 0.01 BMI units per hour is tiny. Huge samples make very small effects significant, so always report and judge the effect size.`, rubric: ["Statistical yes", "Practical doubtful", "Large-sample point"], explain: `Significance = unlikely by chance. Importance = size.` }
  ]}
  ]
},

/* ============================================================ REGRESSION PRACTICE */
{
  id: "wk25", title: "Regression practice set", blurb: "Interpret equations and output, dummy variables, model building, assumption rules.",
  sections: [
  { title: "Interpreting equations", intro: `<p>For each: what do the intercept and slope mean?</p>`, questions: [
    { id: "e1", num: 1, type: "short", tags: ["slr", "interpret"], prompt: "Minutes of sleep = 480 − 15(cups of coffee per day)", model: `<b>Intercept 480:</b> someone who drinks no coffee is predicted to sleep 480 minutes (8 hours). <b>Slope −15:</b> each additional daily cup → 15 fewer minutes of sleep.`, rubric: ["Intercept at 0 cups", "15 minutes less per cup"], explain: `Continuous predictor.` },
    { id: "e2", num: 2, type: "short", tags: ["slr", "interpret"], prompt: "Sick days per year = 6 − 2(vaccinated)", model: `<b>Intercept 6:</b> unvaccinated people (0) average 6 sick days. <b>Slope −2:</b> vaccinated people average 2 fewer (4).`, rubric: ["Intercept = unvaccinated", "2 fewer days vaccinated"], explain: `0/1 predictor → group difference.` },
    { id: "e3", num: 3, type: "short", tags: ["slr", "interpret"], prompt: "Systolic BP = 118 + 6(smoker)", model: `Non-smokers average 118 mmHg; smokers average 6 mmHg higher (124).`, rubric: ["Intercept = non-smokers", "+6 for smokers"], explain: `Reference = 0.` },
    { id: "e4", num: 4, type: "short", tags: ["slr", "interpret"], prompt: "Anxiety score (0–21) = 12 − 0.8(hours of exercise per week)", model: `Someone with no exercise is predicted to score 12; each additional weekly hour of exercise → 0.8 points lower anxiety.`, rubric: ["Intercept at 0 hours", "0.8 lower per hour"], explain: `Scales like this are usually treated as continuous.` },
    { id: "e5", num: 5, type: "short", tags: ["slr", "interpret"], prompt: "Steps per day = 5,200 + 1,800(owns a dog)", model: `Non-owners average 5,200 steps; dog owners average 1,800 more (7,000).`, rubric: ["Intercept = non-owners", "+1,800 for owners"], explain: `Group difference.` }
  ]},
  { title: "Simple regression output", intro: R(`lm(formula = wait_min ~ staff_per_shift, data = clinics, na.action = na.exclude)

Coefficients:
                Estimate Std. Error t value Pr(>|t|)
(Intercept)      64.300     4.100   15.68   <2e-16 ***
staff_per_shift  -3.600     0.450   -8.00   5.9e-14 ***

Residual standard error: 11.8 on 228 degrees of freedom
Multiple R-squared:  0.2190,  Adjusted R-squared:  0.2156
F-statistic: 64.0 on 1 and 228 DF,  p-value: 5.9e-14

confint():          2.5 %   97.5 %
(Intercept)      56.22    72.38
staff_per_shift  -4.49    -2.71`), questions: [
    { id: "e6", num: 6, type: "blank", tags: ["slr", "equations"], prompt: "Equation: wait time (min) = ________", accept: ["64.3 - 3.6 staff", "64.3 - 3.6 staff per shift", "64.3 - 3.6x", "64.3 - 3.6 staff_per_shift", "64.3 3.6 staff", "64.3 3.6x", "64.3 3.6 staff per shift", "64.3 3.6 staff_per_shift"], display: "64.3 − 3.6(staff per shift)", explain: `Intercept and slope from the Estimate column.` },
    { id: "e7", num: 7, type: "short", tags: ["fit"], prompt: "Interpret F and R².", model: `The model with staffing explains significantly more variance in wait time than an intercept-only model, F(1, 228) = 64.0, p &lt; .001. About 22% of the variability in wait time is explained by staffing.`, rubric: ["F with df, p", "Better than intercept-only", "22%"], explain: `In simple regression F = t² (−8² = 64).` },
    { id: "e8", num: 8, type: "short", tags: ["slr", "ci"], prompt: "Interpret the slope with its CI.", model: `Each additional staff member per shift is associated with a <b>3.6-minute shorter wait</b> (95% CI −4.5 to −2.7). The CI excludes 0 → significant.`, rubric: ["Per staff member", "3.6 min shorter", "CI", "Excludes 0"], explain: `Slope CI vs 0.` },
    { id: "e9", num: 9, type: "mc", tags: ["ci"], prompt: "A slope's 95% CI is −1.2 to 0.3. Conclusion?", options: ["Significant because it's mostly negative", "Not significant because the CI includes 0", "Significant because it excludes 1", "Can't tell"], answer: 1, explain: `Slopes compare to 0; ORs to 1.` }
  ]},
  { title: "Multiple regression & dummy variables", intro: R(`lm(formula = wait_min ~ staff_per_shift + urban, data = clinics, na.action = na.exclude)

Coefficients:
                Estimate Std. Error t value Pr(>|t|)
(Intercept)      58.900     4.300   13.70   <2e-16 ***
staff_per_shift  -3.200     0.460   -6.96   3.8e-11 ***
urbanyes          7.500     2.100    3.57   0.00043 ***

Residual standard error: 11.5 on 227 degrees of freedom
Multiple R-squared:  0.2600,  Adjusted R-squared:  0.2535
F-statistic: 39.9 on 2 and 227 DF,  p-value: 1.6e-15`), questions: [
    { id: "e10", num: 10, type: "short", tags: ["mlr", "interpret"], prompt: "Interpret staff_per_shift and urbanyes.", model: `<b>Staffing:</b> each additional staff member per shift → 3.2 minutes shorter wait, holding urban status constant (p &lt; .001).<br><b>Urban:</b> compared to non-urban clinics, urban clinics' waits are 7.5 minutes longer on average, holding staffing constant (p &lt; .001).`, rubric: ["3.2 min per staff member", "Urban 7.5 min longer than non-urban", "Holding constant", "Significance"], explain: `The staffing slope shrank from −3.6 to −3.2 once urban status was added.` },
    { id: "e11", num: 11, type: "mc", tags: ["data", "mlr"], prompt: "Which is the reference group for urban?", options: ["Urban", "Non-urban", "Both", "Neither"], answer: 1, explain: `R names the non-reference level (urbanyes), so "no" (non-urban) is the reference.` },
    { id: "e12", num: 12, type: "blank", tags: ["fit", "r2"], prompt: "Which fit statistic should you report here? ________", accept: ["adjusted r squared", "adjusted r2", "adjusted r-squared", "0.2535", ".2535", "adj r2", "adjusted r²"], display: "Adjusted R² = 0.2535 (about 25%)", explain: `Multiple predictors → adjusted R².` },
    { id: "e13", num: 13, type: "blank", tags: ["data"], prompt: "Region has 4 categories. How many dummy variables? ________", accept: ["3", "three"], display: "3 (k − 1)", explain: `The reference gets none.` },
    { id: "e14", num: 14, type: "mc", tags: ["mlr"], prompt: "Which way of entering predictors is theory-driven, adding known predictors first and new ones in a later block?", options: ["Stepwise", "Forced entry", "Hierarchical", "Random"], answer: 2, explain: `Hierarchical. Stepwise is computer-driven and best kept for exploration.` },
    { id: "e15", num: 15, type: "mc", tags: ["mlr"], prompt: "An unadjusted model includes…", options: ["Only the predictor(s) of interest", "All demographics", "No predictors", "Only significant predictors"], answer: 0, explain: `Adjusted models add covariates.` }
  ]},
  { title: "Assumption rules", questions: [
    { id: "e16", num: 16, type: "mc", tags: ["assumptions-mlr"], prompt: "Breusch-Pagan p = .012. Conclusion?", options: ["Homoscedasticity met", "Homoscedasticity NOT met", "Residuals independent", "No multicollinearity"], answer: 1, explain: `Null = constant variance; p &lt; .05 rejects it.` },
    { id: "e17", num: 17, type: "mc", tags: ["assumptions-mlr"], prompt: "Durbin-Watson p = .62. Conclusion?", options: ["Residuals independent (met)", "Not independent", "Variance not constant", "Not normal"], answer: 0, explain: `Null = independent; p &gt; .05 → met.` },
    { id: "e18", num: 18, type: "blank", tags: ["multicollinearity"], prompt: "Multicollinearity is a concern when VIF exceeds ________.", accept: ["5", "five"], display: "5", explain: `Or correlation above .7.` },
    { id: "e19", num: 19, type: "mc", tags: ["assumptions-mlr"], prompt: "How is independence of observations checked?", options: ["Breusch-Pagan", "VIF", "By judging how the data were collected", "Q-Q plot"], answer: 2, explain: `Clusters such as classrooms, families, or clinics break it.` },
    { id: "e20", num: 20, type: "short", tags: ["normality"], prompt: "Length of hospital stay is strongly right-skewed. What can you do?", model: `Transform it (log, square root, cube root, or inverse), then re-check. If it still fails, use another model or report descriptive statistics.`, rubric: ["Transformation", "Re-check", "Alternative"], explain: `Log works when all values are positive.` },
    { id: "e21", num: 21, type: "mc", tags: ["assumptions-mlr"], prompt: "Linearity applies to…", options: ["Every predictor", "Continuous predictors only", "Categorical predictors only", "The outcome only"], answer: 1, explain: `Scatterplot + LOESS for each continuous predictor.` }
  ]}
  ]
},

/* ============================================================ DIAGNOSTICS PRACTICE */
{
  id: "outact", title: "Diagnostics practice · flagged clinics", blurb: "Read a diagnostics table: outliers, leverage, influence, and data errors.",
  sections: [
  { title: "The table", intro: `<p>A model predicts wait time from staffing, urban status and clinic size (n = 230, k = 4 parameters). Cutoffs: |standardized residual| &gt; 1.96; leverage &gt; 2k/n = 8/230 = <b>0.0348</b>; Cook's D &gt; 4/n = <b>0.0174</b>.</p>` + R(`clinic   actual  predicted  std_resid  leverage  cooks_d
C-014      92      51.2       3.52     0.012    0.038
C-057      24      48.9      -2.18     0.009    0.011
C-101      55      53.0       0.17     0.061    0.001
C-133     600      49.7      48.10     0.015    9.420
C-178      18      44.5      -2.31     0.041    0.057
C-202      61      58.4       0.22     0.008    0.000`), questions: [
    { id: "o1", num: 1, type: "circle", tags: ["diagnostics"], prompt: "Which clinics are outliers (|standardized residual| > 1.96)?", options: ["C-014", "C-057", "C-101", "C-133", "C-178", "C-202"], answer: [0, 1, 3, 4], explain: `3.52, −2.18, 48.10 and −2.31 are beyond ±1.96.` },
    { id: "o2", num: 2, type: "circle", tags: ["diagnostics"], prompt: "Which have high leverage (> 0.0348)?", options: ["C-014", "C-057", "C-101", "C-133", "C-178", "C-202"], answer: [2, 4], explain: `0.061 and 0.041. C-101 has unusual predictor values but is predicted well, so it isn't influential.` },
    { id: "o3", num: 3, type: "circle", tags: ["diagnostics"], prompt: "Which are influential (Cook's D > 0.0174)?", options: ["C-014", "C-057", "C-101", "C-133", "C-178", "C-202"], answer: [0, 3, 4], explain: `0.038, 9.42 and 0.057. C-178 is both an outlier and high leverage, the classic influential combination.` },
    { id: "o4", num: 4, type: "mc", tags: ["diagnostics"], prompt: "Which clinic waited much LESS than predicted?", options: ["C-014", "C-133", "C-178", "C-202"], answer: 2, explain: `Residual = actual − predicted = 18 − 44.5 = −26.5 (std resid −2.31). C-057 is also lower than predicted.` },
    { id: "o5", num: 5, type: "short", tags: ["diagnostics"], prompt: "What is going on with C-133, and what should you do?", model: `A 600-minute wait (10 hours) is implausible next to a predicted 50 minutes, so it's almost certainly a <b>data entry error</b> (e.g., 60 typed as 600). Check the source; correct it if possible, otherwise remove it, re-run the model, and report what you did.`, rubric: ["Identifies data entry error", "Check source", "Correct/remove and re-run", "Report"], explain: `Always look for errors before deciding anything else.` },
    { id: "o6", num: 6, type: "short", tags: ["diagnostics", "writing"], prompt: "Write the outliers sentence for the report (assume C-133 was corrected to 60).", model: `Before correcting C-133, four clinics had standardized residuals beyond ±1.96, two exceeded the leverage cutoff (0.035), and three exceeded the Cook's distance cutoff (0.017). One extreme value (600 minutes) was a data entry error and was corrected to 60; the remaining flagged clinics had valid data and were retained.`, rubric: ["Counts and cutoffs", "Error handled", "Decision stated"], explain: `See the outliers template.` }
  ]}
  ]
}
];
(function () { const order = ["wk1", "wk25", "hw2", "outact", "wk7", "midway", "final"]; EXAMS.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id)); })();

/* ============================================================ FLASHCARDS */
const CARDS = [
  ["Intercept (b₀)","Predicted outcome when every predictor = 0. Where the line crosses the y-axis.","slr"],
  ["Slope (b₁) in linear regression","Average change in Y for a one-unit increase in X (holding other X's constant in multiple regression).","slr"],
  ["β in logistic regression","Change in the LOG-ODDS of the outcome for a one-unit increase in X. Exponentiate → odds ratio.","logistic"],
  ["Odds ratio = ?","exp(β). Odds after a one-unit change ÷ original odds.","odds-ratio"],
  ["OR = 1.35 in words","35% higher odds (1.35 times the odds). Never 'more likely'.","odds-ratio"],
  ["OR = 0.70 in words","30% lower odds: (1 − 0.70) × 100. Protective.","odds-ratio"],
  ["When is an OR significant?","When its 95% CI does NOT include 1.","ci"],
  ["When is a slope significant (by CI)?","When its 95% CI does NOT include 0.","ci"],
  ["R² meaning","Percent of the variability in the outcome explained by the model. R² = SS_model / SS_total.","r2"],
  ["Adjusted R²","R² penalized for the number of predictors. Report it for multiple regression.","r2"],
  ["F-test in regression","Is the model better than an intercept-only (mean) model? H₀: all β = 0. F = MS_model / MS_residual.","hypothesis"],
  ["F in ANOVA","Between-group variability ÷ within-group variability.","anova"],
  ["Partial F test","Reduced vs full model: anova(reduced, full). Significant → the full model explains more.","hypothesis"],
  ["7 assumptions of MLR (CINLHR + M)","Continuous outcome · Independent obs · Normal variables · Linearity · Homoscedasticity · Residuals independent & normal · no perfect Multicollinearity","assumptions-mlr"],
  ["Breusch-Pagan p < .05 means…","Homoscedasticity NOT met (variance isn't constant).","assumptions-mlr"],
  ["Durbin-Watson p < .05 means…","Residuals are NOT independent.","assumptions-mlr"],
  ["Multicollinearity cutoffs","VIF > 5 or correlation between predictors > .7.","multicollinearity"],
  ["Logistic regression assumptions","Binary outcome · independence · linearity of the logit · no multicollinearity · no complete separation · ~10 events per predictor","assumptions-logistic"],
  ["Homoscedasticity","Constant variance of residuals. Violation looks like a fan/funnel.","assumptions-mlr"],
  ["Complete separation","A predictor perfectly predicts a binary outcome → estimates blow up (jockeys vs basketball players by height).","separation"],
  ["Standardized residual cutoff","|z| > 1.96 (some use > 3). Expect ~5% beyond 1.96 by chance.","diagnostics"],
  ["Leverage cutoff","> 2k/n, k = predictors + 1. Range 0–1.","diagnostics"],
  ["Cook's distance cutoff","> 4/n (some use > 1).","diagnostics"],
  ["Outlier vs influential","Outlier = unusual value. Influential = changes the slope.","diagnostics"],
  ["4 steps to running a regression","Check assumptions → run model → outliers & influence → interpret & report.","mlr"],
  ["What to report for each slope","Value (β), direction, significance (t, p), 95% CI.","writing"],
  ["Dummy variables","k categories → k − 1 dummies. Each is compared to the reference group.","data"],
  ["Hierarchical vs stepwise","Hierarchical: you choose the order (theory). Stepwise: the computer chooses (exploration only).","mlr"],
  ["OLS vs MLE","OLS minimizes squared residuals (linear). MLE maximizes the probability of the data (logistic/GLM).","logistic"],
  ["p → odds → log-odds","p = 0.6 → odds = 1.5 → log-odds = 0.405.","logistic"],
  ["Logistic probability equation","P(Y) = 1 / (1 + e^−(b₀ + b₁X₁ + … + bₙXₙ))","equations"],
  ["Binary / ordinal / 3+ categories / counts","Binary logistic · ordered logistic · multinomial · Poisson or negative binomial.","choose-test"],
  ["z value in glm output","Logistic version of t: β / SE.","logistic"],
  ["Mean vs median","Mean is pulled by outliers; median resists. Skewed → median.","descriptive"],
  ["Pearson's r effect sizes","±.1 small, ±.3 medium, ±.6 large. r² = shared variance.","correlation"],
  ["Parametric ↔ non-parametric","t-test ↔ Mann-Whitney · paired t ↔ Wilcoxon signed-rank · ANOVA ↔ Kruskal-Wallis · Pearson ↔ Spearman","choose-test"],
  ["Chi-square","Two categorical variables: are counts different from expected under independence?","chisq"],
  ["One-way vs two-way ANOVA","One factor vs two factors (+ interaction).","anova"],
  ["Repeated measures ANOVA","Same participants 3+ times. Assumes sphericity.","rm-anova"],
  ["Omnibus test","Tests for ANY overall effect, not where it is. Follow with post-hoc tests.","omnibus"],
  ["Post-hoc tests","After a significant omnibus test with 3+ groups, to find which pairs differ (Tukey, Bonferroni).","posthoc"],
  ["'Adjusted for age'","Holding age constant: comparing people of the same age.","confounding"],
  ["Statistical vs practical significance","Statistical: unlikely by chance. Practical: big enough to matter.","testing"]
];

const TOPICS = {
  "slr":"Simple linear regression","mlr":"Multiple regression","interpret":"Interpreting output","r2":"R² & model fit",
  "significance":"Significance","logistic":"Logistic regression","odds-ratio":"Odds ratios","ci":"Confidence intervals",
  "assumptions-mlr":"MLR assumptions","assumptions-logistic":"Logistic assumptions","assumptions":"Assumptions","multicollinearity":"Multicollinearity",
  "separation":"Complete separation","diagnostics":"Outliers & influence","anova":"ANOVA","rm-anova":"Repeated measures","posthoc":"Post-hoc tests",
  "omnibus":"Omnibus tests","chisq":"Chi-square","descriptive":"Descriptive stats","choose-test":"Choosing a test","correlation":"Correlation",
  "equations":"Equations","hypothesis":"Hypotheses","confounding":"Confounding","public-health":"Public health meaning","study-design":"Study design",
  "writing":"Writing results","normality":"Normality","prediction":"Prediction","data-prep":"Data prep","testing":"Hypothesis testing","data":"Variables & dummies","fit":"F, R² & fit"
};
