import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Get the PDF file path
    const pdfPath = join(process.cwd(), 'public', 'resume', 'Suryadi_Zhang_Resume.pdf')
    
    // Read the PDF file
    const pdfBuffer = readFileSync(pdfPath)
    
    // Create response with appropriate headers
    const response = new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="Suryadi_Zhang_Resume.pdf"',
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Content-Type-Options': 'nosniff',
        'Content-Length': pdfBuffer.length.toString(),
        // Allow embedding in iframes from same origin
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': 'frame-ancestors \'self\'',
      },
    })
    
    return response
  } catch (error) {
    console.error('Error serving PDF:', error)
    return new NextResponse('PDF not found', { status: 404 })
  }
}

// Handle HEAD requests for proper HTTP compliance
export async function HEAD() {
  try {
    const pdfPath = join(process.cwd(), 'public', 'resume', 'Suryadi_Zhang_Resume.pdf')
    const pdfBuffer = readFileSync(pdfPath)
    
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Length': pdfBuffer.length.toString(),
        'Cache-Control': 'public, max-age=86400, immutable',
        'X-Frame-Options': 'SAMEORIGIN',
      },
    })
  } catch (error) {
    return new NextResponse(null, { status: 404 })
  }
}