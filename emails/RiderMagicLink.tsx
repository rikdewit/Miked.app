import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Row,
  Section,
  Text,
  Img,
} from '@react-email/components'

interface RiderMagicLinkEmailProps {
  bandName?: string
  magicLink: string
  baseUrl?: string
  email: string
}

// Base64 encoded favicon SVG for email compatibility
const LOGO_DATA_URL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZmlsbD0ibm9uZSI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI1NiIgcnk9IjU2IiBmaWxsPSIjNGY0NmU1Ii8+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTI4LCAxMjgpIHNjYWxlKDYuNCkgdHJhbnNsYXRlKC0xMiwgLTEyKSI+PHBhdGggZD0ibTExIDcuNjAxLTUuOTk0IDguMTlhMSAxIDAgMCAwIC4xIDEuMjk4bC44MTcuODE4YTEgMSAwIDAgMCAxLjMxNC4wODdMMTUuMDkgMTIiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTE2LjUgMjEuMTc0QzE1LjUgMjAuNSAxNC4zNzIgMjAgMTMgMjBjLTIuMDU4IDAtMy45MjggMi4zNTYtNiAyLTIuMDcyLS4zNTYtMi43NzUtMy4zNjktMS41LTQuNSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIGZpbGw9Im5vbmUiLz48Y2lyY2xlIGN4PSIxNiIgY3k9IjciIHI9IjUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIgZmlsbD0ibm9uZSIvPjwvZz48L3N2Zz4='

export const RiderMagicLinkEmail: React.FC<RiderMagicLinkEmailProps> = ({
  bandName,
  magicLink,
  baseUrl = 'https://miked.live',
  email,
}) => (
  <Html>
    <Head />
    <Preview>Access your Miked.live tech rider</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Row>
            <div style={logoContainer}>
              <Img
                src={LOGO_DATA_URL}
                alt="Miked.live"
                style={logo}
              />
              <Text style={logoText}>
                Miked<span style={{ color: '#4f46e5' }}>.live</span>
              </Text>
            </div>
          </Row>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={greeting}>
            Hey there!
          </Text>

          <Text style={paragraph}>
            Your rider {bandName && <>for <strong>{bandName}</strong></>} is ready for you to access and edit.
          </Text>

          <Text style={paragraph}>
            Click the button below to view and manage your rider:
          </Text>

          <Section style={ctaContainer}>
            <Button style={button} href={magicLink}>
              Access Rider
            </Button>
          </Section>

          <Text style={{ ...paragraph, fontSize: '13px', color: '#94a3b8' }}>
            This link will expire in 24 hours for security purposes.
          </Text>

          <Text style={closing}>
            Thanks for using Miked.live!<br />– Rik
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            Questions? Check out my{' '}
            <Link href={`${baseUrl}`} style={footerLink}>
              website
            </Link>
            {' '}or{' '}
            <Link href="https://twitter.com/Woesnos" style={footerLink}>
              reach out on X
            </Link>
          </Text>
          <Text style={footerText}>
            <Link href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`} style={footerLink}>
              Unsubscribe from emails
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Styles
const main: React.CSSProperties = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
}

const header: React.CSSProperties = {
  backgroundColor: '#1e293b',
  padding: '30px 20px',
  textAlign: 'center',
  borderRadius: '12px 12px 0 0',
}

const logoContainer: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '12px',
}

const logo: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'block',
}

const logoText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0',
}

const content: React.CSSProperties = {
  backgroundColor: '#1e293b',
  padding: '40px',
  borderRadius: '0 0 12px 12px',
}

const greeting: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 20px 0',
}

const paragraph: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '30px 0',
}

const button: React.CSSProperties = {
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
}

const closing: React.CSSProperties = {
  color: '#94a3b8',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '30px 0 0 0',
  fontStyle: 'italic',
}

const hr: React.CSSProperties = {
  borderColor: '#334155',
  margin: '40px 0',
}

const footer: React.CSSProperties = {
  paddingTop: '20px',
}

const footerText: React.CSSProperties = {
  color: '#64748b',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 8px 0',
}

const footerLink: React.CSSProperties = {
  color: '#60a5fa',
  textDecoration: 'none',
}
