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
    {
        timestamps: true,
        toObject: { virtuals: true },
        toJSON: { virtuals: true }
    }
);

directMessageSchema.virtual('conversation', {
    ref: 'Conversation',
    localField: '_id',
    foreignField: 'directMessage'
});

module.exports = model('DirectMessage', directMessageSchema);
