const formatUser = (user) => {
    if (!user) return null;

    return {
        id: user._id,
        username: user.username,
        whenLastActive: user.whenLastActive,
        telephone: user.telephone,
        title: user.title,
        status: user.status,
        email: user.email,
        fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        avatar: user.avatar,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const formatUserList = (users) => {
    if(Array.isArray(users)){
      return users.map(formatUser)
    }else {
        return !users ? users : formatUser(users)
    }
};

module.exports = formatUserList;
