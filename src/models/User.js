const { Schema, model } = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
    {
        firstName: {
            type: String,
            trim: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        username: {
            type: String,
            unique: true,
            sparse: true,
            trim: true,
        },
        title: String,
        email: {
            type: String,
            unique: true,
            lowercase: true,
        },
        avatar: {
            type: String,
            default: 'https://randomuser.me/api/portraits/men/100.jpg',
        },
        password: {
            type: String,
            minlength: 6,
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
        },
        telephone: {
            type: String,
            sparse: true,
            unique: true,
        },
        status: {
            type: String,
            enum: ['online', 'offline', 'away'],
            default: 'offline',
        },
        whenLastActive: Date,
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
        registrationToken: String,
    },
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true },
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


userSchema.virtual('token', {
    ref: 'Token',
    localField: '_id',
    foreignField: 'user',
    justOne: true,
});

userSchema.methods.comparePassword = async function (inputPassword) {
    return await bcrypt.compare(inputPassword, this.password);
};

module.exports = model('User', userSchema);
