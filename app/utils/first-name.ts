/** First word of a full name, ignoring surrounding and repeated spaces. */
export function getFirstName(name: string): string {
  return name.trim().split(/\s+/)[0] ?? '';
}
