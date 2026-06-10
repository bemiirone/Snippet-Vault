export function parseTags(input: string): string[] {
  return input
    .split(',')
    .map(t => t.trim().toLowerCase())
    .filter(Boolean);
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  return err instanceof Error ? err.message : fallback;
}
