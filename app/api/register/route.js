import { connectMongoDB } from "@lib/mongodb";
import User from "@models/user";
import { NextResponse } from "@node_modules/next/server";
import bcrypt from "bcryptjs"

export async function POST(req) {
    try {
        const { firstName, lastName, email, password } = await req.json();

        // hash the password 
        const hashedPassword = await bcrypt.hash(password, 10)

        // connect the mongodb by import it from models
        await connectMongoDB();
        await User.create({ firstName, lastName, email, password: hashedPassword });

        // test if it works successfully
        return NextResponse.json({
            message: "Login Successfully!"
        }, { status: 201 });
    } catch (error) {
        return NextResponse.json({
            message: "An Error occurred while login!"
        }, { status: 500 });
    }
}