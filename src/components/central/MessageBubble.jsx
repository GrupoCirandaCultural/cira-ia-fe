import React from 'react';

function splitSentences(text) {
  const matches = String(text || '').match(/[^.!?]+[.!?]+(\s+|$)/g);
  return matches ? matches.map((s) => s.trim()) : [String(text || '')];
}

// Acumula frases até ~140 caracteres (mínimo 2, máximo 3) para decidir o corte.
// Uma contagem fixa de frases trunca cedo demais textos com frases curtas
// (ex.: uma saudação "Olá, Fulano. Sou a Cira." já soma 2 "frases" sem ser longa).
const SHORT_TEXT_TARGET_LENGTH = 140;
const MIN_REMAINING_TO_TRUNCATE = 15;

function buildTruncation(text) {
  const full = String(text || '').trim();
  const sentences = splitSentences(full);
  let shortText = '';
  let count = 0;

  for (const sentence of sentences) {
    const candidate = shortText ? `${shortText} ${sentence}` : sentence;
    if (candidate.length > SHORT_TEXT_TARGET_LENGTH && count >= 2) break;
    shortText = candidate;
    count += 1;
    if (count >= 3) break;
  }

  const remaining = full.slice(shortText.length).trim();
  return { shortText, canTruncate: remaining.length > MIN_REMAINING_TO_TRUNCATE };
}

export default function MessageBubble({ role, text, expanded, onToggleExpand }) {
  const isUser = role === 'user';
  const { shortText, canTruncate } = isUser ? { shortText: text, canTruncate: false } : buildTruncation(text);
  const displayText = !canTruncate || expanded ? text : shortText;

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap font-medium ${
          isUser
            ? 'bg-[var(--surface-user)] text-[var(--surface-user-foreground)] rounded-tr-sm'
            : 'bg-[var(--surface-ai)] text-[var(--foreground)] rounded-tl-sm'
        }`}
      >
        <p>{displayText}</p>
        {canTruncate && (
          <button
            type="button"
            onClick={onToggleExpand}
            className="mt-1 font-semibold text-[var(--primary)] underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-[var(--primary)] rounded"
          >
            {expanded ? 'Ver menos' : 'Ver mais'}
          </button>
        )}
      </div>
    </div>
  );
}
