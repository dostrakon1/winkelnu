export function buildTopicSearchHref(label: string): string {
  const term = label.trim().replace(/\s+/g, ' ')
  return term ? `/zoeken?q=${encodeURIComponent(term)}` : '/zoeken'
}
