const { Schema, model } = require('mongoose');

const tokenSchema = new Schema(
    {
        otp: {
            type: Number,
            required: true,
            unique: true,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: () => new Date(Date.now() + 10 * 60 * 1000),
        }
    },
    {
        timestamps: true
    }
);

tokenSchema.index({ user: 1 });

module.exports = model('Token', tokenSchema);
