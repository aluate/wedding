/** Group timeline events by ISO date, sorted by date then start time. */
export function groupTimelineByDate<
  T extends { date: string; startTime: string; showOnPublicTimeline: boolean }
>(events: T[]): [string, T[]][] {
  const visible = events.filter((e) => e.showOnPublicTimeline)
  const sorted = [...visible].sort(
    (a, b) => a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime)
  )
  const map = new Map<string, T[]>()
  for (const e of sorted) {
    const list = map.get(e.date)
    if (list) list.push(e)
    else map.set(e.date, [e])
  }
  return Array.from(map.entries())
}
