import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import { KYC } from "@/models/KYCModel";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  await connectToDatabase();

  const existing = await KYC.findOne({ userId: session.user.id }).lean();

  if (!existing) {
    return NextResponse.json({ message: "KYC not found", success: false }, { status: 404 });
  }

  return NextResponse.json({ message: "KYC fetched", success: true, data: existing });
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const existing = await KYC.findOne({ userId: session.user.id });

    if (existing) {
      return NextResponse.json({ message: "KYC already exists", success: false }, { status: 400 });
    }

    // 🔥 Explicitly assign referenceNumber
    const newKyc = new KYC({
      userId: session.user.id,
      referenceNumber: "KYC-" + Date.now(), // ✅ manually assign
    });

    await newKyc.save();

    return NextResponse.json({ message: "KYC created", success: true, data: newKyc });
  } catch (error) {
    console.error("KYC POST error:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}
