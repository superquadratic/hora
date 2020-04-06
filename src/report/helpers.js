const chalk = require('chalk')

exports.formatBalance = function(balance) {
  const [color, sign] = colorAndSign(balance);
  const absBalance = Math.abs(balance)
  const hours = Math.floor(absBalance / 60)
  const minutes = absBalance - 60 * hours

  return color(sign + hours.toString() + ':' + minutes.toString().padStart(2, '0'))
}

function colorAndSign(balance) {
  if (balance > 0) {
    return [chalk.green, '+']
  } else if (balance < 0) {
    return [chalk.red, '-']
  } else {
    return [chalk.gray, ' ']
  }
}
