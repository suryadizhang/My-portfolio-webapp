import { NextRequest, NextResponse } from 'next/server';
import { getProfile } from '@/lib/content';
import path from 'path';
import fs from 'fs/promises';

const RESUME_FILE_PATH = path.join(process.cwd(), 'public', 'resume', 'Suryadi_Zhang_Resume.pdf');

// Server-side analytics logging function
async function logServerAnalytics(eventData: any) {
  try {
    // In a real implementation, you might send this to your analytics service
    // For now, we'll just log it to the console
    console.log('Analytics Event:', JSON.stringify(eventData, null, 2));
    
    // You could also write to a file, send to a service, etc.
    // Example: await writeAnalyticsToFile(eventData);
  } catch (error) {
    console.error('Failed to log analytics:', error);
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get('format') || 'pdf';
  const token = searchParams.get('token');
  
  // Get client information for analytics
  const userAgent = request.headers.get('user-agent') || '';
  const referer = request.headers.get('referer') || '';
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  try {
    // Log analytics event
    await logServerAnalytics({
      type: 'resume_download',
      properties: {
        format,
        hasToken: !!token,
        userAgent,
        referer,
        clientIP,
        downloadedAt: new Date().toISOString()
      }
    });

    if (format === 'pdf') {
      return await downloadPDF();
    } else if (format === 'json') {
      return downloadJSON();
    } else {
      return NextResponse.json(
        { error: 'Invalid format. Supported formats: pdf, json' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Resume download error:', error);
    
    // Log error analytics
    await logServerAnalytics({
      type: 'resume_download_error',
      properties: {
        error: error instanceof Error ? error.message : 'Unknown error',
        format,
        userAgent,
        referer
      }
    });

    return NextResponse.json(
      { error: 'Failed to download resume' },
      { status: 500 }
    );
  }
}

async function downloadPDF() {
  try {
    // Check if PDF file exists
    const fileBuffer = await fs.readFile(RESUME_FILE_PATH);
    
    // Convert Buffer to Uint8Array for NextResponse
    const uint8Array = new Uint8Array(fileBuffer);
    
    const response = new NextResponse(uint8Array);
    response.headers.set('Content-Type', 'application/pdf');
    response.headers.set('Content-Disposition', 'attachment; filename="Suryadi_Zhang_Resume.pdf"');
    response.headers.set('Cache-Control', 'private, max-age=3600'); // Cache for 1 hour
    
    return response;
  } catch (error) {
    // If PDF doesn't exist, return instructions
    return NextResponse.json(
      { 
        error: 'PDF not available',
        message: 'Resume PDF is not currently available for direct download. Please contact me via email for the latest version.',
        contactEmail: 'suryadizhang.swe@gmail.com',
        alternatives: {
          json: '/api/resume/download?format=json',
          contact: '/contact'
        }
      },
      { status: 404 }
    );
  }
}

function downloadJSON() {
  const profile = getProfile();
  
  const resumeData = {
    personalInfo: {
      name: profile.name,
      title: profile.headline,
      email: profile.contact.email,
      website: profile.contact.website,
      linkedin: profile.contact.linkedin,
      github: profile.contact.github,
      location: profile.location,
      summary: profile.summary
    },
    experience: profile.experience.map((exp: any) => ({
      title: exp.title,
      company: exp.company,
      type: exp.type,
      dates: exp.dates,
      highlights: exp.highlights
    })),
    education: profile.education.map((edu: any) => ({
      school: edu.school,
      program: edu.program,
      dates: edu.dates,
      notes: edu.notes
    })),
    skills: profile.skills,
    certifications: profile.certifications?.map((cert: any) => ({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      credential: cert.credential
    })) || [],
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0',
      format: 'json'
    }
  };

  const response = NextResponse.json(resumeData);
  response.headers.set('Content-Disposition', 'attachment; filename="Suryadi_Zhang_Resume.json"');
  response.headers.set('Cache-Control', 'private, max-age=1800'); // Cache for 30 minutes
  
  return response;
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}