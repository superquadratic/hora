const tap = require('tap')

const chalk = require('chalk')
const { formatBalance } = require('../src/report/helpers')

tap.equal(formatBalance(0), chalk.gray(' 0:00'))
tap.equal(formatBalance(30), chalk.green('+0:30'))
tap.equal(formatBalance(200), chalk.green('+3:20'))
tap.equal(formatBalance(-15), chalk.red('-0:15'))
tap.equal(formatBalance(-150), chalk.red('-2:30'))
