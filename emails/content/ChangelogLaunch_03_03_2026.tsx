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

interface ChangelogLaunchProps {
  email?: string
  baseUrl?: string
}

export const ChangelogLaunch: React.FC<ChangelogLaunchProps> = ({
  email = '',
  baseUrl = 'https://miked.live',
}) => (
  <Html>
    <Head />
    <Preview>Miked.live Launches</Preview>
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
          <Text style={headline}>Miked.live Launches</Text>

          <Text style={subheadline}>
            I've launched Miked.live! Create professional technical riders and stage plots quickly.
          </Text>

          <Img
            src="https://miked.live/og-image.png"
            alt="Miked.live Launch"
            width="100%"
            style={imageStyle}
          />

          <Text style={paragraph}>
            I'm excited to announce the launch of <strong>Miked.live</strong>! 🚀
          </Text>

          <Text style={sectionHeading}>The Journey</Text>

          <Text style={paragraph}>
            I started in music by producing tracks and playing guitar. Eventually, I was in a band for a bit and did a few shows. Communication between band members is hard, especially when you're just starting out. But the biggest frustration came from the sound itself—bad mixing, bad tech communication, and poor sound quality on gigs. Those painful experiences inspired me to become a freelance audio engineer. Now I see the problem from both sides of the table: I understand the pain points from the engineer's perspective. I know exactly what information I need before a gig, what gets lost in communication, and how frustrating it is when artists don't have their technical specs organized.
          </Text>

          <Text style={paragraph}>
            When it comes to communicating your technical needs to venues and engineers, the tools available aren't great. Before each gig, we'd go through this whole process: ask band members what gear they're bringing, wait for replies, edit old stage plots in Photoshop, create technical riders—Word docs, spreadsheets, PDFs—repeating the same tedious workflow every time. It was hours of work just to send something to a venue. And here's the real problem: you mostly communicate with the venue, not the engineers. You never really know if they read it, or if they're actually prepared when you show up on gig day. The stage plot tools can be basic or cumbersome, and the process of creating and updating them is just painful.
          </Text>

          <Text style={italicParagraph}>
            <strong>The tools for communicating technical needs just aren't optimal, and the communication itself doesn't reach the people who need it most.</strong>
          </Text>

          <Text style={paragraph}>
            Then I discovered AI tools for building. Over the years, I've built my own websites and apps, so I understand the friction of web development—the boilerplate, the configuration, wrestling with frameworks. I built my first website for my freelance audio engineering business with AI assistance, and it was transformative. What would normally take me weeks moved so much faster. I suddenly had the bandwidth and speed to think bigger.
          </Text>

          <Text style={paragraph}>
            That's when everything clicked. I realized: I could actually build that thing I'd been thinking about—an online platform where bands could actually communicate their technical needs properly. Instead of spending weeks architecting every detail, I could describe the vision and iterate with AI by my side. It's like finally having a developer partner who gets it, who understands what you're trying to build and helps you move fast without getting bogged down.
          </Text>

          <Text style={sectionHeading}>Building Miked.live</Text>

          <Text style={paragraph}>Here's what I've built:</Text>

          <Text style={featureTitle}>Drag & Drop 3D Stage Designer</Text>
          <Text style={paragraph}>
            This was a fun but bold decision. Instead of boring spreadsheets or PDFs, I created an interactive 3D stage where you can literally drag your equipment around. Visualizing your setup in 3D makes way more sense, and I'm genuinely excited that people are appreciating this unconventional approach. It's satisfying to build something that actually feels modern.
          </Text>

          <Text style={featureTitle}>Smart Tech Rider Generation</Text>
          <Text style={paragraph}>
            Once you've placed your gear, I automatically generate a professional PDF technical rider. No filling out forms, no copying and pasting. Everything you configured becomes a clean, venue-ready document that actually gets read.
          </Text>

          <Text style={featureTitle}>Instant Visual Reference</Text>
          <Text style={paragraph}>
            Export a PNG of your stage plot. Engineers and venue staff can see exactly what you need at a glance. It's way better than describing it in words.
          </Text>

          <Text style={featureTitle}>No Friction</Text>
          <Text style={paragraph}>
            Zero account creation, zero paywall, zero nonsense. Just open it, build your rider, download it. That's it.
          </Text>

          <Text style={featureTitle}>Quick Setup</Text>
          <Text style={paragraph}>
            Whether you're a solo artist with a guitar or a full band with a truck of gear, you can get everything organized and ready to send to venues way faster than traditional methods.
          </Text>

          <Text style={sectionHeading}>Why I'm Doing This</Text>

          <Text style={paragraph}>
            It's free because I believe venues and engineers deserve to have your tech specs without you jumping through hoops. And I'm building this in public because I genuinely want feedback from people like me—musicians, engineers, and anyone who's ever been frustrated trying to communicate technical needs.
          </Text>

          <Text style={paragraph}>
            This is about making live audio better. Better communication means better shows. And better shows are what it's all about.
          </Text>

          <Text style={sectionHeading}>The Real Vision</Text>

          <Text style={paragraph}>
            Right now, Miked.live generates static PDFs and stage plots. But that's just the beginning. My goal is to build the <strong>best rider creation tool out there</strong>—something so good that people actually use it without thinking twice.
          </Text>

          <Text style={paragraph}>
            But here's the bigger picture: I want to solve the communication problem once and for all. Instead of static documents that sit in someone's inbox, imagine a <strong>living platform where venues, engineers, and band members are all on the same page</strong>. Real-time updates. Everyone sees the latest changes. No more surprises on gig day because the engineer didn't read your PDF from three weeks ago.
          </Text>

          <Text style={paragraph}>
            That's what I'm building towards. First, let's nail the rider tool. Then, let's make sure the right people actually see what you need—and stay updated when things change.
          </Text>

          <Text style={paragraph}>
            Give it a try and let me know what you think!
          </Text>

          <Section style={ctaContainer}>
            <Button style={ctaButton} href={baseUrl}>
              Create your rider now
            </Button>
          </Section>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          {/* Engagement Section */}
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

          <Text style={footerText}>
            You received this email because you subscribed to the Miked.live changelog.
          </Text>

          <Text style={footerText}>
            <a href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`} style={footerLink}>
              Unsubscribe from emails
            </a>
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

const headline: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 20px 0',
  lineHeight: '1.4',
}

const subheadline: React.CSSProperties = {
  color: '#a0aec0',
  fontSize: '15px',
  margin: '0 0 20px 0',
}

const sectionHeading: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '24px 0 12px 0',
  lineHeight: '1.4',
}

const paragraph: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
}

const italicParagraph: React.CSSProperties = {
  color: '#cbd5e1',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
  fontStyle: 'italic',
}

const featureTitle: React.CSSProperties = {
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '16px 0 8px 0',
}

const imageStyle: React.CSSProperties = {
  width: '100%',
  borderRadius: '8px',
  marginBottom: '20px',
  display: 'block',
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
