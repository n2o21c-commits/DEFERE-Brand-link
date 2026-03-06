import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ error: 'Vercel Blob Token이 설정되지 않았습니다 (Vercel 설정에서 추가해주세요)' }, { status: 500 });
    }

    const filename = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const blob = await put(filename, file, { access: 'public' });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('Upload error:', message);
    return NextResponse.json({ error: 'Upload failed: ' + message }, { status: 500 });
  }
}
