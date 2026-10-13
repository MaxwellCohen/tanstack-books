export type RouteHref = `/${string}`;

export function hrefToTarget(href: string): RouteHref {
  return (href.startsWith('/') ? href : `/${href}`) as RouteHref;
}

export function queryToRecord(query: string): Record<string, string> {
  return Object.fromEntries(new URLSearchParams(query));
}
