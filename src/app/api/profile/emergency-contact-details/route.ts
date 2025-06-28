import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import { EmergencyContactModel } from "@/models/EmergencyModel"

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  await connectToDatabase();
  try {
    const contact = await EmergencyContactModel.findOne({ userId: session.user.id }).lean();
    if (!contact) {
      return NextResponse.json({ message: "Emergency contact not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ message: "Emergency contact fetched", success: true, data: contact }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching emergency contact:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  const body = await request.json();
  const { contactName, relationship, mobileNumber, address } = body;

  if (!contactName || !relationship || !mobileNumber) {
    return NextResponse.json({ message: "Required fields are missing", success: false }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const updated = await EmergencyContactModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        contactName,
        relationship,
        mobileNumber,
        address
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Emergency contact saved", success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving emergency contact:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}
