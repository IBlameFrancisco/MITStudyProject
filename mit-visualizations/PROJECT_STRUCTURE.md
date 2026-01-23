# MIT Study Project - Project Structure

## Tech Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js (App Router) | 14.2.35 |
| **Language** | TypeScript | 5.9.3 |
| **UI Library** | React | 18.3.1 |
| **Styling** | Tailwind CSS | 3.4.1 |
| **Animations** | Framer Motion | 12.29.0 |
| **Math Rendering** | KaTeX | 0.16.27 |
| **Data Visualization** | D3.js | 7.9.0 |
| **Math Visualization** | Mafs | 0.21.0 |

## Directory Structure

```
mit-visualizations/
│
├── app/                          # Next.js App Router (Pages)
│   ├── layout.tsx                # Root layout (Navbar, Sidebar, KaTeX CSS)
│   ├── page.tsx                  # Home page (dashboard)
│   ├── globals.css               # Global styles
│   │
│   ├── 18-600/                   # 18.600 Probability course
│   │   ├── page.tsx              # Course overview page
│   │   └── [unit]/page.tsx       # Dynamic unit pages
│   │
│   ├── 18-03/                    # 18.03 Differential Equations
│   │   ├── page.tsx
│   │   └── [unit]/page.tsx
│   │
│   ├── 6-1210/                   # 6.1210 Algorithms
│   │   ├── page.tsx
│   │   └── [unit]/page.tsx
│   │
│   └── 6-100b/                   # 6.100B Computational Thinking
│       ├── page.tsx
│       └── [unit]/page.tsx
│
├── components/                   # React Components
│   ├── index.ts                  # Central exports for all components
│   │
│   ├── layout/                   # Page layout components
│   │   ├── Navbar.tsx            # Top navigation bar
│   │   ├── Sidebar.tsx           # Side navigation
│   │   └── ClassCard.tsx         # Course card component
│   │
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx            # Button component
│   │   ├── Slider.tsx            # Range slider
│   │   ├── ControlPanel.tsx      # Control panel container
│   │   ├── LaTeX.tsx             # LaTeX math rendering
│   │   ├── TopicSections.tsx     # Course topic sections
│   │   └── PracticeProblems.tsx  # Practice problems with solutions
│   │
│   └── visualizations/           # Interactive visualizations
│       ├── probability/          # Probability visualizations
│       │   ├── DistributionPlot.tsx
│       │   ├── MonteCarloSim.tsx
│       │   └── ProbabilityTree.tsx
│       │
│       ├── algorithms/           # Algorithm visualizations
│       │   ├── SortingVisualizer.tsx
│       │   ├── GraphVisualizer.tsx
│       │   └── TreeVisualizer.tsx
│       │
│       ├── diffeq/               # Differential equations visualizations
│       │   ├── SlopeField.tsx
│       │   ├── PhasePortrait.tsx
│       │   └── FunctionPlot.tsx
│       │
│       └── complexity/           # Complexity visualizations
│           ├── ComplexityChart.tsx
│           └── OptimizationPlot.tsx
│
├── lib/                          # Library code
│   ├── data/                     # Data files
│   │   └── courses.ts            # Course content (units, sections, problems)
│   │
│   ├── types/                    # TypeScript type definitions
│   │   └── index.ts              # All shared types
│   │
│   └── utils/                    # Utility functions
│       └── index.ts              # Helper functions
│
├── public/                       # Static assets
│
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── next.config.js                # Next.js configuration
```

## Key Files

### Data
- **`lib/data/courses.ts`** - All course content including:
  - Course metadata (id, number, title, description)
  - Units with sections and practice problems
  - LaTeX-formatted mathematical content

### Types
- **`lib/types/index.ts`** - TypeScript interfaces:
  - `Course`, `Unit`, `TopicSection`, `PracticeProblem`
  - Visualization parameter types

### Components
- **`components/ui/LaTeX.tsx`** - Renders math using KaTeX
- **`components/ui/TopicSections.tsx`** - Displays course topics
- **`components/ui/PracticeProblems.tsx`** - Problems with animated reveals

## LaTeX Content Guidelines

In course content, use:
- `$...$` for inline math: `The formula $E[X] = \\mu$ shows...`
- `$$...$$` for block math: `$$\\int_0^\\infty f(x) dx = 1$$`
- Escape backslashes in JS strings: `\\frac`, `\\sum`, etc.

## Adding New Content

### New Course
1. Add course data to `lib/data/courses.ts`
2. Create `app/[course-id]/page.tsx` (course overview)
3. Create `app/[course-id]/[unit]/page.tsx` (unit pages)

### New Unit
1. Add unit to course's `units` array in `lib/data/courses.ts`
2. Include `sections` array with topic content
3. Include `practiceProblems` array with exercises

### New Visualization
1. Create component in `components/visualizations/[category]/`
2. Add visualization name to unit's `visualizations` array
3. Import and add to visualization map in unit page
