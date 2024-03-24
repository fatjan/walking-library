const express = require('express')
const { PrismaClient } = require('@prisma/client')
const userRoles = require('./helper/constants')
const { hashPassword, comparePassword } = require('./helper')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.post(`/user/signup`, async (req, res) => {
    const { name, username, email, password, role = userRoles.USER } = req.body

    try {
        const hashedPassword = await hashPassword(password)
        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                role,
            },
        })

        delete newUser.password;

        res.json({
            status: "success",
            message: "User created successfully",
            data: newUser
        })
    } catch (error) {
        res.json({ error: `Failed to create user` })
    }
})

app.post(`/user/login`, async (req, res) => {
    const { username, password } = req.body

    try {
        const user = await prisma.user.findFirst({
            where: {
                username,
            },
        })

        if (comparePassword(password, user.password)) {
            delete user.password
            res.json({
                status: "success",
                message: "User login successfully",
                data: user
            })
        } else {
            res.json({ error: 'Invalid username or password' })
        }
    } catch (error) {
        res.json({ error: `Failed to login`, message: error.message })
    }
})

app.get('/users', async (req, res) => {
    const { name, username, phoneNumber } = req.params

    try {
        const users = await prisma.user.findMany({
            take: 100,
            where: {
                name: {
                    contains: name,
                },
                username: {
                    contains: username,
                },
                phoneNumber: {
                    contains: phoneNumber,
                },
            },
            orderBy: {
                name: 'asc',
            },
        })

        res.json(users)
    } catch (error) {
        res.json({ error: `Failed getting users` })
    }
})

app.get('/user/:id', async (req, res) => {
    const { id } = req.params

    try {
        const userData = await prisma.user.findUnique({
            where: { id: Number(id) },
        })
        res.json(userData)
    } catch (error) {
        res.json({ error: `User with ID ${id} does not exist in the database` })
    }
})

app.put('/user/:id', async (req, res) => {
    const { id } = req.params
    const { name, password, userName, phoneNumber, address } = req.query

    const updatedUser = await prisma.user.update({
        where: {
            id,
        },
        data: {
            name,
            password,
            userName,
            phoneNumber,
            address,
        },
    })

    res.json(updatedUser)
})

app.delete(`/user/:id`, async (req, res) => {
    const { id } = req.params
    const deletedUser = await prisma.user.delete({
        where: {
            id: Number(id),
        },
    })
    res.json(deletedUser)
})

app.put('/user/status/:username', async (req, res) => {
    const { username } = req.params
    const { suspended } = req.query

    const status = suspended ? 'suspended' : 'active'

    const updatedUser = await prisma.user.update({
        where: {
            username,
        },
        data: {
            status,
        },
    })

    res.json(updatedUser)
})

const server = app.listen(3000, () =>
    console.log(`
    🚀 Server ready at: http://localhost:3000
`))