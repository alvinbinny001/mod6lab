import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Activity,
  ArrowRight,
  BookOpen,
  BrainCircuit,
  ChevronDown,
  CirclePause,
  CirclePlay,
  Gauge,
  Grid3X3,
  Info,
  Lightbulb,
  Maximize2,
  Minimize2,
  MonitorPlay,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Signal,
  SlidersHorizontal,
  StepForward,
  TimerReset,
  Waves,
  Zap,
} from 'lucide-react'
import TrafficScene from './components/TrafficScene'
import Waveform from './components/Waveform'

const SPEEDS = [0.5, 1, 2, 5]

const STATE_ROWS = Array.from({ length: 6 }, (_, decimal) => {
  const [q2, q1, q0] = decimal.toString(2).padStart(3, '0').split('').map(Number)
  return {
    decimal,
    q2,
    q1,
    q0,
    red: Number(!q2 && !q1),
    yellow: Number(!q2 && q1),
    green: Number(q2 && !q1),
    light: decimal < 2 ? 'RED' : decimal < 4 ? 'YELLOW' : 'GREEN',
  }
})

const snapshotForState = (decimal, clock = 0) => ({
  ...STATE_ROWS[decimal],
  clock,
})

const VIVA_ITEMS = [
  {
    question: 'What is a MOD-6 counter?',
    answer: 'A MOD-6 counter is a sequential circuit with six valid states. It counts from 0 through 5 and then returns to 0, so the sequence repeats every six clock pulses.',
  },
  {
    question: 'Why are three flip-flops required?',
    answer: 'Three flip-flops provide 2³ = 8 possible binary combinations. That capacity is enough to represent six states, while the two unused combinations, 110 and 111, are excluded by the MOD-6 reset behavior.',
  },
  {
    question: 'What is the purpose of a clock?',
    answer: 'The clock supplies the timing edge that tells the counter when to move to the next state. One clean pulse produces one deterministic state transition.',
  },
  {
    question: 'What happens after state 5?',
    answer: 'The next-state logic wraps the counter to 000. This is the MOD-6 reset boundary, which keeps the state machine inside its six legal states.',
  },
  {
    question: 'Synchronous vs asynchronous counters?',
    answer: 'In a synchronous counter, all flip-flops share the same clock edge, giving predictable timing. In an asynchronous ripple counter, the clock propagates through the flip-flops, which can create small propagation delays between bit changes.',
  },
]

const HOW_IT_WORKS = [
  ['01', 'Six legal states', 'MOD-6 means the circuit has six repeating states: 000, 001, 010, 011, 100, and 101.'],
  ['02', 'Three flip-flops', 'Three bits are needed because two flip-flops can represent only four states; three can represent up to eight.'],
  ['03', 'Clock edge', 'Every clock pulse advances the state machine by one step and updates the output logic at the same instant.'],
  ['04', 'Output decode', 'The counter bits feed simple Boolean equations that select exactly one traffic-light color.'],
  ['05', 'Binary → visible signal', 'Q2, Q1, and Q0 make the state explicit, while the decoded output turns that state into a lamp.'],
  ['06', 'Reset boundary', 'After 101, the next legal state is 000, preventing invalid 110 and 111 states from appearing.'],
]

function NotGate({ x, y, active }) {
  return (
    <g className={`gate-symbol not-gate ${active ? 'gate-high' : 'gate-low'}`} transform={`translate(${x} ${y})`}>
      <path d="M 0 -25 L 0 25 L 50 0 Z" />
      <circle cx="58" cy="0" r="6" />
      <text x="18" y="4">NOT</text>
    </g>
  )
}

function AndGate({ x, y, active }) {
  return (
    <g className={`gate-symbol and-gate ${active ? 'gate-high' : 'gate-low'}`} transform={`translate(${x} ${y})`}>
      <path d="M 0 -28 H 27 A 28 28 0 0 1 27 28 H 0 Z" />
      <text x="10" y="4">AND</text>
    </g>
  )
}

function CircuitOutput({ x, y, label, active, color }) {
  return (
    <g className={`circuit-output ${active ? 'output-high' : 'output-low'}`} transform={`translate(${x} ${y})`}>
      <circle className="output-ring" r="15" />
      <circle className="output-core" r="7" style={{ '--lamp-color': color }} />
      <text x="25" y="4">{label}</text>
      <text className="output-value" x="25" y="18">{active ? 'HIGH' : 'LOW'}</text>
    </g>
  )
}

function LogicCircuit({ row }) {
  return (
    <section className="circuit-card card-surface" id="circuit">
      <div className="panel-heading compact">
        <div><div className="mini-label"><BrainCircuit size={13} /> GATE-LEVEL IMPLEMENTATION</div><h2>Logical circuit <span>/</span> standard symbols</h2></div>
        <div className="circuit-live-state"><span className="live-line" /> LIVE {row.q2}{row.q1}{row.q0}</div>
      </div>
      <div className="circuit-viewport">
        <svg className="logic-circuit" viewBox="0 0 980 350" role="img" aria-label="Gate-level logic circuit for red, yellow, and green traffic-light outputs">
          <defs>
            <pattern id="circuitGrid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(93,228,255,.07)" strokeWidth="1" /></pattern>
          </defs>
          <rect width="980" height="350" fill="url(#circuitGrid)" opacity=".62" />
          <line className="circuit-rail" x1="120" y1="30" x2="120" y2="318" />
          <text className="circuit-rail-label" x="36" y="24">COUNTER OUTPUTS</text>

          <g className="circuit-lane red-lane">
            <text className="lane-name" x="36" y="67">RED</text><text className="input-tag" x="78" y="36">Q2</text><text className="input-tag" x="78" y="91">Q1</text>
            <line className={`wire ${row.q2 ? 'wire-high' : 'wire-low'}`} x1="120" y1="39" x2="205" y2="39" />
            <NotGate x={205} y={39} active={!row.q2} />
            <line className={`wire ${!row.q2 ? 'wire-high' : 'wire-low'}`} x1="269" y1="39" x2="385" y2="39" />
            <line className={`wire ${row.q1 ? 'wire-high' : 'wire-low'}`} x1="120" y1="82" x2="205" y2="82" />
            <NotGate x={205} y={82} active={!row.q1} />
            <line className={`wire ${!row.q1 ? 'wire-high' : 'wire-low'}`} x1="269" y1="82" x2="385" y2="82" />
            <AndGate x={385} y={60} active={row.red} />
            <line className={`wire ${row.red ? 'wire-high' : 'wire-low'}`} x1="440" y1="60" x2="805" y2="60" />
            <CircuitOutput x={835} y={60} label="RED" active={row.red} color="var(--red)" />
          </g>

          <g className="circuit-lane yellow-lane">
            <text className="lane-name" x="27" y="170">YELLOW</text><text className="input-tag" x="78" y="140">Q2</text><text className="input-tag" x="78" y="196">Q1</text>
            <line className={`wire ${row.q2 ? 'wire-high' : 'wire-low'}`} x1="120" y1="145" x2="205" y2="145" />
            <NotGate x={205} y={145} active={!row.q2} />
            <line className={`wire ${!row.q2 ? 'wire-high' : 'wire-low'}`} x1="269" y1="145" x2="385" y2="145" />
            <line className={`wire ${row.q1 ? 'wire-high' : 'wire-low'}`} x1="120" y1="190" x2="385" y2="190" />
            <AndGate x={385} y={168} active={row.yellow} />
            <line className={`wire ${row.yellow ? 'wire-high' : 'wire-low'}`} x1="440" y1="168" x2="805" y2="168" />
            <CircuitOutput x={835} y={168} label="YELLOW" active={row.yellow} color="var(--yellow)" />
          </g>

          <g className="circuit-lane green-lane">
            <text className="lane-name" x="36" y="278">GREEN</text><text className="input-tag" x="78" y="247">Q2</text><text className="input-tag" x="78" y="307">Q1</text>
            <line className={`wire ${row.q2 ? 'wire-high' : 'wire-low'}`} x1="120" y1="252" x2="385" y2="252" />
            <line className={`wire ${row.q1 ? 'wire-high' : 'wire-low'}`} x1="120" y1="300" x2="205" y2="300" />
            <NotGate x={205} y={300} active={!row.q1} />
            <line className={`wire ${!row.q1 ? 'wire-high' : 'wire-low'}`} x1="269" y1="300" x2="385" y2="300" />
            <AndGate x={385} y={276} active={row.green} />
            <line className={`wire ${row.green ? 'wire-high' : 'wire-low'}`} x1="440" y1="276" x2="805" y2="276" />
            <CircuitOutput x={835} y={276} label="GREEN" active={row.green} color="var(--green)" />
          </g>
        </svg>
      </div>
      <div className="circuit-legend"><span><i className="symbol-preview not-preview" /> NOT = triangle + inversion bubble</span><span><i className="symbol-preview and-preview" /> AND = D-shaped gate</span><span><i className="wire-preview" /> HIGH signal</span></div>
    </section>
  )
}

function App() {
  const [currentState, setCurrentState] = useState(0)
  const [status, setStatus] = useState('stopped')
  const [speed, setSpeed] = useState(1)
  const [pulseCount, setPulseCount] = useState(0)
  const [pulseFlash, setPulseFlash] = useState(false)
  const [presentationMode, setPresentationMode] = useState(false)
  const [history, setHistory] = useState(() => [snapshotForState(0, 0)])
  const [openViva, setOpenViva] = useState(0)
  const flashTimer = useRef(null)

  const currentRow = STATE_ROWS[currentState]
  const activeLight = currentRow.light
  const isRunning = status === 'running'
  const isPaused = status === 'paused'

  const triggerPulseFlash = useCallback(() => {
    setPulseFlash(true)
    window.clearTimeout(flashTimer.current)
    flashTimer.current = window.setTimeout(() => setPulseFlash(false), 360)
  }, [])

  const nextClockPulse = useCallback(() => {
    setCurrentState((previous) => {
      const nextState = (previous + 1) % 6
      setHistory((previousHistory) => {
        const previousClock = previousHistory[previousHistory.length - 1]?.clock ?? 0
        return [...previousHistory, snapshotForState(nextState, previousClock ? 0 : 1)].slice(-14)
      })
      return nextState
    })
    setPulseCount((count) => count + 1)
    triggerPulseFlash()
  }, [triggerPulseFlash])

  useEffect(() => {
    if (!isRunning) return undefined
    const interval = window.setInterval(nextClockPulse, 1500 / speed)
    return () => window.clearInterval(interval)
  }, [isRunning, nextClockPulse, speed])

  useEffect(() => () => window.clearTimeout(flashTimer.current), [])

  const resetCounter = () => {
    setStatus('stopped')
    setCurrentState(0)
    setHistory([snapshotForState(0, 0)])
    setPulseCount(0)
    setPulseFlash(false)
  }

  const startSimulation = () => setStatus('running')
  const pauseSimulation = () => setStatus('paused')
  const resumeSimulation = () => setStatus('running')

  const statusCopy = useMemo(() => ({
    stopped: { label: 'READY', note: 'Awaiting clock input', tone: 'idle' },
    running: { label: 'RUNNING', note: `${speed}× clock stream active`, tone: 'live' },
    paused: { label: 'PAUSED', note: 'State held at current edge', tone: 'paused' },
  }), [speed])

  return (
    <div className={`app-shell ${presentationMode ? 'is-presentation' : ''}`}>
      <header className="topbar">
        <a className="brand-lockup" href="#top" aria-label="MOD-6 Lab home">
          <span className="brand-mark" aria-hidden="true"><i /><i /><i /></span>
          <span>
            <strong>MOD<span>6</span> LAB</strong>
            <small>DIGITAL SYSTEMS / 01</small>
          </span>
        </a>
        <nav className="topnav" aria-label="Primary navigation">
          <a href="#simulation">Simulation</a>
          <a href="#logic">Logic map</a>
          <a href="#circuit">Circuit</a>
          <a href="#timing">Timing</a>
          <a href="#viva">Viva mode</a>
        </nav>
        <div className="topbar-actions">
          <div className="system-health"><span className="health-dot" /> SYSTEM ONLINE</div>
          <button className="icon-action" onClick={() => setPresentationMode((value) => !value)} title="Toggle presentation mode" aria-label="Toggle presentation mode">
            {presentationMode ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </header>

      <main id="top" className="page-content">
        <section className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> DSD MICROPROJECT <span className="eyebrow-slash">/</span> LIVE SIMULATION</div>
            <h1>MOD-6 counter.<br /><em>Visible logic.</em></h1>
            <p className="hero-lede">A hands-on laboratory for translating binary state transitions into a single, unmistakable traffic signal.</p>
            <div className="hero-actions">
              <button className="primary-button" onClick={isRunning ? pauseSimulation : startSimulation}>
                {isRunning ? <Pause size={17} /> : <Play size={17} />}
                {isRunning ? 'Pause simulation' : 'Start simulation'}
              </button>
              <button className="secondary-button" onClick={() => setPresentationMode((value) => !value)}>
                <MonitorPlay size={17} /> {presentationMode ? 'Exit presentation' : 'Presentation mode'}
              </button>
            </div>
          </div>
          <div className="hero-readout card-surface">
            <div className="hero-readout__top">
              <span className="mini-label">CURRENT TELEMETRY</span>
              <span className={`status-pill ${statusCopy[status].tone}`}><span /> {statusCopy[status].label}</span>
            </div>
            <div className="hero-readout__number">0{currentState}</div>
            <div className="hero-readout__meta">
              <span>STATE INDEX</span>
              <strong>{currentRow.q2}{currentRow.q1}{currentRow.q0}</strong>
              <span>ACTIVE OUTPUT</span>
              <strong className={`signal-word ${activeLight.toLowerCase()}`}>{activeLight}</strong>
            </div>
            <div className="readout-rule"><span style={{ width: `${((currentState + 1) / 6) * 100}%` }} /></div>
            <div className="hero-readout__footer"><span>SEQUENCE POSITION</span><span>{currentState + 1} / 6</span></div>
          </div>
        </section>

        <section className="instrument-bay" id="simulation">
          <div className="scene-card card-surface">
            <div className="panel-heading">
              <div>
                <div className="mini-label"><Radio size={13} /> 3D OUTPUT DEVICE</div>
                <h2>Traffic signal <span>/</span> physical state</h2>
              </div>
              <div className="scene-controls-hint"><Grid3X3 size={15} /> DRAG TO ORBIT <span /> SCROLL TO ZOOM</div>
            </div>
            <div className="scene-stage">
              <TrafficScene activeLight={activeLight} pulseFlash={pulseFlash} />
              <div className="scene-overlay-label top-left"><span className="crosshair" /> LIVE GEOMETRY</div>
              <div className="scene-overlay-label top-right">R3F / THREE.JS</div>
              <div className="scene-overlay-label bottom-left"><span className="signal-trace" /> OUTPUT CHANNEL // {activeLight}</div>
              {presentationMode && (
                <div className="presentation-overlay">
                  <span className="mini-label">LIVE COUNTER OUTPUT</span>
                  <strong>{currentState}</strong>
                  <div>{currentRow.q2}{currentRow.q1}{currentRow.q0} <span>/</span> {activeLight}</div>
                </div>
              )}
            </div>
            <div className="scene-footer">
              <div className="scene-stat"><span className="scene-stat-icon red"><i /></span><span>RED</span><strong>{currentRow.red ? 'ON' : 'OFF'}</strong></div>
              <div className="scene-stat"><span className="scene-stat-icon yellow"><i /></span><span>YELLOW</span><strong>{currentRow.yellow ? 'ON' : 'OFF'}</strong></div>
              <div className="scene-stat"><span className="scene-stat-icon green"><i /></span><span>GREEN</span><strong>{currentRow.green ? 'ON' : 'OFF'}</strong></div>
              <div className="scene-status-note"><span className="live-line" /> OUTPUTS DECODED FROM Q2 / Q1 / Q0</div>
            </div>
          </div>

          <aside className="control-card card-surface" aria-label="Simulation controls">
            <div className="panel-heading compact">
              <div>
                <div className="mini-label"><SlidersHorizontal size={13} /> OPERATOR CONSOLE</div>
                <h2>Simulation controls</h2>
              </div>
              <span className="panel-number">01</span>
            </div>
            <div className="console-status">
              <div className={`console-status-icon ${statusCopy[status].tone}`}><Activity size={20} /></div>
              <div><span className="mini-label">CLOCK STATUS</span><strong>{statusCopy[status].label}</strong><small>{statusCopy[status].note}</small></div>
              <span className="status-bars"><i /><i /><i /></span>
            </div>
            <div className="control-stack">
              <button className="control-button primary" onClick={startSimulation} disabled={isRunning}><CirclePlay size={18} /> START SIMULATION <span>↵</span></button>
              <div className="control-pair">
                <button className="control-button" onClick={pauseSimulation} disabled={!isRunning}><CirclePause size={18} /> PAUSE</button>
                <button className="control-button" onClick={resumeSimulation} disabled={!isPaused}><CirclePlay size={18} /> RESUME</button>
              </div>
              <button className="control-button pulse-button" onClick={nextClockPulse}><StepForward size={18} /> NEXT CLOCK PULSE <span className="pulse-key">SPACE</span></button>
              <button className="control-button reset-button" onClick={resetCounter}><RotateCcw size={17} /> RESET COUNTER</button>
            </div>
            <div className="speed-control">
              <div className="speed-label"><span><Gauge size={14} /> CLOCK SPEED</span><strong>{speed}×</strong></div>
              <div className="speed-options" role="group" aria-label="Clock speed">
                {SPEEDS.map((value) => <button key={value} className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)} aria-pressed={speed === value}>{value}×</button>)}
              </div>
              <div className="speed-scale"><span>0.5× SLOW</span><span>5× FAST</span></div>
            </div>
            <div className="operator-tip"><Info size={15} /><span>Use <strong>Next Clock Pulse</strong> to inspect each legal state one edge at a time.</span></div>
          </aside>
        </section>

        <section className="telemetry-grid">
          <div className="counter-card card-surface">
            <div className="panel-heading compact">
              <div><div className="mini-label"><Zap size={13} /> DIGITAL COUNTER DISPLAY</div><h2>State telemetry</h2></div>
              <div className="pulse-indicator"><span className={pulseFlash ? 'flash' : ''} /> CLK {String(pulseCount).padStart(2, '0')}</div>
            </div>
            <div className="counter-readout-row">
              <div className="counter-big"><span className="mini-label">DECIMAL COUNT</span><strong>{currentState}</strong><small>MOD-6</small></div>
              <div className="binary-readout"><span className="mini-label">BINARY OUTPUT</span><strong>{currentRow.q2}{currentRow.q1}{currentRow.q0}</strong><div><span>Q2</span><span>Q1</span><span>Q0</span></div></div>
              <div className="output-readout"><span className="mini-label">ACTIVE TRAFFIC STATE</span><strong className={`signal-word ${activeLight.toLowerCase()}`}>{activeLight}</strong><small>ONE-HOT OUTPUT</small></div>
            </div>
            <div className="bit-registers">
              {[['Q2', currentRow.q2], ['Q1', currentRow.q1], ['Q0', currentRow.q0]].map(([label, value]) => <div className={`bit-register ${value ? 'high' : ''}`} key={label}><span>{label}</span><strong>{value}</strong><small>{value ? 'HIGH' : 'LOW'}</small></div>)}
            </div>
          </div>
          <div className="reset-card card-surface">
            <div className="mini-label"><TimerReset size={13} /> RESET MONITOR</div>
            <div className="reset-orbit"><div className="reset-orbit__core">{currentState === 0 ? '0' : '—'}</div><span className="orbit-dot" /></div>
            <strong>{currentState === 0 ? 'HOME STATE' : 'COUNTING'}</strong>
            <small>{currentState === 0 ? 'Counter is aligned to 000' : `Next edge: ${currentState === 5 ? '000 / reset' : String(currentState + 1).padStart(3, '0')}`}</small>
          </div>
        </section>

        <section className="evidence-grid" id="logic">
          <div className="table-card card-surface">
            <div className="panel-heading compact">
              <div><div className="mini-label"><Grid3X3 size={13} /> STATE REGISTER</div><h2>Live state table</h2></div>
              <span className="panel-number">02</span>
            </div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>DEC</th><th>Q2</th><th>Q1</th><th>Q0</th><th><span className="table-light red" /> RED</th><th><span className="table-light yellow" /> YELLOW</th><th><span className="table-light green" /> GREEN</th></tr></thead>
                <tbody>{STATE_ROWS.map((row) => <tr className={row.decimal === currentState ? 'current' : ''} key={row.decimal}><td><strong>{row.decimal}</strong>{row.decimal === currentState && <span className="current-tag">LIVE</span>}</td><td>{row.q2}</td><td>{row.q1}</td><td>{row.q0}</td><td className={row.red ? 'on red-text' : ''}>{row.red}</td><td className={row.yellow ? 'on yellow-text' : ''}>{row.yellow}</td><td className={row.green ? 'on green-text' : ''}>{row.green}</td></tr>)}</tbody>
              </table>
            </div>
            <div className="table-note"><span className="live-line" /> The highlighted row is the state currently driving the 3D output.</div>
          </div>
          <div className="logic-card card-surface">
            <div className="panel-heading compact"><div><div className="mini-label"><BrainCircuit size={13} /> COMBINATIONAL DECODE</div><h2>Output equations</h2></div><span className="panel-number">03</span></div>
            <div className="equation-list">
              <div className="equation-item red-border"><span className="equation-light red" /><code>RED <b>=</b> NOT Q2 AND NOT Q1</code><strong>{currentRow.red}</strong></div>
              <div className="equation-item yellow-border"><span className="equation-light yellow" /><code>YELLOW <b>=</b> NOT Q2 AND Q1</code><strong>{currentRow.yellow}</strong></div>
              <div className="equation-item green-border"><span className="equation-light green" /><code>GREEN <b>=</b> Q2 AND NOT Q1</code><strong>{currentRow.green}</strong></div>
            </div>
            <div className="logic-assertion"><Lightbulb size={16} /><div><strong>Mutually exclusive output</strong><span>Exactly one signal resolves HIGH for every legal state.</span></div><span className="check-mark">✓</span></div>
          </div>
        </section>

        <LogicCircuit row={currentRow} />

        <section className="block-card card-surface">
          <div className="panel-heading compact"><div><div className="mini-label"><Signal size={13} /> SYSTEM PATH</div><h2>From clock edge to visible signal</h2></div><span className="panel-number">05</span></div>
          <div className="block-diagram">
            {[['01', 'CLOCK', 'periodic edge'], ['02', 'MOD-6 COUNTER', 'Q2 / Q1 / Q0'], ['03', 'OUTPUT LOGIC', 'Boolean decode'], ['04', 'TRAFFIC LIGHT', activeLight + ' active']].map(([number, title, detail], index) => <div className="block-step" key={title}><div className={`block-node ${index === 3 ? activeLight.toLowerCase() : ''}`}><span>{number}</span><strong>{title}</strong><small>{detail}</small></div>{index < 3 && <ArrowRight className="block-arrow" size={20} />}</div>)}
          </div>
          <div className="block-footer"><span className="signal-trace" /> Each clock edge propagates through the chain and becomes a physical LED decision.</div>
        </section>

        <section className="wave-section" id="timing">
          <div className="wave-card card-surface">
            <div className="panel-heading compact"><div><div className="mini-label"><Waves size={13} /> SEQUENTIAL TRACE</div><h2>Live timing diagram</h2></div><div className="wave-meta"><span className="live-line" /> {history.length} SAMPLES BUFFERED</div></div>
            <Waveform history={history} />
          </div>
        </section>

        <section className="learning-grid">
          <div className="how-card card-surface">
            <div className="panel-heading compact"><div><div className="mini-label"><BookOpen size={13} /> CONCEPT NOTES</div><h2>How it works</h2></div><span className="panel-number">06</span></div>
            <div className="how-list">{HOW_IT_WORKS.map(([number, title, text]) => <article className="how-item" key={number}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
          </div>
          <div className="viva-card card-surface" id="viva">
            <div className="panel-heading compact"><div><div className="mini-label"><BrainCircuit size={13} /> ORAL EXAM PREP</div><h2>Viva mode</h2></div><span className="panel-number">07</span></div>
            <div className="viva-list">{VIVA_ITEMS.map((item, index) => <div className={`viva-item ${openViva === index ? 'open' : ''}`} key={item.question}><button onClick={() => setOpenViva(openViva === index ? -1 : index)} aria-expanded={openViva === index}><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.question}</strong><ChevronDown size={17} /></button>{openViva === index && <p>{item.answer}</p>}</div>)}</div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><span className="brand-mark small" aria-hidden="true"><i /><i /><i /></span><span><strong>MOD<span>6</span> LAB</strong><small>DSD MICROPROJECT / INTERACTIVE SIMULATION</small></span></div>
        <div className="footer-note">Built for first-year Digital System Design <span /> <a href="#top">Back to top ↑</a></div>
      </footer>
    </div>
  )
}

export default App
