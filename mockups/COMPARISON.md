# UC-2 vs UC-3: Two Very Different Rider Experiences

## Quick Summary

| | **UC-2: Quick Rider** | **UC-3: Full Rider** |
|---|---|---|
| **User** | Afke (weekend musician) | Lars (band coordinator) |
| **Time** | 2-3 minutes | 10-15 minutes |
| **Collaboration** | Solo | Team (invite band members) |
| **Technical Knowledge** | Zero required | Medium required |
| **PDF Pages** | 1 | 3-4+ |
| **Stage Plot** | No | Yes (interactive) |
| **Comments** | No | Yes (engineer feedback) |
| **Band Member Input** | No | Yes (Piet, Rob, Tom each fill in their own) |
| **Philosophy** | "You figure it out" | "Let's be detailed & professional" |

## User Personas & Scenarios

### UC-2: Non-Technical Musician (ICP-2)

**Profile:**
- Drummer in "Blauw Lint", a 4-piece cover band
- Plays weekend gigs (weddings, local venues)
- Doesn't understand audio jargon
- Wants to book gigs fast without technical hassle

**Pain Point:**
- "I don't know what 'input channels' or 'DI' means"
- "We just have drums, bass, guitars, vocals — the engineer will figure out the rest"
- "I booked a wedding gig, organizer asked for technical requirements, I panicked"

**Solution:**
✓ 4 simple questions (band name → contact person → instruments → organizer contact)
✓ No technical terms
✓ Direct phone/email (engineer can call with questions)
✓ 1-page PDF (clean, professional, printable)

**Journey:**
```
Afke gets wedding gig booking
↓
Organizer: "Send technical rider"
↓
Afke: "I don't have one, what is that?"
↓
Quick Rider: 4 questions, 2 minutes
↓
Downloads PDF, sends to organizer
↓
Engineer calls Afke directly if needed
↓
No email chains, direct communication ✓
```

### UC-3: Band Coordinator (ICP-3)

**Profile:**
- Lars, singer + organizer for "The Rockers"
- Band has Piet (drums), Rob (bass), Tom (guitar)
- Plays multiple venues per month
- Wants professional, detailed riders
- Wants band members to contribute

**Pain Point:**
- "Band members won't fill in their own details, I have to ask everyone individually"
- "Engineer has questions but they come through the booker — slow feedback loop"
- "We need a 'living document' where we can iterate with engineer feedback"

**Solution:**
✓ Create rider once, invite band members
✓ Real-time collaboration (see who's editing)
✓ Comments from engineer directly in tool
✓ No email (all communication in-app)
✓ Multi-page PDF with stage plot, mics, power specs

**Journey:**
```
Lars creates rider, adds Piet, Rob, Tom
↓
Each member gets invite link → fills in their section
↓
Lars adds stage plot, uploads band logo
↓
Lars shares with engineer Michiel
↓
Michiel sees: "Monitor directions unclear?"
↓
Michiel comments in red (role-based color)
↓
Lars gets notification, updates stage plot
↓
Michiel sees notification "Lars updated the rider"
↓
Michiel downloads final PDF for prep
↓
Iterative feedback loop ✓
```

## Design Decisions

### UC-2: Minimal & Fast

```
Landing Page
    ↓
[Quick Rider] OR [Full Rider]
    ↓ (choose Quick)
Question 1: Band Name
    ↓
Question 2: Engineer Contact
    ↓
Question 3: Instruments
    ↓
Question 4: Venue Contact
    ↓
Preview PDF (1 page)
    ↓
Download ✓
```

**Design Philosophy:**
- **One screen = one question** (no cognitive overload)
- **No scrolling** (see all options at once)
- **Progress bar** (shows you're making progress)
- **Emoji icons** (visual clarity without text)
- **Simple language** ("What's your band name?" not "Band Entity Identifier")

### UC-3: Detailed & Collaborative

```
Landing Page
    ↓
Choose [Full Rider]
    ↓
Step 1: Band Name + Members
    ↓
Step 2: Stage Plot Canvas
    ↓
Step 3: Input List Editor
    ↓
Step 4: Contact & Notes
    ↓
Preview PDF (3-4 pages)
    ↓
Share with engineer (invite)
    ↓
✓ Comments, notifications, iterations
```

**Design Philosophy:**
- **Multiple steps** (depth without rushing)
- **Collaboration UI** (see who's editing in real-time)
- **Rich editor** (stage plot drawing, member placement)
- **Comment threads** (feedback loop, not one-off PDF)
- **Professional output** (detailed, engineer-friendly)

## Content Comparison

### UC-2 PDF (1 Page)

```
═══════════════════════════════════════
         BLAUW LINT
    Technical Rider
═══════════════════════════════════════

CONTACT
Name: Afke
Email: afke@email.com
Phone: 06-12345678

INSTRUMENTS
• Drums
• Bass
• Electric Guitar (2x)
• Vocals

Setup: Please contact Afke for specific
technical requirements. We're ready to
work with your equipment and expertise.

Organizer: [contact]
```

**Info density:** Low (essential only)
**Technical jargon:** None
**Visual elements:** Minimal
**Print quality:** Excellent on any printer (B&W)

### UC-3 PDF (3-4 Pages)

**Page 1: Band Info**
- Band name, event date, contact
- Professional header with logo

**Page 2: Stage Plot**
- Top-down view with band member positions
- Instrument colors
- Monitor directions (arrows)
- Power drop locations

**Page 3: Input List**
```
Instrument | Mic/DI    | Notes
-----------|-----------|------------------
Kick Drum  | D112      | (standard)
Snare      | SM57      | on top
Bass       | DI + SM57 | 2-track setup
Vocal      | SM58      | high stand
Guitar     | SM57      | amp mic
```

**Page 4+: Technical Notes**
- Power requirements
- Special equipment
- Stage dimensions
- Engineer contact info

**Info density:** High (detailed specs)
**Technical jargon:** Lots ("DI", "SM57", "phantom power")
**Visual elements:** Stage plot diagram, detailed tables
**Print quality:** Must be B&W friendly (no 3D shadows)

## Feature Comparison

### Comments & Feedback

**UC-2:** Not in MVP
- Engineer just calls Afke directly
- Direct phone/email contact is the "feedback mechanism"
- No in-tool comments needed

**UC-3:** Core feature
- Engineer comments on specific sections
- Comments tied to stage plot, input list
- Role-based colors (🔴 engineer, 🟢 band lead)
- Reply threads
- Resolve/unresolve status

### Collaboration

**UC-2:** Solo
- One person (Afke) fills it all in
- No invites, no sharing within band
- Done in 2-3 minutes alone

**UC-3:** Team
- Lars creates, invites Piet, Rob, Tom
- Each member contributes their section
- Real-time updates visible to all
- Lars coordinates everything

### Share & Notifications

**UC-2:** Simple
- Download PDF
- Share manually (email, message, etc.)
- Engineer gets PDF, calls with questions

**UC-3:** Advanced
- Magic link sharing (no download)
- Share tracking (viewed timestamps)
- Email notifications
- In-app comment notifications
- "Engineer viewed your rider at 2:15pm" ✓

## Metrics

### UC-2 Success Criteria
- ✓ Completion in < 3 minutes (shown in mockup)
- ✓ 90% of users successfully download PDF
- ✓ PDF is 1 page
- ✓ No technical jargon confuses users
- ✓ Direct engineer contact (phone included)

### UC-3 Success Criteria
- ✓ Band members complete their sections
- ✓ Engineer can find & comment on issues
- ✓ Feedback loop closes (engineer → band → engineer)
- ✓ Final PDF is multi-page, detailed
- ✓ Users prefer in-tool comments to email

## Phase Rollout

**Phase 1 (Now):** UC-3 Full Rider
- Covers band coordinators (ICP-3)
- Comments & notifications
- Collaboration features

**Phase 2 (Later):** UC-2 Quick Rider
- Covers non-technical musicians (ICP-2)
- Fast, minimal, no collaborations
- Different entry point on landing page

**Combined:**
- **Landing page has two buttons:**
  - [Quick Rider] → 2 min, simple, solo
  - [Full Rider] → 15 min, detailed, collaborative

## Why Two Paths?

### One-Size-Fits-All Doesn't Work

❌ Force Afke through UC-3 (15 min, stage plot, mics)
- She gives up after "What is an input channel?"
- Doesn't finish
- Never sends rider

✓ Give Afke UC-2 (2 min, instruments, contact)
- She completes in under 3 minutes
- Sends to organizer immediately
- Engineer calls her with questions
- Problem solved

---

Similarly:

❌ Force Lars through UC-2 (only instruments)
- He needs stage plot for multi-band festival
- He needs detailed specs for theatre venue
- He needs collaborative feedback from engineer

✓ Give Lars UC-3 (stage plot, invite band members, comments)
- He creates detailed, professional rider
- Band members contribute
- Engineer comments, they iterate
- Perfect rider for complex show

## Takeaway

**UC-2 and UC-3 serve different users with different needs:**

| Need | UC-2 | UC-3 |
|------|------|------|
| I just want to book a gig | ✓ | — |
| I need a rider NOW | ✓ | — |
| I don't understand audio | ✓ | — |
| I manage a band | — | ✓ |
| I need stage plot | — | ✓ |
| I want to collaborate | — | ✓ |
| I want engineer feedback | — | ✓ |

**By supporting both, Miked.live serves the entire market:**
- Hobby bands (UC-2) → Quick, simple, get them set up
- Professional bands (UC-3) → Detailed, collaborative, iterative

---

**View the mockups:**
- [UC-2: Quick Rider](http://localhost:3000/mockups/uc2)
- [UC-3: Band Coordinator](http://localhost:3000/mockups/uc3)
