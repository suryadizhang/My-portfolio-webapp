'use client'

import React, { useState } from 'react'
import { Button } from '@portfolio/ui'
import { Download, ExternalLink, FileText, RefreshCw, AlertCircle } from 'lucide-react'

interface PDFViewerProps {
  pdfUrl: string
  downloadUrl?: string
}

export function PDFViewer({ pdfUrl, downloadUrl }: PDFViewerProps) {
  const [hasError, setHasError] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const handleRetry = () => {
    setHasError(false)
    setRetryCount(prev => prev + 1)
  }
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
        {hasError ? (
          // Error fallback UI
          <div className="flex flex-col items-center justify-center h-96 p-8 text-center">
            <AlertCircle className="h-12 w-12 mb-4 text-destructive" />
            <h3 className="font-semibold mb-2">PDF Viewer Blocked</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Your browser has blocked the PDF viewer. This can happen due to security settings or extensions.
            </p>
            <div className="flex gap-2">
              <Button onClick={handleRetry} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button asChild>
                <a href="/api/resume/view" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open in New Tab
                </a>
              </Button>
              {downloadUrl && (
                <Button variant="outline" asChild>
                  <a href={downloadUrl} download>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </a>
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="relative">
            <iframe
              key={`pdf-${retryCount}`} // Force re-render on retry
              src="/api/resume/view#toolbar=1&navpanes=1&scrollbar=1"
              width="100%"
              height="600"
              className="w-full border-0"
              title="Resume PDF Viewer"
              allow="fullscreen"
              onError={() => {
                console.warn('PDF iframe blocked by browser')
                setHasError(true)
              }}
              onLoad={() => {
                // Reset error state on successful load
                setHasError(false)
              }}
            />
            
            {/* Hover overlay with direct access options */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
              <div className="text-center p-4">
                <p className="text-sm text-foreground/80 mb-2">
                  View options
                </p>
                <div className="flex gap-2 justify-center pointer-events-auto">
                  <Button size="sm" asChild>
                    <a href="/api/resume/view" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-1" />
                      New Tab
                    </a>
                  </Button>
                  {downloadUrl && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={downloadUrl} download>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}