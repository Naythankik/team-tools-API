const { Schema, model } = require('mongoose');

const channelSchema = new Schema(
    {
        // The workspace this channel belongs to. This is a crucial link.
        workspace: {
            type: Schema.Types.ObjectId,
            ref: 'Workspace',
            required: true,
            index: true,
        },
        // The human-readable name of the channel (e.g., "general", "project-x")
        name: {
            type: String,
            required: [true, 'Channel name is required.'],
            trim: true,
            lowercase: true,
            maxlength: 80,
        },
        // A short description or topic for the channel.
        description: {
            type: String,
            trim: true,
            maxlength: 250,
        },
        channelType: {
            type: String,
            enum: ['public', 'private'],
            default: 'public',
            required: true,
        },
        // An array of user IDs who are members of this channel.
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
        },
        // A flag to soft-delete or hide a channel without permanently removing it.
        isArchived: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// This ensures that a channel name is unique ONLY within its specific workspace.
// So, two different workspaces can both have a channel named "general".
channelSchema.index({ workspace: 1, name: 1 }, { unique: true });

module.exports = model('Channel', channelSchema);
