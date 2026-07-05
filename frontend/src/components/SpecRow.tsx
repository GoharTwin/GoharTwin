interface Props {
  label: string;
  value: unknown;
}

export default function SpecRow({ label, value }: Props) {
  const display =
    value === null || value === undefined || value === ""
      ? "TBD"
      : String(value);

  return (
    <div className="spec-row">
      <span className="spec-label">{label}</span>
      <span className="spec-value">{display}</span>
    </div>
  );
}
