const { Schema, model, Types } = require('mongoose');

const MessageSchema = new Schema(
    {
        chat: {
            type: Types.ObjectId,
            ref: 'Chat',
            required: true,
            index: true,
        },
        sender: {
            type: Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['text', 'image', 'file', 'video', 'audio'],
            default: 'text',
        },
        content: String,
        media: {
            url: String, // storage, s3, cloudinary
            type: {
                type: String
            }, //jpg, pdf, mp4
            tmpName: String,
            size: Number,
        },
        readBy: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ],
        reactions: [
            {
                user: { type: Types.ObjectId, ref: 'User' },
                emoji: String,
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
);

module.exports = model('Message', MessageSchema);
