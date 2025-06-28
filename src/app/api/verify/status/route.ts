// /api/verify/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/connectDB';
import { auth } from '@/lib/auth';
import { UserVerification } from '@/models/VerificationModel';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: 'Unauthorized', success: false }, { status: 401 });
  }

  await connectToDatabase();

  const status = await UserVerification.findOne({ userId: session.user.id });

  return NextResponse.json({ success: true, data: status });
}
