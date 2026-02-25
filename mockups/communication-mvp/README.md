# MVP Communication Feature — Interactive Mockups

**Purpose:** Visual prototypes of the MVP in-rider communication system for Miked.live

**Status:** Ready for design review & developer handoff

---

## 📁 Mockup Files

### 1. **01-rider-view-with-comments.html**
**Desktop view of a rider with full comments system**

**Shows:**
- Rider content (stage plot, input list, power requirements)
- Comment icons on each section with badge counts
- Right sidebar with comments list
- Comment threads with role-based colors (red=engineer, green=band, yellow=venue)
- Comment detail modal with full conversation
- Resolved state indicators
- Filter buttons (All, Open Only, By Role)

**Key Interactions:**
- Click comment badge → highlight section + scroll
- Click comment item in sidebar → open detail modal
- See full thread with nested replies
- Mark as resolved with visual badge

**Use Case:** Designers & developers seeing how the system works together

---

### 2. **02-mobile-comments.html**
**Mobile phone frame showing responsive design**

**Shows:**
- iPhone frame (375px × 667px)
- Rider content on full screen
- Floating comment button (FAB)
- Comments as bottom sheet modal (swipeable)
- Comment form as full-screen modal
- Responsive form inputs with character counter
- Stacked layout (no sidebar on mobile)

**Key Interactions:**
- Tap comment FAB → open bottom sheet
- Tap "Add" → open comment form modal
- Type comment → character count updates
- Submit → closes modals, comment added

**Use Case:** Designers optimizing mobile UX & developers implementing responsive behavior

---

### 3. **03-share-status-panel.html**
**Share tracking & history management**

**Shows:**
- Share form (email, name, role)
- Share log with multiple recipients
- Status badges (VIEWED ✅, PENDING ⏱, EXPIRED ✗)
- View timestamps & device info (browser, IP, device)
- Action buttons (Resend Link, Copy Link, Remove Access)
- Activity timeline tab
- One-time token behavior explained

**Key Interactions:**
- Fill share form → "Share Link" button
- Success toast appears temporarily
- Click "Resend Link" → modal confirmation
- Click "Copy Link" → copies to clipboard
- Switch to "Activity Timeline" tab → shows events

**Use Case:** Understanding share flow, magic link behavior, & tracking features

---

### 4. **04-notifications.html**
**Toast notifications & email templates**

**Shows:**
- 4 types of toast notifications (comment, viewed, resolved, error)
- Each toast with icon, title, message, & actions
- 4 email templates:
  1. **Comment Added** (engineer → band lead)
  2. **Rider Viewed** (system → band lead, confirms engineer saw it)
  3. **Reply from Band** (band → engineer, shows threaded context)
  4. **Share Notification** (band → engineer, initial invite)
  5. **Digest** (phase 2+, weekly summary)

**Email Features:**
- From avatar with role color
- Subject line with emoji
- Quote sections with role-based border colors
- Call-to-action button
- Direct reply section (can reply in email client)
- Mobile-friendly responsive design

**Key Interactions:**
- Click "Show Toast" buttons → toast appears top-right
- Toasts auto-dismiss after 5 seconds
- Click toast action → dismiss
- Email templates show full formatting

**Use Case:** Designers refining notification copywriting & developers implementing email templates

---

## 🎨 Design System Applied

### Colors (Role-Based)
- **Red (#EF4444):** Engineer comments
- **Green (#10B981):** Band Lead comments
- **Blue (#3B82F6):** Band Member comments / Primary actions
- **Yellow (#F59E0B):** Venue/Booking comments
- **Gray (#6B7280):** Admin / disabled states

### Components Used
- Comment threads with left border
- Badge counts (unread, status)
- Status indicators (✅ Resolved, ⏱ Pending, ✗ Expired)
- Toast notifications (position: top-right, auto-dismiss)
- Bottom sheet (mobile comments)
- Modal overlays
- Timeline events

### Responsive Breakpoints
- **Desktop:** >1024px (full sidebar)
- **Tablet:** 768px-1024px (adjusted layout)
- **Mobile:** <768px (full-screen modals, FAB)

---

## 🚀 How to Use These Mockups

### For Designers
1. Open each HTML file in a browser
2. Test interactions (click, hover, scroll)
3. Take screenshots for design feedback
4. Extract component patterns for design system
5. Iterate on feedback before handing to dev

**Key Decisions to Make:**
- Toast auto-dismiss duration (currently 5s)
- Modal animations (currently slide-up/in)
- Comment sidebar width (currently 360px)
- Maximum modal height on mobile (currently 90vh)

### For Developers
1. Study the HTML structure for component organization
2. Note CSS class naming conventions (BEM-ish)
3. Review interaction patterns (open/close modals, filter, etc.)
4. Extract component hierarchies for your framework
5. Map mockup states to your app state

**Key Implementation Notes:**
- Modals use `.show` class to toggle visibility
- Comments have `.engineer`, `.green`, `.blue`, `.yellow` color variants
- Responsive breakpoints: 768px is main mobile breakpoint
- Toast animations use CSS `@keyframes slideIn`
- Email templates are standalone HTML (can be copy-pasted into email builder)

### For Product Managers
1. Validate user flows match requirements
2. Test edge cases (many comments, long names, etc.)
3. Share with stakeholders for feedback
4. Approve before dev handoff

---

## ✅ Testing Checklist

- [ ] Desktop: All interactions work (click, hover, scroll)
- [ ] Mobile: All modals open/close correctly
- [ ] Responsive: Resize browser window → layout adapts
- [ ] Colors: All role-based colors render correctly
- [ ] Email: All 5 email templates render (copy HTML to email client)
- [ ] Toasts: All 4 toast types appear & auto-dismiss
- [ ] Forms: Input validation & character limits work
- [ ] Share flow: Email form, copy link, resend actions work

---

## 📋 Component Inventory

### Reusable Components

| Component | Files | Notes |
|-----------|-------|-------|
| Comment Thread | 01, 02 | Nested replies with role colors |
| Comment Form | 01, 02 | Name, role, email, textarea |
| Comment Sidebar | 01 | Scrollable list with filter |
| Share Panel | 03 | Form + log with actions |
| Toast Notification | 04 | 4 variants, auto-dismiss |
| Email Template | 04 | 5 templates with inline CSS |
| Modal/Bottom Sheet | 02, 03 | Mobile & desktop versions |

### Interactions

| Interaction | Implementation |
|-------------|-----------------|
| Open comment detail | Modal with fade overlay |
| Submit comment | Form validation + clear on success |
| Resend link | Confirmation modal, then success toast |
| Copy link | Clipboard API, success notification |
| Auto-dismiss toast | CSS animation + timeout |
| Bottom sheet drag | CSS transform translate (mockup only) |

---

## 🎬 Animation Specifications

### Toast
- **Entrance:** `slideIn` 300ms ease-out (from right)
- **Exit:** Fade + slide-out 300ms
- **Duration:** 5 seconds before auto-dismiss

### Modal
- **Entrance:** `slideUp` 300ms ease-out (from bottom on mobile, from right on desktop)
- **Exit:** Fade + slide-out 300ms
- **Backdrop:** Fade in/out 200ms

### Comments
- **Appear:** Fade-in + slide-down 300ms
- **Hover:** Subtle background highlight
- **Resolved:** Opacity 70% + strikethrough

---

## 🔧 Customization Guide

### Change Toast Duration
```javascript
// Currently 5000ms
setTimeout(() => { toast.remove() }, 5000);
```

### Change Sidebar Width
```css
.sidebar {
    width: 360px; /* Change this */
}
```

### Change Email Template Colors
```css
.email-quote {
    border-left-color: #ef4444; /* Change role colors */
}
```

### Add New Comment Role
1. Add color to CSS (e.g., `#8b5cf6` for purple)
2. Add role to role dropdown: `<option>Custom Role</option>`
3. Add corresponding CSS class: `.purple { border-left-color: #8b5cf6; }`

---

## 📱 Browser Compatibility

Tested & works on:
- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Known Issues
- Mobile bottom sheet doesn't actually drag (CSS limitation in HTML mockup)
- Email templates might render differently in various email clients
- Clipboard API only works on HTTPS or localhost

---

## 📝 Notes for Developers

### DOM Structure Pattern
```html
<div class="rider-view">
    <div class="rider-section">
        <div class="comment-icon">💬</div>
        <div class="comment-badge">2</div>
    </div>
</div>

<div class="sidebar">
    <div class="comments-list">
        <div class="comment-item">...</div>
    </div>
</div>

<div class="modal" id="commentModal">
    <div class="modal-content">
        <div class="comment-thread">...</div>
    </div>
</div>
```

### CSS Class Naming
- `.comment-*` = Comment related
- `.modal*` = Modal components
- `.toast*` = Toast notifications
- `.share-*` = Share panel components
- `.email-*` = Email template styles
- `.rider-*` = Rider view elements

### JavaScript Patterns
- Event handlers: `onclick="function()"` (simple mockup style)
- State toggles: `.classList.add/remove('show')`
- Modal open/close: Show/hide by class
- Form clearing: `element.value = ''`

---

## 🎯 Next Steps

1. **Design Review:** Get feedback from Relumio designer
2. **Iterations:** Update mockups based on feedback
3. **Component Extraction:** Create reusable component library
4. **Developer Handoff:** Give developers these mockups + PRD
5. **Implementation:** Developers build actual React/Vue components
6. **Testing:** QA tests against these mockups

---

## 📞 Questions?

Refer to:
- **PRD:** `docs/mvp-communication-prd.md` (requirements)
- **Context:** `docs/miked-live-context-for-builders.md` (project overview)
- **UI Brief:** `docs/mvp-communication-relumio-brief.md` (design specs)

---

**Created:** February 25, 2026
**Files:** 4 HTML mockups + README
**Status:** Ready for review
**Next Owner:** Relumio Designer & Frontend Developer
