#!/usr/bin/env node

const fs = require('fs')
const { sum, zip } = require('ramda')
const yaml = require('js-yaml')

const WORKDAY = 8 * 60

const computeBalance = (spans) => sum(spans.map(duration)) - WORKDAY
const duration = ([start, end]) => end - start

const timesheet = yaml.safeLoad(fs.readFileSync('timesheet.yml', 'utf8'))
const balances = timesheet.map(day => computeBalance(day.spans))
const dates = timesheet.map(day => day.date)

console.log(zip(dates, balances))
console.log(sum(balances))
