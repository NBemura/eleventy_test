const fs = require('fs')
const { chromium } = require('playwright')
const AxeBuilder = require('@axe-core/playwright').default

// ファイルの読み込み
const sitemap = JSON.parse(fs.readFileSync('./dist/site-map.json'))

// アクセシビリティチェックを実行
async function runAccessibilityTests() {
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()

  for (const url of sitemap) {
    console.log(`Checking: ${url}`)

    // ページに移動
    await page.goto(`http://localhost:8080${url}`)

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .options({
        rules: {
          'duplicate-id': { enabled: true }
        }
      })
      .analyze()

    if (results.violations.length > 0) {
      console.error(`😺 ${url} `)
      results.violations.forEach((violation) => {
        console.error(` 🐭問題： ${violation.id}: ${violation.help}`)
        console.error(` 重要度： ${violation.impact}`)
        violation.nodes.forEach((node) => {
          console.error(`  └ 該当箇所： ${node.html}`)
          // console.error(`  └ 修正ポイント： ${node.failureSummary}`)
        })
      })
    } else {
      console.log(`🙆‍♂️問題ありません ${url}`)
    }

    // フォームのラベルチェック（withRules(['label'])がwithTagsを上書きしてしまうため個別にチェック）
    // const labelViolations = results.violations.filter(
    //   (violation) =>
    //     violation.id === 'label' ||
    //     violation.id === 'form-field-multiple-labels'
    // )
    // if (labelViolations.length > 0) {
    //   console.log('😺inputのラベルがありません')
    //   labelViolations.forEach((violation) => {
    //     console.log(` 🐭問題： ${violation.help}`)
    //     console.log(` 重要度： ${violation.impact}`)
    //     violation.nodes.forEach((node) => {
    //       console.log(`  └ 該当箇所: ${node.html}`)
    //       // console.log(`  └ 修正ポイント: ${node.failureSummary}`)
    //     })
    //     console.log('---')
    //   })
    // }
  }

  await browser.close()
}

runAccessibilityTests().catch((error) => {
  console.error('🚨テスト中にエラーが起こりました', error.message)
  console.error(error.stack)
})
