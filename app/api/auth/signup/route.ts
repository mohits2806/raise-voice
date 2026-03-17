import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { signUpSchema } from '@/lib/validations';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validate input
        const validatedData = signUpSchema.parse(body);

        await dbConnect();

        // Check if user already exists by email
        const existingEmail = await User.findOne({ email: validatedData.email });
        if (existingEmail) {
            return NextResponse.json({ error: 'An account with this email already exists' }, { status: 400 });
        }

        // Check if phone number is already taken
        if (validatedData.phone) {
            const existingPhone = await User.findOne({ phone: validatedData.phone });
            if (existingPhone) {
                return NextResponse.json({ error: 'An account with this phone number already exists' }, { status: 400 });
            }
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validatedData.password, 12);

        // Create new user
        const user = await User.create({
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || '',
            password: hashedPassword,
            provider: 'credentials',
        });

        return NextResponse.json(
            {
                message: 'User created successfully',
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                },
            },
            { status: 201 }
        );
    } catch (error: any) {
        console.error('Signup error:', error);

        if (error.name === 'ZodError') {
            return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
        }

        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
