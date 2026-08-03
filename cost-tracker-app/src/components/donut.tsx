export type DonutSegment = {
  label: string
  value: number
  color: string
}

export function DonutChart({
  segments,
  centerValue,
  centerLabel,
}: {
  segments: DonutSegment[]
  centerValue?: string
  centerLabel?: string
}) {
  const total = segments.reduce((s, x) => s + x.value, 0)
  const r = 62
  const C = 2 * Math.PI * r
  let acc = 0

  const arcs =
    total > 0
      ? segments.map((seg, i) => {
          const dash = (seg.value / total) * C
          const arc = (
            <circle
              key={seg.label}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="26"
              strokeLinecap="butt"
              strokeDasharray={`${Math.max(dash - 2, 0)} ${C - Math.max(dash - 2, 0)}`}
              strokeDashoffset={-acc}
            />
          )
          acc += dash
          return arc
        })
      : null

  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="Desglose por categoría">
      <circle cx="100" cy="100" r={r} fill="none" stroke="var(--border)" strokeWidth="26" />
      <g transform="rotate(-90 100 100)">{arcs}</g>
      <text
        x="100"
        y="94"
        textAnchor="middle"
        style={{ fill: 'var(--text)', fontWeight: 700, fontSize: 20 }}
      >
        {centerValue}
      </text>
      <text
        x="100"
        y="114"
        textAnchor="middle"
        style={{ fill: 'var(--muted)', fontSize: 11 }}
      >
        {centerLabel}
      </text>
    </svg>
  )
}
