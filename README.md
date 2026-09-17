# FellaRide — Event Discovery Engine

### What is this project about?

**FellaRide is an event discovery engine that identifies real-world events, communities, and gathering points that could represent potential carpooling opportunities.** It aggregates public event, geographic, and mobility data and converts it into actionable opportunities for FellaRide.

### What does it solve?

**Carpooling platforms face a cold-start problem: communities are only useful when enough people share a destination, route, or activity.** FellaRide helps solve this by proactively discovering concentrated communities and events where new carpooling networks could be established.

### Who is it intended for?

**The primary users are FellaRide's community-growth, business-development, and partnership teams.** The engine helps them discover promising opportunities, understand their context, and identify potential stakeholders for community development.

### Why does the solution work?

People naturally converge around **events, universities, workplaces, venues, and communities**, creating predictable geographic and temporal concentrations of travel. By combining these signals with surrounding geographic and transportation context, FellaRide can identify locations where shared transportation has greater potential to be useful.

### What's novel about it?

Most event-discovery systems answer **“What's happening near me?”**, while carpooling platforms answer **“Who can I share a ride with?”**

The discovery engine connects these two problems by asking:

> **“Where are communities forming that could become the next carpooling network?”**

The system combines heterogeneous public data sources — events, geographic infrastructure, places, and transit — and transforms them into **ranked, explainable mobility opportunities** rather than simply displaying raw events. This allows FellaRide to move from reacting to existing demand toward proactively discovering where new communities could be created.

### **Public Discovery APIs & Data Sources**

**All external sources used by the discovery engine are publicly accessible discovery/open-data sources:**

* **Ticketmaster Discovery API** — events, venues, dates, categories, performers
  https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/

* **City of Toronto Open Data — Festivals & Events** — public/community events
  https://open.toronto.ca/dataset/festivals-events/

* **OpenStreetMap / Overpass API** — geographic places, venues, infrastructure, and spatial context
  https://overpass-turbo.eu/

* **Metrolinx Open Data** — public transportation and transit data for mobility context
  https://www.metrolinx.com/en/about-us/open-data

### Architecture & Workflow

The engine sends geographically scoped requests to the available public data sources, collects heterogeneous event, place, and mobility records, normalizes them into a common FellaRide opportunity model, removes duplicates, associates events with their surrounding geographic and transportation context, and evaluates each opportunity using factors such as geographic concentration, temporal relevance, community characteristics, mobility context, and data confidence. The resulting opportunities are **ranked and returned through the FellaRide discovery layer**, allowing the growth team to identify promising communities and move from discovery toward outreach and community creation.

---

### Core Workflow

**Discover → Aggregate → Normalize → Enrich → Evaluate → Rank → Act**
