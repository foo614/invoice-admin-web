export function formatUtcToLocalDateOnly(utc: string | Date): string {
  return new Date(utc).toLocaleDateString('en-GB');
}

export function formatUtcToLocalDateTimeWithAmPm(utc: string | Date): string {
  return new Date(utc).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export function formatUtcToLocalDateTime24H(utc: string | Date): string {
  return new Date(utc).toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
}
