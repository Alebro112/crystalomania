export default function formatLocalDate(isoString: string): string {
  const date = new Date(isoString);

  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',     // 'short' или '2-digit' — другие варианты
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,     // 24-часовой формат
  });
}
