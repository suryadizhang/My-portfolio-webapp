'use client'

import React from 'react'
import { Button } from '@portfolio/ui'
import { Download, ExternalLink, FileText } from 'lucide-react'

interface PDFViewerProps {
  pdfUrl: string
  downloadUrl?: string
}

export function PDFViewer({ pdfUrl, downloadUrl }: PDFViewerProps) {
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
            <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Open in New Tab
            </a>
          </Button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="bg-card rounded-lg border overflow-hidden shadow-lg">
        <iframe
          src="/resume/Suryadi_Zhang_Resume.pdf#toolbar=1&navpanes=1&scrollbar=1"
          width="100%"
          height="600"
          className="w-full border-0"
          title="Resume PDF Viewer"
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        />
      </div>
    </div>
  )
}