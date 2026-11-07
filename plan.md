# MOD-6 Counter Traffic Light Lab — Implementation Plan

## Scope
Build a complete single-page React/Vite educational simulation for a B.Tech Digital System Design microproject. The experience combines a real Three.js traffic signal model with a deterministic MOD-6 counter, working controls, state table, equations, live waveforms, and viva learning content. No backend or external API is required.

## Design direction

### Considered styles
- **Neon Instrument Console** — 0.06 probability: a cyan-on-navy laboratory console with luminous telemetry.
- **Industrial Control Room** — 0.07 probability: graphite panels, amber warning accents, and dense operator controls.
- **Aerospace Test Bench** — 0.05 probability: modular diagnostic tiles, hard-edged grids, and mission-style status labels.

### Chosen style: Neon Instrument Console
- **Design movement:** premium scientific dashboard / cyber-physical instrumentation.
- **Core principles:** state first, evidence over decoration, visible cause-and-effect, calm density.
- **Color philosophy:** deep navy and ink create a stable lab environment; cyan is the ownable signal color for truth/telemetry; red, yellow, and green are reserved for the physical output channels.
- **Layout paradigm:** a command header feeds into an asymmetric two-column instrument bay, then expands into evidence panels and teaching modules; the 3D model is the visual anchor rather than a decorative hero image.
- **Signature elements:** fine cyan scanlines, compact monospace telemetry labels, and a luminous “signal rail” used in the block diagram and waveform legends.
- **Interaction philosophy:** every control changes a visible piece of evidence immediately; controls are grouped by operator intent (run, step, reset) and status stays legible at a glance.
- **Animation:** active lamps breathe subtly, the clock pulse flashes as a crisp event, panels rise with short easing, and motion pauses cleanly with the simulation.
- **Typography system:** Inter for readable UI and Space Mono for bits, equations, counters, and diagnostic labels; large headings use tight tracking and short line lengths.
- **Brand essence:** a hands-on digital electronics bench for explaining sequential logic — precise, cinematic, teachable.
- **Brand voice:** concise and evidence-led. Example lines: “Advance the edge. Watch the outputs resolve.” and “Six legal states. One visible signal path.”
- **Wordmark / logo:** a three-node signal mark nested inside a rounded square, paired with a compact MOD-6 LAB wordmark.
- **Signature brand color:** electric cyan `#5de4ff`.

## Implementation approach

- `src/App.jsx` owns the MOD-6 state machine, run/pause/resume/reset actions, speed selection, presentation mode, state history, and composition of the dashboard.
- `src/components/TrafficScene.jsx` renders the actual traffic-light geometry with React Three Fiber, Drei orbit controls, emissive lamps, metallic pole/base, ground plane, grid, shadows, and responsive camera framing.
- `src/components/Waveform.jsx` converts the state history into a live SVG timing diagram for clock, Q2/Q1/Q0, and red/yellow/green.
- `src/styles.css` provides the responsive neon-instrument visual system, glass surfaces, typography, states, animations, presentation-mode layout, and mobile fallbacks.
- `public/manus-routes.json` declares the single `/` route for preview and publication tooling.
- No database, server, authentication, or asset API is needed. All state is local and deterministic.

## Project structure

```text
mod6lab/
├── public/
│   └── manus-routes.json
├── src/
│   ├── components/
│   │   ├── TrafficScene.jsx
│   │   └── Waveform.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
├── app.config.ts
├── index.html
├── package.json
└── plan.md / TODO.md
```

## Build workflow

1. Install the pinned npm dependency set.
2. Run the Vite development server on the configured port 3000.
3. Verify the route manifest and application response.
4. Run the production build to validate the bundle.
5. Inspect diagnostics and capture a preview screenshot for layout validation.
6. Commit the intended files to the canonical `main` branch so the project has a recoverable checkpoint.
