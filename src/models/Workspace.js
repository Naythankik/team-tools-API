const { Schema, model } = require('mongoose');
const slugify = require('slugify');

const workspaceSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Workspace name is required.'],
            trim: true,
            maxlength: 80,
        },
        slug: {
            type: String,
            trim: true,
            lowercase: true,
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
        coverImage: {
            type: String
        }
    },
    { timestamps: true }
);

workspaceSchema.pre('save', function (next) {
    console.log(this)
    if (this.isModified('name')) {
        this.slug = slugify(this.name, { lower: true });
    }
    next();
});


module.exports = model('Workspace', workspaceSchema);
