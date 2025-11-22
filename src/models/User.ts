import mongoose, { Schema, Model, models } from 'mongoose';
import { IUser } from '@/types';

const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        image: {
            type: String,
        },
        emailVerified: {
            type: Date,
        },
        provider: {
            type: String,
            enum: ['credentials', 'google'],
            default: 'credentials',
        },
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
UserSchema.index({ email: 1 });

const User: Model<IUser> = models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
