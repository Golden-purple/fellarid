import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'

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
}

const opportunities: Opportunity[] = [
  {
    id: 'mtcc-convergence',
    rank: '01',
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
    rank: '02',
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
    rank: '03',
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
  const [selectedId, setSelectedId] = useState(opportunities[1].id)
  const [stateMode, setStateMode] = useState<StateMode>('loading')
  const [transition, setTransition] = useState<TransitionRequest | null>(null)
  const [transitionId, setTransitionId] = useState(0)
  const transitionLock = useRef(false)
  const selected = opportunities.find((opportunity) => opportunity.id === selectedId) ?? opportunities[1]

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
          {view === 'detail' && <Detail opportunity={selected} onBack={() => navigate('discovery')} />}
          {view === 'states' && <States mode={stateMode} onModeChange={setStateMode} />}
        </ProductShell>
      )}
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

function Entry({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="entry-screen">
      <div className="entry-topbar">
        <div className="wordmark">FellaRide</div>
        <div className="entry-product-label">Opportunity Intelligence</div>
        <div className="entry-horizon mono">PUBLISHED HORIZON · TORONTO CENTRAL · OCT 24</div>
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
        <div className="header-horizon mono">TORONTO CENTRAL · OCT 24</div>
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
          <div className="eyebrow mono">RANKED OPPORTUNITIES · TORONTO</div>
          <h2>Opportunity Discovery</h2>
          <p>Public event evidence interpreted through the FellaRide lens, ranked with a transparent comparative heuristic.</p>
        </div>
        <div className="heading-meta mono">3 OPPORTUNITIES · 14-DAY HORIZON</div>
      </div>

      <div className="filter-row">
        <button className="filter-button active">14-day horizon</button>
        <button className="filter-button">All event types</button>
        <button className="filter-button">Evidence: verified</button>
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
            <p>Source families represented in this horizon, kept visible so every Opportunity can be questioned and followed back to its public origin.</p>
            <div className="source-list">
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
        <div className="row-kicker mono">OPPORTUNITY · {opportunity.confidence.toUpperCase()} CONFIDENCE</div>
        <h3>{opportunity.title}</h3>
        <div className="event-context">{opportunity.event}</div>
        <div className="row-interpretation"><span className="mono">WHY IT RANKS</span>{opportunity.interpretation}</div>
        <div className="row-meta mono"><span>{opportunity.timing}</span><span>{opportunity.location}</span><span>{opportunity.source}</span></div>
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

function Detail({ opportunity, onBack }: { opportunity: Opportunity; onBack: () => void }) {
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
            <p>Public event context from venue calendars and civic schedules. The source entity is distinct from the FellaRide interpretation that follows.</p>
          </DetailSection>
          <DetailSection number="02" label="FELLARIDE OPPORTUNITY INTERPRETATION">
            <p>{opportunity.interpretation} This suggests a useful moment for partner mobility planning and an evidence-led conversation with the public organizer context.</p>
          </DetailSection>
          <DetailSection number="03" label="MOBILITY RELEVANCE & LOCATION CONTEXT">
            <div className="context-lines">
              <div><span className="mono">PICKUP & LOCATION</span><b>{opportunity.location}</b></div>
              <div><span className="mono">EVENT WINDOW</span><b>{opportunity.timing}</b></div>
              <div><span className="mono">WHY IT MATTERS</span><b>Nearby public destinations and an evening timing window create a focused context for mobility relevance.</b></div>
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
            <h3>Prepare a conversation grounded in the public event.</h3>
            <p>Public venue and organizer context is available for an exploratory outreach brief. This is not a contact-management workflow.</p>
            <button className="button button-primary">Prepare outreach</button>
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
