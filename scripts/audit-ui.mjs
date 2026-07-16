import { chromium } from "playwright-core"

const baseUrl = process.env.PAIRUP_BASE_URL ?? "http://127.0.0.1:5174"
const executablePath = process.env.CHROMIUM_PATH ?? "/snap/bin/chromium"
const browser = await chromium.launch({ executablePath, headless: true })
const results = []

try {
  const viewports = [
    { name: "desktop", width: 1440, height: 900 },
    { name: "mobile", width: 390, height: 844 },
    { name: "small-mobile", width: 320, height: 720 },
  ]

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport })
    const requests = []
    const errors = []

    await page.route("**/api/signup", async (route) => {
      requests.push(JSON.parse(route.request().postData() || "{}"))
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true, referralCode: "PUMOCK1234", referralCount: 0 }),
      })
    })
    page.on("pageerror", (error) => errors.push(error.message))

    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" })
    const heroCharmCount = await page.locator(".hero-charm-track img").count()
    const heroBrokenAssets = await page.locator(".hero-charm-track img").evaluateAll((images) =>
      images.filter((image) => !(image instanceof HTMLImageElement) || image.naturalWidth === 0).length,
    )
    const heroGeometry = await page.evaluate(() => {
      const copy = document.querySelector(".empty-space-secondary")?.getBoundingClientRect()
      const rail = document.querySelector(".hero-charm-carousel")?.getBoundingClientRect()
      if (!copy || !rail) throw new Error("Hero charm surfaces were not found")
      const overlaps = !(copy.right <= rail.left || rail.right <= copy.left || copy.bottom <= rail.top || rail.bottom <= copy.top)
      return { overlaps }
    })
    const overflowBefore = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    await page.locator("#join").scrollIntoViewIfNeeded()
    await page.locator("#swipe-name").fill("Audit Builder")
    await page.locator("#swipe-phone").fill("+91 98765 43210")
    const charmButtons = page.locator(".profile-charm-viewport button")
    const charmCount = await charmButtons.count()
    const brokenAssets = await page.locator(".profile-charm-viewport img").evaluateAll((images) =>
      images.filter((image) => !(image instanceof HTMLImageElement) || image.naturalWidth === 0).length,
    )

    await charmButtons.filter({ has: page.locator('img') }).first().click()
    await page.locator('.swipe-profile-charm-sticker').waitFor()
    const stickerSource = await page.locator('.swipe-profile-charm-sticker img').getAttribute('src')
    await page.locator(".swipe-card-accept").click()
    await page.locator("#swipe-referral").waitFor()
    if (requests.length !== 0) {
      throw new Error(`${viewport.name}: API called before the final referral step`)
    }
    await page.locator("#swipe-referral").fill("PUFRIEND22")
    await page.locator(".swipe-card-accept").click()
    await page.locator(".swipe-success-pass").waitFor()

    const successText = await page.locator(".swipe-success-pass").innerText()
    const overflowAfter = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    )
    const geometry = await page.evaluate(() => {
      const section = document.querySelector(".swipe-join-section")?.getBoundingClientRect()
      const shell = document.querySelector(".swipe-join-card-shell")?.getBoundingClientRect()
      const footer = document.querySelector(".site-footer")?.getBoundingClientRect()
      if (!section || !shell || !footer) throw new Error("Expected layout surfaces were not found")
      return {
        shellInsideSection: shell.bottom <= section.bottom + 1,
        sectionFooterGap: Math.round(footer.top - section.bottom),
        footerHeight: Math.round(footer.height),
      }
    })

    results.push({
      viewport: viewport.name,
      overflowBefore,
      overflowAfter,
      heroCharmCount,
      heroBrokenAssets,
      heroGeometry,
      charmCount,
      brokenAssets,
      stickerSource,
      payload: requests[0],
      shareCode: await page.locator(".swipe-referral-share strong").innerText(),
      successHidesPhone: !successText.includes("98765"),
      errors,
      geometry,
    })
    await page.close()
  }

  for (const route of ["/about", "/privacy", "/terms", "/credits"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
    await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" })
    results.push({
      route,
      h1: await page.locator("h1").innerText(),
      title: await page.title(),
      footer: await page.locator(".site-footer").count(),
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      ),
    })
    await page.close()
  }

  for (const route of ["/robots.txt", "/sitemap.xml"]) {
    const page = await browser.newPage()
    const response = await page.goto(`${baseUrl}${route}`)
    results.push({
      route,
      status: response?.status(),
      contentType: response?.headers()["content-type"],
    })
    await page.close()
  }
} finally {
  await browser.close()
}

console.log(JSON.stringify(results, null, 2))
