'use client'

import React from 'react'
import { Button } from '@portfolio/ui'
import { Download, ExternalLink, FileText } from 'lucide-react'

interface PDFViewerProps {
  pdfUrl: string
  downloadUrl?: string
}

export function PDFViewer({ downloadUrl }: PDFViewerProps) {
  // Static component that renders the same on server and client
  return (
    <div className="space-y-4">
      {/* PDF Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-card rounded-lg border">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <span className="text-sm font-medium">Resume PDF</span>
        </div>

        <div className="flex items-center gap-2">
          {downloadUrl && (
            <Button size="sm" asChild>
              <a href={downloadUrl} download>
                <Download className="h-4 w-4 mr-2" />
                Download
              </a>
            </Button>
          )}
          
          <Button size="sm" variant="outline" asChild>
            <a href="/resume/Suryadi_Zhang_Resume.pdf" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Viewer - Multiple approaches for maximum compatibility */}
      <div className="bg-card rounded-lg border overflow-hidden shadow-lg">
        {/* Primary: Object tag with direct file path */}
        <object
          data="/resume/Suryadi_Zhang_Resume.pdf"
          type="application/pdf"
          width="100%"
          height="600"
          className="w-full"
        >
          {/* Fallback 1: Embed tag */}
          <embed
            src="/resume/Suryadi_Zhang_Resume.pdf"
            type="application/pdf"
            width="100%"
            height="600"
            className="w-full"
          />
          
          {/* Fallback 2: Iframe with API route (requires server) */}
          <iframe
            src="/api/resume/view"
            width="100%"
            height="600"
            className="w-full border-0"
            title="Resume PDF Viewer"
            style={{ minHeight: '600px' }}
          />
          
          {/* Fallback 3: Direct link if nothing else works */}
          <div className="min-h-[600px] flex items-center justify-center p-8">
            <div className="text-center">
              <FileText className="h-16 w-16 text-muted-foreground/50 mb-4 mx-auto" />
              <h3 className="text-xl font-semibold mb-2">PDF Viewer Not Supported</h3>
              <p className="text-muted-foreground mb-6">
                Your browser doesn't support inline PDF viewing. Please use the buttons below.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <a href={downloadUrl || '/resume/Suryadi_Zhang_Resume.pdf'} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/resume/Suryadi_Zhang_Resume.pdf" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </object>
        
        {/* Helpful note for users */}
        <div className="p-4 bg-slate-50 border-t">
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-slate-500 mt-0.5" />
            <div className="text-sm text-slate-600">
              <p className="font-medium mb-1">PDF Controls Available</p>
              <p>Use the browser's built-in PDF controls to zoom, navigate, or print. Click "Open in New Tab" for the best viewing experience.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}