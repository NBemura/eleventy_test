const eleventySass = require('eleventy-sass')

module.exports = (eleventyConfig) => {
  // `src/images` フォルダの内容を `_site/images` にコピーする
  eleventyConfig.addPassthroughCopy('src/images')

  // eleventy-sass プラグインを追加
  eleventyConfig.addPlugin(eleventySass, {
    watch: ['src/sass/**/*.scss'],
    outputDir: '_site/css'
  })
}
