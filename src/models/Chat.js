const { Schema, model, Types} = require('mongoose');

const chatSchema = new Schema(
    {
        workspace:{
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
            index: true,
        },
        channel: {
            type: Types.ObjectId,
            ref: 'Channel',
            required: false,
            index: true,
        },
        type: {
            type: String,
            enum: ['one-to-one', 'group', 'channel'],
            required: true,
        },
        participants: [
            {
                type: Types.ObjectId,
                ref: 'User',
                required: function () {
                    return this.type !== 'channel';
                    // channels can derive participants from Channel model
                },
            },
        ]
    },
    { timestamps: true }
);

chatSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'chat'
});

chatSchema.index({ workspace: 1, type: 1 });
chatSchema.index({ participants: 1 });
chatSchema.index({ channel: 1, type: 1 });

module.exports = model('Chat', chatSchema);
