const { Schema, model } = require('mongoose');

const chatSchema = new Schema(
    {
        channel: {
            type: Schema.Types.ObjectId,
            ref: 'Channel',
            required: true,
            index: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        content: {
            type: String,
            required: true,
            trim: true,
        },
        attachments: [
            {
                url: String,
                type: {
                    type: String,
                },
            }
        ],
        reactions: [
            {
                user: { type: Schema.Types.ObjectId, ref: 'User' },
                emoji: String,
            }
        ],
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = model('Chat', chatSchema);
