import { connectMongoDB } from "@lib/mongodb";
import User from "@models/user";
import { NextResponse } from "@node_modules/next/server";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { firstName, lastName, email, password, role } = await req.json();

        // Validate the role (optional: ensure it's valid)
        const allowedRoles = ["User", "Owner", "Admin"];
        if (role && !allowedRoles.includes(role)) {
            return NextResponse.json(
                {
                    message: "Invalid role provided. Allowed roles are User, Owner, Admin.",
                },
                { status: 400 }
            );
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Connect to MongoDB
        await connectMongoDB();

        // Create the user
        await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            role: role || "User", // Default role is "User"
        });

        // Test if it works successfully
        return NextResponse.json(
            {
                message: "User registered successfully!",
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                message: "An error occurred while registering the user!",
                error: error.message, // Optional: Include error details for debugging
            },
            { status: 500 }
        );
    }
}
