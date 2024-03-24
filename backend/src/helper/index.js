const bcrypt = require('bcrypt')
const saltRounds = 10

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

const comparePassword = async (password, hash) => {
    try {
        return await bcrypt.compare(password, hash)
    } catch (error) {
        console.error(error.message)
        throw error
    }
}

module.exports = { hashPassword, comparePassword }