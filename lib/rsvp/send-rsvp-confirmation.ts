import weddingConfig from '@/config/wedding_config.json'

type SendParams = {
  to: string
  firstName: string
  attending: boolean
  guestCount: number
}

/**
 * Optional transactional email after RSVP save.
 * Set RESEND_API_KEY and RSVP_FROM_EMAIL in Vercel (Resend: verify your domain, then use e.g. rsvp@yourdomain.com).
 * If RESEND_API_KEY is missing, this is a no-op (RSVP still succeeds).
 */
export async function sendRsvpConfirmationEmail(params: SendParams): Promise<{ sent: boolean }> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return { sent: false }
  }

  const from = process.env.RSVP_FROM_EMAIL
  if (!from) {
    console.warn('[rsvp-email] RESEND_API_KEY set but RSVP_FROM_EMAIL missing; skipping send')
    return { sent: false }
  }

  const couple = weddingConfig.couple?.displayNames || 'Brit & Karl'
  const site = weddingConfig.site?.title || couple
  const support = weddingConfig.site?.supportEmail || ''
  const attendingLine = params.attending
    ? `We have you down for <strong>${params.guestCount}</strong> guest${params.guestCount === 1 ? '' : 's'} — we can’t wait to celebrate with you.`
    : `We’re sorry you can’t make it — we’ll miss you.`

  const html = `
    <p>Hi ${escapeHtml(params.firstName)},</p>
    <p>Thanks for your RSVP for <strong>${escapeHtml(couple)}</strong>’s wedding.</p>
    <p>${attendingLine}</p>
    <p>If anything changes, you can submit the RSVP form again with the same email address and we’ll update your response.</p>
    ${support ? `<p>Questions? Reply to this email or write to <a href="mailto:${escapeHtml(support)}">${escapeHtml(support)}</a>.</p>` : ''}
    <p style="color:#666;font-size:14px;margin-top:24px">— ${escapeHtml(site)}</p>
  `

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [params.to],
        subject: `RSVP received — ${couple}`,
        html,
      }),
    })

    if (!res.ok) {
      const errText = await res.text().catch(() => '')
      console.error('[rsvp-email] Resend error', res.status, errText)
      return { sent: false }
    }
    return { sent: true }
  } catch (e) {
    console.error('[rsvp-email]', e)
    return { sent: false }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
