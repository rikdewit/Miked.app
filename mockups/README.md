# Miked.live MVP Mockups

Interactive prototypes demonstrating all user journeys from the MVP-comm documentation.

## 🚀 Quick Start

```bash
npm run dev
# Open browser to: http://localhost:3000/mockups
```

## 📑 Available Mockups

### ✅ UC-2: Quick Rider (Non-Technical Musicians)
**Status:** Complete & Interactive

- **File:** [`UC2-QuickRider.tsx`](./UC2-QuickRider.tsx)
- **Route:** `/mockups/uc2`
- **User:** Afke (weekend band drummer)
- **Goal:** Create a rider in < 3 minutes
- **Features:**
  - Mode selection (Quick vs Full)
  - 4-question wizard
  - Completion time tracking
  - PDF preview
  - Completion screen with stats
- **Read:** [`UC2-README.md`](./UC2-README.md)

### ✅ UC-3: Band Coordinator Rider Management
**Status:** Complete & Interactive

- **File:** [`UC3-BandCoordinatorRider.tsx`](./UC3-BandCoordinatorRider.tsx)
- **Route:** `/mockups/uc3`
- **User:** Lars (band coordinator/organizer)
- **Goal:** Collaborate with band members, get engineer feedback
- **Features:**
  - Real-time band member contribution tracking
  - Multi-tab interface (Overview, Stage Plot, Input List, Comments)
  - Role-based comment threads (🔴 Engineer, 🟢 Band Lead)
  - Expandable comment threads with replies
  - Share tracking & notifications
  - Status badges (✓ Done, ✎ Editing, ○ Pending)
- **Read:** [`UC3-README.md`](./UC3-README.md)

### 📋 UC-1: Gear-Aware Musician (Planned)
**Status:** Coming Soon

- **User:** Matthijs (gear-conscious guitarist)
- **Goal:** Specify exact mic for own instrument, defer others
- **Key Feature:** "Ask Engineer" option for uncertain specs
- **Target:** Q2 2026

### 📋 UC-4: Engineer Receiving Rider (Planned)
**Status:** Coming Soon

- **User:** Michiel (sound engineer)
- **Goal:** View clean, printable rider; comment on sections
- **Key Feature:** No-login magic link access, B&W print friendly
- **Target:** Q2 2026

## 📊 Comparison

### UC-2 vs UC-3

See [`COMPARISON.md`](./COMPARISON.md) for detailed feature breakdown:

| Aspect | UC-2 | UC-3 |
|--------|------|------|
| **Time** | 2-3 min | 10-15 min |
| **Collaboration** | Solo | Team (invite members) |
| **Technical Knowledge** | Zero | Medium |
| **PDF Pages** | 1 | 3-4+ |
| **Comments** | No (engineer calls) | Yes (full threading) |
| **Target User** | Weekend bands | Professional bands |

## 🎯 How to Use These Mockups

### 1. View the Live Mockup
```bash
npm run dev
# UC-2: http://localhost:3000/mockups/uc2
# UC-3: http://localhost:3000/mockups/uc3
# Index: http://localhost:3000/mockups
```

### 2. Interact with UI Elements
- Click buttons and tabs
- Fill in forms
- Expand/collapse comments
- See status changes
- View PDF preview

### 3. Understand the User Journey
- Follow the flow from start to completion
- Note pain points being solved
- See how different users experience the same product

### 4. Validate Against PRD
Compare mockups with:
- [`docs/MVP-comm/mvp-communication-prd.md`](../docs/MVP-comm/mvp-communication-prd.md)
- [`docs/MVP-comm/ICP.md`](../docs/MVP-comm/ICP.md)
- [`docs/MVP-BUILD plan.md`](../docs/MVP-BUILD plan.md)

### 5. Gather Feedback
Use mockups to:
- Present to real users (ICP-2, ICP-3, ICP-4)
- Get feedback before building
- Iterate design based on comments
- Validate assumptions

## 📁 File Structure

```
mockups/
├── README.md                          # This file
├── COMPARISON.md                      # UC-2 vs UC-3 deep dive
├── UC2-QuickRider.tsx                 # UC-2 component
├── UC2-README.md                      # UC-2 documentation
├── UC3-BandCoordinatorRider.tsx        # UC-3 component
└── UC3-README.md                      # UC-3 documentation

app/mockups/
├── page.tsx                           # Mockups index/directory
├── uc2/
│   └── page.tsx                       # UC-2 route
└── uc3/
    └── page.tsx                       # UC-3 route
```

## 🎨 Design Highlights

### UC-2: Fast & Simple
- **Color scheme:** Emerald & Blue
- **Visual style:** Minimal, clean
- **UX philosophy:** One question per screen
- **Progress:** Animated progress bar + percentage
- **Completion:** Time tracking (< 3 min goal)

### UC-3: Detailed & Collaborative
- **Color scheme:** Blue (primary) with role-based badges
- **Visual style:** Rich, information-dense
- **UX philosophy:** Tabs for different sections
- **Progress:** Real-time status indicators
- **Feedback:** Comments with threads and replies

### Shared Elements
- Tailwind CSS for styling
- Lucide React icons
- Responsive design (desktop-focused)
- Accessibility-first approach

## 🔧 Technical Implementation Notes

### UC-2: Form Validation
```tsx
// Required fields
- bandName (non-empty)
- contactPerson (non-empty)
- contactEmail (valid email)
- instruments (at least one selected)

// Optional
- contactPhone
- venueContact
```

### UC-2: Time Tracking
- Captures `startTime` when entering step1
- Calculates elapsed time at completion
- Displays: "Time to complete: 127 seconds"

### UC-3: State Management
- All state in component (no external store needed)
- Tabs control visibility
- Comments expand/collapse
- Real-time member status shown

### UC-3: Role-Based Colors
```tsx
const roleColors = {
  engineer: { bg: 'bg-red-50', text: 'text-red-700' },
  band_lead: { bg: 'bg-green-50', text: 'text-green-700' },
  band_member: { bg: 'bg-blue-50', text: 'text-blue-700' },
  venue: { bg: 'bg-yellow-50', text: 'text-yellow-700' },
}
```

## 📖 Related Documentation

### MVP Requirements
- **[MVP PRD](../docs/MVP-comm/mvp-communication-prd.md)** — Complete feature specifications
- **[ICP & Use Cases](../docs/MVP-comm/ICP.md)** — User personas and scenarios
- **[Build Plan](../docs/MVP-BUILD plan.md)** — Phase-by-phase roadmap

### Architecture Context
- **[Builder Context](../docs/MVP-comm/miked-live-context-for-builders.md)** — Project overview for new team members

## 🎬 User Scenarios

### UC-2 Scenario
```
Afke books wedding gig
  ↓
Organizer: "Send technical rider"
  ↓
Afke: "I'll use Quick Rider"
  ↓
4 questions, 2 minutes
  ↓
Email PDF to organizer
  ↓
Engineer gets it, calls Afke
  ↓
All set ✓
```

### UC-3 Scenario
```
Lars has band gig at festival
  ↓
Creates Full Rider, invites band members
  ↓
Piet (drums), Rob (bass), Tom (guitar) contribute
  ↓
Lars sees real-time updates ✓
  ↓
Lars adds stage plot, shares with engineer
  ↓
Engineer sees: "Monitor directions unclear?"
  ↓
Lars replies, updates plot
  ↓
Iterations until consensus
  ↓
Download final PDF ✓
```

## 🧪 Testing Scenarios

### Test UC-2 with:
- **Real weekend musician** — Does the 4-question flow work?
- **Non-technical person** — Is the language clear?
- **Time the completion** — Does it hit < 3 min target?
- **Print the PDF** — Is it readable in B&W?

### Test UC-3 with:
- **Band coordinator** — Is collaboration intuitive?
- **Sound engineer** — Are comments tied to right sections?
- **Band members** — Do they understand their role?
- **Compare with email workflow** — Is it faster/better?

## 📊 Metrics to Track (Post-Implementation)

### UC-2 Metrics
- Completion rate (% start → finish)
- Completion time (target < 3 min)
- Phone number inclusion (direct contact %)
- Drop-off by step (which step loses users?)
- Instrument selection patterns

### UC-3 Metrics
- Band member participation (% invited → contributed)
- Comment frequency (avg comments per rider)
- Resolution rate (% comments resolved)
- Feedback loop speed (engineer comment → band reply)
- Engineer adoption (% engineers use comment system)

## 🚦 Next Steps

### Immediate (This Week)
1. ✅ Create UC-2 mockup (DONE)
2. ✅ Create UC-3 mockup (DONE)
3. ⬜ Get user feedback on both
4. ⬜ Iterate based on feedback

### Short-term (Next Sprint)
5. ⬜ Create UC-1 mockup (gear-aware musician)
6. ⬜ Create UC-4 mockup (engineer receiving rider)
7. ⬜ Validate landing page mode selection
8. ⬜ Refine PDF layout

### Medium-term (Phase 1 Implementation)
9. ⬜ Build actual forms/UI in codebase
10. ⬜ Implement comment system
11. ⬜ Set up notifications
12. ⬜ Test with real users (Phase 0 validation)

## 🤝 Contributing

Have feedback on the mockups?
- Discuss issues in code comments
- Create GitHub issues for design gaps
- Reference mockups in PRD validation

## 📞 Questions?

Refer to:
1. **[This README](./README.md)** — Overview of mockups
2. **[COMPARISON.md](./COMPARISON.md)** — UC-2 vs UC-3 detailed breakdown
3. **[UC2-README.md](./UC2-README.md)** — UC-2 specific documentation
4. **[UC3-README.md](./UC3-README.md)** — UC-3 specific documentation
5. **[MVP PRD](../docs/MVP-comm/mvp-communication-prd.md)** — Full requirements
6. **[ICP.md](../docs/MVP-comm/ICP.md)** — User personas and use cases

---

**Created:** February 25, 2026
**Status:** 2 of 4 mockups complete (UC-2, UC-3)
**Next:** UC-1 & UC-4 coming soon
