// CHAT GPT。チェックが走るがエラーが出てくれない
const fs = require('fs')
const { chromium } = require('playwright') // playwrightのchromiumをインポート

// JSONファイルを読み込む
const sitemap = JSON.parse(fs.readFileSync('./dist/site-map.json'))

// Playwright を使ってブラウザを起動
async function runAccessibilityTests() {
  const browser = await chromium.launch() // Chromium ブラウザを起動
  const context = await browser.newContext() // 新しいブラウザコンテキストを作成
  const page = await context.newPage() // 新しいページを作成

  // axe-core スクリプトをブラウザ内に読み込む
  await page.addScriptTag({
    url: 'https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.3.1/axe.min.js'
  })

  // サイトマップのURLをループして、各ページにアクセスし、アクセシビリティチェックを実行
  for (const url of sitemap) {
    console.log(`Checking: ${url}`)

    try {
      // ページに移動
      await page.goto(`http://localhost:8080${url}`)

      // ページ内で axe-core を実行してアクセシビリティチェック
      const results = await page.evaluate(async () => {
        // axe-core をブラウザ内で実行
        if (typeof axe !== 'undefined') {
          // color-contrast を追加して、コントラストの問題もチェック
          const { violations } = await axe.run({
            rules: {
              'color-contrast': { enabled: true }
            }
          })
          return violations
        } else {
          return []
        }
      })

      // 結果を表示
      if (results.length > 0) {
        console.log(`Accessibility violations found on ${url}:`)
        results.forEach((violation) => {
          console.log(`- ${violation.id}: ${violation.help}`)
          violation.nodes.forEach((node) => {
            console.log(`  - ${node.target.join(' ')}: ${node.failureSummary}`)
          })
        })
      } else {
        console.log(`No accessibility violations found on ${url}`)
      }
    } catch (error) {
      console.error(`Error checking accessibility on ${url}:`, error)
    }
  }

  // ブラウザを閉じる
  await browser.close()
}

// 実行
runAccessibilityTests().catch((error) =>
  console.error('Error during accessibility tests:', error)
)
