import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import { ProfileModel } from "@/models/ProfileModel";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    await connectToDatabase();

    const profile = await ProfileModel.findOne({ userId: session.user.id });

    if (!profile) {
      return NextResponse.json({ message: "Profile not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile fetched", success: true, data: profile }, { status: 200 });
  } catch (error) {
    console.error("❌ Error in GET /api/profile/basic:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();
    const userId = session.user.id;

    const updatedProfile = await ProfileModel.findOneAndUpdate(
      { userId },
      { ...body, userId }, // Merge form data and session userId
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Profile saved successfully",
      success: true,
      data: updatedProfile,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/profile/basic:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}
