/** The antiweb[slop] mark from assets/cover.png, set in type so it stays sharp at any size. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[0.35em] font-mono font-medium leading-none ${className}`}>
      <span className="text-fg">antiweb</span>
      <span className="rounded-control border-2 border-accent px-[0.3em] pb-[0.12em] pt-[0.08em] text-accent">slop</span>
    </span>
  );
}
