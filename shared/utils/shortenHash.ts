export function shortenHash(hash: string, startLength: number = 6, endLength: number = 6): string {
  if (!hash || hash.length <= startLength + endLength) {
    return hash;
  }
  const start = hash.slice(0, startLength);
  const end = hash.slice(-endLength);
  return `${start}...${end}`;
}
