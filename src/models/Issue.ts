import mongoose, { Schema, Model, models } from 'mongoose';
import { IIssue } from '@/types';

const IssueSchema = new Schema<IIssue>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['water-supply', 'puddle', 'road', 'garbage', 'electricity', 'streetlight', 'other'],
        },
        status: {
            type: String,
            enum: ['open', 'in-progress', 'resolved'],
            default: 'open',
        },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: 'Point',
            },
            coordinates: {
                type: [Number],
                required: [true, 'Location coordinates are required'],
                validate: {
                    validator: function (coords: number[]) {
                        return coords.length === 2 && coords[0] >= -180 && coords[0] <= 180 && coords[1] >= -90 && coords[1] <= 90;
                    },
                    message: 'Invalid coordinates',
                },
            },
        },
        address: {
            type: String,
        },
        images: {
            type: [String],
            default: [],
            validate: {
                validator: function (images: string[]) {
                    return images.length <= 5;
                },
                message: 'Cannot upload more than 5 images',
            },
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'User ID is required'],
        },
        isAnonymous: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
IssueSchema.index({ location: '2dsphere' }); // Geospatial index
IssueSchema.index({ category: 1 });
IssueSchema.index({ status: 1 });
IssueSchema.index({ userId: 1 });
IssueSchema.index({ createdAt: -1 });
IssueSchema.index({ isAnonymous: 1 });

const Issue: Model<IIssue> = models.Issue || mongoose.model<IIssue>('Issue', IssueSchema);

export default Issue;
