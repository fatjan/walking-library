const bcrypt = require('bcrypt')
const saltRounds = 10

const hashPassword = async (password) => {
    bcrypt
        .genSalt(saltRounds)
        .then(salt => {
            return bcrypt.hash(password, salt)
        })
        .then(hash => {
            return hash
        })
        .catch(err => console.error(err.message))
}

module.exports = { hashPassword }