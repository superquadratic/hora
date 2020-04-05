#!/usr/bin/env node

const chalk = require('chalk')
const { format, getDay, getISOWeek, getYear, isWithinRange } = require('date-fns')
const { groupBy, map, sumBy } = require('lodash')

const { loadTimesheet } = require('./timesheet')

try {
  main()
} catch (error) {
  console.log(chalk.red('Error: ') + error.message)
}

function main() {
  const timesheet = loadTimesheet()

  const dailyBalances = map(timesheet.records, (spans, date) => ({
    date, dayBalance: computeBalance(spans, date, timesheet.schedule)
  }))

  const weeklyBalances = map(groupBy(dailyBalances, getWeek), (days, week) => ({
    week, days, weekBalance: sumBy(days, 'dayBalance')
  }))

  const totalBalance = sumBy(weeklyBalances, 'weekBalance');

  weeklyBalances.forEach(({ week, days, weekBalance }) => {
    days.forEach(({ date, dayBalance }) => {
      console.log(format(date, 'YYYY-MM-DD') + ': ' + colorBalance(dayBalance))
    })
    console.log('w. ' + week + ': ' + colorBalance(weekBalance))
    console.log('')
  })

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

function getWeek({ date }) {
  return getYear(date) + '-' + getISOWeek(date)
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
