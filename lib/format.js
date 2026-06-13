// Formatting + light sanitization helpers (pt-BR).

export function formatDatePtBR(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Sao_Paulo',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

export function isoDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toISOString();
  } catch {
    return '';
  }
}

export function initials(name) {
  if (!name) return '?';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
}

/**
 * Content comes from a first-party deterministic pipeline (no AI, trusted),
 * but we still strip scripts/styles/inline handlers as defense in depth.
 */
export function sanitizeHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/ on[a-z]+="[^"]*"/gi, '')
    .replace(/ on[a-z]+='[^']*'/gi, '')
    .replace(/javascript:/gi, '');
}
