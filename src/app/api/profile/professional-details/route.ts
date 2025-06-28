import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import { ProfessionalDetails } from "@/models/ProfessionalDetailsModel";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession(request);
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
    }

    await connectToDatabase();

    const details = await ProfessionalDetails.findOne({ userId: session.user.id });
    if (!details) {
      return NextResponse.json({ message: "Professional details not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ message: "Fetched successfully", success: true, data: details });
  } catch (error) {
    console.error("❌ Error in GET /api/profile/professional:", error);
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

    const updated = await ProfessionalDetails.findOneAndUpdate(
      { userId },
      { ...body, userId },
      { upsert: true, new: true, runValidators: true }
    );

    return NextResponse.json({
      message: "Professional details saved",
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/profile/professional:", error);
    return NextResponse.json({ message: "Internal Server Error", success: false }, { status: 500 });
  }
}

