#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const { sum, zip } = require('lodash')
const yaml = require('js-yaml')

const WORKDAY_DEBIT = 8 * 60

main()

function main() {
  const timesheet = yaml.safeLoad(fs.readFileSync('timesheet.yml', 'utf8'))
  const balances = timesheet.map(day => computeBalance(day.spans))
  const dates = timesheet.map(day => day.date)

  zip(dates, balances).forEach(([date, balance]) => {
    console.log(date + ": " + colorBalance(balance))
  })

  console.log(colorBalance(sum(balances)))
}

function computeBalance(spans) {
  return sum(spans.map(duration)) - WORKDAY_DEBIT
}

function duration([start, end]) {
  return end - start
}

function colorBalance(balance) {
  if (balance > 0) {
    return chalk.green("+" + balance)
  } else if (balance < 0) {
    return chalk.red(balance)
  } else {
    return chalk.gray(balance)
  }
}
