const { Schema, model, Types } = require('mongoose');

const directMessageSchema = new Schema({
        workspace: {
            type: Types.ObjectId,
            ref: 'Workspace',
            required: true,
            index: true,
        },
        participants: [
            {
                type: Types.ObjectId,
                ref: 'User',
                required: true,
            },
        ],
        lastMessage: {
            text: String,
            at: Date,
            sender: { type: Types.ObjectId, ref: 'User' },
        },
    },
    { timestamps: true }
);

module.exports = model('DirectMessage', directMessageSchema);
