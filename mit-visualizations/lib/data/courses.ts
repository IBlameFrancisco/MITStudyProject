/**
 * MIT Study Project - Course Data
 * ================================
 * Contains all course content including units, sections, and practice problems.
 */

import type { Course, Unit, TopicSection, PracticeProblem } from './types';

// Re-export types for backwards compatibility
export type { Course, Unit, TopicSection, PracticeProblem };

// =============================================================================
// COURSE DATA
// =============================================================================

export const courses: Course[] = [
  {
    id: '18-600',
    number: '18.600',
    title: 'Probability and Random Variables',
    description: 'Probability spaces, random variables, distribution functions, moment generating functions, limit theorems, and random processes.',
    color: 'bg-blue-600',
    units: [
      // Unit 1: Counting and Basic Probability
      {
        id: 'counting',
        title: 'Counting and Basic Probability',
        description: 'Fundamental counting principles, permutations, combinations, and the axiomatic foundations of probability theory.',
        sections: [
          {
            title: 'Fundamental Counting Principles',
            content: `The **Multiplication Principle** states that if an experiment consists of $k$ stages, where stage $i$ has $n_i$ possible outcomes, then the total number of outcomes is:

$$n_1 \\times n_2 \\times \\cdots \\times n_k = \\prod_{i=1}^{k} n_i$$

The **Addition Principle** states that if $A_1, A_2, \\ldots, A_k$ are disjoint sets, then:

$$|A_1 \\cup A_2 \\cup \\cdots \\cup A_k| = |A_1| + |A_2| + \\cdots + |A_k|$$

**Example:** A license plate has 3 letters followed by 4 digits. How many plates are possible?
- Letters: $26^3$ choices
- Digits: $10^4$ choices
- Total: $26^3 \\times 10^4 = 175,760,000$`
          },
          {
            title: 'Permutations',
            content: `A **permutation** is an ordered arrangement of objects. The number of ways to arrange $n$ distinct objects is:

$$n! = n \\times (n-1) \\times (n-2) \\times \\cdots \\times 2 \\times 1$$

By convention, $0! = 1$. This follows from the recursive definition $n! = n \\cdot (n-1)!$.

The number of ways to arrange $k$ objects chosen from $n$ distinct objects (order matters) is:

$$P(n,k) = \\frac{n!}{(n-k)!} = n(n-1)(n-2)\\cdots(n-k+1)$$

**Permutations with Repetition:** If we have $n$ objects where there are $n_1$ identical objects of type 1, $n_2$ of type 2, etc., with $n_1 + n_2 + \\cdots + n_r = n$, then the number of distinct permutations is the **multinomial coefficient**:

$$\\binom{n}{n_1, n_2, \\ldots, n_r} = \\frac{n!}{n_1! n_2! \\cdots n_r!}$$`
          },
          {
            title: 'Combinations',
            content: `A **combination** is an unordered selection of objects. The number of ways to choose $k$ objects from $n$ distinct objects (order does not matter) is the **binomial coefficient**:

$$\\binom{n}{k} = C(n,k) = \\frac{n!}{k!(n-k)!} = \\frac{P(n,k)}{k!}$$

**Key Properties:**
- Symmetry: $\\binom{n}{k} = \\binom{n}{n-k}$
- Pascal's Identity: $\\binom{n}{k} = \\binom{n-1}{k-1} + \\binom{n-1}{k}$
- Sum: $\\sum_{k=0}^{n} \\binom{n}{k} = 2^n$

**The Binomial Theorem:** For any $x, y$ and non-negative integer $n$:

$$(x + y)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^k y^{n-k}$$`
          },
          {
            title: 'Axiomatic Probability (Kolmogorov Axioms)',
            content: `A **probability space** is a triple $(\\Omega, \\mathcal{F}, P)$ where:
- $\\Omega$ is the **sample space** (set of all outcomes)
- $\\mathcal{F}$ is a **$\\sigma$-algebra** of events (subsets of $\\Omega$)
- $P: \\mathcal{F} \\to [0,1]$ is a **probability measure**

**Kolmogorov's Axioms:**
1. **Non-negativity:** For any event $A \\in \\mathcal{F}$, $P(A) \\geq 0$
2. **Normalization:** $P(\\Omega) = 1$
3. **Countable Additivity:** For any countable collection of mutually disjoint events $A_1, A_2, \\ldots$:

$$P\\left(\\bigcup_{i=1}^{\\infty} A_i\\right) = \\sum_{i=1}^{\\infty} P(A_i)$$

**Consequences of the Axioms:**
- $P(\\emptyset) = 0$
- $P(A^c) = 1 - P(A)$
- If $A \\subseteq B$, then $P(A) \\leq P(B)$
- **Inclusion-Exclusion:** $P(A \\cup B) = P(A) + P(B) - P(A \\cap B)$
- **Union Bound (Boole's Inequality):** $P\\left(\\bigcup_{i} A_i\\right) \\leq \\sum_{i} P(A_i)$`
          }
        ],
        practiceProblems: [
          {
            id: 'counting-1',
            problem: `A committee of 5 people is to be formed from 6 men and 4 women. In how many ways can this be done if:

**(a)** There are no restrictions?

**(b)** The committee must have exactly 3 men and 2 women?

**(c)** The committee must have at least 3 women?`,
            solution: `**(a)** No restrictions:
We simply choose 5 people from 10:
$$\\binom{10}{5} = \\frac{10!}{5!5!} = 252$$

**(b)** Exactly 3 men and 2 women:
Choose 3 men from 6 AND 2 women from 4:
$$\\binom{6}{3} \\times \\binom{4}{2} = 20 \\times 6 = 120$$

**(c)** At least 3 women means either 3 women or 4 women:
- 3 women (2 men): $\\binom{4}{3} \\times \\binom{6}{2} = 4 \\times 15 = 60$
- 4 women (1 man): $\\binom{4}{4} \\times \\binom{6}{1} = 1 \\times 6 = 6$

Total: $60 + 6 = \\boxed{66}$`
          },
          {
            id: 'counting-2',
            problem: `Prove that for all $n \\geq 1$:

$$\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}$$

*Hint: Consider the coefficient of $x^n$ , in $(1+x)^n(1+x)^n = (1+x)^{2n}$.*`,
            solution: `**Algebraic Proof using Generating Functions:**

Consider the identity $(1+x)^n \\cdot (1+x)^n = (1+x)^{2n}$.

**Left side:**
$$(1+x)^n = \\sum_{k=0}^{n} \\binom{n}{k} x^k$$

The coefficient of $x^n$ in $(1+x)^n \\cdot (1+x)^n$ is found by multiplying terms whose exponents sum to $n$:
$$\\sum_{k=0}^{n} \\binom{n}{k} \\cdot \\binom{n}{n-k} = \\sum_{k=0}^{n} \\binom{n}{k}^2$$

where we used $\\binom{n}{n-k} = \\binom{n}{k}$.

**Right side:**
The coefficient of $x^n$ in $(1+x)^{2n}$ is $\\binom{2n}{n}$.

Since both sides are equal: $\\boxed{\\sum_{k=0}^{n} \\binom{n}{k}^2 = \\binom{2n}{n}}$

**Combinatorial Interpretation:** Choose $n$ people from $2n$ people (n men, n women). This equals the sum over all $k$ of choosing $k$ men and $n-k$ women.`
          },
          {
            id: 'counting-3',
            problem: `A fair die is rolled 6 times. What is the probability that each face appears exactly once?`,
            solution: `**Sample Space:** Each roll has 6 outcomes, and there are 6 rolls, so:
$$|\\Omega| = 6^6$$

**Favorable Outcomes:** We need each of the faces 1, 2, 3, 4, 5, 6 to appear exactly once. This is a permutation of 6 distinct objects:
$$|A| = 6!$$

**Probability:**
$$P(\\text{each face once}) = \\frac{6!}{6^6} = \\frac{720}{46656} = \\frac{5}{324} \\approx 0.0154$$

This is approximately **1.54%**.`
          }
        ],
        visualizations: ['PascalTriangle', 'ProbabilityTree'],
      },
      // Unit 2: Conditional Probability and Independence
      {
        id: 'conditional-probability',
        title: 'Conditional Probability and Independence',
        description: "Conditional probability, Bayes' theorem, the law of total probability, and statistical independence.",
        sections: [
          {
            title: 'Conditional Probability',
            content: `For events $A$ and $B$ with $P(B) > 0$, the **conditional probability** of $A$ given $B$ is:

$$P(A|B) = \\frac{P(A \\cap B)}{P(B)}$$

**Intuition:** We restrict our attention to outcomes where $B$ occurred, then ask what fraction of those also have $A$.

**Properties of Conditional Probability:**
Fixing $B$ with $P(B) > 0$, the function $P(\\cdot|B)$ is itself a probability measure:
- $P(A|B) \\geq 0$
- $P(\\Omega|B) = 1$
- $P(A_1 \\cup A_2|B) = P(A_1|B) + P(A_2|B)$ for disjoint $A_1, A_2$

**The Multiplication Rule:** Rearranging the definition:
$$P(A \\cap B) = P(A|B) \\cdot P(B) = P(B|A) \\cdot P(A)$$

This extends to multiple events:
$$P(A_1 \\cap A_2 \\cap \\cdots \\cap A_n) = P(A_1) \\cdot P(A_2|A_1) \\cdot P(A_3|A_1 \\cap A_2) \\cdots$$`
          },
          {
            title: 'Law of Total Probability',
            content: `If $B_1, B_2, \\ldots, B_n$ form a **partition** of $\\Omega$ (i.e., they are mutually exclusive and $\\bigcup_i B_i = \\Omega$) with $P(B_i) > 0$ for all $i$, then for any event $A$:

$$P(A) = \\sum_{i=1}^{n} P(A|B_i) \\cdot P(B_i)$$

**Intuition:** We decompose $A$ into disjoint pieces $A \\cap B_1, A \\cap B_2, \\ldots$ and sum their probabilities.

**Example:** A factory has 3 machines producing items:
- Machine 1: 30% of items, 2% defective
- Machine 2: 45% of items, 3% defective
- Machine 3: 25% of items, 5% defective

Probability an item is defective:
$$P(D) = 0.02(0.30) + 0.03(0.45) + 0.05(0.25) = 0.032 = 3.2\\%$$`
          },
          {
            title: "Bayes' Theorem",
            content: `**Bayes' Theorem** allows us to "invert" conditional probabilities. If $B_1, \\ldots, B_n$ partition $\\Omega$:

$$P(B_j|A) = \\frac{P(A|B_j) \\cdot P(B_j)}{\\sum_{i=1}^{n} P(A|B_i) \\cdot P(B_i)} = \\frac{P(A|B_j) \\cdot P(B_j)}{P(A)}$$

**Terminology in Bayesian inference:**
- $P(B_j)$: **Prior probability** (belief before observing $A$)
- $P(A|B_j)$: **Likelihood** (probability of evidence given hypothesis)
- $P(B_j|A)$: **Posterior probability** (updated belief after observing $A$)

**The Odds Form of Bayes' Theorem:**
$$\\frac{P(B_1|A)}{P(B_2|A)} = \\frac{P(A|B_1)}{P(A|B_2)} \\cdot \\frac{P(B_1)}{P(B_2)}$$

Posterior odds = Likelihood ratio × Prior odds`
          },
          {
            title: 'Independence',
            content: `Events $A$ and $B$ are **independent** if:
$$P(A \\cap B) = P(A) \\cdot P(B)$$

Equivalently (when $P(B) > 0$): $P(A|B) = P(A)$ — knowing $B$ gives no information about $A$.

**Mutual Independence:** Events $A_1, A_2, \\ldots, A_n$ are **mutually independent** if for every subset $S \\subseteq \\{1, \\ldots, n\\}$:
$$P\\left(\\bigcap_{i \\in S} A_i\\right) = \\prod_{i \\in S} P(A_i)$$

**Warning:** Pairwise independence does NOT imply mutual independence!

**Conditional Independence:** $A$ and $B$ are conditionally independent given $C$ if:
$$P(A \\cap B | C) = P(A|C) \\cdot P(B|C)$$

Note: Independence and conditional independence are distinct concepts. Two events can be independent but conditionally dependent, or vice versa.`
          }
        ],
        practiceProblems: [
          {
            id: 'conditional-1',
            problem: `A medical test for a disease has the following characteristics:
- Sensitivity (true positive rate): $P(+|D) = 0.95$
- Specificity (true negative rate): $P(-|D^c) = 0.90$
- Disease prevalence: $P(D) = 0.01$

**(a)** What is the probability that a person who tests positive actually has the disease?

**(b)** What is the probability that a person who tests negative is disease-free?`,
            solution: `**(a)** We want $P(D|+)$. By Bayes' theorem:

$$P(D|+) = \\frac{P(+|D) \\cdot P(D)}{P(+)}$$

First, find $P(+)$ using the law of total probability:
$$P(+) = P(+|D)P(D) + P(+|D^c)P(D^c)$$
$$= (0.95)(0.01) + (0.10)(0.99) = 0.0095 + 0.099 = 0.1085$$

Therefore:
$$P(D|+) = \\frac{(0.95)(0.01)}{0.1085} = \\frac{0.0095}{0.1085} \\approx \\boxed{0.0876}$$

Only about **8.76%** of positive tests are true positives! This counterintuitive result is called the **base rate fallacy**.

**(b)** We want $P(D^c|-)$:
$$P(-) = P(-|D)P(D) + P(-|D^c)P(D^c) = (0.05)(0.01) + (0.90)(0.99) = 0.8915$$

$$P(D^c|-) = \\frac{P(-|D^c)P(D^c)}{P(-)} = \\frac{(0.90)(0.99)}{0.8915} = \\frac{0.891}{0.8915} \\approx \\boxed{0.9994}$$

A negative test is **99.94%** reliable.`
          },
          {
            id: 'conditional-2',
            problem: `Let $A$, $B$, $C$ be events with $P(A) = P(B) = P(C) = 1/2$, $P(A \\cap B) = P(A \\cap C) = P(B \\cap C) = 1/4$, and $P(A \\cap B \\cap C) = 1/8$.

**(a)** Are $A$, $B$, $C$ pairwise independent?

**(b)** Are $A$, $B$, $C$ mutually independent?`,
            solution: `**(a)** Pairwise independence:
Check if $P(A \\cap B) = P(A)P(B)$ for each pair:
- $P(A \\cap B) = 1/4$ and $P(A)P(B) = (1/2)(1/2) = 1/4$ ✓
- $P(A \\cap C) = 1/4$ and $P(A)P(C) = 1/4$ ✓
- $P(B \\cap C) = 1/4$ and $P(B)P(C) = 1/4$ ✓

**Yes, they are pairwise independent.**

**(b)** Mutual independence requires all subset products to match. We need:
$$P(A \\cap B \\cap C) = P(A)P(B)P(C)$$

Check: $P(A \\cap B \\cap C) = 1/8$

But: $P(A)P(B)P(C) = (1/2)(1/2)(1/2) = 1/8$ ✓

All conditions satisfied, so **yes, they are mutually independent.**

Note: This example shows that pairwise independence with the three-way product matching implies mutual independence. But in general, one must check all $2^n - n - 1$ subset conditions.`
          },
          {
            id: 'conditional-3',
            problem: `You have two coins: Coin A is fair, and Coin B has $P(\\text{heads}) = 0.7$. You pick a coin uniformly at random and flip it twice.

**(a)** What is the probability of getting two heads?

**(b)** Given that both flips were heads, what is the probability you picked Coin B?`,
            solution: `Let $A$ = picked Coin A, $B$ = picked Coin B, $HH$ = two heads.

**(a)** By the law of total probability:
$$P(HH) = P(HH|A)P(A) + P(HH|B)P(B)$$
$$= (0.5)^2(0.5) + (0.7)^2(0.5)$$
$$= (0.25)(0.5) + (0.49)(0.5)$$
$$= 0.125 + 0.245 = \\boxed{0.37}$$

**(b)** Using Bayes' theorem:
$$P(B|HH) = \\frac{P(HH|B)P(B)}{P(HH)} = \\frac{(0.49)(0.5)}{0.37} = \\frac{0.245}{0.37} \\approx \\boxed{0.662}$$

Given two heads, there's about a **66.2%** chance you picked the biased coin.`
          }
        ],
        visualizations: ['BayesTheorem', 'ProbabilityTree'],
      },
      // Unit 3: Random Variables
      {
        id: 'random-variables',
        title: 'Random Variables',
        description: 'Definition and properties of random variables, probability mass functions, probability density functions, and cumulative distribution functions.',
        sections: [
          {
            title: 'Definition of Random Variables',
            content: `A **random variable** is a function $X: \\Omega \\to \\mathbb{R}$ that assigns a real number to each outcome in the sample space.

Formally, $X$ must be **measurable**: for any Borel set $B \\subseteq \\mathbb{R}$, the preimage $X^{-1}(B) = \\{\\omega \\in \\Omega : X(\\omega) \\in B\\}$ must be an event (in the $\\sigma$-algebra $\\mathcal{F}$).

**Types of Random Variables:**
- **Discrete:** Takes values in a countable set (finite or countably infinite)
- **Continuous:** Takes values in an uncountable set (typically an interval of $\\mathbb{R}$)
- **Mixed:** Has both discrete and continuous components

**Notation:** We write $P(X = x)$ to mean $P(\\{\\omega : X(\\omega) = x\\})$ and $P(X \\leq x)$ to mean $P(\\{\\omega : X(\\omega) \\leq x\\})$.`
          },
          {
            title: 'Probability Mass Function (PMF)',
            content: `For a **discrete** random variable $X$ with possible values $\\{x_1, x_2, \\ldots\\}$, the **probability mass function (PMF)** is:

$$p_X(x) = P(X = x)$$

**Properties of a valid PMF:**
1. $p_X(x) \\geq 0$ for all $x$
2. $\\sum_{x} p_X(x) = 1$ (sum over all possible values)
3. $P(X \\in A) = \\sum_{x \\in A} p_X(x)$

**Example:** For $X \\sim \\text{Binomial}(n, p)$:
$$p_X(k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad k = 0, 1, \\ldots, n$$

The PMF completely characterizes the distribution of a discrete random variable.`
          },
          {
            title: 'Probability Density Function (PDF)',
            content: `For a **continuous** random variable $X$, the **probability density function (PDF)** $f_X(x)$ satisfies:

$$P(a \\leq X \\leq b) = \\int_a^b f_X(x) \\, dx$$

**Properties of a valid PDF:**
1. $f_X(x) \\geq 0$ for all $x$
2. $\\int_{-\\infty}^{\\infty} f_X(x) \\, dx = 1$

**Important:** $f_X(x)$ is NOT a probability! It can exceed 1. Only the integral gives probability.

**Key insight:** For continuous $X$:
$$P(X = x) = 0 \\text{ for any single point } x$$

This is because a single point has zero "width" under the integral.

**Example:** For $X \\sim \\text{Uniform}(0, 1)$:
$$f_X(x) = \\begin{cases} 1 & 0 \\leq x \\leq 1 \\\\ 0 & \\text{otherwise} \\end{cases}$$`
          },
          {
            title: 'Cumulative Distribution Function (CDF)',
            content: `The **cumulative distribution function (CDF)** of any random variable $X$ is:

$$F_X(x) = P(X \\leq x)$$

**Properties of CDFs:**
1. $F_X$ is **non-decreasing**: $x_1 < x_2 \\Rightarrow F_X(x_1) \\leq F_X(x_2)$
2. $\\lim_{x \\to -\\infty} F_X(x) = 0$ and $\\lim_{x \\to \\infty} F_X(x) = 1$
3. $F_X$ is **right-continuous**: $\\lim_{h \\to 0^+} F_X(x+h) = F_X(x)$

**Useful formulas:**
- $P(X > x) = 1 - F_X(x)$
- $P(a < X \\leq b) = F_X(b) - F_X(a)$
- For continuous $X$: $f_X(x) = F_X'(x)$ (derivative of CDF)

**Relationship between PDF and CDF:**
$$F_X(x) = \\int_{-\\infty}^{x} f_X(t) \\, dt$$

For discrete $X$: $F_X(x) = \\sum_{k \\leq x} p_X(k)$ (step function)`
          },
          {
            title: 'Functions of Random Variables',
            content: `If $X$ is a random variable and $g: \\mathbb{R} \\to \\mathbb{R}$, then $Y = g(X)$ is also a random variable.

**Discrete case:** If $X$ is discrete with PMF $p_X$, then:
$$p_Y(y) = \\sum_{x: g(x) = y} p_X(x)$$

**Continuous case (monotonic $g$):** If $g$ is strictly monotonic and differentiable, then:
$$f_Y(y) = f_X(g^{-1}(y)) \\cdot \\left| \\frac{d}{dy} g^{-1}(y) \\right|$$

**CDF Method (general approach):** For any $g$:
1. Find $F_Y(y) = P(Y \\leq y) = P(g(X) \\leq y)$
2. Express in terms of $X$ and use known distribution of $X$
3. Differentiate to get $f_Y$ if continuous

**Example:** If $X \\sim \\text{Uniform}(0,1)$ and $Y = -\\ln(X)$, then $Y \\sim \\text{Exponential}(1)$.`
          }
        ],
        practiceProblems: [
          {
            id: 'rv-1',
            problem: `Let $X$ be a continuous random variable with PDF:
$$f_X(x) = \\begin{cases} cx^2 & 0 \\leq x \\leq 2 \\\\ 0 & \\text{otherwise} \\end{cases}$$

**(a)** Find the constant $c$.

**(b)** Find the CDF $F_X(x)$.

**(c)** Compute $P(1 \\leq X \\leq 1.5)$.`,
            solution: `**(a)** Use normalization: $\\int_{-\\infty}^{\\infty} f_X(x) \\, dx = 1$

$$\\int_0^2 cx^2 \\, dx = c \\cdot \\frac{x^3}{3} \\Big|_0^2 = c \\cdot \\frac{8}{3} = 1$$

$$c = \\boxed{\\frac{3}{8}}$$

**(b)** For $x < 0$: $F_X(x) = 0$

For $0 \\leq x \\leq 2$:
$$F_X(x) = \\int_0^x \\frac{3}{8}t^2 \\, dt = \\frac{3}{8} \\cdot \\frac{t^3}{3} \\Big|_0^x = \\frac{x^3}{8}$$

For $x > 2$: $F_X(x) = 1$

$$\\boxed{F_X(x) = \\begin{cases} 0 & x < 0 \\\\ x^3/8 & 0 \\leq x \\leq 2 \\\\ 1 & x > 2 \\end{cases}}$$

**(c)** Using the CDF:
$$P(1 \\leq X \\leq 1.5) = F_X(1.5) - F_X(1) = \\frac{(1.5)^3}{8} - \\frac{1^3}{8} = \\frac{3.375 - 1}{8} = \\boxed{\\frac{2.375}{8} = 0.297}$$`
          },
          {
            id: 'rv-2',
            problem: `Let $X \\sim \\text{Uniform}(0, 1)$. Find the PDF of $Y = X^2$.`,
            solution: `**Using the CDF method:**

For $0 \\leq y \\leq 1$:
$$F_Y(y) = P(Y \\leq y) = P(X^2 \\leq y) = P(X \\leq \\sqrt{y})$$

Since $X \\geq 0$ always (support is $[0,1]$):
$$F_Y(y) = P(X \\leq \\sqrt{y}) = \\sqrt{y}$$

(using $F_X(x) = x$ for Uniform$(0,1)$)

Differentiating to get the PDF:
$$f_Y(y) = \\frac{d}{dy} F_Y(y) = \\frac{d}{dy} \\sqrt{y} = \\frac{1}{2\\sqrt{y}}$$

$$\\boxed{f_Y(y) = \\begin{cases} \\frac{1}{2\\sqrt{y}} & 0 < y \\leq 1 \\\\ 0 & \\text{otherwise} \\end{cases}}$$

**Verification:** $\\int_0^1 \\frac{1}{2\\sqrt{y}} dy = \\sqrt{y} \\Big|_0^1 = 1$ ✓`
          },
          {
            id: 'rv-3',
            problem: `A random variable $X$ has CDF:
$$F_X(x) = \\begin{cases} 0 & x < 0 \\\\ x/2 & 0 \\leq x < 1 \\\\ 1/2 + (x-1)/4 & 1 \\leq x < 3 \\\\ 1 & x \\geq 3 \\end{cases}$$

**(a)** Is $X$ discrete, continuous, or mixed?

**(b)** Find $P(X = 1)$ and $P(0.5 < X \\leq 2)$.`,
            solution: `**(a)** Check for jumps in the CDF:

At $x = 1^-$: $F_X(1^-) = 1/2$
At $x = 1$: $F_X(1) = 1/2 + 0/4 = 1/2$

No jump at $x = 1$. Checking continuity everywhere: The CDF is continuous everywhere (no jumps), but it consists of linear pieces, suggesting $X$ is **continuous**.

Actually, let's verify the derivative exists: The CDF has different slopes in different regions, but no discontinuities. So $X$ is **continuous** (but not absolutely continuous in the strict sense—it has a piecewise constant PDF).

**(b)** $P(X = 1)$:

For continuous random variables, $P(X = x) = 0$ for any single point.

$$\\boxed{P(X = 1) = 0}$$

$P(0.5 < X \\leq 2)$:
$$P(0.5 < X \\leq 2) = F_X(2) - F_X(0.5)$$
$$F_X(2) = 1/2 + (2-1)/4 = 1/2 + 1/4 = 3/4$$
$$F_X(0.5) = 0.5/2 = 1/4$$
$$P(0.5 < X \\leq 2) = 3/4 - 1/4 = \\boxed{1/2}$$`
          }
        ],
        visualizations: ['CDFPDFVisualizer', 'DistributionPlot'],
      },
      // Unit 4: Expectation and Variance
      {
        id: 'expectation-variance',
        title: 'Expectation and Variance',
        description: 'Expected value, variance, covariance, and their fundamental properties in probability theory.',
        sections: [
          {
            title: 'Expected Value (Mean)',
            content: `The **expected value** (or **mean**) of a random variable is the probability-weighted average of all possible values:

**Discrete:** $E[X] = \\sum_{x} x \\cdot p_X(x)$

**Continuous:** $E[X] = \\int_{-\\infty}^{\\infty} x \\cdot f_X(x) \\, dx$

The expectation exists if and only if $\\sum |x| p_X(x) < \\infty$ or $\\int |x| f_X(x) dx < \\infty$.

**Notation:** We also write $\\mu = E[X]$ or $\\mu_X$ for the mean of $X$.

**Intuition:** If you repeated the experiment infinitely many times, the average of the observed values would converge to $E[X]$ (Law of Large Numbers).`
          },
          {
            title: 'Properties of Expectation',
            content: `**Linearity of Expectation** (the most important property):
$$E[aX + bY] = aE[X] + bE[Y]$$

This holds **always**, even if $X$ and $Y$ are dependent!

**Additional Properties:**
- $E[c] = c$ for any constant $c$
- If $X \\geq 0$ almost surely, then $E[X] \\geq 0$
- If $X \\leq Y$ almost surely, then $E[X] \\leq E[Y]$
- $|E[X]| \\leq E[|X|]$ (triangle inequality)

**LOTUS (Law of the Unconscious Statistician):**
For any function $g$:
$$E[g(X)] = \\sum_{x} g(x) \\cdot p_X(x) \\quad \\text{or} \\quad E[g(X)] = \\int_{-\\infty}^{\\infty} g(x) \\cdot f_X(x) \\, dx$$

This is powerful: we don't need to find the distribution of $g(X)$ first!`
          },
          {
            title: 'Variance and Standard Deviation',
            content: `**Variance** measures the spread of a distribution around its mean:
$$\\Var(X) = E[(X - \\mu)^2] = E[X^2] - (E[X])^2$$

The second form is the **computational formula** and is often easier to use.

**Properties of Variance:**
- $\\Var(X) \\geq 0$, with equality iff $X$ is constant a.s.
- $\\Var(aX + b) = a^2 \\Var(X)$ (shifting by $b$ doesn't change variance)
- $\\Var(X + Y) = \\Var(X) + \\Var(Y) + 2\\Cov(X, Y)$
- If $X, Y$ are **independent**: $\\Var(X + Y) = \\Var(X) + \\Var(Y)$

**Standard Deviation:** $\\sigma_X = \\sqrt{\\Var(X)}$

The standard deviation has the same units as $X$ and provides a natural scale for the distribution.`
          },
          {
            title: 'Covariance and Correlation',
            content: `**Covariance** measures how two random variables vary together:
$$\\Cov(X, Y) = E[(X - \\mu_X)(Y - \\mu_Y)] = E[XY] - E[X]E[Y]$$

**Properties:**
- $\\Cov(X, X) = \\Var(X)$
- $\\Cov(X, Y) = \\Cov(Y, X)$ (symmetric)
- $\\Cov(aX, bY) = ab \\cdot \\Cov(X, Y)$
- $\\Cov(X + Y, Z) = \\Cov(X, Z) + \\Cov(Y, Z)$ (bilinear)
- If $X, Y$ are independent, then $\\Cov(X, Y) = 0$ (converse is FALSE!)

**Correlation** (Pearson's):
$$\\rho(X, Y) = \\frac{\\Cov(X, Y)}{\\sigma_X \\sigma_Y}$$

**Key property:** $-1 \\leq \\rho(X, Y) \\leq 1$

- $\\rho = 1$: perfect positive linear relationship
- $\\rho = -1$: perfect negative linear relationship
- $\\rho = 0$: no linear relationship (but may have nonlinear dependence!)`
          },
          {
            title: 'Conditional Expectation',
            content: `**Conditional expectation given an event:** For $P(A) > 0$:
$$E[X | A] = \\sum_x x \\cdot P(X = x | A)$$

**Conditional expectation given a random variable:** $E[X | Y = y]$ is a function of $y$:
$$E[X | Y = y] = \\sum_x x \\cdot p_{X|Y}(x | y) = \\int x \\cdot f_{X|Y}(x | y) \\, dx$$

$E[X | Y]$ (without fixing $y$) is a random variable — a function of $Y$.

**Law of Iterated Expectation (Tower Property):**
$$E[X] = E[E[X | Y]]$$

This is extremely useful for computing expectations by conditioning.

**Law of Total Variance:**
$$\\Var(X) = E[\\Var(X | Y)] + \\Var(E[X | Y])$$

"Total variance = expected conditional variance + variance of conditional means"`
          }
        ],
        practiceProblems: [
          {
            id: 'ev-1',
            problem: `Let $X$ and $Y$ be random variables with $E[X] = 2$, $E[Y] = 3$, $\\Var(X) = 4$, $\\Var(Y) = 9$, and $\\Cov(X, Y) = -2$.

**(a)** Find $E[3X - 2Y + 5]$.

**(b)** Find $\\Var(3X - 2Y + 5)$.

**(c)** Find $\\rho(X, Y)$.`,
            solution: `**(a)** Using linearity of expectation:
$$E[3X - 2Y + 5] = 3E[X] - 2E[Y] + 5 = 3(2) - 2(3) + 5 = 6 - 6 + 5 = \\boxed{5}$$

**(b)** Using variance properties:
$$\\Var(3X - 2Y + 5) = \\Var(3X - 2Y)$$
$$= 9\\Var(X) + 4\\Var(Y) - 2(3)(2)\\Cov(X,Y)$$
$$= 9(4) + 4(9) - 12(-2)$$
$$= 36 + 36 + 24 = \\boxed{96}$$

Note: $\\Var(aX + bY) = a^2\\Var(X) + b^2\\Var(Y) + 2ab\\Cov(X,Y)$

**(c)** Correlation:
$$\\rho(X, Y) = \\frac{\\Cov(X, Y)}{\\sigma_X \\sigma_Y} = \\frac{-2}{\\sqrt{4} \\cdot \\sqrt{9}} = \\frac{-2}{2 \\cdot 3} = \\boxed{-\\frac{1}{3}}$$`
          },
          {
            id: 'ev-2',
            problem: `Let $N \\sim \\text{Poisson}(\\lambda)$ be the number of customers arriving at a store. Each customer independently spends an amount $X_i$ with $E[X_i] = \\mu$ and $\\Var(X_i) = \\sigma^2$.

Find $E[S]$ and $\\Var(S)$ where $S = \\sum_{i=1}^{N} X_i$ is the total spending.`,
            solution: `This is a **random sum** — the number of terms is itself random.

**Finding $E[S]$ using the Law of Iterated Expectation:**
$$E[S] = E[E[S | N]]$$

Given $N = n$, we have:
$$E[S | N = n] = E\\left[\\sum_{i=1}^{n} X_i\\right] = n\\mu$$

So $E[S | N] = N\\mu$ (as a function of $N$).

$$E[S] = E[N\\mu] = \\mu E[N] = \\boxed{\\lambda \\mu}$$

**Finding $\\Var(S)$ using the Law of Total Variance:**
$$\\Var(S) = E[\\Var(S | N)] + \\Var(E[S | N])$$

Given $N = n$: $\\Var(S | N = n) = n\\sigma^2$ (sum of $n$ independent RVs)

So $\\Var(S | N) = N\\sigma^2$.

$$E[\\Var(S | N)] = E[N\\sigma^2] = \\sigma^2 \\lambda$$

$$\\Var(E[S | N]) = \\Var(N\\mu) = \\mu^2 \\Var(N) = \\mu^2 \\lambda$$

$$\\Var(S) = \\sigma^2 \\lambda + \\mu^2 \\lambda = \\boxed{\\lambda(\\sigma^2 + \\mu^2)}$$`
          },
          {
            id: 'ev-3',
            problem: `Show that for any random variable $X$ with finite variance:
$$\\Var(X) = \\min_{c \\in \\mathbb{R}} E[(X - c)^2]$$

That is, the mean minimizes the expected squared deviation.`,
            solution: `Let $g(c) = E[(X - c)^2]$. We want to minimize this over all $c$.

**Expanding:**
$$g(c) = E[X^2 - 2cX + c^2] = E[X^2] - 2cE[X] + c^2$$

**Taking the derivative:**
$$\\frac{dg}{dc} = -2E[X] + 2c$$

**Setting equal to zero:**
$$-2E[X] + 2c = 0 \\implies c^* = E[X] = \\mu$$

**Verifying it's a minimum:** $\\frac{d^2g}{dc^2} = 2 > 0$ ✓

**Computing the minimum value:**
$$g(\\mu) = E[(X - \\mu)^2] = \\Var(X)$$

Therefore:
$$\\boxed{\\Var(X) = \\min_{c} E[(X - c)^2]}$$

**Interpretation:** The mean is the best constant predictor of $X$ in the mean squared error sense.`
          }
        ],
        visualizations: ['ExpectationVariance'],
      },
      // Unit 5: Common Discrete Distributions
      {
        id: 'discrete-distributions',
        title: 'Common Discrete Distributions',
        description: 'Bernoulli, Binomial, Geometric, Negative Binomial, Poisson, and Hypergeometric distributions with their properties and relationships.',
        sections: [
          {
            title: 'Bernoulli and Binomial Distributions',
            content: `**Bernoulli$(p)$:** A single trial with success probability $p$.
- PMF: $P(X = 1) = p$, $P(X = 0) = 1-p$
- $E[X] = p$
- $\\Var(X) = p(1-p)$

**Binomial$(n, p)$:** Number of successes in $n$ independent Bernoulli$(p)$ trials.

$$P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}, \\quad k = 0, 1, \\ldots, n$$

- $E[X] = np$
- $\\Var(X) = np(1-p)$
- **Additivity:** If $X \\sim \\text{Bin}(n, p)$ and $Y \\sim \\text{Bin}(m, p)$ are independent, then $X + Y \\sim \\text{Bin}(n+m, p)$

**Interpretation:** Binomial$(n, p)$ = sum of $n$ i.i.d. Bernoulli$(p)$ random variables.`
          },
          {
            title: 'Geometric and Negative Binomial Distributions',
            content: `**Geometric$(p)$:** Number of trials until the first success.

$$P(X = k) = (1-p)^{k-1} p, \\quad k = 1, 2, 3, \\ldots$$

- $E[X] = 1/p$
- $\\Var(X) = (1-p)/p^2$
- **Memoryless property:** $P(X > m + n | X > m) = P(X > n)$

The geometric distribution is the **only** discrete memoryless distribution.

**Negative Binomial$(r, p)$:** Number of trials until the $r$-th success.

$$P(X = k) = \\binom{k-1}{r-1} p^r (1-p)^{k-r}, \\quad k = r, r+1, r+2, \\ldots$$

- $E[X] = r/p$
- $\\Var(X) = r(1-p)/p^2$
- Sum of $r$ i.i.d. Geometric$(p)$ random variables`
          },
          {
            title: 'Poisson Distribution',
            content: `**Poisson$(\\lambda)$:** Models the number of events in a fixed interval when events occur at a constant average rate $\\lambda$.

$$P(X = k) = \\frac{e^{-\\lambda} \\lambda^k}{k!}, \\quad k = 0, 1, 2, \\ldots$$

- $E[X] = \\lambda$
- $\\Var(X) = \\lambda$ (mean equals variance!)

**Poisson as a limit of Binomial:**
If $X_n \\sim \\text{Binomial}(n, p_n)$ where $n \\to \\infty$, $p_n \\to 0$, and $np_n \\to \\lambda$, then:
$$X_n \\xrightarrow{d} \\text{Poisson}(\\lambda)$$

**Additivity:** If $X \\sim \\text{Poisson}(\\lambda_1)$ and $Y \\sim \\text{Poisson}(\\lambda_2)$ are independent:
$$X + Y \\sim \\text{Poisson}(\\lambda_1 + \\lambda_2)$$

**Applications:** Rare events, radioactive decay, arrival processes, typos on a page.`
          },
          {
            title: 'Hypergeometric Distribution',
            content: `**Hypergeometric$(N, K, n)$:** Drawing $n$ items **without replacement** from a population of $N$ items containing $K$ successes.

$$P(X = k) = \\frac{\\binom{K}{k} \\binom{N-K}{n-k}}{\\binom{N}{n}}, \\quad k = \\max(0, n-N+K), \\ldots, \\min(n, K)$$

- $E[X] = n \\cdot \\frac{K}{N}$
- $\\Var(X) = n \\cdot \\frac{K}{N} \\cdot \\frac{N-K}{N} \\cdot \\frac{N-n}{N-1}$

The variance has a **finite population correction factor** $\\frac{N-n}{N-1}$.

**Relationship to Binomial:**
- Binomial: sampling **with** replacement
- Hypergeometric: sampling **without** replacement
- As $N \\to \\infty$ with $K/N \\to p$ fixed: Hypergeometric → Binomial$(n, p)$`
          }
        ],
        practiceProblems: [
          {
            id: 'disc-1',
            problem: `A fair coin is flipped repeatedly until the first head appears.

**(a)** What is the probability that exactly 4 flips are needed?

**(b)** What is the expected number of flips?

**(c)** Given that the first 3 flips were tails, what is the expected total number of flips?`,
            solution: `Let $X$ = number of flips until first head. Then $X \\sim \\text{Geometric}(1/2)$.

**(a)** $P(X = 4) = (1/2)^{4-1} \\cdot (1/2) = (1/2)^4 = \\boxed{1/16}$

**(b)** $E[X] = 1/p = 1/(1/2) = \\boxed{2}$

**(c)** By the **memoryless property**:
Given $X > 3$ (first 3 were tails), the expected additional flips is still $E[X] = 2$.

Expected total = 3 (already done) + 2 (expected remaining) = $\\boxed{5}$

**Alternative derivation:**
$E[X | X > 3] = 3 + E[X - 3 | X > 3] = 3 + E[X] = 3 + 2 = 5$

This uses the memoryless property: $X - 3 | (X > 3) \\sim \\text{Geometric}(1/2)$.`
          },
          {
            id: 'disc-2',
            problem: `The number of emails arriving in an hour follows a Poisson distribution with mean 20.

**(a)** What is the probability of receiving exactly 15 emails in an hour?

**(b)** What is the probability of receiving at least 2 emails in a 6-minute period?`,
            solution: `**(a)** Let $X \\sim \\text{Poisson}(20)$.
$$P(X = 15) = \\frac{e^{-20} \\cdot 20^{15}}{15!} \\approx \\boxed{0.0516}$$

**(b)** A 6-minute period is 1/10 of an hour.

By Poisson scaling, the number of emails in 6 minutes is $Y \\sim \\text{Poisson}(20 \\cdot 1/10) = \\text{Poisson}(2)$.

$$P(Y \\geq 2) = 1 - P(Y = 0) - P(Y = 1)$$
$$= 1 - e^{-2} - 2e^{-2}$$
$$= 1 - 3e^{-2}$$
$$\\approx 1 - 3(0.1353) = 1 - 0.406 = \\boxed{0.594}$$`
          },
          {
            id: 'disc-3',
            problem: `A deck of 52 cards contains 4 aces. You draw 5 cards without replacement.

**(a)** Find the probability of getting exactly 2 aces.

**(b)** Compare this to the binomial approximation (sampling with replacement).`,
            solution: `**(a)** This is Hypergeometric$(52, 4, 5)$.

$$P(X = 2) = \\frac{\\binom{4}{2} \\binom{48}{3}}{\\binom{52}{5}}$$

Computing:
- $\\binom{4}{2} = 6$
- $\\binom{48}{3} = \\frac{48 \\cdot 47 \\cdot 46}{6} = 17,296$
- $\\binom{52}{5} = \\frac{52 \\cdot 51 \\cdot 50 \\cdot 49 \\cdot 48}{120} = 2,598,960$

$$P(X = 2) = \\frac{6 \\times 17,296}{2,598,960} = \\frac{103,776}{2,598,960} \\approx \\boxed{0.0399}$$

**(b)** Binomial approximation with $p = 4/52 = 1/13$:

$$P(X = 2) \\approx \\binom{5}{2} \\left(\\frac{1}{13}\\right)^2 \\left(\\frac{12}{13}\\right)^3$$
$$= 10 \\cdot \\frac{1}{169} \\cdot \\frac{1728}{2197} \\approx \\boxed{0.0465}$$

The binomial approximation overestimates by about 17% because it doesn't account for the depletion of aces after drawing.`
          }
        ],
        visualizations: ['DistributionPlot'],
      },
      // Unit 6: Common Continuous Distributions
      {
        id: 'continuous-distributions',
        title: 'Common Continuous Distributions',
        description: 'Uniform, Exponential, Normal, Gamma, Beta, and other important continuous probability distributions.',
        sections: [
          {
            title: 'Uniform Distribution',
            content: `**Uniform$(a, b)$:** Equal probability density over the interval $[a, b]$.

$$f_X(x) = \\begin{cases} \\frac{1}{b-a} & a \\leq x \\leq b \\\\ 0 & \\text{otherwise} \\end{cases}$$

$$F_X(x) = \\begin{cases} 0 & x < a \\\\ \\frac{x-a}{b-a} & a \\leq x \\leq b \\\\ 1 & x > b \\end{cases}$$

- $E[X] = \\frac{a+b}{2}$
- $\\Var(X) = \\frac{(b-a)^2}{12}$

**Key property:** If $U \\sim \\text{Uniform}(0, 1)$ and $F$ is any continuous CDF, then:
$$X = F^{-1}(U) \\sim F$$

This is the **inverse transform method** for generating random variables.`
          },
          {
            title: 'Exponential Distribution',
            content: `**Exponential$(\\lambda)$:** Models the time until the first event in a Poisson process with rate $\\lambda$.

$$f_X(x) = \\lambda e^{-\\lambda x}, \\quad x \\geq 0$$
$$F_X(x) = 1 - e^{-\\lambda x}$$

- $E[X] = 1/\\lambda$
- $\\Var(X) = 1/\\lambda^2$

**Memoryless property:** $P(X > s + t | X > s) = P(X > t)$

The exponential is the **only** continuous memoryless distribution.

**Minimum of exponentials:** If $X_1, \\ldots, X_n$ are independent with $X_i \\sim \\text{Exp}(\\lambda_i)$:
$$\\min(X_1, \\ldots, X_n) \\sim \\text{Exp}(\\lambda_1 + \\cdots + \\lambda_n)$$`
          },
          {
            title: 'Normal (Gaussian) Distribution',
            content: `**Normal$(\\mu, \\sigma^2)$:** The most important continuous distribution.

$$f_X(x) = \\frac{1}{\\sqrt{2\\pi\\sigma^2}} \\exp\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)$$

- $E[X] = \\mu$
- $\\Var(X) = \\sigma^2$

**Standard Normal $Z \\sim N(0, 1)$:**
$$\\Phi(z) = P(Z \\leq z) = \\frac{1}{\\sqrt{2\\pi}} \\int_{-\\infty}^{z} e^{-t^2/2} dt$$

**Standardization:** If $X \\sim N(\\mu, \\sigma^2)$, then $Z = \\frac{X - \\mu}{\\sigma} \\sim N(0, 1)$

**Linear combinations:** If $X_i \\sim N(\\mu_i, \\sigma_i^2)$ are independent:
$$\\sum_{i=1}^n a_i X_i \\sim N\\left(\\sum a_i \\mu_i, \\sum a_i^2 \\sigma_i^2\\right)$$

**68-95-99.7 Rule:** About 68% within $1\\sigma$, 95% within $2\\sigma$, 99.7% within $3\\sigma$.`
          },
          {
            title: 'Gamma Distribution',
            content: `**Gamma$(\\alpha, \\lambda)$:** Generalizes the exponential distribution.

$$f_X(x) = \\frac{\\lambda^\\alpha}{\\Gamma(\\alpha)} x^{\\alpha-1} e^{-\\lambda x}, \\quad x > 0$$

where $\\Gamma(\\alpha) = \\int_0^\\infty t^{\\alpha-1} e^{-t} dt$ is the Gamma function.

- $\\Gamma(n) = (n-1)!$ for positive integers
- $\\Gamma(1/2) = \\sqrt{\\pi}$

**Moments:**
- $E[X] = \\alpha/\\lambda$
- $\\Var(X) = \\alpha/\\lambda^2$

**Special cases:**
- $\\text{Gamma}(1, \\lambda) = \\text{Exponential}(\\lambda)$
- $\\text{Gamma}(n/2, 1/2) = \\chi^2(n)$ (Chi-squared with $n$ degrees of freedom)

**Additivity:** If $X \\sim \\text{Gamma}(\\alpha_1, \\lambda)$ and $Y \\sim \\text{Gamma}(\\alpha_2, \\lambda)$ independent:
$$X + Y \\sim \\text{Gamma}(\\alpha_1 + \\alpha_2, \\lambda)$$`
          },
          {
            title: 'Beta Distribution',
            content: `**Beta$(\\alpha, \\beta)$:** Defined on $[0, 1]$, often used for probabilities.

$$f_X(x) = \\frac{\\Gamma(\\alpha + \\beta)}{\\Gamma(\\alpha)\\Gamma(\\beta)} x^{\\alpha-1}(1-x)^{\\beta-1}, \\quad 0 < x < 1$$

- $E[X] = \\frac{\\alpha}{\\alpha + \\beta}$
- $\\Var(X) = \\frac{\\alpha\\beta}{(\\alpha + \\beta)^2(\\alpha + \\beta + 1)}$

**Special cases:**
- $\\text{Beta}(1, 1) = \\text{Uniform}(0, 1)$
- $\\text{Beta}(1/2, 1/2)$: arcsine distribution

**Bayesian interpretation:** Beta is the conjugate prior for the Binomial likelihood. If prior is $\\text{Beta}(\\alpha, \\beta)$ and we observe $k$ successes in $n$ trials:
$$\\text{Posterior} = \\text{Beta}(\\alpha + k, \\beta + n - k)$$`
          }
        ],
        practiceProblems: [
          {
            id: 'cont-1',
            problem: `The lifetime of a light bulb (in thousands of hours) follows an exponential distribution with mean 2.

**(a)** What is the probability a bulb lasts more than 3000 hours?

**(b)** Given that a bulb has lasted 1000 hours, what is the probability it lasts at least 2000 more hours?`,
            solution: `$X \\sim \\text{Exponential}(\\lambda)$ where $E[X] = 1/\\lambda = 2$, so $\\lambda = 1/2$.

**(a)** $P(X > 3) = e^{-\\lambda \\cdot 3} = e^{-3/2} = e^{-1.5} \\approx \\boxed{0.223}$

**(b)** By the **memoryless property**:
$$P(X > 3 | X > 1) = P(X > 2) = e^{-1} \\approx \\boxed{0.368}$$

The condition that the bulb has already lasted 1000 hours is irrelevant! This is the defining property of the exponential distribution.

**Interpretation:** A used exponential light bulb is stochastically identical to a new one — it doesn't "wear out" in a probabilistic sense.`
          },
          {
            id: 'cont-2',
            problem: `Let $X \\sim N(100, 225)$ (so $\\mu = 100$, $\\sigma = 15$).

**(a)** Find $P(X > 130)$.

**(b)** Find the value $c$ such that $P(X < c) = 0.90$.`,
            solution: `**(a)** Standardize:
$$Z = \\frac{X - 100}{15}$$

$$P(X > 130) = P\\left(Z > \\frac{130 - 100}{15}\\right) = P(Z > 2)$$
$$= 1 - \\Phi(2) = 1 - 0.9772 = \\boxed{0.0228}$$

**(b)** We need $c$ such that $P(X < c) = 0.90$.

Find $z$ such that $\\Phi(z) = 0.90$:
$$z = \\Phi^{-1}(0.90) \\approx 1.282$$

Then:
$$c = \\mu + z\\sigma = 100 + 1.282(15) = 100 + 19.23 = \\boxed{119.23}$$`
          },
          {
            id: 'cont-3',
            problem: `Let $X \\sim \\text{Gamma}(3, 2)$.

**(a)** Find $E[X]$ and $\\Var(X)$.

**(b)** Express $X$ as a sum of exponential random variables.

**(c)** Find $P(X > 1)$ using the relationship to Poisson.`,
            solution: `**(a)** For Gamma$(\\alpha, \\lambda)$:
$$E[X] = \\frac{\\alpha}{\\lambda} = \\frac{3}{2} = \\boxed{1.5}$$
$$\\Var(X) = \\frac{\\alpha}{\\lambda^2} = \\frac{3}{4} = \\boxed{0.75}$$

**(b)** $X = Y_1 + Y_2 + Y_3$ where $Y_i \\iid \\text{Exponential}(2)$.

Since Gamma$(n, \\lambda)$ is the sum of $n$ i.i.d. Exponential$(\\lambda)$ random variables (for integer $n$).

**(c)** $X$ represents the waiting time for 3 events in a Poisson process with rate 2.

$P(X > 1)$ = probability that fewer than 3 events occur by time 1.

Let $N(1) \\sim \\text{Poisson}(2 \\cdot 1) = \\text{Poisson}(2)$.

$$P(X > 1) = P(N(1) \\leq 2) = P(N(1) = 0) + P(N(1) = 1) + P(N(1) = 2)$$
$$= e^{-2} + 2e^{-2} + \\frac{4}{2}e^{-2} = 5e^{-2} \\approx \\boxed{0.677}$$`
          }
        ],
        visualizations: ['DistributionPlot'],
      },
      // Unit 7: Joint Distributions
      {
        id: 'joint-distributions',
        title: 'Joint Distributions',
        description: 'Joint, marginal, and conditional distributions for multiple random variables.',
        sections: [
          {
            title: 'Joint Probability Distributions',
            content: `**Joint PMF (discrete):** For discrete $X, Y$:
$$p_{X,Y}(x, y) = P(X = x, Y = y)$$

**Joint PDF (continuous):** For continuous $X, Y$:
$$P((X, Y) \\in A) = \\iint_A f_{X,Y}(x, y) \\, dx \\, dy$$

**Properties:**
- $p_{X,Y}(x, y) \\geq 0$ and $\\sum_x \\sum_y p_{X,Y}(x, y) = 1$
- $f_{X,Y}(x, y) \\geq 0$ and $\\iint f_{X,Y}(x, y) \\, dx \\, dy = 1$

**Joint CDF:**
$$F_{X,Y}(x, y) = P(X \\leq x, Y \\leq y)$$`
          },
          {
            title: 'Marginal and Conditional Distributions',
            content: `**Marginal distributions** recover individual distributions from joints.

**Continuous:**
$$f_X(x) = \\int_{-\\infty}^{\\infty} f_{X,Y}(x, y) \\, dy, \\quad f_Y(y) = \\int_{-\\infty}^{\\infty} f_{X,Y}(x, y) \\, dx$$

**Conditional PDF:**
$$f_{X|Y}(x|y) = \\frac{f_{X,Y}(x, y)}{f_Y(y)} \\quad \\text{for } f_Y(y) > 0$$

**Independence:** $X$ and $Y$ are independent iff:
$$f_{X,Y}(x, y) = f_X(x) \\cdot f_Y(y) \\quad \\text{for all } x, y$$`
          },
          {
            title: 'Multivariate Normal',
            content: `The **bivariate normal** $(X, Y)$ has parameters $\\mu_X, \\mu_Y, \\sigma_X^2, \\sigma_Y^2, \\rho$.

**Key Properties:**
1. Marginals are normal: $X \\sim N(\\mu_X, \\sigma_X^2)$, $Y \\sim N(\\mu_Y, \\sigma_Y^2)$
2. Any linear combination is normal
3. **Uncorrelated implies independent** (unique to MVN!)

**Conditional distribution:**
$$Y | X = x \\sim N\\left(\\mu_Y + \\rho\\frac{\\sigma_Y}{\\sigma_X}(x - \\mu_X), \\sigma_Y^2(1-\\rho^2)\\right)$$`
          }
        ],
        practiceProblems: [
          {
            id: 'joint-1',
            problem: `Let $(X, Y)$ have joint PDF $f_{X,Y}(x, y) = 6xy^2$ for $0 < x < 1$, $0 < y < 1$.

**(a)** Find the marginal PDFs.
**(b)** Are $X$ and $Y$ independent?`,
            solution: `**(a)** $f_X(x) = \\int_0^1 6xy^2 \\, dy = 6x \\cdot \\frac{1}{3} = \\boxed{2x}$ for $0 < x < 1$.

$f_Y(y) = \\int_0^1 6xy^2 \\, dx = 6y^2 \\cdot \\frac{1}{2} = \\boxed{3y^2}$ for $0 < y < 1$.

**(b)** Check: $f_X(x) \\cdot f_Y(y) = 2x \\cdot 3y^2 = 6xy^2 = f_{X,Y}(x, y)$ ✓

**Yes, $X$ and $Y$ are independent.**`
          }
        ],
        visualizations: ['JointDistribution'],
      },
      // Unit 8: Sums of Random Variables
      {
        id: 'sums-random-variables',
        title: 'Sums of Random Variables',
        description: 'Convolution, moment generating functions, and distributions of sums.',
        sections: [
          {
            title: 'Convolution and MGFs',
            content: `For independent $X$ and $Y$, the PDF of $Z = X + Y$ is the **convolution**:

$$f_Z(z) = \\int_{-\\infty}^{\\infty} f_X(x) f_Y(z - x) \\, dx = (f_X * f_Y)(z)$$

**Moment Generating Function:**
$$M_X(t) = E[e^{tX}]$$

**Key property:** For independent $X, Y$: $M_{X+Y}(t) = M_X(t) \\cdot M_Y(t)$

**Common MGFs:**
- Normal$(\\mu, \\sigma^2)$: $e^{\\mu t + \\sigma^2 t^2/2}$
- Poisson$(\\lambda)$: $e^{\\lambda(e^t - 1)}$
- Exponential$(\\lambda)$: $\\frac{\\lambda}{\\lambda - t}$`
          },
          {
            title: 'Sums of Common Distributions',
            content: `**Sum of independent normals:**
$$N(\\mu_1, \\sigma_1^2) + N(\\mu_2, \\sigma_2^2) = N(\\mu_1 + \\mu_2, \\sigma_1^2 + \\sigma_2^2)$$

**Sum of independent Poissons:**
$$\\text{Pois}(\\lambda_1) + \\text{Pois}(\\lambda_2) = \\text{Pois}(\\lambda_1 + \\lambda_2)$$

**Sum of independent Gammas (same rate):**
$$\\text{Gamma}(\\alpha_1, \\lambda) + \\text{Gamma}(\\alpha_2, \\lambda) = \\text{Gamma}(\\alpha_1 + \\alpha_2, \\lambda)$$`
          }
        ],
        practiceProblems: [
          {
            id: 'mgf-1',
            problem: `Let $X$ have MGF $M_X(t) = \\frac{1}{(1-2t)^3}$. Find $E[X]$, $\\Var(X)$, and identify the distribution.`,
            solution: `$M_X(t) = (1 - 2t)^{-3}$

$M'_X(t) = 6(1-2t)^{-4}$, so $E[X] = M'_X(0) = \\boxed{6}$

$M''_X(t) = 48(1-2t)^{-5}$, so $E[X^2] = 48$

$\\Var(X) = 48 - 36 = \\boxed{12}$

This is the MGF of $\\boxed{\\text{Gamma}(3, 1/2)}$.`
          }
        ],
        visualizations: ['ConvolutionVisualizer'],
      },
      // Unit 9: Limit Theorems
      {
        id: 'limit-theorems',
        title: 'Limit Theorems',
        description: 'Law of Large Numbers and Central Limit Theorem.',
        sections: [
          {
            title: 'Law of Large Numbers',
            content: `Let $X_1, X_2, \\ldots$ be i.i.d. with $E[X_i] = \\mu$. Define $\\bar{X}_n = \\frac{1}{n}\\sum_{i=1}^n X_i$.

**Weak LLN:** $\\bar{X}_n \\xrightarrow{P} \\mu$

**Strong LLN:** $\\bar{X}_n \\xrightarrow{a.s.} \\mu$

**Chebyshev's Inequality:**
$$P(|X - \\mu| \\geq k\\sigma) \\leq \\frac{1}{k^2}$$`
          },
          {
            title: 'Central Limit Theorem',
            content: `**CLT:** Let $X_1, X_2, \\ldots$ be i.i.d. with $E[X_i] = \\mu$ and $\\Var(X_i) = \\sigma^2 < \\infty$. Then:

$$\\frac{\\bar{X}_n - \\mu}{\\sigma/\\sqrt{n}} \\xrightarrow{d} N(0, 1)$$

**Interpretation:** The sum of many i.i.d. random variables is approximately normal!

**Normal approximation to Binomial:** For $X \\sim \\text{Bin}(n, p)$ with large $n$:
$$X \\approx N(np, np(1-p))$$

**Continuity correction:** $P(X \\leq k) \\approx \\Phi\\left(\\frac{k + 0.5 - np}{\\sqrt{np(1-p)}}\\right)$`
          }
        ],
        practiceProblems: [
          {
            id: 'clt-1',
            problem: `A fair coin is flipped 1000 times. Use CLT to find $P(480 \\leq X \\leq 520)$.`,
            solution: `$X \\sim \\text{Bin}(1000, 0.5)$, $\\mu = 500$, $\\sigma = \\sqrt{250} \\approx 15.81$

With continuity correction:
$$P(480 \\leq X \\leq 520) \\approx \\Phi\\left(\\frac{520.5 - 500}{15.81}\\right) - \\Phi\\left(\\frac{479.5 - 500}{15.81}\\right)$$
$$= \\Phi(1.30) - \\Phi(-1.30) = 2(0.9032) - 1 = \\boxed{0.806}$$`
          }
        ],
        visualizations: ['CLTDemo'],
      },
      // Unit 10: Markov Chains
      {
        id: 'markov-chains',
        title: 'Markov Chains',
        description: 'Discrete-time Markov chains, transition matrices, and stationary distributions.',
        sections: [
          {
            title: 'Markov Property and Transition Matrices',
            content: `A **Markov chain** $\\{X_n\\}$ satisfies:
$$P(X_{n+1} = j | X_n = i, X_{n-1}, \\ldots, X_0) = P(X_{n+1} = j | X_n = i) = p_{ij}$$

**Transition Matrix:** $\\mathbf{P}$ where $p_{ij} = P(X_{n+1} = j | X_n = i)$
- Rows sum to 1
- $n$-step transitions: $(\\mathbf{P}^n)_{ij}$`
          },
          {
            title: 'Classification and Stationary Distributions',
            content: `**Irreducible:** All states communicate
**Aperiodic:** $\\gcd\\{n : p_{ii}^{(n)} > 0\\} = 1$
**Recurrent:** Probability 1 of returning to state

**Stationary distribution** $\\boldsymbol{\\pi}$ satisfies:
$$\\boldsymbol{\\pi} \\mathbf{P} = \\boldsymbol{\\pi}, \\quad \\sum_i \\pi_i = 1$$

For irreducible, aperiodic chains:
$$\\lim_{n \\to \\infty} p_{ij}^{(n)} = \\pi_j$$`
          }
        ],
        practiceProblems: [
          {
            id: 'mc-1',
            problem: `Find the stationary distribution for $\\mathbf{P} = \\begin{pmatrix} 0.7 & 0.3 \\\\ 0.4 & 0.6 \\end{pmatrix}$.`,
            solution: `Solve $\\boldsymbol{\\pi} \\mathbf{P} = \\boldsymbol{\\pi}$:
$$\\pi_1 = 0.7\\pi_1 + 0.4\\pi_2 \\implies 0.3\\pi_1 = 0.4\\pi_2$$
$$\\pi_1 = \\frac{4}{3}\\pi_2$$

With $\\pi_1 + \\pi_2 = 1$:
$$\\frac{7}{3}\\pi_2 = 1 \\implies \\pi_2 = \\frac{3}{7}, \\quad \\pi_1 = \\frac{4}{7}$$

$$\\boxed{\\boldsymbol{\\pi} = \\left(\\frac{4}{7}, \\frac{3}{7}\\right)}$$`
          }
        ],
        visualizations: ['MarkovChain'],
      },
      // Unit 11: Entropy and Information Theory
      {
        id: 'entropy',
        title: 'Entropy and Information Theory',
        description: 'Shannon entropy, information theory fundamentals, and applications to probability.',
        sections: [
          {
            title: 'Shannon Entropy',
            content: `The **Shannon entropy** of a discrete random variable $X$ with PMF $p(x)$ measures uncertainty or information content:

$$H(X) = -\\sum_{x} p(x) \\log_2 p(x) = E[-\\log_2 p(X)]$$

**Convention:** $0 \\log 0 = 0$ (by continuity).

**Units:** When using $\\log_2$, entropy is measured in **bits**. With natural log, it's in **nats**.

**Properties of Entropy:**
1. **Non-negativity:** $H(X) \\geq 0$, with $H(X) = 0$ iff $X$ is deterministic
2. **Maximum entropy:** For $X$ taking $n$ values, $H(X) \\leq \\log_2 n$, with equality iff $X$ is uniform
3. **Additivity for independent RVs:** $H(X, Y) = H(X) + H(Y)$ if $X \\perp Y$

**Example:** For a fair coin ($p = 1/2$):
$$H(X) = -\\frac{1}{2}\\log_2\\frac{1}{2} - \\frac{1}{2}\\log_2\\frac{1}{2} = 1 \\text{ bit}$$

For a biased coin ($p = 0.9$):
$$H(X) = -0.9\\log_2(0.9) - 0.1\\log_2(0.1) \\approx 0.469 \\text{ bits}$$`
          },
          {
            title: 'Joint and Conditional Entropy',
            content: `**Joint Entropy** for $(X, Y)$:
$$H(X, Y) = -\\sum_{x,y} p(x, y) \\log_2 p(x, y)$$

**Conditional Entropy** of $X$ given $Y$:
$$H(X|Y) = \\sum_y p(y) H(X|Y=y) = -\\sum_{x,y} p(x,y) \\log_2 p(x|y)$$

**Chain Rule for Entropy:**
$$H(X, Y) = H(X) + H(Y|X) = H(Y) + H(X|Y)$$

This extends to multiple variables:
$$H(X_1, X_2, \\ldots, X_n) = \\sum_{i=1}^n H(X_i | X_1, \\ldots, X_{i-1})$$

**Key inequality:** $H(X|Y) \\leq H(X)$

"Conditioning reduces entropy" — knowing $Y$ can only decrease uncertainty about $X$, with equality iff $X \\perp Y$.`
          },
          {
            title: 'Mutual Information',
            content: `**Mutual Information** measures the information shared between $X$ and $Y$:

$$I(X; Y) = H(X) - H(X|Y) = H(Y) - H(Y|X) = H(X) + H(Y) - H(X,Y)$$

**Properties:**
- $I(X; Y) \\geq 0$, with equality iff $X \\perp Y$
- $I(X; Y) = I(Y; X)$ (symmetric)
- $I(X; X) = H(X)$ (self-information)

**Relation to KL Divergence:**
$$I(X; Y) = D_{KL}(p(x,y) \\| p(x)p(y))$$

where the **Kullback-Leibler divergence** is:
$$D_{KL}(p \\| q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)}$$

**Venn Diagram Interpretation:**
- $H(X)$ and $H(Y)$ are the individual "circles"
- $I(X;Y)$ is the overlap
- $H(X,Y)$ is the union
- $H(X|Y)$ is $H(X)$ minus the overlap`
          },
          {
            title: 'Data Processing Inequality',
            content: `If $X \\to Y \\to Z$ forms a **Markov chain** (i.e., $X$ and $Z$ are conditionally independent given $Y$), then:

$$I(X; Z) \\leq I(X; Y)$$

**Interpretation:** Processing data can only destroy information, never create it.

**Consequences:**
- No clever processing of $Y$ can extract more information about $X$ than $Y$ already contains
- If $Z = f(Y)$ for any function $f$: $I(X; Z) \\leq I(X; Y)$

**Fano's Inequality:** If $\\hat{X}$ is an estimate of $X$ based on $Y$, and $P_e = P(\\hat{X} \\neq X)$:
$$H(X|Y) \\leq H(P_e) + P_e \\log(|\\mathcal{X}| - 1)$$

where $H(P_e) = -P_e \\log P_e - (1-P_e)\\log(1-P_e)$ is the binary entropy.

This bounds the probability of error in terms of conditional entropy.`
          },
          {
            title: 'Entropy Rate and Source Coding',
            content: `For a stochastic process $\\{X_n\\}$, the **entropy rate** is:
$$H(\\mathcal{X}) = \\lim_{n \\to \\infty} \\frac{1}{n} H(X_1, X_2, \\ldots, X_n)$$

For a stationary Markov chain with transition matrix $P$ and stationary distribution $\\pi$:
$$H(\\mathcal{X}) = -\\sum_i \\pi_i \\sum_j p_{ij} \\log p_{ij}$$

**Shannon's Source Coding Theorem:**
A source with entropy rate $H$ cannot be compressed to fewer than $H$ bits per symbol on average. Moreover, it can be compressed to arbitrarily close to $H$ bits per symbol.

**Typical Set:** For i.i.d. $X_1, \\ldots, X_n$ with entropy $H$, with high probability:
$$2^{-n(H+\\epsilon)} \\leq p(x_1, \\ldots, x_n) \\leq 2^{-n(H-\\epsilon)}$$

There are approximately $2^{nH}$ such "typical" sequences.`
          }
        ],
        practiceProblems: [
          {
            id: 'entropy-1',
            problem: `Let $X$ be a random variable with $P(X = 1) = 1/2$, $P(X = 2) = 1/4$, $P(X = 3) = 1/8$, $P(X = 4) = 1/8$.

**(a)** Compute $H(X)$ in bits.

**(b)** Design an optimal binary code for $X$ and verify it achieves the entropy bound.`,
            solution: `**(a)** Computing entropy:
$$H(X) = -\\sum_i p_i \\log_2 p_i$$
$$= -\\frac{1}{2}\\log_2\\frac{1}{2} - \\frac{1}{4}\\log_2\\frac{1}{4} - \\frac{1}{8}\\log_2\\frac{1}{8} - \\frac{1}{8}\\log_2\\frac{1}{8}$$
$$= \\frac{1}{2}(1) + \\frac{1}{4}(2) + \\frac{1}{8}(3) + \\frac{1}{8}(3)$$
$$= 0.5 + 0.5 + 0.375 + 0.375 = \\boxed{1.75 \\text{ bits}}$$

**(b)** Optimal code (Huffman):
- $X = 1$: code "0" (1 bit)
- $X = 2$: code "10" (2 bits)
- $X = 3$: code "110" (3 bits)
- $X = 4$: code "111" (3 bits)

Expected code length:
$$L = \\frac{1}{2}(1) + \\frac{1}{4}(2) + \\frac{1}{8}(3) + \\frac{1}{8}(3) = 1.75 \\text{ bits}$$

This equals $H(X)$, achieving the optimal bound! This happens when all probabilities are powers of 2.`
          },
          {
            id: 'entropy-2',
            problem: `Let $(X, Y)$ be jointly distributed with:
- $P(X=0, Y=0) = 1/4$
- $P(X=0, Y=1) = 1/4$
- $P(X=1, Y=0) = 1/4$
- $P(X=1, Y=1) = 1/4$

**(a)** Find $H(X)$, $H(Y)$, and $H(X,Y)$.

**(b)** Find $H(X|Y)$ and $I(X;Y)$.

**(c)** Are $X$ and $Y$ independent?`,
            solution: `**(a)** Marginals: $P(X=0) = P(X=1) = 1/2$ and $P(Y=0) = P(Y=1) = 1/2$.

$$H(X) = H(Y) = -2 \\cdot \\frac{1}{2}\\log_2\\frac{1}{2} = \\boxed{1 \\text{ bit}}$$

$$H(X,Y) = -4 \\cdot \\frac{1}{4}\\log_2\\frac{1}{4} = 4 \\cdot \\frac{1}{4} \\cdot 2 = \\boxed{2 \\text{ bits}}$$

**(b)** Using the chain rule:
$$H(X|Y) = H(X,Y) - H(Y) = 2 - 1 = \\boxed{1 \\text{ bit}}$$

$$I(X;Y) = H(X) - H(X|Y) = 1 - 1 = \\boxed{0 \\text{ bits}}$$

**(c)** Since $I(X;Y) = 0$, **yes, $X$ and $Y$ are independent**.

Verification: $p(x,y) = p(x)p(y) = \\frac{1}{2} \\cdot \\frac{1}{2} = \\frac{1}{4}$ for all $(x,y)$. ✓

Note: $H(X,Y) = H(X) + H(Y)$ confirms independence.`
          },
          {
            id: 'entropy-3',
            problem: `A binary symmetric channel has input $X \\in \\{0, 1\\}$ and output $Y$, where each bit is flipped with probability $\\epsilon$.

**(a)** Find $H(Y|X)$.

**(b)** If $X$ is uniform, find the channel capacity $C = \\max_{p(x)} I(X;Y)$.`,
            solution: `**(a)** Given $X$, the output $Y$ is $X$ with probability $1-\\epsilon$ and $1-X$ with probability $\\epsilon$.

So $Y|X$ is Bernoulli($\\epsilon$) regardless of $X$.

$$H(Y|X) = H(\\epsilon) = -\\epsilon\\log_2\\epsilon - (1-\\epsilon)\\log_2(1-\\epsilon) = \\boxed{H_2(\\epsilon)}$$

where $H_2(\\epsilon)$ is the binary entropy function.

**(b)** If $X$ is uniform, then by symmetry $Y$ is also uniform, so $H(Y) = 1$.

$$I(X;Y) = H(Y) - H(Y|X) = 1 - H_2(\\epsilon)$$

The capacity is maximized when $X$ is uniform:
$$\\boxed{C = 1 - H_2(\\epsilon)}$$

**Interpretation:**
- If $\\epsilon = 0$ (no noise): $C = 1$ bit per channel use
- If $\\epsilon = 1/2$ (pure noise): $C = 0$ (no information transmitted)
- If $\\epsilon = 1$ (deterministic flip): $C = 1$ (still usable!)`
          }
        ],
        visualizations: ['EntropyVisualizer'],
      },
      // Unit 12: Martingales
      {
        id: 'martingales',
        title: 'Martingales',
        description: 'Martingale theory, stopping times, and the Optional Stopping Theorem.',
        sections: [
          {
            title: 'Definition of Martingales',
            content: `A sequence of random variables $\\{X_n\\}$ is a **martingale** with respect to a filtration $\\{\\mathcal{F}_n\\}$ if:

1. $X_n$ is $\\mathcal{F}_n$-measurable (adapted)
2. $E[|X_n|] < \\infty$ for all $n$
3. $E[X_{n+1} | \\mathcal{F}_n] = X_n$ (martingale property)

**Interpretation:** A martingale is a "fair game" — the expected future value, given all current information, equals the current value.

**Variants:**
- **Submartingale:** $E[X_{n+1} | \\mathcal{F}_n] \\geq X_n$ (favorable game)
- **Supermartingale:** $E[X_{n+1} | \\mathcal{F}_n] \\leq X_n$ (unfavorable game)

**Key property:** Taking iterated expectations:
$$E[X_m | \\mathcal{F}_n] = X_n \\quad \\text{for all } m > n$$

And unconditionally: $E[X_n] = E[X_0]$ for all $n$.`
          },
          {
            title: 'Examples of Martingales',
            content: `**1. Simple Random Walk:**
Let $S_n = \\sum_{i=1}^n Y_i$ where $Y_i = \\pm 1$ with probability $1/2$ each.
$$E[S_{n+1} | S_1, \\ldots, S_n] = S_n + E[Y_{n+1}] = S_n$$

$\\{S_n\\}$ is a martingale.

**2. Partial Sums of Mean-Zero RVs:**
If $Y_1, Y_2, \\ldots$ are independent with $E[Y_i] = 0$, then $S_n = \\sum_{i=1}^n Y_i$ is a martingale.

**3. Product Martingale:**
If $Z_i > 0$ are independent with $E[Z_i] = 1$, then $M_n = \\prod_{i=1}^n Z_i$ is a martingale.

**4. Conditional Expectation Martingale:**
For any integrable $X$ and filtration $\\{\\mathcal{F}_n\\}$:
$$M_n = E[X | \\mathcal{F}_n]$$
is a martingale (the "Doob martingale").

**5. Likelihood Ratio Martingale:**
If $X_1, X_2, \\ldots$ have density $f$ under $P$ and $g$ under $Q$:
$$L_n = \\prod_{i=1}^n \\frac{g(X_i)}{f(X_i)}$$
is a martingale under $P$.`
          },
          {
            title: 'Stopping Times',
            content: `A random variable $T: \\Omega \\to \\{0, 1, 2, \\ldots\\} \\cup \\{\\infty\\}$ is a **stopping time** if the event $\\{T = n\\}$ depends only on $X_0, X_1, \\ldots, X_n$.

**Intuition:** At time $n$, you can decide whether to stop based only on information available at time $n$.

**Examples:**
- $T = \\min\\{n : S_n = 0\\}$ (first return to 0) ✓
- $T = \\min\\{n : S_n = \\max_{k \\leq N} S_k\\}$ (when max is achieved) ✗

**Non-examples:** Times that require knowledge of the future are NOT stopping times.

**The Stopped Process:**
For a martingale $\\{X_n\\}$ and stopping time $T$:
$$X_{n \\wedge T} = X_{\\min(n, T)}$$
is also a martingale ("stopped martingale").

**Why this matters:** We can analyze the martingale at the (random) stopping time $T$ using properties of the stopped martingale.`
          },
          {
            title: 'Optional Stopping Theorem',
            content: `**Optional Stopping Theorem (OST):** Let $\\{X_n\\}$ be a martingale and $T$ a stopping time. Then $E[X_T] = E[X_0]$ provided ANY of:

1. $T$ is bounded: $T \\leq N$ for some constant $N$
2. $T$ has finite expectation AND $|X_{n+1} - X_n| \\leq c$ (bounded increments)
3. $E[T] < \\infty$ and $E[|X_T|] < \\infty$

**Counterexample when conditions fail:**
Doubling strategy in gambling: Bet $2^n$ dollars on round $n$ until you win.
- $T$ = first win has $E[T] = 2 < \\infty$
- But $X_T = 1$ always (guaranteed profit!)
- Yet $E[X_0] = 0$ (martingale starts at 0)

This violates OST because $X_T$ is not integrable (infinite expected loss).

**Key insight:** The OST says you can't beat a fair game by using a stopping rule — as long as the stopping rule is "reasonable."`
          },
          {
            title: 'Applications of OST',
            content: `**Application 1: Gambler's Ruin**
Start with $\\$a$, win/lose $\\$1$ with prob $1/2$. Stop when fortune is $0$ or $b$.

Since $S_n$ is a martingale: $E[S_T] = E[S_0] = a$

Let $p$ = prob of reaching $b$. Then:
$$E[S_T] = p \\cdot b + (1-p) \\cdot 0 = pb = a$$
$$\\boxed{p = a/b}$$

**Application 2: Expected Hitting Time**
For $S_n$ = simple random walk, let $T = \\min\\{n : |S_n| = a\\}$.

$S_n^2 - n$ is a martingale (verify: $E[S_{n+1}^2 | S_n] = S_n^2 + 1$).

By OST: $E[S_T^2 - T] = E[S_0^2 - 0] = 0$

Since $S_T = \\pm a$: $E[S_T^2] = a^2$

Therefore: $\\boxed{E[T] = a^2}$

**Application 3: Wald's Equation**
If $Y_i$ are i.i.d. with $E[Y_i] = \\mu$ and $T$ is a stopping time with $E[T] < \\infty$:
$$E\\left[\\sum_{i=1}^T Y_i\\right] = \\mu \\cdot E[T]$$`
          },
          {
            title: 'Martingale Convergence',
            content: `**Doob's Martingale Convergence Theorem:**
If $\\{X_n\\}$ is a martingale (or submartingale) with $\\sup_n E[X_n^+] < \\infty$, then:
$$X_n \\to X_\\infty \\quad \\text{a.s.}$$
for some random variable $X_\\infty$ with $E[|X_\\infty|] < \\infty$.

**Bounded Martingale Convergence:**
If $|X_n| \\leq M$ for all $n$, then $X_n \\to X_\\infty$ a.s. and in $L^1$.

**$L^2$ Martingale Convergence:**
If $\\sup_n E[X_n^2] < \\infty$, then $X_n \\to X_\\infty$ in $L^2$ as well.

**Application: Branching Processes**
Let $Z_n$ = population size in generation $n$ with mean offspring $\\mu$.

$W_n = Z_n / \\mu^n$ is a martingale.

If $\\mu \\leq 1$: $W_n \\to 0$ a.s. (extinction)
If $\\mu > 1$: $W_n \\to W_\\infty$ with $P(W_\\infty > 0) = $ survival probability`
          }
        ],
        practiceProblems: [
          {
            id: 'martingale-1',
            problem: `Let $Y_1, Y_2, \\ldots$ be independent with $P(Y_i = 1) = p$ and $P(Y_i = -1) = 1-p$.

**(a)** For what value of $p$ is $S_n = \\sum_{i=1}^n Y_i$ a martingale?

**(b)** For general $p$, find a constant $c$ such that $M_n = S_n - cn$ is a martingale.

**(c)** Show that $\\left(\\frac{1-p}{p}\\right)^{S_n}$ is always a martingale.`,
            solution: `**(a)** $E[Y_i] = p - (1-p) = 2p - 1$

For $S_n$ to be a martingale, we need $E[Y_i] = 0$:
$$2p - 1 = 0 \\implies \\boxed{p = \\frac{1}{2}}$$

**(b)** $E[S_{n+1} - c(n+1) | \\mathcal{F}_n] = S_n + E[Y_{n+1}] - c(n+1)$
$= S_n + (2p-1) - cn - c$

For martingale property: $(2p-1) = c$
$$\\boxed{c = 2p - 1}$$

**(c)** Let $r = \\frac{1-p}{p}$ and $M_n = r^{S_n}$.

$$E[M_{n+1} | \\mathcal{F}_n] = E[r^{S_n + Y_{n+1}} | S_n] = r^{S_n} \\cdot E[r^{Y_{n+1}}]$$

$$E[r^{Y_{n+1}}] = p \\cdot r^1 + (1-p) \\cdot r^{-1}$$
$$= p \\cdot \\frac{1-p}{p} + (1-p) \\cdot \\frac{p}{1-p} = (1-p) + p = 1$$

Therefore:
$$E[M_{n+1} | \\mathcal{F}_n] = r^{S_n} = M_n \\quad \\checkmark$$

This is the **exponential martingale** for random walks.`
          },
          {
            id: 'martingale-2',
            problem: `A gambler starts with $\\$50$ and bets $\\$1$ on each round of a fair game. Let $T$ = first time the gambler's fortune reaches $\\$0$ or $\\$100$.

**(a)** What is the probability of reaching $\\$100$?

**(b)** What is the expected number of rounds until the game ends?`,
            solution: `Let $S_n$ = fortune after $n$ rounds. $S_0 = 50$.

**(a)** $S_n$ is a martingale (fair game).

By OST: $E[S_T] = S_0 = 50$

Let $p$ = probability of reaching 100.
$$E[S_T] = p \\cdot 100 + (1-p) \\cdot 0 = 100p = 50$$
$$\\boxed{p = 0.5}$$

**(b)** Consider $M_n = S_n^2 - n$.

Check: $E[S_{n+1}^2 | S_n] = E[(S_n + Y_{n+1})^2 | S_n] = S_n^2 + 2S_n E[Y_{n+1}] + E[Y_{n+1}^2]$
$= S_n^2 + 0 + 1 = S_n^2 + 1$

So $E[M_{n+1} | \\mathcal{F}_n] = S_n^2 + 1 - (n+1) = M_n$ ✓

By OST: $E[S_T^2 - T] = E[S_0^2] = 2500$

$E[S_T^2] = (0.5)(100)^2 + (0.5)(0)^2 = 5000$

Therefore:
$$E[T] = E[S_T^2] - 2500 = 5000 - 2500 = \\boxed{2500 \\text{ rounds}}$$`
          },
          {
            id: 'martingale-3',
            problem: `A monkey types randomly on a 26-letter keyboard. Let $T$ be the first time the word "ABRACADABRA" appears.

**(a)** Set up a martingale betting scheme to analyze this problem.

**(b)** Use the Optional Stopping Theorem to find $E[T]$.`,
            solution: `**(a)** **Martingale Betting Scheme:**

At each time $n$, new gamblers arrive and bet that the pattern starts at position $n$.

- Gambler $n$ bets $\\$1$ that position $n$ is 'A' (wins $\\$26$ if correct, pays $\\$1$ if wrong)
- If correct, bets $\\$26$ that position $n+1$ is 'B' (wins $\\$26^2$ if correct)
- Continue until pattern completes or fails

The total fortune of all gamblers forms a martingale.

**(b)** At stopping time $T$, compute the total winnings.

The key insight is which gamblers can still be winning when "ABRACADABRA" appears:
- The gambler who started at position $T-10$ wins $26^{11}$
- But also: "ABRACADABRA" has the prefix "A" appearing again at positions 1, 4, 8 (the A's in the pattern)
- When pattern completes, gamblers at $T-7$ (starting at second A: "ABRA") and $T-3$ (starting at third A: "A") could also be winning

Overlaps that match:
- Full pattern: wins $26^{11}$
- "ABRA" suffix = "ABRA" prefix: wins $26^4$
- "A" suffix = "A" prefix: wins $26^1$

By OST with martingale starting at 0:
$$E[\\text{winnings at } T] = 0$$
$$26^{11} + 26^4 + 26^1 - E[T] = 0$$

$$\\boxed{E[T] = 26^{11} + 26^4 + 26 \\approx 3.67 \\times 10^{15}}$$

Note: This is much larger than $26^{11}$ alone due to the self-overlapping structure of "ABRACADABRA"!`
          }
        ],
        visualizations: ['MartingaleVisualizer'],
      },
      // Unit 13: Financial Applications
      {
        id: 'financial-applications',
        title: 'Financial Applications',
        description: 'Black-Scholes option pricing, risk-neutral probability, and financial mathematics.',
        sections: [
          {
            title: 'Introduction to Options',
            content: `An **option** is a financial derivative that gives the holder the right (but not obligation) to buy or sell an asset.

**European Call Option:**
- Right to buy an asset at **strike price** $K$ at **expiration time** $T$
- Payoff at time $T$: $(S_T - K)^+ = \\max(S_T - K, 0)$

**European Put Option:**
- Right to sell an asset at strike price $K$ at time $T$
- Payoff at time $T$: $(K - S_T)^+ = \\max(K - S_T, 0)$

**Put-Call Parity:** For European options on a non-dividend-paying stock:
$$C - P = S_0 - Ke^{-rT}$$

where $C$ = call price, $P$ = put price, $S_0$ = current stock price, $r$ = risk-free rate.

**The Pricing Problem:** What is the fair price of an option today?`
          },
          {
            title: 'Binomial Model',
            content: `The **binomial model** provides a discrete-time framework for option pricing.

**One-Period Model:**
- Stock price $S_0$ can go to $S_u = uS_0$ (up) or $S_d = dS_0$ (down)
- Risk-free rate $r$ per period
- Option pays $C_u$ if up, $C_d$ if down

**Replicating Portfolio:** Hold $\\Delta$ shares and $B$ dollars in bonds:
$$\\Delta \\cdot uS_0 + B(1+r) = C_u$$
$$\\Delta \\cdot dS_0 + B(1+r) = C_d$$

Solving:
$$\\Delta = \\frac{C_u - C_d}{(u-d)S_0}$$

**Risk-Neutral Pricing:** Define the **risk-neutral probability**:
$$q = \\frac{(1+r) - d}{u - d}$$

Then the option price is:
$$C_0 = \\frac{1}{1+r}[q C_u + (1-q) C_d] = \\frac{1}{1+r} E^Q[C_1]$$

**No-Arbitrage Condition:** $d < 1+r < u$`
          },
          {
            title: 'Risk-Neutral Valuation',
            content: `**Risk-neutral measure** $Q$ is a probability measure under which:

1. All traded assets, when discounted by the risk-free rate, are martingales
2. $E^Q[e^{-rT} S_T] = S_0$

**Fundamental Theorem of Asset Pricing:**
A market is arbitrage-free if and only if there exists a risk-neutral measure.

**Risk-Neutral Pricing Formula:**
$$V_0 = e^{-rT} E^Q[V_T]$$

The price of any derivative equals the discounted expected payoff under $Q$.

**Key Insight:** Under $Q$, we don't need to know investors' risk preferences or the true probability of stock movements. We only need:
- The risk-free rate $r$
- The volatility $\\sigma$

**Girsanov's Theorem** (informal): We can change from the real-world measure $P$ to the risk-neutral measure $Q$ by adjusting the drift of the stock price process.`
          },
          {
            title: 'Geometric Brownian Motion',
            content: `In continuous time, stock prices are modeled by **Geometric Brownian Motion (GBM)**:

$$dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t$$

where:
- $\\mu$ = drift (expected return)
- $\\sigma$ = volatility
- $W_t$ = standard Brownian motion (Wiener process)

**Solution:**
$$S_T = S_0 \\exp\\left[(\\mu - \\frac{\\sigma^2}{2})T + \\sigma W_T\\right]$$

**Properties:**
- $\\log(S_T/S_0) \\sim N((\\mu - \\sigma^2/2)T, \\sigma^2 T)$
- $S_T$ is **log-normally** distributed
- $E[S_T] = S_0 e^{\\mu T}$

**Under risk-neutral measure $Q$:**
$$dS_t = r S_t \\, dt + \\sigma S_t \\, dW_t^Q$$

The drift changes from $\\mu$ to $r$, but volatility $\\sigma$ remains the same.`
          },
          {
            title: 'Black-Scholes Formula',
            content: `The **Black-Scholes formula** gives the price of a European call option:

$$C = S_0 N(d_1) - Ke^{-rT} N(d_2)$$

where:
$$d_1 = \\frac{\\ln(S_0/K) + (r + \\sigma^2/2)T}{\\sigma\\sqrt{T}}$$
$$d_2 = d_1 - \\sigma\\sqrt{T}$$

and $N(\\cdot)$ is the standard normal CDF.

**For a European put:**
$$P = Ke^{-rT} N(-d_2) - S_0 N(-d_1)$$

**Derivation via Risk-Neutral Pricing:**
$$C = e^{-rT} E^Q[(S_T - K)^+]$$

Since $\\log S_T \\sim N(\\log S_0 + (r - \\sigma^2/2)T, \\sigma^2 T)$ under $Q$, we compute:
$$E^Q[(S_T - K)^+] = E^Q[S_T \\mathbf{1}_{S_T > K}] - K \\cdot P^Q(S_T > K)$$

After calculation, this yields the Black-Scholes formula.`
          },
          {
            title: 'The Greeks',
            content: `**The Greeks** measure sensitivity of option prices to various parameters:

**Delta ($\\Delta$):** Sensitivity to stock price
$$\\Delta = \\frac{\\partial C}{\\partial S} = N(d_1) \\quad \\text{(for calls)}$$

**Gamma ($\\Gamma$):** Sensitivity of delta to stock price
$$\\Gamma = \\frac{\\partial^2 C}{\\partial S^2} = \\frac{N'(d_1)}{S\\sigma\\sqrt{T}}$$

**Theta ($\\Theta$):** Time decay
$$\\Theta = \\frac{\\partial C}{\\partial t} = -\\frac{S N'(d_1) \\sigma}{2\\sqrt{T}} - rKe^{-rT}N(d_2)$$

**Vega ($\\mathcal{V}$):** Sensitivity to volatility
$$\\mathcal{V} = \\frac{\\partial C}{\\partial \\sigma} = S\\sqrt{T} N'(d_1)$$

**Rho ($\\rho$):** Sensitivity to interest rate
$$\\rho = \\frac{\\partial C}{\\partial r} = KTe^{-rT}N(d_2)$$

**Delta Hedging:** To create a risk-free portfolio, hold $-\\Delta$ shares for each call option sold. This must be continuously rebalanced.`
          },
          {
            title: 'Black-Scholes PDE',
            content: `The **Black-Scholes PDE** governs the price $V(S, t)$ of any derivative:

$$\\frac{\\partial V}{\\partial t} + rS\\frac{\\partial V}{\\partial S} + \\frac{1}{2}\\sigma^2 S^2 \\frac{\\partial^2 V}{\\partial S^2} = rV$$

**Boundary/Terminal Conditions:**
- Call: $V(S, T) = (S - K)^+$
- Put: $V(S, T) = (K - S)^+$

**Derivation via Hedging:**
1. Form portfolio: one option + $-\\Delta$ shares
2. Apply Itô's lemma to get $dV$
3. Choose $\\Delta = \\partial V/\\partial S$ to eliminate randomness
4. Set return equal to risk-free rate (no arbitrage)

**Feynman-Kac Formula:** The solution to the BS PDE can be written as:
$$V(S, t) = e^{-r(T-t)} E^Q[V(S_T, T) | S_t = S]$$

This connects PDEs to risk-neutral expectations.

**Implied Volatility:** The volatility $\\sigma$ that, when input to Black-Scholes, gives the market price. Often varies with strike and maturity ("volatility smile/skew").`
          }
        ],
        practiceProblems: [
          {
            id: 'finance-1',
            problem: `A stock currently priced at $\\$100$ can either go up to $\\$120$ or down to $\\$90$ in one period. The risk-free rate is 5% per period.

**(a)** Find the risk-neutral probability $q$.

**(b)** Price a call option with strike $K = \\$105$.

**(c)** Find the replicating portfolio.`,
            solution: `Given: $S_0 = 100$, $u = 1.2$, $d = 0.9$, $r = 0.05$, $K = 105$.

**(a)** Risk-neutral probability:
$$q = \\frac{(1+r) - d}{u - d} = \\frac{1.05 - 0.9}{1.2 - 0.9} = \\frac{0.15}{0.30} = \\boxed{0.5}$$

**(b)** Option payoffs:
- Up state: $C_u = (120 - 105)^+ = 15$
- Down state: $C_d = (90 - 105)^+ = 0$

Call price:
$$C_0 = \\frac{1}{1.05}[0.5 \\times 15 + 0.5 \\times 0] = \\frac{7.5}{1.05} = \\boxed{\\$7.14}$$

**(c)** Replicating portfolio:
$$\\Delta = \\frac{C_u - C_d}{S_0(u - d)} = \\frac{15 - 0}{100(0.3)} = \\frac{15}{30} = \\boxed{0.5 \\text{ shares}}$$

Bond position:
$$B = \\frac{uC_d - dC_u}{(u-d)(1+r)} = \\frac{1.2(0) - 0.9(15)}{0.3(1.05)} = \\frac{-13.5}{0.315} = \\boxed{-\\$42.86}$$

Verification: $0.5(100) + (-42.86) = 50 - 42.86 = 7.14$ ✓`
          },
          {
            id: 'finance-2',
            problem: `Use the Black-Scholes formula to price a European call option with:
- Current stock price $S_0 = \\$50$
- Strike price $K = \\$52$
- Time to expiration $T = 0.5$ years
- Risk-free rate $r = 4\\%$
- Volatility $\\sigma = 30\\%$`,
            solution: `**Step 1:** Compute $d_1$ and $d_2$:

$$d_1 = \\frac{\\ln(50/52) + (0.04 + 0.09/2)(0.5)}{0.30\\sqrt{0.5}}$$
$$= \\frac{\\ln(0.9615) + (0.085)(0.5)}{0.2121}$$
$$= \\frac{-0.0392 + 0.0425}{0.2121} = \\frac{0.0033}{0.2121} = 0.0156$$

$$d_2 = d_1 - \\sigma\\sqrt{T} = 0.0156 - 0.2121 = -0.1965$$

**Step 2:** Look up standard normal CDF values:
$$N(d_1) = N(0.0156) \\approx 0.5062$$
$$N(d_2) = N(-0.1965) \\approx 0.4221$$

**Step 3:** Apply Black-Scholes formula:
$$C = S_0 N(d_1) - Ke^{-rT} N(d_2)$$
$$= 50(0.5062) - 52 e^{-0.04(0.5)}(0.4221)$$
$$= 25.31 - 52(0.9802)(0.4221)$$
$$= 25.31 - 21.51 = \\boxed{\\$3.80}$$`
          },
          {
            id: 'finance-3',
            problem: `A stock follows geometric Brownian motion with $\\mu = 0.12$, $\\sigma = 0.25$, and current price $S_0 = \\$80$.

**(a)** What is the probability that $S_1 > 100$ (in one year)?

**(b)** What is $E[S_1]$?

**(c)** Under the risk-neutral measure with $r = 0.05$, what is $P^Q(S_1 > 100)$?`,
            solution: `**(a)** Under the real-world measure $P$:
$$\\log(S_1/S_0) \\sim N((\\mu - \\sigma^2/2)T, \\sigma^2 T)$$
$$\\log(S_1/80) \\sim N((0.12 - 0.03125)(1), 0.0625)$$
$$\\log(S_1/80) \\sim N(0.08875, 0.0625)$$

$P(S_1 > 100) = P(\\log(S_1) > \\log(100)) = P(\\log(S_1/80) > \\log(1.25))$
$$= P\\left(Z > \\frac{\\log(1.25) - 0.08875}{0.25}\\right) = P\\left(Z > \\frac{0.2231 - 0.08875}{0.25}\\right)$$
$$= P(Z > 0.537) = 1 - \\Phi(0.537) \\approx \\boxed{0.296}$$

**(b)** $E[S_1] = S_0 e^{\\mu T} = 80 e^{0.12} = 80(1.127) = \\boxed{\\$90.19}$

**(c)** Under $Q$, replace $\\mu$ with $r = 0.05$:
$$\\log(S_1/80) \\sim N((0.05 - 0.03125), 0.0625) = N(0.01875, 0.0625)$$

$$P^Q(S_1 > 100) = P\\left(Z > \\frac{0.2231 - 0.01875}{0.25}\\right) = P(Z > 0.817)$$
$$= 1 - \\Phi(0.817) \\approx \\boxed{0.207}$$

Note: The risk-neutral probability is lower because the drift under $Q$ ($r = 5\\%$) is less than under $P$ ($\\mu = 12\\%$).`
          }
        ],
        visualizations: ['BlackScholesVisualizer'],
      },
    ],
  },
  {
    id: '6-1210',
    number: '6.1210',
    title: 'Introduction to Algorithms',
    description: 'Design and analysis of efficient algorithms for computational problems. Covers data structures, sorting, hashing, graph algorithms, and dynamic programming.',
    color: 'bg-green-600',
    units: [
      // Unit 1: Introduction
      {
        id: 'introduction',
        title: 'Algorithms and Computational Tractability',
        description: 'Introduction to algorithmic problem-solving, models of computation, and asymptotic analysis of running time.',
        sections: [
          {
            title: 'What is an Algorithm?',
            content: `An **algorithm** is a finite sequence of well-defined instructions for solving a computational problem. More formally, an algorithm is a procedure that:

1. Takes an **input** from a specified set of valid inputs
2. Produces an **output** satisfying a given input-output relation
3. Terminates after a **finite** number of steps

**Computational Problem:** A specification of the desired input-output relationship.

**Problem Instance:** A specific input to a computational problem.

**Example - Sorting Problem:**
- **Input:** A sequence of $n$ numbers $\\langle a_1, a_2, \\ldots, a_n \\rangle$
- **Output:** A permutation $\\langle a'_1, a'_2, \\ldots, a'_n \\rangle$ such that $a'_1 \\leq a'_2 \\leq \\cdots \\leq a'_n$

An algorithm is **correct** if for every input instance, it halts with the correct output. We focus on proving correctness using **loop invariants** and **inductive arguments**.`
          },
          {
            title: 'Model of Computation',
            content: `To analyze algorithms rigorously, we need a precise computational model. We use the **Word-RAM (Random Access Machine)** model:

**Word-RAM Model Assumptions:**
- Memory consists of addressable **words** (typically $w = \\Theta(\\log n)$ bits)
- Each word can store an integer in $\\{0, 1, \\ldots, 2^w - 1\\}$
- Basic operations on $O(1)$ words take $O(1)$ time:
  - Arithmetic: $+, -, *, /, \\%$
  - Comparisons: $<, >, \\leq, \\geq, =, \\neq$
  - Bitwise: AND, OR, XOR, NOT, shifts
  - Memory access: read/write at any address

**Why Word-RAM?**
- Reflects modern computer architecture
- Allows pointer manipulation in $O(1)$ time
- Word size $w = \\Theta(\\log n)$ ensures we can address $n$ items

**Running Time:** Count the number of fundamental operations as a function of input size $n$.`
          },
          {
            title: 'Efficiency and Running Time',
            content: `**Running Time** $T(n)$ is the number of primitive operations an algorithm performs on an input of size $n$.

**Worst-Case Analysis:** $T(n) = \\max\\{T(I) : |I| = n\\}$

We focus on worst-case because:
1. It provides a **guarantee** that the algorithm never takes longer
2. Average-case requires assumptions about input distribution
3. Worst-case often equals or approximates average-case

**Example - Linear Search:**

\`\`\`
LinearSearch(A, n, x):
    for i = 1 to n:
        if A[i] == x:
            return i
    return NOT_FOUND
\`\`\`

- **Best case:** $T(n) = O(1)$ (found at first position)
- **Worst case:** $T(n) = O(n)$ (not found or found at last position)
- **Average case:** $T(n) = O(n)$ (on average, scan half the array)

**Why Asymptotic Analysis?**
- Focuses on **scalability** as input grows
- Ignores constant factors (machine-dependent)
- Simplifies comparison between algorithms`
          },
          {
            title: 'Asymptotic Notation',
            content: `**Big-O Notation (Upper Bound):**
$$f(n) = O(g(n)) \\iff \\exists c > 0, n_0 > 0 : \\forall n \\geq n_0, \\; 0 \\leq f(n) \\leq c \\cdot g(n)$$

**Big-Omega Notation (Lower Bound):**
$$f(n) = \\Omega(g(n)) \\iff \\exists c > 0, n_0 > 0 : \\forall n \\geq n_0, \\; 0 \\leq c \\cdot g(n) \\leq f(n)$$

**Big-Theta Notation (Tight Bound):**
$$f(n) = \\Theta(g(n)) \\iff f(n) = O(g(n)) \\text{ and } f(n) = \\Omega(g(n))$$

**Common Growth Rates (in increasing order):**
$$O(1) \\subset O(\\log n) \\subset O(n) \\subset O(n \\log n) \\subset O(n^2) \\subset O(n^3) \\subset O(2^n) \\subset O(n!)$$

**Useful Properties:**
- **Transitivity:** If $f = O(g)$ and $g = O(h)$, then $f = O(h)$
- **Sum Rule:** $O(f) + O(g) = O(\\max(f, g))$
- **Product Rule:** $O(f) \\cdot O(g) = O(f \\cdot g)$
- **Logarithms:** $\\log_a n = \\Theta(\\log_b n)$ for any constants $a, b > 1$

**Example:** $3n^2 + 5n + 2 = \\Theta(n^2)$
- Upper bound: $3n^2 + 5n + 2 \\leq 10n^2$ for $n \\geq 1$, so $O(n^2)$
- Lower bound: $3n^2 + 5n + 2 \\geq 3n^2$ for $n \\geq 1$, so $\\Omega(n^2)$`
          },
          {
            title: 'Analyzing Algorithms',
            content: `**Analyzing Loops:**

For a simple loop:
\`\`\`
for i = 1 to n:
    constant-time operation
\`\`\`
Running time: $T(n) = \\Theta(n)$

For nested loops:
\`\`\`
for i = 1 to n:
    for j = 1 to n:
        constant-time operation
\`\`\`
Running time: $T(n) = \\Theta(n^2)$

**Analyzing Recursion:**

For recursive algorithms, we write a **recurrence relation**:

**Example - Binary Search:**
$$T(n) = T(n/2) + O(1)$$

Solution: $T(n) = O(\\log n)$

**Master Theorem** (for $T(n) = aT(n/b) + f(n)$):

Let $c_{\\text{crit}} = \\log_b a$. Compare $f(n)$ with $n^{c_{\\text{crit}}}$:

1. If $f(n) = O(n^{c_{\\text{crit}} - \\epsilon})$ for some $\\epsilon > 0$: $T(n) = \\Theta(n^{c_{\\text{crit}}})$
2. If $f(n) = \\Theta(n^{c_{\\text{crit}}} \\log^k n)$: $T(n) = \\Theta(n^{c_{\\text{crit}}} \\log^{k+1} n)$
3. If $f(n) = \\Omega(n^{c_{\\text{crit}} + \\epsilon})$ and $af(n/b) \\leq cf(n)$ for some $c < 1$: $T(n) = \\Theta(f(n))$`
          }
        ],
        practiceProblems: [
          {
            id: 'intro-1',
            problem: `Rank the following functions by order of growth from slowest to fastest growing:

$$n^2, \\quad n\\log n, \\quad n^{1.5}, \\quad n\\log^2 n, \\quad n^2\\log n, \\quad 2^{\\sqrt{\\log n}}$$

Justify your ranking.`,
            solution: `To compare growth rates, we analyze each function:

**Step-by-step comparison:**

1. $2^{\\sqrt{\\log n}}$: Let $k = \\sqrt{\\log n}$, so this is $2^k$ where $k$ grows slower than $\\log n$. This grows **slower than any polynomial**.

2. $n \\log n$ vs $n \\log^2 n$: The second has an extra $\\log n$ factor, so $n \\log n = o(n \\log^2 n)$.

3. $n \\log^2 n$ vs $n^{1.5}$: Compare $\\log^2 n$ vs $n^{0.5} = \\sqrt{n}$. Since $\\log^2 n = o(n^\\epsilon)$ for any $\\epsilon > 0$, we have $n \\log^2 n = o(n^{1.5})$.

4. $n^{1.5}$ vs $n^2$: Clearly $n^{1.5} = o(n^2)$.

5. $n^2$ vs $n^2 \\log n$: The second has an extra $\\log n$ factor.

**Final ranking (slowest to fastest):**
$$\\boxed{2^{\\sqrt{\\log n}} \\prec n \\log n \\prec n \\log^2 n \\prec n^{1.5} \\prec n^2 \\prec n^2 \\log n}$$`
          },
          {
            id: 'intro-2',
            problem: `Solve the following recurrence relation using the Master Theorem:

$$T(n) = 4T(n/2) + n^2$$

State which case of the Master Theorem applies and find the tight bound $\\Theta$.`,
            solution: `**Given:** $T(n) = 4T(n/2) + n^2$

**Identify parameters:**
- $a = 4$ (number of subproblems)
- $b = 2$ (factor by which input shrinks)
- $f(n) = n^2$ (cost of divide/combine)

**Compute critical exponent:**
$$c_{\\text{crit}} = \\log_b a = \\log_2 4 = 2$$

**Compare $f(n)$ with $n^{c_{\\text{crit}}} = n^2$:**

$f(n) = n^2 = \\Theta(n^2) = \\Theta(n^{c_{\\text{crit}}})$

This matches **Case 2** of the Master Theorem with $k = 0$ (since $f(n) = \\Theta(n^2 \\log^0 n)$).

**Apply Case 2:**
$$T(n) = \\Theta(n^{c_{\\text{crit}}} \\log^{k+1} n) = \\Theta(n^2 \\log n)$$

**Answer:** $\\boxed{T(n) = \\Theta(n^2 \\log n)}$

**Intuition:** The work at each level is $n^2$, and there are $\\log n$ levels, so total work is $n^2 \\cdot \\log n$.`
          },
          {
            id: 'intro-3',
            problem: `Prove that $\\log(n!) = \\Theta(n \\log n)$.

*Hint: Use Stirling's approximation or bound $n!$ between $(n/2)^{n/2}$ and $n^n$.*`,
            solution: `**Upper Bound ($O(n \\log n)$):**

$$n! = n \\cdot (n-1) \\cdot (n-2) \\cdots 1 \\leq n \\cdot n \\cdot n \\cdots n = n^n$$

Taking logarithms:
$$\\log(n!) \\leq \\log(n^n) = n \\log n$$

So $\\log(n!) = O(n \\log n)$.

**Lower Bound ($\\Omega(n \\log n)$):**

Consider the first $n/2$ terms (the larger ones):
$$n! = n \\cdot (n-1) \\cdots (n/2+1) \\cdot (n/2) \\cdots 1 \\geq \\left(\\frac{n}{2}\\right)^{n/2}$$

Taking logarithms:
$$\\log(n!) \\geq \\frac{n}{2} \\log\\left(\\frac{n}{2}\\right) = \\frac{n}{2}(\\log n - 1) = \\frac{n \\log n}{2} - \\frac{n}{2}$$

For large $n$: $\\log(n!) \\geq \\frac{n \\log n}{4}$, so $\\log(n!) = \\Omega(n \\log n)$.

**Combining bounds:**
$$\\boxed{\\log(n!) = \\Theta(n \\log n)}$$

**Alternative (Stirling's Approximation):**
$$n! \\approx \\sqrt{2\\pi n}\\left(\\frac{n}{e}\\right)^n$$
$$\\log(n!) \\approx n \\log n - n \\log e + \\frac{1}{2}\\log(2\\pi n) = \\Theta(n \\log n)$$`
          }
        ],
        visualizations: ['AsymptoticNotation'],
      },
      // Unit 2: Data Structures
      {
        id: 'data-structures',
        title: 'Data Structures and Sequences',
        description: 'Interfaces vs data structures, sequence and set interfaces, arrays, and linked lists.',
        sections: [
          {
            title: 'Interface vs Data Structure',
            content: `A critical distinction in algorithm design:

**Interface (ADT - Abstract Data Type):**
- Specification of **what** operations are supported
- Defines the **contract** between user and implementation
- Says nothing about **how** operations are performed
- Examples: Stack, Queue, Priority Queue, Dictionary

**Data Structure:**
- **How** data is stored and organized in memory
- Concrete implementation of an interface
- Determines time/space complexity of operations
- Examples: Array, Linked List, Hash Table, Binary Tree

**Analogy:** An interface is like a job description, while a data structure is like the employee who does the job.

**Example:** The "Set" interface supports:
- \`insert(x)\`: Add element $x$
- \`delete(x)\`: Remove element $x$
- \`find(x)\`: Check if $x$ is present

Many data structures can implement this interface: sorted array, hash table, balanced BST—each with different performance characteristics.`
          },
          {
            title: 'Sequence Interface',
            content: `The **Sequence** interface maintains a collection of items in an **extrinsic order** (order is externally imposed, not based on item values).

**Static Sequence Operations:**
- \`build(X)\`: Create sequence from items in $X$
- \`len()\`: Return number of items
- \`iter_seq()\`: Output items in sequence order
- \`get_at(i)\`: Return the $i$th item
- \`set_at(i, x)\`: Set the $i$th item to $x$

**Dynamic Sequence Operations:**
- \`insert_at(i, x)\`: Insert $x$ at position $i$, shifting items $\\{i, \\ldots, n-1\\}$ to $\\{i+1, \\ldots, n\\}$
- \`delete_at(i)\`: Delete item at position $i$, shifting items $\\{i+1, \\ldots, n-1\\}$ to $\\{i, \\ldots, n-2\\}$
- \`insert_first(x)\`, \`insert_last(x)\`: Special cases
- \`delete_first()\`, \`delete_last()\`: Special cases

**Key Insight:** The sequence interface is about **positional access** — we care about the order, not the values of items.

**Applications:** Arrays, lists, stacks (last-in-first-out), queues (first-in-first-out).`
          },
          {
            title: 'Set Interface',
            content: `The **Set** interface maintains a collection based on **intrinsic order** (order determined by item keys).

**Core Set Operations:**
- \`build(X)\`: Create set from items in $X$
- \`len()\`: Return number of items
- \`find(k)\`: Return item with key $k$ (or null)

**Dynamic Set Operations:**
- \`insert(x)\`: Add item $x$ (replacing if key exists)
- \`delete(k)\`: Remove item with key $k$

**Order Operations (for sorted sets):**
- \`iter_ord()\`: Output items in key order
- \`find_min()\`, \`find_max()\`: Return extreme items
- \`find_next(k)\`, \`find_prev(k)\`: Return successor/predecessor

**Set vs Sequence:**

| Aspect | Sequence | Set |
|--------|----------|-----|
| Order | Extrinsic (position) | Intrinsic (keys) |
| Access | By index $i$ | By key $k$ |
| Duplicates | Allowed | No (keys unique) |
| Main use | Ordered collections | Lookup, dictionary |`
          },
          {
            title: 'Static Arrays',
            content: `An **array** is a contiguous block of memory storing $n$ items.

**Key Property:** **Random Access** — any item can be accessed in $O(1)$ time via index arithmetic.

Given base address $A$ and word size $w$:
$$\\text{Address of } A[i] = A + w \\cdot i$$

**Static Array Complexity:**

| Operation | Time |
|-----------|------|
| \`build(X)\` | $O(n)$ |
| \`get_at(i)\` | $O(1)$ |
| \`set_at(i, x)\` | $O(1)$ |
| \`len()\` | $O(1)$ |
| \`iter_seq()\` | $O(n)$ |

**Limitation:** Static arrays have **fixed size**. Inserting or deleting requires:
- Allocating new array
- Copying all elements
- Cost: $O(n)$ per operation

**Space:** $\\Theta(n)$ words for $n$ items (optimal).

**Static arrays are excellent for:**
- Fixed-size collections
- Random access patterns
- Cache-efficient traversal (memory locality)`
          },
          {
            title: 'Dynamic Arrays',
            content: `**Dynamic arrays** (Python list, Java ArrayList, C++ vector) support efficient resizing.

**Key Idea:** Maintain a static array with **extra capacity**. When full, allocate a larger array and copy.

**Resizing Strategy:** When array of size $n$ is full, allocate new array of size $2n$ (doubling).

**Amortized Analysis of \`insert_last(x)\`:**

Cost of $n$ insertions:
- Most insertions: $O(1)$ (just append)
- Resize at sizes $1, 2, 4, 8, \\ldots, n$: copy costs $1 + 2 + 4 + \\cdots + n = 2n - 1$

$$\\text{Total cost} = n + (2n - 1) = O(n)$$

**Amortized cost per insertion:** $O(n)/n = O(1)$

**Dynamic Array Complexity:**

| Operation | Time (worst) | Time (amortized) |
|-----------|--------------|------------------|
| \`get_at(i)\` | $O(1)$ | $O(1)$ |
| \`set_at(i, x)\` | $O(1)$ | $O(1)$ |
| \`insert_last(x)\` | $O(n)$ | $O(1)$ |
| \`delete_last()\` | $O(1)$ | $O(1)$ |
| \`insert_at(i, x)\` | $O(n)$ | $O(n)$ |
| \`delete_at(i)\` | $O(n)$ | $O(n)$ |

**Note:** Inserting/deleting at arbitrary positions still requires shifting, hence $O(n)$.`
          },
          {
            title: 'Linked Lists',
            content: `A **linked list** stores items in **nodes** that contain:
1. The item value
2. A pointer to the next node (and previous, for doubly-linked)

**Singly Linked List:**
\`\`\`
head -> [a|->] -> [b|->] -> [c|->] -> null
\`\`\`

**Doubly Linked List:**
\`\`\`
head <-> [a] <-> [b] <-> [c] <-> tail
\`\`\`

**Linked List Complexity:**

| Operation | Array | Linked List |
|-----------|-------|-------------|
| \`get_at(i)\` | $O(1)$ | $O(n)$ |
| \`set_at(i, x)\` | $O(1)$ | $O(n)$ |
| \`insert_first(x)\` | $O(n)$ | $O(1)$ |
| \`delete_first()\` | $O(n)$ | $O(1)$ |
| \`insert_last(x)\` | $O(1)$ amortized | $O(1)$ with tail |
| \`delete_last()\` | $O(1)$ | $O(1)$ doubly |

**When to use Linked Lists:**
- Frequent insertions/deletions at ends
- Unknown or highly variable size
- No need for random access

**When to use Arrays:**
- Random access needed
- Cache efficiency important
- Known or bounded size`
          }
        ],
        practiceProblems: [
          {
            id: 'ds-1',
            problem: `Design a data structure that supports the following operations, all in $O(1)$ time:

- \`push(x)\`: Add element $x$ to the top
- \`pop()\`: Remove and return the top element
- \`get_min()\`: Return the minimum element (without removing)

All elements are distinct integers. Describe your approach and prove the time bounds.`,
            solution: `**Solution: Two-Stack Approach**

Maintain two stacks:
1. **Main stack $S$**: stores all elements
2. **Min stack $M$**: stores minimums (element at top of $M$ is current minimum)

**Operations:**

**push(x):**
\`\`\`
S.push(x)
if M.is_empty() or x <= M.top():
    M.push(x)
\`\`\`

**pop():**
\`\`\`
x = S.pop()
if x == M.top():
    M.pop()
return x
\`\`\`

**get_min():**
\`\`\`
return M.top()
\`\`\`

**Correctness Proof:**

**Invariant:** $M$ contains exactly the elements that are minimum at some prefix of $S$.

- When we push $x$, if $x$ is new minimum (or tied), we add it to $M$
- When we pop $x$, if $x$ was the current minimum, we remove it from $M$
- The top of $M$ is always the minimum of current elements

**Time Complexity:** Each operation does $O(1)$ stack operations = $\\boxed{O(1)}$

**Space Complexity:** $O(n)$ for both stacks (in worst case where elements are in decreasing order).`
          },
          {
            id: 'ds-2',
            problem: `You are given a **dynamic array** implementation that doubles capacity when full and halves capacity when less than 1/4 full.

**(a)** Show that a sequence of $n$ insertions and deletions can be done in $O(n)$ total time.

**(b)** Why do we halve at 1/4 full instead of 1/2 full?`,
            solution: `**(a)** Amortized Analysis using Potential Method:

Define potential $\\Phi$:
$$\\Phi = 2 \\cdot |\\text{num elements} - \\text{capacity}/2|$$

**For insertion when not full:**
- Actual cost: 1
- $\\Delta\\Phi = 2$ (if above half) or $-2$ (if below half)
- Amortized cost: $1 + 2 = 3$

**For insertion triggering resize (at capacity $c$, doubling to $2c$):**
- Actual cost: $c + 1$ (copy $c$ elements + insert 1)
- Before: $\\Phi = 2(c - c/2) = c$
- After: $\\Phi = 2(c + 1 - c) = 2$
- $\\Delta\\Phi = 2 - c$
- Amortized cost: $c + 1 + (2 - c) = 3$

**For deletion triggering resize (at $c/4$ elements, halving to capacity $c/2$):**
- Actual cost: $c/4$ (copy elements)
- Before: $\\Phi = 2(c/2 - c/4) = c/2$
- After: $\\Phi = 2(c/4 - c/4) = 0$
- $\\Delta\\Phi = -c/2$
- Amortized cost: $c/4 - c/2 = -c/4 \\leq 0$

All operations have $O(1)$ amortized cost, so $n$ operations cost $\\boxed{O(n)}$.

**(b)** If we halved at 1/2 full:

After doubling (array half full), one delete would trigger halving, then one insert triggers doubling, etc.

This **thrashing** pattern gives $\\Omega(n)$ cost per operation!

By halving at 1/4 full, we ensure at least $n/4$ operations between resizes, preventing thrashing.`
          },
          {
            id: 'ds-3',
            problem: `Implement a **queue** (FIFO: first-in-first-out) using two **stacks** such that the amortized cost of each \`enqueue\` and \`dequeue\` operation is $O(1)$.

Describe your algorithm and prove the amortized bound.`,
            solution: `**Two-Stack Queue Implementation:**

Use two stacks:
- **In-stack**: for enqueue operations
- **Out-stack**: for dequeue operations

**enqueue(x):**
\`\`\`
In.push(x)
\`\`\`

**dequeue():**
\`\`\`
if Out.is_empty():
    while not In.is_empty():
        Out.push(In.pop())
return Out.pop()
\`\`\`

**Correctness:**
- Items enter via In-stack (LIFO order)
- Transfer to Out-stack **reverses** order (now FIFO)
- Out-stack provides items in correct queue order

**Amortized Analysis (Accounting Method):**

Charge 3 "coins" per enqueue:
- 1 coin for the push to In
- 2 coins saved for future transfer

On dequeue:
- If Out not empty: 1 coin for pop (we have credit)
- If Out empty: use saved coins to pay for transfers

Each element is:
- Pushed to In: 1 coin
- Popped from In: 1 coin (saved)
- Pushed to Out: 1 coin (saved)
- Popped from Out: 1 coin

Total: 4 coins per element, paid at enqueue time.

**Amortized cost:**
- enqueue: $O(1)$ (pay 3, do 1)
- dequeue: $O(1)$ (spend saved coins)

$$\\boxed{\\text{Both operations are } O(1) \\text{ amortized}}$$`
          }
        ],
        visualizations: ['SequenceDataStructures'],
      },
      // Unit 3: Sorting
      {
        id: 'sorting',
        title: 'Sorting',
        description: 'Comparison sorting algorithms, insertion sort, merge sort, recurrences, and lower bounds.',
        sections: [
          {
            title: 'The Sorting Problem',
            content: `**Sorting Problem Definition:**
- **Input:** A sequence of $n$ items $A = \\langle a_1, a_2, \\ldots, a_n \\rangle$ with keys
- **Output:** A permutation $A' = \\langle a'_1, a'_2, \\ldots, a'_n \\rangle$ such that $a'_1.\\text{key} \\leq a'_2.\\text{key} \\leq \\cdots \\leq a'_n.\\text{key}$

**Why Sorting Matters:**
1. Many problems become easy after sorting (e.g., finding duplicates, median, range queries)
2. Sorting is a fundamental primitive in databases, search engines, graphics
3. Many important algorithmic techniques appear in sorting algorithms

**Types of Sorting:**
- **In-place:** Uses $O(1)$ extra space (modifies input array)
- **Stable:** Equal keys maintain their original relative order
- **Comparison-based:** Only uses pairwise comparisons between keys

**Stability Example:**
Sort students by grade. Stable sort preserves alphabetical order within same grade:

\`\`\`
Before: (Alice, B), (Bob, A), (Carol, B)
Stable:  (Bob, A), (Alice, B), (Carol, B) ✓
Unstable: (Bob, A), (Carol, B), (Alice, B) (Alice, Carol swapped)
\`\`\``
          },
          {
            title: 'Insertion Sort',
            content: `**Algorithm:** Build sorted portion from left to right, inserting each new element into its correct position.

**Pseudocode:**
\`\`\`
InsertionSort(A, n):
    for i = 1 to n-1:
        key = A[i]
        j = i - 1
        while j >= 0 and A[j] > key:
            A[j + 1] = A[j]
            j = j - 1
        A[j + 1] = key
\`\`\`

**Loop Invariant:** At the start of each iteration, $A[0..i-1]$ contains the original elements in sorted order.

**Analysis:**

| Case | Comparisons | Swaps | Time |
|------|-------------|-------|------|
| Best (sorted) | $n - 1$ | $0$ | $O(n)$ |
| Worst (reverse) | $\\sum_{i=1}^{n-1} i = \\frac{n(n-1)}{2}$ | $\\frac{n(n-1)}{2}$ | $O(n^2)$ |
| Average | $\\frac{n(n-1)}{4}$ | $\\frac{n(n-1)}{4}$ | $O(n^2)$ |

**Properties:**
- **In-place:** Yes ($O(1)$ extra space)
- **Stable:** Yes (equal elements maintain order)
- **Adaptive:** Yes (fast on nearly-sorted data)

**When to use:** Small arrays or nearly-sorted data where $O(n^2)$ is acceptable.`
          },
          {
            title: 'Merge Sort',
            content: `**Divide and Conquer Paradigm:**
1. **Divide:** Split problem into smaller subproblems
2. **Conquer:** Solve subproblems recursively
3. **Combine:** Merge solutions to solve original problem

**Merge Sort Algorithm:**
\`\`\`
MergeSort(A, l, r):
    if l < r:
        m = (l + r) / 2
        MergeSort(A, l, m)      // Sort left half
        MergeSort(A, m+1, r)    // Sort right half
        Merge(A, l, m, r)        // Combine

Merge(A, l, m, r):
    Create temp arrays L = A[l..m], R = A[m+1..r]
    i = j = 0, k = l
    while i < |L| and j < |R|:
        if L[i] <= R[j]:
            A[k++] = L[i++]
        else:
            A[k++] = R[j++]
    Copy remaining elements
\`\`\`

**Recurrence Relation:**
$$T(n) = 2T(n/2) + \\Theta(n)$$

- $2T(n/2)$: Two recursive calls on half-sized arrays
- $\\Theta(n)$: Merge step scans all elements once

**Solving via Master Theorem:**
- $a = 2$, $b = 2$, $f(n) = \\Theta(n)$
- $c_{\\text{crit}} = \\log_2 2 = 1$
- $f(n) = \\Theta(n^1)$ → Case 2

$$T(n) = \\Theta(n \\log n)$$

**Properties:**
- **In-place:** No (requires $\\Theta(n)$ extra space for merging)
- **Stable:** Yes (use $\\leq$ in merge comparison)
- **Time:** $\\Theta(n \\log n)$ always (no worst case)`
          },
          {
            title: 'Recurrence Relations',
            content: `**Common Recurrence Patterns:**

**1. Linear Recurrence** (process each element once):
$$T(n) = T(n-1) + O(1) \\Rightarrow T(n) = O(n)$$

**2. Divide by constant** (binary search style):
$$T(n) = T(n/2) + O(1) \\Rightarrow T(n) = O(\\log n)$$

**3. Full binary recursion** (explore all possibilities):
$$T(n) = 2T(n-1) + O(1) \\Rightarrow T(n) = O(2^n)$$

**4. Divide and conquer** (merge sort style):
$$T(n) = 2T(n/2) + O(n) \\Rightarrow T(n) = O(n \\log n)$$

**Recursion Tree Method:**

For $T(n) = 2T(n/2) + cn$:

Level 0: $cn$ work (root)
Level 1: $2 \\cdot c(n/2) = cn$ work
Level 2: $4 \\cdot c(n/4) = cn$ work
...
Level $\\log n$: $n \\cdot c(1) = cn$ work

Total: $cn \\cdot \\log n = \\Theta(n \\log n)$

**Substitution Method:**

Guess $T(n) = O(n \\log n)$, prove by induction:

Assume $T(k) \\leq ck \\log k$ for $k < n$.

$$T(n) = 2T(n/2) + n \\leq 2c(n/2)\\log(n/2) + n$$
$$= cn(\\log n - 1) + n = cn \\log n - cn + n$$

For $c \\geq 1$: $T(n) \\leq cn \\log n$ ✓`
          },
          {
            title: 'Lower Bound for Comparison Sorting',
            content: `**Theorem:** Any comparison-based sorting algorithm requires $\\Omega(n \\log n)$ comparisons in the worst case.

**Proof (Decision Tree Argument):**

Any comparison sort can be viewed as a **decision tree**:
- Each internal node is a comparison $a_i \\leq a_j$?
- Each leaf is a permutation of the input
- The algorithm's execution traces a path from root to leaf

**Key observations:**
1. There are $n!$ possible input orderings
2. Each requires a distinct leaf (different output)
3. The tree must have at least $n!$ leaves

**Height of decision tree:**
A binary tree with $L$ leaves has height at least $\\log_2 L$.

$$\\text{Height} \\geq \\log_2(n!) = \\Theta(n \\log n)$$

Using Stirling's approximation:
$$\\log(n!) = n \\log n - n \\log e + O(\\log n) = \\Theta(n \\log n)$$

**Conclusion:**
$$\\boxed{\\text{Any comparison sort requires } \\Omega(n \\log n) \\text{ comparisons}}$$

**Implications:**
- Merge sort is **asymptotically optimal** for comparison sorting
- To do better, we need non-comparison techniques (counting sort, radix sort)

**Note:** This is an **information-theoretic** lower bound. We need $\\log_2(n!)$ bits of information to determine the correct permutation, and each comparison provides at most 1 bit.`
          }
        ],
        practiceProblems: [
          {
            id: 'sort-1',
            problem: `Analyze the following algorithm:

\`\`\`
StrangeSort(A, n):
    if n <= 1:
        return
    m = floor(2n/3)
    StrangeSort(A[0..m-1], m)
    StrangeSort(A[n-m..n-1], m)
    StrangeSort(A[0..m-1], m)
\`\`\`

**(a)** Prove that StrangeSort correctly sorts the array.

**(b)** Write and solve the recurrence for its running time.`,
            solution: `**(a)** Correctness Proof:

**Claim:** After StrangeSort(A, n), A is sorted.

**Proof by strong induction on $n$:**

**Base case:** $n \\leq 1$ — trivially sorted.

**Inductive step:** Assume correctness for all sizes $< n$.

After first call StrangeSort(A[0..m-1]):
- First $m = \\lfloor 2n/3 \\rfloor$ elements are sorted

After second call StrangeSort(A[n-m..n-1]):
- Last $m$ elements are sorted
- Since $m > n/2$, the largest $n-m$ elements are now in the last $n-m$ positions

After third call StrangeSort(A[0..m-1]):
- First $m$ elements (containing the smallest $m$ elements) are sorted
- Combined with already-sorted last $n-m$ elements → **entire array sorted**

The key insight: $m + m - n = 2m - n = \\lfloor 4n/3 \\rfloor - n \\geq n/3$, so there's sufficient overlap. $\\square$

**(b)** Recurrence:

$$T(n) = 3T(2n/3) + O(1)$$

Using Master Theorem:
- $a = 3$, $b = 3/2$, $f(n) = O(1)$
- $c_{\\text{crit}} = \\log_{3/2} 3 = \\frac{\\log 3}{\\log 3 - \\log 2} \\approx 2.71$
- $f(n) = O(1) = O(n^{2.71 - \\epsilon})$ → Case 1

$$\\boxed{T(n) = \\Theta(n^{\\log_{3/2} 3}) = \\Theta(n^{2.71})}$$

This is worse than $O(n^2)$!`
          },
          {
            id: 'sort-2',
            problem: `Given an array of $n$ elements, you need to find if there are two elements whose sum equals a target value $T$.

**(a)** Describe an $O(n^2)$ algorithm.

**(b)** Describe an $O(n \\log n)$ algorithm using sorting.

**(c)** Can you do better using a hash table?`,
            solution: `**(a)** Brute Force $O(n^2)$:

\`\`\`
TwoSumBrute(A, n, T):
    for i = 0 to n-1:
        for j = i+1 to n-1:
            if A[i] + A[j] == T:
                return (i, j)
    return NOT_FOUND
\`\`\`

Nested loops: $\\binom{n}{2} = O(n^2)$ comparisons.

**(b)** Sorting-based $O(n \\log n)$:

\`\`\`
TwoSumSort(A, n, T):
    Sort(A)                    // O(n log n)
    left = 0, right = n-1
    while left < right:        // O(n)
        sum = A[left] + A[right]
        if sum == T:
            return (left, right)
        else if sum < T:
            left++
        else:
            right--
    return NOT_FOUND
\`\`\`

**Correctness:** Two-pointer technique works because array is sorted:
- If sum < T: need larger sum → move left pointer right
- If sum > T: need smaller sum → move right pointer left

Total: $O(n \\log n) + O(n) = \\boxed{O(n \\log n)}$

**(c)** Hash Table $O(n)$ expected:

\`\`\`
TwoSumHash(A, n, T):
    H = empty hash table
    for i = 0 to n-1:
        complement = T - A[i]
        if H.find(complement):
            return (H[complement], i)
        H.insert(A[i], i)
    return NOT_FOUND
\`\`\`

Each insert/find is $O(1)$ expected with hash table.

Total: $\\boxed{O(n)}$ expected time.`
          },
          {
            id: 'sort-3',
            problem: `You have $k$ sorted arrays, each of size $n/k$. You want to merge them into a single sorted array of size $n$.

**(a)** Describe an $O(n \\log k)$ algorithm.

**(b)** If you instead repeatedly merge pairs of arrays, what is the total time complexity?`,
            solution: `**(a)** Min-Heap Merge ($O(n \\log k)$):

Maintain a min-heap of size $k$, containing one element from each array (along with array index and position).

\`\`\`
MultiMerge(arrays[0..k-1]):
    result = []
    heap = MinHeap()
    for i = 0 to k-1:
        heap.insert((arrays[i][0], i, 0))

    while heap not empty:
        (val, arr_idx, pos) = heap.extractMin()  // O(log k)
        result.append(val)
        if pos + 1 < len(arrays[arr_idx]):
            heap.insert((arrays[arr_idx][pos+1], arr_idx, pos+1))

    return result
\`\`\`

**Analysis:**
- Each of $n$ elements is inserted and extracted once from heap
- Each heap operation: $O(\\log k)$
- Total: $\\boxed{O(n \\log k)}$

**(b)** Pairwise Merging:

**Round 1:** Merge $k$ arrays in pairs → $k/2$ arrays, each of size $2n/k$
- Work: $(k/2) \\cdot O(2n/k) = O(n)$

**Round 2:** Merge $k/2$ arrays in pairs → $k/4$ arrays
- Work: $O(n)$

...continuing for $\\log k$ rounds.

**Total:** $O(n) \\cdot \\log k = \\boxed{O(n \\log k)}$

**Comparison:** Both approaches give $O(n \\log k)$, but:
- Heap merge: streams output (good for limited memory)
- Pairwise merge: simpler implementation, better cache behavior`
          }
        ],
        visualizations: ['SortingVisualizer', 'MergeSortVisualizer'],
      },
      // Unit 4: Hashing
      {
        id: 'hashing',
        title: 'Hashing',
        description: 'Hash tables, hash functions, collision resolution via chaining and open addressing.',
        sections: [
          {
            title: 'The Dictionary Problem',
            content: `The **Set** interface requires efficient:
- \`find(k)\`: Return item with key $k$
- \`insert(x)\`: Add item $x$
- \`delete(k)\`: Remove item with key $k$

**Comparison of Data Structures:**

| Data Structure | find | insert | delete |
|---------------|------|--------|--------|
| Unsorted Array | $O(n)$ | $O(1)$ | $O(n)$ |
| Sorted Array | $O(\\log n)$ | $O(n)$ | $O(n)$ |
| Balanced BST | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ |
| **Hash Table** | $O(1)$ expected | $O(1)$ expected | $O(1)$ expected |

**Goal:** Achieve $O(1)$ expected time for all operations!

**Key Idea:** Use a **hash function** $h: U \\to \\{0, 1, \\ldots, m-1\\}$ to map keys from a large universe $U$ to a small table of size $m$.`
          },
          {
            title: 'Hash Functions',
            content: `A **hash function** $h: U \\to \\{0, 1, \\ldots, m-1\\}$ maps keys to table indices.

**Desirable Properties:**
1. **Deterministic:** Same key always maps to same index
2. **Efficient:** Computable in $O(1)$ time
3. **Uniform:** Distributes keys evenly across table

**Division Method:**
$$h(k) = k \\mod m$$

Choose $m$ to be a prime not close to a power of 2.

**Multiplication Method:**
$$h(k) = \\lfloor m(kA \\mod 1) \\rfloor$$

where $A$ is a constant, often $A = (\\sqrt{5} - 1)/2 \\approx 0.618$ (golden ratio).

**Universal Hashing:** Choose hash function randomly from a family $\\mathcal{H}$:
$$h_{a,b}(k) = ((ak + b) \\mod p) \\mod m$$

where $p$ is a large prime, $a \\in \\{1, \\ldots, p-1\\}$, $b \\in \\{0, \\ldots, p-1\\}$.

**Universal Property:** For any two keys $k_1 \\neq k_2$:
$$P_{h \\in \\mathcal{H}}[h(k_1) = h(k_2)] \\leq \\frac{1}{m}$$`
          },
          {
            title: 'Collision Resolution: Chaining',
            content: `**Collision:** When $h(k_1) = h(k_2)$ for $k_1 \\neq k_2$.

**Chaining:** Each table slot holds a linked list of items that hash to that slot.

\`\`\`
Table:
[0] -> (k1, v1) -> (k5, v5) -> null
[1] -> null
[2] -> (k2, v2) -> null
[3] -> (k3, v3) -> (k7, v7) -> (k9, v9) -> null
...
\`\`\`

**Operations with Chaining:**

**insert(x):** Add $x$ to the list at $T[h(x.key)]$ — $O(1)$

**find(k):** Search the list at $T[h(k)]$ — $O(\\text{list length})$

**delete(k):** Remove from list at $T[h(k)]$ — $O(\\text{list length})$

**Load Factor:** $\\alpha = n/m$ (average items per slot)

**Expected chain length:** $\\alpha$ (with uniform hashing)

**Expected time for find:** $O(1 + \\alpha)$

If we maintain $\\alpha = O(1)$ (resize when needed), all operations are $O(1)$ expected.`
          },
          {
            title: 'Collision Resolution: Open Addressing',
            content: `**Open Addressing:** All items stored directly in table (no linked lists). On collision, probe for next empty slot.

**Probe Sequence:** $h(k, 0), h(k, 1), h(k, 2), \\ldots$

**Linear Probing:**
$$h(k, i) = (h'(k) + i) \\mod m$$

Simple but suffers from **primary clustering** — long runs of occupied slots.

**Quadratic Probing:**
$$h(k, i) = (h'(k) + c_1 i + c_2 i^2) \\mod m$$

Reduces primary clustering but can have **secondary clustering**.

**Double Hashing:**
$$h(k, i) = (h_1(k) + i \\cdot h_2(k)) \\mod m$$

Best distribution; requires $h_2(k) \\neq 0$ and $\\gcd(h_2(k), m) = 1$.

**Deletion Problem:** Can't simply remove items (breaks probe sequences). Use **tombstones** or **lazy deletion**.

**Load Factor Constraint:** Must keep $\\alpha < 1$ (table can't be completely full). Typically resize at $\\alpha > 0.7$.

**Expected probes for successful search:** $\\frac{1}{\\alpha} \\ln \\frac{1}{1-\\alpha}$ (uniform hashing)`
          },
          {
            title: 'Hash Table Analysis',
            content: `**Simple Uniform Hashing Assumption (SUHA):**
Each key is equally likely to hash to any slot, independent of other keys.

**Theorem (Chaining):** Under SUHA with load factor $\\alpha$:
- Expected time for unsuccessful search: $\\Theta(1 + \\alpha)$
- Expected time for successful search: $\\Theta(1 + \\alpha/2)$

**Theorem (Open Addressing):** Under uniform hashing with load factor $\\alpha < 1$:
- Expected probes for unsuccessful search: $\\frac{1}{1-\\alpha}$
- Expected probes for successful search: $\\frac{1}{\\alpha} \\ln \\frac{1}{1-\\alpha}$

**Dynamic Resizing:**
When $\\alpha$ exceeds threshold:
1. Allocate new table of size $2m$
2. Rehash all $n$ items: $O(n)$
3. Amortized cost per operation: $O(1)$

**Python's dict:** Uses open addressing with pseudo-random probing. Resizes when 2/3 full.

**Real-world Considerations:**
- Cache performance (open addressing often better)
- Worst-case guarantees (use universal hashing)
- String hashing (polynomial rolling hash)`
          }
        ],
        practiceProblems: [
          {
            id: 'hash-1',
            problem: `Consider a hash table with $m = 11$ slots using the division method $h(k) = k \\mod 11$.

Insert the keys 10, 22, 31, 4, 15, 28, 17, 88, 59 in order using:

**(a)** Chaining

**(b)** Linear probing

**(c)** Double hashing with $h_2(k) = 7 - (k \\mod 7)$

Show the final state of the table for each method.`,
            solution: `**Hash values:** $h(k) = k \\mod 11$
- $h(10) = 10$, $h(22) = 0$, $h(31) = 9$, $h(4) = 4$, $h(15) = 4$
- $h(28) = 6$, $h(17) = 6$, $h(88) = 0$, $h(59) = 4$

**(a) Chaining:**
\`\`\`
[0]: 22 -> 88
[1]: empty
[2]: empty
[3]: empty
[4]: 4 -> 15 -> 59
[5]: empty
[6]: 28 -> 17
[7]: empty
[8]: empty
[9]: 31
[10]: 10
\`\`\`

**(b) Linear Probing:** (probe sequence: $i, i+1, i+2, \\ldots$)
- 10 → slot 10
- 22 → slot 0
- 31 → slot 9
- 4 → slot 4
- 15 → slot 4 occupied → 5
- 28 → slot 6
- 17 → slot 6 occupied → 7
- 88 → slot 0 occupied → 1
- 59 → slot 4,5 occupied → slot 8 (wraps: 4→5→6→7→8)

\`\`\`
[0]: 22  [1]: 88  [2]: empty  [3]: empty  [4]: 4
[5]: 15  [6]: 28  [7]: 17     [8]: 59     [9]: 31  [10]: 10
\`\`\`

**(c) Double Hashing:** $h_2(k) = 7 - (k \\mod 7)$
- $h_2(15) = 7 - 1 = 6$, so 15: slot 4 → 4+6=10 occupied → 10+6=5
- $h_2(17) = 7 - 3 = 4$, so 17: slot 6 → 6+4=10 occupied → 10+4=3
- $h_2(88) = 7 - 4 = 3$, so 88: slot 0 → 0+3=3 occupied → 3+3=6 occupied → 9 occupied → 1
- $h_2(59) = 7 - 3 = 4$, so 59: slot 4 → 8

\`\`\`
[0]: 22  [1]: 88  [2]: empty  [3]: 17  [4]: 4
[5]: 15  [6]: 28  [7]: empty  [8]: 59  [9]: 31  [10]: 10
\`\`\``
          },
          {
            id: 'hash-2',
            problem: `Prove that for a hash table with chaining, if we use a universal hash family, then for any key $k$:

$$E[\\text{chain length at } h(k)] \\leq 1 + \\alpha$$

where $\\alpha = n/m$ is the load factor.`,
            solution: `**Proof:**

Let $X_i$ be an indicator random variable:
$$X_i = \\begin{cases} 1 & \\text{if } h(k_i) = h(k) \\text{ for } k_i \\neq k \\\\ 0 & \\text{otherwise} \\end{cases}$$

The chain length at slot $h(k)$ is:
$$L = 1 + \\sum_{i: k_i \\neq k} X_i$$

(The 1 accounts for $k$ itself if it's in the table.)

**Taking expectation:**
$$E[L] = 1 + \\sum_{i: k_i \\neq k} E[X_i] = 1 + \\sum_{i: k_i \\neq k} P[h(k_i) = h(k)]$$

**By universal hashing property:**
$$P[h(k_i) = h(k)] \\leq \\frac{1}{m}$$

**Therefore:**
$$E[L] \\leq 1 + \\sum_{i: k_i \\neq k} \\frac{1}{m} = 1 + \\frac{n-1}{m} < 1 + \\frac{n}{m} = \\boxed{1 + \\alpha}$$

**Interpretation:** Even with adversarial input, universal hashing guarantees expected $O(1 + \\alpha)$ chain length, giving $O(1)$ expected operations when $\\alpha = O(1)$.`
          },
          {
            id: 'hash-3',
            problem: `Design a data structure to support the following operations on a set of integers, all in $O(1)$ expected time:

- \`insert(x)\`: Add $x$ to the set
- \`delete(x)\`: Remove $x$ from the set
- \`getRandom()\`: Return a uniformly random element from the set

Describe your approach and justify the time bounds.`,
            solution: `**Solution: Hash Table + Dynamic Array**

Maintain two data structures:
1. **Array $A$**: Stores elements contiguously (for random access)
2. **Hash Table $H$**: Maps each element to its index in $A$

**insert(x):**
\`\`\`
if x not in H:
    A.append(x)
    H[x] = len(A) - 1
\`\`\`
Time: $O(1)$ expected (hash table insert + array append)

**delete(x):**
\`\`\`
if x in H:
    idx = H[x]
    last = A[-1]
    # Swap with last element
    A[idx] = last
    H[last] = idx
    # Remove last element
    A.pop()
    del H[x]
\`\`\`
Time: $O(1)$ expected (swap trick avoids shifting)

**getRandom():**
\`\`\`
idx = random(0, len(A) - 1)
return A[idx]
\`\`\`
Time: $O(1)$ (array random access)

**Why it works:**
- Array enables $O(1)$ random access for getRandom
- Hash table enables $O(1)$ lookup for insert/delete
- Swap-with-last trick enables $O(1)$ deletion from array

**Space:** $O(n)$ for both structures.

$$\\boxed{\\text{All operations } O(1) \\text{ expected}}$$`
          }
        ],
        visualizations: ['HashTableVisualizer'],
      },
      // Unit 5: Linear Sorting
      {
        id: 'linear-sorting',
        title: 'Linear Sorting',
        description: 'Non-comparison sorting: counting sort, radix sort, and bucket sort.',
        sections: [
          {
            title: 'Breaking the Ω(n log n) Barrier',
            content: `**Recall:** Any comparison-based sorting algorithm requires $\\Omega(n \\log n)$ comparisons in the worst case.

**Key Insight:** The lower bound assumes we only use comparisons. If we have additional information about the keys, we can sort faster!

**When can we beat $O(n \\log n)$?**
1. Keys are integers in a bounded range $\\{0, 1, \\ldots, u-1\\}$
2. Keys have a special structure (e.g., strings, tuples)
3. Keys are uniformly distributed

**Linear-time sorting algorithms:**
- **Counting Sort:** $O(n + u)$ for integers in $\\{0, \\ldots, u-1\\}$
- **Radix Sort:** $O(d(n + b))$ for $d$-digit numbers in base $b$
- **Bucket Sort:** $O(n)$ expected for uniformly distributed keys

**Trade-off:** These algorithms use more space and have restrictions on input types.`
          },
          {
            title: 'Counting Sort',
            content: `**Assumption:** Keys are integers in $\\{0, 1, \\ldots, u-1\\}$ where $u$ is known.

**Algorithm:**
\`\`\`
CountingSort(A, n, u):
    C = array of size u, initialized to 0

    # Count occurrences
    for i = 0 to n-1:
        C[A[i].key] += 1

    # Compute cumulative counts (positions)
    for j = 1 to u-1:
        C[j] += C[j-1]

    # Place elements in output (backwards for stability)
    B = array of size n
    for i = n-1 downto 0:
        B[C[A[i].key] - 1] = A[i]
        C[A[i].key] -= 1

    return B
\`\`\`

**Example:** Sort $[4, 1, 3, 4, 3]$ with $u = 5$

1. Count: $C = [0, 1, 0, 2, 2]$
2. Cumulative: $C = [0, 1, 1, 3, 5]$
3. Place backwards: $[1, 3, 3, 4, 4]$

**Analysis:**
- Time: $O(n + u)$ — linear when $u = O(n)$
- Space: $O(n + u)$
- **Stable:** Yes (backwards iteration preserves order of equal keys)

**When to use:** Small integer keys where $u = O(n)$.`
          },
          {
            title: 'Radix Sort',
            content: `**Idea:** Sort multi-digit numbers digit by digit, from least significant to most significant, using a stable sort for each digit.

**Algorithm (LSD Radix Sort):**
\`\`\`
RadixSort(A, d, b):
    # d = number of digits, b = base
    for i = 0 to d-1:
        StableSort(A by digit i)  # Use counting sort
\`\`\`

**Example:** Sort $[329, 457, 657, 839, 436, 720, 355]$ in base 10

- By ones digit: $[720, 355, 436, 457, 657, 329, 839]$
- By tens digit: $[720, 329, 436, 839, 355, 457, 657]$
- By hundreds: $[329, 355, 436, 457, 657, 720, 839]$ ✓

**Why least-significant first?**
Stability preserves work from previous passes. If we sorted most-significant first, later passes would destroy the ordering.

**Analysis:**
- $d$ passes, each using counting sort on base-$b$ digits
- Each pass: $O(n + b)$
- Total: $O(d(n + b))$

**Choosing $b$:** For $n$ numbers with max value $u$:
- $d = \\log_b u$ digits needed
- Time: $O(\\frac{\\log u}{\\log b}(n + b))$
- Optimal $b = n$: $O(n \\cdot \\frac{\\log u}{\\log n})$

If $u = n^c$ for constant $c$: Time = $O(cn) = O(n)$`
          },
          {
            title: 'Bucket Sort',
            content: `**Assumption:** Keys are uniformly distributed in $[0, 1)$.

**Algorithm:**
\`\`\`
BucketSort(A, n):
    B = array of n empty lists (buckets)

    # Distribute into buckets
    for i = 0 to n-1:
        bucket_idx = floor(n * A[i])
        B[bucket_idx].append(A[i])

    # Sort each bucket
    for j = 0 to n-1:
        sort(B[j])  # Insertion sort or any sort

    # Concatenate buckets
    return concatenate(B[0], B[1], ..., B[n-1])
\`\`\`

**Intuition:** Uniform distribution → each bucket gets ~1 element → sorting buckets is cheap.

**Analysis:**

Let $n_i$ = number of elements in bucket $i$.

Expected time to sort bucket $i$: $O(E[n_i^2])$ (using insertion sort)

$$E\\left[\\sum_{i=0}^{n-1} n_i^2\\right] = \\sum_{i=0}^{n-1} E[n_i^2]$$

For uniform distribution: $E[n_i^2] = 2 - 1/n$ (can be shown)

Total expected time: $O(n \\cdot (2 - 1/n)) = O(n)$

**When to use:** Data uniformly distributed or can be transformed to be uniform.

**Generalization:** Bucket sort works well when elements are roughly evenly distributed into buckets.`
          },
          {
            title: 'Comparison of Sorting Algorithms',
            content: `**Summary Table:**

| Algorithm | Time (worst) | Time (avg/exp) | Space | Stable | Notes |
|-----------|-------------|----------------|-------|--------|-------|
| Insertion Sort | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes | Good for small/nearly sorted |
| Merge Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(n)$ | Yes | Optimal comparison sort |
| Quick Sort | $O(n^2)$ | $O(n \\log n)$ | $O(\\log n)$ | No | Fast in practice |
| Heap Sort | $O(n \\log n)$ | $O(n \\log n)$ | $O(1)$ | No | In-place, not stable |
| Counting Sort | $O(n + u)$ | $O(n + u)$ | $O(n + u)$ | Yes | Integers in $[0, u)$ |
| Radix Sort | $O(d(n+b))$ | $O(d(n+b))$ | $O(n + b)$ | Yes | $d$ digits, base $b$ |
| Bucket Sort | $O(n^2)$ | $O(n)$ | $O(n)$ | Yes | Uniform distribution |

**Choosing an Algorithm:**
- Small arrays: Insertion sort
- General purpose: Merge sort (stable) or Quick sort (fast)
- Integer keys in small range: Counting sort
- Large integers: Radix sort
- Uniformly distributed: Bucket sort
- In-place needed: Heap sort or Quick sort`
          }
        ],
        practiceProblems: [
          {
            id: 'linear-1',
            problem: `You have an array of $n$ strings, each of length exactly $k$, where each character is from an alphabet of size $\\sigma$.

**(a)** Describe an algorithm to sort these strings in $O(k(n + \\sigma))$ time.

**(b)** What is the time complexity if strings have variable length, with total characters $= L$?`,
            solution: `**(a)** Use Radix Sort (LSD) on strings:

\`\`\`
StringRadixSort(A, n, k, σ):
    for i = k-1 downto 0:  # Right to left
        CountingSort(A by character at position i)
\`\`\`

**Analysis:**
- $k$ passes (one per character position)
- Each pass: Counting sort with alphabet size $\\sigma$
- Per pass: $O(n + \\sigma)$
- Total: $\\boxed{O(k(n + \\sigma))}$

**Correctness:** LSD radix sort with stable counting sort correctly sorts strings lexicographically.

**(b)** Variable-length strings:

**Approach 1:** Pad strings to max length $k_{max}$
- Time: $O(k_{max}(n + \\sigma))$ — wasteful if lengths vary greatly

**Approach 2:** MSD Radix Sort (recursive)
- Sort by first character, then recursively sort each group
- Time: $O(L + n \\cdot \\sigma)$ where $L$ = total characters

**Approach 3:** Sort by length first, then use LSD within each length group
- Group strings by length: $O(n)$
- Sort each group: $O(\\sum_i k_i \\cdot n_i) = O(L)$ total
- Merge: $O(n)$
- Total: $\\boxed{O(L + n)}$ with proper implementation`
          },
          {
            id: 'linear-2',
            problem: `Given an array of $n$ integers in the range $[0, n^2 - 1]$, sort the array in $O(n)$ time.

*Hint: Think about representing numbers in a different base.*`,
            solution: `**Key Insight:** Integers in $[0, n^2 - 1]$ can be written as 2-digit numbers in base $n$.

Any integer $x \\in [0, n^2 - 1]$ can be written as:
$$x = a \\cdot n + b$$
where $a = \\lfloor x/n \\rfloor$ (high digit) and $b = x \\mod n$ (low digit), both in $[0, n-1]$.

**Algorithm:**
\`\`\`
Sort(A, n):
    # Extract digits (base n)
    for i = 0 to n-1:
        A[i].low = A[i] mod n
        A[i].high = A[i] / n

    # Radix sort: 2 passes of counting sort
    CountingSort(A by low digit, range [0, n-1])
    CountingSort(A by high digit, range [0, n-1])

    return A
\`\`\`

**Analysis:**
- Extract digits: $O(n)$
- Pass 1 (low digit): Counting sort with $u = n$ → $O(n + n) = O(n)$
- Pass 2 (high digit): Counting sort with $u = n$ → $O(n)$
- Total: $\\boxed{O(n)}$

**Generalization:** For integers in $[0, n^c - 1]$:
- Use $c$ digits in base $n$
- $c$ passes of counting sort
- Time: $O(cn)$

If $c$ is constant, this is $O(n)$.`
          },
          {
            id: 'linear-3',
            problem: `You have $n$ points in the plane, where each coordinate is an integer in $[0, n-1]$. Sort the points by their distance from the origin.

Can you do this in $O(n)$ time? Justify your answer.`,
            solution: `**Analysis of the problem:**

Distance from origin: $d(x, y) = \\sqrt{x^2 + y^2}$

Since we only need relative ordering, we can sort by $d^2 = x^2 + y^2$ instead (avoids square root).

**Range of $d^2$:**
- Minimum: $0$ (point at origin)
- Maximum: $(n-1)^2 + (n-1)^2 = 2(n-1)^2 \\approx 2n^2$

So $d^2 \\in [0, 2n^2 - 2n]$.

**Can we use counting sort?**
The range is $O(n^2)$, so counting sort would be $O(n + n^2) = O(n^2)$.

**Can we use radix sort?**
Yes! $d^2$ values are in $[0, 2n^2)$, which can be represented as 2-digit numbers in base $2n$.

**Algorithm:**
\`\`\`
SortByDistance(points, n):
    # Compute squared distances
    for i = 0 to n-1:
        points[i].d2 = points[i].x^2 + points[i].y^2

    # Radix sort by d2 (base 2n, 2 digits)
    CountingSort(points by d2 mod (2n))    # Low digit
    CountingSort(points by d2 / (2n))      # High digit

    return points
\`\`\`

**Time Analysis:**
- Compute $d^2$: $O(n)$
- Two counting sort passes with range $2n$: $O(n + 2n) \\times 2 = O(n)$

$$\\boxed{\\text{Yes, } O(n) \\text{ time is achievable}}$$

**Note:** If coordinates were real numbers or in a larger range, $O(n)$ would not be possible without additional assumptions.`
          }
        ],
        visualizations: ['LinearSortingVisualizer'],
      },
      // Unit 6: Binary Trees, Part 1
      {
        id: 'binary-trees-1',
        title: 'Binary Trees, Part 1',
        description: 'Binary search tree properties, traversals, and basic operations.',
        sections: [
          {
            title: 'Binary Tree Fundamentals',
            content: `A **binary tree** is a rooted tree where each node has at most two children: **left** and **right**.

**Terminology:**
- **Root:** The topmost node (no parent)
- **Leaf:** A node with no children
- **Internal node:** A node with at least one child
- **Depth of node:** Number of edges from root to node
- **Height of node:** Number of edges on longest path to a leaf
- **Height of tree:** Height of root = max depth of any node

**Key Properties:**
- A binary tree with $n$ nodes has $n - 1$ edges
- A binary tree of height $h$ has at most $2^{h+1} - 1$ nodes
- A binary tree with $n$ nodes has height at least $\\lfloor \\log_2 n \\rfloor$

**Complete Binary Tree:** All levels except possibly the last are full, and the last level has nodes as far left as possible.

**Perfect Binary Tree:** All internal nodes have two children, and all leaves are at the same level. Has exactly $2^{h+1} - 1$ nodes.`
          },
          {
            title: 'Binary Search Tree Property',
            content: `A **Binary Search Tree (BST)** is a binary tree satisfying the **BST property**:

For every node $x$:
- All keys in left subtree of $x$ are **less than** $x.key$
- All keys in right subtree of $x$ are **greater than** $x.key$

**Example:**
\`\`\`
        8
       / \\
      3   10
     / \\    \\
    1   6    14
       / \\   /
      4   7 13
\`\`\`

**Key Insight:** An **inorder traversal** of a BST visits nodes in sorted order!

**BST Representation:**
\`\`\`
class Node:
    key         # The key value
    left        # Pointer to left child
    right       # Pointer to right child
    parent      # Pointer to parent (optional)
\`\`\`

**Why BSTs?**
- Support Set interface operations efficiently
- Maintain sorted order dynamically
- Enable range queries and order statistics`
          },
          {
            title: 'Tree Traversals',
            content: `**Three classical traversals** (all $O(n)$ time):

**Inorder (Left, Root, Right):**
\`\`\`
inorder(node):
    if node != null:
        inorder(node.left)
        visit(node)
        inorder(node.right)
\`\`\`
For BST: visits nodes in sorted order.

**Preorder (Root, Left, Right):**
\`\`\`
preorder(node):
    if node != null:
        visit(node)
        preorder(node.left)
        preorder(node.right)
\`\`\`
Useful for: copying tree, prefix expressions.

**Postorder (Left, Right, Root):**
\`\`\`
postorder(node):
    if node != null:
        postorder(node.left)
        postorder(node.right)
        visit(node)
\`\`\`
Useful for: deleting tree, postfix expressions, computing heights.

**Level-order (BFS):**
\`\`\`
levelorder(root):
    queue = [root]
    while queue not empty:
        node = queue.dequeue()
        visit(node)
        if node.left: queue.enqueue(node.left)
        if node.right: queue.enqueue(node.right)
\`\`\`
Visits level by level, left to right.`
          },
          {
            title: 'BST Operations: Search and Insert',
            content: `**Search (find):**
\`\`\`
search(node, k):
    if node == null or node.key == k:
        return node
    if k < node.key:
        return search(node.left, k)
    else:
        return search(node.right, k)
\`\`\`
Time: $O(h)$ where $h$ is tree height.

**Insert:**
\`\`\`
insert(root, k):
    if root == null:
        return new Node(k)
    if k < root.key:
        root.left = insert(root.left, k)
    else if k > root.key:
        root.right = insert(root.right, k)
    return root
\`\`\`
Time: $O(h)$

**Finding Min/Max:**
\`\`\`
findMin(node):           findMax(node):
    while node.left:         while node.right:
        node = node.left         node = node.right
    return node              return node
\`\`\`
Time: $O(h)$

**Successor/Predecessor:**
The **successor** of node $x$ is the node with the smallest key greater than $x.key$.

\`\`\`
successor(x):
    if x.right != null:
        return findMin(x.right)
    y = x.parent
    while y != null and x == y.right:
        x = y
        y = y.parent
    return y
\`\`\`
Time: $O(h)$`
          },
          {
            title: 'BST Deletion',
            content: `**Deleting node $z$ has three cases:**

**Case 1: $z$ has no children (leaf)**
Simply remove $z$.

**Case 2: $z$ has one child**
Replace $z$ with its child.

**Case 3: $z$ has two children**
1. Find $z$'s successor $y$ (minimum in right subtree)
2. Replace $z$'s key with $y$'s key
3. Delete $y$ (which has at most one child)

\`\`\`
delete(root, k):
    if root == null:
        return null

    if k < root.key:
        root.left = delete(root.left, k)
    else if k > root.key:
        root.right = delete(root.right, k)
    else:  # Found node to delete
        if root.left == null:
            return root.right
        if root.right == null:
            return root.left
        # Two children: replace with successor
        successor = findMin(root.right)
        root.key = successor.key
        root.right = delete(root.right, successor.key)

    return root
\`\`\`

**Time:** $O(h)$

**BST Performance Summary:**
| Operation | Time |
|-----------|------|
| search | $O(h)$ |
| insert | $O(h)$ |
| delete | $O(h)$ |
| min/max | $O(h)$ |
| successor | $O(h)$ |

**Problem:** Height $h$ can be $O(n)$ in worst case (degenerate/skewed tree)!`
          }
        ],
        practiceProblems: [
          {
            id: 'bst-1',
            problem: `Given the following sequence of insertions into an initially empty BST:
$$15, 6, 18, 3, 7, 17, 20, 2, 4, 13, 9$$

**(a)** Draw the resulting BST.

**(b)** List the nodes in inorder, preorder, and postorder.

**(c)** Delete node 6. Draw the resulting tree.`,
            solution: `**(a)** BST after insertions:

\`\`\`
            15
           /  \\
          6    18
         / \\   / \\
        3   7 17  20
       / \\   \\
      2   4   13
             /
            9
\`\`\`

**(b)** Traversals:

**Inorder** (sorted order):
$$\\boxed{2, 3, 4, 6, 7, 9, 13, 15, 17, 18, 20}$$

**Preorder** (root first):
$$\\boxed{15, 6, 3, 2, 4, 7, 13, 9, 18, 17, 20}$$

**Postorder** (root last):
$$\\boxed{2, 4, 3, 9, 13, 7, 6, 17, 20, 18, 15}$$

**(c)** Delete node 6:

Node 6 has two children. Find successor = 7 (minimum in right subtree).
Replace 6 with 7, then delete original 7.

\`\`\`
            15
           /  \\
          7    18
         / \\   / \\
        3  13 17  20
       / \\  /
      2   4 9
\`\`\``
          },
          {
            id: 'bst-2',
            problem: `Write an algorithm to check if a given binary tree is a valid BST.

Your algorithm should run in $O(n)$ time where $n$ is the number of nodes.

*Hint: What constraints must each node satisfy?*`,
            solution: `**Key Insight:** Each node must have a key within a valid range determined by its ancestors.

**Algorithm:**
\`\`\`
isValidBST(root):
    return checkBST(root, -∞, +∞)

checkBST(node, minVal, maxVal):
    if node == null:
        return true

    if node.key <= minVal or node.key >= maxVal:
        return false

    # Left subtree: all keys must be < node.key
    # Right subtree: all keys must be > node.key
    return checkBST(node.left, minVal, node.key) and
           checkBST(node.right, node.key, maxVal)
\`\`\`

**Example trace:**
\`\`\`
        5
       / \\
      3   7
     / \\
    2   6  ← Invalid! 6 > 5 but in left subtree
\`\`\`

checkBST(5, -∞, +∞): valid range for 5 ✓
  checkBST(3, -∞, 5): valid range for 3 ✓
    checkBST(6, 3, 5): 6 > 5, **INVALID** ✗

**Alternative: Inorder Traversal**
\`\`\`
isValidBST(root):
    prev = -∞
    return inorderCheck(root)

inorderCheck(node):
    if node == null: return true
    if not inorderCheck(node.left): return false
    if node.key <= prev: return false
    prev = node.key
    return inorderCheck(node.right)
\`\`\`

Inorder of valid BST is strictly increasing.

**Time:** $O(n)$ — each node visited once.
**Space:** $O(h)$ for recursion stack.`
          },
          {
            id: 'bst-3',
            problem: `Given a BST and two values $k_1 < k_2$, write an algorithm to print all keys in the range $[k_1, k_2]$ in sorted order.

Analyze the time complexity in terms of $n$ (total nodes), $h$ (tree height), and $m$ (number of keys in range).`,
            solution: `**Algorithm (modified inorder):**
\`\`\`
rangeQuery(node, k1, k2):
    if node == null:
        return

    # Prune left if all keys would be < k1
    if node.key > k1:
        rangeQuery(node.left, k1, k2)

    # Print if in range
    if k1 <= node.key <= k2:
        print(node.key)

    # Prune right if all keys would be > k2
    if node.key < k2:
        rangeQuery(node.right, k1, k2)
\`\`\`

**Correctness:**
- BST property ensures nodes are visited in sorted order (inorder)
- Pruning ensures we only visit relevant subtrees

**Time Analysis:**

Let $m$ = number of keys in $[k_1, k_2]$.

The algorithm visits:
1. $O(h)$ nodes on the path to $k_1$
2. $O(h)$ nodes on the path to $k_2$
3. $O(m)$ nodes that are in the range

**Total time:** $\\boxed{O(h + m)}$

**Why not $O(n)$?** Pruning prevents visiting subtrees entirely outside the range.

**Space:** $O(h)$ for recursion stack.

**Example:**
\`\`\`
        15
       /  \\
      6    18
     / \\   / \\
    3   7 17  20
\`\`\`

rangeQuery(root, 5, 17):
- Visit 15 (in range, print), explore both
- Visit 6 (in range, print), explore right only (3 < 5)
- Visit 7 (in range, print)
- Visit 18 (> 17), explore left only
- Visit 17 (in range, print)

Output: $\\boxed{6, 7, 15, 17}$`
          }
        ],
        visualizations: ['BSTVisualizer'],
      },
      // Unit 7: Binary Trees, Part 2: AVL
      {
        id: 'binary-trees-avl',
        title: 'Binary Trees, Part 2: AVL',
        description: 'Self-balancing BSTs, AVL tree rotations, and height maintenance.',
        sections: [
          {
            title: 'The Balance Problem',
            content: `**Problem with BSTs:** Height can be $O(n)$ in worst case.

**Example:** Insert 1, 2, 3, 4, 5 into empty BST:
\`\`\`
1
 \\
  2
   \\
    3
     \\
      4
       \\
        5
\`\`\`
This is just a linked list! All operations become $O(n)$.

**Goal:** Maintain height $h = O(\\log n)$ after every operation.

**Balanced BST:** A BST where the height is guaranteed to be $O(\\log n)$.

**Approaches:**
1. **AVL Trees:** Balance condition on heights of children
2. **Red-Black Trees:** Coloring rules ensure balance
3. **2-3 Trees / B-Trees:** Allow more children per node
4. **Splay Trees:** Self-adjusting (amortized bounds)

**Trade-off:** Maintaining balance requires extra work during insert/delete.`
          },
          {
            title: 'AVL Tree Definition',
            content: `**AVL Tree** (Adelson-Velsky and Landis, 1962): A BST where for every node, the heights of left and right subtrees differ by at most 1.

**Balance Factor:**
$$\\text{BF}(x) = \\text{height}(x.\\text{left}) - \\text{height}(x.\\text{right})$$

**AVL Property:** For every node $x$: $\\text{BF}(x) \\in \\{-1, 0, 1\\}$

**Example (valid AVL):**
\`\`\`
        10 (BF=0)
       /  \\
      5    15 (BF=1)
     / \\   /
    3   7 12
\`\`\`

**Example (invalid AVL):**
\`\`\`
        10 (BF=2) ← VIOLATION!
       /
      5
     /
    3
\`\`\`

**Height Bound:**
An AVL tree with $n$ nodes has height $h \\leq 1.44 \\log_2(n+2)$.

**Proof sketch:** Let $N(h)$ = minimum nodes in AVL tree of height $h$.
- $N(0) = 1$, $N(1) = 2$
- $N(h) = N(h-1) + N(h-2) + 1$ (Fibonacci-like)
- $N(h) > \\phi^h$ where $\\phi = (1+\\sqrt{5})/2 \\approx 1.618$
- Therefore $h < \\log_\\phi n \\approx 1.44 \\log_2 n$`
          },
          {
            title: 'AVL Rotations',
            content: `**Rotations** are local operations that preserve BST property while changing tree structure.

**Right Rotation (at node y):**
\`\`\`
      y                x
     / \\              / \\
    x   C    →       A   y
   / \\                  / \\
  A   B                B   C
\`\`\`

**Left Rotation (at node x):**
\`\`\`
    x                  y
   / \\                / \\
  A   y      →       x   C
     / \\            / \\
    B   C          A   B
\`\`\`

**Key Properties:**
- Rotations maintain BST property (inorder unchanged)
- Rotations take $O(1)$ time
- Rotations change heights of affected nodes

**Implementation:**
\`\`\`
rightRotate(y):
    x = y.left
    B = x.right

    x.right = y
    y.left = B

    # Update heights
    y.height = max(height(y.left), height(y.right)) + 1
    x.height = max(height(x.left), height(x.right)) + 1

    return x  # New root of subtree
\`\`\``
          },
          {
            title: 'AVL Rebalancing Cases',
            content: `After insert/delete, check balance factors bottom-up. If $|\\text{BF}| > 1$, rebalance.

**Four cases based on imbalance direction:**

**Case 1: Left-Left (LL)** — BF = +2 and left child has BF ≥ 0
\`\`\`
      z (+2)              y
     /                   / \\
    y (+1 or 0)    →    x   z
   /
  x
\`\`\`
**Fix:** Right rotate at z.

**Case 2: Left-Right (LR)** — BF = +2 and left child has BF = -1
\`\`\`
      z (+2)         z (+2)          x
     /              /               / \\
    y (-1)    →    x          →    y   z
     \\            /
      x          y
\`\`\`
**Fix:** Left rotate at y, then right rotate at z.

**Case 3: Right-Right (RR)** — BF = -2 and right child has BF ≤ 0
\`\`\`
  z (-2)                y
   \\                   / \\
    y (-1 or 0)   →   z   x
     \\
      x
\`\`\`
**Fix:** Left rotate at z.

**Case 4: Right-Left (RL)** — BF = -2 and right child has BF = +1
\`\`\`
  z (-2)       z (-2)         x
   \\            \\           / \\
    y (+1)  →    x     →   z   y
   /              \\
  x                y
\`\`\`
**Fix:** Right rotate at y, then left rotate at z.`
          },
          {
            title: 'AVL Insert and Delete',
            content: `**AVL Insert:**
\`\`\`
insert(node, key):
    # Standard BST insert
    if node == null:
        return new Node(key)
    if key < node.key:
        node.left = insert(node.left, key)
    else:
        node.right = insert(node.right, key)

    # Update height
    node.height = 1 + max(height(node.left), height(node.right))

    # Check balance and rotate if needed
    bf = balanceFactor(node)

    if bf > 1 and key < node.left.key:    # LL
        return rightRotate(node)
    if bf < -1 and key > node.right.key:  # RR
        return leftRotate(node)
    if bf > 1 and key > node.left.key:    # LR
        node.left = leftRotate(node.left)
        return rightRotate(node)
    if bf < -1 and key < node.right.key:  # RL
        node.right = rightRotate(node.right)
        return leftRotate(node)

    return node
\`\`\`

**AVL Delete:** Similar to BST delete, but rebalance on way up.

**Key insight:** After insert, at most 2 rotations needed. After delete, up to $O(\\log n)$ rotations may be needed.

**Time Complexity:**
| Operation | Time |
|-----------|------|
| search | $O(\\log n)$ |
| insert | $O(\\log n)$ |
| delete | $O(\\log n)$ |

All operations are $O(\\log n)$ because height is guaranteed $O(\\log n)$.`
          }
        ],
        practiceProblems: [
          {
            id: 'avl-1',
            problem: `Insert the following keys into an initially empty AVL tree, showing the tree after each insertion and any rotations performed:

$$10, 20, 30, 40, 50, 25$$`,
            solution: `**Insert 10:**
\`\`\`
10
\`\`\`

**Insert 20:**
\`\`\`
10
  \\
   20
\`\`\`
Balanced.

**Insert 30:**
\`\`\`
10 (BF = -2)    →    20
  \\                 /  \\
   20              10   30
     \\
      30
\`\`\`
RR case: Left rotate at 10.

**Insert 40:**
\`\`\`
    20
   /  \\
  10   30
         \\
          40
\`\`\`
Balanced (BF of 30 = -1).

**Insert 50:**
\`\`\`
    20                20
   /  \\              /  \\
  10   30 (BF=-2) → 10   40
         \\              /  \\
          40           30   50
            \\
             50
\`\`\`
RR case at 30: Left rotate at 30.

**Insert 25:**
\`\`\`
    20 (BF = -2)           20                    30
   /  \\                   /  \\                  /  \\
  10   40 (BF = +1)  →   10   30          →    20   40
      /  \\                     \\              /  \\    \\
     30   50                    40           10  25   50
    /                          /  \\
   25                         25   50
\`\`\`
RL case at 20: Right rotate at 40, then left rotate at 20.

**Final AVL tree:**
\`\`\`
        30
       /  \\
      20   40
     /  \\    \\
    10  25   50
\`\`\``
          },
          {
            id: 'avl-2',
            problem: `Prove that an AVL tree with $n$ nodes has height at most $1.44 \\log_2(n + 2) - 0.328$.

*Hint: Find a recurrence for the minimum number of nodes in an AVL tree of height $h$.*`,
            solution: `**Define:** $N(h)$ = minimum number of nodes in an AVL tree of height $h$.

**Base cases:**
- $N(0) = 1$ (single node)
- $N(1) = 2$ (root plus one child)

**Recurrence:** An AVL tree of height $h$ has:
- Root (1 node)
- One subtree of height $h - 1$ (to achieve height $h$)
- One subtree of height at least $h - 2$ (AVL property)

Minimum nodes achieved when second subtree has height exactly $h - 2$:
$$N(h) = N(h-1) + N(h-2) + 1$$

**Solving the recurrence:**

Let $F(h) = N(h) + 1$. Then:
$$F(h) = F(h-1) + F(h-2)$$

This is the Fibonacci recurrence! With $F(0) = 2$, $F(1) = 3$:
$$F(h) = \\frac{\\phi^{h+3} - \\psi^{h+3}}{\\sqrt{5}}$$

where $\\phi = \\frac{1+\\sqrt{5}}{2} \\approx 1.618$ and $\\psi = \\frac{1-\\sqrt{5}}{2}$.

**Bounding height:**

Since $N(h) = F(h) - 1 \\geq \\frac{\\phi^{h+3}}{\\sqrt{5}} - 2$, we have:

$$n \\geq N(h) > \\frac{\\phi^{h+3}}{\\sqrt{5}} - 2$$

$$\\phi^{h+3} < \\sqrt{5}(n + 2)$$

$$h + 3 < \\log_\\phi(\\sqrt{5}(n+2))$$

$$h < \\log_\\phi(n+2) + \\log_\\phi(\\sqrt{5}) - 3$$

Since $\\log_\\phi x = \\frac{\\log_2 x}{\\log_2 \\phi} \\approx 1.44 \\log_2 x$:

$$\\boxed{h < 1.44 \\log_2(n+2) - 0.328}$$`
          },
          {
            id: 'avl-3',
            problem: `Design an algorithm to merge two AVL trees $T_1$ and $T_2$ into a single AVL tree, given that all keys in $T_1$ are smaller than all keys in $T_2$.

What is the time complexity if $T_1$ has $m$ nodes and $T_2$ has $n$ nodes?`,
            solution: `**Algorithm:**

**Step 1:** Extract maximum from $T_1$ (will be root of merged tree)
\`\`\`
max_node = extractMax(T1)  # O(log m)
\`\`\`

**Step 2:** Join $T_1$ (without max) and $T_2$ using max_node as pivot
\`\`\`
merge(T1, T2):
    if T1 empty: return T2
    if T2 empty: return T1

    max_node = extractMax(T1)  # All T1 < max_node < all T2
    return join(T1, max_node, T2)
\`\`\`

**Step 3:** Join operation — attach smaller tree at appropriate height
\`\`\`
join(T1, pivot, T2):
    h1 = height(T1)
    h2 = height(T2)

    if |h1 - h2| <= 1:
        # Can directly combine
        pivot.left = T1
        pivot.right = T2
        return pivot

    if h1 > h2:
        # Walk down right spine of T1
        T1.right = join(T1.right, pivot, T2)
        return rebalance(T1)
    else:
        # Walk down left spine of T2
        T2.left = join(T1, pivot, T2.left)
        return rebalance(T2)
\`\`\`

**Time Complexity:**

- extractMax: $O(\\log m)$
- join walks down the taller tree until heights match
- Number of steps: $|h_1 - h_2| = O(|\\log m - \\log n|)$
- Each step does $O(1)$ work plus possible $O(1)$ rotations

**Total:** $\\boxed{O(\\log m + \\log n) = O(\\log(mn))}$

**Note:** This is much better than the naive $O(m + n)$ approach of extracting all elements and rebuilding!`
          }
        ],
        visualizations: ['AVLTreeVisualizer'],
      },
      // Unit 8: Binary Heaps
      {
        id: 'binary-heaps',
        title: 'Binary Heaps',
        description: 'Priority queue interface, binary heap structure, heapify, and heap sort.',
        sections: [
          {
            title: 'Priority Queue Interface',
            content: `A **Priority Queue** maintains a set of elements, each with a priority (key), supporting:

- \`insert(x)\`: Add element $x$ with its priority
- \`find_max()\`: Return element with highest priority
- \`extract_max()\`: Remove and return element with highest priority

(Can also define min-priority queue with find_min/extract_min)

**Applications:**
- Job scheduling (highest priority job first)
- Dijkstra's shortest path algorithm
- Huffman coding
- Event-driven simulation

**Implementation Comparison:**

| Structure | insert | find_max | extract_max |
|-----------|--------|----------|-------------|
| Unsorted Array | $O(1)$ | $O(n)$ | $O(n)$ |
| Sorted Array | $O(n)$ | $O(1)$ | $O(1)$ |
| Balanced BST | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ |
| **Binary Heap** | $O(\\log n)$ | $O(1)$ | $O(\\log n)$ |

Binary heap offers the best combination for priority queue operations.`
          },
          {
            title: 'Binary Heap Structure',
            content: `A **(max) Binary Heap** is a complete binary tree satisfying the **heap property**:
$$\\text{For every node } x: \\text{key}(x) \\geq \\text{key}(\\text{children of } x)$$

**Consequences:**
- Maximum element is always at the root
- Path from any node to root is in decreasing order

**Array Representation:**
Store complete binary tree in array level by level:
\`\`\`
        90
       /  \\
      85   70
     / \\   / \\
    50 80 60 65
\`\`\`
Array: [90, 85, 70, 50, 80, 60, 65]
Index:   0   1   2   3   4   5   6

**Parent-Child Relationships (0-indexed):**
- Parent of node $i$: $\\lfloor (i-1)/2 \\rfloor$
- Left child of node $i$: $2i + 1$
- Right child of node $i$: $2i + 2$

**1-indexed (often simpler):**
- Parent: $\\lfloor i/2 \\rfloor$
- Left child: $2i$
- Right child: $2i + 1$

**Key advantage:** No explicit pointers needed! Complete binary tree ↔ contiguous array.`
          },
          {
            title: 'Heap Operations: Insert and Extract-Max',
            content: `**Insert (Swim Up / Bubble Up):**
1. Add new element at the end (next available position)
2. "Swim up": while element > parent, swap with parent

\`\`\`
insert(heap, key):
    heap.append(key)
    swimUp(heap, len(heap) - 1)

swimUp(heap, i):
    while i > 0 and heap[i] > heap[parent(i)]:
        swap(heap[i], heap[parent(i)])
        i = parent(i)
\`\`\`
Time: $O(\\log n)$ — at most height swaps.

**Extract-Max (Sink Down / Bubble Down):**
1. Save the root (max element)
2. Move last element to root
3. "Sink down": while element < larger child, swap with larger child

\`\`\`
extractMax(heap):
    max = heap[0]
    heap[0] = heap.pop()  # Move last to root
    sinkDown(heap, 0)
    return max

sinkDown(heap, i):
    while True:
        largest = i
        left = 2*i + 1
        right = 2*i + 2

        if left < len(heap) and heap[left] > heap[largest]:
            largest = left
        if right < len(heap) and heap[right] > heap[largest]:
            largest = right

        if largest == i:
            break
        swap(heap[i], heap[largest])
        i = largest
\`\`\`
Time: $O(\\log n)$ — at most height swaps.`
          },
          {
            title: 'Building a Heap: Heapify',
            content: `**Problem:** Given an unsorted array, convert it to a valid heap.

**Naive approach:** Insert elements one by one.
Time: $n \\times O(\\log n) = O(n \\log n)$

**Better approach (Bottom-up Heapify):**
1. Leaves are already valid heaps
2. Process nodes from bottom to top, calling sinkDown on each

\`\`\`
buildHeap(A):
    n = len(A)
    # Start from last non-leaf node
    for i = n/2 - 1 downto 0:
        sinkDown(A, i)
\`\`\`

**Time Analysis:**

At height $h$, there are at most $\\lceil n/2^{h+1} \\rceil$ nodes, each requiring $O(h)$ work.

$$T(n) = \\sum_{h=0}^{\\log n} \\frac{n}{2^{h+1}} \\cdot O(h) = O\\left(n \\sum_{h=0}^{\\log n} \\frac{h}{2^h}\\right)$$

Using $\\sum_{h=0}^{\\infty} \\frac{h}{2^h} = 2$:

$$T(n) = O(n)$$

**Surprising result:** Building a heap is $O(n)$, not $O(n \\log n)$!

**Intuition:** Most nodes are near the bottom and require little work. Few nodes are near the top and require more work.`
          },
          {
            title: 'Heap Sort',
            content: `**Heap Sort Algorithm:**
1. Build a max-heap from the array: $O(n)$
2. Repeatedly extract max and place at end: $O(n \\log n)$

\`\`\`
heapSort(A):
    n = len(A)

    # Build max-heap
    buildHeap(A)

    # Extract elements one by one
    for i = n-1 downto 1:
        swap(A[0], A[i])    # Move max to sorted portion
        heapSize -= 1        # Reduce heap size
        sinkDown(A, 0)       # Restore heap property
\`\`\`

**Analysis:**
- Build heap: $O(n)$
- $n$ extract-max operations: $O(n \\log n)$
- Total: $O(n \\log n)$

**Properties of Heap Sort:**

| Property | Value |
|----------|-------|
| Time (worst) | $O(n \\log n)$ |
| Time (average) | $O(n \\log n)$ |
| Time (best) | $O(n \\log n)$ |
| Space | $O(1)$ — in-place! |
| Stable | No |

**Comparison with other sorts:**
- Unlike merge sort: $O(1)$ space
- Unlike quicksort: $O(n \\log n)$ guaranteed
- Unlike both: not stable

**In practice:** Often slower than quicksort due to poor cache behavior (jumping around array).`
          }
        ],
        practiceProblems: [
          {
            id: 'heap-1',
            problem: `Starting with an empty max-heap, insert the following keys in order: 15, 10, 20, 17, 25, 8, 12.

Then perform two extract-max operations.

Draw the heap after each step.`,
            solution: `**Insert 15:**
\`\`\`
[15]
\`\`\`

**Insert 10:**
\`\`\`
    15
   /
  10
[15, 10]
\`\`\`

**Insert 20:** (swim up: 20 > 15)
\`\`\`
    20
   /  \\
  10   15
[20, 10, 15]
\`\`\`

**Insert 17:** (swim up: 17 > 10)
\`\`\`
    20
   /  \\
  17   15
 /
10
[20, 17, 15, 10]
\`\`\`

**Insert 25:** (swim up: 25 > 17 > 20)
\`\`\`
    25
   /  \\
  20   15
 / \\
10  17
[25, 20, 15, 10, 17]
\`\`\`

**Insert 8:**
\`\`\`
    25
   /  \\
  20   15
 / \\  /
10 17 8
[25, 20, 15, 10, 17, 8]
\`\`\`

**Insert 12:**
\`\`\`
    25
   /  \\
  20   15
 / \\  / \\
10 17 8  12
[25, 20, 15, 10, 17, 8, 12]
\`\`\`

**Extract-max (25):** Move 12 to root, sink down.
\`\`\`
    20
   /  \\
  17   15
 / \\  /
10 12 8
[20, 17, 15, 10, 12, 8]
\`\`\`

**Extract-max (20):** Move 8 to root, sink down.
\`\`\`
    17
   /  \\
  12   15
 / \\
10  8
[17, 12, 15, 10, 8]
\`\`\``
          },
          {
            id: 'heap-2',
            problem: `Design a data structure that supports the following operations, all in $O(\\log n)$ time:

- \`insert(x)\`: Add element $x$
- \`findMin()\`: Return the minimum element
- \`findMax()\`: Return the maximum element
- \`deleteMin()\`: Remove and return the minimum
- \`deleteMax()\`: Remove and return the maximum

*Hint: Use two heaps.*`,
            solution: `**Solution: Min-Max Heap or Double Heap**

**Approach 1: Two Heaps with Cross-References**

Maintain:
- Min-heap $H_{min}$ for min operations
- Max-heap $H_{max}$ for max operations
- Each element has pointers to its positions in both heaps

**insert(x):**
\`\`\`
pos_min = Hmin.insert(x)
pos_max = Hmax.insert(x)
x.min_pos = pos_min
x.max_pos = pos_max
\`\`\`
Time: $O(\\log n)$

**findMin():** Return $H_{min}$.root — $O(1)$

**findMax():** Return $H_{max}$.root — $O(1)$

**deleteMin():**
\`\`\`
x = Hmin.extractMin()
# Also remove x from Hmax using its stored position
Hmax.delete(x.max_pos)
return x
\`\`\`
Time: $O(\\log n)$ for each heap operation

**deleteMax():** Symmetric to deleteMin.

**Space:** $O(n)$ for each heap, total $O(n)$.

**Approach 2: Min-Max Heap**

A specialized heap where:
- Even levels (0, 2, 4, ...) follow min-heap property
- Odd levels (1, 3, 5, ...) follow max-heap property

- Minimum is at root
- Maximum is among root's children

All operations: $O(\\log n)$

$$\\boxed{\\text{Both approaches achieve } O(\\log n) \\text{ for all operations}}$$`
          },
          {
            id: 'heap-3',
            problem: `Given $k$ sorted arrays, each of size $n$, design an algorithm to find the $k$-th smallest element among all $kn$ elements.

Analyze the time and space complexity.`,
            solution: `**Key Insight:** Use a min-heap to track the smallest unprocessed element from each array.

**Algorithm:**
\`\`\`
kthSmallest(arrays, k):
    # Min-heap stores (value, array_index, element_index)
    heap = MinHeap()

    # Initialize with first element of each array
    for i = 0 to k-1:
        heap.insert((arrays[i][0], i, 0))

    # Extract minimum k times
    for count = 1 to k:
        (val, arr_idx, elem_idx) = heap.extractMin()

        if count == k:
            return val

        # Add next element from same array if exists
        if elem_idx + 1 < n:
            heap.insert((arrays[arr_idx][elem_idx + 1], arr_idx, elem_idx + 1))

    return val
\`\`\`

**Correctness:**
- Heap always contains smallest unprocessed element from each array
- Extracting minimum $k$ times gives us elements in sorted order
- $k$-th extraction is the $k$-th smallest

**Time Complexity:**
- Initialize heap: $O(k)$ (insert $k$ elements into empty heap)
- $k$ iterations, each with extractMin + insert: $O(k \\cdot \\log k)$
- Total: $\\boxed{O(k \\log k)}$

**Space Complexity:**
- Heap stores at most $k$ elements: $\\boxed{O(k)}$

**Note:** This is better than:
- Merge all arrays first: $O(kn \\log k)$
- Sort all elements: $O(kn \\log(kn))$

For finding $k$-th smallest, we only need $O(k \\log k)$ time regardless of array sizes!`
          }
        ],
        visualizations: ['HeapVisualizer'],
      },
      // Unit 9: Breadth-First Search
      {
        id: 'bfs',
        title: 'Breadth-First Search',
        description: 'Graph representation, BFS algorithm, shortest paths in unweighted graphs.',
        sections: [
          {
            title: 'Graph Representations',
            content: `A **graph** $G = (V, E)$ consists of:
- $V$: set of **vertices** (nodes)
- $E$: set of **edges** (connections between vertices)

**Types of Graphs:**
- **Undirected:** Edges have no direction $(u, v) = (v, u)$
- **Directed:** Edges have direction $(u, v) \\neq (v, u)$
- **Weighted:** Edges have associated weights

**Adjacency List Representation:**
Store a list of neighbors for each vertex.
\`\`\`
0: [1, 2]
1: [0, 2, 3]
2: [0, 1]
3: [1]
\`\`\`
Space: $O(V + E)$

**Adjacency Matrix Representation:**
$n \\times n$ matrix $A$ where $A[i][j] = 1$ if edge $(i, j)$ exists.
\`\`\`
    0 1 2 3
0 [ 0 1 1 0 ]
1 [ 1 0 1 1 ]
2 [ 1 1 0 0 ]
3 [ 0 1 0 0 ]
\`\`\`
Space: $O(V^2)$

**Comparison:**

| Operation | Adj List | Adj Matrix |
|-----------|----------|------------|
| Space | $O(V + E)$ | $O(V^2)$ |
| Check edge $(u,v)$ | $O(\\deg(u))$ | $O(1)$ |
| Iterate neighbors | $O(\\deg(u))$ | $O(V)$ |
| Add edge | $O(1)$ | $O(1)$ |

**Use adjacency list** for sparse graphs ($E \\ll V^2$).
**Use adjacency matrix** for dense graphs or frequent edge queries.`
          },
          {
            title: 'Breadth-First Search Algorithm',
            content: `**BFS** explores a graph level by level, visiting all vertices at distance $d$ before distance $d+1$.

**Algorithm:**
\`\`\`
BFS(G, s):
    for each vertex v in V:
        v.color = WHITE      # Unvisited
        v.dist = ∞
        v.parent = null

    s.color = GRAY          # Discovered
    s.dist = 0

    Q = empty queue
    Q.enqueue(s)

    while Q not empty:
        u = Q.dequeue()
        for each v in Adj[u]:
            if v.color == WHITE:
                v.color = GRAY
                v.dist = u.dist + 1
                v.parent = u
                Q.enqueue(v)
        u.color = BLACK     # Finished
\`\`\`

**Key Properties:**
- Vertices are discovered in order of distance from source
- \`v.dist\` = shortest path length from $s$ to $v$ (in unweighted graph)
- \`v.parent\` forms a **BFS tree** (shortest path tree)

**Time Complexity:** $O(V + E)$
- Each vertex enqueued/dequeued at most once: $O(V)$
- Each edge examined at most twice (once per endpoint): $O(E)$

**Space Complexity:** $O(V)$ for queue and vertex attributes.`
          },
          {
            title: 'BFS for Shortest Paths',
            content: `**Theorem:** BFS finds shortest paths in unweighted graphs.

After BFS from source $s$:
- \`v.dist\` = length of shortest path from $s$ to $v$
- \`v.dist = ∞\` if $v$ is unreachable from $s$

**Proof Sketch:**

**Lemma 1:** For any edge $(u, v)$: $v.dist \\leq u.dist + 1$

**Lemma 2:** When $v$ is enqueued, $v.dist$ equals the shortest path distance.

**Induction:** Vertices are discovered in non-decreasing order of distance.

**Reconstructing the Path:**
\`\`\`
printPath(s, v):
    if v == s:
        print(s)
    else if v.parent == null:
        print("No path exists")
    else:
        printPath(s, v.parent)
        print(v)
\`\`\`

**Example:**
\`\`\`
Graph:       BFS from A:
A---B        A: dist=0
|   |        B: dist=1, parent=A
C---D        C: dist=1, parent=A
    |        D: dist=2, parent=B or C
    E        E: dist=3, parent=D
\`\`\`

**Applications:**
- Finding shortest paths in unweighted graphs
- Testing connectivity
- Finding connected components
- Testing bipartiteness`
          },
          {
            title: 'BFS Applications',
            content: `**1. Connected Components (Undirected Graph):**
\`\`\`
findComponents(G):
    component = 0
    for each vertex v:
        if v.color == WHITE:
            BFS(G, v)
            component += 1
            # All vertices reached have same component
\`\`\`
Time: $O(V + E)$

**2. Bipartiteness Testing:**
A graph is **bipartite** if vertices can be 2-colored such that no edge connects same colors.

\`\`\`
isBipartite(G, s):
    BFS with modification:
    when discovering v from u:
        v.color = opposite of u.color
        if any neighbor has same color: return false
    return true
\`\`\`

**Key insight:** Graph is bipartite ↔ no odd-length cycles.

**3. Level Structure:**
BFS naturally partitions vertices into levels:
- Level 0: $\\{s\\}$
- Level $i$: vertices at distance $i$ from $s$

**4. Web Crawling:**
- Start from seed URLs
- BFS explores pages level by level
- Discovers pages closer to seed first

**5. Social Network Analysis:**
- Degrees of separation
- Finding friends within $k$ hops`
          },
          {
            title: 'BFS vs DFS',
            content: `**Comparison:**

| Property | BFS | DFS |
|----------|-----|-----|
| Data structure | Queue (FIFO) | Stack (LIFO) |
| Order | Level by level | Go deep first |
| Shortest path | Yes (unweighted) | No |
| Space | $O(V)$ worst case | $O(V)$ worst case |
| Memory for tree | Higher (wide) | Lower (deep) |

**When to use BFS:**
- Finding shortest path (unweighted)
- Level-order traversal
- Finding nodes within distance $k$
- Testing bipartiteness
- Minimum spanning tree (unweighted)

**When to use DFS:**
- Topological sort
- Detecting cycles
- Finding strongly connected components
- Maze solving (finding any path)
- Generating permutations/combinations

**Memory Comparison:**
For a tree of branching factor $b$ and depth $d$:
- BFS: $O(b^d)$ — stores entire level
- DFS: $O(d)$ — stores only current path

For wide, shallow graphs: DFS uses less memory.
For deep, narrow graphs: BFS uses less memory.`
          }
        ],
        practiceProblems: [
          {
            id: 'bfs-1',
            problem: `Run BFS on the following graph starting from vertex A. Show the order in which vertices are discovered and the final BFS tree.

\`\`\`
    A --- B --- C
    |     |     |
    D --- E --- F
          |
          G
\`\`\`

Also give the shortest path from A to G.`,
            solution: `**BFS from A:**

**Initialization:**
- Queue: [A]
- A.dist = 0

**Step 1:** Dequeue A, explore neighbors B, D
- Queue: [B, D]
- B.dist = 1, B.parent = A
- D.dist = 1, D.parent = A

**Step 2:** Dequeue B, explore neighbors C, E (A already visited)
- Queue: [D, C, E]
- C.dist = 2, C.parent = B
- E.dist = 2, E.parent = B

**Step 3:** Dequeue D, explore neighbors E (A already visited, E already discovered)
- Queue: [C, E]

**Step 4:** Dequeue C, explore neighbors F (B already visited)
- Queue: [E, F]
- F.dist = 3, F.parent = C

**Step 5:** Dequeue E, explore neighbors G (B, D, F already visited/discovered)
- Queue: [F, G]
- G.dist = 3, G.parent = E

**Step 6:** Dequeue F (C, E already visited)
**Step 7:** Dequeue G (E already visited)

**Discovery order:** $\\boxed{A, B, D, C, E, F, G}$

**BFS Tree:**
\`\`\`
      A (0)
     / \\
   B(1) D(1)
   / \\
 C(2) E(2)
 |     |
F(3)  G(3)
\`\`\`

**Shortest path A to G:**
Trace parents: G ← E ← B ← A

$$\\boxed{A \\to B \\to E \\to G}$$ (length 3)`
          },
          {
            id: 'bfs-2',
            problem: `Given an $m \\times n$ grid where each cell is either land (1) or water (0), find the shortest path from the top-left corner to the bottom-right corner, moving only through land cells (4-directional movement).

Return -1 if no path exists.

Design an algorithm and analyze its complexity.`,
            solution: `**Algorithm: BFS on Grid**

\`\`\`
shortestPath(grid):
    m, n = grid dimensions

    if grid[0][0] == 0 or grid[m-1][n-1] == 0:
        return -1  # Start or end is water

    # Directions: up, down, left, right
    dirs = [(-1,0), (1,0), (0,-1), (0,1)]

    queue = [(0, 0, 1)]  # (row, col, distance)
    visited = set((0, 0))

    while queue not empty:
        (r, c, dist) = queue.dequeue()

        if r == m-1 and c == n-1:
            return dist  # Reached destination

        for (dr, dc) in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n:
                if grid[nr][nc] == 1 and (nr, nc) not in visited:
                    visited.add((nr, nc))
                    queue.enqueue((nr, nc, dist + 1))

    return -1  # No path found
\`\`\`

**Correctness:**
- BFS explores cells in order of distance from source
- First time we reach destination is via shortest path
- Only land cells are visited

**Time Complexity:**
- Each cell visited at most once
- Each cell has at most 4 neighbors
- Total: $\\boxed{O(mn)}$

**Space Complexity:**
- Queue can hold all cells: $O(mn)$
- Visited set: $O(mn)$
- Total: $\\boxed{O(mn)}$

**Example:**
\`\`\`
1 1 0 1
1 1 1 0
0 1 1 1
1 0 1 1

Shortest path: (0,0)→(0,1)→(1,1)→(1,2)→(2,2)→(2,3)→(3,3)
Length: 7
\`\`\``
          },
          {
            id: 'bfs-3',
            problem: `In a social network, the **degree of separation** between two people is the length of the shortest path between them.

Design a data structure and algorithm to efficiently answer queries: "What is the degree of separation between persons $u$ and $v$?"

Consider both:
**(a)** Single query
**(b)** Many queries on the same graph`,
            solution: `**(a) Single Query:**

Use standard BFS from $u$ to find shortest path to $v$.

\`\`\`
degreeOfSeparation(G, u, v):
    if u == v: return 0
    return BFS(G, u, v).dist  # -1 if unreachable
\`\`\`

**Time:** $O(V + E)$ per query
**Space:** $O(V)$

**(b) Many Queries - Preprocessing:**

**Approach 1: All-Pairs BFS**
Precompute all pairwise distances.

\`\`\`
preprocess(G):
    dist = V × V matrix
    for each vertex s:
        BFS(G, s)  # Sets dist[s][v] for all v
    return dist

query(u, v):
    return dist[u][v]  # O(1)
\`\`\`

- Preprocessing: $O(V(V + E))$
- Space: $O(V^2)$
- Query: $O(1)$

**Approach 2: Bidirectional BFS (for single query optimization)**

Run BFS from both $u$ and $v$ simultaneously, stop when they meet.

\`\`\`
bidirectionalBFS(G, u, v):
    forwardQ = {u}, backwardQ = {v}
    forwardDist[u] = 0, backwardDist[v] = 0

    while forwardQ and backwardQ not empty:
        # Expand smaller frontier
        if |forwardQ| < |backwardQ|:
            expand forward one level
            if any node in backwardQ found:
                return forwardDist[node] + backwardDist[node]
        else:
            expand backward one level
            if any node in forwardQ found:
                return forwardDist[node] + backwardDist[node]

    return -1
\`\`\`

**Time:** $O(b^{d/2})$ vs $O(b^d)$ for regular BFS
(where $b$ = branching factor, $d$ = distance)

**Approach 3: Landmarks (for approximate queries)**
- Precompute distances from $k$ landmark vertices
- Approximate $d(u,v) \\approx \\min_L(d(u,L) + d(L,v))$

$$\\boxed{\\text{Choose approach based on query frequency and accuracy needs}}$$`
          }
        ],
        visualizations: ['BFSVisualizer'],
      },
      // Unit 10: Depth-First Search
      {
        id: 'dfs',
        title: 'Depth-First Search',
        description: 'DFS algorithm, edge classification, cycle detection, and topological sort.',
        sections: [
          {
            title: 'DFS Algorithm Overview',
            content: `## Depth-First Search (DFS)

DFS explores as far as possible along each branch before backtracking. Unlike BFS which explores level-by-level, DFS goes deep first.

### Vertex Colors

DFS uses three colors to track vertex state:

| Color | Meaning | Time Interval |
|-------|---------|---------------|
| **White** | Undiscovered | Before $d[v]$ |
| **Gray** | Discovered, in progress | $[d[v], f[v]]$ |
| **Black** | Finished | After $f[v]$ |

### Discovery and Finish Times

Each vertex $v$ has two timestamps:
- **$d[v]$** (discovery time): When $v$ is first discovered (turns gray)
- **$f[v]$** (finish time): When $v$ is finished (turns black)

**Parenthesis Theorem:** For any vertices $u, v$, exactly one of these holds:
1. $[d[u], f[u]]$ and $[d[v], f[v]]$ are entirely disjoint
2. $[d[u], f[u]]$ is entirely contained in $[d[v], f[v]]$ (or vice versa)

### DFS Pseudocode

\`\`\`
DFS(G):
    for each vertex u in V:
        color[u] = WHITE
        parent[u] = NIL
    time = 0
    for each vertex u in V:
        if color[u] == WHITE:
            DFS-Visit(G, u)

DFS-Visit(G, u):
    time = time + 1
    d[u] = time          # Discovery time
    color[u] = GRAY
    for each v in Adj[u]:
        if color[v] == WHITE:
            parent[v] = u
            DFS-Visit(G, v)
    color[u] = BLACK
    time = time + 1
    f[u] = time          # Finish time
\`\`\`

$$\\boxed{\\text{Time Complexity: } O(V + E)}$$`
          },
          {
            title: 'Edge Classification',
            content: `## Edge Classification in DFS

DFS classifies edges based on the state of vertices when the edge is explored:

### Edge Types

| Edge Type | Definition | Detection |
|-----------|------------|-----------|
| **Tree Edge** | Edge to a white vertex | $color[v] = \\text{WHITE}$ |
| **Back Edge** | Edge to a gray ancestor | $color[v] = \\text{GRAY}$ |
| **Forward Edge** | Non-tree edge to a descendant | $color[v] = \\text{BLACK}$ and $d[u] < d[v]$ |
| **Cross Edge** | All other edges | $color[v] = \\text{BLACK}$ and $d[u] > d[v]$ |

### Undirected Graphs

In undirected graphs, there are only **tree edges** and **back edges**:
- No forward or cross edges exist
- Every non-tree edge connects an ancestor to a descendant

### Back Edges and Cycles

**Key Theorem:** A directed graph has a cycle if and only if DFS discovers a back edge.

\`\`\`
hasCycle(G):
    Run DFS on G
    return (back edge was found)
\`\`\`

**Proof:**
- **If back edge $(u, v)$ exists:** $v$ is an ancestor of $u$, so path $v \\leadsto u$ exists in DFS tree. With edge $(u, v)$, we have a cycle.
- **If cycle exists:** Let $v$ be the first vertex discovered in the cycle. Some vertex $u$ in the cycle has edge $(u, v)$, and $v$ is gray when exploring this edge (back edge).

$$\\boxed{\\text{Cycle Detection: } O(V + E)}$$`
          },
          {
            title: 'Topological Sort',
            content: `## Topological Sort

A **topological sort** of a DAG (Directed Acyclic Graph) is a linear ordering of vertices such that for every edge $(u, v)$, vertex $u$ appears before $v$.

### Algorithm Using DFS

\`\`\`
TopologicalSort(G):
    Run DFS(G)
    Output vertices in decreasing order of finish time f[v]
\`\`\`

**Implementation with a Stack:**
\`\`\`
TopologicalSort(G):
    for each vertex u in V:
        color[u] = WHITE
    S = empty stack

    for each vertex u in V:
        if color[u] == WHITE:
            DFS-Visit-Topo(G, u, S)

    return S  # Pop to get topological order

DFS-Visit-Topo(G, u, S):
    color[u] = GRAY
    for each v in Adj[u]:
        if color[v] == WHITE:
            DFS-Visit-Topo(G, v, S)
        else if color[v] == GRAY:
            # Back edge found - not a DAG!
            error "Graph has a cycle"
    color[u] = BLACK
    S.push(u)  # Add to front of order when finished
\`\`\`

### Correctness

**Claim:** For edge $(u, v)$, we have $f[u] > f[v]$.

**Proof:** When exploring $(u, v)$:
- If $v$ is white: $v$ becomes a descendant, so $f[v] < f[u]$
- If $v$ is black: $v$ already finished, so $f[v] < f[u]$
- If $v$ is gray: Back edge → cycle → not a DAG

### Applications

1. **Task scheduling** with dependencies
2. **Build systems** (Makefile ordering)
3. **Course prerequisites**
4. **Compilation order** for modules

$$\\boxed{\\text{Topological Sort runs in } O(V + E)}$$`
          },
          {
            title: 'Strongly Connected Components',
            content: `## Strongly Connected Components (SCCs)

A **strongly connected component** is a maximal set of vertices such that every vertex is reachable from every other vertex.

### Kosaraju's Algorithm

Two-pass DFS algorithm:

\`\`\`
Kosaraju(G):
    # Pass 1: Compute finish times
    Run DFS on G, compute finish times f[v]

    # Pass 2: Process in reverse finish order
    Compute G^T (transpose graph)
    for each vertex u in decreasing order of f[u]:
        if u not visited:
            DFS-Visit(G^T, u)  # Each tree is an SCC
\`\`\`

### Why It Works

**Key Insight:** If we process vertices of $G^T$ in decreasing finish time order from the first DFS, each DFS tree in pass 2 forms exactly one SCC.

**Component Graph:** The DAG of SCCs:
- Vertices: SCCs $C_1, C_2, \\ldots, C_k$
- Edge $(C_i, C_j)$ if edge exists from some $u \\in C_i$ to some $v \\in C_j$

### Tarjan's Algorithm (Single Pass)

Uses a stack and low-link values:
- $low[v]$ = smallest discovery time reachable from $v$'s subtree
- SCC root: vertex where $low[v] = d[v]$

\`\`\`
Tarjan(G):
    index = 0
    S = empty stack
    for each vertex v:
        if v.index undefined:
            strongconnect(v)

strongconnect(v):
    v.index = v.lowlink = index++
    S.push(v)
    v.onStack = true

    for each (v, w) in E:
        if w.index undefined:
            strongconnect(w)
            v.lowlink = min(v.lowlink, w.lowlink)
        else if w.onStack:
            v.lowlink = min(v.lowlink, w.index)

    if v.lowlink == v.index:
        # v is root of SCC
        repeat:
            w = S.pop()
            w.onStack = false
            add w to current SCC
        until w == v
\`\`\`

$$\\boxed{\\text{Both algorithms: } O(V + E)}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'dfs-1',
            problem: `**Edge Classification**

Given a directed graph, classify each edge after running DFS starting from vertex A.

*Hint: Track vertex colors: white (undiscovered), gray (in progress), black (finished).*`,
            solution: `**Edge Classification Rules:**

When exploring edge $(u, v)$:
- **Tree edge:** $v$ is white (undiscovered)
- **Back edge:** $v$ is gray (ancestor in current path)
- **Forward edge:** $v$ is black and $d[u] < d[v]$ (descendant)
- **Cross edge:** $v$ is black and $d[u] > d[v]$ (neither ancestor nor descendant)

**Key insight:** In undirected graphs, only tree and back edges exist.`
          },
          {
            id: 'dfs-2',
            problem: `**Cycle Detection**

Write an algorithm to detect if a directed graph contains a cycle.

*Hint: A back edge indicates a cycle.*`,
            solution: `**Algorithm:**
\`\`\`
hasCycle(G):
    for each vertex v:
        color[v] = WHITE

    for each vertex v:
        if color[v] == WHITE:
            if DFS-Cycle(v):
                return true
    return false

DFS-Cycle(u):
    color[u] = GRAY
    for each v in Adj[u]:
        if color[v] == GRAY:
            return true  # Back edge = cycle
        if color[v] == WHITE and DFS-Cycle(v):
            return true
    color[u] = BLACK
    return false
\`\`\`

**Time:** $O(V + E)$`
          },
          {
            id: 'dfs-3',
            problem: `**Topological Sort Validity**

Prove that decreasing finish time order gives a valid topological sort.

*Hint: Show that for every edge (u,v), f[u] > f[v].*`,
            solution: `**Proof:**

For any edge $(u, v)$ in a DAG:

When we explore edge $(u, v)$ during DFS:

**Case 1:** $v$ is white
- We recursively visit $v$
- $v$ finishes before $u$
- Therefore $f[v] < f[u]$ ✓

**Case 2:** $v$ is black
- $v$ already finished
- Therefore $f[v] < f[u]$ ✓

**Case 3:** $v$ is gray
- This would be a back edge
- But DAGs have no cycles
- This case is impossible ✓

**Conclusion:** For every edge $(u, v)$: $f[u] > f[v]$

So decreasing finish time order respects all edges → valid topological sort.`
          }
        ],
        visualizations: ['DFSVisualizer'],
      },
      // Unit 11: Weighted Shortest Paths
      {
        id: 'weighted-shortest-paths',
        title: 'Weighted Shortest Paths',
        description: 'Weighted graphs, DAG relaxation, and shortest path properties.',
        sections: [
          {
            title: 'Weighted Graphs and Shortest Paths',
            content: `## Weighted Graphs

A **weighted graph** $G = (V, E, w)$ has a weight function $w: E \\to \\mathbb{R}$ assigning a real number to each edge.

### Shortest Path Problem

Given a weighted directed graph and source vertex $s$:
- **Single-source shortest paths (SSSP):** Find shortest paths from $s$ to all vertices
- **Single-pair:** Find shortest path from $s$ to specific target $t$
- **All-pairs shortest paths (APSP):** Find shortest paths between all pairs

### Path Weight

For path $p = \\langle v_0, v_1, \\ldots, v_k \\rangle$:

$$w(p) = \\sum_{i=1}^{k} w(v_{i-1}, v_i)$$

### Shortest Path Weight

$$\\delta(u, v) = \\begin{cases} \\min\\{w(p) : u \\overset{p}{\\leadsto} v\\} & \\text{if path exists} \\\\ \\infty & \\text{otherwise} \\end{cases}$$

### Negative Edges

- **Negative edges allowed:** Some algorithms handle them (Bellman-Ford)
- **Negative cycles:** If reachable from source, shortest path is $-\\infty$

$$\\boxed{\\text{Negative cycle} \\Rightarrow \\delta(s, v) = -\\infty \\text{ for affected vertices}}$$`
          },
          {
            title: 'Optimal Substructure',
            content: `## Optimal Substructure of Shortest Paths

Shortest paths exhibit **optimal substructure**: subpaths of shortest paths are shortest paths.

### Theorem

Let $p = \\langle v_0, v_1, \\ldots, v_k \\rangle$ be a shortest path from $v_0$ to $v_k$.

For any $0 \\leq i \\leq j \\leq k$, the subpath $p_{ij} = \\langle v_i, v_{i+1}, \\ldots, v_j \\rangle$ is a shortest path from $v_i$ to $v_j$.

### Proof (Cut-and-Paste)

Suppose $p_{ij}$ is not a shortest path. Then there exists a shorter path $p'_{ij}$ from $v_i$ to $v_j$.

Replace $p_{ij}$ with $p'_{ij}$ in $p$ to get path $p'$:
$$w(p') = w(p_{0i}) + w(p'_{ij}) + w(p_{jk}) < w(p_{0i}) + w(p_{ij}) + w(p_{jk}) = w(p)$$

This contradicts $p$ being a shortest path. ∎

### Corollary: Prefix Property

If $p = \\langle s, \\ldots, u, v \\rangle$ is a shortest $s \\leadsto v$ path:
- $p' = \\langle s, \\ldots, u \\rangle$ is a shortest $s \\leadsto u$ path
- $\\delta(s, v) = \\delta(s, u) + w(u, v)$

$$\\boxed{\\text{Optimal substructure enables dynamic programming approaches}}$$`
          },
          {
            title: 'The Relaxation Framework',
            content: `## Edge Relaxation

The foundation of all shortest path algorithms is the **relax** operation.

### The Relax Operation

For edge $(u, v)$ with weight $w(u, v)$:

\`\`\`
Relax(u, v, w):
    if d[v] > d[u] + w(u, v):
        d[v] = d[u] + w(u, v)
        π[v] = u
\`\`\`

**Intuition:** If we can improve the path to $v$ by going through $u$, do it.

### Properties of Relaxation

**Triangle Inequality:**
$$\\delta(s, v) \\leq \\delta(s, u) + w(u, v)$$

**Upper-Bound Property:**
We always have $d[v] \\geq \\delta(s, v)$, and once $d[v] = \\delta(s, v)$, it never changes.

**Convergence Property:**
If $s \\leadsto u \\to v$ is a shortest path and $d[u] = \\delta(s, u)$ before relaxing $(u, v)$, then $d[v] = \\delta(s, v)$ afterward.

**Path-Relaxation Property:**
If $p = \\langle v_0, v_1, \\ldots, v_k \\rangle$ is a shortest path and we relax edges in the order $(v_0, v_1), (v_1, v_2), \\ldots, (v_{k-1}, v_k)$ (possibly with other relaxations interspersed), then $d[v_k] = \\delta(s, v_k)$.

$$\\boxed{\\text{Different algorithms = Different relaxation orders}}$$`
          },
          {
            title: 'DAG Shortest Paths',
            content: `## Shortest Paths in DAGs

For DAGs, we can find shortest paths in **linear time** using topological sort.

### Algorithm

\`\`\`
DAG-Shortest-Paths(G, s):
    Topologically sort vertices of G
    Initialize-Single-Source(G, s)
    for each vertex u in topological order:
        for each vertex v in Adj[u]:
            Relax(u, v, w)
\`\`\`

### Why It Works

Topological order ensures that when we process vertex $u$:
- All predecessors of $u$ have already been processed
- $d[u]$ already equals $\\delta(s, u)$
- Relaxing outgoing edges gives correct distances to successors

### Analysis

| Operation | Time |
|-----------|------|
| Topological sort | $O(V + E)$ |
| Initialization | $O(V)$ |
| Relaxation (each edge once) | $O(E)$ |
| **Total** | $O(V + E)$ |

### Handling Negative Edges

DAG shortest paths works correctly with **negative edge weights** (as long as there are no cycles, which DAGs don't have by definition).

### Applications

- **Critical path analysis** in project scheduling
- **Longest path** in DAGs (negate weights)
- **Dependency resolution**

$$\\boxed{\\text{DAG SSSP: } O(V + E)}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'wsp-1',
            problem: `**Relaxation Sequence**

Show the order of relaxations needed to find shortest paths in a given DAG.

*Hint: Use topological order to determine relaxation sequence.*`,
            solution: `**Algorithm:**
1. Topologically sort: Get order like $[A, B, C, D, E]$
2. Process each vertex in order:
   - For $A$: Relax all edges $(A, x)$
   - For $B$: Relax all edges $(B, x)$
   - Continue...

**Key insight:** After processing $u$, we have $d[u] = \\delta(s, u)$.

**Why:** All paths to $u$ come from earlier vertices (topological order), which have already been processed.`
          },
          {
            id: 'wsp-2',
            problem: `**Negative Edge Handling**

Explain why DAG shortest paths works with negative edges but Dijkstra does not.

*Hint: Consider the role of cycles and revisiting vertices.*`,
            solution: `**DAG works with negative edges because:**
1. No cycles → no negative cycles
2. Topological order ensures we process each vertex once
3. When processing $u$, all predecessors already have final distances

**Dijkstra fails with negative edges because:**
1. Greedy choice: "closest unvisited vertex has final distance"
2. Negative edge from later vertex $u$ to earlier vertex $v$ could improve $d[v]$
3. But $v$ already marked as visited → never updated

**Example:**
\`\`\`
A → B (weight 5)
A → C (weight 2)
C → B (weight -4)
\`\`\`

Dijkstra from A:
- Process A: d[B]=5, d[C]=2
- Process C (smaller): Can't update B's distance
- d[B] = 5, but actual shortest = 2 + (-4) = -2`
          },
          {
            id: 'wsp-3',
            problem: `**Longest Path in DAG**

How would you find the longest path in a DAG?

*Hint: Consider how negating weights affects the problem.*`,
            solution: `**Solution 1: Negate weights**
1. Negate all edge weights: $w'(u,v) = -w(u,v)$
2. Run DAG shortest paths
3. Negate the result: longest = $-\\delta(s,v)$

**Solution 2: Modify relaxation**
\`\`\`
Initialize d[s] = 0, d[v] = -∞ for v ≠ s

Relax-Max(u, v, w):
    if d[v] < d[u] + w(u, v):
        d[v] = d[u] + w(u, v)
\`\`\`

**Application:** Critical path in project scheduling = longest path in task dependency DAG.`
          }
        ],
        visualizations: ['WeightedGraphVisualizer'],
      },
      // Unit 12: Bellman-Ford
      {
        id: 'bellman-ford',
        title: 'Bellman-Ford Algorithm',
        description: 'Single-source shortest paths with negative edges, negative cycle detection.',
        sections: [
          {
            title: 'Bellman-Ford Algorithm',
            content: `## Bellman-Ford Algorithm

Bellman-Ford solves SSSP with **negative edge weights** and detects **negative cycles**.

### Algorithm

\`\`\`
Bellman-Ford(G, w, s):
    Initialize-Single-Source(G, s)

    for i = 1 to |V| - 1:
        for each edge (u, v) in E:
            Relax(u, v, w)

    # Negative cycle check
    for each edge (u, v) in E:
        if d[v] > d[u] + w(u, v):
            return FALSE  # Negative cycle exists

    return TRUE
\`\`\`

### Key Insight

After $i$ iterations, we have correct shortest paths for all vertices reachable via paths of at most $i$ edges.

Since any simple path has at most $|V| - 1$ edges, $|V| - 1$ iterations suffice.

### Complexity

$$\\boxed{\\text{Time: } O(VE) \\qquad \\text{Space: } O(V)}$$

### Comparison with Dijkstra

| Aspect | Bellman-Ford | Dijkstra |
|--------|--------------|----------|
| Time | $O(VE)$ | $O(V \\log V + E)$ |
| Negative edges | ✓ Yes | ✗ No |
| Negative cycles | Detects | Undefined |
| Simpler | ✓ | ✗ |`
          },
          {
            title: 'Correctness Proof',
            content: `## Correctness of Bellman-Ford

### Lemma: Path-Edge Count

Every shortest path has at most $|V| - 1$ edges.

**Proof:** A simple path visits each vertex at most once, so it has at most $|V|$ vertices and $|V| - 1$ edges.

### Main Theorem

If $G$ has no negative-weight cycles reachable from $s$, then after $|V| - 1$ iterations:
1. $d[v] = \\delta(s, v)$ for all reachable $v$
2. The predecessor subgraph forms a shortest-paths tree

### Proof by Induction

**Claim:** After $i$ iterations, $d[v] = \\delta(s, v)$ for any $v$ with a shortest path of $\\leq i$ edges.

**Base case:** $i = 0$. Only $d[s] = 0 = \\delta(s, s)$. ✓

**Inductive step:** Assume true for $i-1$.

Let $v$ have shortest path $p = s \\leadsto u \\to v$ with $i$ edges.
- Path $s \\leadsto u$ has $i-1$ edges
- By IH: $d[u] = \\delta(s, u)$ after $i-1$ iterations
- In iteration $i$, we relax $(u, v)$
- By convergence property: $d[v] = \\delta(s, v)$ ✓

### Negative Cycle Detection

After $|V| - 1$ iterations, if we can still relax any edge, a negative cycle exists.

$$\\boxed{\\text{Extra relaxation possible} \\Leftrightarrow \\text{Negative cycle reachable from } s}$$`
          },
          {
            title: 'Negative Cycle Detection',
            content: `## Negative Cycle Detection

### Detection Algorithm

After $|V| - 1$ iterations of Bellman-Ford:

\`\`\`
DetectNegativeCycle(G, w, s):
    Run Bellman-Ford for |V| - 1 iterations

    for each edge (u, v) in E:
        if d[v] > d[u] + w(u, v):
            return "Negative cycle exists"

    return "No negative cycle"
\`\`\`

### Finding the Cycle

To actually find the negative cycle:

\`\`\`
FindNegativeCycle(G, w, s):
    Run Bellman-Ford for |V| - 1 iterations

    for each edge (u, v) in E:
        if d[v] > d[u] + w(u, v):
            # v is affected by negative cycle
            # Walk back |V| times to ensure we're in the cycle
            x = v
            for i = 1 to |V|:
                x = π[x]

            # Now x is in the cycle; trace it
            cycle = [x]
            y = π[x]
            while y ≠ x:
                cycle.append(y)
                y = π[y]

            return cycle

    return NIL
\`\`\`

### Why Walk Back |V| Times?

The vertex $v$ where relaxation still occurs might not be in the cycle itself—it might just be reachable from the cycle. Walking back $|V|$ times guarantees we enter the cycle.

$$\\boxed{\\text{Finding the cycle: } O(V) \\text{ additional time}}$$`
          },
          {
            title: 'Optimizations and Variants',
            content: `## Bellman-Ford Optimizations

### Early Termination

If no edge is relaxed in an iteration, we can stop early:

\`\`\`
Bellman-Ford-Optimized(G, w, s):
    Initialize-Single-Source(G, s)

    for i = 1 to |V| - 1:
        changed = false
        for each edge (u, v) in E:
            if Relax(u, v, w):
                changed = true
        if not changed:
            break  # No more updates possible

    # Negative cycle check
    for each edge (u, v) in E:
        if d[v] > d[u] + w(u, v):
            return FALSE
    return TRUE
\`\`\`

### SPFA (Shortest Path Faster Algorithm)

Only relax edges from recently updated vertices:

\`\`\`
SPFA(G, w, s):
    Initialize-Single-Source(G, s)
    Q = queue containing s
    inQueue[s] = true

    while Q not empty:
        u = Q.dequeue()
        inQueue[u] = false
        for each edge (u, v) in E:
            if d[v] > d[u] + w(u, v):
                d[v] = d[u] + w(u, v)
                π[v] = u
                if not inQueue[v]:
                    Q.enqueue(v)
                    inQueue[v] = true
\`\`\`

**Average case:** Much faster than $O(VE)$
**Worst case:** Still $O(VE)$

### Batch Relaxation

Process all edges in parallel (for parallel algorithms):
- Each iteration can relax edges in any order
- Enables GPU/parallel implementations

$$\\boxed{\\text{SPFA is faster in practice but not asymptotically}}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'bf-1',
            problem: `**Iteration Trace**

Trace Bellman-Ford on a small graph, showing d[] after each iteration.

*Hint: Process all edges in each iteration, tracking distance updates.*`,
            solution: `**Example Graph:**
\`\`\`
s → A (3)
s → B (5)
A → B (-2)
B → C (4)
A → C (6)
\`\`\`

**Initialization:** d[s]=0, d[A]=∞, d[B]=∞, d[C]=∞

**Iteration 1:**
- Relax (s,A): d[A] = 0+3 = 3
- Relax (s,B): d[B] = 0+5 = 5
- Relax (A,B): d[B] = min(5, 3-2) = 1
- Relax (B,C): d[C] = 1+4 = 5
- Relax (A,C): d[C] = min(5, 3+6) = 5

**Iteration 2:** No changes

**Final:** d[s]=0, d[A]=3, d[B]=1, d[C]=5`
          },
          {
            id: 'bf-2',
            problem: `**Negative Cycle Example**

Construct a graph with a negative cycle and show how Bellman-Ford detects it.

*Hint: Create a cycle where sum of weights is negative.*`,
            solution: `**Graph with negative cycle:**
\`\`\`
s → A (1)
A → B (2)
B → C (-4)
C → A (1)
\`\`\`

Cycle: A → B → C → A with weight 2 + (-4) + 1 = -1

**After |V|-1 = 3 iterations:**
Distances keep decreasing each iteration due to the negative cycle.

**Detection (iteration 4):**
For edge (C,A): d[A] > d[C] + 1?
- If true, we can still improve → negative cycle exists!

**Key point:** After 3 iterations, we should have optimal paths if no negative cycles. Being able to improve means we can go around the cycle again for a shorter "path."`
          },
          {
            id: 'bf-3',
            problem: `**Why |V|-1 Iterations?**

Explain why exactly |V|-1 iterations are sufficient.

*Hint: Think about the maximum length of a simple path.*`,
            solution: `**Answer:**

A shortest path in a graph with $|V|$ vertices can have at most $|V|-1$ edges.

**Why?**
- A simple path doesn't repeat vertices
- With $|V|$ vertices, maximum edges = $|V|-1$

**After iteration $i$:**
- Paths with $\\leq i$ edges have correct distances

**After iteration $|V|-1$:**
- All shortest simple paths (with $\\leq |V|-1$ edges) have correct distances
- Any path with $|V|$ or more edges must repeat a vertex
- If we can still improve → path can be made shorter by going around a negative cycle`
          }
        ],
        visualizations: ['BellmanFordVisualizer'],
      },
      // Unit 13: Dijkstra
      {
        id: 'dijkstra',
        title: "Dijkstra's Algorithm",
        description: 'Single-source shortest paths with non-negative edges using priority queues.',
        sections: [
          {
            title: "Dijkstra's Algorithm",
            content: `## Dijkstra's Algorithm

Dijkstra's algorithm solves SSSP for graphs with **non-negative edge weights** efficiently using a priority queue.

### Algorithm

\`\`\`
Dijkstra(G, w, s):
    Initialize-Single-Source(G, s)
    S = ∅                    # Set of finalized vertices
    Q = V                    # Min-priority queue by d[v]

    while Q ≠ ∅:
        u = Extract-Min(Q)   # Get closest unfinalized vertex
        S = S ∪ {u}
        for each v in Adj[u]:
            Relax(u, v, w)   # May call Decrease-Key(Q, v)
\`\`\`

### Key Insight

**Greedy choice:** The unvisited vertex with minimum $d[v]$ has found its shortest path.

**Why it works:** All remaining paths to $u$ go through unvisited vertices, which have $d[\\cdot] \\geq d[u]$. With non-negative edges, these paths can only get longer.

### Invariant

At each step, for vertices in $S$: $d[v] = \\delta(s, v)$

$$\\boxed{\\text{Dijkstra is a greedy algorithm}}$$`
          },
          {
            title: 'Priority Queue Implementations',
            content: `## Priority Queue for Dijkstra

Dijkstra's running time depends on the priority queue implementation.

### Operations Needed

| Operation | Count |
|-----------|-------|
| Insert | $O(V)$ |
| Extract-Min | $O(V)$ |
| Decrease-Key | $O(E)$ |

### Implementation Options

**Array (unsorted):**
| Op | Time |
|-----|------|
| Insert | $O(1)$ |
| Extract-Min | $O(V)$ |
| Decrease-Key | $O(1)$ |
| **Total** | $O(V^2)$ |

**Binary Heap:**
| Op | Time |
|-----|------|
| Insert | $O(\\log V)$ |
| Extract-Min | $O(\\log V)$ |
| Decrease-Key | $O(\\log V)$ |
| **Total** | $O((V + E) \\log V)$ |

**Fibonacci Heap:**
| Op | Time (amortized) |
|-----|------|
| Insert | $O(1)$ |
| Extract-Min | $O(\\log V)$ |
| Decrease-Key | $O(1)$ |
| **Total** | $O(V \\log V + E)$ |

### Which to Use?

| Graph Type | Best Choice |
|------------|-------------|
| Dense ($E = \\Theta(V^2)$) | Array: $O(V^2)$ |
| Sparse ($E = O(V)$) | Binary heap: $O(V \\log V)$ |
| Large sparse | Fibonacci heap: $O(V \\log V + E)$ |

$$\\boxed{\\text{Binary heap is usually best in practice}}$$`
          },
          {
            title: 'Correctness Proof',
            content: `## Correctness of Dijkstra's Algorithm

### Theorem

When vertex $u$ is extracted from $Q$, $d[u] = \\delta(s, u)$.

### Proof (by contradiction)

Suppose $u$ is the first vertex extracted with $d[u] > \\delta(s, u)$.

Let $p$ be a shortest path from $s$ to $u$:
$$s = x_0 \\to x_1 \\to \\cdots \\to x_k = u$$

Let $y$ be the first vertex on $p$ not in $S$ when $u$ is extracted.
Let $x$ be the predecessor of $y$ on $p$ (so $x \\in S$).

**Observations:**
1. $d[x] = \\delta(s, x)$ (x was added to S before u)
2. Edge $(x, y)$ was relaxed when $x$ was added to $S$
3. So $d[y] = \\delta(s, y)$ (by path relaxation property)

**Key step:**
$$d[y] = \\delta(s, y) \\leq \\delta(s, u) < d[u]$$

The first inequality holds because $y$ is on the path to $u$.
The second is our assumption.

**Contradiction:**
But then $y$ should have been extracted before $u$ (smaller $d$ value)!

This contradicts $u$ being extracted first with incorrect distance. ∎

$$\\boxed{\\text{Non-negative weights are essential for correctness}}$$`
          },
          {
            title: 'Implementation Details',
            content: `## Practical Implementation

### Binary Heap Version

\`\`\`
Dijkstra-BinaryHeap(G, w, s):
    for each v in V:
        d[v] = ∞
        π[v] = NIL
    d[s] = 0

    H = BuildMinHeap(V, d)  # Heap ordered by d values

    while H not empty:
        u = H.ExtractMin()
        for each v in Adj[u]:
            if d[v] > d[u] + w(u, v):
                d[v] = d[u] + w(u, v)
                π[v] = u
                H.DecreaseKey(v, d[v])
\`\`\`

### Lazy Deletion Variant

Instead of Decrease-Key, insert duplicates and skip stale entries:

\`\`\`
Dijkstra-Lazy(G, w, s):
    d[s] = 0, all others = ∞
    H = empty min-heap
    H.Insert((0, s))
    visited = empty set

    while H not empty:
        (dist, u) = H.ExtractMin()
        if u in visited:
            continue  # Skip stale entry
        visited.add(u)

        for each v in Adj[u]:
            if v not in visited and d[v] > d[u] + w(u, v):
                d[v] = d[u] + w(u, v)
                π[v] = u
                H.Insert((d[v], v))  # May create duplicates
\`\`\`

**Trade-off:** Simpler (no Decrease-Key), but heap may grow to $O(E)$ entries.

### Path Reconstruction

\`\`\`
GetPath(s, t):
    path = []
    current = t
    while current ≠ NIL:
        path.prepend(current)
        current = π[current]
    return path
\`\`\`

$$\\boxed{\\text{Lazy deletion often faster in practice}}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'dijk-1',
            problem: `**Dijkstra Trace**

Trace Dijkstra's algorithm on a graph, showing the priority queue state at each step.

*Hint: Always extract the vertex with minimum d value.*`,
            solution: `**Example Graph:**
\`\`\`
s → A (4)
s → B (2)
B → A (1)
A → C (3)
B → C (5)
\`\`\`

**Trace:**
1. **Init:** Q = {s:0, A:∞, B:∞, C:∞}, S = {}
2. **Extract s:** S = {s}, relax edges
   Q = {B:2, A:4, C:∞}
3. **Extract B:** S = {s,B}, relax edges
   - A: min(4, 2+1) = 3
   Q = {A:3, C:7}
4. **Extract A:** S = {s,B,A}, relax edges
   - C: min(7, 3+3) = 6
   Q = {C:6}
5. **Extract C:** S = {s,B,A,C}

**Result:** d[s]=0, d[A]=3, d[B]=2, d[C]=6`
          },
          {
            id: 'dijk-2',
            problem: `**Why Non-Negative?**

Explain with a counterexample why Dijkstra's algorithm fails with negative edges.

*Hint: Show a case where the greedy choice is wrong.*`,
            solution: `**Counterexample:**
\`\`\`
s → A (1)
s → B (4)
A → B (-3)
\`\`\`

**Dijkstra execution:**
1. Extract s: d[A]=1, d[B]=4
2. Extract A (smaller d): **A is finalized with d[A]=1**
3. Extract B: d[B] = min(4, 1-3) = -2... but wait!

**Problem:** When we extract A, we haven't yet found the best path to B. The edge A→B with weight -3 could have given us d[B] = 1 + (-3) = -2 < 4.

But worse: if there were a path from B back to A, the "finalized" d[A]=1 could be improved!

**True shortest paths:**
- d[A] = 1 ✓
- d[B] = 1 + (-3) = -2 (not 4)

**Dijkstra gave d[B] = 4, which is wrong!**`
          },
          {
            id: 'dijk-3',
            problem: `**Dense vs Sparse**

When should you use an array vs. binary heap implementation?

*Hint: Compare O(V²) vs O((V+E)log V) for different E values.*`,
            solution: `**Array implementation:** $O(V^2)$
- Extract-Min: $O(V)$ each, $O(V)$ times = $O(V^2)$
- Decrease-Key: $O(1)$ each, $O(E)$ times = $O(E)$
- Total: $O(V^2)$

**Binary heap:** $O((V+E)\\log V)$
- Extract-Min: $O(\\log V)$ each, $O(V)$ times
- Decrease-Key: $O(\\log V)$ each, $O(E)$ times
- Total: $O((V+E)\\log V)$

**Comparison:**
- Dense graph ($E = V^2$): Heap = $O(V^2 \\log V)$ > Array = $O(V^2)$
- Sparse graph ($E = V$): Heap = $O(V \\log V)$ < Array = $O(V^2)$

**Rule of thumb:**
- $E < V^2 / \\log V$: Use binary heap
- $E > V^2 / \\log V$: Use array`
          }
        ],
        visualizations: ['DijkstraVisualizer'],
      },
      // Unit 14: APSP and Johnson
      {
        id: 'apsp-johnson',
        title: "APSP & Johnson's Algorithm",
        description: 'All-pairs shortest paths, Johnson\'s reweighting technique.',
        sections: [
          {
            title: 'All-Pairs Shortest Paths',
            content: `## All-Pairs Shortest Paths (APSP)

Find shortest paths between **all pairs** of vertices.

### Output Format

A $|V| \\times |V|$ matrix $D$ where $D[i][j] = \\delta(i, j)$

### Approaches

**Approach 1: Run SSSP from each vertex**
- Dijkstra $V$ times: $O(V^2 \\log V + VE)$
- Bellman-Ford $V$ times: $O(V^2 E)$

**Approach 2: Dynamic Programming (Floyd-Warshall)**
- Works with negative edges
- Time: $O(V^3)$, Space: $O(V^2)$

**Approach 3: Johnson's Algorithm**
- Combines Bellman-Ford and Dijkstra
- Handles negative edges
- Time: $O(V^2 \\log V + VE)$

### When to Use What?

| Algorithm | Time | Negative edges? | Best for |
|-----------|------|-----------------|----------|
| $V$ × Dijkstra | $O(V^2 \\log V + VE)$ | No | Non-negative, sparse |
| Floyd-Warshall | $O(V^3)$ | Yes | Dense, simple code |
| Johnson | $O(V^2 \\log V + VE)$ | Yes | Negative edges, sparse |

$$\\boxed{\\text{APSP output is an } O(V^2) \\text{ matrix}}$$`
          },
          {
            title: 'Floyd-Warshall Algorithm',
            content: `## Floyd-Warshall Algorithm

DP approach considering intermediate vertices one at a time.

### Idea

Let $d^{(k)}[i][j]$ = shortest path from $i$ to $j$ using only vertices $\\{1, 2, \\ldots, k\\}$ as intermediates.

### Recurrence

$$d^{(k)}[i][j] = \\min(d^{(k-1)}[i][j], \\quad d^{(k-1)}[i][k] + d^{(k-1)}[k][j])$$

Either the shortest path:
1. Doesn't use $k$ as intermediate, or
2. Goes through $k$

### Algorithm

\`\`\`
Floyd-Warshall(W):
    n = |V|
    D = W  # Initial: direct edges or ∞

    for k = 1 to n:
        for i = 1 to n:
            for j = 1 to n:
                D[i][j] = min(D[i][j], D[i][k] + D[k][j])

    return D
\`\`\`

### Detecting Negative Cycles

Check diagonal after algorithm completes:
\`\`\`
for i = 1 to n:
    if D[i][i] < 0:
        return "Negative cycle through vertex i"
\`\`\`

### Path Reconstruction

Maintain predecessor matrix $\\Pi$ where $\\Pi[i][j]$ = predecessor of $j$ on path from $i$.

$$\\boxed{\\text{Floyd-Warshall: } O(V^3) \\text{ time, } O(V^2) \\text{ space}}$$`
          },
          {
            title: "Johnson's Algorithm",
            content: `## Johnson's Algorithm

Handles negative edges efficiently for sparse graphs using **reweighting**.

### Key Idea

Transform edge weights to be non-negative while preserving shortest paths, then run Dijkstra from each vertex.

### Reweighting Technique

For vertex weights $h: V \\to \\mathbb{R}$, define new edge weights:
$$\\hat{w}(u, v) = w(u, v) + h(u) - h(v)$$

### Properties of Reweighting

**Theorem:** For any path $p$ from $u$ to $v$:
$$\\hat{w}(p) = w(p) + h(u) - h(v)$$

**Proof:**
$$\\hat{w}(p) = \\sum_{(x,y) \\in p} (w(x,y) + h(x) - h(y)) = w(p) + h(u) - h(v)$$

The $h$ values telescope!

**Corollary:** Shortest paths are preserved.
- $p$ is shortest under $w$ iff $p$ is shortest under $\\hat{w}$
- Just adjust final answer: $\\delta(u,v) = \\hat{\\delta}(u,v) - h(u) + h(v)$

### Choosing $h$ Values

Set $h(v) = \\delta(s', v)$ where $s'$ is a new vertex connected to all others with weight 0.

$$\\hat{w}(u,v) = w(u,v) + \\delta(s',u) - \\delta(s',v) \\geq 0$$

by the triangle inequality!

$$\\boxed{\\text{Reweighting makes all edges non-negative}}$$`
          },
          {
            title: "Johnson's Algorithm: Full Algorithm",
            content: `## Johnson's Algorithm: Complete

### Algorithm

\`\`\`
Johnson(G, w):
    # Step 1: Add new vertex s' with zero-weight edges to all vertices
    G' = G with new vertex s'
    for each v in V:
        add edge (s', v) with weight 0

    # Step 2: Run Bellman-Ford from s'
    if Bellman-Ford(G', w, s') == FALSE:
        return "Negative cycle exists"

    # Get h values (distances from s')
    for each v in V:
        h[v] = d[v]  # From Bellman-Ford

    # Step 3: Reweight all edges
    for each edge (u, v) in E:
        ŵ(u, v) = w(u, v) + h[u] - h[v]

    # Step 4: Run Dijkstra from each vertex
    D = new V × V matrix
    for each source u in V:
        Dijkstra(G, ŵ, u)
        for each v in V:
            D[u][v] = d̂[v] + h[v] - h[u]  # Undo reweighting

    return D
\`\`\`

### Complexity Analysis

| Step | Time |
|------|------|
| Add edges from $s'$ | $O(V)$ |
| Bellman-Ford | $O(VE)$ |
| Reweight edges | $O(E)$ |
| $V$ × Dijkstra | $O(V(V \\log V + E))$ |
| **Total** | $O(V^2 \\log V + VE)$ |

### When to Use Johnson

- **Sparse graphs** with negative edges
- When $E = O(V)$: Johnson is $O(V^2 \\log V)$ vs Floyd-Warshall's $O(V^3)$
- When $E = \\Theta(V^2)$: Floyd-Warshall is simpler and competitive

$$\\boxed{\\text{Johnson: } O(V^2 \\log V + VE)}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'apsp-1',
            problem: `**Floyd-Warshall Trace**

Trace Floyd-Warshall on a 4-vertex graph, showing the matrix after each k.

*Hint: Update D[i][j] = min(D[i][j], D[i][k] + D[k][j]) for each k.*`,
            solution: `**Initial matrix (k=0):** Direct edges

\`\`\`
     1   2   3   4
1 [  0   3   ∞   7  ]
2 [  ∞   0   2   ∞  ]
3 [  5   ∞   0   1  ]
4 [  ∞   ∞   ∞   0  ]
\`\`\`

**k=1:** Can we improve by going through vertex 1?
- D[3][2] = min(∞, D[3][1]+D[1][2]) = min(∞, 5+3) = 8
- D[3][4] = min(1, D[3][1]+D[1][4]) = min(1, 5+7) = 1 (no change)

**k=2:** Through vertex 2?
- D[1][3] = min(∞, 3+2) = 5
- D[3][3] via 2: no improvement

**Continue for k=3, k=4...**

Final matrix gives all-pairs shortest paths.`
          },
          {
            id: 'apsp-2',
            problem: `**Reweighting Example**

Show how Johnson's reweighting makes edges non-negative.

*Hint: Compute h[v] = δ(s', v) and then ŵ(u,v) = w(u,v) + h[u] - h[v].*`,
            solution: `**Original graph:**
\`\`\`
A → B (weight -2)
A → C (weight 3)
B → C (weight 4)
\`\`\`

**Step 1:** Add s' with zero edges to A, B, C

**Step 2:** Bellman-Ford from s'
- δ(s', A) = 0 (direct edge)
- δ(s', B) = 0 (direct) or -2 (via A) = -2
- δ(s', C) = 0 (direct) or 3 (via A) or 2 (via A→B→C) = 0

So: h[A]=0, h[B]=-2, h[C]=0

**Step 3:** Reweight
- ŵ(A,B) = -2 + 0 - (-2) = 0 ≥ 0 ✓
- ŵ(A,C) = 3 + 0 - 0 = 3 ≥ 0 ✓
- ŵ(B,C) = 4 + (-2) - 0 = 2 ≥ 0 ✓

All non-negative! Now run Dijkstra.`
          },
          {
            id: 'apsp-3',
            problem: `**Algorithm Selection**

For a graph with V=1000, E=5000, and negative edges, which APSP algorithm is best?

*Hint: Compare time complexities with actual numbers.*`,
            solution: `**Given:** V=1000, E=5000 (sparse), negative edges allowed

**Floyd-Warshall:** $O(V^3) = O(10^9)$ operations

**Johnson:** $O(V^2 \\log V + VE)$
- $V^2 \\log V = 10^6 \\cdot 10 = 10^7$
- $VE = 10^3 \\cdot 5 \\cdot 10^3 = 5 \\cdot 10^6$
- Total: $\\approx 1.5 \\cdot 10^7$

**Comparison:**
- Floyd-Warshall: $10^9$ operations
- Johnson: $10^7$ operations

**Answer:** Johnson is about **100x faster** for this sparse graph.

**Rule:** For sparse graphs with E = O(V), Johnson wins.
For dense graphs with E = Θ(V²), Floyd-Warshall is competitive and simpler.`
          }
        ],
        visualizations: ['JohnsonVisualizer'],
      },
      // Unit 15: Dynamic Programming, Part 1
      {
        id: 'dp-1',
        title: 'Dynamic Programming, Part 1: SRTBOT',
        description: 'DP framework: Subproblems, Relate, Topological order, Base, Original, Time.',
        sections: [
          {
            title: 'What is Dynamic Programming?',
            content: `**Dynamic Programming (DP)** is an algorithmic paradigm that solves complex problems by breaking them into simpler **overlapping subproblems** and storing their solutions to avoid redundant computation.

**Key Characteristics:**
1. **Optimal Substructure:** The optimal solution contains optimal solutions to subproblems
2. **Overlapping Subproblems:** The same subproblems are solved multiple times

**DP vs Divide and Conquer:**
- **Divide and Conquer:** Subproblems are independent (e.g., Merge Sort)
- **Dynamic Programming:** Subproblems overlap (e.g., Fibonacci)

**Example - Fibonacci:**
$$F(n) = F(n-1) + F(n-2)$$

Naive recursion: $O(2^n)$ time (exponential)
With DP (memoization): $O(n)$ time (polynomial)

**Two Approaches:**
1. **Top-Down (Memoization):** Recursive with caching
2. **Bottom-Up (Tabulation):** Iterative, fill table from base cases`
          },
          {
            title: 'The SRTBOT Framework',
            content: `**SRTBOT** is a systematic framework for solving DP problems:

**S - Subproblems**
Define the subproblems in words. Common patterns:
- Prefixes: $x[:i]$ for $i \\in \\{0, 1, \\ldots, n\\}$
- Suffixes: $x[i:]$ for $i \\in \\{0, 1, \\ldots, n\\}$
- Substrings: $x[i:j]$ for $i \\leq j$

**R - Relate**
Write a recurrence relating the solution to smaller subproblems:
$$x(i) = f(x(j_1), x(j_2), \\ldots)$$

**T - Topological Order**
Determine the order to solve subproblems so dependencies are satisfied.

**B - Base Cases**
Identify smallest subproblems solvable without recursion.

**O - Original Problem**
Express the answer in terms of subproblems.

**T - Time Analysis**
$$\\text{Time} = (\\text{# subproblems}) \\times (\\text{time per subproblem})$$`
          },
          {
            title: 'Example: Fibonacci with SRTBOT',
            content: `**Problem:** Compute $F(n)$, the $n$-th Fibonacci number.

**S - Subproblems:** $F(i)$ for $i \\in \\{0, 1, \\ldots, n\\}$. Count: $n + 1$

**R - Relate:** $F(i) = F(i-1) + F(i-2)$ for $i \\geq 2$

**T - Topological Order:** Increasing: $F(0), F(1), \\ldots, F(n)$

**B - Base Cases:** $F(0) = 0$, $F(1) = 1$

**O - Original:** Return $F(n)$

**T - Time:** $O(n)$ subproblems $\\times$ $O(1)$ = $\\boxed{O(n)}$`
          },
          {
            title: 'DAG Shortest Paths',
            content: `**Problem:** Shortest path from $s$ to $v$ in a weighted DAG.

**S - Subproblems:** $\\delta(s, v)$ = shortest path weight from $s$ to $v$

**R - Relate:** $\\delta(s, v) = \\min_{u \\to v} \\{\\delta(s, u) + w(u, v)\\}$

**T - Topological Order:** Process vertices in topological sort order

**B - Base Cases:** $\\delta(s, s) = 0$

**T - Time:** $O(V + E)$

The subproblem dependency graph forms a DAG!`
          }
        ],
        practiceProblems: [
          {
            id: 'dp1-1',
            problem: `Use SRTBOT to solve **Climbing Stairs**: You climb a staircase with $n$ steps. Each time you can climb 1 or 2 steps. How many distinct ways can you reach the top?`,
            solution: `**S:** $C(i)$ = ways to reach step $i$, for $i \\in \\{0, \\ldots, n\\}$

**R:** $C(i) = C(i-1) + C(i-2)$

**T:** Increasing order

**B:** $C(0) = 1$, $C(1) = 1$

**O:** Return $C(n)$

**T:** $O(n)$ subproblems $\\times$ $O(1)$ = $\\boxed{O(n)}$

This is the Fibonacci sequence! $C(n) = F(n+1)$`
          },
          {
            id: 'dp1-2',
            problem: `**Minimum Cost Path:** Given an $m \\times n$ grid with costs $c[i][j]$, find minimum cost from $(0,0)$ to $(m-1,n-1)$. Only move right or down.`,
            solution: `**S:** $M(i,j)$ = min cost to reach $(i,j)$. Count: $mn$

**R:** $M(i,j) = c[i][j] + \\min(M(i-1,j), M(i,j-1))$

**T:** Row by row, left to right

**B:** $M(0,0) = c[0][0]$, first row/column cumulative sums

**O:** Return $M(m-1,n-1)$

**T:** $O(mn)$`
          },
          {
            id: 'dp1-3',
            problem: `**Coin Change:** Given coin denominations $d_1, \\ldots, d_k$ and target $n$, find minimum coins to make $n$ (unlimited supply).`,
            solution: `**S:** $C(v)$ = min coins for amount $v$, $v \\in \\{0, \\ldots, n\\}$

**R:** $C(v) = 1 + \\min_{d_i \\leq v} C(v - d_i)$

**T:** Increasing order

**B:** $C(0) = 0$

**O:** Return $C(n)$

**T:** $O(n)$ subproblems $\\times$ $O(k)$ = $\\boxed{O(nk)}$`
          }
        ],
        visualizations: ['DPVisualizer'],
      },
      // Unit 16: Dynamic Programming, Part 2
      {
        id: 'dp-2',
        title: 'Dynamic Programming, Part 2: LCS, LIS',
        description: 'Longest common subsequence, longest increasing subsequence.',
        sections: [
          {
            title: 'Longest Common Subsequence (LCS)',
            content: `**Problem:** Given two strings $X = x_1 \\ldots x_m$ and $Y = y_1 \\ldots y_n$, find the longest subsequence common to both.

A **subsequence** is obtained by deleting some (possibly zero) characters without changing order.

**Example:**
- $X = $ "ABCDGH", $Y = $ "AEDFHR"
- LCS = "ADH" (length 3)

**S - Subproblems:**
$L(i, j)$ = LCS length of $X[1..i]$ and $Y[1..j]$
- Count: $(m+1)(n+1)$ subproblems

**R - Relate:**
$$L(i, j) = \\begin{cases}
L(i-1, j-1) + 1 & \\text{if } x_i = y_j \\\\
\\max(L(i-1, j), L(i, j-1)) & \\text{otherwise}
\\end{cases}$$

**B - Base:** $L(0, j) = L(i, 0) = 0$

**T - Time:** $O(mn)$`
          },
          {
            title: 'LCS Implementation',
            content: `\`\`\`python
def lcs(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]

    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])

    return dp[m][n]
\`\`\`

**Reconstructing the LCS:**
Backtrack from $dp[m][n]$:
- If $x_i = y_j$: include character, go to $(i-1, j-1)$
- Else: go to larger of $(i-1, j)$ or $(i, j-1)$`
          },
          {
            title: 'Longest Increasing Subsequence (LIS)',
            content: `**Problem:** Given array $A[1..n]$, find the longest strictly increasing subsequence.

**Example:**
- $A = [10, 22, 9, 33, 21, 50, 41, 60]$
- LIS = $[10, 22, 33, 50, 60]$ (length 5)

**S - Subproblems:**
$L(i)$ = length of LIS ending at index $i$

**R - Relate:**
$$L(i) = 1 + \\max_{j < i, A[j] < A[i]} L(j)$$

**B - Base:** $L(i) = 1$ (single element)

**O - Original:** $\\max_i L(i)$

**T - Time:** $O(n^2)$

**Optimized:** Using binary search, $O(n \\log n)$`
          },
          {
            title: 'LIS with Binary Search',
            content: `**Key Idea:** Maintain array $T$ where $T[k]$ = smallest ending element of any LIS of length $k$.

\`\`\`python
import bisect

def lis_fast(A):
    T = []
    for x in A:
        pos = bisect.bisect_left(T, x)
        if pos == len(T):
            T.append(x)
        else:
            T[pos] = x
    return len(T)
\`\`\`

**Invariant:** $T$ is always sorted.

**Time:** $O(n \\log n)$ - $n$ elements, binary search for each.`
          }
        ],
        practiceProblems: [
          {
            id: 'dp2-1',
            problem: `Find the LCS of "AGGTAB" and "GXTXAYB".`,
            solution: `Build the DP table:

\`\`\`
    ""  G  X  T  X  A  Y  B
""   0  0  0  0  0  0  0  0
A    0  0  0  0  0  1  1  1
G    0  1  1  1  1  1  1  1
G    0  1  1  1  1  1  1  1
T    0  1  1  2  2  2  2  2
A    0  1  1  2  2  3  3  3
B    0  1  1  2  2  3  3  4
\`\`\`

**LCS = "GTAB"** (length 4)

Backtrack: B(6,7) → A(5,5) → T(4,3) → G(2,1)`
          },
          {
            id: 'dp2-2',
            problem: `Find the LIS of $[3, 10, 2, 1, 20]$ using both $O(n^2)$ and $O(n \\log n)$ methods.`,
            solution: `**$O(n^2)$ Method:**
- $L[0] = 1$ (just 3)
- $L[1] = 2$ (3, 10)
- $L[2] = 1$ (just 2)
- $L[3] = 1$ (just 1)
- $L[4] = 3$ (3, 10, 20) or (2, 10, 20) or (1, 10, 20)

LIS length = $\\max(L) = 3$

**$O(n \\log n)$ Method:**
- Process 3: $T = [3]$
- Process 10: $T = [3, 10]$
- Process 2: $T = [2, 10]$ (replace 3)
- Process 1: $T = [1, 10]$ (replace 2)
- Process 20: $T = [1, 10, 20]$

**LIS length = 3**`
          },
          {
            id: 'dp2-3',
            problem: `**Edit Distance:** Find minimum operations (insert, delete, replace) to convert "SUNDAY" to "SATURDAY".`,
            solution: `**Subproblem:** $E(i,j)$ = edit distance of first $i$ chars of S1, first $j$ chars of S2

**Recurrence:**
$$E(i,j) = \\begin{cases}
E(i-1,j-1) & \\text{if } s1_i = s2_j \\\\
1 + \\min(E(i-1,j), E(i,j-1), E(i-1,j-1)) & \\text{otherwise}
\\end{cases}$$

Table for "SUNDAY" → "SATURDAY":
\`\`\`
      ""  S  A  T  U  R  D  A  Y
""     0  1  2  3  4  5  6  7  8
S      1  0  1  2  3  4  5  6  7
U      2  1  1  2  2  3  4  5  6
N      3  2  2  2  3  3  4  5  6
D      4  3  3  3  3  4  3  4  5
A      5  4  3  4  4  4  4  3  4
Y      6  5  4  4  5  5  5  4  3
\`\`\`

**Edit Distance = 3** (insert A, T, R)`
          }
        ],
        visualizations: ['DPVisualizer'],
      },
      // Unit 17: Dynamic Programming, Part 3
      {
        id: 'dp-3',
        title: 'Dynamic Programming, Part 3: Parenthesization',
        description: 'Optimal parenthesization, matrix chain multiplication.',
        sections: [
          {
            title: 'Matrix Chain Multiplication',
            content: `**Problem:** Given matrices $A_1, A_2, \\ldots, A_n$ with dimensions $p_0 \\times p_1, p_1 \\times p_2, \\ldots, p_{n-1} \\times p_n$, find the optimal way to parenthesize the product to minimize scalar multiplications.

**Key Insight:** Multiplying $A$ ($p \\times q$) by $B$ ($q \\times r$) costs $pqr$ operations.

**Example:**
- $A_1$: $10 \\times 30$, $A_2$: $30 \\times 5$, $A_3$: $5 \\times 60$
- $(A_1 A_2) A_3$: $10 \\cdot 30 \\cdot 5 + 10 \\cdot 5 \\cdot 60 = 4500$
- $A_1 (A_2 A_3)$: $30 \\cdot 5 \\cdot 60 + 10 \\cdot 30 \\cdot 60 = 27000$

Optimal: $(A_1 A_2) A_3$ with 4500 operations!`
          },
          {
            title: 'MCM with SRTBOT',
            content: `**S - Subproblems:**
$M(i, j)$ = min cost to compute $A_i \\cdot A_{i+1} \\cdots A_j$
- Count: $O(n^2)$ subproblems (all pairs $i \\leq j$)

**R - Relate:**
Split at position $k$: compute $A_i \\cdots A_k$ and $A_{k+1} \\cdots A_j$, then multiply results.
$$M(i, j) = \\min_{i \\leq k < j} \\{M(i, k) + M(k+1, j) + p_{i-1} \\cdot p_k \\cdot p_j\\}$$

**T - Topological Order:**
By increasing chain length: length 1, then 2, then 3, etc.

**B - Base Cases:**
$M(i, i) = 0$ (single matrix, no multiplication)

**T - Time:**
$O(n^2)$ subproblems $\\times$ $O(n)$ choices for $k$ = $\\boxed{O(n^3)}$`
          },
          {
            title: 'MCM Implementation',
            content: `\`\`\`python
def matrix_chain(p):
    n = len(p) - 1  # number of matrices
    # dp[i][j] = min cost for A_i...A_j
    dp = [[0] * n for _ in range(n)]
    split = [[0] * n for _ in range(n)]

    # length = chain length
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = dp[i][k] + dp[k+1][j] + p[i]*p[k+1]*p[j+1]
                if cost < dp[i][j]:
                    dp[i][j] = cost
                    split[i][j] = k

    return dp[0][n-1], split
\`\`\`

The **split** table allows reconstructing the optimal parenthesization.`
          },
          {
            title: 'Optimal BST',
            content: `**Problem:** Given keys $k_1 < k_2 < \\cdots < k_n$ with search probabilities $p_1, \\ldots, p_n$, construct a BST minimizing expected search cost.

**S - Subproblems:**
$C(i, j)$ = min expected cost for keys $k_i, \\ldots, k_j$

**R - Relate:**
Choose root $k_r$ where $i \\leq r \\leq j$:
$$C(i, j) = \\min_{i \\leq r \\leq j} \\{C(i, r-1) + C(r+1, j) + \\sum_{m=i}^{j} p_m\\}$$

The sum accounts for all keys going one level deeper.

**T - Time:** $O(n^3)$ (can be optimized to $O(n^2)$ with Knuth's optimization)`
          }
        ],
        practiceProblems: [
          {
            id: 'dp3-1',
            problem: `Find the optimal parenthesization for matrices with dimensions: $p = [5, 10, 3, 12, 5, 50, 6]$ (6 matrices).`,
            solution: `Matrices: $A_1(5 \\times 10)$, $A_2(10 \\times 3)$, $A_3(3 \\times 12)$, $A_4(12 \\times 5)$, $A_5(5 \\times 50)$, $A_6(50 \\times 6)$

Build DP table for lengths 2, 3, 4, 5, 6:

After computation:
- $M(1,6) = 2010$
- Optimal split: $((A_1(A_2 A_3))((A_4 A_5)A_6))$

**Minimum cost = 2010 scalar multiplications**`
          },
          {
            id: 'dp3-2',
            problem: `**Palindrome Partitioning:** Find minimum cuts to partition string $s$ into palindromes.`,
            solution: `**Subproblems:**
- $P(i,j)$ = true if $s[i..j]$ is palindrome
- $C(i)$ = min cuts for $s[0..i]$

**Recurrence:**
$$C(i) = \\begin{cases}
0 & \\text{if } P(0,i) \\\\
\\min_{j < i, P(j+1,i)} \\{C(j) + 1\\} & \\text{otherwise}
\\end{cases}$$

**Time:** $O(n^2)$ for palindrome table + $O(n^2)$ for cuts = $O(n^2)$`
          }
        ],
        visualizations: ['DPVisualizer'],
      },
      // Unit 18: Dynamic Programming, Part 4
      {
        id: 'dp-4',
        title: 'Dynamic Programming, Part 4: Knapsack',
        description: 'Rod cutting, subset sum, knapsack, and pseudopolynomial algorithms.',
        sections: [
          {
            title: '0/1 Knapsack Problem',
            content: `**Problem:** Given $n$ items with weights $w_1, \\ldots, w_n$ and values $v_1, \\ldots, v_n$, and a knapsack capacity $W$, maximize total value without exceeding capacity. Each item can be taken at most once.

**S - Subproblems:**
$K(i, w)$ = max value using items $1, \\ldots, i$ with capacity $w$
- Count: $O(nW)$

**R - Relate:**
$$K(i, w) = \\max\\begin{cases}
K(i-1, w) & \\text{(don't take item } i\\text{)} \\\\
K(i-1, w-w_i) + v_i & \\text{(take item } i\\text{, if } w_i \\leq w\\text{)}
\\end{cases}$$

**B - Base:** $K(0, w) = 0$ for all $w$

**T - Time:** $O(nW)$ — **pseudopolynomial**!`
          },
          {
            title: 'Knapsack Implementation',
            content: `\`\`\`python
def knapsack(weights, values, W):
    n = len(weights)
    dp = [[0] * (W + 1) for _ in range(n + 1)]

    for i in range(1, n + 1):
        for w in range(W + 1):
            dp[i][w] = dp[i-1][w]  # don't take
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i][w],
                    dp[i-1][w-weights[i-1]] + values[i-1])

    return dp[n][W]
\`\`\`

**Space Optimization:** Use 1D array since we only need previous row:
\`\`\`python
def knapsack_opt(weights, values, W):
    dp = [0] * (W + 1)
    for i in range(len(weights)):
        for w in range(W, weights[i]-1, -1):  # reverse!
            dp[w] = max(dp[w], dp[w-weights[i]] + values[i])
    return dp[W]
\`\`\``
          },
          {
            title: 'Subset Sum',
            content: `**Problem:** Given set $S = \\{s_1, \\ldots, s_n\\}$ and target $T$, is there a subset summing to exactly $T$?

This is the decision version of knapsack (values = weights).

**S - Subproblems:**
$P(i, t)$ = true if subset of $\\{s_1, \\ldots, s_i\\}$ sums to $t$

**R - Relate:**
$$P(i, t) = P(i-1, t) \\lor P(i-1, t-s_i)$$

**B - Base:** $P(0, 0) = \\text{true}$, $P(0, t) = \\text{false}$ for $t > 0$

**T - Time:** $O(nT)$ — pseudopolynomial

**Note:** Subset Sum is NP-complete, so no known polynomial-time algorithm!`
          },
          {
            title: 'Rod Cutting',
            content: `**Problem:** Given a rod of length $n$ and prices $p[1..n]$ where $p[i]$ is the price of rod of length $i$, find maximum revenue from cutting the rod.

**S - Subproblems:**
$R(i)$ = max revenue for rod of length $i$

**R - Relate:**
$$R(i) = \\max_{1 \\leq j \\leq i} \\{p[j] + R(i-j)\\}$$

Cut off piece of length $j$, recursively solve for remaining $i-j$.

**B - Base:** $R(0) = 0$

**T - Time:** $O(n^2)$

\`\`\`python
def rod_cutting(prices, n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        for j in range(1, i + 1):
            dp[i] = max(dp[i], prices[j-1] + dp[i-j])
    return dp[n]
\`\`\``
          },
          {
            title: 'Pseudopolynomial Time',
            content: `**Definition:** An algorithm runs in **pseudopolynomial time** if its running time is polynomial in the *numeric value* of the input, but exponential in the *length* of the input.

**Example:** Knapsack with capacity $W$
- Input size: $O(n + \\log W)$ bits
- Running time: $O(nW)$
- $W$ can be exponential in $\\log W$!

If $W = 2^{100}$, input has ~100 bits but algorithm takes $2^{100}$ steps.

**Weakly vs Strongly NP-hard:**
- **Weakly NP-hard:** Has pseudopolynomial algorithm (e.g., Knapsack, Subset Sum)
- **Strongly NP-hard:** No pseudopolynomial algorithm unless P=NP (e.g., 3-SAT, TSP)`
          }
        ],
        practiceProblems: [
          {
            id: 'dp4-1',
            problem: `Solve 0/1 Knapsack: items with (weight, value) = [(2,3), (3,4), (4,5), (5,6)], capacity W=8.`,
            solution: `Build DP table:
\`\`\`
       0  1  2  3  4  5  6  7  8
i=0    0  0  0  0  0  0  0  0  0
i=1    0  0  3  3  3  3  3  3  3
i=2    0  0  3  4  4  7  7  7  7
i=3    0  0  3  4  5  7  8  9  9
i=4    0  0  3  4  5  7  8  9  10
\`\`\`

**Maximum value = 10** (items 2 and 4, weights 3+5=8, values 4+6=10)`
          },
          {
            id: 'dp4-2',
            problem: `**Subset Sum:** Can $\\{3, 7, 1, 8, 4\\}$ form a subset summing to 11?`,
            solution: `Build boolean DP table:
\`\`\`
       0  1  2  3  4  5  6  7  8  9 10 11
{}     T  F  F  F  F  F  F  F  F  F  F  F
{3}    T  F  F  T  F  F  F  F  F  F  F  F
{3,7}  T  F  F  T  F  F  F  T  F  F  T  F
{3,7,1}T  T  F  T  T  F  F  T  T  F  T  T
\`\`\`

**Yes!** $P(3, 11) = $ true. Subset: $\\{3, 7, 1\\}$ or $\\{3, 8\\}$ or $\\{7, 4\\}$`
          },
          {
            id: 'dp4-3',
            problem: `**Rod Cutting:** prices $p = [1, 5, 8, 9, 10, 17, 17, 20]$ for lengths 1-8. Find max revenue for rod of length 8.`,
            solution: `Compute $R(i)$:
- $R(1) = 1$
- $R(2) = \\max(p[1]+R(1), p[2]) = \\max(2, 5) = 5$
- $R(3) = \\max(1+5, 5+1, 8) = 8$
- $R(4) = \\max(1+8, 5+5, 8+1, 9) = 10$
- $R(5) = \\max(1+10, 5+8, 8+5, 9+1, 10) = 13$
- $R(6) = \\max(1+13, 5+10, 8+8, 9+5, 10+1, 17) = 17$
- $R(7) = \\max(1+17, 5+13, 8+10, 9+8, 10+5, 17+1, 17) = 18$
- $R(8) = \\max(1+18, 5+17, 8+13, 9+10, 10+8, 17+5, 17+1, 20) = 22$

**Maximum revenue = 22** (cut into lengths 2+6 for $5+17=22$)`
          }
        ],
        visualizations: ['DPVisualizer'],
      },
      // Unit 19: Complexity
      {
        id: 'complexity',
        title: 'Computational Complexity',
        description: 'P, NP, NP-completeness, and polynomial-time reductions.',
        sections: [
          {
            title: 'Complexity Classes P and NP',
            content: `**Class P (Polynomial Time):**
Problems solvable in $O(n^k)$ time for some constant $k$.
- Examples: Sorting, Shortest Path, MST, Maximum Flow

**Class NP (Nondeterministic Polynomial Time):**
Problems where a solution can be *verified* in polynomial time.
- Given a "certificate" (proposed solution), we can check correctness in polynomial time.

**Examples in NP:**
- **SAT:** Given a boolean formula, is there a satisfying assignment?
- **Hamiltonian Path:** Does graph have a path visiting each vertex exactly once?
- **Subset Sum:** Is there a subset summing to target?

**Key Insight:** $P \\subseteq NP$ (if we can solve in poly-time, we can verify in poly-time)

**The P vs NP Question:** Is $P = NP$? Can every problem with efficiently verifiable solutions also be efficiently solved? **Unknown!**`
          },
          {
            title: 'NP-Completeness',
            content: `**Definition:** A problem $L$ is **NP-complete** if:
1. $L \\in NP$ (solutions verifiable in polynomial time)
2. Every problem in NP reduces to $L$ in polynomial time ($L$ is **NP-hard**)

**Significance:** If *any* NP-complete problem has a polynomial algorithm, then $P = NP$ and *all* NP problems become easy!

**Cook-Levin Theorem (1971):**
SAT (Boolean Satisfiability) is NP-complete.

**Proving NP-Completeness:**
1. Show problem is in NP
2. Reduce a known NP-complete problem to it

**Classic NP-Complete Problems:**
- SAT, 3-SAT
- Clique, Independent Set, Vertex Cover
- Hamiltonian Path/Cycle, TSP
- Subset Sum, Knapsack
- Graph Coloring`
          },
          {
            title: 'Polynomial-Time Reductions',
            content: `**Definition:** $A \\leq_p B$ (A reduces to B) if there exists a polynomial-time function $f$ such that:
$$x \\in A \\iff f(x) \\in B$$

**Intuition:** If we can solve $B$, we can solve $A$ by:
1. Transform input $x$ to $f(x)$
2. Solve $B$ on $f(x)$
3. Return the answer

**Properties:**
- If $A \\leq_p B$ and $B \\in P$, then $A \\in P$
- If $A \\leq_p B$ and $A$ is NP-hard, then $B$ is NP-hard

**Example Reduction: 3-SAT $\\leq_p$ Clique**
Given 3-SAT formula with $k$ clauses, construct graph:
- Node for each literal in each clause
- Edge between nodes if: different clauses AND not contradictory
- Formula satisfiable $\\iff$ graph has $k$-clique`
          },
          {
            title: 'Dealing with NP-Hard Problems',
            content: `When facing an NP-hard problem in practice:

**1. Approximation Algorithms**
Find solution within guaranteed factor of optimal.
- Vertex Cover: 2-approximation
- TSP (metric): 1.5-approximation (Christofides)

**2. Special Cases**
Some NP-hard problems have polynomial algorithms for restricted inputs.
- 2-SAT is in P (only 3-SAT is NP-complete)
- Planar graph coloring is easier

**3. Parameterized Complexity**
Algorithm exponential only in a small parameter.
- Vertex Cover in $O(2^k \\cdot n)$ where $k$ = cover size

**4. Heuristics**
No guarantees but often work well in practice.
- Local search, simulated annealing, genetic algorithms

**5. Accept Exponential Time**
For small inputs, exponential algorithms may be acceptable.`
          }
        ],
        practiceProblems: [
          {
            id: 'comp-1',
            problem: `Prove that Independent Set is NP-complete by reducing from Clique.`,
            solution: `**Step 1: Independent Set $\\in$ NP**
Given a set $S$ and graph $G$, verify in $O(|S|^2)$ that no two vertices in $S$ are adjacent.

**Step 2: Clique $\\leq_p$ Independent Set**

**Reduction:** Given graph $G = (V, E)$ and integer $k$:
- Construct complement graph $\\bar{G} = (V, \\bar{E})$ where $\\bar{E} = \\{(u,v) : (u,v) \\notin E\\}$
- $G$ has $k$-clique $\\iff$ $\\bar{G}$ has $k$-independent set

**Proof:**
- $S$ is a clique in $G$ $\\Rightarrow$ all pairs in $S$ have edges in $G$
- $\\Rightarrow$ no pairs in $S$ have edges in $\\bar{G}$
- $\\Rightarrow$ $S$ is independent set in $\\bar{G}$

**Time:** $O(|V|^2)$ to construct $\\bar{G}$ — polynomial!

Therefore, Independent Set is NP-complete.`
          },
          {
            id: 'comp-2',
            problem: `Is the following problem in P, NP, or NP-complete? "Given a graph $G$, does it have an Eulerian path?"`,
            solution: `**Answer: P (polynomial time)**

An Eulerian path exists if and only if:
- The graph is connected (ignoring isolated vertices)
- Has exactly 0 or 2 vertices of odd degree

**Algorithm:**
1. Count degree of each vertex: $O(|E|)$
2. Check connectivity via BFS/DFS: $O(|V| + |E|)$
3. Count odd-degree vertices: $O(|V|)$

**Total: $O(|V| + |E|)$** — polynomial!

This is fundamentally different from Hamiltonian Path (NP-complete) because Eulerian path visits every *edge* once, while Hamiltonian visits every *vertex* once.`
          }
        ],
        visualizations: [],
      },
      // Unit 20: Course Review
      {
        id: 'review',
        title: 'Course Review',
        description: 'Summary of key algorithms, data structures, and problem-solving techniques.',
        sections: [
          {
            title: 'Data Structures Summary',
            content: `| Data Structure | Insert | Delete | Search | Notes |
|---------------|--------|--------|--------|-------|
| Array | $O(n)$ | $O(n)$ | $O(n)$ | $O(1)$ access by index |
| Dynamic Array | $O(1)$* | $O(n)$ | $O(n)$ | *amortized |
| Linked List | $O(1)$ | $O(1)$ | $O(n)$ | Given pointer to location |
| Hash Table | $O(1)$* | $O(1)$* | $O(1)$* | *expected, with good hash |
| BST | $O(h)$ | $O(h)$ | $O(h)$ | $h$ can be $O(n)$ |
| AVL Tree | $O(\\log n)$ | $O(\\log n)$ | $O(\\log n)$ | Balanced |
| Heap | $O(\\log n)$ | $O(\\log n)$ | $O(n)$ | $O(1)$ find-min |`
          },
          {
            title: 'Sorting Algorithms',
            content: `| Algorithm | Time (Best) | Time (Avg) | Time (Worst) | Space | Stable |
|-----------|-------------|------------|--------------|-------|--------|
| Insertion Sort | $O(n)$ | $O(n^2)$ | $O(n^2)$ | $O(1)$ | Yes |
| Merge Sort | $O(n\\log n)$ | $O(n\\log n)$ | $O(n\\log n)$ | $O(n)$ | Yes |
| Heap Sort | $O(n\\log n)$ | $O(n\\log n)$ | $O(n\\log n)$ | $O(1)$ | No |
| Quick Sort | $O(n\\log n)$ | $O(n\\log n)$ | $O(n^2)$ | $O(\\log n)$ | No |
| Counting Sort | $O(n+k)$ | $O(n+k)$ | $O(n+k)$ | $O(k)$ | Yes |
| Radix Sort | $O(d(n+k))$ | $O(d(n+k))$ | $O(d(n+k))$ | $O(n+k)$ | Yes |

**Lower bound for comparison sorting:** $\\Omega(n \\log n)$`
          },
          {
            title: 'Graph Algorithms',
            content: `| Algorithm | Problem | Time | Notes |
|-----------|---------|------|-------|
| BFS | Shortest path (unweighted) | $O(V+E)$ | Level-by-level |
| DFS | Connectivity, cycles | $O(V+E)$ | Stack-based |
| Topological Sort | DAG ordering | $O(V+E)$ | DFS or Kahn's |
| Dijkstra | SSSP (non-negative) | $O((V+E)\\log V)$ | Priority queue |
| Bellman-Ford | SSSP (any weights) | $O(VE)$ | Detects negative cycles |
| Floyd-Warshall | APSP | $O(V^3)$ | DP approach |
| Johnson | APSP (sparse) | $O(V^2\\log V + VE)$ | Reweighting |
| Prim/Kruskal | MST | $O(E\\log V)$ | Greedy |`
          },
          {
            title: 'Dynamic Programming Patterns',
            content: `**SRTBOT Framework:**
1. **S**ubproblems: Define precisely
2. **R**elate: Write recurrence
3. **T**opological order: Dependency order
4. **B**ase cases: Smallest subproblems
5. **O**riginal: Express answer
6. **T**ime: Analyze complexity

**Common Patterns:**
- **1D DP:** Fibonacci, climbing stairs, rod cutting
- **2D DP:** LCS, edit distance, knapsack
- **Interval DP:** Matrix chain, optimal BST
- **DAG DP:** Shortest paths, topological problems

**Key Problems:**
| Problem | Subproblems | Time |
|---------|-------------|------|
| Fibonacci | $F(i)$ | $O(n)$ |
| LCS | $L(i,j)$ | $O(mn)$ |
| LIS | $L(i)$ | $O(n^2)$ or $O(n\\log n)$ |
| Knapsack | $K(i,w)$ | $O(nW)$ |
| Matrix Chain | $M(i,j)$ | $O(n^3)$ |`
          },
          {
            title: 'Problem-Solving Strategies',
            content: `**1. Understand the Problem**
- What is the input/output?
- What are the constraints?
- Work through small examples

**2. Choose the Right Approach**
- Brute force (establish baseline)
- Greedy (local optimal → global optimal?)
- Divide and conquer (independent subproblems?)
- Dynamic programming (overlapping subproblems?)
- Graph algorithms (model as graph?)

**3. Analyze Complexity**
- Time: How does runtime scale?
- Space: How much memory needed?
- Is the bound tight?

**4. Implement Carefully**
- Handle edge cases
- Test on examples
- Consider numerical issues

**5. Optimize if Needed**
- Better data structures
- Pruning search space
- Space-time tradeoffs`
          }
        ],
        practiceProblems: [
          {
            id: 'review-1',
            problem: `Given an unsorted array, describe the most efficient algorithm for each task: (a) Find the median, (b) Find the $k$-th smallest element, (c) Sort the array.`,
            solution: `**(a) Find the median:**
Use QuickSelect (selection algorithm):
- Expected: $O(n)$
- Worst case: $O(n^2)$
- With median-of-medians: $O(n)$ guaranteed

**(b) Find $k$-th smallest:**
Same as (a) — QuickSelect with parameter $k$: $O(n)$ expected

**(c) Sort the array:**
- Comparison sort: Merge Sort or Heap Sort for $O(n \\log n)$ guaranteed
- If elements are integers in range $[0, k]$: Counting Sort for $O(n + k)$
- If elements are strings or have digits: Radix Sort for $O(d(n + k))$`
          },
          {
            id: 'review-2',
            problem: `Design an algorithm to find the longest palindromic subsequence in a string $S$.`,
            solution: `**Key insight:** LPS of $S$ = LCS of $S$ and reverse($S$)!

Alternatively, direct DP:

**Subproblems:** $P(i,j)$ = LPS length of $S[i..j]$

**Recurrence:**
$$P(i,j) = \\begin{cases}
1 & i = j \\\\
2 & i+1 = j \\text{ and } S[i] = S[j] \\\\
P(i+1, j-1) + 2 & S[i] = S[j] \\\\
\\max(P(i+1,j), P(i,j-1)) & S[i] \\neq S[j]
\\end{cases}$$

**Base:** $P(i,i) = 1$

**Order:** By increasing length $j - i$

**Time:** $O(n^2)$

**Example:** "BBABCBCAB" → LPS = "BABCBAB" (length 7)`
          }
        ],
        visualizations: [],
      },
    ],
  },
  {
    id: '18-03',
    number: '18.03',
    title: 'Differential Equations',
    description: 'ODEs, Laplace transform, and systems.',
    color: 'bg-purple-600',
    units: [
      // =====================================================================
      // UNIT 0: CALCULUS PREREQUISITES REVIEW
      // =====================================================================
      {
        id: 'prereq-review',
        title: 'Calculus Prerequisites',
        description: 'Essential calculus review for differential equations success.',
        visualizations: ['CalculusReviewVisualizer'],
        sections: [
          {
            title: 'Why Review Calculus?',
            content: `Differential equations are fundamentally about **derivatives** and **integrals**. Before diving in, we need to ensure our calculus foundations are solid.

**Prerequisites (18.01 topics you must know):**
- Derivatives: power rule, product rule, quotient rule, chain rule
- Integrals: basic antiderivatives, substitution, integration by parts
- Exponentials and logarithms: derivatives and integrals of $e^x$, $\\ln(x)$
- Trigonometric functions: derivatives and integrals of sin, cos, tan

**What is a Differential Equation?**
A differential equation is an equation involving an unknown function and its derivatives. For example:

$$\\frac{dy}{dx} = y$$

This says: "Find a function $y(x)$ whose derivative equals itself."

The answer? $y = Ce^x$ for any constant $C$.`
          },
          {
            title: 'Essential Derivatives',
            content: `**Power Rule:**
$$\\frac{d}{dx}[x^n] = nx^{n-1}$$

**Chain Rule (Critical for ODEs!):**
$$\\frac{d}{dx}[f(g(x))] = f'(g(x)) \\cdot g'(x)$$

Example: $\\frac{d}{dx}[e^{3x}] = e^{3x} \\cdot 3 = 3e^{3x}$

**Product Rule:**
$$\\frac{d}{dx}[f(x)g(x)] = f'(x)g(x) + f(x)g'(x)$$

This rule will be **essential** for the integrating factor method!

**Key Exponential Facts:**
- $\\frac{d}{dx}[e^x] = e^x$ (exponential is its own derivative!)
- $\\frac{d}{dx}[e^{ax}] = ae^{ax}$
- $\\frac{d}{dx}[\\ln|x|] = \\frac{1}{x}$`
          },
          {
            title: 'Essential Integrals',
            content: `**Power Rule for Integration:**
$$\\int x^n \\, dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)$$

**The special case n = -1:**
$$\\int \\frac{1}{x} \\, dx = \\ln|x| + C$$

**Exponential Integrals (used constantly!):**
$$\\int e^{ax} \\, dx = \\frac{1}{a}e^{ax} + C$$

**Integration by Parts:**
$$\\int u \\, dv = uv - \\int v \\, du$$

This is the reverse of the product rule and will be needed for many ODE solutions.

**The Constant of Integration:**
Never forget the $+C$! In ODEs, this constant represents the **family of solutions**. Initial conditions determine $C$.`
          },
          {
            title: 'Practice: Verify Solutions',
            content: `**Skill:** Given a proposed solution, verify it satisfies the ODE.

**Example 1:** Verify $y = e^{2x}$ solves $\\frac{dy}{dx} = 2y$

**Solution:**
- LHS: $\\frac{dy}{dx} = \\frac{d}{dx}[e^{2x}] = 2e^{2x}$
- RHS: $2y = 2e^{2x}$
- LHS = RHS ✓

**Example 2:** Verify $y = Ce^{-x} + x - 1$ solves $\\frac{dy}{dx} + y = x$

**Solution:**
- $\\frac{dy}{dx} = -Ce^{-x} + 1$
- LHS: $\\frac{dy}{dx} + y = (-Ce^{-x} + 1) + (Ce^{-x} + x - 1) = x$
- RHS: $x$
- LHS = RHS ✓

**Key insight:** Verification is often easier than solving!`
          }
        ],
        practiceProblems: [
          {
            id: 'prereq-1',
            problem: 'Find $\\frac{d}{dx}[x^2 e^{3x}]$ using the product rule.',
            solution: `Using the product rule with $f(x) = x^2$ and $g(x) = e^{3x}$:

$f'(x) = 2x$

$g'(x) = 3e^{3x}$ (chain rule)

$$\\frac{d}{dx}[x^2 e^{3x}] = 2x \\cdot e^{3x} + x^2 \\cdot 3e^{3x} = e^{3x}(2x + 3x^2) = xe^{3x}(2 + 3x)$$`
          },
          {
            id: 'prereq-2',
            problem: 'Evaluate $\\int xe^{2x} \\, dx$ using integration by parts.',
            solution: `Let $u = x$, $dv = e^{2x}dx$

Then $du = dx$, $v = \\frac{1}{2}e^{2x}$

$$\\int xe^{2x} \\, dx = x \\cdot \\frac{1}{2}e^{2x} - \\int \\frac{1}{2}e^{2x} \\, dx$$

$$= \\frac{x}{2}e^{2x} - \\frac{1}{4}e^{2x} + C = \\frac{e^{2x}}{4}(2x - 1) + C$$`
          },
          {
            id: 'prereq-3',
            problem: 'Verify that $y = \\frac{1}{1+Ce^{-x}}$ is a solution to $\\frac{dy}{dx} = y(1-y)$.',
            solution: `First, find $\\frac{dy}{dx}$ using the quotient rule:

Let $y = (1+Ce^{-x})^{-1}$

Using chain rule: $\\frac{dy}{dx} = -1 \\cdot (1+Ce^{-x})^{-2} \\cdot (-Ce^{-x}) = \\frac{Ce^{-x}}{(1+Ce^{-x})^2}$

Now compute $y(1-y)$:

$1 - y = 1 - \\frac{1}{1+Ce^{-x}} = \\frac{Ce^{-x}}{1+Ce^{-x}}$

$y(1-y) = \\frac{1}{1+Ce^{-x}} \\cdot \\frac{Ce^{-x}}{1+Ce^{-x}} = \\frac{Ce^{-x}}{(1+Ce^{-x})^2}$

LHS = RHS ✓`
          }
        ]
      },

      // =====================================================================
      // UNIT 1: INTRODUCTION TO ODES
      // =====================================================================
      {
        id: 'intro-odes',
        title: 'Introduction to ODEs',
        description: 'What are differential equations and how do we visualize solutions?',
        visualizations: ['SlopeField', 'FunctionPlot'],
        sections: [
          {
            title: 'What is a Differential Equation?',
            content: `A **differential equation** is an equation that relates a function to its derivatives.

**Ordinary Differential Equation (ODE):** Involves functions of ONE variable.
$$\\frac{dy}{dx} = f(x, y)$$

**Partial Differential Equation (PDE):** Involves functions of MULTIPLE variables.
$$\\frac{\\partial u}{\\partial t} = k\\frac{\\partial^2 u}{\\partial x^2}$$

In 18.03, we focus primarily on ODEs.

**Order:** The highest derivative that appears.
- First order: $\\frac{dy}{dx} = x + y$
- Second order: $\\frac{d^2y}{dx^2} + 3\\frac{dy}{dx} + 2y = 0$

**Linear vs Nonlinear:**
- Linear: $y$ and its derivatives appear to the first power, not multiplied together
- Linear: $\\frac{dy}{dx} + 2y = e^x$
- Nonlinear: $\\frac{dy}{dx} = y^2$ or $y\\frac{dy}{dx} = 1$`
          },
          {
            title: 'Solutions and Initial Conditions',
            content: `A **solution** to an ODE is a function that satisfies the equation when substituted in.

**General Solution:** Contains arbitrary constants (one for each order).

For $\\frac{dy}{dx} = 2y$, the general solution is $y = Ce^{2x}$ where $C$ is any constant.

**Particular Solution:** A specific solution with determined constants.

**Initial Value Problem (IVP):** An ODE together with initial conditions.

$$\\frac{dy}{dx} = 2y, \\quad y(0) = 3$$

Solving: $y = Ce^{2x}$, and $y(0) = C = 3$, so $y = 3e^{2x}$.

**Existence and Uniqueness Theorem:**
If $f(x,y)$ and $\\frac{\\partial f}{\\partial y}$ are continuous near $(x_0, y_0)$, then the IVP
$$\\frac{dy}{dx} = f(x,y), \\quad y(x_0) = y_0$$
has a **unique** solution in some interval around $x_0$.`
          },
          {
            title: 'Direction Fields (Slope Fields)',
            content: `A **direction field** (or slope field) is a visual representation of a first-order ODE.

For $\\frac{dy}{dx} = f(x,y)$:
- At each point $(x, y)$, draw a small line segment with slope $f(x, y)$
- Solution curves must be tangent to these segments everywhere

**Why are they useful?**
1. Visualize solution behavior without solving
2. Understand qualitative behavior (growth, decay, oscillation)
3. Identify equilibrium solutions
4. Check your analytical solutions

**Reading a Direction Field:**
- Horizontal segments: $\\frac{dy}{dx} = 0$ (critical points or equilibria)
- Steep segments: rapid change in $y$
- Solution curves "follow" the arrows

**Example:** For $\\frac{dy}{dx} = y$:
- When $y > 0$: slopes are positive (solutions increase)
- When $y < 0$: slopes are negative (solutions decrease)
- When $y = 0$: slopes are zero (equilibrium solution $y = 0$)`
          },
          {
            title: 'Classification of First-Order ODEs',
            content: `First-order ODEs can be classified by their form, which determines the solution method:

**1. Separable Equations:**
$$\\frac{dy}{dx} = f(x) \\cdot g(y)$$
Variables can be separated to opposite sides.

**2. Linear Equations:**
$$\\frac{dy}{dx} + P(x)y = Q(x)$$
Solved using integrating factors.

**3. Exact Equations:**
$$M(x,y)dx + N(x,y)dy = 0$$
where $\\frac{\\partial M}{\\partial y} = \\frac{\\partial N}{\\partial x}$

**4. Homogeneous Equations:**
$$\\frac{dy}{dx} = F\\left(\\frac{y}{x}\\right)$$
Use substitution $v = y/x$.

**5. Bernoulli Equations:**
$$\\frac{dy}{dx} + P(x)y = Q(x)y^n$$
Use substitution $v = y^{1-n}$.

In this course, we'll master the most common types: separable and linear.`
          }
        ],
        practiceProblems: [
          {
            id: 'intro-1',
            problem: 'Classify each ODE as linear/nonlinear and state its order: (a) $y\\prime\\prime + 3y\\prime - y = \\sin x$ (b) $y\\prime = y^2 + x$ (c) $xy\\prime + y = e^x$',
            solution: `(a) $y'' + 3y' - y = \\sin x$
- **Order:** 2 (highest derivative is $y''$)
- **Linear:** Yes ($y$ and its derivatives appear to first power only)

(b) $y' = y^2 + x$
- **Order:** 1
- **Nonlinear:** $y^2$ term makes it nonlinear

(c) $xy' + y = e^x$
- **Order:** 1
- **Linear:** Yes (can write as $y' + \\frac{1}{x}y = \\frac{e^x}{x}$, standard linear form)`
          },
          {
            id: 'intro-2',
            problem: 'For the direction field of $\\frac{dy}{dx} = x - y$, describe what happens to solutions starting at: (a) $(0, 2)$ (b) $(0, 0)$ (c) $(0, -1)$',
            solution: `At any point, the slope is $x - y$.

**(a) Starting at $(0, 2)$:**
- Initial slope = $0 - 2 = -2$ (steep downward)
- Solution decreases initially
- As $y$ decreases toward the line $y = x$, slopes approach 0
- Solution approaches the line $y = x$ from above

**(b) Starting at $(0, 0)$:**
- Initial slope = $0 - 0 = 0$
- At origin, solution is momentarily horizontal
- Solution follows the line $y = x - 1$ (can verify this is a solution)

**(c) Starting at $(0, -1)$:**
- Initial slope = $0 - (-1) = 1$
- Solution increases
- Approaches the line $y = x$ from below

The line $y = x$ is an "attractor" for all solutions.`
          },
          {
            id: 'intro-3',
            problem: 'Find all equilibrium solutions of $\\frac{dy}{dx} = y(y-1)(y+2)$.',
            solution: `Equilibrium solutions occur where $\\frac{dy}{dx} = 0$.

Setting $y(y-1)(y+2) = 0$:
- $y = 0$
- $y = 1$
- $y = -2$

These three constant functions are **equilibrium solutions**.

**Stability analysis:**
- For $y > 1$: $\\frac{dy}{dx} > 0$ (increasing)
- For $0 < y < 1$: $\\frac{dy}{dx} < 0$ (decreasing)
- For $-2 < y < 0$: $\\frac{dy}{dx} > 0$ (increasing)
- For $y < -2$: $\\frac{dy}{dx} < 0$ (decreasing)

Therefore:
- $y = 1$ is **unstable** (solutions move away)
- $y = 0$ is **stable** (solutions approach from both sides)
- $y = -2$ is **unstable** (solutions move away)`
          }
        ]
      },

      // =====================================================================
      // UNIT 2: FIRST-ORDER LINEAR ODES
      // =====================================================================
      {
        id: 'first-order-linear',
        title: 'First-Order Linear ODEs',
        description: 'The integrating factor method for solving linear equations.',
        visualizations: ['IntegratingFactorVisualizer', 'SlopeField'],
        sections: [
          {
            title: 'Standard Form',
            content: `A **first-order linear ODE** has the form:
$$\\frac{dy}{dx} + P(x)y = Q(x)$$

This is "linear" because $y$ and $\\frac{dy}{dx}$ appear to the first power and are not multiplied together.

**Examples:**
1. $\\frac{dy}{dx} + 2y = e^x$ → $P(x) = 2$, $Q(x) = e^x$

2. $x\\frac{dy}{dx} - 3y = x^2$ → Divide by $x$:
   $\\frac{dy}{dx} - \\frac{3}{x}y = x$ → $P(x) = -\\frac{3}{x}$, $Q(x) = x$

3. $\\frac{dy}{dx} = y + \\sin x$ → Rewrite:
   $\\frac{dy}{dx} - y = \\sin x$ → $P(x) = -1$, $Q(x) = \\sin x$

**Key insight:** Always put the equation in standard form first!

The coefficient of $\\frac{dy}{dx}$ must be 1.`
          },
          {
            title: 'The Integrating Factor Method',
            content: `The **integrating factor** method transforms a linear ODE into an exact derivative.

**Step 1:** Put in standard form: $\\frac{dy}{dx} + P(x)y = Q(x)$

**Step 2:** Calculate the integrating factor:
$$\\mu(x) = e^{\\int P(x)\\,dx}$$

(We don't need the constant of integration here.)

**Step 3:** Multiply both sides by $\\mu(x)$:
$$\\mu(x)\\frac{dy}{dx} + \\mu(x)P(x)y = \\mu(x)Q(x)$$

**Key insight:** The left side is now exactly $\\frac{d}{dx}[\\mu(x)y]$!

This is because:
$$\\frac{d}{dx}[\\mu y] = \\mu\\frac{dy}{dx} + \\frac{d\\mu}{dx}y = \\mu\\frac{dy}{dx} + \\mu P y$$

**Step 4:** Integrate both sides:
$$\\mu(x)y = \\int \\mu(x)Q(x)\\,dx + C$$

**Step 5:** Solve for $y$:
$$y = \\frac{1}{\\mu(x)}\\left[\\int \\mu(x)Q(x)\\,dx + C\\right]$$`
          },
          {
            title: 'Detailed Example',
            content: `**Solve:** $\\frac{dy}{dx} + 2y = x$, with $y(0) = 1$

**Step 1:** Already in standard form. $P(x) = 2$, $Q(x) = x$

**Step 2:** Find integrating factor:
$$\\mu(x) = e^{\\int 2\\,dx} = e^{2x}$$

**Step 3:** Multiply both sides:
$$e^{2x}\\frac{dy}{dx} + 2e^{2x}y = xe^{2x}$$

Left side is $\\frac{d}{dx}[e^{2x}y]$:
$$\\frac{d}{dx}[e^{2x}y] = xe^{2x}$$

**Step 4:** Integrate both sides:
$$e^{2x}y = \\int xe^{2x}\\,dx$$

Using integration by parts (let $u = x$, $dv = e^{2x}dx$):
$$\\int xe^{2x}\\,dx = \\frac{x}{2}e^{2x} - \\frac{1}{4}e^{2x} + C$$

**Step 5:** Solve for $y$:
$$y = \\frac{x}{2} - \\frac{1}{4} + Ce^{-2x}$$

**Apply initial condition:** $y(0) = 1$
$$1 = 0 - \\frac{1}{4} + C \\Rightarrow C = \\frac{5}{4}$$

**Final answer:** $y = \\frac{x}{2} - \\frac{1}{4} + \\frac{5}{4}e^{-2x}$`
          },
          {
            title: 'Why Does It Work?',
            content: `The integrating factor method works because of the **product rule in reverse**.

**Recall:** $\\frac{d}{dx}[\\mu(x)y] = \\mu(x)\\frac{dy}{dx} + \\frac{d\\mu}{dx}y$

We want: $\\mu\\frac{dy}{dx} + \\mu P y = \\frac{d}{dx}[\\mu y]$

This requires: $\\frac{d\\mu}{dx} = \\mu P$

Solving this separable ODE:
$$\\frac{d\\mu}{\\mu} = P\\,dx$$
$$\\ln|\\mu| = \\int P\\,dx$$
$$\\mu = e^{\\int P\\,dx}$$

**The magic:** By choosing $\\mu$ this way, we guarantee the left side becomes an exact derivative, which we can integrate directly.

**Physical interpretation:** The integrating factor "balances" the equation so both sides have the same "weight" and can be combined.`
          }
        ],
        practiceProblems: [
          {
            id: 'linear-1',
            problem: 'Solve the IVP: $\\frac{dy}{dx} - 3y = e^{2x}$, $y(0) = 1$',
            solution: `**Step 1:** Standard form: $P(x) = -3$, $Q(x) = e^{2x}$

**Step 2:** Integrating factor:
$$\\mu(x) = e^{\\int -3\\,dx} = e^{-3x}$$

**Step 3:** Multiply and recognize derivative:
$$\\frac{d}{dx}[e^{-3x}y] = e^{-3x} \\cdot e^{2x} = e^{-x}$$

**Step 4:** Integrate:
$$e^{-3x}y = -e^{-x} + C$$

**Step 5:** Solve for $y$:
$$y = -e^{2x} + Ce^{3x}$$

**Apply IC:** $y(0) = -1 + C = 1 \\Rightarrow C = 2$

**Answer:** $y = -e^{2x} + 2e^{3x} = e^{2x}(2e^x - 1)$`
          },
          {
            id: 'linear-2',
            problem: 'Solve: $x\\frac{dy}{dx} + 2y = x^3$, for $x > 0$',
            solution: `**Step 1:** Divide by $x$ to get standard form:
$$\\frac{dy}{dx} + \\frac{2}{x}y = x^2$$

$P(x) = \\frac{2}{x}$, $Q(x) = x^2$

**Step 2:** Integrating factor:
$$\\mu(x) = e^{\\int \\frac{2}{x}dx} = e^{2\\ln x} = x^2$$

**Step 3:** Multiply:
$$x^2\\frac{dy}{dx} + 2xy = x^4$$

This is $\\frac{d}{dx}[x^2 y] = x^4$

**Step 4:** Integrate:
$$x^2 y = \\frac{x^5}{5} + C$$

**Step 5:** Solve:
$$y = \\frac{x^3}{5} + \\frac{C}{x^2}$$`
          },
          {
            id: 'linear-3',
            problem: 'A tank initially contains 100 L of pure water. Brine with 3 kg/L of salt flows in at 5 L/min. The well-mixed solution flows out at 5 L/min. Find the amount of salt at time $t$.',
            solution: `Let $S(t)$ = amount of salt (kg) at time $t$.

**Rate in:** $3 \\cdot 5 = 15$ kg/min

**Rate out:** $\\frac{S}{100} \\cdot 5 = \\frac{S}{20}$ kg/min (concentration × flow rate)

**ODE:** $\\frac{dS}{dt} = 15 - \\frac{S}{20}$

**Standard form:** $\\frac{dS}{dt} + \\frac{1}{20}S = 15$

**Integrating factor:** $\\mu = e^{t/20}$

$$\\frac{d}{dt}[e^{t/20}S] = 15e^{t/20}$$

$$e^{t/20}S = 300e^{t/20} + C$$

$$S = 300 + Ce^{-t/20}$$

**IC:** $S(0) = 0$ (pure water), so $C = -300$

**Answer:** $S(t) = 300(1 - e^{-t/20})$ kg

As $t \\to \\infty$, $S \\to 300$ kg (equilibrium).`
          }
        ]
      },

      // =====================================================================
      // UNIT 3: SEPARABLE EQUATIONS
      // =====================================================================
      {
        id: 'separable',
        title: 'Separable Equations',
        description: 'Separation of variables technique for solving ODEs.',
        visualizations: ['SeparableEquationVisualizer', 'SlopeField'],
        sections: [
          {
            title: 'What Are Separable Equations?',
            content: `A first-order ODE is **separable** if it can be written as:
$$\\frac{dy}{dx} = f(x) \\cdot g(y)$$

The right side is a **product** of a function of $x$ only and a function of $y$ only.

**Examples of separable equations:**
- $\\frac{dy}{dx} = xy$ → $f(x) = x$, $g(y) = y$
- $\\frac{dy}{dx} = e^{x+y} = e^x \\cdot e^y$ → separable!
- $\\frac{dy}{dx} = \\frac{y^2}{1+x^2}$ → $f(x) = \\frac{1}{1+x^2}$, $g(y) = y^2$

**NOT separable:**
- $\\frac{dy}{dx} = x + y$ (sum, not product)
- $\\frac{dy}{dx} = xy + 1$ (cannot factor)

**Why "separable"?** We can separate all $y$'s to one side and all $x$'s to the other.`
          },
          {
            title: 'The Separation Method',
            content: `**Step 1:** Write in the form $\\frac{dy}{dx} = f(x) \\cdot g(y)$

**Step 2:** Separate variables (move all $y$'s left, all $x$'s right):
$$\\frac{dy}{g(y)} = f(x)\\,dx$$

**Step 3:** Integrate both sides:
$$\\int \\frac{1}{g(y)}\\,dy = \\int f(x)\\,dx$$

**Step 4:** Solve for $y$ if possible (sometimes you get an implicit solution)

**Step 5:** Apply initial conditions to find the constant

**Important caution:** When dividing by $g(y)$, we might lose solutions where $g(y) = 0$. Always check for these **singular solutions**.

**Example:** For $\\frac{dy}{dx} = y^2$, dividing by $y^2$ loses the solution $y = 0$.`
          },
          {
            title: 'Detailed Example: Exponential Growth',
            content: `**Solve:** $\\frac{dy}{dx} = ky$, $y(0) = y_0$

This models exponential growth (population, radioactive decay, compound interest).

**Step 1:** Already in form $f(x) \\cdot g(y)$ where $f(x) = k$, $g(y) = y$

**Step 2:** Separate:
$$\\frac{dy}{y} = k\\,dx$$

**Step 3:** Integrate:
$$\\int \\frac{1}{y}\\,dy = \\int k\\,dx$$
$$\\ln|y| = kx + C_1$$

**Step 4:** Solve for $y$:
$$|y| = e^{kx + C_1} = e^{C_1} \\cdot e^{kx}$$
$$y = \\pm e^{C_1} \\cdot e^{kx} = Ce^{kx}$$

where $C = \\pm e^{C_1}$ can be any nonzero constant.

**Step 5:** Apply $y(0) = y_0$:
$$y_0 = Ce^0 = C$$

**Answer:** $y = y_0 e^{kx}$

**Note:** $y = 0$ is also a solution (when $y_0 = 0$), consistent with $C = 0$.`
          },
          {
            title: 'Logistic Equation',
            content: `The **logistic equation** models population with limited resources:
$$\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right)$$

where $r$ = growth rate, $K$ = carrying capacity.

**Separation:**
$$\\frac{dP}{P(1-P/K)} = r\\,dt$$

**Partial fractions:**
$$\\frac{1}{P(1-P/K)} = \\frac{1}{P} + \\frac{1/K}{1-P/K} = \\frac{1}{P} + \\frac{1}{K-P}$$

**Integrate:**
$$\\ln|P| - \\ln|K-P| = rt + C$$
$$\\ln\\left|\\frac{P}{K-P}\\right| = rt + C$$

**Solve:**
$$\\frac{P}{K-P} = Ae^{rt}$$
$$P = \\frac{KAe^{rt}}{1 + Ae^{rt}} = \\frac{K}{1 + Be^{-rt}}$$

**With** $P(0) = P_0$:
$$P(t) = \\frac{K}{1 + \\left(\\frac{K-P_0}{P_0}\\right)e^{-rt}}$$

As $t \\to \\infty$, $P \\to K$ (approaches carrying capacity).`
          }
        ],
        practiceProblems: [
          {
            id: 'sep-1',
            problem: 'Solve: $\\frac{dy}{dx} = \\frac{x}{y}$, $y(0) = 2$',
            solution: `**Separate:** $y\\,dy = x\\,dx$

**Integrate:**
$$\\int y\\,dy = \\int x\\,dx$$
$$\\frac{y^2}{2} = \\frac{x^2}{2} + C$$
$$y^2 = x^2 + 2C$$

**Apply IC:** $y(0) = 2$
$$4 = 0 + 2C \\Rightarrow C = 2$$

**Answer:** $y^2 = x^2 + 4$, or $y = \\sqrt{x^2 + 4}$ (taking positive root since $y(0) = 2 > 0$)`
          },
          {
            id: 'sep-2',
            problem: 'Solve: $\\frac{dy}{dx} = e^{x-y}$',
            solution: `**Rewrite:** $\\frac{dy}{dx} = \\frac{e^x}{e^y}$

**Separate:** $e^y\\,dy = e^x\\,dx$

**Integrate:**
$$\\int e^y\\,dy = \\int e^x\\,dx$$
$$e^y = e^x + C$$

**Solve for $y$:**
$$y = \\ln(e^x + C)$$

**Check:** The solution is valid when $e^x + C > 0$, i.e., when $C > -e^x$.`
          },
          {
            id: 'sep-3',
            problem: 'A population of bacteria doubles every 3 hours. If there are initially 1000 bacteria, find the population after 10 hours.',
            solution: `**Model:** $\\frac{dP}{dt} = kP$ with solution $P = P_0 e^{kt}$

**Find k:** Population doubles in 3 hours:
$$2P_0 = P_0 e^{3k}$$
$$2 = e^{3k}$$
$$k = \\frac{\\ln 2}{3}$$

**Solution:** $P = 1000 \\cdot e^{(\\ln 2/3)t} = 1000 \\cdot 2^{t/3}$

**At $t = 10$:**
$$P(10) = 1000 \\cdot 2^{10/3} = 1000 \\cdot 2^{3.33...}$$
$$= 1000 \\cdot 10.079... \\approx 10,079 \\text{ bacteria}$$`
          }
        ]
      },

      // =====================================================================
      // UNIT 4: NUMERICAL METHODS
      // =====================================================================
      {
        id: 'numerical-methods',
        title: 'Numerical Methods',
        description: "Euler's method and numerical approximations of solutions.",
        visualizations: ['EulerMethodVisualizer', 'SlopeField'],
        sections: [
          {
            title: 'Why Numerical Methods?',
            content: `Many differential equations **cannot be solved analytically**. Consider:
$$\\frac{dy}{dx} = x^2 + y^2$$

This is neither linear nor separable. No elementary formula exists for the solution!

**Numerical methods** approximate solutions by computing values at discrete points.

**Key idea:** Use the slope field! If we know $y(x_n)$, we can estimate $y(x_{n+1})$ by following the tangent line.

**Applications:**
- Weather prediction (Navier-Stokes equations)
- Orbital mechanics (three-body problem)
- Chemical kinetics (reaction networks)
- Neural networks (gradient descent dynamics)

**Trade-offs:**
- Numerical methods always have some error
- Smaller steps = better accuracy but more computation
- Different methods have different stability properties`
          },
          {
            title: "Euler's Method",
            content: `**Euler's method** is the simplest numerical method for ODEs.

Given: $\\frac{dy}{dx} = f(x, y)$, $y(x_0) = y_0$

**Algorithm:**
$$y_{n+1} = y_n + h \\cdot f(x_n, y_n)$$

where $h$ = step size (the spacing between $x$ values).

**Geometric interpretation:**
- At $(x_n, y_n)$, the slope is $f(x_n, y_n)$
- Follow the tangent line for a step of size $h$
- The change in $y$ is approximately $h \\cdot \\text{slope}$

**In words:** New value = Old value + Step size × Slope

**Example:** Solve $\\frac{dy}{dx} = y$, $y(0) = 1$ with $h = 0.5$

| $n$ | $x_n$ | $y_n$ | $f(x_n, y_n) = y_n$ | $y_{n+1} = y_n + 0.5 y_n$ |
|-----|-------|-------|---------------------|---------------------------|
| 0 | 0 | 1 | 1 | 1.5 |
| 1 | 0.5 | 1.5 | 1.5 | 2.25 |
| 2 | 1.0 | 2.25 | 2.25 | 3.375 |

Exact: $y(1) = e^1 \\approx 2.718$. Euler gives $2.25$ (error ≈ 17%)`
          },
          {
            title: 'Error Analysis',
            content: `**Two types of error in Euler's method:**

**1. Local Truncation Error (LTE):**
Error from a single step. For Euler's method: $O(h^2)$

This comes from the Taylor series:
$$y(x+h) = y(x) + hy'(x) + \\frac{h^2}{2}y''(\\xi)$$

Euler uses only the first two terms, so error is proportional to $h^2$.

**2. Global Error:**
Total accumulated error. For Euler's method: $O(h)$

After $N = \\frac{x_{final} - x_0}{h}$ steps, errors accumulate to $O(h)$.

**Halving the step size:**
- Local error decreases by factor of 4
- But number of steps doubles
- Global error decreases by factor of 2

**Rule of thumb:** To get one more decimal place of accuracy, divide step size by 10.

**Stability:** Euler's method can become unstable for stiff equations or large step sizes. The solution may oscillate wildly or blow up!`
          },
          {
            title: 'Improved Methods',
            content: `**Improved Euler (Heun's method):**
Take the average of slopes at the beginning and end of the step.

$$k_1 = f(x_n, y_n)$$
$$k_2 = f(x_n + h, y_n + h k_1)$$
$$y_{n+1} = y_n + \\frac{h}{2}(k_1 + k_2)$$

Global error: $O(h^2)$ - much better than standard Euler!

**Runge-Kutta 4th Order (RK4):**
The workhorse of numerical ODE solvers.

$$k_1 = f(x_n, y_n)$$
$$k_2 = f(x_n + h/2, y_n + hk_1/2)$$
$$k_3 = f(x_n + h/2, y_n + hk_2/2)$$
$$k_4 = f(x_n + h, y_n + hk_3)$$
$$y_{n+1} = y_n + \\frac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$

Global error: $O(h^4)$ - extremely accurate!

**Comparison for $\\frac{dy}{dx} = y$, $y(0) = 1$, computing $y(1)$:**
| Method | $h = 0.1$ error | $h = 0.01$ error |
|--------|-----------------|------------------|
| Euler | 0.052 | 0.0051 |
| Heun | 0.00060 | 0.0000057 |
| RK4 | 0.0000019 | $1.9 \\times 10^{-10}$ |`
          }
        ],
        practiceProblems: [
          {
            id: 'num-1',
            problem: "Use Euler's method with $h = 0.2$ to approximate $y(1)$ for $\\frac{dy}{dx} = x + y$, $y(0) = 1$.",
            solution: `**Setup:** $f(x,y) = x + y$, $h = 0.2$, starting at $(0, 1)$

| Step | $x_n$ | $y_n$ | $f(x_n, y_n)$ | $y_{n+1} = y_n + 0.2f$ |
|------|-------|-------|---------------|------------------------|
| 0 | 0 | 1 | 1 | 1.2 |
| 1 | 0.2 | 1.2 | 1.4 | 1.48 |
| 2 | 0.4 | 1.48 | 1.88 | 1.856 |
| 3 | 0.6 | 1.856 | 2.456 | 2.3472 |
| 4 | 0.8 | 2.3472 | 3.1472 | 2.97664 |
| 5 | 1.0 | **2.97664** | - | - |

**Answer:** $y(1) \\approx 2.977$

(Exact solution: $y = 2e^x - x - 1$, so $y(1) = 2e - 2 \\approx 3.437$)
Error is about 13%.`
          },
          {
            id: 'num-2',
            problem: 'If Euler\'s method with $h = 0.1$ gives a global error of about 0.05, approximately what error would you expect with $h = 0.025$?',
            solution: `**Euler's global error is $O(h)$.**

If error at $h_1 = 0.1$ is $E_1 \\approx 0.05$,

then error at $h_2 = 0.025$ is approximately:
$$E_2 \\approx E_1 \\cdot \\frac{h_2}{h_1} = 0.05 \\cdot \\frac{0.025}{0.1} = 0.05 \\cdot 0.25 = 0.0125$$

**Answer:** Expected error is approximately **0.0125** (about 4 times smaller since step size is 4 times smaller).`
          },
          {
            id: 'num-3',
            problem: 'Apply one step of Improved Euler (Heun) with $h = 0.5$ to $\\frac{dy}{dx} = y$, $y(0) = 1$. Compare with exact.',
            solution: `**Improved Euler formulas:**
$$k_1 = f(x_0, y_0) = 1$$
$$k_2 = f(x_0 + h, y_0 + hk_1) = f(0.5, 1.5) = 1.5$$
$$y_1 = y_0 + \\frac{h}{2}(k_1 + k_2) = 1 + \\frac{0.5}{2}(1 + 1.5) = 1 + 0.625 = 1.625$$

**Comparison:**
- Exact: $y(0.5) = e^{0.5} \\approx 1.6487$
- Standard Euler: $y_1 = 1 + 0.5(1) = 1.5$
- Improved Euler: $y_1 = 1.625$

**Errors:**
- Euler error: $|1.6487 - 1.5| = 0.1487$ (9.0%)
- Heun error: $|1.6487 - 1.625| = 0.0237$ (1.4%)

Improved Euler is about 6× more accurate!`
          }
        ]
      },

      // =====================================================================
      // UNIT 5: AUTONOMOUS EQUATIONS & PHASE LINES
      // =====================================================================
      {
        id: 'autonomous-phase',
        title: 'Autonomous Equations',
        description: 'Phase line analysis and stability of equilibrium solutions.',
        visualizations: ['PhaseLineVisualizer', 'SlopeField'],
        sections: [
          {
            title: 'What Are Autonomous Equations?',
            content: `An **autonomous** ODE has the form:
$$\\frac{dy}{dt} = f(y)$$

The right side depends **only on $y$**, not on the independent variable $t$.

**Key property:** The slope at a point depends only on the $y$-coordinate, not on $t$.

**Examples:**
- $\\frac{dy}{dt} = y$ (exponential growth) - autonomous
- $\\frac{dy}{dt} = y(1-y)$ (logistic) - autonomous
- $\\frac{dy}{dt} = \\sin(t) + y$ - NOT autonomous (depends on $t$)

**Consequence:** If $y(t)$ is a solution, so is $y(t + c)$ for any constant $c$. Solutions are just shifted horizontally!

**Equilibrium solutions:** Constant solutions where $f(y^*) = 0$.

For $\\frac{dy}{dt} = y(1-y)$:
- $y^* = 0$ and $y^* = 1$ are equilibria`
          },
          {
            title: 'The Phase Line',
            content: `A **phase line** is a 1-dimensional diagram showing the dynamics of an autonomous ODE.

**How to construct:**
1. Draw a vertical line representing $y$-values
2. Mark equilibrium points ($f(y^*) = 0$) with dots
3. Between equilibria, draw arrows:
   - ↑ if $f(y) > 0$ (solution increasing)
   - ↓ if $f(y) < 0$ (solution decreasing)

**Example:** $\\frac{dy}{dt} = y(2-y)$

Equilibria: $y = 0$ and $y = 2$

Sign analysis of $f(y) = y(2-y)$:
- $y < 0$: $f(y) = (neg)(pos) < 0$ → ↓
- $0 < y < 2$: $f(y) = (pos)(pos) > 0$ → ↑
- $y > 2$: $f(y) = (pos)(neg) < 0$ → ↓

Phase line:
\`\`\`
    ↓
---[0]---
    ↑
---[2]---
    ↓
\`\`\`

**Interpretation:** All solutions with $0 < y_0 < 2$ approach $y = 2$. Solutions starting above $y = 2$ also approach $y = 2$.`
          },
          {
            title: 'Stability Classification',
            content: `**Equilibrium stability** describes what happens to nearby solutions.

**Stable (attractor):** Nearby solutions approach the equilibrium as $t \\to \\infty$.
- Arrows point TOWARD the equilibrium
- $f(y)$ changes from positive to negative at $y^*$
- $f'(y^*) < 0$

**Unstable (repeller):** Nearby solutions move away from the equilibrium.
- Arrows point AWAY from the equilibrium
- $f(y)$ changes from negative to positive at $y^*$
- $f'(y^*) > 0$

**Semi-stable:** Stable on one side, unstable on the other.
- Arrows point toward from one side, away on the other
- $f'(y^*) = 0$ and $f''(y^*) \\neq 0$

**Example:** $\\frac{dy}{dt} = -y^2$

$f(y) = -y^2$, equilibrium at $y^* = 0$
- For $y > 0$: $f(y) < 0$ → ↓
- For $y < 0$: $f(y) < 0$ → ↓

Arrows point toward from above, away from below → **semi-stable**`
          },
          {
            title: 'Bifurcations',
            content: `A **bifurcation** occurs when a small change in a parameter causes a qualitative change in the dynamics (number or stability of equilibria).

**Example: Logistic harvesting**
$$\\frac{dP}{dt} = rP\\left(1 - \\frac{P}{K}\\right) - H$$

where $H$ = constant harvest rate.

Equilibria solve: $rP(1 - P/K) = H$

This is a downward parabola intersected by horizontal line at height $H$.

**Three cases:**
1. **$H < H_c$:** Two equilibria (one stable, one unstable)
2. **$H = H_c$:** One equilibrium (semi-stable) - bifurcation point!
3. **$H > H_c$:** No equilibria - population crashes to zero

where $H_c = \\frac{rK}{4}$ (maximum of the parabola).

**Bifurcation diagram:** Plot equilibria vs parameter $H$.

This models **sustainable harvesting**: If you harvest too much ($H > H_c$), the population collapses regardless of initial size!`
          }
        ],
        practiceProblems: [
          {
            id: 'auto-1',
            problem: 'Draw the phase line and classify stability for $\\frac{dy}{dt} = y^2 - 4$.',
            solution: `**Find equilibria:** $y^2 - 4 = 0 \\Rightarrow y = \\pm 2$

**Sign analysis of $f(y) = y^2 - 4 = (y-2)(y+2)$:**
- $y < -2$: $(neg)(neg) > 0$ → ↑
- $-2 < y < 2$: $(neg)(pos) < 0$ → ↓
- $y > 2$: $(pos)(pos) > 0$ → ↑

**Phase line:**
\`\`\`
    ↑
---[-2]---  ← unstable
    ↓
---[2]---   ← stable (from below only!)
    ↑
\`\`\`

Wait - let's reconsider using $f'(y) = 2y$:
- At $y = -2$: $f'(-2) = -4 < 0$ → **stable**
- At $y = 2$: $f'(2) = 4 > 0$ → **unstable**

**Corrected phase line:**
\`\`\`
    ↑        (y > 2: solutions increase, go to ∞)
---[2]---   ← unstable
    ↓
---[-2]---  ← stable
    ↑        (y < -2: solutions increase toward -2)
\`\`\`

$y = -2$ is **stable**, $y = 2$ is **unstable**.`
          },
          {
            id: 'auto-2',
            problem: 'For $\\frac{dy}{dt} = y(1-y)(2-y)$, find equilibria, draw phase line, and describe long-term behavior for each region.',
            solution: `**Equilibria:** $y = 0, 1, 2$

**Sign analysis:**
- $y < 0$: $(neg)(pos)(pos) < 0$ → ↓
- $0 < y < 1$: $(pos)(pos)(pos) > 0$ → ↑
- $1 < y < 2$: $(pos)(neg)(pos) < 0$ → ↓
- $y > 2$: $(pos)(neg)(neg) > 0$ → ↑

**Phase line and stability:**
\`\`\`
    ↑ (to ∞)
---[2]---  unstable
    ↓
---[1]---  stable
    ↑
---[0]---  unstable
    ↓ (to -∞)
\`\`\`

**Long-term behavior:**
- $y_0 < 0$: $y \\to -\\infty$
- $0 < y_0 < 1$: $y \\to 1$
- $1 < y_0 < 2$: $y \\to 1$
- $y_0 > 2$: $y \\to +\\infty$

Basin of attraction for $y = 1$ is $(0, 2)$.`
          },
          {
            id: 'auto-3',
            problem: 'For $\\frac{dy}{dt} = ry - y^2$ where $r$ is a parameter, analyze how equilibria and stability change as $r$ varies.',
            solution: `**Factor:** $\\frac{dy}{dt} = y(r - y)$

**Equilibria:** $y = 0$ and $y = r$

**Stability via $f'(y) = r - 2y$:**
- At $y = 0$: $f'(0) = r$
  - $r > 0$: unstable
  - $r < 0$: stable

- At $y = r$: $f'(r) = r - 2r = -r$
  - $r > 0$: stable
  - $r < 0$: unstable

**Bifurcation at $r = 0$:**
- $r < 0$: Equilibrium at 0 (stable), equilibrium at $r < 0$ (unstable)
- $r = 0$: Only one equilibrium at 0 (semi-stable)
- $r > 0$: Equilibrium at 0 (unstable), equilibrium at $r > 0$ (stable)

This is a **transcritical bifurcation**: two equilibria exchange stability as they pass through each other at $r = 0$.`
          }
        ]
      },

      // =====================================================================
      // UNIT 6: SECOND-ORDER LINEAR ODES
      // =====================================================================
      {
        id: 'second-order',
        title: 'Second-Order Linear ODEs',
        description: 'Homogeneous equations with constant coefficients.',
        visualizations: ['SecondOrderVisualizer', 'FunctionPlot'],
        sections: [
          {
            title: 'Introduction to Second-Order ODEs',
            content: `A **second-order linear ODE with constant coefficients** has the form:
$$ay'' + by' + cy = g(x)$$

where $a$, $b$, $c$ are constants and $g(x)$ is the forcing function.

**Homogeneous case:** $g(x) = 0$
$$ay'' + by' + cy = 0$$

**Why are these important?**
- Model oscillations: springs, pendulums, circuits
- Fundamental in physics and engineering
- Have explicit solution formulas!

**The General Solution:**
$$y = y_h + y_p$$
where:
- $y_h$ = homogeneous solution (complementary)
- $y_p$ = particular solution

**Today's focus:** Finding $y_h$ for the homogeneous case.`
          },
          {
            title: 'The Characteristic Equation',
            content: `**Key Idea:** Try $y = e^{rx}$ as a solution.

If $y = e^{rx}$, then:
- $y' = re^{rx}$
- $y'' = r^2e^{rx}$

Substituting into $ay'' + by' + cy = 0$:
$$ar^2e^{rx} + bre^{rx} + ce^{rx} = 0$$
$$e^{rx}(ar^2 + br + c) = 0$$

Since $e^{rx} \\neq 0$, we need:
$$ar^2 + br + c = 0$$

This is the **characteristic equation** (or auxiliary equation).

**Roots:** Using the quadratic formula:
$$r = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$

The **discriminant** $\\Delta = b^2 - 4ac$ determines the nature of solutions:
- $\\Delta > 0$: Two distinct real roots
- $\\Delta = 0$: One repeated real root
- $\\Delta < 0$: Complex conjugate roots`
          },
          {
            title: 'Case 1: Distinct Real Roots',
            content: `When $\\Delta = b^2 - 4ac > 0$, we get two distinct real roots $r_1$ and $r_2$.

**General Solution:**
$$y_h = C_1 e^{r_1 x} + C_2 e^{r_2 x}$$

**Example:** Solve $y'' + 5y' + 6y = 0$

**Step 1:** Characteristic equation: $r^2 + 5r + 6 = 0$

**Step 2:** Factor: $(r + 2)(r + 3) = 0$

**Step 3:** Roots: $r_1 = -2$, $r_2 = -3$

**Step 4:** General solution:
$$y = C_1 e^{-2x} + C_2 e^{-3x}$$

**Physical interpretation:** Both solutions decay (since roots are negative).
This models an **overdamped** system - returns to equilibrium without oscillating.`
          },
          {
            title: 'Case 2: Repeated Real Root',
            content: `When $\\Delta = 0$, we get one repeated root $r = -\\frac{b}{2a}$.

**Problem:** $e^{rx}$ gives only ONE solution. We need TWO linearly independent solutions!

**Solution:** The second solution is $xe^{rx}$.

**General Solution:**
$$y_h = C_1 e^{rx} + C_2 xe^{rx} = (C_1 + C_2 x)e^{rx}$$

**Example:** Solve $y'' + 4y' + 4y = 0$

**Step 1:** Characteristic equation: $r^2 + 4r + 4 = 0$

**Step 2:** Factor: $(r + 2)^2 = 0$

**Step 3:** Root: $r = -2$ (repeated)

**Step 4:** General solution:
$$y = (C_1 + C_2 x)e^{-2x}$$

**Physical interpretation:** This is **critically damped** - the fastest return to equilibrium without oscillation. Used in car shock absorbers!`
          },
          {
            title: 'Case 3: Complex Conjugate Roots',
            content: `When $\\Delta < 0$, we get complex roots $r = \\alpha \\pm \\beta i$ where:
- $\\alpha = -\\frac{b}{2a}$ (real part)
- $\\beta = \\frac{\\sqrt{|\\Delta|}}{2a}$ (imaginary part)

**Using Euler's formula:** $e^{i\\theta} = \\cos\\theta + i\\sin\\theta$

$$e^{(\\alpha + \\beta i)x} = e^{\\alpha x}(\\cos\\beta x + i\\sin\\beta x)$$

**General Solution (real form):**
$$y_h = e^{\\alpha x}(C_1 \\cos\\beta x + C_2 \\sin\\beta x)$$

**Example:** Solve $y'' + 2y' + 5y = 0$

**Characteristic equation:** $r^2 + 2r + 5 = 0$
$$r = \\frac{-2 \\pm \\sqrt{4-20}}{2} = \\frac{-2 \\pm 4i}{2} = -1 \\pm 2i$$

So $\\alpha = -1$, $\\beta = 2$.

**Solution:** $y = e^{-x}(C_1\\cos 2x + C_2\\sin 2x)$

**Physical interpretation:** **Underdamped** oscillation - oscillates while amplitude decays.`
          }
        ],
        practiceProblems: [
          {
            id: 'second-1',
            problem: 'Solve the IVP: $y\'\' - 4y = 0$, $y(0) = 2$, $y\'(0) = 4$',
            solution: `**Characteristic equation:** $r^2 - 4 = 0$
$(r-2)(r+2) = 0$
$r = 2, -2$ (distinct real roots)

**General solution:** $y = C_1 e^{2x} + C_2 e^{-2x}$

**Apply ICs:**
$y(0) = C_1 + C_2 = 2$
$y'(0) = 2C_1 - 2C_2 = 4 \\Rightarrow C_1 - C_2 = 2$

Solving: $C_1 = 2$, $C_2 = 0$

**Answer:** $y = 2e^{2x}$`
          },
          {
            id: 'second-2',
            problem: 'Solve: $y\'\' + 6y\' + 9y = 0$',
            solution: `**Characteristic equation:** $r^2 + 6r + 9 = 0$
$(r + 3)^2 = 0$
$r = -3$ (repeated root)

**General solution:**
$$y = (C_1 + C_2 x)e^{-3x}$$

This is a critically damped system.`
          },
          {
            id: 'second-3',
            problem: 'Find the general solution to $y\'\' + 4y\' + 13y = 0$. Identify the damping type.',
            solution: `**Characteristic equation:** $r^2 + 4r + 13 = 0$

$r = \\frac{-4 \\pm \\sqrt{16 - 52}}{2} = \\frac{-4 \\pm \\sqrt{-36}}{2} = \\frac{-4 \\pm 6i}{2} = -2 \\pm 3i$

$\\alpha = -2$, $\\beta = 3$

**General solution:**
$$y = e^{-2x}(C_1\\cos 3x + C_2\\sin 3x)$$

**Damping type:** Underdamped (complex roots with negative real part)

The solution oscillates with frequency $\\omega = 3$ while the amplitude decays like $e^{-2x}$.`
          }
        ]
      },

      // =====================================================================
      // UNIT 7: UNDETERMINED COEFFICIENTS
      // =====================================================================
      {
        id: 'undetermined-coeff',
        title: 'Undetermined Coefficients',
        description: 'Finding particular solutions for nonhomogeneous equations.',
        visualizations: ['UndeterminedCoefficientsVisualizer', 'ResonanceVisualizer'],
        sections: [
          {
            title: 'The Method Overview',
            content: `For $ay'' + by' + cy = g(x)$, the general solution is:
$$y = y_h + y_p$$

We know how to find $y_h$. Now we need $y_p$.

**Method of Undetermined Coefficients:**
1. Look at the form of $g(x)$
2. Guess a $y_p$ with the same form
3. Substitute and solve for coefficients

**When does it work?**
Only when $g(x)$ involves:
- Polynomials: $x^n$
- Exponentials: $e^{\\alpha x}$
- Sines and cosines: $\\sin(\\omega x)$, $\\cos(\\omega x)$
- Products of the above

**Why these?** These functions form a finite-dimensional space under differentiation - derivatives stay in the same family.`
          },
          {
            title: 'Guess Rules',
            content: `**Rule 1: Polynomial $g(x) = a_n x^n + ... + a_0$**
Guess: $y_p = A_n x^n + A_{n-1}x^{n-1} + ... + A_0$

**Rule 2: Exponential $g(x) = e^{\\alpha x}$**
Guess: $y_p = Ae^{\\alpha x}$

**Rule 3: Trigonometric $g(x) = \\cos(\\omega x)$ or $\\sin(\\omega x)$**
Guess: $y_p = A\\cos(\\omega x) + B\\sin(\\omega x)$
(Always include BOTH sine and cosine!)

**Rule 4: Products**
For $g(x) = x^n e^{\\alpha x}$, guess polynomial times exponential.
For $g(x) = e^{\\alpha x}\\cos(\\omega x)$, guess $e^{\\alpha x}(A\\cos\\omega x + B\\sin\\omega x)$

**Rule 5: Sums**
For $g(x) = g_1(x) + g_2(x)$, use **superposition**: find $y_{p1}$ and $y_{p2}$ separately, then add.`
          },
          {
            title: 'The Modification Rule',
            content: `**Critical Rule:** If your guess duplicates any part of $y_h$, multiply by $x$!

**Why?** A duplicate would be annihilated by the homogeneous equation, giving 0 = g(x).

**Example:** $y'' + y = \\cos x$

Homogeneous: $r^2 + 1 = 0 \\Rightarrow r = \\pm i$
$y_h = C_1\\cos x + C_2\\sin x$

Normal guess for $\\cos x$: $A\\cos x + B\\sin x$
**Problem:** This duplicates $y_h$!

**Modified guess:** $y_p = x(A\\cos x + B\\sin x)$

**General Modification:**
- If $e^{\\alpha x}$ is in $y_h$: multiply guess by $x$
- If $xe^{\\alpha x}$ is also in $y_h$: multiply by $x^2$
- Keep multiplying by $x$ until no duplication`
          },
          {
            title: 'Complete Example',
            content: `**Solve:** $y'' - 3y' - 4y = 3e^{2x}$

**Step 1: Find $y_h$**
$r^2 - 3r - 4 = 0 \\Rightarrow (r-4)(r+1) = 0$
$r = 4, -1$
$y_h = C_1 e^{4x} + C_2 e^{-x}$

**Step 2: Guess $y_p$**
$g(x) = 3e^{2x}$, and 2 is not a root, so guess:
$y_p = Ae^{2x}$

**Step 3: Substitute**
$y_p' = 2Ae^{2x}$, $y_p'' = 4Ae^{2x}$

$4Ae^{2x} - 3(2Ae^{2x}) - 4(Ae^{2x}) = 3e^{2x}$
$4A - 6A - 4A = 3$
$-6A = 3 \\Rightarrow A = -\\frac{1}{2}$

**Step 4: General solution**
$$y = C_1 e^{4x} + C_2 e^{-x} - \\frac{1}{2}e^{2x}$$`
          }
        ],
        practiceProblems: [
          {
            id: 'undetermined-1',
            problem: 'Find a particular solution to $y\'\' + 4y = 8x^2 + 2$.',
            solution: `**Guess:** For polynomial, try $y_p = Ax^2 + Bx + C$

**Derivatives:** $y_p' = 2Ax + B$, $y_p'' = 2A$

**Substitute:**
$2A + 4(Ax^2 + Bx + C) = 8x^2 + 2$
$4Ax^2 + 4Bx + (2A + 4C) = 8x^2 + 0x + 2$

**Match coefficients:**
- $x^2$: $4A = 8 \\Rightarrow A = 2$
- $x^1$: $4B = 0 \\Rightarrow B = 0$
- $x^0$: $2A + 4C = 2 \\Rightarrow 4 + 4C = 2 \\Rightarrow C = -\\frac{1}{2}$

**Answer:** $y_p = 2x^2 - \\frac{1}{2}$`
          },
          {
            id: 'undetermined-2',
            problem: 'Find a particular solution to $y\'\' - y = e^x$.',
            solution: `**First check:** Characteristic equation $r^2 - 1 = 0$ gives $r = \\pm 1$.
So $y_h = C_1 e^x + C_2 e^{-x}$.

**Problem:** $e^x$ is already in $y_h$!

**Modified guess:** $y_p = Axe^x$

**Derivatives:**
$y_p' = Ae^x + Axe^x = A(1+x)e^x$
$y_p'' = Ae^x + A(1+x)e^x = A(2+x)e^x$

**Substitute:**
$A(2+x)e^x - Axe^x = e^x$
$A(2+x-x)e^x = e^x$
$2Ae^x = e^x$
$A = \\frac{1}{2}$

**Answer:** $y_p = \\frac{1}{2}xe^x$`
          },
          {
            id: 'undetermined-3',
            problem: 'Set up (but do not solve) the guess for $y\'\' + 9y = 2\\cos 3x$.',
            solution: `**Homogeneous:** $r^2 + 9 = 0 \\Rightarrow r = \\pm 3i$
$y_h = C_1\\cos 3x + C_2\\sin 3x$

**Forcing:** $g(x) = 2\\cos 3x$

**Normal guess:** $A\\cos 3x + B\\sin 3x$

**Problem:** This duplicates $y_h$ completely!

**Modified guess:**
$$y_p = x(A\\cos 3x + B\\sin 3x)$$

This is a **resonance case** - the forcing frequency matches the natural frequency, leading to growing oscillations.`
          }
        ]
      },

      // =====================================================================
      // UNIT 8: FORCED OSCILLATIONS AND RESONANCE
      // =====================================================================
      {
        id: 'forced-oscillations',
        title: 'Forced Oscillations & Resonance',
        description: 'Response to periodic forcing and the resonance phenomenon.',
        visualizations: ['ResonanceVisualizer', 'SecondOrderVisualizer'],
        sections: [
          {
            title: 'The Forced Oscillator Equation',
            content: `The fundamental model for forced oscillations:
$$my'' + by' + ky = F_0\\cos(\\omega t)$$

**Physical interpretation:**
- $m$ = mass
- $b$ = damping coefficient
- $k$ = spring constant
- $F_0\\cos(\\omega t)$ = external forcing

**Standard form:** Dividing by $m$:
$$y'' + 2\\zeta\\omega_0 y' + \\omega_0^2 y = \\frac{F_0}{m}\\cos(\\omega t)$$

where:
- $\\omega_0 = \\sqrt{k/m}$ is the **natural frequency**
- $\\zeta = \\frac{b}{2\\sqrt{km}}$ is the **damping ratio**

**The solution has two parts:**
1. **Transient** (homogeneous): Dies out due to damping
2. **Steady-state** (particular): Persists forever`
          },
          {
            title: 'The Steady-State Solution',
            content: `For the forcing $F_0\\cos(\\omega t)$, the steady-state response is:

$$y_p(t) = A\\cos(\\omega t - \\phi)$$

where the **amplitude** is:
$$A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2 - \\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}}$$

and the **phase lag** is:
$$\\phi = \\arctan\\left(\\frac{2\\zeta\\omega_0\\omega}{\\omega_0^2 - \\omega^2}\\right)$$

**Key observations:**
1. Response is at the SAME frequency as forcing
2. Amplitude depends on how close $\\omega$ is to $\\omega_0$
3. There's a phase lag between forcing and response

**Gain (amplification factor):**
$$G(\\omega) = \\frac{A}{F_0/k} = \\frac{1}{\\sqrt{(1-r^2)^2 + (2\\zeta r)^2}}$$

where $r = \\omega/\\omega_0$ is the frequency ratio.`
          },
          {
            title: 'Resonance',
            content: `**Resonance** occurs when the forcing frequency is near the natural frequency.

**For undamped systems ($\\zeta = 0$):**
When $\\omega = \\omega_0$, amplitude → ∞!

The particular solution becomes:
$$y_p = \\frac{F_0 t}{2m\\omega_0}\\sin(\\omega_0 t)$$

This grows **linearly** in time - unbounded oscillations!

**For damped systems ($\\zeta > 0$):**
Maximum amplitude occurs at:
$$\\omega_r = \\omega_0\\sqrt{1 - 2\\zeta^2}$$

(slightly below $\\omega_0$ for light damping)

Maximum gain:
$$G_{max} = \\frac{1}{2\\zeta\\sqrt{1-\\zeta^2}} \\approx \\frac{1}{2\\zeta}$$

**Q factor (quality factor):**
$$Q = \\frac{1}{2\\zeta}$$

Higher Q = sharper resonance peak = less damping

**Real-world examples:**
- Tacoma Narrows Bridge collapse (1940)
- Tuning a radio to a frequency
- Wine glass shattering from sound`
          },
          {
            title: 'Frequency Response',
            content: `The **frequency response** shows how amplitude varies with forcing frequency.

**Low frequency ($\\omega \\ll \\omega_0$):**
- System follows the forcing
- Amplitude ≈ $F_0/k$ (static deflection)
- Phase lag ≈ 0°

**At resonance ($\\omega \\approx \\omega_0$):**
- Maximum amplitude
- Phase lag = 90°
- Velocity is in phase with force (maximum power transfer)

**High frequency ($\\omega \\gg \\omega_0$):**
- System cannot keep up with forcing
- Amplitude → 0 as $\\omega$ → ∞
- Phase lag → 180° (response opposes forcing)

**Bandwidth:**
The range of frequencies where $G > G_{max}/\\sqrt{2}$

$$\\Delta\\omega \\approx 2\\zeta\\omega_0 = \\frac{\\omega_0}{Q}$$

Higher Q = narrower bandwidth = more selective`
          }
        ],
        practiceProblems: [
          {
            id: 'forced-1',
            problem: 'A spring-mass system with $m = 1$ kg, $k = 4$ N/m, and $b = 1$ Ns/m is driven by $F(t) = 2\\cos(2t)$. Find the steady-state amplitude and phase.',
            solution: `**Parameters:**
$\\omega_0 = \\sqrt{k/m} = 2$ rad/s
$\\zeta = b/(2\\sqrt{km}) = 1/(2\\cdot 2) = 0.25$
$\\omega = 2$ rad/s (forcing frequency)

**Note:** $\\omega = \\omega_0$ — this is resonance!

**Amplitude:**
$A = \\frac{F_0/m}{\\sqrt{(\\omega_0^2-\\omega^2)^2 + (2\\zeta\\omega_0\\omega)^2}}$
$= \\frac{2/1}{\\sqrt{0 + (2\\cdot 0.25\\cdot 2\\cdot 2)^2}}$
$= \\frac{2}{2} = 1$ m

**Phase:**
$\\phi = \\arctan\\left(\\frac{2\\zeta\\omega_0\\omega}{\\omega_0^2-\\omega^2}\\right) = \\arctan(\\infty) = 90°$

**Steady-state:** $y_p = \\cos(2t - \\pi/2) = \\sin(2t)$`
          },
          {
            id: 'forced-2',
            problem: 'For the system $y\'\' + 0.2y\' + 4y = \\cos(\\omega t)$, find the forcing frequency that produces maximum amplitude.',
            solution: `**Identify parameters:**
$\\omega_0^2 = 4 \\Rightarrow \\omega_0 = 2$
$2\\zeta\\omega_0 = 0.2 \\Rightarrow \\zeta = 0.05$

**Resonant frequency:**
$\\omega_r = \\omega_0\\sqrt{1 - 2\\zeta^2}$
$= 2\\sqrt{1 - 2(0.05)^2}$
$= 2\\sqrt{1 - 0.005}$
$= 2\\sqrt{0.995}$
$\\approx 1.995$ rad/s

**Maximum gain:**
$G_{max} = \\frac{1}{2\\zeta\\sqrt{1-\\zeta^2}} \\approx \\frac{1}{2(0.05)} = 10$

The system amplifies the input by a factor of 10 at resonance!`
          },
          {
            id: 'forced-3',
            problem: 'Solve $y\'\' + 4y = \\cos(2t)$ with $y(0) = 0$, $y\'(0) = 0$. (Pure resonance case)',
            solution: `**Homogeneous:** $r^2 + 4 = 0 \\Rightarrow r = \\pm 2i$
$y_h = C_1\\cos 2t + C_2\\sin 2t$

**Particular:** Since $\\cos 2t$ duplicates $y_h$, use:
$y_p = t(A\\cos 2t + B\\sin 2t)$

After substitution (detailed work):
$y_p = \\frac{t}{4}\\sin 2t$

**General:** $y = C_1\\cos 2t + C_2\\sin 2t + \\frac{t}{4}\\sin 2t$

**Apply ICs:**
$y(0) = C_1 = 0$
$y'(0) = 2C_2 + 0 = 0 \\Rightarrow C_2 = 0$

**Solution:** $y = \\frac{t}{4}\\sin 2t$

The amplitude grows linearly with $t$ — **unbounded resonance!**`
          }
        ]
      },

      // =====================================================================
      // UNIT 9: VARIATION OF PARAMETERS
      // =====================================================================
      {
        id: 'variation-params',
        title: 'Variation of Parameters',
        description: 'General method for particular solutions.',
        visualizations: ['FunctionPlot', 'SecondOrderVisualizer'],
        sections: [
          {
            title: 'Why Another Method?',
            content: `**Undetermined coefficients** only works for special $g(x)$:
- Polynomials, exponentials, sines, cosines, and products

**What about:** $y'' + y = \\tan x$? or $y'' + y = \\sec x$?

These don't fit the patterns, so we need a more general method.

**Variation of Parameters** works for ANY continuous $g(x)$!

The trade-off: It always involves integration, which may be difficult.

**The key idea:** Start with the homogeneous solutions $y_1$ and $y_2$, then let the "constants" vary:
$$y_p = u_1(x)y_1(x) + u_2(x)y_2(x)$$

We'll find formulas for $u_1$ and $u_2$.`
          },
          {
            title: 'Derivation of the Formulas',
            content: `Given $y'' + p(x)y' + q(x)y = g(x)$ with homogeneous solutions $y_1$, $y_2$.

**Guess:** $y_p = u_1 y_1 + u_2 y_2$

**First derivative:**
$y_p' = u_1'y_1 + u_1y_1' + u_2'y_2 + u_2y_2'$

**Simplifying assumption:** Set $u_1'y_1 + u_2'y_2 = 0$

Then: $y_p' = u_1y_1' + u_2y_2'$

**Second derivative:**
$y_p'' = u_1'y_1' + u_1y_1'' + u_2'y_2' + u_2y_2''$

**Substitute into ODE:** After using the fact that $y_1$, $y_2$ solve homogeneous:
$$u_1'y_1' + u_2'y_2' = g(x)$$

**Two equations, two unknowns:**
$$u_1'y_1 + u_2'y_2 = 0$$
$$u_1'y_1' + u_2'y_2' = g(x)$$

Solving by Cramer's rule gives the formulas!`
          },
          {
            title: 'The Variation of Parameters Formulas',
            content: `**The Wronskian:**
$$W = \\begin{vmatrix} y_1 & y_2 \\\\ y_1' & y_2' \\end{vmatrix} = y_1y_2' - y_1'y_2$$

**Formulas for $u_1'$ and $u_2'$:**
$$u_1' = -\\frac{y_2 g(x)}{W}, \\quad u_2' = \\frac{y_1 g(x)}{W}$$

**Integrate to get $u_1$ and $u_2$:**
$$u_1 = -\\int \\frac{y_2 g(x)}{W}dx, \\quad u_2 = \\int \\frac{y_1 g(x)}{W}dx$$

**Particular solution:**
$$y_p = u_1 y_1 + u_2 y_2$$

**Note:** We don't need constants of integration since we only need ONE particular solution.`
          },
          {
            title: 'Complete Example',
            content: `**Solve:** $y'' + y = \\sec x$

**Step 1: Homogeneous solutions**
$r^2 + 1 = 0 \\Rightarrow r = \\pm i$
$y_1 = \\cos x$, $y_2 = \\sin x$

**Step 2: Wronskian**
$W = \\cos x \\cdot \\cos x - (-\\sin x) \\cdot \\sin x = \\cos^2 x + \\sin^2 x = 1$

**Step 3: Find $u_1'$ and $u_2'$**
$u_1' = -\\frac{\\sin x \\cdot \\sec x}{1} = -\\tan x$
$u_2' = \\frac{\\cos x \\cdot \\sec x}{1} = 1$

**Step 4: Integrate**
$u_1 = -\\int \\tan x \\, dx = \\ln|\\cos x|$
$u_2 = \\int 1 \\, dx = x$

**Step 5: Particular solution**
$y_p = \\ln|\\cos x| \\cdot \\cos x + x \\cdot \\sin x$
$= \\cos x \\ln|\\cos x| + x\\sin x$

**General solution:**
$$y = C_1\\cos x + C_2\\sin x + \\cos x \\ln|\\cos x| + x\\sin x$$`
          }
        ],
        practiceProblems: [
          {
            id: 'vop-1',
            problem: 'Use variation of parameters to find a particular solution to $y\'\' + y = \\csc x$.',
            solution: `**Homogeneous:** $y_1 = \\cos x$, $y_2 = \\sin x$, $W = 1$

**Find $u_1'$ and $u_2'$:**
$u_1' = -\\sin x \\cdot \\csc x = -1$
$u_2' = \\cos x \\cdot \\csc x = \\cot x$

**Integrate:**
$u_1 = -x$
$u_2 = \\int \\cot x \\, dx = \\ln|\\sin x|$

**Particular solution:**
$y_p = -x\\cos x + \\sin x \\ln|\\sin x|$`
          },
          {
            id: 'vop-2',
            problem: 'Find the Wronskian of $y_1 = e^{2x}$ and $y_2 = e^{-3x}$.',
            solution: `$W = \\begin{vmatrix} e^{2x} & e^{-3x} \\\\ 2e^{2x} & -3e^{-3x} \\end{vmatrix}$

$= e^{2x}(-3e^{-3x}) - e^{-3x}(2e^{2x})$
$= -3e^{-x} - 2e^{-x}$
$= -5e^{-x}$

**Note:** $W \\neq 0$ confirms $y_1$, $y_2$ are linearly independent.`
          },
          {
            id: 'vop-3',
            problem: 'Set up variation of parameters for $y\'\' - 4y = e^{2x}/x$ (do not integrate).',
            solution: `**Homogeneous:** $r^2 - 4 = 0 \\Rightarrow r = \\pm 2$
$y_1 = e^{2x}$, $y_2 = e^{-2x}$

**Wronskian:**
$W = e^{2x}(-2e^{-2x}) - 2e^{2x}(e^{-2x}) = -2 - 2 = -4$

**Setup:**
$u_1' = -\\frac{e^{-2x} \\cdot (e^{2x}/x)}{-4} = \\frac{1}{4x}$

$u_2' = \\frac{e^{2x} \\cdot (e^{2x}/x)}{-4} = -\\frac{e^{4x}}{4x}$

The integration of $u_2'$ requires special functions (exponential integral).`
          }
        ]
      },

      // =====================================================================
      // UNIT 10: FOURIER SERIES
      // =====================================================================
      {
        id: 'fourier-series',
        title: 'Fourier Series',
        description: 'Representing periodic functions as sums of sines and cosines.',
        visualizations: ['FourierSeriesVisualizer', 'FunctionPlot'],
        sections: [
          {
            title: 'Periodic Functions and Fourier\'s Idea',
            content: `**Joseph Fourier's Revolutionary Insight (1807):**
Any periodic function can be written as a sum of sines and cosines!

A function $f(x)$ is **periodic with period $L$** if:
$$f(x + L) = f(x) \\text{ for all } x$$

**The Fourier Series:**
$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} \\left[ a_n \\cos\\left(\\frac{2\\pi nx}{L}\\right) + b_n \\sin\\left(\\frac{2\\pi nx}{L}\\right) \\right]$$

For period $L = 2\\pi$:
$$f(x) = \\frac{a_0}{2} + \\sum_{n=1}^{\\infty} (a_n \\cos nx + b_n \\sin nx)$$

**Why is this useful?**
- Sines and cosines are eigenfunctions of differentiation
- Transforms complicated functions into simple components
- Each component has a physical interpretation (frequency)`
          },
          {
            title: 'Computing Fourier Coefficients',
            content: `**The Orthogonality Relations:**

Over $[-\\pi, \\pi]$:
$$\\int_{-\\pi}^{\\pi} \\cos(mx)\\cos(nx)\\,dx = \\begin{cases} 0 & m \\neq n \\\\ \\pi & m = n \\neq 0 \\\\ 2\\pi & m = n = 0 \\end{cases}$$

$$\\int_{-\\pi}^{\\pi} \\sin(mx)\\sin(nx)\\,dx = \\begin{cases} 0 & m \\neq n \\\\ \\pi & m = n \\neq 0 \\end{cases}$$

$$\\int_{-\\pi}^{\\pi} \\sin(mx)\\cos(nx)\\,dx = 0 \\text{ for all } m, n$$

**Euler Formulas for Coefficients:**
$$a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\,dx$$

$$a_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\cos(nx)\\,dx$$

$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin(nx)\\,dx$$

**Key trick:** Multiply both sides by $\\cos(mx)$ or $\\sin(mx)$, integrate, and use orthogonality!`
          },
          {
            title: 'Example: Square Wave',
            content: `Find the Fourier series for the **square wave**:
$$f(x) = \\begin{cases} 1 & 0 < x < \\pi \\\\ -1 & -\\pi < x < 0 \\end{cases}$$

**Observe:** $f(x)$ is **odd** (symmetric about origin), so all $a_n = 0$.

**Calculate $b_n$:**
$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} f(x)\\sin(nx)\\,dx = \\frac{2}{\\pi}\\int_0^{\\pi} \\sin(nx)\\,dx$$

$$= \\frac{2}{\\pi}\\left[-\\frac{\\cos(nx)}{n}\\right]_0^{\\pi} = \\frac{2}{n\\pi}(1 - \\cos(n\\pi))$$

$$= \\begin{cases} \\frac{4}{n\\pi} & n \\text{ odd} \\\\ 0 & n \\text{ even} \\end{cases}$$

**Fourier Series:**
$$f(x) = \\frac{4}{\\pi}\\left(\\sin x + \\frac{\\sin 3x}{3} + \\frac{\\sin 5x}{5} + \\cdots\\right)$$

Only odd harmonics appear! The series converges slowly (like $1/n$).`
          },
          {
            title: 'Convergence and Gibbs Phenomenon',
            content: `**Convergence Theorem:**
If $f(x)$ is piecewise smooth, the Fourier series converges to:
- $f(x)$ where $f$ is continuous
- $\\frac{1}{2}[f(x^+) + f(x^-)]$ at discontinuities (average of limits)

**Rate of Convergence:**
- Smooth function: Coefficients decay rapidly (exponentially)
- $k$ continuous derivatives: Coefficients decay like $1/n^{k+1}$
- Discontinuous function: Coefficients decay like $1/n$

**Gibbs Phenomenon:**
At discontinuities, the partial sums overshoot by about **9%** of the jump!

This overshoot persists no matter how many terms you take—it just gets narrower.

**Parseval's Theorem:**
$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} |f(x)|^2\\,dx = \\frac{a_0^2}{2} + \\sum_{n=1}^{\\infty}(a_n^2 + b_n^2)$$

Energy in time domain = Energy in frequency domain!`
          }
        ],
        practiceProblems: [
          {
            id: 'fourier-1',
            problem: 'Find the Fourier series for $f(x) = x$ on $[-\\pi, \\pi]$, extended periodically.',
            solution: `**$f(x) = x$ is odd**, so $a_n = 0$ for all $n$.

**Calculate $b_n$:**
$$b_n = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} x\\sin(nx)\\,dx = \\frac{2}{\\pi}\\int_0^{\\pi} x\\sin(nx)\\,dx$$

Using integration by parts with $u = x$, $dv = \\sin(nx)dx$:

$$= \\frac{2}{\\pi}\\left[-\\frac{x\\cos(nx)}{n} + \\frac{\\sin(nx)}{n^2}\\right]_0^{\\pi}$$

$$= \\frac{2}{\\pi}\\left(-\\frac{\\pi\\cos(n\\pi)}{n}\\right) = -\\frac{2\\cos(n\\pi)}{n} = \\frac{2(-1)^{n+1}}{n}$$

**Fourier Series:**
$$x = 2\\left(\\sin x - \\frac{\\sin 2x}{2} + \\frac{\\sin 3x}{3} - \\cdots\\right)$$`
          },
          {
            id: 'fourier-2',
            problem: 'Find $a_0$, $a_1$, and $b_1$ for $f(x) = |x|$ on $[-\\pi, \\pi]$.',
            solution: `**$f(x) = |x|$ is even**, so $b_n = 0$ for all $n$.

**$a_0$:**
$$a_0 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} |x|\\,dx = \\frac{2}{\\pi}\\int_0^{\\pi} x\\,dx = \\frac{2}{\\pi}\\cdot\\frac{\\pi^2}{2} = \\pi$$

**$a_1$:**
$$a_1 = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} |x|\\cos x\\,dx = \\frac{2}{\\pi}\\int_0^{\\pi} x\\cos x\\,dx$$

By parts: $= \\frac{2}{\\pi}[x\\sin x + \\cos x]_0^{\\pi} = \\frac{2}{\\pi}(-1 - 1) = -\\frac{4}{\\pi}$

**$b_1 = 0$** (function is even)

**Series begins:** $|x| = \\frac{\\pi}{2} - \\frac{4}{\\pi}\\cos x - \\cdots$`
          },
          {
            id: 'fourier-3',
            problem: 'Use Parseval\'s theorem with the square wave to prove $\\frac{\\pi^2}{8} = 1 + \\frac{1}{9} + \\frac{1}{25} + \\cdots$',
            solution: `For the square wave, $f(x) = \\pm 1$ and:
$$b_n = \\frac{4}{n\\pi} \\text{ for odd } n$$

**Left side of Parseval:**
$$\\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} |f(x)|^2\\,dx = \\frac{1}{\\pi}\\int_{-\\pi}^{\\pi} 1\\,dx = 2$$

**Right side of Parseval:**
$$\\sum_{n=1,3,5,...}^{\\infty} b_n^2 = \\sum_{n \\text{ odd}} \\frac{16}{n^2\\pi^2}$$

$$= \\frac{16}{\\pi^2}\\left(1 + \\frac{1}{9} + \\frac{1}{25} + \\cdots\\right)$$

**Equating:**
$$2 = \\frac{16}{\\pi^2}\\left(1 + \\frac{1}{9} + \\frac{1}{25} + \\cdots\\right)$$

$$\\boxed{\\frac{\\pi^2}{8} = 1 + \\frac{1}{9} + \\frac{1}{25} + \\frac{1}{49} + \\cdots}$$`
          }
        ]
      },

      // =====================================================================
      // UNIT 11: LAPLACE TRANSFORM
      // =====================================================================
      {
        id: 'laplace-transform',
        title: 'Laplace Transform',
        description: 'Transform methods for solving ODEs with discontinuous forcing.',
        visualizations: ['LaplaceTransformVisualizer', 'FunctionPlot'],
        sections: [
          {
            title: 'Definition and Basic Transforms',
            content: `The **Laplace Transform** converts a function of time into a function of complex frequency:

$$\\mathcal{L}\\{f(t)\\} = F(s) = \\int_0^{\\infty} e^{-st}f(t)\\,dt$$

**Why use Laplace transforms?**
1. Converts ODEs into algebraic equations
2. Automatically incorporates initial conditions
3. Handles discontinuous forcing (step functions, impulses)
4. Useful for systems and control theory

**Basic Transform Pairs:**

| $f(t)$ | $F(s)$ | Condition |
|--------|--------|-----------|
| $1$ | $\\frac{1}{s}$ | $s > 0$ |
| $t^n$ | $\\frac{n!}{s^{n+1}}$ | $s > 0$ |
| $e^{at}$ | $\\frac{1}{s-a}$ | $s > a$ |
| $\\sin(\\omega t)$ | $\\frac{\\omega}{s^2+\\omega^2}$ | $s > 0$ |
| $\\cos(\\omega t)$ | $\\frac{s}{s^2+\\omega^2}$ | $s > 0$ |`
          },
          {
            title: 'Key Properties',
            content: `**Linearity:**
$$\\mathcal{L}\\{af + bg\\} = aF(s) + bG(s)$$

**Derivative Property (KEY!):**
$$\\mathcal{L}\\{f'(t)\\} = sF(s) - f(0)$$
$$\\mathcal{L}\\{f''(t)\\} = s^2F(s) - sf(0) - f'(0)$$

This is why Laplace transforms are perfect for IVPs—initial conditions appear automatically!

**Shifting in s (First Shifting Theorem):**
$$\\mathcal{L}\\{e^{at}f(t)\\} = F(s-a)$$

**Shifting in t (Second Shifting Theorem):**
$$\\mathcal{L}\\{u(t-a)f(t-a)\\} = e^{-as}F(s)$$

where $u(t-a)$ is the unit step function.

**Convolution:**
$$\\mathcal{L}\\{f * g\\} = F(s) \\cdot G(s)$$

where $(f * g)(t) = \\int_0^t f(\\tau)g(t-\\tau)\\,d\\tau$`
          },
          {
            title: 'Solving ODEs with Laplace',
            content: `**The Method:**
1. Take Laplace transform of entire ODE
2. Use derivative properties (ICs appear!)
3. Solve algebraically for $Y(s)$
4. Find $y(t) = \\mathcal{L}^{-1}\\{Y(s)\\}$

**Example:** Solve $y'' + 3y' + 2y = 0$, $y(0) = 1$, $y'(0) = 0$

**Step 1:** Transform
$$s^2Y - s(1) - 0 + 3(sY - 1) + 2Y = 0$$

**Step 2:** Solve for Y
$$(s^2 + 3s + 2)Y = s + 3$$
$$Y(s) = \\frac{s+3}{s^2+3s+2} = \\frac{s+3}{(s+1)(s+2)}$$

**Step 3:** Partial fractions
$$Y(s) = \\frac{2}{s+1} - \\frac{1}{s+2}$$

**Step 4:** Inverse transform
$$y(t) = 2e^{-t} - e^{-2t}$$`
          },
          {
            title: 'Step Functions and Discontinuous Forcing',
            content: `**Unit Step Function:**
$$u(t-a) = \\begin{cases} 0 & t < a \\\\ 1 & t \\geq a \\end{cases}$$

$$\\mathcal{L}\\{u(t-a)\\} = \\frac{e^{-as}}{s}$$

**Example: Turn on at t = 2**
The function $f(t) = \\sin(t) \\cdot u(t-2)$ is zero until $t = 2$, then equals $\\sin(t)$.

To find its transform, write:
$$f(t) = u(t-2)\\sin(t) = u(t-2)\\sin((t-2)+2)$$

Using the shift theorem and trig addition.

**Dirac Delta Function:**
$$\\delta(t-a) = \\lim_{\\epsilon \\to 0} \\text{(spike at } t=a \\text{)}$$

Properties:
$$\\int_{-\\infty}^{\\infty} f(t)\\delta(t-a)\\,dt = f(a)$$
$$\\mathcal{L}\\{\\delta(t-a)\\} = e^{-as}$$

**Physical meaning:** An instantaneous impulse (hammer blow, sudden voltage spike).`
          }
        ],
        practiceProblems: [
          {
            id: 'laplace-1',
            problem: 'Find $\\mathcal{L}\\{t^2 e^{3t}\\}$.',
            solution: `Use the **first shifting theorem**: $\\mathcal{L}\\{e^{at}f(t)\\} = F(s-a)$

We know: $\\mathcal{L}\\{t^2\\} = \\frac{2!}{s^3} = \\frac{2}{s^3}$

Therefore:
$$\\mathcal{L}\\{t^2 e^{3t}\\} = \\frac{2}{(s-3)^3}$$

Valid for $s > 3$.`
          },
          {
            id: 'laplace-2',
            problem: 'Solve using Laplace transforms: $y\' + 2y = e^{-t}$, $y(0) = 1$.',
            solution: `**Transform the ODE:**
$$sY - 1 + 2Y = \\frac{1}{s+1}$$

**Solve for Y:**
$$(s+2)Y = 1 + \\frac{1}{s+1} = \\frac{s+2}{s+1}$$
$$Y(s) = \\frac{1}{s+1}$$

**Inverse transform:**
$$y(t) = e^{-t}$$

**Verify:** $y' + 2y = -e^{-t} + 2e^{-t} = e^{-t}$ ✓
$y(0) = 1$ ✓`
          },
          {
            id: 'laplace-3',
            problem: 'Find the inverse Laplace transform of $F(s) = \\frac{s+5}{s^2+4s+13}$.',
            solution: `**Complete the square in denominator:**
$$s^2 + 4s + 13 = (s+2)^2 + 9 = (s+2)^2 + 3^2$$

**Rewrite numerator:**
$$s + 5 = (s+2) + 3$$

**Split:**
$$F(s) = \\frac{s+2}{(s+2)^2+9} + \\frac{3}{(s+2)^2+9}$$

**Use shifting theorem:** With $a = -2$, $\\omega = 3$:
$$\\mathcal{L}^{-1}\\left\\{\\frac{s+2}{(s+2)^2+9}\\right\\} = e^{-2t}\\cos(3t)$$
$$\\mathcal{L}^{-1}\\left\\{\\frac{3}{(s+2)^2+9}\\right\\} = e^{-2t}\\sin(3t)$$

**Answer:**
$$f(t) = e^{-2t}(\\cos 3t + \\sin 3t)$$`
          }
        ]
      },

      // =====================================================================
      // UNIT 12: CONVOLUTION AND TRANSFER FUNCTIONS
      // =====================================================================
      {
        id: 'convolution',
        title: 'Convolution & Transfer Functions',
        description: 'System response, impulse response, and frequency analysis.',
        visualizations: ['LaplaceTransformVisualizer', 'ResonanceVisualizer'],
        sections: [
          {
            title: 'The Convolution Integral',
            content: `**Definition:** The convolution of $f$ and $g$ is:
$$(f * g)(t) = \\int_0^t f(\\tau)g(t-\\tau)\\,d\\tau$$

**The Convolution Theorem:**
$$\\mathcal{L}\\{f * g\\} = F(s) \\cdot G(s)$$

This is incredibly useful: multiplication in the s-domain = convolution in the t-domain!

**Properties:**
- Commutative: $f * g = g * f$
- Associative: $(f * g) * h = f * (g * h)$
- Distributive: $f * (g + h) = f * g + f * h$
- Identity: $f * \\delta = f$

**Physical Interpretation:**
If $h(t)$ is a system's impulse response and $f(t)$ is the input, then:
$$\\text{Output} = f * h = \\int_0^t f(\\tau)h(t-\\tau)\\,d\\tau$$

The output is the "weighted average" of the input, where the weights are the impulse response.`
          },
          {
            title: 'Impulse and Step Response',
            content: `**Impulse Response $h(t)$:**
The system's output when the input is $\\delta(t)$.

For $y'' + by' + cy = f(t)$:
- Apply input $f(t) = \\delta(t)$
- The output $y(t) = h(t)$ with zero ICs

**Step Response $s(t)$:**
The system's output when the input is $u(t)$ (unit step).

**Relationship:**
$$s(t) = \\int_0^t h(\\tau)\\,d\\tau$$
$$h(t) = s'(t)$$

**Why these matter:**
1. Impulse response completely characterizes a linear system
2. Any output can be computed via convolution
3. Step response shows how system approaches steady state

**Example:** For $y' + 2y = f(t)$:
- Impulse response: $h(t) = e^{-2t}$
- Step response: $s(t) = \\frac{1}{2}(1 - e^{-2t})$`
          },
          {
            title: 'Transfer Functions',
            content: `**Definition:** The transfer function is:
$$H(s) = \\frac{Y(s)}{F(s)} = \\mathcal{L}\\{h(t)\\}$$

(assuming zero initial conditions)

For $y'' + by' + cy = f(t)$:
$$H(s) = \\frac{1}{s^2 + bs + c}$$

**Poles and Zeros:**
- **Poles:** Values where $H(s) \\to \\infty$ (roots of denominator)
- **Zeros:** Values where $H(s) = 0$ (roots of numerator)

**Stability from Poles:**
- All poles in left half-plane ($\\text{Re}(s) < 0$) → **stable**
- Any pole in right half-plane → **unstable**
- Poles on imaginary axis → **marginally stable**

**Example:** $H(s) = \\frac{1}{s^2 + 2s + 5}$
Poles: $s = -1 \\pm 2i$ (left half-plane)
→ System is stable (decaying oscillations)`
          },
          {
            title: 'Frequency Response',
            content: `**Key Insight:** For sinusoidal input, evaluate $H(s)$ at $s = i\\omega$:

$$H(i\\omega) = |H(i\\omega)|e^{i\\phi(\\omega)}$$

where:
- $|H(i\\omega)|$ = gain at frequency $\\omega$
- $\\phi(\\omega)$ = phase shift at frequency $\\omega$

**For input $f(t) = \\cos(\\omega t)$:**
$$y_{ss}(t) = |H(i\\omega)|\\cos(\\omega t + \\phi(\\omega))$$

**Bode Plots:**
Two graphs showing:
1. $20\\log_{10}|H(i\\omega)|$ vs $\\log\\omega$ (gain in dB)
2. $\\phi(\\omega)$ vs $\\log\\omega$ (phase in degrees)

**Resonance from $H(i\\omega)$:**
Peak of $|H(i\\omega)|$ occurs near poles closest to imaginary axis.

**Example:** $H(s) = \\frac{1}{s^2+0.2s+1}$

At $\\omega = 1$: $H(i) = \\frac{1}{-1+0.2i+1} = \\frac{1}{0.2i} = -5i$

Gain = 5, Phase = $-90°$ (resonance!)`
          }
        ],
        practiceProblems: [
          {
            id: 'conv-1',
            problem: 'Compute $(e^{-t}) * (e^{-2t})$ using the convolution theorem.',
            solution: `**Laplace transforms:**
$$\\mathcal{L}\\{e^{-t}\\} = \\frac{1}{s+1}, \\quad \\mathcal{L}\\{e^{-2t}\\} = \\frac{1}{s+2}$$

**Product:**
$$F(s) \\cdot G(s) = \\frac{1}{(s+1)(s+2)}$$

**Partial fractions:**
$$= \\frac{1}{s+1} - \\frac{1}{s+2}$$

**Inverse transform:**
$$(e^{-t}) * (e^{-2t}) = e^{-t} - e^{-2t}$$

**Verify directly:** The integral $\\int_0^t e^{-\\tau}e^{-2(t-\\tau)}d\\tau = e^{-t} - e^{-2t}$ ✓`
          },
          {
            id: 'conv-2',
            problem: 'Find the transfer function for the system $y\'\' + 4y\' + 3y = f(t)$. Locate the poles and determine stability.',
            solution: `**Transfer function:**
$$H(s) = \\frac{1}{s^2 + 4s + 3} = \\frac{1}{(s+1)(s+3)}$$

**Poles:** $s = -1$ and $s = -3$

**Location:** Both poles are in the **left half-plane** (negative real parts)

**Conclusion:** The system is **stable**.

Physical interpretation: Both modes $e^{-t}$ and $e^{-3t}$ decay, so any disturbance dies out.`
          },
          {
            id: 'conv-3',
            problem: 'For $H(s) = \\frac{1}{s^2+1}$, find the steady-state response to $f(t) = \\cos(2t)$.',
            solution: `**Evaluate $H(i\\omega)$ at $\\omega = 2$:**
$$H(2i) = \\frac{1}{(2i)^2 + 1} = \\frac{1}{-4+1} = \\frac{1}{-3} = -\\frac{1}{3}$$

**Magnitude and phase:**
$$|H(2i)| = \\frac{1}{3}$$
$$\\phi = \\pi \\text{ (since } H(2i) \\text{ is negative real)}$$

**Steady-state response:**
$$y_{ss}(t) = \\frac{1}{3}\\cos(2t + \\pi) = -\\frac{1}{3}\\cos(2t)$$

The output is attenuated by factor of 3 and inverted (180° phase shift).`
          }
        ]
      },

      // =====================================================================
      // REMAINING UNIT (placeholder for fourth quarter)
      // =====================================================================
      { id: 'systems', title: 'Systems of ODEs', description: 'Matrix methods and phase portraits.', visualizations: ['PhasePortrait'] },
    ],
  },
  {
    id: '6-100b',
    number: '6.100B',
    title: 'Computational Thinking and Data Science',
    description: 'Data, optimization, and ML basics.',
    color: 'bg-orange-600',
    units: [
      { id: 'complexity', title: 'Algorithmic Complexity', description: 'Big-O analysis.', visualizations: ['ComplexityChart'] },
      { id: 'optimization', title: 'Optimization', description: 'Optimization techniques.', visualizations: ['OptimizationPlot'] },
    ],
  },
];

// =============================================================================
// COURSE DATA ACCESS FUNCTIONS
// =============================================================================

/**
 * Get a course by its ID
 */
export function getCourse(id: string): Course | undefined {
  return courses.find((c) => c.id === id);
}

/**
 * Get a unit by course ID and unit ID
 */
export function getUnit(courseId: string, unitId: string): Unit | undefined {
  const course = getCourse(courseId);
  return course?.units.find((u) => u.id === unitId);
}

/**
 * Get all courses
 */
export function getAllCourses(): Course[] {
  return courses;
}
