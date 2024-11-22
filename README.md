# eleventy_test_dam

## 簡易な説明
- [こちらの記事](https://azukiazusa.dev/blog/axe-core-playwright/)をベースに、`@axe-core/playwright`を活用してテストを行っています。
- `npm run test:a11y`でplaywrightが実行され、テスト結果が出力されます。
  - 詳しいテスト結果は、ターミナルでも出力されていると思いますが`http://localhost:9323/`にアクセスすることで見ることができます。
- `playwright.config.js`の`webServer`に記載の通り、テスト開始時に`npm run serve`が実行され、ローカル環境を対象にテストが実行されます。
- Eleventyの[Collection API](https://www.11ty.dev/docs/collections-api/)を利用してページ一覧を生成し、それを元に全ページをクロールする感じになってます。
  - なので、Eleventyを使わないプロジェクトでは`sitemap.xml`を使う感じになりそうですね。
- 割といろんなファイルごちゃごちゃしてるので、諸々整理した方が良さそうです🥳
