#!/usr/bin/env node

const chalk = require('chalk')
const fs = require('fs')
const { sum, upperFirst, zip } = require('lodash')
const yaml = require('js-yaml')

const WORKDAY_DEBIT = 8 * 60

try {
  main()
} catch (error) {
  console.log(chalk.red("Error: ") + error.message)
}

function main() {
  const timesheet = loadTimesheet()
  const balances = timesheet.map(day => computeBalance(day.spans))
  const dates = timesheet.map(day => day.date)

  zip(dates, balances).forEach(([date, balance]) => {
    console.log(date + ": " + colorBalance(balance))
  })

  console.log(colorBalance(sum(balances)))
}

function loadTimesheet(filename = 'timesheet.yml') {
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
