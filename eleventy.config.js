module.exports = (eleventyConfig) => {
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
