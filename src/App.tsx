import { useEffect, useRef, useState } from 'react'
import type { ReactNode, RefObject } from 'react'

type View = 'entry' | 'discovery' | 'detail' | 'states'
type StateMode = 'loading' | 'empty' | 'error'
type TransitionDirection = 'forward' | 'reverse'

type TransitionRequest = {
  id: number
  target: View
  direction: TransitionDirection
}

type Factor = {
  name: string
  value: number
  note: string
}

type RideContext = {
  category: string
  community: string
  interested: number
  ridesAvailable: number
  ridesNeeded: number
  distance: string
  pickup: string
}

type Opportunity = {
  id: string
  rank: string
  title: string
  event: string
  timing: string
  location: string
  interpretation: string
  score: number
  confidence: 'High' | 'Moderate'
  source: string
  limitation: string
  factors: Factor[]
  demo?: boolean
  rideContext?: RideContext
}

type MockContact = {
  initials: string
  name: string
  designation: string
  phone: string
  role: string
  route: string
  demoNote: string
}

const mockContact: MockContact = {
  initials: 'AM',
  name: 'Arjun Mehta',
  designation: 'Software Engineer · Bengaluru',
  phone: '+91 90000 12345',
  role: 'Event Host',
  route: 'Indiranagar - Koramangala',
  demoNote: 'Demo contact · not a real phone number',
}

const opportunities: Opportunity[] = [
  {
    id: 'indiranagar-mohit-arijit-demo',
    rank: '01',
    title: 'Live Music Night by Mohit Chauhan & Arjit Singh — Indiranagar',
    event: 'Illustrative two-star live set · Mohit Chauhan + Arijit Singh · Indiranagar community stage',
    timing: 'Oct 25 · 19:30–22:30',
    location: 'Indiranagar · 100 Feet Road',
    interpretation:
      'A sample evening concert context puts nearby students and young professionals around the same Indiranagar destination, with 86 people interested, 31 ride requests, and 18 community seats open for coordination.',
    score: 90,
    confidence: 'Moderate',
    source: 'FellaRide demo scenario · illustrative lineup, not an announced booking',
    limitation: 'Mohit Chauhan and Arijit Singh are not presented as a confirmed event pairing.',
    demo: true,
    rideContext: {
      category: 'Music / Concert',
      community: 'Indiranagar student + young professional community',
      interested: 86,
      ridesAvailable: 18,
      ridesNeeded: 31,
      distance: '4.8 km from local community',
      pickup: 'Indiranagar Metro · 100 Feet Road',
    },
    factors: [
      { name: 'Audience context', value: 91, note: 'Two recognizable performers create a strong illustrative evening draw.' },
      { name: 'Location context', value: 88, note: 'Indiranagar venues and Metro access create a legible pickup geography.' },
      { name: 'Mobility relevance', value: 93, note: 'Night timing and a concentrated destination make shared rides useful.' },
      { name: 'Partnership potential', value: 78, note: 'The sample context is useful for testing a community coordination flow.' },
    ],
  },
  {
    id: 'church-street-weekend-demo',
    rank: '02',
    title: 'Church Street Weekend',
    event: 'Illustrative street-culture Saturday · Church Street cafés, bookshops & live sets',
    timing: 'Oct 26 · 16:00–21:00',
    location: 'Church Street · MG Road',
    interpretation:
      'A walkable Church Street afternoon-to-evening sample brings 52 nearby people into the same social pocket, with 19 ride requests and 12 open community seats for a coordinated return journey.',
    score: 84,
    confidence: 'Moderate',
    source: 'FellaRide demo scenario · Bengaluru community calendar format',
    limitation: 'Sample timing and participation signals are illustrative, not a public event announcement.',
    demo: true,
    rideContext: {
      category: 'Social / Community',
      community: 'MG Road · Church Street student community',
      interested: 52,
      ridesAvailable: 12,
      ridesNeeded: 19,
      distance: '3.2 km from local community',
      pickup: 'MG Road Metro · Church Street',
    },
    factors: [
      { name: 'Audience context', value: 82, note: 'A dense mix of cafés, bookshops, and evening social activity supports interest.' },
      { name: 'Location context', value: 90, note: 'Church Street and MG Road form a compact, familiar destination cluster.' },
      { name: 'Mobility relevance', value: 86, note: 'A later return window makes coordinated pickup planning practical.' },
      { name: 'Partnership potential', value: 73, note: 'The sample format offers a clear community-first outreach context.' },
    ],
  },
  {
    id: 'koramangala-visual-studio-demo',
    rank: '03',
    title: 'Bengaluru Tech Meetup — Microsoft Visual Studio feature program',
    event: 'Illustrative developer community session · Visual Studio feature walkthrough · Koramangala',
    timing: 'Oct 26 · 10:30–13:00',
    location: 'Koramangala · Sony World Junction',
    interpretation:
      'A plausible developer-community sample gives CS students and young professionals a shared Koramangala destination, with 41 interested, 14 ride requests, and 9 seats available across nearby pickup groups.',
    score: 80,
    confidence: 'Moderate',
    source: 'FellaRide demo scenario · community format, not an official Microsoft event',
    limitation: 'The program name and participation signals are illustrative and should not be read as an official announcement.',
    demo: true,
    rideContext: {
      category: 'Technology / Meetup',
      community: 'Koramangala + HSR Layout CS community',
      interested: 41,
      ridesAvailable: 9,
      ridesNeeded: 14,
      distance: '7.6 km from local community',
      pickup: 'Sony World Junction · Koramangala',
    },
    factors: [
      { name: 'Audience context', value: 79, note: 'A focused developer audience creates a credible student and early-career cohort.' },
      { name: 'Location context', value: 84, note: 'Koramangala tech venues are familiar to nearby HSR Layout communities.' },
      { name: 'Mobility relevance', value: 77, note: 'A late-morning session suits planned shared rides from adjacent neighborhoods.' },
      { name: 'Partnership potential', value: 80, note: 'The sample format makes community coordination easy to explain.' },
    ],
  },
  {
    id: 'cubbon-park-community-demo',
    rank: '04',
    title: 'Cubbon Park Community Meetup',
    event: 'Illustrative Sunday community morning · Cubbon Park walking circle + sketch exchange',
    timing: 'Oct 27 · 08:00–11:00',
    location: 'Cubbon Park · Kasturba Road',
    interpretation:
      'A casual morning community sample gives 34 nearby people a shared park arrival, with 11 ride requests and 8 open seats around a low-pressure central Bengaluru meetup.',
    score: 74,
    confidence: 'Moderate',
    source: 'FellaRide demo scenario · Bengaluru community activity format',
    limitation: 'Sample activity details and participation signals are illustrative, not a confirmed public listing.',
    demo: true,
    rideContext: {
      category: 'Community / Social',
      community: 'Bengaluru central student + resident groups',
      interested: 34,
      ridesAvailable: 8,
      ridesNeeded: 11,
      distance: '2.1 km from local community',
      pickup: 'Cubbon Park Gate 1 · MG Road',
    },
    factors: [
      { name: 'Audience context', value: 67, note: 'A smaller, casual gathering suits a focused local community cohort.' },
      { name: 'Location context', value: 86, note: 'Cubbon Park is central and easy to identify from several Metro approaches.' },
      { name: 'Mobility relevance', value: 72, note: 'Morning timing allows simple pre-planned pickup coordination.' },
      { name: 'Partnership potential', value: 70, note: 'The sample offers a gentle community use case for shared arrival.' },
    ],
  },
  {
    id: 'mtcc-convergence',
    rank: '05',
    title: 'Metro Convention Centre Medical Summit & Gala Concurrency',
    event: '32nd Annual Global Cardiology Colloquium · MTCC South Building',
    timing: 'Oct 25 · 19:00–22:30',
    location: 'Front St W · Bremner Blvd',
    interpretation:
      'Two public event windows overlap across adjacent venues, creating a concentrated evening demand window and clear partnership relevance.',
    score: 92,
    confidence: 'High',
    source: 'MTCC Event Calendar · City of Toronto permit record',
    limitation: 'Breakout session end times may vary by approximately 25 minutes.',
    factors: [
      { name: 'Audience context', value: 94, note: 'Large ticketed audience across two venue programs.' },
      { name: 'Location context', value: 88, note: 'Adjacent exits converge near Union Station access.' },
      { name: 'Mobility relevance', value: 91, note: 'Evening timing increases the value of pre-planned access.' },
      { name: 'Partnership potential', value: 86, note: 'Venue and organizer context supports a timely brief.' },
    ],
  },
  {
    id: 'arena-convergence',
    rank: '06',
    title: 'Scotiabank Arena Back-to-Back Event Convergence',
    event: 'Toronto Maple Leafs vs. Boston Bruins · Scotiabank Arena',
    timing: 'Oct 25 · 21:45–23:00 demand window',
    location: 'Downtown South · Queens Quay',
    interpretation:
      'Overlapping arena and cultural schedules create a concentrated demand window across nearby public event locations.',
    score: 85,
    confidence: 'High',
    source: 'NHL official schedule · Exhibition Place public event register',
    limitation: 'Overtime or encore timing could extend the event window by 30–45 minutes.',
    factors: [
      { name: 'Audience context', value: 89, note: 'Two ticketed programs create a sizeable combined audience.' },
      { name: 'Location context', value: 84, note: 'Adjacent destinations create a legible pickup geography.' },
      { name: 'Mobility relevance', value: 82, note: 'Evening entertainment timing increases convenience demand.' },
      { name: 'Partnership potential', value: 88, note: 'Public venue context supports partner mobility planning.' },
    ],
  },
  {
    id: 'old-town-culture',
    rank: '07',
    title: 'Meridian Hall & St. Lawrence Market Cultural Week Opening',
    event: 'International Ballet Gala · St. Lawrence Hall Civic Reception',
    timing: 'Oct 27 · 18:30–22:00',
    location: 'Old Town · Front St E',
    interpretation:
      'Two public cultural programs create a smaller but focused evening opportunity around a walkable historic venue cluster.',
    score: 76,
    confidence: 'Moderate',
    source: 'TO Live season guide · Heritage Toronto public notice',
    limitation: 'Attendance is estimated from published venue capacity and event context.',
    factors: [
      { name: 'Audience context', value: 74, note: 'Published capacity suggests a focused evening audience.' },
      { name: 'Location context', value: 72, note: 'Venue cluster is compact with limited curbside space.' },
      { name: 'Mobility relevance', value: 83, note: 'Pre-planned access is useful for an evening cultural audience.' },
      { name: 'Partnership potential', value: 71, note: 'Public organizer context is available for exploratory outreach.' },
    ],
  },
]

function App() {
  const [view, setView] = useState<View>('entry')
  const [selectedId, setSelectedId] = useState(opportunities[0].id)
  const [stateMode, setStateMode] = useState<StateMode>('loading')
  const [contactOpen, setContactOpen] = useState(false)
  const [transition, setTransition] = useState<TransitionRequest | null>(null)
  const [transitionId, setTransitionId] = useState(0)
  const transitionLock = useRef(false)
  const contactButtonRef = useRef<HTMLButtonElement>(null)
  const selected = opportunities.find((opportunity) => opportunity.id === selectedId) ?? opportunities[0]

  const navigate = (target: View, opportunityId?: string) => {
    if (transitionLock.current || target === view) return
    transitionLock.current = true
    if (opportunityId) setSelectedId(opportunityId)

    const direction: TransitionDirection = target === 'entry' || (view === 'detail' && target === 'discovery') ? 'reverse' : 'forward'
    const nextTransitionId = transitionId + 1
    setTransitionId(nextTransitionId)
    setTransition({ id: nextTransitionId, target, direction })
  }

  return (
    <main className="app-shell">
      {view === 'entry' && <Entry onEnter={() => navigate('discovery')} />}
      {view !== 'entry' && (
        <ProductShell view={view} onNavigate={navigate}>
          {view === 'discovery' && <Discovery onOpen={(id) => navigate('detail', id)} />}
          {view === 'detail' && <Detail opportunity={selected} onBack={() => navigate('discovery')} onContact={() => setContactOpen(true)} contactButtonRef={contactButtonRef} />}
          {view === 'states' && <States mode={stateMode} onModeChange={setStateMode} />}
        </ProductShell>
      )}
      {contactOpen && <ContactOverlay opportunity={selected} onClose={() => setContactOpen(false)} triggerRef={contactButtonRef} />}
      {transition && (
        <ButterflyTransition
          key={transition.id}
          request={transition}
          onReveal={() => setView(transition.target)}
          onComplete={() => {
            transitionLock.current = false
            setTransition(null)
          }}
        />
      )}
    </main>
  )
}

function ContactOverlay({
  opportunity,
  onClose,
  triggerRef,
}: {
  opportunity: Opportunity
  onClose: () => void
  triggerRef: RefObject<HTMLButtonElement | null>
}) {
  const dialogRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const closeTimerRef = useRef<number | null>(null)
  const isClosingRef = useRef(false)
  const [isClosing, setIsClosing] = useState(false)
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const route = opportunity.id === 'indiranagar-mohit-arijit-demo'
    ? mockContact.route
    : opportunity.rideContext
      ? `${opportunity.rideContext.pickup} → ${opportunity.location}`
      : `Community pickup → ${opportunity.location}`

  const requestClose = () => {
    if (isClosingRef.current) return
    isClosingRef.current = true
    setIsClosing(true)
    closeTimerRef.current = window.setTimeout(onClose, reducedMotion ? 0 : 180)
  }

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null
    const previousOverflow = document.body.style.overflow

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
        return
      }

      if (event.key !== 'Tab') return
      const focusable = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])') ?? [])
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)
    closeButtonRef.current?.focus()

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (closeTimerRef.current !== null) window.clearTimeout(closeTimerRef.current)
      document.body.style.overflow = previousOverflow
      const focusReturnTarget = triggerRef.current ?? previouslyFocused
      focusReturnTarget?.focus()
    }
  }, [onClose, reducedMotion, triggerRef])

  return (
    <div
      className={`contact-overlay${isClosing ? ' is-closing' : ''}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) requestClose()
      }}
    >
      <section
        ref={dialogRef}
        className="contact-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-dialog-title"
        aria-describedby="contact-dialog-description"
        data-contact-dialog
      >
        <div className="contact-dialog-header">
          <div className="contact-dialog-label mono"><span aria-hidden="true">•</span>HOST CONTACT</div>
          <button ref={closeButtonRef} className="contact-close-icon" type="button" onClick={requestClose} aria-label="Close contact overlay">×</button>
        </div>

        <div className="contact-profile">
          <div className="contact-avatar mono" aria-hidden="true">{mockContact.initials}</div>
          <div>
            <h2 id="contact-dialog-title">{mockContact.name}</h2>
            <p>{mockContact.designation}</p>
          </div>
        </div>

        <div className="contact-context" id="contact-dialog-description">
          <div><span className="mono">ROLE</span><b className="contact-role-tag">{mockContact.role}</b></div>
          <div><span className="mono">ROUTE</span><b>{route}</b></div>
          <div><span className="mono">EVENT CONTEXT</span><b>{opportunity.title}</b></div>
        </div>

        <div className="contact-phone">
          <span className="mono">PHONE</span>
          <strong className="contact-phone-number mono">{mockContact.phone}</strong>
          <p>{mockContact.demoNote}</p>
        </div>

        <div className="contact-dialog-footer">
          <button className="button contact-close-button" type="button" onClick={requestClose}>Close</button>
        </div>
      </section>
    </div>
  )
}

function Entry({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="entry-screen">
      <div className="entry-topbar">
        <div className="wordmark">FellaRide</div>
        <div className="entry-product-label">Opportunity Intelligence</div>
        <div className="entry-horizon mono">BENGALURU LOCAL · CANADIAN HORIZON · OCT 24</div>
      </div>

      <div className="entry-grid">
        <div className="entry-copy">
          <div className="eyebrow mono">THE CIVIC BUTTERFLY EFFECT</div>
          <h1>Butterfly Effect into more opportunities</h1>
          <p>
            FellaRide translates public event evidence into transparent, explainable Opportunities. Events worth noticing become easier to capitalize.
          </p>
          <div className="entry-action-row">
            <button className="button button-primary" onClick={onEnter}>Enter Discovery</button>
            <span className="entry-transition mono">Public evidence | FellaRide interpretation | Opportunity</span>
          </div>
        </div>

        {/* <ButterflyMark /> */}
      </div>

      <div className="entry-chain" aria-label="FellaRide opportunity flow">
        <ChainStep number="01" title="Public Event Evidence" copy="Permits, schedules, and civic calendars" />
        <ChainStep number="02" title="FellaRide Interpretation" copy="Location context and mobility relevance" />
        <ChainStep number="03" title="Explainable Opportunity" copy="Transparent score and visible factors" />
        <ChainStep number="04" title="Partnership Action" copy="Evidence-led outreach context" />
      </div>
    </section>
  )
}

function ButterflyMark() {
  return (
    <div className="butterfly-stage" aria-label="Layered purple butterfly emblem">
      <div className="butterfly-shadow" />
      <ButterflyImage />
    </div>
  )
}

function ButterflyImage() {
  return <img className="butterfly-image" src="/butterfly.png" alt="" draggable="false" />
}

function ButterflyFlight() {
  return (
    <div className="flight-butterfly">
      <ButterflyImage />
      <span className="flight-wing-mask flight-wing-left">
        <ButterflyImage />
      </span>
      <span className="flight-wing-mask flight-wing-right">
        <ButterflyImage />
      </span>
    </div>
  )
}

function ButterflyTransition({
  request,
  onReveal,
  onComplete,
}: {
  request: TransitionRequest
  onReveal: () => void
  onComplete: () => void
}) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // The overlay's timers mirror the CSS keyframes. The destination is switched
  // only after the expanding field has obscured the current surface.
  useEffect(() => {
    const revealDelay = reducedMotion ? 70 : 650
    const completeDelay = reducedMotion ? 190 : 1450
    const revealTimer = window.setTimeout(onReveal, revealDelay)
    const completeTimer = window.setTimeout(onComplete, completeDelay)
    return () => {
      window.clearTimeout(revealTimer)
      window.clearTimeout(completeTimer)
    }
  }, [request.id, reducedMotion])

  return (
    <div className={`butterfly-transition transition-${request.direction}${reducedMotion ? ' is-reduced' : ''}`} aria-hidden="true">
      <div className="transition-veil" />
      <div className="transition-radiance" />
      {!reducedMotion && (
        <div className="transition-flight">
          <DigitalTrail />
          <div className="transition-butterfly-art">
            <ButterflyFlight />
          </div>
        </div>
      )}
    </div>
  )
}

function DigitalTrail() {
  return (
    <div className="digital-trail">
      <span className="trail-core" />
      {Array.from({ length: 13 }, (_, index) => <span className="trail-fragment" key={index} />)}
    </div>
  )
}

function ChainStep({ number, title, copy }: { number: string; title: string; copy: string }) {
  return (
    <div className="chain-step">
      <div className="chain-number mono">{number}</div>
      <div>
        <div className="chain-title">{title}</div>
        <div className="chain-copy">{copy}</div>
      </div>
    </div>
  )
}

function ProductShell({ view, onNavigate, children }: { view: View; onNavigate: (view: View) => void; children: ReactNode }) {
  return (
    <div className="product-screen">
      <header className="product-header">
        <button className="brand-button" onClick={() => onNavigate('entry')} aria-label="Go to FellaRide home">
          <span className="wordmark">FellaRide</span>
          <span className="brand-subtitle mono">OPPORTUNITY INTELLIGENCE</span>
        </button>
        <nav className="main-nav" aria-label="Primary navigation">
          <button className={view === 'discovery' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('discovery')}>Opportunities</button>
          <button className={view === 'detail' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('detail')}>Selected dossier</button>
          <button className={view === 'states' ? 'nav-link active' : 'nav-link'} onClick={() => onNavigate('states')}>State previews</button>
        </nav>
        <div className="header-horizon mono">BENGALURU LOCAL · CANADIAN HORIZON · OCT 24</div>
      </header>
      {children}
    </div>
  )
}

function Discovery({ onOpen }: { onOpen: (id: string) => void }) {
  return (
    <section className="content-wrap">
      <div className="section-heading">
        <div>
          <div className="eyebrow mono">RANKED OPPORTUNITIES · BENGALURU FIRST</div>
          <h2>Opportunity Discovery</h2>
          <p>Bengaluru sample signals are surfaced first, while Canadian public-event opportunities remain in the same FellaRide horizon and comparative heuristic.</p>
        </div>
        <div className="heading-meta mono">7 OPPORTUNITIES · 14-DAY HORIZON</div>
      </div>

      <div className="filter-row">
        <button className="filter-button active">14-day horizon</button>
        <button className="filter-button">All event types</button>
        <button className="filter-button">Evidence: verified + sample</button>
        <span className="filter-note mono">SCORE IS COMPARATIVE · NOT A PREDICTION</span>
      </div>

      <div className="discovery-grid">
        <div className="opportunity-list">
          {opportunities.map((opportunity) => (
            <OpportunityRow key={opportunity.id} opportunity={opportunity} onOpen={onOpen} />
          ))}
        </div>
        <aside className="context-column">
          <section className="surface-panel evidence-panel">
            <PanelLabel>Evidence Coverage</PanelLabel>
            <h3>Public context behind the ranking.</h3>
            <p>Bengaluru sample opportunities are surfaced first, while Canadian public-event records remain visible below. Every item keeps its source context visible for questioning.</p>
            <div className="source-list">
              <span>Bengaluru community calendars & sample listings</span>
              <span>Municipal permits & festivals</span>
              <span>Venue calendars</span>
              <span>Arena schedules</span>
              <span>Civic arts programs</span>
            </div>
            <button className="text-link mono">View evidence provenance ↗</button>
          </section>
          <section className="surface-panel methodology-panel">
            <PanelLabel>How the score is formed</PanelLabel>
            <h3>Visible factors, measured with restraint.</h3>
            <div className="method-factor"><span>Audience context</span><b className="mono">40%</b></div>
            <div className="method-factor"><span>Location context</span><b className="mono">25%</b></div>
            <div className="method-factor"><span>Mobility relevance</span><b className="mono">20%</b></div>
            <div className="method-factor"><span>Partnership potential</span><b className="mono">15%</b></div>
            <p className="method-note">A transparent comparative heuristic, not a probability or prediction.</p>
          </section>
        </aside>
      </div>
    </section>
  )
}

function OpportunityRow({ opportunity, onOpen }: { opportunity: Opportunity; onOpen: (id: string) => void }) {
  return (
    <div
      className="opportunity-row"
      role="button"
      tabIndex={0}
      aria-label={`View ${opportunity.title}`}
      onClick={() => onOpen(opportunity.id)}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen(opportunity.id)
        }
      }}
    >
      <div className="row-rank mono">{opportunity.rank}</div>
      <div className="row-main">
        <div className="row-kicker mono">{opportunity.demo ? 'DEMO OPPORTUNITY · SAMPLE CONTENT' : `OPPORTUNITY · ${opportunity.confidence.toUpperCase()} CONFIDENCE`}</div>
        <h3>{opportunity.title}</h3>
        <div className="event-context">{opportunity.event}</div>
        <div className="row-interpretation"><span className="mono">WHY IT RANKS</span>{opportunity.interpretation}</div>
        <div className="row-meta mono">
          <span>{opportunity.timing}</span>
          <span>{opportunity.location}</span>
          {opportunity.rideContext && <>
            <span>{opportunity.rideContext.category}</span>
            <span>{opportunity.rideContext.interested} interested · {opportunity.rideContext.ridesNeeded} rides needed · {opportunity.rideContext.ridesAvailable} rides open</span>
            <span>{opportunity.rideContext.distance}</span>
          </>}
          <span>{opportunity.source}</span>
        </div>
      </div>
      <div className="row-score">
        <span className="score-label mono">OPPORTUNITY SCORE</span>
        <strong className="mono">{opportunity.score}</strong>
        <span className="score-denom mono">/100</span>
        <span className="row-action">View opportunity <span aria-hidden="true">↗</span></span>
      </div>
    </div>
  )
}

function Detail({
  opportunity,
  onBack,
  onContact,
  contactButtonRef,
}: {
  opportunity: Opportunity
  onBack: () => void
  onContact: () => void
  contactButtonRef: RefObject<HTMLButtonElement | null>
}) {
  return (
    <section className="content-wrap detail-wrap">
      <button className="back-link mono" onClick={onBack}>← Return to Opportunity Discovery</button>
      <div className="detail-heading">
        <div>
          <div className="eyebrow mono">OPPORTUNITY DOSSIER · {opportunity.rank}</div>
          <h2>{opportunity.title}</h2>
          <p>{opportunity.timing} · {opportunity.location}</p>
        </div>
        <div className="detail-score">
          <span className="score-label mono">TRANSPARENT OPPORTUNITY HEURISTIC</span>
          <strong className="mono">{opportunity.score}<small>/100</small></strong>
          <span>The score supports comparative review and does not control service operations.</span>
        </div>
      </div>

      <div className="detail-grid">
        <div className="detail-main">
          <DetailSection number="01" label="UNDERLYING PUBLIC EVENT EVIDENCE">
            <h3>{opportunity.event}</h3>
            <p>{opportunity.demo ? 'Illustrative sample context for a Bengaluru community discovery experience. This is not a confirmed public event announcement.' : 'Public event context from venue calendars and civic schedules. The source entity is distinct from the FellaRide interpretation that follows.'}</p>
          </DetailSection>
          <DetailSection number="02" label="FELLARIDE OPPORTUNITY INTERPRETATION">
            <p>{opportunity.interpretation} This suggests a useful moment for partner mobility planning and an evidence-led conversation with the public organizer context.</p>
          </DetailSection>
          <DetailSection number="03" label="MOBILITY RELEVANCE & LOCATION CONTEXT">
            <div className="context-lines">
              <div><span className="mono">PICKUP & LOCATION</span><b>{opportunity.location}</b></div>
              <div><span className="mono">EVENT WINDOW</span><b>{opportunity.timing}</b></div>
              <div><span className="mono">WHY IT MATTERS</span><b>Nearby public destinations and a defined event window create a focused context for mobility relevance.</b></div>
              {opportunity.rideContext && <>
                <div><span className="mono">EVENT TYPE</span><b>{opportunity.rideContext.category}</b></div>
                <div><span className="mono">COMMUNITY SIGNAL</span><b>{opportunity.rideContext.interested} interested · {opportunity.rideContext.ridesNeeded} rides needed · {opportunity.rideContext.ridesAvailable} rides available · {opportunity.rideContext.distance}</b></div>
                <div><span className="mono">COMMUNITY / PICKUP</span><b>{opportunity.rideContext.community} · {opportunity.rideContext.pickup}</b></div>
              </>}
            </div>
          </DetailSection>
          <DetailSection number="04" label="EVIDENCE PROVENANCE & EVENT TIMING LIMITATIONS">
            <p><strong>{opportunity.source}</strong></p>
            <p className="muted">{opportunity.limitation} Confidence: {opportunity.confidence}. Public evidence is useful, but never complete.</p>
          </DetailSection>
        </div>
        <aside className="detail-side">
          <section className="surface-panel factor-panel">
            <PanelLabel>Score contributors</PanelLabel>
            {opportunity.factors.map((factor) => (
              <div className="factor-row" key={factor.name}>
                <div className="factor-row-top"><span>{factor.name}</span><b className="mono">{factor.value}</b></div>
                <div className="factor-track"><span style={{ width: `${factor.value}%` }} /></div>
                <p>{factor.note}</p>
              </div>
            ))}
          </section>
          <section className="surface-panel partnership-panel">
            <PanelLabel>Partnership context</PanelLabel>
            <h3>Prepare a conversation about the public event.</h3>
            <p>We try to make public venue and organizer context available for an outreach effort. Contact them for any information about the event.</p>
            <button ref={contactButtonRef} className="button button-primary" type="button" onClick={onContact}>Contact</button>
            <button className="text-link mono">View public source ↗</button>
          </section>
        </aside>
      </div>
    </section>
  )
}

function DetailSection({ number, label, children }: { number: string; label: string; children: ReactNode }) {
  return (
    <section className="detail-section">
      <div className="detail-section-label mono"><span>{number}</span>{label}</div>
      <div className="detail-section-content">{children}</div>
    </section>
  )
}

function States({ mode, onModeChange }: { mode: StateMode; onModeChange: (mode: StateMode) => void }) {
  return (
    <section className="content-wrap states-wrap">
      <div className="section-heading">
        <div>
          <div className="eyebrow mono">SURFACE STATE SPECIFICATIONS</div>
          <h2>Loading, Empty, Error</h2>
          <p>State behavior stays evidence-led across public event resolution, horizon filters, and source provenance.</p>
        </div>
        <div className="state-switcher" role="tablist" aria-label="Preview state">
          {(['loading', 'empty', 'error'] as StateMode[]).map((state) => (
            <button key={state} className={mode === state ? 'filter-button active' : 'filter-button'} onClick={() => onModeChange(state)} role="tab" aria-selected={mode === state}>{state}</button>
          ))}
        </div>
      </div>
      <div className="state-preview-grid">
        {mode === 'loading' && <LoadingState />}
        {mode === 'empty' && <EmptyState />}
        {mode === 'error' && <ErrorState />}
      </div>
    </section>
  )
}

function LoadingState() {
  return (
    <section className="state-card loading-state">
      <div className="state-card-header"><PanelLabel>STATE 01 · SYNTHESIZING EVIDENCE</PanelLabel><span className="mono">TEMPORARY</span></div>
      <div className="skeleton skeleton-wide" />
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-body" />
      <div className="skeleton-row"><span className="skeleton" /><span className="skeleton" /><span className="skeleton" /></div>
      <div className="skeleton skeleton-footer" />
      <p className="state-note mono">No score is shown until public event evidence is confirmed.</p>
    </section>
  )
}

function EmptyState() {
  return (
    <section className="state-card empty-state">
      <div className="state-card-header"><PanelLabel>STATE 02 · ZERO CONVERGENCE</PanelLabel><span className="mono">NO MATCH</span></div>
      <div className="empty-mark" aria-hidden="true">—</div>
      <h3>No Opportunities in this horizon</h3>
      <p>Try widening the time horizon or reviewing another public event category.</p>
      <div className="state-explanation">Opportunities are derived from verified public Event evidence interpreted through the FellaRide lens. When the evidence does not support meaningful mobility relevance or partnership context, no score is fabricated.</div>
      <button className="button button-primary">Adjust horizon</button>
      <button className="text-link mono">Browse all public events ↗</button>
    </section>
  )
}

function ErrorState() {
  return (
    <section className="state-card error-state">
      <div className="state-card-header"><PanelLabel>STATE 03 · PROVENANCE LIMITATION</PanelLabel><span className="mono">SOURCE UNREADABLE</span></div>
      <div className="error-mark" aria-hidden="true">!</div>
      <h3>We couldn’t read this public event source</h3>
      <p>The public record could not be confirmed for this horizon.</p>
      <div className="state-explanation">FellaRide remains evidence-led. Without an authoritative source record, Opportunity scoring pauses to prevent unverified assumptions.</div>
      <div className="state-actions"><button className="button button-primary">Try again</button><button className="text-link mono">View source ↗</button></div>
    </section>
  )
}

function PanelLabel({ children }: { children: ReactNode }) {
  return <div className="panel-label mono">{children}</div>
}

export default App
