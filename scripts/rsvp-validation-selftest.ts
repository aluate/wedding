/**
 * Offline validation tests for RSVP payload parsing (no Supabase required).
 * Run: npm run verify-rsvp
 */
import { validateRsvpPayload, normalizeEmail } from '../lib/rsvp/validate'

let failed = 0
function assert(name: string, cond: boolean, detail?: string) {
  if (!cond) {
    console.error(`FAIL: ${name}${detail ? ` — ${detail}` : ''}`)
    failed++
  } else {
    console.log(`PASS: ${name}`)
  }
}

function run() {
  console.log('RSVP validation self-test\n')

  const yes = validateRsvpPayload({
    first_name: 'A',
    last_name: 'B',
    email: 'a@b.co',
    attending: true,
    guest_count: 2,
    guest_names: 'Guest Two',
  })
  assert('yes path validates', yes.ok === true && yes.ok && yes.data.guest_count === 2)

  const no = validateRsvpPayload({
    first_name: 'A',
    last_name: 'B',
    email: 'a@b.co',
    attending: false,
    guest_count: 0,
  })
  assert('no path validates with guest_count 0', no.ok === true && no.ok && no.data.guest_count === 0)

  const noCoerce = validateRsvpPayload({
    first_name: 'A',
    last_name: 'B',
    email: 'a@b.co',
    attending: false,
    guest_count: 99,
  })
  assert(
    'no path coerces guest_count to 0',
    noCoerce.ok === true && noCoerce.ok && noCoerce.data.guest_count === 0
  )

  assert(
    'bad email rejected',
    validateRsvpPayload({
      first_name: 'A',
      last_name: 'B',
      email: 'not-an-email',
      attending: true,
      guest_count: 1,
    }).ok === false
  )

  assert(
    'missing attending rejected',
    validateRsvpPayload({
      first_name: 'A',
      last_name: 'B',
      email: 'a@b.co',
      guest_count: 1,
    }).ok === false
  )

  assert(
    'yes with guest_count 0 rejected',
    validateRsvpPayload({
      first_name: 'A',
      last_name: 'B',
      email: 'a@b.co',
      attending: true,
      guest_count: 0,
    }).ok === false
  )

  assert('normalizeEmail lowercases', normalizeEmail(' Test@EXAMPLE.com ') === 'test@example.com')

  const empty = validateRsvpPayload(null)
  assert('null body rejected', empty.ok === false)

  console.log(failed ? `\n${failed} test(s) FAILED` : '\nAll validation self-tests passed.')
  process.exit(failed ? 1 : 0)
}

run()
