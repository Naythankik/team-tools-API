const formatUser = (user) => {
    if (!user) return null;

    return {
        id: user._id,
        username: user.username,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

// const formatUserList = (users = []) => users.map(formatUser);

module.exports = formatUser;
