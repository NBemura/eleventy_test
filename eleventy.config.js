const eleventySass = require('eleventy-sass')
const sitemap = require('@quasibit/eleventy-plugin-sitemap')

module.exports = (eleventyConfig) => {
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

  // eleventy-plugin-sitemap プラグインを追加
  eleventyConfig.addPlugin(sitemap, {
    sitemap: {
      hostname: 'http://localhost:8080' // サイトのホスト名を指定
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
