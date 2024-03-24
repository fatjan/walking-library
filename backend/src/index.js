const express = require('express')
const { PrismaClient } = require('@prisma/client')
const userRoles = require('./helper/constants')
const { hashPassword, comparePassword, generateToken, verifyToken } = require('./helper')

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

        res
            .status(201)
            .json({
                success: true,
                message: "User created successfully",
                data: newUser
            })
    } catch (error) {
        res
            .status(500)
            .json({ success: false, error: `Failed to create user` })
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

        if (!user) {
            res.json({ error: 'Invalid username or password' })
        } else if (user.status === 'Suspended') {
            res.json({ error: 'Failed to login. This user account is suspended' })
        }

        if (comparePassword(password, user.password)) {
            const token = generateToken({ id: user.id, username: user.username, role: user.role })
            delete user.password
            user.token = token
            res
                .status(200)
                .json({
                    success: true,
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
    const token =
        req.headers
            .authorization.split(' ')[1]
    if (!token) {
        res.status(401)
            .json(
                {
                    success: false,
                    message: "Error! Token was not provided."
                }
            );
    }

    const decodedToken = verifyToken(token)

    if (!decodedToken) {
        res.status(401)
            .json(
                {
                    success: false,
                    message: "Error! Token is not valid."
                }
            );
    }

    console.log('decodedToken', decodedToken)

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

        res
            .status(200)
            .json({
                success: true,
                message: "Users retrieved successfully",
                data: users
            })
    } catch (error) {
        res.json({ success: false, error: `Failed getting users` })
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