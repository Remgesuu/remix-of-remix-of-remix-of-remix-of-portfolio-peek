const ResumePlaceholder = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      <p className="text-xs tracking-[0.25em] uppercase text-muted-foreground font-sans mb-3">
        ( Resume )
      </p>
      <h1 className="text-4xl md:text-6xl font-serif text-foreground mb-4">Coming soon</h1>
      <p className="text-base text-muted-foreground font-sans mb-8 text-center max-w-md">
        Not ready yet. Email me if you need it now.
      </p>
      <div className="flex items-center gap-4">
        <a
          href="/"
          className="px-5 py-2.5 text-sm font-sans font-medium border border-foreground/20 rounded-md text-foreground hover:bg-foreground hover:text-background transition-colors"
        >
          ← Back home
        </a>
        <a
          href="mailto:grigorii584@gmail.com"
          className="px-5 py-2.5 text-sm font-sans font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          Email me
        </a>
      </div>
    </div>
  );
};

export default ResumePlaceholder;
