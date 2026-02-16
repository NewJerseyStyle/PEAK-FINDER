# Optimization Game: Peak Finder Development Plan

## Game Overview

**Title**: Peak Finder (尋峰者)
**Core Concept**: Players are trapped in a 1D computer world and must find peaks to escape through higher dimensions back to the real world (4D).
**Target Platforms**: HTML5 (Canvas) for cross-platform play (mobile/desktop)
**Player Goal**: Reach target height zone in minimum steps to break through to the next dimension

## Narrative Arc

**Opening**: "ERROR: DIMENSIONAL COLLAPSE. You are trapped in a 1-dimensional space inside a computer. Find the highest peak to breach the dimensional barrier and escape."

- **1D (Levels 1-40)**: Trapped in a line. Learn optimization basics. Break through to 2D.
- **2D (Levels 41-100)**: Navigate a surface. Master advanced techniques. Break through to 3D.
- **3D (Levels 101-110)**: Final 10-level challenge. Escape the computer entirely.
- **Ending**: Tron-inspired Flynn derez sequence. Player escapes to "4D real world." Score recorded. IMDB easter egg link to Tron (1982).

## Key Features & User Experience

### 1. Visual Feedback System
- **Real-time Position Display**: Current coordinate (x, y, z) with color-coded height indicator
- **Height Points**: Visual markers showing visited locations with color gradients (blue→green→yellow→red based on height)
- **Path Visualization**: Connected line showing exploration trajectory
- **Height Trend Graph**: Live line chart showing height changes over time
- **Target Zone Indicator**: Visual boundary showing where "win" condition is met
- **Active Optimizer Badge**: Always visible — tells player which optimizer is active
- **Active Scheduler Badge**: Always visible — tells player which scheduler is active
- **Momentum Arrow**: Visual arrow showing accumulated velocity direction and magnitude
- **Effective Step Size Bar**: Shows current step size after scheduler modifications
- **"What Changed" Notifications**: Flash notification when entering a level with new mechanics

### 2. Data Display
- **Current Height**: Numeric display with visual bar indicator
- **Steps Taken**: Counter tracking total jumps
- **Step Size**: Current effective step size (after scheduler)
- **Optimizer Mode**: Currently active algorithm name with brief description
- **Scheduler Mode**: Currently active scheduler with visual indicator
- **Momentum**: Velocity magnitude (when momentum is active)

## Level Design Principles

**Rule**: Each level introduces only ONE new variable change. Players master each variation before moving to the next.

### Three Core Variables

1. **Dimension**: Space exploration (1D → 2D → 3D)
2. **Optimizer**: Movement strategy (SGD → Momentum → RMSprop → Adam)
3. **Scheduler**: Step size control (Fixed → Decay → Warmup → Cosine Annealing)

## Level Progression (110 Total Levels)

---

## Dimension 1 (1D Space) - Levels 1-40

**Focus**: Mastering basic movement and strategy in 1D space
**Narrative**: "Trapped in a line. Only left and right exist."

### 1.1 SGD + Fixed Step (Levels 1-8)
- *Tutorial L1*: "SGD: Move one step at a time. Go RIGHT. If height drops, turn back. Reach the summit!"
- *Challenge*: Finding peak in simple landscape

### 1.2 SGD + Step Decay (Levels 9-16)
- *Tutorial L9*: "STEP DECAY: Your step size shrinks 0.5% per jump. Hurry — find the peak before your steps become tiny!"
- *Challenge*: Must find peak efficiently before step size vanishes

### 1.3 SGD + Momentum (Levels 17-24)
- *Tutorial L17*: "MOMENTUM: You now have inertia! Consecutive same-direction jumps accelerate. Changing direction costs energy. Watch the velocity arrow!"
- *Challenge*: Understanding acceleration, overshooting

### 1.4 SGD + Momentum + Step Decay (Levels 25-32)
- *Tutorial L25*: "MOMENTUM + DECAY: Speed builds up but steps shrink over time. Balance momentum with precision!"
- *Terrain*: Introduce saddle points and plateaus

### 1.5 Adam + Fixed (Levels 33-40)
- *Tutorial L33*: "ADAM: Combines momentum AND adaptive step sizing. The all-rounder optimizer!"
- *Challenge*: Precision navigation

### Terrain Types for 1D:
- Simple hills (L1-8)
- Multi-peak with one dominant (L9-16)
- Plateau + peak requiring momentum (L17-24)
- Saddle points + deceptive local optima (L25-32)
- Narrow peaks + noise (L33-40)

---

## Dimension 2 (2D Space) - Levels 41-100

**Focus**: Applying learned techniques in 2D navigation
**Narrative**: "DIMENSION BREACH! 2D space unlocked. You can now move in four directions."

### 2.1 SGD + Fixed Step (Levels 41-50)
- *Tutorial L41*: "2D WORLD: You've escaped to 2D! Now explore X and Y. Brighter = higher. Find the brightest peak!"
- *Tutorial L41 also shows*: "Using SGD — you already know this from 1D."
- *Challenge*: Learning 2D navigation with familiar optimizer

### 2.2 SGD + Step Decay (Levels 51-58)
- *Tutorial L51*: "STEP DECAY returns in 2D! Steps shrink 0.5% per jump. Navigate efficiently!"
- *Terrain*: Ridge valleys (teaches why direction matters in 2D)

### 2.3 Momentum + Fixed (Levels 59-66)
- *Tutorial L59*: "MOMENTUM in 2D! Inertia now applies to BOTH X and Y. Watch the velocity arrow — momentum carries in your last direction!"
- *Terrain*: Introduce 2D saddle points

### 2.4 Momentum + Step Decay (Levels 67-74)
- *Tutorial L67*: "MOMENTUM + DECAY in 2D: Build speed but steps shrink. Master direction changes before it's too late!"
- *Terrain*: Rosenbrock-style banana valleys

### 2.5 Momentum + Warmup (Levels 75-82)
- *Tutorial L75*: "WARMUP: Steps start TINY and grow over 10 jumps. Be patient at the start — scout first, sprint later!"
- *Terrain*: Multi-modal with deceptive peaks

### 2.6 RMSprop + Fixed (Levels 83-90)
- *Tutorial L83*: "RMSprop: Adapts step size per direction! Steep directions get smaller steps, flat directions get larger. Great for ravines!"
- *Terrain*: Narrow ravines and elongated valleys

### 2.7 Adam + Fixed (Levels 91-95)
- *Tutorial L91*: "ADAM in 2D: Momentum + RMSprop combined. The ultimate optimizer. Can you reach the peak?"
- *Terrain*: Complex multi-modal landscapes

### 2.8 Adam + Cosine Annealing (Levels 96-100)
- *Tutorial L96*: "COSINE ANNEALING: Step size follows a smooth cosine curve — large at start, tiny at end. Explore broadly first, then fine-tune!"
- *Terrain*: Most challenging 2D landscapes
- *Level 100*: "FINAL 2D BARRIER: Break through to 3D!"

---

## Dimension 3 (3D Space) - Levels 101-110

**Focus**: Final 10-level challenge in 3D space
**Narrative**: "FINAL DIMENSION! 3D space. Navigate X, Y, Z to find the peak and escape the computer!"
**Visualization**: Three 2D slice views (XY, XZ, YZ) — current slice opaque, others semi-transparent

### 3.1 SGD + Fixed (Levels 101-103)
- *Tutorial L101*: "3D WORLD! Three axes to navigate. Use WASD for XY, QE for Z-axis. Slice views show your cross-sections."
- *Challenge*: Coordinate management with familiar optimizer

### 3.2 Momentum + Fixed (Levels 104-106)
- *Tutorial L104*: "MOMENTUM in 3D! Inertia in all three axes. Watch the slice views — each shows a different perspective."
- *Challenge*: 3D momentum with direction changes

### 3.3 Adam + Cosine Annealing (Levels 107-110)
- *Tutorial L107*: "ADAM + COSINE in 3D: The ultimate challenge. All techniques combined in 3D space."
- *Level 110*: "FINAL PEAK: Escape the computer forever!"

---

## Terrain Generation — Optimization-Realistic Challenges

### Terrain Types
1. **Simple Hill**: Single Gaussian peak. Easy. (Early levels)
2. **Multi-Modal**: Multiple peaks of varying height. Player must find the global optimum. (Mid levels)
3. **Plateau**: Large flat area requiring momentum to traverse. Gradient ~0. (Momentum levels)
4. **Saddle Point**: Gradient is zero but it's NOT a peak — goes up in one direction, down in another. (L25+)
5. **Ridge/Ravine**: Narrow valley where only one direction has useful gradient. Shows RMSprop advantage. (L83+)
6. **Rosenbrock Valley**: Banana-shaped valley. Easy to find the valley, hard to find the minimum within it. (L67+)
7. **Noisy Landscape**: Small random perturbations on top of true terrain. Tests robustness. (L33+)
8. **Deceptive Multi-Peak**: Several peaks of near-equal height. Only one is the true target. (L75+)

### Why These Matter Educationally
- **Plateau** → teaches why momentum is essential (SGD gets stuck)
- **Saddle point** → teaches the difference between "no gradient" and "at the peak"
- **Ridge** → teaches why per-parameter learning rates (RMSprop/Adam) help
- **Rosenbrock** → teaches why combining techniques matters
- **Noisy** → teaches why adaptive methods smooth out noise

## Tron Ending Sequence (After Level 110)

**Trigger**: Player completes Level 110
**Sequence**:
1. Screen text: "DIMENSIONAL BARRIER BROKEN"
2. Flynn-style golden light orb pulsates at center (3 seconds)
3. Orb explodes into 200 golden fragments (derez effect from Tron 1982)
4. Fragments scatter and fade
5. Screen fades to: "WELCOME BACK TO THE REAL WORLD"
6. Score summary: Total stars, total steps, favorite optimizer
7. Easter egg: "This journey was inspired by Tron (1982) — [IMDB](https://www.imdb.com/title/tt0084827/)"
8. "End of line." (Tron reference)

## Player Controls

- **1D**: Left/Right arrows
- **2D**: Arrow keys (up/down/left/right)
- **3D**: Arrow keys for XY + Q/E for Z-axis
- **Step magnitude**: Slider control (when optimizer allows)

## Technical Architecture

### Core Components

1. **Game Engine** (Canvas-based)
2. **Terrain Generator** with optimization-realistic terrain types
3. **Optimizer Logic** (SGD, Momentum, RMSprop, Adam)
4. **Scheduler System** (Fixed, Step Decay, Warmup, Cosine Annealing)
5. **3D Slice Visualizer** — three 2D cross-section views
6. **Tutorial System** — contextual explanations on mechanic changes
7. **Narrative System** — dimension escape story
8. **Tron Ending** — derez animation sequence

## References

- Tron (1982) — IMDB: https://www.imdb.com/title/tt0084827/
- Standard Optimization Algorithms (SGD, Momentum, RMSprop, Adam)
- Learning Rate Scheduling Strategies
- Game Design Principles for Education
