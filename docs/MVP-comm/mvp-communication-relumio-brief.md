# MVP Communication Feature — Relumio UI Builder Brief

**Project:** Miked.live
**Feature:** In-Rider Comment System
**Audience:** Relumio UI Builder
**Status:** Ready to design

---

## 🎯 What We're Building

Add a **commenting system** to technical rider PDFs so engineers can ask questions directly on riders, and bands can respond — all in-tool instead of via email.

**Think:** Figma comments, but for band technical riders.

---

## 📋 Core UI Components

### 1. Comment Widget (Inline)
- **Where:** Appears on rider sections (stage plot, input list, power drops)
- **Visual:** Small icon `💬` + badge showing comment count
- **Interaction:** Click → opens inline comment form
- **Form fields:**
  - Name (text input)
  - Role (dropdown: Engineer, Band Lead, Band Member, Venue, Admin)
  - Email (text input)
  - Comment (textarea, max 500 chars)
  - [Submit] button

**Design note:** Form should feel lightweight, not intrusive

---

### 2. Comment Display (Thread View)
- **Visual hierarchy:**
  - Parent comment with left border in role color (red=engineer, green=band, etc.)
  - Replies indented below with author avatar/initials
  - Timestamps (e.g., "2 hours ago")

- **Actions per comment:**
  - [Reply] button
  - [Resolve] button (only for band coordinators)
  - [•••] menu (delete/report)

- **States:**
  - Open (default)
  - Resolved (show ✅ badge, slightly grayed out)
  - Deleted (hidden)

**Design note:** Use role-based colors consistently

---

### 3. Comments Sidebar
- **Layout:** Right sidebar (or modal on mobile)
- **Content:** List of all comments on rider
- **Item structure:**
  - Role color dot + author name
  - Comment snippet (first 50 chars)
  - Reply count
  - Timestamp
  - [View] link to scroll to that comment

- **Header:** Badge showing total comments + unread count
- **Footer:** Filter buttons
  - [All] [Open Only] [Resolved]
  - [By Role] dropdown

**Design note:** Scrollable list; click item → scroll rider to comment location + highlight

---

### 4. Share Status Panel
- **Location:** Top of rider (or in a "Share" tab)
- **Content:**
  - "Shared with: engineer@email.com"
  - "Shared at: Feb 25, 2:00pm"
  - "Viewed at: Feb 25, 2:15pm ✅"
  - Device info: "Safari on 192.168.1.100"

- **Actions:**
  - [Resend Link] button
  - [Copy Link] button
  - [Remove Access] button

**Design note:** Show timeline of share → view events

---

### 5. Notification Toast
- **Trigger:** When comment added while user viewing rider
- **Visual:**
  ```
  🔔 Michiel (Engineer) left a comment
     "Monitor directions unclear"
     [View] [Dismiss]
  ```
- **Position:** Top-right, auto-dismiss after 5s
- **Color:** Subtle gray background, not intrusive

---

### 6. Notification Email
- **Template:** Clean, markdown-based email
- **Content:**
  - Commenter name + role
  - Comment text (highlighted block)
  - Section name where comment was left
  - [View Rider & Reply] CTA button
  - Quick reply option (reply directly in email)

**Design note:** Mobile-friendly; works in all email clients

---

## 🎨 Design System Requirements

### Color Coding (Role-Based)
| Role | Color | Usage |
|------|-------|-------|
| Engineer | 🔴 Red (#EF4444) | Left border, text |
| Band Lead | 🟢 Green (#10B981) | Left border, text |
| Band Member | 🔵 Blue (#3B82F6) | Left border, text |
| Venue | 🟡 Yellow (#F59E0B) | Left border, text |
| Admin | ⚫ Gray (#6B7280) | Left border, text |

### Responsive Breakpoints
- **Desktop:** Sidebar on right (fixed or scrollable)
- **Tablet:** Sidebar as collapsed panel (bottom sheet)
- **Mobile:** Comments as modal (full-screen modal)

---

## 📱 Key Interactions

### Desktop Flow
```
User sees rider
  ↓
Clicks 💬 icon on section
  ↓
Inline form opens (doesn't scroll page)
  ↓
Fills name/role/comment
  ↓
Clicks [Submit]
  ↓
Comment appears instantly with fade-in
  ↓
Toast notification: "Comment posted" (optional)
```

### Sidebar Navigation
```
User sees "COMMENTS (3)" sidebar
  ↓
Clicks comment item
  ↓
Page scrolls to that comment location
  ↓
Comment highlight animates (yellow flash)
```

### Reply Flow
```
Comment displayed
  ↓
User clicks [Reply]
  ↓
Reply form appears indented below
  ↓
Same form as main comment
  ↓
Reply appears in thread immediately
```

### Resolve Flow
```
Band coordinator sees open comment
  ↓
Clicks [Resolve]
  ↓
Comment gets ✅ badge
  ↓
Comment moved below resolved section (or hidden)
  ↓
Can click [Unresolve] to reopen
```

---

## 🎭 Component Hierarchy

```
RiderView
├── CommentIcon (💬 badge on each section)
├── CommentForm (inline)
├── CommentThread (display)
│   ├── Comment
│   │   ├── CommentHeader (author, role, time)
│   │   ├── CommentText
│   │   ├── CommentActions ([Reply] [Resolve] […])
│   │   └── CommentReplies
│   │       └── Comment (nested, indented)
├── CommentSidebar
│   ├── CommentHeader ("COMMENTS (3)")
│   ├── CommentList
│   │   └── CommentListItem (click → scroll to)
│   └── CommentFilters ([All] [Open] [By Role])
├── NotificationToast
│   └── "Michiel left a comment"
└── ShareStatusPanel
    ├── ShareLog (timeline of shares/views)
    └── ShareActions ([Resend] [Copy] [Remove])
```

---

## 🎬 Animation & Microinteractions

- **Comment submit:** Fade-in + slide-down (smooth, <300ms)
- **Sidebar item hover:** Slight background highlight + cursor pointer
- **Resolved state:** Opacity decrease (70%) + strikethrough text
- **Toast notification:** Slide-in from right, auto-dismiss fade-out
- **Reply expand:** Smooth height animation (200ms)

---

## 📏 Layout Specs

### Desktop (>1024px)
- Rider content: 60% width (left)
- Sidebar: 40% width (right, fixed scroll)
- Min-height for sidebar comments: 200px
- Max comment width: 600px

### Tablet (768px - 1024px)
- Rider: Full width
- Sidebar: Bottom sheet (swipe up/down)
- Sheet height: 50% of viewport
- Comment form full-width

### Mobile (<768px)
- Rider: Full width
- Comments: Modal (full-screen overlay)
- Form: Full-width inputs
- Sidebar: Scrollable list

---

## ✅ Accessibility Requirements

- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation (Tab through comments, Enter to submit)
- [ ] Screen reader labels (aria-label for buttons)
- [ ] Focus indicators visible
- [ ] Color not the only indicator (use icons + text)
- [ ] Form labels explicit (not placeholder-only)

---

## 🚀 Deliverables

**Phase 1 (Week 1-2):**
- [ ] Comment widget mockup
- [ ] Comment thread display
- [ ] Comment form design
- [ ] Role-based color system applied
- [ ] Desktop layout
- [ ] Mobile responsive

**Phase 2 (Week 3-4):**
- [ ] Sidebar component
- [ ] Share status panel
- [ ] Notification toast
- [ ] Resolved state design
- [ ] Animations/microinteractions
- [ ] Tablet layout

**Phase 3 (Week 5-6):**
- [ ] Accessibility audit
- [ ] Design system documentation
- [ ] Component library exports
- [ ] Email template design

---

## 🎨 Design Patterns to Reference

- **Comments:** Figma/Notion comment threads (nested replies, role colors)
- **Sidebar:** Slack thread panel (fixed width, scrollable)
- **Notifications:** Slack desktop notifications (minimal, auto-dismiss)
- **Share log:** GitHub PR "deployments" or "releases" timeline (date/time events)

---

## 📝 Figma / Design File Structure

```
Miked.live / MVP Communication
├── Components
│   ├── CommentWidget
│   │   ├── Icon only
│   │   ├── Icon + count
│   │   ├── Icon + active
│   ├── CommentForm
│   │   ├── Default state
│   │   ├── Focused state
│   │   ├── Filled state
│   │   ├── Submitted state
│   ├── Comment
│   │   ├── Engineer role (red)
│   │   ├── Band lead role (green)
│   │   ├── Resolved state
│   │   ├── With replies
│   ├── CommentSidebar
│   ├── ShareStatusPanel
│   ├── NotificationToast
│   └── Responsive variants (mobile/tablet/desktop)
├── Screens
│   ├── Rider view (desktop)
│   ├── Rider view (mobile)
│   ├── Rider view (with comments open)
│   └── Share panel
└── Interactions
    ├── Comment submit flow
    ├── Reply flow
    ├── Resolve flow
    └── Mobile sidebar toggle
```

---

## ❓ Questions for Designer/Team

1. **Comment length limit UI:** Show character count (e.g., "45/500") or silent limit?
2. **Resolved comments visibility:** Hide entirely or show collapsed?
3. **Sidebar default:** Always open on desktop, or collapsed by default?
4. **Mobile comments:** Modal or bottom sheet?
5. **Animation speed:** Prefer snappy (200ms) or smooth (500ms)?

---

## 📞 Next Steps

1. Review this brief with product team
2. Create Figma mockups for all components
3. Get design approval
4. Export components & hand off to dev
5. Iterate based on dev feedback

---

**Created:** Feb 25, 2026
**For:** Relumio UI Builder
**Status:** Ready for design kickoff
