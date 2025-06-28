import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectToDatabase } from '@/lib/connectDB';
import { Documents } from '@/models/DocumentsModel'; // or wherever your Documents model is
import { uploadFile } from '@/lib/cloudinary';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  await connectToDatabase();

  try {
    const documents = await Documents.findOne({ userId: session.user.id }).lean();
    if (!documents) {
      return NextResponse.json({ message: "Documents not found", success: false }, { status: 404 });
    }

    return NextResponse.json({
      message: "Documents fetched successfully",
      success: true,
      data: documents,
    });
  } catch (error) {
    console.error("❌ Error fetching documents:", error);
    return NextResponse.json({ message: "Server error", success: false }, { status: 500 });
  }
}

// export async function POST(request: NextRequest) {
//   const session = await auth.api.getSession(request);
//   if (!session?.user) {
//     return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
//   }

//   const formData = await request.formData();

//   try {
//     const idProof = formData.get('idProof') as File;
//     const addressProof = formData.get('addressProof') as File;
//     const passportPhoto = formData.get('passportPhoto') as File;
//     const selfieWithId = formData.get('selfieWithId') as File;

//     if (!idProof || !addressProof || !passportPhoto || !selfieWithId) {
//       return NextResponse.json({ message: "All files are required", success: false }, { status: 400 });
//     }

//     await connectToDatabase();

//     const [idProofRes, addressProofRes, passportPhotoRes, selfieRes] = await Promise.all([
//       uploadFile(idProof),
//       uploadFile(addressProof),
//       uploadFile(passportPhoto),
//       uploadFile(selfieWithId)
//     ]);

//     const uploadedData = {
//       userId: session.user.id,
//       idProof: idProofRes.url,
//       addressProof: addressProofRes.url,
//       passportPhoto: passportPhotoRes.url,
//       selfieWithId: selfieRes.url,
//     };

//     const savedDoc = await Documents.findOneAndUpdate(
//       { userId: session.user.id },
//       uploadedData,
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     return NextResponse.json({
//       message: "Documents uploaded successfully",
//       success: true,
//       data: savedDoc,
//     });
//   } catch (error) {
//     console.error("❌ Upload or save error:", error);
//     return NextResponse.json({ message: "Upload failed", success: false }, { status: 500 });
//   }
// }
export async function POST(request: NextRequest) {
  const session = await auth.api.getSession(request);
  if (!session?.user) {
    return NextResponse.json({ message: "Unauthorized", success: false }, { status: 401 });
  }

  const formData = await request.formData();

  const idProof = formData.get('idProof') as File | null;
  const addressProof = formData.get('addressProof') as File | null;
  const passportPhoto = formData.get('passportPhoto') as File | null;
  const selfieWithId = formData.get('selfieWithId') as File | null;

  if (!idProof && !addressProof && !passportPhoto && !selfieWithId) {
    return NextResponse.json({ message: "No files provided", success: false }, { status: 400 });
  }

  await connectToDatabase();

  try {
    const updatePayload: Partial<Documents> = {
      userId: new mongoose.Types.ObjectId(session.user.id),
    };

    if (idProof) {
      const res = await uploadFile(idProof);
      updatePayload.idProof = res.url;
    }
    if (addressProof) {
      const res = await uploadFile(addressProof);
      updatePayload.addressProof = res.url;
    }
    if (passportPhoto) {
      const res = await uploadFile(passportPhoto);
      updatePayload.passportPhoto = res.url;
    }
    if (selfieWithId) {
      const res = await uploadFile(selfieWithId);
      updatePayload.selfieWithId = res.url;
    }

    const savedDoc = await Documents.findOneAndUpdate(
      { userId: session.user.id },
      { $set: updatePayload },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return NextResponse.json({
      message: "Documents uploaded successfully",
      success: true,
      data: savedDoc,
    });
  } catch (error) {
    console.error("❌ Upload or save error:", error);
    return NextResponse.json({ message: "Upload failed", success: false }, { status: 500 });
  }
}
