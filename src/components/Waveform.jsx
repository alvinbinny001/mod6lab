const SIGNALS = [
  { key: 'clock', label: 'CLOCK', color: '#5de4ff' },
  { key: 'q2', label: 'Q2', color: '#8fa8ff' },
  { key: 'q1', label: 'Q1', color: '#b19cff' },
  { key: 'q0', label: 'Q0', color: '#e49dff' },
  { key: 'red', label: 'RED', color: '#ff426d' },
  { key: 'yellow', label: 'YELLOW', color: '#ffc857' },
  { key: 'green', label: 'GREEN', color: '#35e58c' },
]

function stepPath(values, xFor, yFor) {
  if (!values.length) return ''
  let path = `M ${xFor(0)} ${yFor(values[0])}`
  for (let index = 1; index < values.length; index += 1) {
    path += ` H ${xFor(index)} V ${yFor(values[index])}`
  }
  return path
}

export default function Waveform({ history }) {
  const width = 980
  const height = 350
  const labelWidth = 102
  const chartLeft = 116
  const chartRight = 958
  const chartWidth = chartRight - chartLeft
  const rowHeight = 42
  const chartTop = 24
  const slotCount = Math.max(8, history.length)
  const xFor = (index) => chartLeft + (index / Math.max(1, slotCount - 1)) * chartWidth

  return (
    <div className="waveform-wrap">
      <svg className="waveform" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Live timing diagram for clock, counter bits, and traffic outputs">
        <defs>
          <linearGradient id="waveFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#5de4ff" stopOpacity="0.1" /><stop offset="1" stopColor="#5de4ff" stopOpacity="0" /></linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} rx="10" fill="#071422" />
        {Array.from({ length: slotCount }).map((_, index) => <line className="wave-grid-line" key={`v-${index}`} x1={xFor(index)} x2={xFor(index)} y1="12" y2={height - 22} />)}
        {SIGNALS.map((signal, rowIndex) => {
          const rowY = chartTop + rowIndex * rowHeight
          const values = history.map((sample) => sample[signal.key] ?? 0)
          const path = stepPath(values, xFor, (value) => rowY + (value ? 7 : 28))
          return (
            <g key={signal.key}>
              <line className="wave-row-line" x1={chartLeft} x2={chartRight} y1={rowY + 35} y2={rowY + 35} />
              <text className="wave-label" x={labelWidth} y={rowY + 20} fill={signal.color}>{signal.label}</text>
              <path d={path} fill="none" stroke={signal.color} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
              {values.map((value, index) => <circle key={`${signal.key}-${index}`} cx={xFor(index)} cy={rowY + (value ? 7 : 28)} r="3" fill={signal.color} />)}
            </g>
          )
        })}
        <path d={`M ${chartLeft} ${chartTop + 7} ${history.length > 1 ? `H ${xFor(history.length - 1)}` : ''} V ${chartTop + 35} H ${chartLeft} Z`} fill="url(#waveFill)" opacity="0.34" />
        {Array.from({ length: slotCount }).map((_, index) => <text className="wave-time" key={`t-${index}`} x={xFor(index)} y={height - 7} textAnchor="middle">T{index}</text>)}
      </svg>
      <div className="wave-legend"><span><i className="legend-dot clock" /> CLOCK EDGE</span><span><i className="legend-dot bits" /> COUNTER BITS</span><span><i className="legend-dot outputs" /> DECODED OUTPUTS</span><span className="wave-note">STEP FUNCTION / LAST {history.length} EVENTS</span></div>
    </div>
  )
}
