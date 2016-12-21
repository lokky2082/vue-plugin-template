const postcss = require('postcss')
const cssnext = require('postcss-cssnext')
const CleanCSS = require('clean-css')

function processCss (style) {
  const componentName = path.basename(style.id, '.vue')
  return postcss([cssnext()])
    .process(style.code, {})
    .then(result => {
      return {
        name: componentName,
        css: result.css,
        map: result.map
      }
    })
}

function processStylus (style) {
  const componentName = path.basename(style.id, '.vue')
  return new Promise((resolve, reject) => {
    stylus.render(style.code, function (err, css) {
      if (err) return reject(err)
      resolve({
        original: {
          code: style.code,
          ext: 'styl'
        },
        name: componentName,
        css
      })
    })
  })
}

function processStyle (style) {
  if (style.lang === 'css') {
    return processCss(style)
  } else if (style.lang === 'stylus') {
    return processStylus(style)
  } else {
    throw new Error(`Unknown style language '${style.lang}'`)
  }
}

function writeCss (style) {
  write(`dist/${style.name}.css`, style.css)
  if (style.original) {
    write(`dist/${componentName}.${style.original.ext}`, style.original.code)
  }
  if (style.map) write(`dist/${style.name}.css.map`, style.map)
  write(`dist/${style.name}.min.css`, new CleanCSS().minify(style.css).styles)
}
