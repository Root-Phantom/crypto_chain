const crypto = require('crypto')
cryptoHash = (...inputs) => {
    const hash = crypto.createHash('sha256')
    hash.update(inputs.sort().join(' '))
    return hash.digest('hex')
}

module.exports = cryptoHash