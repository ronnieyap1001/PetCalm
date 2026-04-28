interface DimScore {
  dimension: string;
  score: number;
}

const LABELS: Record<string, string> = {
  separation: "Separation",
  noise: "Noise / Env",
  social: "Social",
  generalised: "Generalised",
  routine: "Routine",
};

export default function RadarChart({
  scores,
  color = "#E8785C",
  size = 320,
}: {
  scores: DimScore[];
  color?: string;
  size?: number;
}) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 40;
  const n = scores.length;

  const point = (i: number, value: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = (value / 100) * radius;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const labelPoint = (i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const r = radius + 18;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const polygon = scores.map((s, i) => point(i, s.score));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      className="mx-auto"
      role="img"
      aria-label="Anxiety radar chart"
    >
      {[20, 40, 60, 80, 100].map((p) => {
        const ring = scores
          .map((_, i) => point(i, p).join(","))
          .join(" ");
        return (
          <polygon
            key={p}
            points={ring}
            fill="none"
            stroke="#2D2D2D22"
            strokeWidth={1}
          />
        );
      })}
      {scores.map((_, i) => {
        const [x, y] = point(i, 100);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="#2D2D2D22"
            strokeWidth={1}
          />
        );
      })}
      <polygon
        points={polygon.map((p) => p.join(",")).join(" ")}
        fill={color + "55"}
        stroke={color}
        strokeWidth={2}
      />
      {polygon.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={3} fill={color} />
      ))}
      {scores.map((s, i) => {
        const [x, y] = labelPoint(i);
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11"
            fill="#2D2D2D"
          >
            {LABELS[s.dimension] || s.dimension} ({s.score}%)
          </text>
        );
      })}
    </svg>
  );
}
