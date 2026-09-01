import React from 'react';

export default function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div
        className="inline-flex items-center gap-2 rounded-full bg-[var(--surface-ai)] px-4 py-3"
        role="status"
        aria-live="polite"
      >
        <span className="text-xs font-semibold text-[var(--muted-foreground)]">
          Cira está digitando
        </span>
        <span className="flex items-center gap-1" aria-hidden="true">
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] typing-dot"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] typing-dot"
            style={{ animationDelay: '160ms' }}
          />
          <span
            className="w-1.5 h-1.5 rounded-full bg-[var(--muted-foreground)] typing-dot"
            style={{ animationDelay: '320ms' }}
          />
        </span>
      </div>
    </div>
  );
}
