export function getCookie(name, cookieHeader) {
  if (!cookieHeader) return null;

  const match = cookieHeader
    .split(';')
    .map(c => c.trim())
    .find(c => c.startsWith(name + '='));

  return match ? decodeURIComponent(match.split('=')[1]) : null;
}