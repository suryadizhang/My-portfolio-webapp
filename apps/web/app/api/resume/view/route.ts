import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

const RESUME_FILE_PATH = path.join(process.cwd(), 'public', 'resume', 'Suryadi_Zhang_Resume.pdf');

export async function GET() {
  try {
    // Check if PDF file exists
    const fileBuffer = await fs.readFile(RESUME_FILE_PATH);
    
    // Convert Buffer to Uint8Array for NextResponse compatibility
    const uint8Array = new Uint8Array(fileBuffer);
    
    // Create response with comprehensive headers for inline PDF viewing
    const response = new NextResponse(uint8Array, {
      status: 200,
      headers: {
        // Essential headers for PDF inline viewing
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Suryadi_Zhang_Resume.pdf"',
        
        // Security and caching headers
        'Cache-Control': 'public, max-age=3600, immutable',
        'X-Content-Type-Options': 'nosniff',
        
        // Additional headers to prevent download and force inline viewing
        'Accept-Ranges': 'bytes',
        'Content-Length': fileBuffer.length.toString(),
      }
    });
    
    return response;
  } catch (error) {
    console.error('Resume view error:', error);
    
    return NextResponse.json(
      { 
        error: 'PDF not available',
        message: 'Resume PDF is not currently available for viewing. Please try downloading instead.',
        contactEmail: 'suryadizhang.swe@gmail.com'
      },
      { status: 404 }
    );
  }
}