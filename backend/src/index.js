const express = require('express')
const { verifyToken } = require('./helper')
const user = require('./user')
const book = require('./book')

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

// Book

app.get('/books', book.getBooks);
app.get('/books/borrower', verifyToken, book.getBooksByBorrower);
app.get('/book/:id', book.getBook);
app.post('/book', verifyToken, book.createBook);
app.put('/book/:id', verifyToken, book.updateBook);
app.delete('/book/:id', verifyToken, book.deleteBook);


const server = app.listen(3000, () =>
    console.log(`
    🚀 Server ready at: http://localhost:3000
`))