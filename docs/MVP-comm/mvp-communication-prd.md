# MVP PRD: In-Rider Communication System
## Miked.live Communication Flow UI

**Document Date:** February 25, 2026
**Audience:** Developers, Designers, Product Managers
**Status:** MVP Definition

---

## 📋 Table of Contents
1. [Executive Summary](#executive-summary)
2. [Product Context: Miked.live 101](#product-context)
3. [Problem Statement](#problem-statement)
4. [MVP Scope & Goals](#mvp-scope--goals)
5. [User Stories & Use Cases](#user-stories--use-cases)
6. [Feature Set](#feature-set)
7. [Technical Requirements](#technical-requirements)
8. [UI/UX Specifications](#uiux-specifications)
9. [Data Model](#data-model)
10. [API Endpoints](#api-endpoints)
11. [Success Metrics](#success-metrics)
12. [Out of Scope](#out-of-scope)
13. [Timeline & Milestones](#timeline--milestones)

---

## Executive Summary

**What:** Miked.live is building a web-based tool for musicians to create and share professional technical riders for live music events.

**Problem:** Currently, riders (technical requirements documents) are static PDFs. Communication between bands and sound engineers happens via email → slow, fragmented, high miscommunication risk.

**Solution:** Add an **in-rider comment system** that allows engineers to ask clarifying questions and bands to respond, all within the rider tool. No email, no external tools, no account creation needed for engineers.

**Impact:** Reduce rider miscommunication, speed up prep time, establish Miked.live as a communication hub (not just a PDF generator).

---

## Product Context

### What is Miked.live?

**Miked.live** is a platform for creating and sharing **technical riders** — documents that tell sound engineers what equipment a band needs for a live performance.

### Who Uses It?

1. **Musicians & Band Leaders** — Create riders describing their stage setup, microphone needs, power requirements
2. **Sound Engineers / FOH Technicians** — Receive riders to understand what equipment to prepare
3. **Venue Bookers / Event Organizers** — Collect rider info from bands, coordinate with engineers

### Why Does This Matter?

**Current State (Problem):**
- Riders are usually Word docs or static PDFs
- Band sends PDF → Venue receives → Venue sends to engineer → Engineer asks questions → email chain ensues
- Miscommunication is common ("I said SM57, why do they have SM48?")
- Engineers waste prep time due to incomplete/unclear riders
- Bands don't know if engineer understood their setup

**Desired State (Miked.live):**
- Riders are digital, collaborative, and actionable
- Comments are tied directly to the rider (not email threads)
- Engineers can ask clarifying questions instantly
- Bands get notifications and can respond in-tool
- Final rider is clear, printable, and professional

---

## Problem Statement

### Core Issues

**For Band Coordinators (ICP-3):**
- "How do I know the engineer understood my rider?"
- "I want feedback from the engineer, but they only respond via email through the booker"
- "If we need to change something, I have to re-send the whole PDF"

**For Sound Engineers (ICP-4):**
- "Riders often lack clarity — I need to ask questions"
- "Communication happens through 3 intermediaries (band → booker → venue → me)"
- "When I print the rider, I have no way to reference questions I had"

**For Miked.live (Product):**
- "We're just a PDF generator; we're not enabling the conversation that matters"
- "If riders are incomplete or confusing, bands won't use us"
- "Engineers are the validation layer — if they don't find value, adoption stalls"

### Solution Hypothesis

**Adding an in-rider comment system will:**
1. Enable direct band ↔ engineer communication
2. Tie feedback to specific rider sections (not generic chat)
3. Create accountability ("Engineer viewed your rider at 2:15pm")
4. Reduce email friction and miscommunication
5. Establish Miked.live as a communication hub

---

## MVP Scope & Goals

### MVP Definition

**In Scope:**
- Comment widget tied to rider sections (stage plot, input list, power drops)
- Role-based comment colors (engineer, band lead, venue, admin)
- Basic notification system (email)
- Share status tracking ("Viewed at 2:15pm")
- Simple reply threads
- Mark comments as resolved

**Out of Scope (Phase 2+):**
- Real-time chat or messaging
- Video/image uploads in comments
- Advanced permission system
- Comment history/audit logs
- Analytics dashboard
- Mobile app

### Goals

| Goal | Success Criteria |
|------|------------------|
| **Enable feedback** | Engineer can comment without signing up |
| **Close communication loop** | Band gets notified when engineer comments |
| **Reduce email** | 80% of feedback happens in-tool (not email) |
| **Increase clarity** | 90% of engineers find comments tie to specific rider issues |
| **Enable iteration** | Bands can update riders and re-share without starting over |
| **Build trust** | Bands know when engineer has viewed their rider |

---

## User Stories & Use Cases

### Primary User Journeys

#### UC-1: Engineer Comments on Unclear Section
**Actor:** Michiel (Sound Engineer)
**Trigger:** Receives rider link from band

```
1. Michiel opens rider link: miked.live/riders/abc123
2. Reads stage plot; monitor directions are ambiguous
3. Clicks comment icon on "Monitor Positions" section
4. Types: "Which wedges face the band vs. the audience?"
5. Fills in: Name: "Michiel", Role: "Engineer", Email: "michiel@..."
6. Submits comment (no account needed)
```

**Expected Outcome:**
- Comment appears in rider with red color (engineer role)
- Lars (band coordinator) gets email: "Michiel left a comment on your rider"
- Lars can reply directly in the UI

---

#### UC-2: Band Coordinator Responds to Feedback
**Actor:** Lars (Band Coordinator)
**Trigger:** Gets notification that engineer commented

```
1. Lars receives email: "Michiel (Engineer) commented: 'Monitor directions unclear'"
2. Clicks link → opens rider with comment highlighted
3. Reads comment, updates stage plot to add monitor arrows
4. Clicks "Reply" on Michiel's comment
5. Types: "Updated the stage plot — all wedges now face the band"
6. Clicks "Mark resolved"
```

**Expected Outcome:**
- Comment shows as resolved (visual indicator: ✅)
- Michiel gets notification: "Lars replied: 'Updated...'"
- On next view, Michiel sees the resolved badge
- Final PDF export can include comment thread or omit resolved comments

---

#### UC-3: Track Rider Acknowledgment
**Actor:** Lars (Band Coordinator)
**Trigger:** Sends rider to engineer before gig

```
1. Lars finalizes rider
2. Clicks "Share with Sound Engineer"
3. Enters Michiel's email
4. System sends: "Here's your rider for [event]" + link
5. Michiel clicks link at 2:15pm
6. Lars sees notification: "Michiel viewed your rider at 2:15pm ✅"
```

**Expected Outcome:**
- Lars knows engineer has the rider
- Michiel sees "Viewed by: Michiel at 2:15pm" in share log
- Builds accountability and trust

---

### Secondary User Journeys

#### UC-4: Multiple Engineers on One Rider
**Trigger:** Band wants feedback from both FOH and Monitor engineer

```
1. Lars shares rider with FOH engineer (Michiel)
2. Lars shares same rider with Monitor engineer (Peter)
3. Both can comment without knowing about each other
4. Lars sees comments from both in sidebar
5. Can filter by role or comment thread
```

---

#### UC-5: Venue Coordinator Comments on Logistics
**Trigger:** Venue needs clarification on power/stage dimensions

```
1. Venue coordinator opens rider
2. Leaves comment in yellow (venue role): "Do you need 3-phase power or standard?"
3. Band replies: "Standard is fine"
```

---

## Feature Set

### Core Features (MVP)

#### 1. Comment Widget
**Description:** Visual indicator + form to add comments on rider sections

**Behavior:**
- Icon appears on each major rider section (stage plot, input list, power drops, technical notes)
- Click icon → inline comment form
- Form fields:
  - `Your Name` (text)
  - `Your Role` (dropdown: Engineer, Band Lead, Band Member, Venue, Admin)
  - `Email` (text) — optional but recommended
  - `Comment` (textarea, markdown supported)
  - [Submit] button

**Visual:**
```
[Section: Input List]
                            💬 2 comments
• Kick: D112
• Snare: SM57
  [Add comment]

OR (when collapsed)

[💬 + "2 comments on this section"]
```

**Constraints:**
- Max comment length: 500 characters (enforce in UI + backend)
- No images/file uploads in MVP
- Plain text + markdown links only

---

#### 2. Role-Based Color Coding
**Description:** Comments are visually distinct by role

**Color Scheme:**
| Role | Color | Use Case |
|------|-------|----------|
| Engineer | 🔴 Red (#EF4444) | Technical questions, clarifications |
| Band Lead | 🟢 Green (#10B981) | Confirmations, updates |
| Band Member | 🔵 Blue (#3B82F6) | Instrument-specific notes |
| Venue | 🟡 Yellow (#F59E0B) | Logistics, power, stage dimensions |
| Admin | ⚫ Gray (#6B7280) | Resolution notes, system messages |

**Application:**
- Comment box has colored left border
- User's name displayed in that color
- Comment header shows: `🔴 Michiel (Engineer) • 2 hours ago`

---

#### 3. Notifications
**Description:** Users get notified when:
- A comment is added to their rider
- A comment they left gets a reply
- Their rider is viewed by an engineer

**Channels (MVP):**
- Email notifications (primary)
- In-app toast (if user is actively viewing rider)

**Email Template:**
```
Subject: Michiel (Engineer) left a comment on your rider

Hi Lars,

Michiel commented on your rider "The Rockers":

💬 "Monitor directions unclear — which wedges face the band?"

[View Comment] [Reply]

This is a reply to comment: https://miked.live/riders/abc123?comment=xyz

—
Miked.live
```

**In-App Toast:**
```
🔔 Michiel (Engineer) left a comment
   "Monitor directions unclear"
   [View] [Dismiss]
```

---

#### 4. Reply Threads
**Description:** Comments can have replies, enabling back-and-forth

**Behavior:**
- Click [Reply] on any comment
- Form appears inline (same as main comment form)
- Replies appear indented below parent comment
- Thread can have unlimited replies
- Only the parent comment shows color; replies inherit parent's role color

**Visual:**
```
🔴 Michiel (Engineer) • 2 hours ago
"Monitor directions unclear — which wedges face the band?"
[Reply] [Resolve] [...]

  🟢 Lars (Band Lead) • 1 hour ago
  "Added arrows to the plot — all wedges face the band"
  [Reply] [...]

    🔴 Michiel (Engineer) • 30 min ago
    "Perfect! That's what I needed."
    [Reply] [...]
```

---

#### 5. Resolve/Unresolve Comments
**Description:** Mark comments as addressed

**Behavior:**
- Band coordinator clicks [Resolve] on comment
- Comment gets visual badge: ✅ Resolved
- Resolved comments can be filtered/hidden
- Click [Unresolve] to reopen discussion

**Visual:**
```
✅ RESOLVED — Lars updated the stage plot
🔴 Michiel (Engineer) • 2 hours ago
"Monitor directions unclear..."
[Unresolve]
```

**Rules:**
- Only the original author or band coordinator can resolve
- Resolved comments appear lower in thread (collapsed by default in long lists)

---

#### 6. Share Status Tracking
**Description:** Show when rider was shared and viewed

**Behavior:**
- Band coordinator clicks "Share with Sound Engineer"
- Form asks for: email, name (optional), role (optional)
- System sends email with magic link
- When engineer clicks link, system logs timestamp
- Band coordinator sees: "Viewed by Michiel at 2:15pm ✅"

**Visual (on rider page):**
```
SHARE LOG
────────────────────────
Shared with: michiel@engineer.com
Shared at: Feb 25, 2:00pm
Viewed at: Feb 25, 2:15pm ✅

[Resend Link] [Copy Link] [Remove Access]
```

---

#### 7. Comment Sidebar
**Description:** Scrollable list of all comments on rider

**Behavior:**
- Right sidebar (or modal on mobile) shows all comments
- Each item shows: role color, author, snippet of text, timestamp
- Click item → scrolls rider to that section and highlights comment
- Badge count shows unread comments

**Visual:**
```
COMMENTS (3) [🔔 1 unread]
──────────────────────────
🔴 Michiel (Engineer)
   "Monitor directions..."
   💬 2 replies • Unresolved
   [View]

🟢 Lars (Band Lead)
   "Updated stage plot"
   💬 0 replies • Resolved ✅
   [View]

🟡 Venue (Booking)
   "Need power rider"
   💬 1 reply • Open
   [View]

[Filter: All] [Open Only] [By Role]
```

---

#### 8. No-Auth Comment Creation
**Description:** Engineers can comment without creating an account

**Behavior:**
- Engineer receives magic link (no login required)
- Click link → rider opens in read-only mode
- Comment form requires: Name, Email, Role, Comment text
- Submit → comment instantly appears (no moderation)
- Email is used for notification replies, not for login

**Constraints:**
- Each IP/email combo gets rate-limited (e.g., 10 comments per hour)
- Comments by non-authenticated users show: "Michiel (Guest Engineer)" to indicate no account

---

### Secondary Features (Stretch Goals for MVP)

- **@Mentions:** Type `@Lars` to notify specific user
- **Comment preview in PDF:** Export option to include comment thread
- **Duplicate/Archive rider:** Keep old versions with closed comments
- **Comment search:** Find all comments containing keyword

---

## Technical Requirements

### Tech Stack (Assumed: Based on Miked.live Context)

- **Frontend:** React, Next.js (or equivalent)
- **Backend:** Node.js/Express or equivalent
- **Database:** PostgreSQL or MongoDB
- **Email:** SendGrid or Mailgun
- **Hosting:** Vercel (for frontend), AWS/similar (for backend)

### Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Latency** | Comment submit < 500ms |
| **Uptime** | 99.9% |
| **Data Retention** | Comments archived 2+ years |
| **Email Delivery** | 95%+ inbox rate |
| **Scalability** | 10,000+ concurrent riders |
| **Accessibility** | WCAG 2.1 AA compliant |

### Security Requirements

- **Authentication:** No account required for viewing/commenting (magic link auth for sharing)
- **Authorization:** Band coordinator can delete comments; engineers can only add/reply
- **Data Protection:** Comments encrypted in transit (HTTPS) and at rest
- **GDPR Compliance:** User data deletable on request; email list not shared

---

## UI/UX Specifications

### Layout: Rider View with Comments Sidebar

```
┌─────────────────────────────────────────────────────┬──────────────────┐
│                                                     │  COMMENTS (3)    │
│  RIDER: The Rockers @ The Blue Note                 │  [🔔 1 unread]   │
│  ═══════════════════════════════════════════════════│                  │
│                                                     │  🔴 Michiel      │
│  📍 STAGE PLOT (Top-Down View)                      │     "Monitor     │
│  ╔═══════════════════════════════════════════════╗  │      directions  │
│  ║                                               ║  │      unclear"    │
│  ║    🎤V  🥁D   💬 [2 comments]                 ║  │     Unresolved   │
│  ║                                               ║  │     [View]       │
│  ║    🎸G    🎸G                                  ║  │                  │
│  ║         🔌🔌🔌                                  ║  │  🟢 Lars         │
│  ║                                               ║  │     "Updated     │
│  ║                                               ║  │      plot"       │
│  ║                                               ║  │     Resolved ✅  │
│  ║                                               ║  │     [View]       │
│  ╚═══════════════════════════════════════════════╝  │                  │
│                                                     │  🟡 Venue        │
│  INPUT LIST              💬 [0 comments]            │     "Power       │
│  ┌────────────────────────────────────────────────┐ │      requirement"│
│  │ Instrument  │ Mic/DI     │ Notes               │ │     Open         │
│  ├─────────────┼────────────┼─────────────────────┤ │     [View]       │
│  │ Kick        │ D112       │ (standard)          │ │                  │
│  │ Snare       │ SM57       │ on top              │ │  [Filter: All]   │
│  │ Vocal 1     │ SM58       │ high stand          │ │  [By Role]       │
│  ├─────────────┼────────────┼─────────────────────┤ │                  │
│  │ [Add Comment]                                  │ │  ────────────────│
│  └────────────────────────────────────────────────┘ │                  │
│                                                     │                  │
└─────────────────────────────────────────────────────┴──────────────────┘
```

### Comment Form (Inline)

```
┌───────────────────────────────────────────────────┐
│ Add Comment                                       │
│                                                   │
│ Your Name:                                        │
│ [___________________________]                     │
│                                                   │
│ Your Role:                                        │
│ [Engineer ▼] (options: Engineer, Band, Venue...) │
│                                                   │
│ Your Email (optional):                            │
│ [___________________________]                     │
│                                                   │
│ Comment:                                          │
│ ┌─────────────────────────────────────────────┐   │
│ │ Monitor directions are unclear. Which wedge │   │
│ │ faces the band vs. the audience?            │   │
│ │                                             │   │
│ │ (0/500 characters)                          │   │
│ └─────────────────────────────────────────────┘   │
│                                                   │
│           [Cancel]  [Submit Comment]             │
└───────────────────────────────────────────────────┘
```

### Comment Display (Thread)

```
┌──────────────────────────────────────────────────┐
│ 🔴 Michiel (Engineer) • 2 hours ago               │
│ Monitor directions are unclear. Which wedge      │
│ faces the band vs. the audience?                 │
│                                                  │
│ [Reply] [Resolve] [Report] [•••]                │
│                                                  │
│ └─ 🟢 Lars (Band Lead) • 1 hour ago              │
│    Updated the stage plot — all wedges now      │
│    face the band. Check the plot above.          │
│    [Reply] [Unresolve] [Report] [•••]           │
│                                                  │
│ └─ 🔴 Michiel (Engineer) • 30 min ago            │
│    Perfect! That's exactly what I need.          │
│    [Reply] [Report] [•••]                       │
│                                                  │
│ ✅ RESOLVED                                      │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Notification Email

```
Subject: 🔴 Michiel (Engineer) commented on "The Rockers" rider

Hi Lars,

Michiel (Engineer) left a comment on your technical rider:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"Monitor directions are unclear. Which wedge faces
 the band vs. the audience?"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section: Stage Plot

[View Rider & Reply]

Or reply directly here:

┌────────────────────────────────────────────┐
│ Your Reply:                                │
│ ┌──────────────────────────────────────────┤
│ │                                          │
│ │                                          │
│ └──────────────────────────────────────────┤
│ [Submit Reply]                             │
└────────────────────────────────────────────┘

—
Questions? Contact support@miked.live
View all comments: [Link to rider]
```

### Mobile Responsive (Comments as Modal)

On mobile, sidebar becomes:
- Sticky bottom sheet or modal
- Full-width comment form
- Comments list scrollable
- Tap to scroll rider to that section

---

## Data Model

### Comments Collection/Table

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Author
  author_name VARCHAR(255) NOT NULL,
  author_email VARCHAR(255),
  author_role ENUM('engineer', 'band_lead', 'band_member', 'venue', 'admin') NOT NULL,

  -- Content
  text TEXT NOT NULL (max 500 chars),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  -- Status
  is_resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP,
  resolved_by UUID REFERENCES users(id),

  -- Metadata
  section VARCHAR(50), -- 'stage_plot', 'input_list', 'power_drops', 'notes'
  is_deleted BOOLEAN DEFAULT FALSE,
  ip_address VARCHAR(45), -- for rate limiting

  UNIQUE(id),
  INDEX(rider_id),
  INDEX(parent_comment_id),
  INDEX(created_at)
);
```

### Share Log

```sql
CREATE TABLE share_logs (
  id UUID PRIMARY KEY,
  rider_id UUID NOT NULL REFERENCES riders(id) ON DELETE CASCADE,

  shared_with_email VARCHAR(255),
  shared_with_name VARCHAR(255),
  shared_by_user_id UUID,

  shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  viewed_at TIMESTAMP,

  share_token VARCHAR(255) UNIQUE, -- magic link token
  token_expires_at TIMESTAMP,

  INDEX(rider_id),
  INDEX(share_token)
);
```

### Notification Log

```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,

  type ENUM('comment_added', 'comment_replied', 'rider_viewed') NOT NULL,
  related_comment_id UUID REFERENCES comments(id),
  related_rider_id UUID REFERENCES riders(id),

  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  delivery_status ENUM('pending', 'sent', 'failed') DEFAULT 'pending',

  INDEX(recipient_email),
  INDEX(sent_at)
);
```

---

## API Endpoints

### Comments

#### POST /api/riders/:riderId/comments
Create a new comment

**Request:**
```json
{
  "author_name": "Michiel",
  "author_email": "michiel@engineer.com",
  "author_role": "engineer",
  "text": "Monitor directions unclear — which wedges face the band?",
  "section": "stage_plot",
  "parent_comment_id": null
}
```

**Response (201):**
```json
{
  "id": "comment_abc123",
  "rider_id": "rider_xyz789",
  "author_name": "Michiel",
  "author_role": "engineer",
  "text": "Monitor directions unclear...",
  "created_at": "2026-02-25T14:30:00Z",
  "is_resolved": false,
  "replies_count": 0
}
```

**Constraints:**
- Rate limit: 10 comments per IP per hour
- Max length: 500 characters
- No auth required (open endpoint)

---

#### GET /api/riders/:riderId/comments
Get all comments on a rider

**Query Params:**
- `?resolved=false` — only unresolved
- `?section=stage_plot` — filter by section
- `?role=engineer` — filter by author role

**Response (200):**
```json
{
  "total": 3,
  "comments": [
    {
      "id": "comment_abc123",
      "author_name": "Michiel",
      "author_role": "engineer",
      "text": "Monitor directions unclear...",
      "created_at": "2026-02-25T14:30:00Z",
      "is_resolved": false,
      "replies": [
        {
          "id": "comment_def456",
          "author_name": "Lars",
          "author_role": "band_lead",
          "text": "Updated the stage plot...",
          "created_at": "2026-02-25T15:00:00Z"
        }
      ]
    }
  ]
}
```

---

#### POST /api/riders/:riderId/comments/:commentId/replies
Add a reply to a comment

**Request:**
```json
{
  "author_name": "Lars",
  "author_email": "lars@band.com",
  "author_role": "band_lead",
  "text": "Updated the stage plot — all wedges face the band"
}
```

**Response (201):** Same as comment creation

---

#### PATCH /api/riders/:riderId/comments/:commentId/resolve
Mark comment as resolved

**Request:**
```json
{
  "is_resolved": true
}
```

**Response (200):**
```json
{
  "id": "comment_abc123",
  "is_resolved": true,
  "resolved_at": "2026-02-25T16:00:00Z"
}
```

**Auth:** Requires band coordinator role or original author

---

#### DELETE /api/riders/:riderId/comments/:commentId
Soft-delete a comment (marks as deleted, not removed)

**Response (204):** No content

**Auth:** Requires band coordinator role or comment author

---

### Share Log

#### POST /api/riders/:riderId/share
Share rider with engineer (send magic link)

**Request:**
```json
{
  "email": "michiel@engineer.com",
  "name": "Michiel",
  "role": "engineer"
}
```

**Response (201):**
```json
{
  "share_log_id": "share_123",
  "share_token": "abc123def456",
  "share_link": "https://miked.live/riders/xyz789?token=abc123def456",
  "shared_at": "2026-02-25T14:00:00Z"
}
```

**Multi-Device Behavior:**
- Token is **one-time-use**: Engineer opens link on Device A → creates session, token consumed
- On Device B: Same link won't work (token already used)
- Band coordinator can click "Resend Link" to generate new token
- This balances security (tokens don't live forever) with UX (engineers can request new link easily)
- See [Magic Link & Multi-Device Access](#magic-link--multi-device-access) below for details

---

#### GET /api/riders/:riderId/share-log
Get share history for a rider

**Response (200):**
```json
{
  "shares": [
    {
      "shared_with_email": "michiel@engineer.com",
      "shared_with_name": "Michiel",
      "shared_at": "2026-02-25T14:00:00Z",
      "viewed_at": "2026-02-25T14:15:00Z"
    }
  ]
}
```

**Auth:** Requires band coordinator role

---

### Notifications

#### POST /api/notifications/subscribe
Subscribe to email notifications for a rider

**Request:**
```json
{
  "email": "lars@band.com",
  "rider_id": "rider_xyz789"
}
```

**Response (201):** Confirmation sent to email

---

## Success Metrics

### Primary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Comment rate** | 40% of shared riders have ≥1 comment | Comments table / Share logs ratio |
| **Response rate** | 70% of comments get a reply within 24h | Reply creation timestamp |
| **Unresolved comment %** | <20% of comments left unresolved | Resolved boolean count |
| **View confirmation** | 85% of engineers view rider within 1h | Share log viewed_at timestamp |
| **Email engagement** | 50% of notification emails opened | Email tracking (SendGrid) |

### Secondary Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| **Time to resolve** | Avg. 2 hours | Resolved timestamp - created timestamp |
| **Rider re-shares** | 60% of riders shared 2+ times | Share log count |
| **Engineer adoption** | 30% of engineers engage with comments | Unique commenters / unique share recipients |
| **Mobile usability** | 40% of comments from mobile | User agent tracking |

### Qualitative Metrics

- **User Feedback:** 80% of beta users find comments valuable
- **NPS:** Comments feature scores 40+
- **Support Tickets:** 30% reduction in "rider miscommunication" tickets

---

## Magic Link & Multi-Device Access

### How Magic Links Work

**Context:** Engineers don't need to create accounts. They receive a shareable link with a token.

### Multi-Device Scenario

**Device A (Laptop):**
```
1. Engineer receives email: "Your rider link: miked.live/riders/xyz789?token=abc123"
2. Clicks link
3. System validates token → creates session cookie on laptop
4. Engineer can now view/comment on rider
5. Token is CONSUMED (marked as used)
```

**Device B (Phone):**
```
1. Engineer wants to check rider on phone
2. Opens same email link: miked.live/riders/xyz789?token=abc123
3. System checks token → ALREADY USED
4. Shows error: "This link has already been used on another device"
5. Suggests: "Ask the band coordinator to resend the link"
```

### Why One-Time Tokens?

**Security:**
- Prevents accidental sharing (forwarding email to someone = limited access)
- Tokens expire after use (can't be intercepted and reused later)

**Simplicity:**
- No device tracking/fingerprinting
- No complex multi-session management

### UX: Resend Link Button

**In Share Log (for Band Coordinator):**
```
SHARE LOG
─────────────────────────────────────
Shared with: michiel@engineer.com
Shared at: Feb 25, 2:00pm

📱 Viewed on Device A (Safari, 192.168.1.100) at Feb 25, 2:15pm ✅
❌ Token expired (one-time use)

[Resend Link to michiel@engineer.com]
```

**When clicked:**
- New token generated
- Email sent: "The band coordinator shared the rider with you again"
- Engineer can open on Device B with fresh link

### Alternative Approach (Phase 2+)

**Optional Account Creation:**
Instead of always using links, engineers could:
1. Click magic link on Device A
2. See option: "Create Account" or "Just View"
3. If they create account → can log in on Device B without link
4. Converts one-off engineers → registered users

This enables:
- Persistent access across devices
- Rider history (engineers see all riders they've viewed)
- Personalization (favorite venues, saved notes)

**For MVP:** Not needed; one-time links are sufficient

---

## Out of Scope

### Not Included in MVP

❌ Real-time chat or messaging
❌ Video/audio comments
❌ File uploads or image attachments
❌ Advanced permissions (only role-based color)
❌ Comment history or audit trails
❌ Analytics dashboard for comments
❌ Mobile app (web responsive only)
❌ Integration with Slack or Discord
❌ AI-powered comment suggestions
❌ Comment translations
❌ Digest/summary emails (immediate notifications only)
❌ Optional account creation (Phase 2+)

### Phase 2+ Opportunities

- **Rich comment editor:** Markdown formatting, @mentions, emoji reactions
- **Comment search & filtering:** Full-text search on comments
- **Comment templates:** Pre-written responses for common questions
- **Integration:** Slack notification, webhook for external tools
- **Analytics:** Most-commented sections, average resolution time
- **AI:** Auto-categorize comments, suggest replies

---

## Timeline & Milestones

### Phase 1: Core Comments (Weeks 1-2)

- [ ] Design mockups & get approval
- [ ] Set up database tables & migrations
- [ ] Build comment form UI
- [ ] Build comment display + threading
- [ ] API: POST /comments, GET /comments
- [ ] Role-based color system
- [ ] Email notifications
- [ ] Internal testing

**Deliverable:** Bands can comment on riders, engineers get notified

---

### Phase 2: Collaboration (Weeks 3-4)

- [ ] Comment sidebar component
- [ ] Resolve/unresolve functionality
- [ ] Share tracking (view timestamps)
- [ ] Reply threads with nesting
- [ ] Filter comments by role/section
- [ ] Rate limiting & abuse prevention
- [ ] Beta testing with 5-10 users

**Deliverable:** Full feedback loop between band & engineer

---

### Phase 3: Polish & Launch (Weeks 5-6)

- [ ] Accessibility audit (WCAG 2.1 AA)
- [ ] Performance optimization
- [ ] Documentation (user guide, API docs)
- [ ] Analytics integration
- [ ] Mobile responsiveness testing
- [ ] Public launch announcement
- [ ] Monitor & support

**Deliverable:** Feature-complete, production-ready

---

### Success Criteria for Launch

✅ 95%+ API uptime
✅ <500ms comment submit latency
✅ Email delivery rate >95%
✅ Zero critical bugs in production
✅ 50%+ beta testers engaged with feature
✅ Accessibility audit passed

---

## Questions & Open Items

1. **PDF Export:** Should final PDF include comment threads or export clean version?
   - Option A: Include resolved comment summary
   - Option B: Export with comments as footnotes
   - Option C: Separate "clean" vs. "with comments" PDF versions
   - **Decision:** TBD — recommend Option C (both versions)

2. **Authentication for Band Coordinators:**
   - Current: Magic links for engineers
   - Question: Do band coordinators need to log in to moderate comments?
   - **Decision:** Yes, use existing Miked.live auth system

3. **Comment Moderation:**
   - Should inappropriate comments be flagged/deleted?
   - **Decision:** For MVP, manual deletion only; add reporting feature in Phase 2

4. **Email Reply:** Should bands be able to reply via email (click "Reply" in email)?
   - Current: Link to web interface
   - Question: Worth implementing email-to-comment feature?
   - **Decision:** Out of scope for MVP; revisit in Phase 2 if demand

5. **Notifications Frequency:**
   - Current: Instant email on each comment
   - Question: Should we throttle/batch notifications?
   - **Decision:** For MVP, send immediately; add digest option in Phase 2

---

## Appendix: Glossary

| Term | Definition |
|------|-----------|
| **Rider** | Technical requirements document for a live performance |
| **Band Coordinator** | Person who creates and manages the rider (usually band leader or manager) |
| **Sound Engineer / FOH** | Person responsible for sound during the performance |
| **ICP** | Ideal Customer Profile (user type) |
| **Magic Link** | One-time URL that doesn't require account login |
| **Share Log** | Record of who rider was shared with and when they viewed it |
| **Section** | Part of rider (stage plot, input list, power drops) |
| **Thread** | Comment and all related replies |
| **Resolved** | Comment marked as addressed; typically hidden in UI |

---

## Sign-Off

**Document Owner:** Miked.live Product Team
**Last Updated:** February 25, 2026
**Status:** Ready for Development

**Approval:**
- [ ] Product Manager
- [ ] Engineering Lead
- [ ] Design Lead
- [ ] Stakeholder

