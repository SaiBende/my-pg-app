
//POST Template
import { NextRequest, NextResponse } from 'next/server';

import { uploadFile } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  

    const formData = await request.formData();
    console.log('Form Data:', formData);
    const file = formData.get('file') as File;

    if (!file) {
        return new Response('No file uploaded', { status: 400 });
    }

    try {
        const result = await uploadFile(file,);
        return NextResponse.json({
            message: "File uploaded successfully",
            data: {
                url: result.url,
                public_id: result.public_id,
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        return new Response('File upload failed', { status: 500 });
    }
}