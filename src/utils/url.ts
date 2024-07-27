export function isURL(url: string) {
  try {
    new URL(url);
  } catch (e) {
    console.error(e);
    return false;
  }
  return true;
}
