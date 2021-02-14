const fs = require('fs')
const path = require('path')

const buildFolder = process.cwd() + path.sep + 'dist'

const buildFolderExists = fs.existsSync(buildFolder)

if (buildFolderExists) {
  fs.rmdirSync(buildFolder, {
    recursive: true,
    force: true
  })
}
