import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { readFileSync } from 'fs'
import path from 'path'

// テスト設定の定義
const config = {
  baseUrl: 'http://127.0.0.1:8080', // 開発サーバーのURL
  skipPaths: ['/404.html'] // スキップするパス
}

// ページリストの読み込み
const pages = JSON.parse(
  readFileSync(path.join(process.cwd(), 'dist/pages.json'), 'utf-8')
)

// 各ページに対してアクセシビリティテストを実行
test.describe('Accessibility tests for all pages', () => {
  for (const page of pages) {
    // スキップするパスは除外
    if (config.skipPaths.includes(page.url)) continue

    test(`Testing accessibility on ${page.url}`, async ({
      page: pageContext
    }) => {
      // ページへ移動
      await pageContext.goto(`${config.baseUrl}${page.url}`)

      // ページの読み込み完了を待機
      await pageContext.waitForLoadState('networkidle')

      // Axeによるアクセシビリティ分析の実行
      const accessibilityScanResults = await new AxeBuilder({
        page: pageContext
      })
        .withTags(['wcag2a', 'wcag2aa']) // WCAG 2.0 レベルAとAAのチェック
        .analyze()

      // 違反がないことを確認
      expect(accessibilityScanResults.violations).toEqual([])

      // 詳細なレポートの作成（違反がある場合）
      if (accessibilityScanResults.violations.length > 0) {
        console.log(`Accessibility violations found on ${page.url}:`)
        accessibilityScanResults.violations.forEach((violation) => {
          console.log(`\nRule: ${violation.id}`)
          console.log(`Impact: ${violation.impact}`)
          console.log(`Description: ${violation.help}`)
          console.log('Affected elements:')
          violation.nodes.forEach((node) => {
            console.log(`- ${node.html}`)
            console.log(`  ${node.failureSummary}`)
          })
        })
      }
    })
  }
})
