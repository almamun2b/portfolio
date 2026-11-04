export type SearchParamsInput = Record<string, string | string[] | undefined>;

/** First value of a (possibly repeated) query parameter. */
export function first(
  value: string | string[] | undefined,
): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

/**
 * Builds an href that keeps the current query and applies `patch`. A
 * `undefined`/empty value removes the key. Changing anything but `page`
 * resets `page`, so a new filter never lands on an empty page 7.
 */
export function withParams(
  pathname: string,
  current: SearchParamsInput,
  patch: Record<string, string | number | undefined>,
): string {
  const next = new URLSearchParams();
  for (const [key, raw] of Object.entries(current)) {
    const value = first(raw);
    if (value) next.set(key, value);
  }
  const touchesPage = "page" in patch;
  for (const [key, value] of Object.entries(patch)) {
    if (value === undefined || value === "") next.delete(key);
    else next.set(key, String(value));
  }
  if (!touchesPage) next.delete("page");
  const query = next.toString();
  return query ? `${pathname}?${query}` : pathname;
}

/** The first value of each named query parameter, ready for a Zod list-params schema. */
export function firstOf<const K extends string>(
  query: SearchParamsInput,
  keys: readonly K[],
): Record<K, string | undefined> {
  return Object.fromEntries(
    keys.map((key) => [key, first(query[key])]),
  ) as Record<K, string | undefined>;
}
