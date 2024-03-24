const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken");
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

const generateToken = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS256', expiresIn: '1h' })
}

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1]
    if (!token) return res.status(401).json({ success: false, message: "Error! Token was not provided." })

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] })
        req.userData = decodedToken
        next()
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            console.error('Token expired:', error)
            return res.status(401).json({ success: false, message: "Error! Token expired." })
        } else {
            console.error('Token verification failed:', error)
            return res.status(401).json({ success: false, message: "Error! Token is not valid." })
        }
    }
}


module.exports = { hashPassword, comparePassword, generateToken, verifyToken }