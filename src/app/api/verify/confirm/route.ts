// /api/verify/confirm/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/connectDB';
import { auth } from '@/lib/auth';
import { UserVerification } from '@/models/VerificationModel';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
  }

  await connectToDatabase();

  const { type, otp } = await request.json(); // type: "email" | "mobile"

  if (!['email', 'mobile'].includes(type)) {
    return NextResponse.json({ message: 'Invalid type', success: false }, { status: 400 });
  }

  const verification = await UserVerification.findOne({ userId: session.user.id });

  if (!verification || !verification[type]?.otp) {
    return NextResponse.json({ message: 'No OTP found', success: false }, { status: 404 });
  }

  const savedOtp = verification[type].otp;
  const sentTime = verification[type].createdAt;
  const now = new Date();

  const timeDiff = (now.getTime() - new Date(sentTime).getTime()) / 1000 / 60; // in minutes

  if (timeDiff > 5) {
    return NextResponse.json({ message: 'OTP expired', success: false }, { status: 400 });
  }

  if (otp !== savedOtp) {
    return NextResponse.json({ message: 'Invalid OTP', success: false }, { status: 400 });
  }

  verification[type].verified = true;
  verification[type].otp = undefined;
  verification[type].createdAt = undefined;

  await verification.save();

  return NextResponse.json({ message: `${type} verified`, success: true });
}
