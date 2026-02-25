# UC-2 Mockup: Quick Rider (Non-Technical Musicians)

## Overview

This mockup demonstrates **Use Case 2** from the MVP documentation: **Afke (non-technical weekend musician)** creating a simple, fast technical rider in under 3 minutes with zero technical jargon.

**ICP-2 Profile:** Weekend bands, cover bands, hobbyists who don't know audio terminology
- Doesn't understand "input channels", "DI", "phantom power"
- Philosophy: "We have drums, bass, guitars, vocals — you figure out the rest"
- Wants direct engineer contact (phone/email) instead of going through booker
- Target completion time: **< 3 minutes**

## What It Shows

### Initial Mode Selection
Two clear paths:
- **Quick Rider** (Recommended) — 4 questions, ~2 minutes, simple 1-page PDF
- **Full Rider** — Detailed specs, stage plot, ~15-20 minutes (leads to UC-3 experience)

### The 4-Question Wizard

**Question 1: Band Name**
- "What's your band name?" → "Blauw Lint"
- Simple text input, auto-focus
- One field = no cognitive load

**Question 2: Engineer Contact**
- "Who should the sound engineer contact?"
- Name, email, phone (optional)
- Direct communication without booker intermediary
- Clear explanation: "This person can answer technical questions"

**Question 3: Instruments**
- "What instruments does your band have?"
- Simple checkboxes with emoji:
  - 🥁 Drums
  - 🎸 Bass
  - 🎸 Electric Guitar (can select 2x)
  - ⌨️  Keyboards
  - 🎤 Vocals
  - 🎺 Horns/Saxophones
- No "input channels", "mic types", "DI boxes" — pure instruments
- Minimum viable info for engineer

**Question 4: Venue Contact (Optional)**
- Organizer name/email/phone
- Completely optional
- Single textarea = flexibility without complexity

### Progress Tracking
- Visual progress bar that fills as user advances
- Percentage display (25%, 50%, 75%, 90%)
- Shows how fast they're going

### Completion Time
- Displays actual seconds taken to complete
- Shows that UC-2 achieves goal of "< 3 minutes"
- Example: "Time to complete: 127 seconds" ✓

### PDF Preview
One-page rider showing:
```
═══════════════════════════════════════
              BLAUW LINT
         Technical Rider
═══════════════════════════════════════

CONTACT
Contact Person: Afke
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

Organizer: [if provided]

─────────────────────────────────────
Created with Miked.live • miked.live
```

### Completion Screen
Shows:
- ✓ Rider Complete! 🎉
- Completion stats (time, questions, PDF pages)
- Next steps (download → share → organizer shares with engineer)
- Download button
- Share button
- Option to create another rider

## Key Design Principles

### 1. **Simplicity**
- 4 questions max
- No scrolling (fits on one screen at a time)
- No technical terms
- Clear progress

### 2. **Speed**
- Target: < 3 minutes completion
- One question per screen = focus
- Auto-focus on inputs
- Keyboard navigation ready

### 3. **Direct Engineer Contact**
- "Who should the sound engineer contact?" question is KEY
- Avoids email chains through booker
- Afke provides her direct phone/email
- Engineer can call/email her with questions

### 4. **Minimal Info Philosophy**
- Only ask what's essential
- Don't ask about mic types, channels, power drops
- Trust engineer's expertise
- "You figure out the rest" approach

### 5. **Clear One-Page PDF**
- Not overwhelming
- Printable (B&W friendly)
- Essential info only:
  - Band name
  - Contact person (with phone)
  - Instruments
  - Organizer contact (optional)

## Comparison: UC-3 vs UC-2

| Aspect | UC-3 (Coordinator) | UC-2 (Quick) |
|--------|-------------------|------------|
| Time | 10-15 min | < 3 min |
| Complexity | High (stage plot, mics) | Low (just instruments) |
| Collaboration | Yes (invite band members) | No (solo) |
| Technical Knowledge | Required | Not required |
| PDF Pages | 3-4+ | 1 |
| Comments | Full system | Simple contact info |
| Target User | Band leaders, managers | Weekend musicians |
| Philosophy | "Be detailed & professional" | "You figure it out" |

## User Journey

```
Afke books wedding gig
     ↓
Organizer asks for "technical requirements"
     ↓
Afke goes to miked.live
     ↓
Chooses "Quick Rider" (2 min vs 20 min)
     ↓
Answers 4 questions: band name, contact, instruments, venue
     ↓
Gets one-page PDF
     ↓
Shares with organizer
     ↓
Organizer shares with wedding sound engineer
     ↓
Engineer reads: "Drums, Bass, 2 Guitars, Vocals, contact Afke"
     ↓
Engineer calls Afke if questions (no email loop)
     ↓
Afke shows up ready to play
     ↓
Sound engineer has gear + contact person = setup successful ✓
```

## No-Login for Engineers

Engineer doesn't need to:
- Create account
- Download PDF from email
- Wait for email delivery

Just gets:
- Clear, simple one-page rider
- Afke's direct phone number
- Can call immediately

## Accessibility Features

✅ Large, readable text
✅ High contrast (emerald/blue theme)
✅ Emoji for visual clarity (🥁 = drums)
✅ One question per screen = no overwhelm
✅ Auto-focus on input fields
✅ Keyboard-navigable

## Implementation Notes

### Form Validation
- Band name: required, non-empty
- Contact name: required
- Contact email: required, valid email
- Contact phone: optional
- Instruments: at least one selected

### Time Tracking
- `startTime` set when entering step1
- Displayed at completion
- Shows how effectively UI meets "< 3 min" goal

### PDF Generation
Real implementation would use:
- jsPDF + html2canvas (existing in codebase)
- Single A4 page layout
- Print-friendly CSS (B&W, no colors)
- Client-side generation (no server needed)

### Share Integration
After download, user clicks "Share Rider"
- Sends via email to organizer
- Or copy shareable link
- Engineer gets link, views PDF, has direct contact

## What This Solves

### Pain Points (ICP-2)
❌ "I don't know what 'input channels' are"
✓ No technical terms asked

❌ "This form is too long and confusing"
✓ 4 simple questions

❌ "I want direct contact with engineer, not through booker"
✓ Direct phone/email included

❌ "I need this done ASAP, I have a gig tomorrow"
✓ 2 minute completion

❌ "The PDF should look professional"
✓ Clean, minimal one-pager

## Metrics to Track (Phase 1 Validation)

- **Completion rate:** % of users who start → finish
- **Completion time:** Target < 3 min (should show in mockup)
- **Drop-off points:** Which step has highest exit rate
- **Instrument selection:** Most common combinations
- **Phone inclusion:** % of users providing direct phone

## Next Steps

### Future Enhancements (Phase 2+)
- [ ] SMS notifications (engineer texts Afke directly)
- [ ] Voice recording option ("Tell us about your setup")
- [ ] Photo upload (show band, equipment)
- [ ] Generate shareable link (instead of download)
- [ ] Track when engineer views rider

### Integration with Full System
- Quick Rider generates PDF immediately
- Can be shared via link (no account)
- Engineer can comment on the one page
- Afke gets notifications: "Engineer viewed at 2:15pm"
- If questions, engineer calls Afke directly

---

**Mockup Date:** February 25, 2026
**Status:** Interactive prototype for UC-2 feedback
**Target User:** Non-technical weekend musicians
**Completion Time Goal:** < 3 minutes ✓
