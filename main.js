const dateFns = require('date-fns')
const fs = require('fs')
const { sum } = require('ramda')
const yaml = require('js-yaml')

const WORKDAY = 8 * 60

const timesheet = yaml.safeLoad(fs.readFileSync('timesheet.yml', 'utf8'))
const hours = timesheet.map(day => {
  return sum(day.spans.map(differenceInMinutes)) - WORKDAY
})

console.log(hours)
console.log(sum(hours))

function differenceInMinutes([startTime, endTime]) {
  return toMinute(endTime) - toMinute(startTime)
}

function toMinute(time) {
  const [hours, minutes] = time.split(":").map(str => parseInt(str, 10))
  return 60 * hours + minutes
}
