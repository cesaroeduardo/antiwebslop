/** Renders `code` spans and **bold** from one line of the skill's Markdown; drops link targets. */
export function Inline({ text }: { text: string }) {
  const parts = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').split(/(`[^`]+`|\*[^*]+\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') ? <code key={i}>{p.slice(1, -1)}</code>
        : p.startsWith('*') && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em>
        : <span key={i}>{p}</span>,
      )}
    </>
  );
}
