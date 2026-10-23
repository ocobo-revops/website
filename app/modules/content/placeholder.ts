/**
 * Mockup placeholders in content files. Any bracketed span means the value
 * is not written yet, whatever text surrounds it: "[X]", "[Nom du client] :
 * [le passage en une phrase].", "Et vos ERP. [Bloc à valider avec Qobra]".
 * A placeholder never renders. The rule is documented in
 * `docs/architecture/two-repo-content-pipeline.md`.
 */

const PLACEHOLDER_PATTERN = /\[[^\]]*\]/;

export function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER_PATTERN.test(value);
}

/**
 * The value, or `null` when it is missing or holds a placeholder.
 * `onPlaceholder` runs only for a dropped placeholder, to log it.
 */
export function writtenOrNull(
  value: string | undefined,
  onPlaceholder?: () => void,
): string | null {
  if (value === undefined) return null;
  if (!hasPlaceholder(value)) return value;
  onPlaceholder?.();
  return null;
}

/**
 * Logs what a resolver drops, so no value disappears silently:
 * `[scope] slug: field dropped (reason)`.
 */
export type ReportDrop = (field: string, reason?: string) => void;

export function dropReporter(scope: string, slug: string): ReportDrop {
  return (field: string, reason = 'placeholder') => {
    console.warn(`[${scope}] ${slug}: ${field} dropped (${reason})`);
  };
}
