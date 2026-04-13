import weddingConfig from '@/config/wedding_config.json'
import { getAllWeddingPhotos } from '@/lib/photos'
import PhotoStrip from '@/components/PhotoStrip'
import { format12HourTime, formatWeekdayWithDate } from '@/lib/dateUtils'
import { groupTimelineByDate } from '@/lib/groupTimelineByDate'

export default function Schedule() {
  const { wedding } = weddingConfig
  const schedulePhotos = getAllWeddingPhotos().slice(0, 3)
  const dayGroups = groupTimelineByDate(wedding.events)

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-5xl mb-8">Schedule</h1>

        {schedulePhotos.length > 0 && (
          <div className="mb-12">
            <PhotoStrip photos={schedulePhotos} />
          </div>
        )}

        <div className="space-y-14">
          {dayGroups.map(([date, dayEvents]) => (
            <section key={date}>
              <h2 className="font-heading text-3xl mb-6 text-accent border-b-2 border-primary/40 pb-3">
                {formatWeekdayWithDate(date)}
              </h2>
              <div className="space-y-6">
                {dayEvents.map((event) => (
                  <div key={event.id} className="border-l-4 border-primary pl-6 py-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                      <h3 className="font-heading text-2xl">{event.name}</h3>
                      <p className="text-accent/70 md:text-right">
                        {'displayTimeRange' in event &&
                        typeof (event as { displayTimeRange?: string }).displayTimeRange === 'string'
                          ? (event as { displayTimeRange: string }).displayTimeRange
                          : `${format12HourTime(event.startTime)} – ${format12HourTime(event.endTime)}`}
                      </p>
                    </div>
                    <p className="text-accent/80">{event.description}</p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  )
}
