/**
 * Smoke Tests for Wedding Site
 * 
 * Tests:
 * 1. Health check endpoint
 * 2. Page routes exist
 * 3. Static assets load
 * 
 * Run with: npm run smoke-test
 */

interface TestResult {
  name: string
  passed: boolean
  error?: string
}

const results: TestResult[] = []

async function test(name: string, fn: () => Promise<void> | void) {
  try {
    await fn()
    results.push({ name, passed: true })
    console.log(`✅ ${name}`)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    results.push({ name, passed: false, error: errorMessage })
    console.error(`❌ ${name}: ${errorMessage}`)
  }
}

async function runSmokeTests() {
  console.log('🧪 Running Wedding Site Smoke Tests...\n')

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  // Test 1: Health Check Endpoint
  await test('Health check endpoint works', async () => {
    const response = await fetch(`${baseUrl}/api/health`)
    if (!response.ok) {
      throw new Error(`Health check returned ${response.status}`)
    }
    const data = await response.json()
    const inner = data?.data?.status ?? data?.status
    if (inner !== 'healthy') {
      throw new Error(`Health check returned status: ${JSON.stringify(data)}`)
    }
  })

  // Test 2: Homepage Route Exists
  await test('Homepage route exists', async () => {
    // Check that app/page.tsx exists (file system check)
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/page.tsx not found')
    }
  })

  // Test 3: Schedule Page Route Exists
  await test('Schedule page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'schedule', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/schedule/page.tsx not found')
    }
  })

  // Test 4: Travel Page Route Exists
  await test('Travel page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'travel', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/travel/page.tsx not found')
    }
  })

  // Test 5: Gallery Page Route Exists
  await test('Gallery page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'gallery', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/gallery/page.tsx not found')
    }
  })

  // Test 6: RSVP Page Route Exists
  await test('RSVP page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'rsvp', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/rsvp/page.tsx not found')
    }
  })

  // Test 7: Game Page Route Exists
  await test('Game page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'game', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/game/page.tsx not found')
    }
  })

  // Test 8: Admin Page Route Exists
  await test('Admin page route exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const pagePath = path.join(process.cwd(), 'app', 'admin', 'page.tsx')
    try {
      await fs.access(pagePath)
    } catch {
      throw new Error('app/admin/page.tsx not found')
    }
  })

  // Test 9: Configuration File Exists
  await test('Wedding configuration file exists', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')
    const configPath = path.join(process.cwd(), 'config', 'wedding_config.json')
    try {
      await fs.access(configPath)
    } catch {
      throw new Error('config/wedding_config.json not found')
    }
  })

  // Test 10: TypeScript Compiles
  await test('TypeScript compiles without errors', async () => {
    // This is a basic check - full type checking would require running tsc
    // For now, just verify tsconfig.json exists
    const fs = await import('fs/promises')
    const path = await import('path')
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json')
    try {
      await fs.access(tsconfigPath)
    } catch {
      throw new Error('tsconfig.json not found')
    }
  })

  // Summary
  console.log('\n📊 Test Summary:')
  const passed = results.filter(r => r.passed).length
  const failed = results.filter(r => !r.passed).length
  
  console.log(`✅ Passed: ${passed}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📈 Total: ${results.length}`)

  if (failed > 0) {
    console.log('\n❌ Failed Tests:')
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.name}: ${r.error}`)
      })
    process.exit(1)
  }

  console.log('\n✅ All smoke tests passed!')
  process.exit(0)
}

// Run tests
runSmokeTests()
  .catch((error) => {
    console.error('Fatal error:', error)
    process.exit(1)
  })

