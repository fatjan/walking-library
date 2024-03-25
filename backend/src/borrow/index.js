const prisma = require('../../prisma')
const { userRoles } = require('../helper/constants')

exports.borrowBook = async (req, res) => {
    const userRole = req.userData.role
    if (userRole === userRoles.ADMIN) {
        return res
            .status(403)
            .json({
                success: false,
                message: "Error! You are not authorized to borrow a book"
            })
    }

    const { bookId } = req.params
    if (!bookId) {
        return res
            .status(400)
            .json({
                success: false,
                message: "Error! Book ID is required"
            })
    }

    const userId = req.userData.id

    try {
        const book = await prisma.book.findUnique({
            where: {
                id: Number(bookId),
            },
        })
        if (!book) {
            return res
                .status(404)
                .json({
                    success: false,
                    message: `Book with ID ${bookId} not found`
                })
        }

        const borrowedBook = await prisma.borrow.create({
            data: {
                book: { connect: { id: Number(bookId) } },
                createdBy: { connect: { id: userId } },
            },
        })

        res
            .status(201)
            .json({
                success: true,
                message: "Book borrowed successfully",
                data: borrowedBook
            })
    } catch (error) {
        res
            .status(500)
            .json({
                success: false,
                error: `Failed to borrow book with ID ${bookId}`,
                message: error.message
            })
    }
}

// expiredAt: new Date(new Date().setDate(new Date().getDate() + 30))
