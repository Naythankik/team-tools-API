const { Schema, model } = require('mongoose');

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Workspace name is required.'],
            trim: true,
            maxlength: 80,
        },

        owner: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        description: {
            type: String,
            trim: true,
            maxlength: 250,
        },
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = model('Workspace', workspaceSchema);
