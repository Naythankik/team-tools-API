const { Schema, model, Types } = require('mongoose');

const ConversationSchema = new Schema(
    {
        directMessage: {
            type: Types.ObjectId,
            ref: 'DirectMessage',
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
            enum: ['text', 'image', 'file', 'video'],
            default: 'text',
        },
        text: String,
        mediaUrl: String,
        mediaType: String,
        readBy: [
            {
                type: Types.ObjectId,
                ref: 'User',
            },
        ]
    },
    { timestamps: true }
);

module.exports = model('Conversation', ConversationSchema);
