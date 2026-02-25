Ideal Customer Profiles & Use Cases — Miked.live
Overview
Dit document beschrijft de vier primaire gebruiker-profielen van Miked.live en vijf concrete scenario's waarin het product waarde toevoegt. De ICPs zijn gedefinieerd op basis van technische kennis en rol, niet alleen op functie.

🎯 Ideal Customer Profiles (ICPs)
ICP-1: De Gear-Bewuste Muzikant
Profiel
* Muzikant met gedeeltelijke technische kennis
* Weet precies welke mics hij voor sommige instrumenten wil (bijv. SM57 op gitaar-amp)
* Kent niet alle technische details (bijv. welke overheads voor drums, DI vs. miked bass)
* Wil zelf bepalen wat hij kan, maar de rest aan professionals overlaten
Trigger
* Gig bij een venue die om een professionele rider vraagt
* Wil de geluidstechnicus precies communiceren wat hij nodig heeft
Doelen
* Professioneel communiceren zonder underspecificatie (="te vague") of overspecificatie (="ik weet het niet")
* Tijd besparen t.o.v. Word document bijwerken
* Zeker zijn dat zijn specifieke gear-eisen overkomen
Frustraties
* Huidige tools dwingen hem keuzes te maken die hij niet begrijpt
* Geen optie om "ik weet het niet" in te vullen voor bepaalde velden
* Ambiguïteit: moet hij alles uitspecificeren of mag hij dingen laten?
Product Value
* Tool moet onderscheid maken tussen "ik ben zeker van deze keuze" en "dit is standaard, maar ik vertrouw op de engineer"
* Dropdown opties, maar ook "Use default / Ask engineer" optie
* Duidelijke UI dat bepaalde velden optional zijn

ICP-2: De Breng-en-Speel Muzikant
Profiel (Afke's profiel)
* Klein of hobbyist-bandje (weekend-muzikanten)
* Weet niet welke input channels, microphones, of DI setups nodig zijn
* "Wij brengen onze spullen, de geluidsman verzint de rest"
* Geen tijd/interesse om deep te gaan in audio-techniek
Trigger
* Klein optreden geboekt, organisator vraagt om technische informatie
* Wil snel iets professioneel kunnen versturen zonder uren in te steken
Doelen
* Zo snel mogelijk een rider hebben zonder technische diepgang
* Bandleden en spullen communiceren — verder niks
* Directe communicatie met de geluidstechnicus openen (in plaats van via booker/miscommunicatie)
Frustraties
* "Ik weet niet welke input channels we hebben — laat dat aan de sound guy over"
* Miscommunicatie: wil geluidsman contacteren maar gaat door booker (organizer)
* Te veel opties/vragen in de wizard — voelt overweldigend
* Geen directe kanaal naar de engineer
Product Value
* "Simple mode": alleen bandleden + instrumenten + contact info
* Geen technische details vereist (mics, DI, specifieke instellingen)
* Optie om direct contact-info met engineer in te vullen (email, phone)
* Snelle "30 seconden" wizard met minimale vragen

ICP-3: De Band-Coördinator
Profiel (Lars's profiel)
* Neemt organisatie-rollen op zich voor de band (niet altijd de meest technische persoon)
* Stuurt riders naar venues, beheert pre-show communicatie
* Wil bandleden kunnen betrekken bij het invullen van de rider
* Wil feedback van de geluidstechnicus terugkrijgen
Trigger
* Meerdere gigs per maand; pre-show workflow moet stroomlijnen
* Wil bandleden kunnen zeggen "voeg mij toe" i.p.v. alles zelf in te vullen
* Wil weten dat rider goed aankomt en wat engineer ervan denkt
Doelen
* Rider maken en updaten zonder eindeloos heen-en-weer via email
* Bandleden inschakelen (zelf hun info invullen, feedback geven)
* Direct contact met geluidstechnicus; bevestiging dat rider goed aankomt
* Uiteindelijk: niet een statisch PDF, maar een "living document"
Frustraties
* Stage plot is leeg overlay confusing
* Bandleden niet allemaal in het midden — placement voelt willekeurig
* "Dit is te groot een stap voor een low-key rider"
* Geen communicatie-kanaal in de tool zelf: wil gekleurde comments van bandleden, manager, venue, engineer
* Geen ontvangstbevestiging — weet niet of engineer het pdf gelezen heeft
Product Value
* Collaborative editing (bandleden kunnen bijdragen)
* Rider preview met WYSIWYG-editor (bewerkingen direct zichtbaar in PDF)
* In-tool communicatie: gekleurde comments per rol (band, manager, venue, engineer)
* Notification: "Engineer has viewed your rider" / confirmation flow
* Back-and-forth communicatie zonder email

ICP-4: De Geluidstech / FOH Engineer
Profiel
* Freelance soundman of vaste venue-technician
* Expert in audio
* Ontvangt riders van bands; moet voorbereiding treffen voor de show
* Prints riders op slechte printers (zwart-wit, low-res)
Trigger
* Band stuurt rider voor gig dit weekend
* Moet weten: hoeveel inputs, welke instrumenten, welke specificaties
Doelen
* Snel begrijpen: hoeveel inputs? Welke instrumenten? Welke gear hebben ze?
* Voorbereiding treffen (mixer channels labelen, presets loaderen, etc.)
* Geen verrassingen op gig-dag
Frustraties
* Bands geven geen rider, of incomplete riders
* "3D rendering met schaduwen = visuele ruis; ik wil alleen essentiële info"
* Print-kwaliteit: 3D graphics en kleur rendering werkt slecht op slechte printers
* Pedaalbord plaatsing is niet relevant — wil: power drops, niet "gitarist staat hier met pedalboard"
* Stageplots waar monitoren niet duidelijk gericht zijn (geen pijlen)
* Stageplots waar dimensions niet matchen (zeggen 5m breed maar het ziet er anders uit)
Citaat (Reddit)
"As an engineer, I want the least amount of information possible while still having everything I need. 3D renderings of band members who cast shadows is all visual noise that distracts from bulletproof, unmistakeable communication. The product needs to work well when printed on the world's shittiest black and white printer."
Product Value
* Printable, clean PDF (high contrast, no unnecessary 3D elements)
* Essential info only: input list, top-down stage plot, power drops
* Clear directionality (monitor arrows, speaker directions)
* Stage dimensions that actually correspond to visual representation
* Ability to print in B&W and still be readable

📋 Use Cases
UC-1: Rider Maken met Gedeeltelijke Technische Kennis
Primaire ICP: ICP-1 (De Gear-Bewuste Muzikant)
Scenario
Matthijs speelt gitaar in een lokale rockband. Ze hebben volgende maand een gig in een venue waarvan ze nog nooit hebben gehoord. De booker vraagt om een technical rider. Matthijs weet dat zijn gitaar-amp altijd een SM57 nodig heeft, maar hij weet niet wat de drummer en bassist precies willen. Hij wil snel iets kunnen versturen, maar ook zeker weten dat zijn specifieke eisen duidelijk zijn.
Actoren
* Matthijs (gitarist, gear-bewust)
* Tool
* Booker (ontvangt rider)
* Geluidstechnicus (later)
Happy Path
1. Matthijs opent Miked.live en kiest "Create New Rider"
2. Voegt zijn bandleden toe + instrumenten (drums, bass, 2x gitaar, vocals)
3. Bij elke instrument ziet hij standaard mic-keuzes (bijv. SM57 voor gitaar-amp)
4. Voor zijn gitaar: hij wijzigt SM57 → "SM57 (bepaald)" — committed choice
5. Voor drums/bass: hij laat standaard staan maar ziet optie "Ask Engineer" — niet committed
6. Voegt stage plot toe, contact info
7. Download PDF
8. PDF toont duidelijk: "Gitaar: SM57 (specified) | Drums: Standard Mics (check with engineer)" — geen ambiguïteit
Product-Gaps Opgelost
* ✅ Tool onderscheidt "ik ben zeker" vs. "dit is standaard"
* ✅ UI maakt duidelijk welke keuzes optional zijn
* ✅ Duidelijke UI voor "Ask Engineer" velden
* ✅ PDF toont beide clearly
Pijnpunten uit Feedback
* "Weet welke mics voor sommige instrumenten, niet voor alle"

UC-2: Simpele Rider — "Wij Brengen Dit, Jij Verzint de Rest"
Primaire ICP: ICP-2 (De Breng-en-Speel Muzikant)
Scenario
Afke speelt drums in Blauw Lint, een 4-pieces coverband. Ze hebben dit weekend een bruiloft. De trouworganisator vraagt naar "technical requirements". Afke weet niet eens wat "input channels" zijn. Ze wil gewoon zeggen "we have drums, bass, 2 guitars, and vocals — the sound guy can figure out the details." Ze wil ook kunnen zeggen "here's my number, call me" i.p.v. via de disorganisator.
Actoren
* Afke (drummer)
* Blauw Lint (band)
* Trouworganisator (vraagt om info)
* Huwelijksgeluidstechnicus (doet sound)
Happy Path
1. Afke gaat naar Miked.live → "Quick Rider" mode
2. Vraag 1: "Wat heet je band?" → "Blauw Lint"
3. Vraag 2: "Wie moet de sound engineer contacteren?" → "Afke, 06-12345678, afke@email.com"
4. Vraag 3: "Welke instrumenten hebben jullie?" → Checkboxes: Drums ✓, Bass ✓, Electric Guitar ✓ x2, Vocals ✓
5. Vraag 4: "Contact info voor venue/organizer?" → [contact info]
6. Done → Download eenvoudige, 1-pagina rider: "Blauw Lint | Contact: Afke | Instruments: Drums, Bass, 2x Guitar, Vocals | For more details, contact Afke directly"
7. PDF is printable, clean, heeft geen "Input Channel 1: SM57" — alleen instrument list
Product-Gaps Opgelost
* ✅ "Simple mode": geen technische vragen
* ✅ Directe contact-info voor engineer (niet via booker)
* ✅ Snelle, gestroomlijnde wizard
* ✅ 1-pagina output (niet overweldigend)
Pijnpunten uit Feedback
* "Ik weet niet welke input channels we hebben — laat dat aan de sound guy over"
* "Wil de sound guy kunnen contacteren, vaak gaat dat via de booker → miscommunicatie"

UC-3: Rider Coördineren met Meerdere Bandleden
Primaire ICP: ICP-3 (De Band-Coördinator)
Scenario
Lars is de zanger en organiseert technische zaken voor zijn band. Hij wil dat drummer Piet, bassist Rob en gitarist Tom hun eigen info invullen (mics, gear notes) i.p.v. dat Lars alles moet uitvragen en intypen. Halverwege willen ze de stage plot nog aanpassen — Rob wil een risotto (haha), en ze willen de feedback van de engineer horen.
Actoren
* Lars (band-coördinator, zang)
* Piet (drummer)
* Rob (bassist)
* Tom (gitarist)
* Geluidstechnicus (ontvangt rider, geeft feedback)
Happy Path
1. Lars maakt een rider aan op Miked.live
2. Voegt Piet, Rob, Tom toe
3. Stuurt share-link naar Piet: "Piet, vul je drums-info in"
4. Piet ontvangen link → "You've been invited to contribute to Blauw Lint's rider"
5. Piet voegt drums in (drum kit, welke overheads, kick mic, etc.)
6. Rob ontvangt link → vult bass-setup in
7. Tom ontvangt link → vult guitar setup in
8. Lars ziet realtime updates → "Piet added drums" | "Rob added bass" | "Tom added guitar"
9. Lars voegt stage plot toe, uploadt logo
10. Lars wil feedback van engineer → Voegt engineer's email toe als "Viewer + Comment"
11. Linkt de rider naar engineer: "Please review and add any notes"
12. Engineer ziet rider → Kan opmerkingen toevoegen in kleur (bijv. "We don't have overheads, use mains miking" in rood)
13. Lars ziet comments → Kan antwoorden, aanpassingen doen
14. Notification: "Engineer has viewed your rider" ✅
15. Back-and-forth totdat iedereen aligned
16. Download final PDF met comments/notes geresolved
Product-Gaps Opgelost
* ✅ Collaborative editing (bandleden kunnen bijdragen)
* ✅ Real-time updates
* ✅ Gekleurde comments per rol (bandlid, engineer, etc.)
* ✅ View/comment permissions (niet iedereen kan alles aanpassen)
* ✅ Notifications ("Engineer has viewed")
* ✅ Back-and-forth communicatie in de tool
Pijnpunten uit Feedback (Lars)
* "Communicatie tussen bandleden en geluidstechnicus"
* "WYSIWYG editor vanuit rider preview"
* "Bevestiging na verzenden, directe communicatie met audio engineer"
* "Comments in kleuren vanuit elke persoon (bandlid, manager, venue, engineer)"

UC-4: Rider Delen en Communiceren met Geluidstechnicus
Primaire ICP: ICP-3 (Band-Coördinator) + ICP-4 (Engineer)
Scenario
Lars's band heeft een gig volgende donderdag. Hij stuurt een rider-link naar de geluidstechnicus (via email). De engineer opent de link, ziet het stage plot, input list, en technische notes. Geen visuele ruis, alles printable. Engineer ziet dat monitors niet duidelijk gericht zijn → voegt comment toe in rood: "Need to clarify monitor directions — are these wedges facing the band or out to the crowd?" Lars ziet notification, gaat terug naar stage plot, voegt monitor-pijlen toe. Engineer gedownload het PDF voor zijn voorbereiding.
Actoren
* Lars (band-coördinator)
* Engineer (sound tech)
* Tool
Happy Path
1. Lars finaliseert rider, klikt "Share with Sound Engineer"
2. Voert engineer's email in
3. Email gestuurd naar engineer: "Here's the rider for your event on [date]" + magic link
4. Engineer klikt link → rider opent read-only, maar met comment-optie
5. Engineer ziet:
    * Input list (clear, minimal)
    * Stage plot (top-down, no 3D shadows)
    * Power drop locations (clear markers)
    * Monitor positions (with arrows/directions)
6. Engineer leest, denkt "Monitor directions aren't clear" → adds comment in red: "🔴 Need to clarify monitor directions"
7. Notification to Lars: "Engineer left a comment on your rider"
8. Lars gaat terug, ziet comment, voegt monitor-pijlen toe
9. Engineer gedownload het finale PDF → afdrukken op slechte printer → alles leesbaar ✅
Product-Gaps Opgelost
* ✅ Sharable link (no account, no login)
* ✅ Comment functionality (gekleurde comments)
* ✅ Clean, printable design (B&W friendly)
* ✅ Clear directionality (monitor arrows)
* ✅ Notifications (Lars weet dat engineer het heeft gelezen)
* ✅ Iterative refinement
Pijnpunten uit Feedback
* "Monitors hebben pijlen nodig om richting duidelijk te maken"
* "Stage dimensions vertalen niet naar de plot"
* "The product needs to work on a shitty black and white printer"

UC-5: Rider Ontvangen en Verwerken als Engineer
Primaire ICP: ICP-4 (De Geluidstech / FOH Engineer)
Scenario
Geluidstech Michiel ontvangt 3 riders per week van bands. Hij wil elk PDF snel kunnen scannen, begrijpen hoeveel inputs, welke instrumenten, en wat specials. Hij print ze op de printer op de venue (zwart-wit, average quality). Hij wil geen 3D figuren met schaduwen — enkel essentiële info. One rider gaat naar zijn digitale mixer, waar hij channels pre-names, presets voorbereidt.
Actoren
* Engineer Michiel
* Various bands
* Tool
Happy Path
1. Band stuurt rider link
2. Michiel klikt → rider opent (no login required)
3. Ziet top-down stage plot (clean, no 3D shadows)
4. Ziet input list tabel:Instrument | Mic/DI | Notes
5. ------|-------|-------
6. Kick Drum | D112 | (standard)
7. Snare | SM57 | on top
8. Vocal | SM58 | high stand
9. 
10. Ziet power drop locations marked on stage plot (X symbols, labeled)
11. Ziet monitor positions with direction arrows → knows exactly where to place wedges
12. Dowloads PDF → goes to printer → comes out clean and readable in B&W ✅
13. Imports rider info into his digital mixer:
    * Renames input channels: "Kick", "Snare", "Vocal", etc.
    * Creates presets for common instruments
14. Prepares for soundcheck (faster, fewer surprises)
Product-Gaps Opgelost
* ✅ Minimal, essential info (no pedal board placements, no decorative 3D)
* ✅ Printable on bad printer (B&W, high contrast)
* ✅ Clear input list (easy to scan)
* ✅ Power drops marked (not "pedalboard here" — just "power outlet needed")
* ✅ Monitor directionality clear (arrows on stage plot)
* ✅ Stage dimensions accurate
* ✅ No login required (just click and view)
Pijnpunten uit Feedback
* "No visual noise — 3D shadows distract from clear communication"
* "Must print on terrible printer"
* "Power drops, not pedalboard placements"
* "Monitor direction arrows"
* "Stage dimensions that actually match the visual"

🛠 Product-Gap Summary
High Priority (Meerdere ICPs / Use Cases)
Gap	Impact	Related UC
Collaborative editing (bandleden invullen)	Essential voor ICP-3 & UC-3	UC-3
Comments & annotations (gekleurde)	Essential voor feedback-loop	UC-3, UC-4
Notifications & confirmation flow	ICP-3 wil weten dat engineer het gelezen heeft	UC-3, UC-4
Simple/Quick mode (geen technische vragen)	Essential voor ICP-2	UC-2
B&W printable, no 3D noise	Essential voor ICP-4	UC-5
Direct engineer contact (no booker)	Key for ICP-2	UC-2
Clear monitor directionality (arrows)	Feedback from engineers	UC-4, UC-5
Power drops, not pedalboard placements	Feedback from engineers	UC-5
Medium Priority
Gap	Impact	Related UC
"Specified" vs. "Standard" distinction	ICP-1 clarity	UC-1
Stage dimensions accuracy	Trust & usability	UC-5
WYSIWYG editor in preview	ICP-3 workflow	UC-3
Rotate items on stage plot	Reddit feedback	Various
Non-rectangular stage shapes	Feedback from users	Various
Logo distortion on export	Karsten feedback	All
Lower Priority
Gap	Impact	Related UC
More diverse character skins	Inclusivity	Branding
Searchable dropdowns	UX polish	Various
Mic library / dropdown	Feedback from Reddit	ICP-1, UC-1
Detailed timings section	Niche use case	Specific events
📊 Key Insights
1. ICP-1 & ICP-2 are different: Partial-knowledge musicians need different UX than "just tell me what to do" musicians. Don't force both into the same wizard.
2. ICP-3 is the growth vector: Band coordinators are the ones who:
    * Use the tool most frequently
    * Interact with venues repeatedly
    * Benefit most from collaboration & communication features
    * Could drive network effects (band → engineer → venue)
3. ICP-4 is the validator: If engineers think the rider is useless or full of noise, bands won't use it. Prioritize print-quality, clarity, and essential-info-only.
4. The rider is not the end-goal; it's the start of a conversation: Multiple sources (Lars, Reddit threads) emphasize that a good rider starts communication, not replaces it. Miked.live's opportunity: be the communication hub, not just a PDF generator.
5. Two types of riders exist: Contractual riders (what the venue provides) vs. Band riders (stage plot + input list + technical notes). Miked.live focuses on band riders — this is correct.
6. Power drops vs. Gear placement: Engineers care about electricity locations, not where a guitarist stands with a pedalboard. Simplify the stage plot mental model.

🎬 Next Steps
* Prioritize: Simple mode for ICP-2, collaborative editing for ICP-3
* Design: Separate UX flows for different ICPs (don't force one wizard for everyone)
* Test: Validate with real users from each ICP
* Iterate: Based on feedback, refine communication/collaboration features
