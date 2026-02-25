Plan: Bouw & Validatie Stappenplan — Miked.live
Context
Op basis van de ICPs en use cases (docs/icp-and-use-cases.md) en analyse van de huidige codebase.
Doel: een iteratieve roadmap die afwisselt tussen bouwen en valideren, afgestemd op substantieel beschikbaar tempo (meerdere dagen per week, niet full-time).
Bestaande Architectuur (relevant voor planning)
* State: localStorage via useRiderState hook → RiderProvider (globaal)
* Wizard: 4-stap lineaire flow: /band → /stage → /details → /rider-preview
* Sharing: Magic link systeem + share_token voor guests — al gebouwd
* Analytics: PostHog (productie only) — step_viewed en download_initiated nog niet geïmplementeerd
* Database: Supabase (riders, magic_links, subscribers tabellen)
* PDF: jsPDF + html2canvas (A4, multi-page)
* Geen collaborative editing of comments — bestaat nog niet

Aanpak: Iteratieve Sprints
Elke fase heeft een doel, deliverables, en een validatiecheck voordat de volgende fase begint.

Phase 0 → Phase 1 → Validate → Phase 2 → Validate → Phase 3 → Validate → Phase 4+

Phase 0: Valideer de ICPs (1-2 weken)
Doel: Bevestigen dat de ICPs kloppen voordat er gebouwd wordt. Voorkom dat je voor de verkeerde gebruiker bouwt.
Acties
0.1 — Voer 4-6 gebruikersgesprekken (20 min elk)
Nodig 1-2 mensen uit elk ICP:
ICP	Wie te vinden
ICP-1 (Gear-Bewuste Muzikant)	Muzikanten in je netwerk die technische shows spelen
ICP-2 (Breng-en-Speel)	Weekend-muzikanten, coverbandleden
ICP-3 (Band-Coördinator)	Bandleiders, managers
ICP-4 (Engineer)	FOH engineers, studio-geluidstechnici
Vragen per gesprek:
* "Hoe maak je nu een rider?" (huidig gedrag)
* "Waar gaat het mis?" (pijnpunten)
* "Wat zou je in 30 seconden willen kunnen sturen?" (minimal viable rider)
* Laat ze de huidige tool gebruiken → observeer waar ze vastlopen
0.2 — 5-second test op de landing page
* Stuur landing page naar 5-10 mensen die jou niet kennen
* Vraag: "Wat doet dit product?" — controleer of de value prop duidelijk is
0.3 — Analyseer bestaande drop-off
* Kijk in PostHog: op welke stap haken gebruikers af? (via rider_link_accessed en rider_downloaded events)
* Hoeveel riders worden afgemaakt vs. gestart?
Validatiecheck ✓
* Ken je de top-3 pijnpunten per ICP?
* Welk ICP is het grootst / meest urgent?
* Weet je op welke stap de wizard het meest verloren gaat?

Phase 1: Quick Wins — Polish & Print Quality (2-3 weken)
Doel: Laaghangend fruit dat ICP-4 (engineer) direct verbetert en vertrouwen opbouwt bij ICP-1/2.
Acties
1.1 — Fix bekende bugs
* Logo vervormd bij export (app/api/riders/save/route.ts, html2canvas config)
* Line breaks niet zichtbaar in preview (Tiptap → PDF rendering)
1.2 — B&W Print Optimalisatie
* PDF export: verwijder 3D schaduwen en kleur-afhankelijke elementen
* Zorg dat input list tabel leesbaar is in zwart-wit
* Test: print op slechte printer → alles leesbaar?
* Relevante bestanden: components/Preview.tsx, jsPDF configuratie
1.3 — Standaard Top-Down View
* Stage plot opent default in Top View i.p.v. 3D Isometric
* Isometric blijft beschikbaar als optie
* Relevante bestanden: app/stage/page.tsx, stage canvas component
1.4 — Monitor Pijlen op Stage Plot
* Voeg richtingsindicator toe aan monitor-objecten in de stage canvas
* Engineer wil direct zien welke kant monitors op staan
* Relevante bestanden: Three.js stage objects, monitor component
1.5 — PostHog step_viewed tracking toevoegen
* Voeg step_viewed events toe per wizard-stap (staat al in CLAUDE.md als gewenste events)
* Zodat je drop-off per stap kunt meten
* Relevante bestanden: app/band/page.tsx, app/stage/page.tsx, app/details/page.tsx
Validatiecheck ✓
* Test PDF uitprinten: leesbaar in B&W?
* Stuur gebouwde rider naar een engineer (ICP-4) → feedback?
* Bekijk PostHog: zijn step_viewed events nu beschikbaar?

Phase 2: Simple Mode voor ICP-2 (3-4 weken)
Doel: Een "Quick Rider" mode die ICP-2 (de niet-technische muzikant) door de wizard leidt zonder technische vragen.
Acties
2.1 — Entry Point: Mode Keuze op Landing Page
* Twee knoppen: "Quick Rider (5 min)" en "Full Rider (met stage plot)"
* Sla mode-keuze op in localStorage (riderMode: 'quick' | 'full')
* Relevante bestanden: app/page.tsx
2.2 — Quick Mode Wizard
Vereenvoudigde stappen:
1. Stap 1: Wat heet je band?
2. Stap 2: Welke instrumenten? (alleen checkboxes, geen mic-keuzes)
3. Stap 3: Contact info (naam + email + optioneel telefoon)
4. Download → 1-pagina PDF: band naam, instrument list, contact info
Geen stageplots, geen input channels, geen mic details.
* Relevante bestanden: Nieuwe app/band-quick/page.tsx of toggle in app/band/page.tsx
2.3 — Standaard Contact Info voor Engineer
* Veld: "Engineer mag mij direct contacteren op: [email/telefoon]"
* Vermijd communicatie via booker/organisator
* Toevoegen aan types.ts (bijv. details.engineerContact)
2.4 — Bestaande Wizard Onveranderd
* Full mode = huidige wizard, exact als nu
* Geen refactoring van bestaande flow nodig
Validatiecheck ✓
* Laat ICP-2 gebruiker Quick Mode doorlopen: hoe lang duurt het?
* Target: < 3 minuten van start tot PDF download
* Vraag: "Zou je dit sturen naar een organisator?" → ja/nee + waarom

Phase 3: Rider Bekeken Notificatie (2-3 weken)
Doel: ICP-3 (coördinator) weet wanneer de engineer de rider heeft geopend. Vertrouwen opbouwen.
Acties
3.1 — Track Rider Opens
* Bij GET /api/riders/[riderId] → sla last_viewed_at en view_count op in Supabase
* Schema update: voeg view_count INT DEFAULT 0, last_viewed_at TIMESTAMPTZ toe aan riders tabel
* Relevante bestanden: app/api/riders/[riderId]/route.ts
3.2 — Email Notificatie aan Owner
* Wanneer een guest (share_token) de rider opent → stuur email aan owner: "Jouw rider is bekeken"
* Via Resend (al geconfigureerd: lib/resend.ts)
* Alleen sturen bij eerste of na 24-uur-window (niet spammen)
3.3 — Rider Status in Owner View
* Op /riders/[riderId] voor owner: toon "Bekeken op [datum]" of "Nog niet bekeken"
* Eenvoudige UI indicator
* Relevante bestanden: app/riders/[riderId]/page.tsx
3.4 — Download Initiatie Tracking
* Voeg download_initiated PostHog event toe (staat al in CLAUDE.md als gewenste event)
* Relevante bestanden: components/Preview.tsx
Validatiecheck ✓
* Stuur rider-link naar engineer → ontvang je email als owner wanneer ze het openen?
* Checkt ICP-3 de status? (observeer gedrag)

Phase 4: Annotation & Feedback van Engineer (4-6 weken)
Doel: Engineer kan opmerkingen achterlaten; coördinator ziet ze; back-and-forth zonder email.
Acties
4.1 — Comment Systeem in Supabase
Nieuw schema:

CREATE TABLE rider_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id UUID REFERENCES riders(id) ON DELETE CASCADE,
  author_role TEXT NOT NULL, -- 'band', 'engineer', 'venue', 'manager'
  author_name TEXT,
  content TEXT NOT NULL,
  color TEXT NOT NULL, -- bijv. '#EF4444' (rood voor engineer)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
4.2 — Nieuwe API Routes
* POST /api/riders/[riderId]/comments — voeg comment toe (auth via share_token of cookie)
* GET /api/riders/[riderId]/comments — haal comments op
4.3 — Comment UI in Rider View
* Floating comment panel aan de zijkant van /riders/[riderId]
* Per comment: gekleurde badge (rol-kleur), naam, tekst, datum
* Textarea + submit knop voor guest (engineer/venue) en owner (band)
4.4 — Email Notificatie bij Nieuw Comment
* Band ontvangt email wanneer engineer comment plaatst (en vice versa)
* Via Resend
Validatiecheck ✓
* Test met echte engineer (ICP-4): voegt hij opmerkingen toe?
* Test met coördinator (ICP-3): ziet hij de comments, reageert hij?
* Werkt de back-and-forth zonder dat iemand email hoeft te openen?

Phase 5: Collaborative Editing (6-8 weken, future)
Doel: Bandleden kunnen hun eigen info invullen zonder dat de coördinator alles handmatig invoert.
Aanpak (high-level)
* "Invite band member" → stuur magic link per lid
* Lid opent link → ziet alleen zijn/haar eigen sectie (instrument, mic, notes)
* Vult in → opgeslagen in Supabase
* Coördinator ziet realtime updates
Dit is de meest complexe fase en vereist:
* Per-member edit permissions
* Async merge van ingevoerde data
* Conflict-resolution (wat als twee mensen tegelijk iets wijzigen)
Beslissing: Start Phase 5 alleen na succesvolle validatie van Phase 4.

Prioriteitsmatrix

IMPACT
  ↑
  │   [Phase 2]        [Phase 4]
  │   Simple Mode      Comments
  │
  │   [Phase 1]        [Phase 3]
  │   Polish/Print     Notificaties
  │
  └─────────────────────────────→ EFFORT
       Klein                  Groot

Bestanden met Hoge Relevantie
Bestand	Functie	Relevant voor
app/page.tsx	Landing page, entry point	Phase 2 (mode keuze)
app/band/page.tsx	Stap 1 wizard	Phase 2 (quick mode)
app/stage/page.tsx	Stage canvas	Phase 1 (top view default, monitor arrows)
components/Preview.tsx	PDF preview & download	Phase 1 (B&W), Phase 3 (tracking)
app/api/riders/save/route.ts	Save & magic link	Phase 3 (view tracking)
app/api/riders/[riderId]/route.ts	Fetch rider	Phase 3 (view count)
app/riders/[riderId]/page.tsx	Owner/guest view	Phase 3 & 4 (status, comments)
lib/resend.ts	Email sending	Phase 3 & 4 (notificaties)
types.ts	Data types	Alle phases (schema updates)
Verificatie per Phase
Phase	Klaar als...
0	4-6 interviews gedaan, top pijnpunten per ICP bekend
1	PDF leesbaar in B&W, bugs gefixed, PostHog step_viewed actief
2	ICP-2 test: < 3 min van start tot PDF download
3	Owner ontvangt email wanneer guest rider opent
4	Engineer plaatst comment → band ontvangt notificatie → terug-en-neer werkt
5	Bandlid vult eigen info in via magic link → merge in coördinator's rider
User approved the plan

Perfect! Ik heb een gedetailleerd bouw & validatie stappenplan gemaakt. Hier's het overzicht:
🗺️ Stappenplan: 5 Fases
Phase 0: Validatie van ICPs (1-2 weken)
* 4-6 gebruikersgesprekken (1-2 per ICP)
* A/B test op landing page
* Analyseer drop-off in PostHog
* ✓ Klaar als: Je kent de top-3 pijnpunten per ICP
Phase 1: Quick Wins — Polish & Print (2-3 weken)
* Fix bugs: logo vervorming, line breaks
* B&W print-optimalisatie (engineers willen zwart-wit afdrukken!)
* Standaard Top-Down view voor stage plot
* Monitor pijlen toevoegen
* PostHog step_viewed tracking
* ✓ Klaar als: PDF leesbaar in B&W geprint, bugs gefixed
Phase 2: Simple Mode voor ICP-2 (3-4 weken)
* "Quick Rider" knop op landing: 5 min, geen technische vragen
* Simpel wizard: band naam → instrumenten → contact info
* Direct engineer contact (telefoon/email) zonder booker
* ✓ Klaar als: ICP-2 test < 3 minuten van start tot PDF
Phase 3: "Rider Bekeken" Notificatie (2-3 weken)
* Track rider opens in Supabase (view_count, last_viewed_at)
* Email aan owner wanneer engineer rider opent
* Status indicator in owner view
* PostHog download_initiated tracking
* ✓ Klaar als: Owner ontvangt email bij rider open
Phase 4: Engineer Feedback & Comments (4-6 weken)
* Nieuw rider_comments tabel in Supabase
* Comment UI met gekleurde rollen (engineer=rood, etc.)
* Email notificatie bij nieuw comment
* Back-and-forth zonder email
* ✓ Klaar als: Engineer plaatst comment → band reageert in-tool
Phase 5: Collaborative Editing (6-8 weken, future)
* "Invite bandleden" → magic links per member
* Lid vult eigen info in (instrument, mics, notes)
* Coördinator ziet realtime updates
* Start alleen na succesvolle Phase 4

📊 Prioriteitsmatrix

IMPACT
  ↑
  │   [Phase 2]        [Phase 4]
  │   Simple Mode      Comments
  │   (ICP-2)          (ICP-3)
  │
  │   [Phase 1]        [Phase 3]
  │   Polish/Print     Notificaties
  │   (ICP-4)          (ICP-3)
  │
  └─────────────────────────────→ EFFORT

🎯 Key Insights
1. Start met validatie (Phase 0) — zorg dat je voor de juiste ICP bouwt
2. Phase 1 is laaghangende vrucht — engineers (ICP-4) voelen direct verbetering
3. Phase 2 is groei-vector — ICP-2 (niet-technische bandjes) is groot potentieel
4. Phase 3 & 4 = het "levend document" concept — rider is niet eindstation, maar start van gesprek
5. Phase 5 is de moeilijkste — collaborative editing; start alleen als 1-4 succesvol zijn

Het plan staat opgeslagen in /Users/rikdewit/.claude/plans/robust-watching-lantern.md. Wil je nu starten met Phase 0 (user interviews), of begin je liever met Phase 1 (bugs fixen)?
