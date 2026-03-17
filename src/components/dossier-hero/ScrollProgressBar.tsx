interface Props {
  progress: number;
}

export function ScrollProgressBar({ progress }: Props) {
  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-50 bg-border/30">
      <div
        className="h-full bg-dossier-gold transition-[width] duration-75"
        style={{ width: `${progress * 100}%` }}
      />
    </div>
  );
}
