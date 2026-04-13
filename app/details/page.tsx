import weddingConfig from '@/config/wedding_config.json'
import Link from 'next/link'
import { formatAmericanDate, format12HourTime, formatWeekdayWithDate } from '@/lib/dateUtils'
import { groupTimelineByDate } from '@/lib/groupTimelineByDate'

export default function Details() {
  const { wedding, venue, faq, site } = weddingConfig
  const supportPhoneHref = `+1${site.supportPhone.replace(/\D/g, '')}`
  const dayGroups = groupTimelineByDate(wedding.events)

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="font-heading text-5xl mb-2">Weekend Details</h1>
        <p className="text-xl text-accent/70 mb-12">
          {formatAmericanDate(wedding.date)} &middot; {venue.name}
        </p>

        <section className="mb-12">
          <h2 className="font-heading text-3xl mb-6">Weekend schedule</h2>
          <div className="space-y-10">
            {dayGroups.map(([date, dayEvents]) => (
              <div key={date}>
                <h3 className="font-heading text-2xl mb-4 text-accent border-b border-primary/30 pb-2">
                  {formatWeekdayWithDate(date)}
                </h3>
                <div className="space-y-4">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-white p-5 rounded-lg shadow-sm flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6"
                    >
                      <p className="text-primary font-semibold whitespace-nowrap">
                        {'displayTimeRange' in event &&
                        typeof (event as { displayTimeRange?: string }).displayTimeRange === 'string'
                          ? (event as { displayTimeRange: string }).displayTimeRange
                          : `${format12HourTime(event.startTime)} – ${format12HourTime(event.endTime)}`}
                      </p>
                      <div>
                        <p className="font-semibold text-lg">{event.name}</p>
                        <p className="text-accent/70">{event.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 text-sm text-accent/60">
            Prefer a single scroll? See the{' '}
            <Link href="/schedule" className="text-primary hover:underline font-semibold">
              Schedule page
            </Link>
            .
          </p>
        </section>

        <section className="mb-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link href="/travel" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition block">
            <h3 className="font-heading text-xl mb-1">Travel &amp; Lodging</h3>
            <p className="text-accent/70 text-sm">Airports, driving directions, and our hotel room block.</p>
          </Link>
          <Link href="/gifts" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition block">
            <h3 className="font-heading text-xl mb-1">Gifts</h3>
            <p className="text-accent/70 text-sm">No traditional registry — honeymoon &amp; home fund details.</p>
          </Link>
          <Link href="/menu" className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition block sm:col-span-2 lg:col-span-1">
            <h3 className="font-heading text-xl mb-1">Menu</h3>
            <p className="text-accent/70 text-sm">Dinner options and dietary accommodations.</p>
          </Link>
        </section>

        <section className="mb-12">
          <h2 className="font-heading text-3xl mb-4">FAQ</h2>
          <div className="space-y-4">
            {faq.map((item) => (
              <details key={item.id} className="bg-white rounded-lg shadow-sm group">
                <summary className="p-5 font-semibold cursor-pointer select-none list-none flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-primary text-xl leading-none group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="px-5 pb-5 text-accent/70 leading-relaxed">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="font-heading text-2xl mb-2">Questions?</h2>
          <p className="text-accent/70">
            Email{' '}
            <a href={`mailto:${site.supportEmail}`} className="text-primary hover:underline font-semibold">
              {site.supportEmail}
            </a>{' '}
            or call/text{' '}
            <a href={`tel:${supportPhoneHref}`} className="text-primary hover:underline font-semibold">
              {site.supportPhone}
            </a>
          </p>
        </section>
      </div>
    </main>
  )
}
