export async function fetchPage(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Fetch failed for ${url}: ${response.status}`);
  }
  return response.text();
}
