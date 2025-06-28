import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/connectDB";
import { BankDetailsModel } from "@/models/BankDetailsModel";

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const bankData = await BankDetailsModel.findOne({ userId: session.user.id }).lean();
    if (!bankData) {
      return NextResponse.json({ message: "Bank details not found", success: false }, { status: 404 });
    }

    return NextResponse.json({ message: "Bank details fetched", success: true, data: bankData }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching bank details:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);

  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  const body = await request.json();
  const {
    accountHolderName,
    accountNumber,
    bankName,
    ifscCode,
    branchName,
    accountType
  } = body;

  // Basic validation
  if (!accountHolderName || !accountNumber || !bankName || !ifscCode || !accountType) {
    return NextResponse.json({ message: "Missing required fields", success: false }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const updated = await BankDetailsModel.findOneAndUpdate(
      { userId: session.user.id },
      {
        userId: session.user.id,
        accountHolderName,
        accountNumber,
        bankName,
        ifscCode,
        branchName,
        accountType,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({ message: "Bank details saved", success: true, data: updated }, { status: 200 });
  } catch (error) {
    console.error("❌ Error saving bank details:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}