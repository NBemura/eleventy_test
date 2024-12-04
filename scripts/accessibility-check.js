const fs = require('fs')
const { chromium } = require('playwright')
const AxeBuilder = require('@axe-core/playwright').default
const { createHtmlReport } = require('axe-html-reporter')

// サイトマップを読み込む
const sitemap = JSON.parse(fs.readFileSync('./dist/site-map.json'))

async function runAccessibilityTests() {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  // 結果を収集
  const allResults = {
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: []
  }

  for (const url of sitemap) {
    console.log(`Checking: ${url}`)
    await page.goto(`http://localhost:8080${url}`)

    // Axeによるチェック
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .options({
        rules: {
          'duplicate-id': { enabled: true }
        }
      })
      .analyze()

    allResults.violations.push(...results.violations)
    allResults.passes.push(...results.passes)
    allResults.incomplete.push(...results.incomplete)
    allResults.inapplicable.push(...results.inapplicable)

    if (results.violations.length > 0) {
      console.error(`❌ 問題が見つかりました ${url}`)
    } else {
      console.log(`✅ 問題ありません ${url}`)
    }
  }

  // HTMLレポートの生成
  const reportHtml = createHtmlReport({
    results: allResults,
    options: {
      projectKey: 'Accessibility Report'
    }
  })

  // レポートをファイルに保存
  const reportPath = './artifacts/accessibilityReport.html'
  fs.writeFileSync(reportPath, reportHtml)
  console.log(`📄 レポートを生成しました: ${reportPath}`)

  // ブラウザでレポートを開く
  console.log('🌐 レポートをブラウザで開きます...')
  const open = (await import('open')).default
  await open(reportPath, { app: { name: 'google chrome' } })

  await browser.close()
}

runAccessibilityTests().catch((error) => {
  console.error('🚨 テスト中にエラーが起こりました:', error.message)
  console.error(error.stack)
})
