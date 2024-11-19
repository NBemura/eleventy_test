const { chromium } = require('playwright')
const { injectAxe, checkA11y } = require('axe-playwright')

;(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  // チェックしたいページのURLを指定
  const url = 'http://localhost:8080/'
  await page.goto(url)

  // axe-core をページに注入
  await injectAxe(page)

  // アクセシビリティチェックを実行
  await checkA11y(page, null, {
    detailedReport: true,
    detailedReportOptions: { html: true }
  })

  await browser.close()
})()
