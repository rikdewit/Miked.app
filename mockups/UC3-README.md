# UC-3 Mockup: Band Coordinator Rider Management

## Overview

This mockup demonstrates **Use Case 3** from the MVP-comm documentation: **Lars (Band Coordinator)** creating a rider, inviting band members to contribute, sharing with a sound engineer, and iterating through feedback.

## What It Shows

### 1. **Collaborative Band Member Management**
- Track real-time contribution status of band members:
  - ✓ **Completed** (green) — Member has finished filling in their section
  - ✎ **In Progress** (blue) — Member is currently editing
  - ○ **Pending** (gray) — Invitation sent, awaiting response
- Visual status badges and timestamps for each member's last update
- "Rob is currently editing..." real-time indicator

### 2. **Multi-Tab Interface**

#### Overview Tab
- Quick stats: "3/4 Members completed", "2 Engineer comments"
- Band member cards with contribution tracking
- Share status showing engineer has viewed the rider

#### Stage Plot Tab
- Visual representation of band setup (top-down view)
- Embedded engineer comments tied to specific sections
- Edit button for coordinator to make updates

#### Input List Tab
- Equipment details per instrument (Kick, Snare, Bass, Vocals, Guitar)
- Status indicators showing which member added each item
- "Rob editing..." real-time update
- Unresolved engineer comment: "Do you have a drummer?"

#### Comments Tab
- Full comment threads with colored role badges:
  - 🔴 **Red** = Engineer comments
  - 🟢 **Green** = Band Lead replies
  - 🔵 **Blue** = Band Member comments
- Expand/collapse comments to see full conversations
- Reply interface to respond directly in-tool
- Resolution status tracking

### 3. **Engineer Communication**
Two comments from engineer "Michiel":
1. "Monitor directions are unclear — which wedges face the band vs. the audience?"
   - Lars already replied: "Updated the stage plot — all wedges now face the band"
   - Status: Shows as resolved
2. "Do you have a drummer? Input list shows drums but no details."
   - Status: Unresolved, awaiting response

### 4. **Share & Notification System**
- Share modal to invite engineer by email
- Share history showing:
  - When rider was shared
  - When engineer viewed it (✓ Viewed at 2:15 PM)
- Status tracking prevents miscommunication

## Key Features Demonstrated

### Real-Time Collaboration
- "Rob is currently editing his bass setup info" notification
- Members can contribute simultaneously
- Lars sees updates as they happen

### Role-Based Comments
Color-coded comments by role ensure clarity:
```
🔴 Engineer (Red)     = Technical questions, clarifications
🟢 Band Lead (Green)  = Confirmations, updates
🔵 Band Member (Blue) = Instrument-specific notes
🟡 Venue (Yellow)     = Logistics, power, dimensions
```

### Notification Flow
1. Lars creates rider
2. Invites Piet, Rob, Tom via share links
3. Members fill in their info → Lars sees real-time updates
4. Lars shares with Michiel (engineer)
5. Michiel comments on unclear sections
6. Lars gets notification and replies in-tool
7. Michiel sees responses immediately
8. Process repeats until consensus

### No Email Friction
- Comments stay in-tool instead of email chains
- Direct back-and-forth without intermediaries
- Notification emails drive users back to the tool

## User Personas in This Scenario

### Lars (Band Coordinator)
- Creates the rider
- Invites band members
- Monitors progress
- Responds to engineer feedback
- Updates rider based on comments
- Ultimately downloads final PDF

### Piet, Rob, Tom (Band Members)
- Receive invitation link
- Fill in their instrument/mic details
- Can see comments from engineer
- Status shows as "completed" when done

### Michiel (Sound Engineer)
- Receives share link (no login needed)
- Views clean, printable rider
- Can comment directly on sections
- Gets notified when coordinator replies
- Downloads final PDF for prep

## How to Use This Mockup

### View it live
```bash
npm run dev
# Navigate to http://localhost:3000/mockups/uc3
```

### Interact with it
1. **Overview Tab** — See member status, quick stats
2. **Stage Plot Tab** — Visualize band layout with comment indicators
3. **Input List Tab** — View equipment details and editing status
4. **Comments Tab** — Read engineer feedback and reply
5. **Share Modal** — Click "Share with Engineer" button

### Test Different States
- Hover over member cards to see status colors
- Click comments to expand/collapse threads
- Try expanding different comment threads
- Interact with reply forms

## Design Decisions

### Visual Hierarchy
- Active/expanded comments highlighted in blue
- Unresolved comments shown prominently in red
- Real-time edits draw attention with pulsing icon

### Color Coding
- Follows the MVP PRD role-based system
- Accessible (not relying on color alone for meaning)
- Labels always include role for clarity

### Information Density
- Tabs keep interface clean without overload
- Each tab shows relevant details for that section
- Sidebar on comments tab shows quick reference

## What This Enables

### For Lars (Coordinator)
✅ Manage contributor workflow without chasing people
✅ See real-time progress on rider completion
✅ Respond to engineer feedback without email delays
✅ Keep all communication in one place
✅ Track who did what and when

### For Band Members
✅ Receive clear invitation (no "figure out what to fill in" confusion)
✅ Contribute their own info (not relayed through coordinator)
✅ See comments from engineer
✅ Understand their role is complete with ✓ badge

### For Sound Engineer
✅ Review complete rider without account creation
✅ Ask clarifying questions directly tied to sections
✅ Get notified when coordinator responds
✅ Download printable PDF for prep
✅ No miscommunication through intermediaries

## Next Steps / Future Enhancements

### Phase 2 Features (Out of MVP scope, but shown in this mockup)
- [ ] Collaborative real-time editing (CRDT-based merge)
- [ ] @mention notifications
- [ ] Comment search & filtering
- [ ] Comment history/audit log
- [ ] Rich text formatting in comments (markdown)
- [ ] Attachment uploads to comments

### Phase 3 Features
- [ ] Mobile app (responsive shown, but not mobile-optimized)
- [ ] Integration with Slack/Discord
- [ ] Analytics dashboard (which sections most-commented)
- [ ] AI-powered comment suggestions

## File Structure

```
mockups/
├── UC3-BandCoordinatorRider.tsx    # Main mockup component
├── UC3-README.md                    # This file
└── (Other UC mockups coming soon)

app/mockups/uc3/
└── page.tsx                         # Route to view the mockup
```

## Questions?

This mockup is based on:
- **docs/MVP-comm/ICP.md** — Use Case 3 (UC-3)
- **docs/MVP-comm/mvp-communication-prd.md** — Communication system PRD
- **docs/MVP-BUILD plan.md** — Phase 3 & 4 planning

Refer to these docs for detailed requirements and design specifications.

---

**Mockup Date:** February 25, 2026
**Status:** Interactive prototype for UC-3 feedback loop
**Next:** UC-2 (Quick/Simple Mode) and UC-4 (Engineer receiving rider)
