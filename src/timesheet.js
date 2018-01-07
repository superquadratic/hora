const fs = require('fs')
const { upperFirst } = require('lodash')
const yaml = require('js-yaml')

exports.loadTimesheet = function loadTimesheet(filename = 'timesheet.yml') {
  try {
    const content = fs.readFileSync(filename, 'utf8')
    return yaml.safeLoad(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`Missing timesheet file '${filename}'`)
    } else if (error instanceof yaml.YAMLException) {
      throw new Error(
        `Syntax error in timesheet file '${filename}'\n` +
        upperFirst(error.message)
      )
    } else {
      throw error
    }
  }
}
