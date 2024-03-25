const userRoles = {
    ADMIN: 'Admin',
    REGULAR: 'Regular',
};

const userStatus = {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
    DELETED: 'Deleted',
};

const bookStatus = {
    AVAILABLE: 'Available',
    BORROWED: 'Borrowed',
    LOST: 'Lost',
    REQUESTED: 'Requested',
    COMING_SOON: 'ComingSoon',
}

module.exports = { userRoles, userStatus, bookStatus };