# MOD-6 Counter Traffic Light Lab

An interactive React + Vite + Three.js educational simulation for a first-year Digital System Design microproject. The app models a real MOD-6 counter, decodes the Q2/Q1/Q0 bits into one traffic-light output, and renders the signal as interactive 3D geometry.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL shown in the terminal. The app uses JavaScript, React, React Three Fiber, Drei, Three.js, Lucide icons, and CSS. There is no server, database, login, or API key.

For a production build:

```bash
npm run build
npm run preview
```

## Simulation controls

Use Start Simulation for automatic clock edges, Pause and Resume to hold or continue the current state, Next Clock Pulse for one deterministic transition, Reset Counter to return to 000, and the 0.5× / 1× / 2× / 5× controls to change the clock period. The legal sequence is `000 → 001 → 010 → 011 → 100 → 101 → 000`.

## Deploy free with Vercel

1. Push the project to a Git repository, or import the project folder directly in the Vercel dashboard.
2. Create a new Vercel project and select the repository.
3. Keep the framework preset as **Vite**. Vercel will detect the existing setup.
4. Use `npm run build` as the build command and `dist` as the output directory.
5. No environment variables are required. Deploy.

The site is a static frontend, so the free Vercel Hobby tier is sufficient.

## Gate-level circuit

The Logic map section includes a live schematic using standard digital symbols: triangular NOT gates with inversion bubbles and D-shaped AND gates. Wires, gate highlights, and output lamps follow the current Q2/Q1/Q0 state as the counter advances.

For a mutually exclusive one-hot traffic output, the red term is implemented as `RED = NOT Q2 AND NOT Q1`; using only `NOT Q2` would overlap with yellow in states 2 and 3. Yellow remains `NOT Q2 AND Q1`, and green remains `Q2 AND NOT Q1` for the six legal MOD-6 states.
