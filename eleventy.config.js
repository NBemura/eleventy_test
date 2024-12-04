// require('fs')はnodeのファイルシステム（File System）モジュール
const fs = require('fs')
const eleventySass = require('eleventy-sass')

module.exports = (eleventyConfig) => {
  eleventyConfig.addCollection('allPages', (collection) => {
    // collection.getAllSorted()で全てのファイルを取得→filterで.htmlで終わるファイルのみをソート
    const pages = collection
      .getAllSorted()
      .filter((item) => item.url === '/' || item.url.endsWith('.html'))

    // サイトマップをJSONファイルとして保存
    fs.writeFileSync(
      './dist/site-map.json',
      JSON.stringify(
        pages.map((page) => page.url),
        null, // 置換処理
        2 // インデント
      )
    )
    return pages
  })

  // eleventy-sass プラグインを追加
  eleventyConfig.addPlugin(eleventySass, {
    compileOptions: {
      // コンパイル先のフォルダ名をcssに変換
      permalink: function (contents, inputPath) {
        return (data) =>
          data.page.filePathStem.replace(/^\/sass\//, '/css/') + '.css'
      }
    },
    // SASSの設定
    sass: {
      style: 'expanded',
      sourceMap: true
    }
  })

  // 画像フォルダを出力ディレクトリに複製
  eleventyConfig.addPassthroughCopy('src/images')

  // JavaScriptファイル（common.js）を出力ディレクトリにコピー
  eleventyConfig.addPassthroughCopy('src/js')

  return {
    dir: {
      input: 'src', // 入力ディレクトリ
      output: 'dist' // 出力ディレクトリ
    }
  }
}
