#!/usr/bin/env node

const chalk = require('chalk')
const { format, getDay, isWithinRange } = require('date-fns')
const { forEach, map, sumBy } = require('lodash')

const { loadTimesheet } = require('./timesheet')

try {
  main()
} catch (error) {
  console.log(chalk.red('Error: ') + error.message)
}

function main() {
  const timesheet = loadTimesheet()
  const dailyBalances = map(timesheet.records, (spans, date) => ({
    date, balance: computeBalance(spans, date, timesheet.schedule)
  }))
  const totalBalance = sumBy(dailyBalances, 'balance');

  forEach(dailyBalances, ({ date, balance }) => {
    console.log(format(date, 'YYYY-MM-DD') + ': ' + colorBalance(balance))
  })

  console.log('')
  console.log('Balance: ' + colorBalance(totalBalance))
}

function computeBalance(spans, date, schedule) {
  return sumBy(spans, duration) - getDebit(date, schedule)
}

function duration([start, end]) {
  return end - start
}

function getDebit(date, schedule) {
  const range = schedule.find(r => isWithinRange(date, r.start, r.end))
  return range.hours[getDay(date) - 1] * 60
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
