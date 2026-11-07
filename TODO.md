# MOD-6 Counter Traffic Light Lab — TODO

## 1. Project foundation and visual system
- [ ] Create a React/Vite JavaScript project using free/open-source libraries only.
- [ ] Use a premium futuristic engineering simulation dashboard style with dark navy background, cyan and blue glowing accents, glassmorphism dashboard panels, clean typography, subtle animations, responsive desktop/laptop layout, and smooth 3D rendering.
- [ ] Keep the project serverless and avoid unnecessary external APIs.

## 2. Actual 3D traffic-light model
- [ ] Build actual Three.js 3D geometry rather than a static image or diagram.
- [ ] Include a realistic black traffic-light housing, three circular LED lights with red on top/yellow middle/green bottom, metallic pole and base, glowing materials, realistic shadows, environment lighting, ground plane, and grid floor.
- [ ] Allow mouse-drag rotation and mouse-wheel zoom; center and frame the model correctly.
- [ ] Make the active LED glow realistically, inactive LEDs appear dark, and visibly change the LEDs according to the counter.

## 3. MOD-6 counter and output logic
- [ ] Implement the real sequence `000 → 001 → 010 → 011 → 100 → 101 → 000` and decimal states `0 → 1 → 2 → 3 → 4 → 5 → 0`.
- [ ] Reset after state 5 and never remain in invalid states 110 or 111.
- [ ] Use Q2, Q1, Q0 and a working clock pulse mechanism with automatic transitions.
- [ ] Map states 0/1 to red, 2/3 to yellow, and 4/5 to green, with only one light on at a time.
- [ ] Implement and display `RED = NOT Q2`, `YELLOW = NOT Q2 AND Q1`, and `GREEN = Q2 AND NOT Q1`.

## 4. Working simulation controls
- [ ] Implement START SIMULATION, PAUSE, RESUME, RESET COUNTER, NEXT CLOCK PULSE, and clock speed controls.
- [ ] Support clock speeds 0.5x, 1x, 2x, and 5x.
- [ ] Ensure controls are functional and update visible simulation evidence rather than acting as decoration.

## 5. Digital counter display and state table
- [ ] Show current decimal count, three-bit binary output, Q2/Q1/Q0 indicators, current traffic-light state, clock pulse indicator, and reset status with glowing cyan digital-style numbers.
- [ ] Display the live state table for decimal 0–5 with Decimal, Q2, Q1, Q0, RED, YELLOW, GREEN columns.
- [ ] Automatically highlight the current state.

## 6. Educational simulation panels
- [ ] Add HOW IT WORKS explanations for MOD-6 counters, three flip-flops, clock pulses, binary counting, traffic outputs, and reset after state 5.
- [ ] Add a live block diagram `CLOCK → MOD-6 COUNTER → OUTPUT LOGIC → TRAFFIC LIGHT`.
- [ ] Add a live timing diagram for Clock, Q2, Q1, Q0, Red, Yellow, and Green that updates after each counter advance.
- [ ] Add VIVA MODE questions and answers including MOD-6 definition, three flip-flops, clock purpose, state-5 behavior, and synchronous versus asynchronous counters.

## 7. Presentation mode and responsive delivery
- [ ] Add PRESENTATION MODE that hides unnecessary navigation and controls, expands the 3D model, and clearly displays the counter and traffic-light state.
- [ ] Keep layout responsive for desktop, laptop, and narrow screens.
- [ ] Provide package metadata, installation instructions, npm run instructions, and free Vercel deployment guidance in the project README or interface footer.

## 8. Gate-level logical circuit schematic

- [x] Add a live standard-symbol logic circuit showing Q2, Q1, and Q0 feeding the output equations and RED/YELLOW/GREEN lamps.
- [x] Render NOT gates as triangular symbols with inversion bubbles and AND gates as D-shaped symbols, with wires and outputs highlighting HIGH/LOW according to the current counter state.
