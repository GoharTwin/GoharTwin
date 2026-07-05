interface Props {
  value: number;
}

/** Semi-circular SVG gauge, 0–100. */
export default function HealthGauge({ value }: Props) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = 70;
  const circumference = Math.PI * radius;
  const filled = (clamped / 100) * circumference;

  return (
    <div className="gauge">
      <svg viewBox="0 0 170 100">
        <path
          d="M 15 95 A 70 70 0 0 1 155 95"
          fill="none"
          stroke="rgba(88, 112, 156, 0.25)"
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M 15 95 A 70 70 0 0 1 155 95"
          fill="none"
          stroke="url(#gaugeGradient)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
        />
        <defs>
          <linearGradient id="gaugeGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2d6cdf" />
            <stop offset="100%" stopColor="#d4a437" />
          </linearGradient>
        </defs>
      </svg>
      <div className="gauge-value">{clamped}</div>
    </div>
  );
}
