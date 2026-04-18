export function spotlightNowInsertId(index: number) {
  return `spotlight:now:at:${index}`;
}

export function parseSpotlightNowInsertIndex(id: string): number | null {
  const match = /^spotlight:now:at:(\d+)$/.exec(id);
  if (!match) return null;
  return parseInt(match[1], 10);
}
