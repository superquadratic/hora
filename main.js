#!/usr/bin/env node

const dateFns = require('date-fns')
const fs = require('fs')
const { map, sum, zip } = require('ramda')
const yaml = require('js-yaml')

const WORKDAY = 8 * 60

const computeDelta = (spans) => sum(map(duration, spans)) - WORKDAY
const duration = ([start, end]) => end - start

const timesheet = yaml.safeLoad(fs.readFileSync('timesheet.yml', 'utf8'))
const deltas = timesheet.map(day => computeDelta(day.spans))
const dates = timesheet.map(day => day.date)

console.log(zip(dates, deltas))
console.log(sum(deltas))
