const pj = require('../package.json')
module.exports = {
  name: pj.name,
  namespace: pj.homepage,
  version: pj.version,
  description: pj.description,
  author: pj.author,
  copyright: pj.author,
  license: pj.license,
  match: ['https://chatgai.dev.cybozu.co.jp/*'],
  require: [''],
  'run-at': 'document-end',
  supportURL: pj.bugs.url,
  homepage: pj.homepage,
  grant: [],
  icon: 'https://img.icons8.com/quill/50/copy.png',
}
