import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import User from "@/models/UserModel";

// Connect to MongoDB using Mongoose before handling the request
await connectToDatabase();

export async function GET(request: NextRequest) {

    try {
        // Authenticate user session via BetterAuth
        const session = await auth.api.getSession(request);

        if (!session?.user) {
            return NextResponse.json(
                {
                    message: "Unauthorized API Access",
                    success: false
                },
                { status: 401 }
            );
        }

        const userEmail = session.user.email;
        console.log("✅ Session user email:", userEmail);

        if (!userEmail) {
            return NextResponse.json(
                { message: "Invalid session data", success: false },
                { status: 400 }
            );
        }

        // Find the user in MongoDB using Mongoose by email
        const userData = await User.findOne({ email: userEmail }).lean();

        if (!userData) {
            console.warn("⚠️ User not found with email:", userEmail);
            return NextResponse.json(
                { message: "User not found", success: false },
                { status: 404 }
            );
        }

        // Respond with the user data
        return NextResponse.json(
            {
                message: "User Profile",
                success: true,
                data: userData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("❌ Error fetching user profile:", error);
        return NextResponse.json(
            { message: "Internal Server Error", success: false },
            { status: 500 }
        );
    }
}
