export async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('API request failed');
  return await response.json();
}
