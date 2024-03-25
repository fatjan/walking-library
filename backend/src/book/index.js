const prisma = require('../../prisma')
const { userRoles } = require('../helper/constants')

exports.getBooks = async (req, res) => {
    const { title, author, status, includeBorrowers = false } = req.query
    try {
        const books = await prisma.book.findMany({
            take: 100,
            where: {
                title: {
                    contains: title || '',
                    mode: 'insensitive'
                },
                author: {
                    contains: author || '',
                    mode: 'insensitive'
                },
                status,
            },
            orderBy: {
                title: 'asc',
            },
            select: {
                id: true,
                title: true,
                author: true,
                description: true,
                isFree: true,
                status: true,
                borrowers: includeBorrowers ? {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                    }
                } : false,
            },
        })
        res
            .status(200)
            .json({
                success: true,
                data: books,
                count: books.length,
                message: 'Books fetched successfully'
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: 'Failed to fetch books',
                message: error.message
            })
    }
}

exports.getBooksByBorrower = async (req, res) => {
    const { userId } = req.userData.id
    try {
        const books = await prisma.book.findMany({
            where: {
                borrowerId: {
                    userId,
                },
            },
        })
        res
            .status(200)
            .json({
                success: true,
                data: books,
                count: books.length,
                message: 'Books fetched successfully'
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: 'Failed to fetch books',
                message: error.message
            })
    }
}

exports.getBook = async (req, res) => {
    const { id } = req.params
    try {
        const book = await prisma.book.findUnique({
            where: {
                id: Number(id),
            },
        })
        if (!book) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: `Book with ID ${id} not found`
                })
        }
        res
            .status(200)
            .json({ success: true, book })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to fetch book with ID ${id}`,
                message: error.message
            })
    }
}

exports.createBook = async (req, res) => {
    const userRole = req.userData.role
    if (userRole !== userRoles.ADMIN) {
        return res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    const { title, author, description, isFree, status } = req.body
    try {
        const book = await prisma.book.create({
            data: {
                title,
                author,
                description,
                isFree,
                status,
            },
        })
        res
            .status(201)
            .json({
                success: true,
                message: "Book created successfully",
                data: book
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: 'Failed to create book',
                message: error.message
            })
    }
}

exports.updateBook = async (req, res) => {
    const userRole = req.userData.role
    if (userRole !== 'ADMIN') {
        return res.status(403)
            .json(
                {
                    success: false,
                    message: "Error! You are not authorized to perform this operation."
                }
            );
    }

    const { id } = req.params
    const { title, author, description, isFree, status } = req.body
    try {
        const book = await prisma.book.update({
            where: {
                id: Number(id),
            },
            data: {
                title,
                author,
                description,
                isFree,
                status,
            },
        })
        res
            .status(201)
            .json({
                success: true,
                message: "Book updated successfully",
                data: book
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to update book with ID ${id}`,
                message: error.message
            })
    }
}

exports.deleteBook = async (req, res) => {
    const { id } = req.params
    try {
        const book = await prisma.book.delete({
            where: {
                id: Number(id),
            },
        })
        res
            .status(201)
            .json({
                success: true,
                message: "Book deleted successfully",
                data: book
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to delete book with ID ${id}`,
                message: error.message
            })
    }
}

