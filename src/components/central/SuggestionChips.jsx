import React from 'react';

export default function SuggestionChips({ chips, onSelect, ariaLabel = 'Sugestões' }) {
  if (!chips || chips.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label={ariaLabel}>
      {chips.map((chip) => (
        <button
          key={chip.value}
          type="button"
          onClick={() => onSelect(chip)}
          className="h-11 px-4 inline-flex items-center rounded-full border text-sm font-medium text-[var(--accent-foreground)] border-[var(--primary)] bg-transparent transition-colors hover:bg-[var(--accent)] focus-visible:outline-2 focus-visible:outline-[var(--primary)] focus-visible:outline-offset-2 active:scale-95"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
