const fs = require('fs')
const { chromium } = require('playwright')
const { injectAxe, checkA11y } = require('axe-playwright')

// ファイルの読み込み
const sitemap = JSON.parse(fs.readFileSync('./dist/site-map.json'))

// アクセシビリティチェックを実行
async function runAccessibilityTests() {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  for (const url of sitemap) {
    console.log(`Checking: ${url}`)

    try {
      // ページに移動
      await page.goto(`http://localhost:8080${url}`)

      // axe-core をページに注入
      await injectAxe(page)

      // アクセシビリティチェックを実行
      await checkA11y(page, null, {
        runOnly: {
          type: 'tag',
          values: ['wcag2a', 'wcag2aa']
        },
        detailedReport: true,
        detailedReportOptions: { html: true }
      })

      console.log(`問題ありません🙆‍♂️ ${url}`)
    } catch (error) {
      console.error(`修正が必要です😫 ${url}:`, error)
    }
  }

  await browser.close()
}

runAccessibilityTests().catch((error) => {
  console.error('テスト中にエラーが起こりました:', error.message)
  console.error(error.stack)
})
