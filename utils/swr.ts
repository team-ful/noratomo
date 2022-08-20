export const fetcher = <T = Object>(url: string) =>
  fetch(url).then(r => r.json() as Promise<T>);
