import { getProfile } from '@/lib/content'
import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Suryadi Zhang - Full-Stack Software Engineer'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  const profile = getProfile()

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontFamily: 'system-ui',
        }}
      >
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }}
        >
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              margin: '0 0 20px 0',
              background: 'linear-gradient(45deg, #fff, #f0f0f0)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            {profile.name}
          </h1>
          <p
            style={{
              fontSize: '32px',
              margin: '0 0 10px 0',
              opacity: 0.9,
            }}
          >
            {profile.title}
          </p>
          <p
            style={{
              fontSize: '24px',
              margin: '0',
              opacity: 0.8,
            }}
          >
            {profile.tagline}
          </p>
          <p
            style={{
              fontSize: '20px',
              margin: '20px 0 0 0',
              opacity: 0.7,
            }}
          >
            📍 {profile.location}
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}