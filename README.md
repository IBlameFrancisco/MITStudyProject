# MIT Visualizations

An interactive learning platform for MIT courses featuring 63+ visualizations, built with Next.js and deployed on GitHub Pages.

**Live Site:** [https://IBlameFrancisco.github.io/MITStudyProject/](https://IBlameFrancisco.github.io/MITStudyProject/)

## Courses

| Course | Title | Units |
|--------|-------|-------|
| 18.600 | Probability and Random Variables | 13 |
| 6.1210 | Algorithms | 14 |
| 18.03  | Differential Equations | 12 |
| 6.100B | Computational Thinking | 10 |

Each unit includes topic sections with LaTeX-rendered math, interactive visualizations (D3.js, Mafs), and practice problems with revealable solutions.

## Tech Stack

- **Framework:** Next.js 14 (App Router) with TypeScript
- **Styling:** Tailwind CSS + Framer Motion animations
- **Math:** KaTeX rendering, D3.js & Mafs visualizations
- **Deployment:** GitHub Pages via GitHub Actions (auto-deploys on push to `main`)

## Getting Started

```bash
cd mit-visualizations
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view locally.

## Project Structure

```
mit-visualizations/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── 18-600/             # Probability course
│   ├── 18-03/              # Differential Equations
│   ├── 6-1210/             # Algorithms
│   └── 6-100b/             # Computational Thinking
├── components/
│   ├── layout/             # Navbar, Sidebar, ClassCard
│   ├── ui/                 # Button, Slider, LaTeX, TopicSections, PracticeProblems
│   └── visualizations/     # Interactive viz components (probability, algorithms, diffeq, complexity)
├── lib/
│   ├── data/courses.ts     # All course content and metadata
│   ├── types/              # TypeScript interfaces
│   └── utils/              # Helper functions
└── .github/workflows/
    └── deploy.yml          # GitHub Pages CI/CD
```

## Adding Content

**New course:** Add data to `lib/data/courses.ts`, create `app/[course-id]/page.tsx` and `app/[course-id]/[unit]/page.tsx`.

**New unit:** Add to the course's `units` array in `lib/data/courses.ts` with `sections` and `practiceProblems`.

**New visualization:** Create component in `components/visualizations/[category]/`, reference it in the unit's `visualizations` array.

## Author

Francisco Zapata — Course 6-3 & 18 at MIT
