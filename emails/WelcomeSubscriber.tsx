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

interface WelcomeSubscriberEmailProps {
  email: string
  baseUrl?: string
}

export const WelcomeSubscriberEmail: React.FC<WelcomeSubscriberEmailProps> = ({
  email,
  baseUrl = 'https://miked.live',
}) => (
  <Html>
    <Head />
    <Preview>Welcome to the Miked.live changelog</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header with Logo */}
        <Section style={header}>
          <Row style={{ marginBottom: '16px' }}>
            <div style={logoContainer}>
              <Img
                src={`${baseUrl}/favicon.svg`}
                alt="Miked.live"
                style={logo}
              />
              <Text style={logoText}>Miked.live</Text>
            </div>
          </Row>
          <Text style={title}>Welcome to the changelog!</Text>
        </Section>

        {/* Content */}
        <Section style={content}>
          <Text style={paragraph}>
            Hey there! Thanks for subscribing to the changelog.
          </Text>

          <Text style={paragraph}>
            You'll now get notified about:
          </Text>

          <ul style={list}>
            <li style={listItem}>🚀 New features and improvements</li>
            <li style={listItem}>🐛 Bug fixes</li>
            <li style={listItem}>📋 Product updates</li>
          </ul>

          <Text style={paragraph}>
            I'm building Miked.live in public and your feedback helps shape the product.
            If you have ideas or suggestions, feel free to reach out on{' '}
            <Link href="https://twitter.com/Woesnos" style={link}>
              X
            </Link>
            {' '}or{' '}
            <Link href="https://instagram.com/woesnos" style={link}>
              Instagram
            </Link>
            .
          </Text>

          <Section style={ctaContainer}>
            <Button style={button} href={baseUrl}>
              Explore Miked.live
            </Button>
          </Section>

          <Text style={closing}>
            Thanks for supporting the journey!<br />– Rik
          </Text>
        </Section>

        <Hr style={hr} />

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            You received this email because you subscribed to the Miked.live changelog.
          </Text>
          <Text style={footerText}>
            <Link href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`} style={footerLink}>
              Unsubscribe
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
  borderRadius: '12px 12px 0 0',
  padding: '30px 20px',
  textAlign: 'center',
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

const title: React.CSSProperties = {
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

const paragraph: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 20px 0',
}

const list: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.8',
  margin: '0 0 20px 0',
  paddingLeft: '20px',
}

const listItem: React.CSSProperties = {
  marginBottom: '8px',
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
  color: '#64748b',
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

const link: React.CSSProperties = {
  color: '#60a5fa',
  textDecoration: 'none',
}

const footerLink: React.CSSProperties = {
  color: '#60a5fa',
  textDecoration: 'none',
}
