import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { connectMongoDB } from "@lib/mongodb";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    console.log("Connecting to MongoDB...");
    await connectMongoDB();
    console.log("Connected to MongoDB");

    const users = await mongoose.connection.db.collection("users").find().toArray();
    console.log("Fetched users:", users);

    return new Response(JSON.stringify(users), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}


export async function PATCH(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "Admin") {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { userId, role } = body;

    if (!userId || !role) {
      return new Response("Bad Request: Missing userId or role", { status: 400 });
    }

    await connectMongoDB();

    // Update only the role field (partial update)
    await mongoose.connection.db.collection("users").updateOne(
      { _id: new mongoose.Types.ObjectId(userId) }, // Convert userId to ObjectId
      { $set: { role } } // Only update the role field
    );

    return new Response("User role updated", { status: 200 });
  } catch (error) {
    console.error("Error updating user role:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

