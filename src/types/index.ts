import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  emailVerified?: Date;
  provider?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IIssue extends Document {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  status: 'open' | 'in-progress' | 'resolved';
  location: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  address?: string;
  images: string[];
  userId: Types.ObjectId;
  isAnonymous: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IssueCategory =
  | 'water-supply'
  | 'puddle'
  | 'road'
  | 'garbage'
  | 'electricity'
  | 'streetlight'
  | 'other';

export type IssueStatus = 'open' | 'in-progress' | 'resolved';

export interface CreateIssueInput {
  title: string;
  description: string;
  category: IssueCategory;
  latitude: number;
  longitude: number;
  address?: string;
  images?: string[];
  isAnonymous?: boolean;
}

export interface IssueWithUser extends IIssue {
  user: {
    name: string;
    email: string;
  };
}
