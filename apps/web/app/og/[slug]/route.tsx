import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

const GRADIENT_COLORS = [
  'from-blue-600 to-purple-600',
  'from-green-600 to-blue-600', 
  'from-purple-600 to-pink-600',
  'from-orange-600 to-red-600',
  'from-teal-600 to-cyan-600'
]

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const { slug } = await context.params
    
    // Get parameters from URL
    const title = searchParams.get('title') || `Project: ${slug}`
    const subtitle = searchParams.get('subtitle') || 'Suryadi Zhang - Full Stack Developer'
    const tags = searchParams.get('tags')?.split(',') || []
    const type = searchParams.get('type') || 'project'
    
    // Select gradient based on slug hash
    const gradientIndex = slug.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % GRADIENT_COLORS.length
    const gradientClass = GRADIENT_COLORS[gradientIndex]!
    
    // Convert gradient class to actual colors
    const getGradientColors = (gradientClass: string) => {
      if (gradientClass.includes('blue-600') && gradientClass.includes('purple-600')) {
        return { start: '#2563eb', end: '#9333ea' }
      } else if (gradientClass.includes('green-600') && gradientClass.includes('blue-600')) {
        return { start: '#16a34a', end: '#2563eb' }
      } else if (gradientClass.includes('purple-600') && gradientClass.includes('pink-600')) {
        return { start: '#9333ea', end: '#ec4899' }
      } else if (gradientClass.includes('orange-600') && gradientClass.includes('red-600')) {
        return { start: '#ea580c', end: '#dc2626' }
      } else {
        return { start: '#0891b2', end: '#06b6d4' }
      }
    }
    
    const colors = getGradientColors(gradientClass)
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.start}, ${colors.end})`,
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif',
          }}
        >
          {/* Background Pattern */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'radial-gradient(circle at 25px 25px, rgba(255,255,255,0.1) 2px, transparent 0)',
              backgroundSize: '50px 50px',
            }}
          />
          
          {/* Content Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              maxWidth: '900px',
              padding: '60px',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Badge */}
            <div
              style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '12px 24px',
                borderRadius: '50px',
                color: 'white',
                fontSize: '18px',
                fontWeight: 600,
                marginBottom: '32px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              {type === 'project' ? '🚀 Project Showcase' : '📝 Portfolio'}
            </div>
            
            {/* Title */}
            <h1
              style={{
                fontSize: '64px',
                fontWeight: 800,
                color: 'white',
                marginBottom: '24px',
                textShadow: '0 4px 20px rgba(0,0,0,0.3)',
                lineHeight: 1.1,
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
            
            {/* Subtitle */}
            <p
              style={{
                fontSize: '28px',
                color: 'rgba(255,255,255,0.9)',
                marginBottom: '40px',
                fontWeight: 400,
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </p>
            
            {/* Tags */}
            {tags.length > 0 && (
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '40px',
                  justifyContent: 'center',
                }}
              >
                {tags.slice(0, 6).map((tag, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255,255,255,0.25)',
                      padding: '8px 16px',
                      borderRadius: '20px',
                      color: 'white',
                      fontSize: '16px',
                      fontWeight: 500,
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {tag.trim()}
                  </div>
                ))}
              </div>
            )}
            
            {/* Bottom Info */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '24px',
                color: 'rgba(255,255,255,0.8)',
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                  }}
                >
                  👨‍💻
                </div>
                myportfolio.mysticdatanode.net
              </div>
            </div>
          </div>
          
          {/* Corner Decoration */}
          <div
            style={{
              position: 'absolute',
              top: '40px',
              right: '40px',
              width: '80px',
              height: '80px',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
            }}
          >
            ⚡
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Inter',
            data: await getInterFont(),
            style: 'normal',
            weight: 400,
          },
          {
            name: 'Inter',
            data: await getInterFontBold(),
            style: 'normal',
            weight: 800,
          },
        ],
      }
    )
  } catch (error: any) {
    console.error('Error generating OG image:', error)
    
    // Fallback image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2563eb, #9333ea)',
            color: 'white',
            fontSize: '48px',
            fontWeight: 'bold',
          }}
        >
          Portfolio - Suryadi Zhang
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  }
}

// Font fetching functions (you might need to adjust these URLs)
async function getInterFont(): Promise<ArrayBuffer> {
  try {
    const response = await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyeMZhrib2Bg-4.woff2')
    return response.arrayBuffer()
  } catch {
    // Return empty buffer if font fetch fails
    return new ArrayBuffer(0)
  }
}

async function getInterFontBold(): Promise<ArrayBuffer> {
  try {
    const response = await fetch('https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYeZhrib2Bg-4.woff2')
    return response.arrayBuffer()
  } catch {
    // Return empty buffer if font fetch fails
    return new ArrayBuffer(0)
  }
}