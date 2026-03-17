interface Props {
  metrics: { value: string; label: string }[];
}

export function MetricChips({ metrics }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {metrics.map((m) => (
        <span
          key={m.label}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-sans rounded-md bg-secondary text-secondary-foreground"
        >
          <span className="font-medium">{m.value}</span>
          <span className="text-muted-foreground">{m.label}</span>
        </span>
      ))}
    </div>
  );
}
