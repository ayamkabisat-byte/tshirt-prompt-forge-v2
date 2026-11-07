import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import assert from 'node:assert/strict'

const browser = await chromium.launch({ headless: true })
const errors = []
await mkdir('artifacts/ui', { recursive: true })
try {
  for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'mobile', width: 390, height: 844 }]) {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
    page.on('pageerror', (error) => errors.push(`${viewport.name}: ${error.message}`))
    await page.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: /T-Shirt Prompt Forge/i }).waitFor()
    await page.getByRole('navigation', { name: 'Design workflow' }).getByRole('button', { name: /02 Style/ }).click()
    await page.getByRole('textbox', { name: 'Search visual styles' }).fill('racing')
    assert.ok(await page.locator('.style-tile').count() > 0, 'Search must return style cards')
    await page.getByRole('textbox', { name: 'Search visual styles' }).fill('')
    await page.locator('.style-tile-select').first().click()
    await page.getByRole('button', { name: /Add .* to favorites/ }).first().click()
    await page.getByText(/Favorites only/).first().waitFor()
    await page.screenshot({ path: `artifacts/ui/${viewport.name}-styles.png`, fullPage: true })
    await page.getByRole('navigation', { name: 'Design workflow' }).getByRole('button', { name: /03 Layout/ }).click()
    await page.getByText('Composition & Placement').waitFor()
    await page.getByRole('navigation', { name: 'Design workflow' }).getByRole('button', { name: /04 Print/ }).click()
    await page.getByText('Print & Color Engineering').waitFor()
    await page.getByRole('navigation', { name: 'Design workflow' }).getByRole('button', { name: /05 Prompt/ }).click()
    await page.getByText('Midjourney Controls').waitFor()
    await page.getByRole('button', { name: /All Controls/ }).click()
    await page.getByText('Subject & Reference').waitFor()
    await page.getByText('Print & Color Engineering').waitFor()
    await page.screenshot({ path: `artifacts/ui/${viewport.name}-all-controls.png`, fullPage: true })
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 2)
    assert.equal(overflow, false, `${viewport.name} must not have horizontal page overflow`)
    await page.close()
  }
  assert.deepEqual(errors, [], 'No browser runtime errors')
  console.log('UI smoke tests passed: desktop and mobile.')
} finally {
  await browser.close()
}
