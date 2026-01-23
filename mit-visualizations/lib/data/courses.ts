/**
 * MIT Study Project - Course Data
 * ================================
 * Contains all course content including units, sections, and practice problems.
 */

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface PracticeProblem {
  id: string;
  problem: string;
  solution: string;
}

export interface TopicSection {
  title: string;
  content: string;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  sections?: TopicSection[];
  practiceProblems?: PracticeProblem[];
  visualizations: string[];
}

export interface Course {
  id: string;
  number: string;
  title: string;
  description: string;
  color: string;
  units: Unit[];
}

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

*Hint: Consider the coefficient of $x^n$ in $(1+x)^n(1+x)^n = (1+x)^{2n}$.*`,
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
        visualizations: ['ProbabilityTree'],
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
        visualizations: ['ProbabilityTree'],
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
        visualizations: ['DistributionPlot'],
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
        visualizations: ['DistributionPlot'],
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
        visualizations: ['DistributionPlot'],
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
        visualizations: ['DistributionPlot', 'MonteCarloSim'],
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
        visualizations: ['DistributionPlot', 'MonteCarloSim'],
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
        visualizations: ['MonteCarloSim'],
      },
    ],
  },
  {
    id: '6-1210',
    number: '6.1210',
    title: 'Introduction to Algorithms',
    description: 'Design and analysis of efficient algorithms.',
    color: 'bg-green-600',
    units: [
      { id: 'sorting', title: 'Sorting Algorithms', description: 'Compare sorting algorithms.', visualizations: ['SortingVisualizer'] },
      { id: 'graphs', title: 'Graph Algorithms', description: 'BFS, DFS, shortest paths.', visualizations: ['GraphVisualizer'] },
      { id: 'trees', title: 'Tree Data Structures', description: 'BSTs and traversals.', visualizations: ['TreeVisualizer'] },
    ],
  },
  {
    id: '18-03',
    number: '18.03',
    title: 'Differential Equations',
    description: 'ODEs, Laplace transform, and systems.',
    color: 'bg-purple-600',
    units: [
      { id: 'slope-fields', title: 'Slope Fields', description: 'Direction fields for ODEs.', visualizations: ['SlopeField'] },
      { id: 'phase-portraits', title: 'Phase Portraits', description: 'Systems analysis.', visualizations: ['PhasePortrait'] },
      { id: 'function-plots', title: 'Solution Curves', description: 'Plot solutions.', visualizations: ['FunctionPlot'] },
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
