
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(path.join(dataDir, 'settings.json'), JSON.stringify(data, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Settings save error:', error);
    return NextResponse.json({ error: 'Save failed' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const filepath = path.join(process.cwd(), 'data', 'settings.json');
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf-8');
      return NextResponse.json(JSON.parse(data));
    }
    return NextResponse.json(null);
  } catch (error) {
    console.error('Settings load error:', error);
    return NextResponse.json({ error: 'Load failed' }, { status: 500 });
  }
}
