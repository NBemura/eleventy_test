const fs = require('fs')

module.exports = (eleventyConfig) => {
  // コレクションのキャッシュ用変数
  let allPagesCache = []

  // コレクションの作成
  eleventyConfig.addCollection('allPages', function (collectionApi) {
    // コレクションのデータをキャッシュ
    allPagesCache = collectionApi.getAll().map((page) => ({
      url: page.url,
      inputPath: page.inputPath,
      outputPath: page.outputPath
    }))

    console.log('Collection created with', allPagesCache.length, 'pages')
    return allPagesCache
  })

  // ビルド完了後の処理
  eleventyConfig.on('afterBuild', function () {
    try {
      console.log('afterBuild: Found', allPagesCache.length, 'pages')

      if (!allPagesCache || allPagesCache.length === 0) {
        console.warn('No pages found in collection')
        return
      }

      // ページデータをJSON形式で保存
      const pagesData = JSON.stringify(allPagesCache, null, 2)
      fs.writeFileSync('dist/pages.json', pagesData)

      console.log(
        `Successfully wrote ${allPagesCache.length} pages to pages.json`
      )
    } catch (error) {
      console.error('Error writing pages.json:', error)
    }
  })

  const eleventySass = require('eleventy-sass')

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
