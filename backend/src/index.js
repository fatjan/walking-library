const express = require('express')
const user = require('./user')
const { verifyToken } = require('./helper')

const app = express()
app.use(express.json())

// Health Check

app.get('/', (req, res) => {
    res.send('Server is running')
})

// User

app.post('/user/signup', user.signup);
app.post('/user/login', user.login);
app.get('/users', verifyToken, user.getUsers);
app.get('/user/:id', verifyToken, user.getUserById);
app.put('/user/:id', verifyToken, user.updateUser);
app.delete('/user/:id', verifyToken, user.deleteUser);
app.put('/user/status/:username', verifyToken, user.updateUserStatus);

const server = app.listen(3000, () =>
    console.log(`
    🚀 Server ready at: http://localhost:3000
`))