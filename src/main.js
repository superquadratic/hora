#!/usr/bin/env node

const chalk = require('chalk')
const { format } = require('date-fns')
const { sum, zip } = require('lodash')

const { loadTimesheet } = require('./timesheet')

const WORKDAY_DEBIT = 8 * 60

try {
  main()
} catch (error) {
  console.log(chalk.red('Error: ') + error.message)
}

function main() {
  const timesheet = loadTimesheet()
  const balances = timesheet.map(day => computeBalance(day.spans))
  const dates = timesheet.map(day => day.date)

  zip(dates, balances).forEach(([date, balance]) => {
    console.log(format(date, 'YYYY-MM-DD') + ': ' + colorBalance(balance))
  })

  console.log('')
  console.log('Balance: ' + colorBalance(sum(balances)))
}

function computeBalance(spans) {
  return sum(spans.map(duration)) - WORKDAY_DEBIT
}

function duration([start, end]) {
  return end - start
}

function colorBalance(balance) {
  if (balance > 0) {
    return chalk.green('+' + balance)
  } else if (balance < 0) {
    return chalk.red(balance)
  } else {
    return chalk.gray(balance)
  }
}
