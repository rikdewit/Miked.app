import { ImageResponse } from '@vercel/og'

export const runtime = 'nodejs'
export const alt = 'Miked.live - Professional Stage Plot Designer'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '60px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradients */}
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%)',
            pointerEvents: 'none',
          }}
        />

        {/* Left side: Stage visualization */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: '40px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Stage grid */}
          <div
            style={{
              width: '300px',
              height: '380px',
              border: '2px dashed #475569',
              borderRadius: '8px',
              position: 'relative',
              background: 'rgba(15, 23, 42, 0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '40px',
            }}
          >
            {/* Row 1 */}
            <div style={{ display: 'flex', gap: '80px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                D
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                V
              </div>
            </div>

            {/* Row 2 */}
            <div style={{ display: 'flex', gap: '80px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                B
              </div>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                G
              </div>
            </div>

            {/* Monitors */}
            <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
              <div
                style={{
                  width: '50px',
                  height: '24px',
                  background: '#ec4899',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                MON
              </div>
              <div
                style={{
                  width: '50px',
                  height: '24px',
                  background: '#ec4899',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: 'bold',
                  flexShrink: 0,
                }}
              >
                MON
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Hero text */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '20px',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {/* Branding */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div
              style={{
                width: '44px',
                height: '44px',
                background: '#4f46e5',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>♪</span>
            </div>
            <div style={{ display: 'flex' }}>
              <span style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>Miked</span>
              <span style={{ color: '#818cf8', fontSize: '20px', fontWeight: 'bold' }}>.live</span>
            </div>
          </div>

          {/* Main headline */}
          <h1
            style={{
              margin: 0,
              fontSize: '56px',
              fontWeight: 'bold',
              color: 'white',
              lineHeight: '1.2',
            }}
          >
            Your Tech Rider.
          </h1>

          {/* Accent */}
          <h2
            style={{
              margin: 0,
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#818cf8',
              lineHeight: '1.2',
            }}
          >
            Done in 5 Minutes.
          </h2>

          {/* Subtitle */}
          <p
            style={{
              margin: '20px 0 0 0',
              fontSize: '18px',
              color: '#cbd5e1',
              lineHeight: '1.6',
            }}
          >
            Professional stage plots & technical riders. No account needed.
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
