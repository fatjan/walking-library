const express = require('express')
const { PrismaClient } = require('@prisma/client')
const { userRoles, userStatus } = require('./helper/constants')
const { hashPassword, comparePassword, generateToken, verifyToken } = require('./helper')

const prisma = new PrismaClient()
const app = express()

app.use(express.json())

app.post(`/user/signup`, async (req, res) => {
    const { name, username, email, password, role = userRoles.REGULAR } = req.body

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
        } else if (user.status === userStatus.INACTIVE) {
            res.json({ error: 'Failed to login. Inactive user' })
        } else if (user.status === userStatus.DELETED) {
            res.json({ error: 'Failed to login. Deleted user' })
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

app.get('/users', verifyToken, async (req, res) => {
    const { name, username, phoneNumber } = req.params
    try {
        const userRole = req.userData.role
        if (userRole !== userRoles.ADMIN) {
            res.status(403)
                .json(
                    {
                        success: false,
                        message: "Error! You are not authorized to perform this operation."
                    }
                );
        }

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
            select: {
                id: true,
                name: true,
                username: true,
                email: true,
                phoneNumber: true,
                address: true,
                role: true,
                status: true,
                createdAt: true,
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

app.get('/user/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const userRole = req.userData.role
    const userId = req.userData.id
    if (userRole !== userRoles.ADMIN && userId !== Number(id)) {
        res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    try {
        const userData = await prisma.user.findUnique({
            where: { id: Number(id) },
        })
        if (!userData) {
            res
                .status(404)
                .json({
                    success: false,
                    message: `User with ID ${id} not found`
                })
        }

        delete userData.password
        res
            .status(200)
            .json({
                success: true,
                message: "User retrieved successfully",
                data: userData
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to retrieve user with ID ${id}`,
                message: error.message
            })
    }
})

app.put('/user/:id', verifyToken, async (req, res) => {
    const { id } = req.params
    const { name, password, userName, email, phoneNumber, address, role } = req.body
    if (!id) {
        res
            .status(400)
            .json({
                success: false,
                message: "Error! User ID is required"
            })
    }

    const userId = req.userData.id
    if (userId !== Number(id)) {
        res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                name,
                password: password ? await hashPassword(password) : undefined,
                userName,
                email,
                phoneNumber,
                address,
                role,
            },
        })
        delete updatedUser.password

        res
            .status(201)
            .json({
                success: true,
                message: "User updated successfully",
                data: updatedUser
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to update user with ID ${id}`,
                message: error.message
            })
    }
})

app.delete(`/user/:id`, verifyToken, async (req, res) => {
    const { id } = req.params
    if (!id) {
        res
            .status(400)
            .json({
                success: false,
                message: "Error! User ID is required"
            })
    }
    const userId = req.userData.id
    if (userId !== Number(id)) {
        res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    try {
        user = await prisma.user.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (!user) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: `User with ID ${id} not found`
                })
        }

        await prisma.user.update({
            where: {
                id: Number(id),
            },
            data: {
                status: userStatus.DELETED,
            },
        })

        res.status(204)
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to delete user with ID ${id}`,
                message: error.message
            })
    }
})

app.put('/user/status/:username', verifyToken, async (req, res) => {
    const { username } = req.params
    const { active } = req.body
    const userRole = req.userData.role
    if (userRole !== userRoles.ADMIN) {
        res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    const status = active ? userStatus.ACTIVE : userStatus.INACTIVE

    const updatedUser = await prisma.user.update({
        where: {
            username,
        },
        data: {
            status,
        },
    })

    res.status(201)
        .json({
            success: true,
            message: "User status updated successfully",
            data: updatedUser
        })
})

const server = app.listen(3000, () =>
    console.log(`
    🚀 Server ready at: http://localhost:3000
`))