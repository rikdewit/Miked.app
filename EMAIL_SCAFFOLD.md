# Email Scaffold Guide

Use this guide to create new email templates for broadcast sending.

## Steps to Create a New Email

1. **Create the email component**
   - Create a new file in `/emails/content/` with date prefix for organization: `YourEmailName_DD_MM_YYYY.tsx` (e.g., `AnnouncementEmail_03_03_2026.tsx`)
   - Copy the structure from [ChangelogLaunch_03_03_2026.tsx](emails/content/ChangelogLaunch_03_03_2026.tsx)
   - Include `email` and `baseUrl` props
   - Add unsubscribe link using: `<a href={`${baseUrl}/unsubscribe?email=${encodeURIComponent(email)}`}>`

2. **Register the template**
   - Open `/app/api/send-changelog/route.ts`
   - Import your new component at the top
   - Add it to the `emailTemplates` registry:
     ```typescript
     announcement: {
       component: YourEmailName,
     }
     ```

3. **Send the email**
   - Use the API with your template name and custom subject:
   ```bash
   curl -X POST https://miked.live/api/send-changelog \
     -H "Authorization: Bearer YOUR_RESEND_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{
       "template": "announcement",
       "subject": "Your Custom Subject Line"
     }'
   ```

## Available Options

When calling the send-changelog endpoint:

- `template` (string, required): Template name from registry (default: "changelog")
- `subject` (string, required): Email subject line
- `recipientEmails` (array, optional): Specific emails to send to. If not provided, sends to all subscribed users (or test email on staging/localhost)

## Example Email Component Template

```typescript
import { Text, Section, Button, Link } from '@react-email/components'

interface YourEmailNameProps {
  email?: string
  baseUrl?: string
}

export const YourEmailName: React.FC<YourEmailNameProps> = ({
  email = '',
  baseUrl = 'https://miked.live',
}) => (
  <Html>
    <Head />
    <Preview>Your preview text here</Preview>
    <Body style={main}>
      <Container style={container}>
        {/* Your email content */}
      </Container>
    </Body>
  </Html>
)

// Styles
const main: React.CSSProperties = { /* ... */ }
const container: React.CSSProperties = { /* ... */ }
```

## Email Sending Rules

- **Production (miked.live)**: Sends to all subscribed users
- **Staging (dev.miked.live)**: Only sends to `audio@rikdewit.nl`
- **Localhost**: Only sends to `audio@rikdewit.nl`

All emails are sent from `rik@miked.live` (or `dev-rik@miked.live` on staging/localhost).
