import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/connectDB';
import { auth } from '@/lib/auth';
import { UserVerification } from '@/models/VerificationModel';
import crypto from 'crypto';
import { sendEmail } from '@/lib/mail-service';

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
  }

  await connectToDatabase();

  const { type } = await request.json(); // "email" or "mobile"

  if (!['email', 'mobile'].includes(type)) {
    return NextResponse.json({ message: 'Invalid verification type', success: false }, { status: 400 });
  }

  let verification = await UserVerification.findOne({ userId: session.user.id });

  // If already verified, don't resend OTP
  if (verification && verification[type]?.verified) {
    return NextResponse.json({
      message: `${type} is already verified.`,
      success: false,
    }, { status: 409 });
  }

  const otp = crypto.randomInt(100000, 999999).toString();
  const now = new Date();

  const update = {
    [`${type}.otp`]: otp,
    [`${type}.createdAt`]: now,
    [`${type}.verified`]: false,
  };

  // Upsert (create if not exists)
  verification = await UserVerification.findOneAndUpdate(
    { userId: session.user.id },
    { $set: update },
    { upsert: true, new: true }
  );

  // TODO: Send OTP via email or SMS here
  console.log(`Send ${type} OTP: ${otp}`);
  if (type === 'email') {
    // Send email with OTP
    sendEmail({
      to: session.user.email,
      subject: 'Your OTP Code',
      text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
      html: `<p>Your OTP code is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
    }).catch(error => {
      console.error('Failed to send email:', error);
      return NextResponse.json({ message: 'Failed to send OTP email', success: false }, { status: 500 });
    })
  } else if (type === 'mobile') {
    console.log(`Send mobile OTP: ${otp}`);
  }

  return NextResponse.json({
    message: `OTP sent to your ${type}`,
    success: true,
  });
}
