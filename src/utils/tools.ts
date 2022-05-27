export function typeKeys<T>(o: T): (keyof T)[] {
  return Object.keys(o) as (keyof T)[];
}

export function getUrlParams(url: string) {
  const regex = /[?&]([^=#]+)=([^&#]*)/g;
  const params = new Map<string, string>();
  let match;

  while ((match = regex.exec(url))) {
    params.set(match[1], match[2]);
  }
  return params;
}
