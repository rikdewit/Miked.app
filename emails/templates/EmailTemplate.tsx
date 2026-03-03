import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

/**
 * Generic Email Template
 *
 * This is a reusable email template based on the ChangelogLaunch design.
 * To create a new email:
 * 1. Copy this template to /emails/contents/YourEmailName.tsx
 * 2. Replace the interface props as needed
 * 3. Customize the content and styling
 * 4. Update the component export name
 */

interface EmailTemplateProps {
  previewText: string
  headline: string
  subheadline?: string
  content: React.ReactNode
  ctaText?: string
  ctaHref?: string
  email?: string
  baseUrl?: string
  unsubscribeToken?: string
  showEngagement?: boolean
}

export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  previewText,
  headline,
  subheadline,
  content,
  ctaText = 'Learn More',
  ctaHref = 'https://miked.live',
  email = '',
  baseUrl = 'https://miked.live',
  unsubscribeToken = '',
  showEngagement = true,
}) => (
  <Html>
    <Head />
    <Preview>{previewText}</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Header */}
        <Section style={header}>
          <Link href={baseUrl} style={logoLink}>
            <div style={headerContent}>
              <Img
                src="https://miked.live/favicon.svg"
                alt="Miked.live"
                width="46"
                height="46"
                style={logo}
              />
              <Text style={{ ...headerText, margin: '0' }}>
                <span style={{ color: '#ffffff' }}>Miked</span><span style={{ color: '#6366f1' }}>.live</span>
              </Text>
            </div>
          </Link>
        </Section>

        {/* Content */}
        <Section style={contentSection}>
          <Text style={headlineStyle}>{headline}</Text>

          {subheadline && <Text style={subheadlineStyle}>{subheadline}</Text>}

          {content}

          {ctaText && ctaHref && (
            <Section style={ctaContainer}>
              <Button style={ctaButton} href={ctaHref}>
                {ctaText}
              </Button>
            </Section>
          )}
        </Section>

        {/* Footer */}
        <Section style={footer}>
          {showEngagement && (
            <Section style={engagementSection}>
              <Text style={engagementHeadline}>
                I'm building this in public and I'd love your feedback!
              </Text>

              <Section style={ctaHeadlineContainer}>
                <Button style={ctaButtonLink} href="https://chat.whatsapp.com/JW37b8r65X1AyAGYPRt1NG">
                  Join the WhatsApp community ↗
                </Button>
              </Section>

              <Text style={ctaSubtext}>
                Share ideas, feedback, and feature requests with me directly
              </Text>

              {/* Social Links */}
              <Text style={engagementHeadlineSecondary}>Or follow me:</Text>
              <Section style={socialLinksContainer}>
                <Link href="https://twitter.com/Woesnos" style={socialLink}>
                  X
                </Link>
                <Link href="https://instagram.com/woesnos" style={socialLink}>
                  Instagram
                </Link>
              </Section>
            </Section>
          )}

          <Text style={footerText}>
            You received this email because you subscribed to Miked.live updates.
          </Text>

          <Text style={footerText}>
            <Link
              href={
                unsubscribeToken
                  ? `${baseUrl}/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`
                  : `${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`
              }
              style={footerLink}
            >
              Unsubscribe from emails
            </Link>
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
)

// Shared Styles
const main: React.CSSProperties = {
  backgroundColor: '#0f172a',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  padding: '20px 0',
}

const container: React.CSSProperties = {
  maxWidth: '600px',
  margin: '0 auto',
}

const header: React.CSSProperties = {
  backgroundColor: '#0f172a',
  borderBottom: '1px solid rgba(30, 41, 59, 0.5)',
  padding: '30px 20px',
  textAlign: 'center',
}

const logoLink: React.CSSProperties = {
  textDecoration: 'none',
  color: 'inherit',
}

const headerContent: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  color: '#ffffff',
}

const headerText: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '-0.025em',
  margin: '0',
}

const logo: React.CSSProperties = {
  display: 'block',
  borderRadius: '8px',
  backgroundColor: '#4f46e5',
  padding: '3px',
}

const contentSection: React.CSSProperties = {
  backgroundColor: '#1e293b',
  padding: '40px',
}

const headlineStyle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  lineHeight: '1.4',
}

const subheadlineStyle: React.CSSProperties = {
  color: '#a0aec0',
  fontSize: '15px',
  margin: '0 0 20px 0',
}

const paragraph: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const sectionHeading: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 12px 0',
  lineHeight: '1.4',
}

const ctaContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '30px 0 0 0',
}

const ctaButton: React.CSSProperties = {
  backgroundColor: '#4f46e5',
  color: '#ffffff',
  padding: '12px 32px',
  borderRadius: '6px',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '16px',
  display: 'inline-block',
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

const engagementSection: React.CSSProperties = {
  textAlign: 'center',
  margin: '0 0 20px 0',
  paddingTop: '20px',
  borderTop: '1px solid #334155',
}

const engagementHeadline: React.CSSProperties = {
  color: '#f1f5f9',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  fontWeight: 800,
}

const engagementHeadlineSecondary: React.CSSProperties = {
  color: '#64748b',
  fontSize: '12px',
  lineHeight: '1.6',
  margin: '0 0 12px 0',
  fontWeight: 400,
}

const ctaHeadlineContainer: React.CSSProperties = {
  margin: '0 0 8px 0',
  textAlign: 'center',
}

const ctaButtonLink: React.CSSProperties = {
  backgroundColor: 'rgba(79, 70, 229, 0.1)',
  color: '#a5b4fc',
  padding: '8px 16px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: '500',
  fontSize: '14px',
  display: 'inline-block',
}

const ctaSubtext: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '13px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const socialLinksContainer: React.CSSProperties = {
  textAlign: 'center',
  margin: '12px 0 0 0',
}

const socialLink: React.CSSProperties = {
  color: '#64748b',
  textDecoration: 'none',
  fontSize: '14px',
  display: 'inline-block',
  fontWeight: 500,
  marginRight: '16px',
}

const footerLink: React.CSSProperties = {
  color: '#6366f1',
  textDecoration: 'none',
}

// Export common styles for reuse in email contents
export const emailStyles = {
  paragraph,
  sectionHeading,
}
