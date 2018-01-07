#!/usr/bin/env node

const fs = require('fs')
const { sum, zip } = require('ramda')
const yaml = require('js-yaml')

const WORKDAY_DEBIT = 8 * 60

main()

function main() {
  const timesheet = yaml.safeLoad(fs.readFileSync('timesheet.yml', 'utf8'))
  const balances = timesheet.map(day => computeBalance(day.spans))
  const dates = timesheet.map(day => day.date)

  console.log(zip(dates, balances))
  console.log(sum(balances))
}

function computeBalance(spans) {
  return sum(spans.map(duration)) - WORKDAY_DEBIT
}

function duration([start, end]) {
  return end - start
}
