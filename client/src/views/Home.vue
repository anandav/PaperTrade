<template>
  <div class="landing-page">
    <section class="hero">
      <div class="orb orb-one" aria-hidden="true"></div>
      <div class="orb orb-two" aria-hidden="true"></div>
      <div class="grid-lines" aria-hidden="true"></div>

      <div class="hero-copy">
        <div class="eyebrow"><span aria-hidden="true"></span> Risk-free practice</div>
        <h1>
          Paper trade options<br />
          and futures with <em>confidence.</em>
        </h1>
        <p>
          Build multi-leg strategies, open payoff graphs on demand, and practice
          NSE-style workflows without putting real money at risk.
        </p>
        <div class="hero-actions">
          <router-link
            v-if="isLoggedIn"
            to="/papertrade"
            class="button button-primary"
          >
            Open Paper Trade <span class="button-arrow" aria-hidden="true">→</span>
          </router-link>
          <a
            v-else
            href="#"
            class="button button-primary"
            @click.prevent="b2cLogin"
          >
            Get started <span class="button-arrow" aria-hidden="true">→</span>
          </a>
          <a href="#features" class="button button-secondary">See features</a>
        </div>
        <p class="trusted">
          Portfolios, strategies, LTP, and charts in one workspace.
        </p>
      </div>

      <div class="market-card" aria-label="Sample strategy preview">
        <div class="card-top">
          <div>
            <span class="card-label">Strategy preview</span>
            <strong>NIFTY iron fly</strong>
          </div>
          <span class="live-dot">Sim</span>
        </div>
        <div class="card-change">
          <span>+ ₹ 12,450.00</span>
          <small>Sample net PnL shape</small>
        </div>
        <div class="legs">
          <div v-for="leg in previewLegs" :key="leg.label" class="leg-row">
            <span>{{ leg.label }}</span>
            <strong :class="leg.side === 'Buy' ? 'buy' : 'sell'">{{
              leg.side
            }}</strong>
          </div>
        </div>
        <div class="chart-wrap">
          <svg
            viewBox="0 0 560 230"
            preserveAspectRatio="none"
            role="img"
            aria-label="Sample payoff style chart"
          >
            <defs>
              <linearGradient id="home-payoff-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color="#15803d" stop-opacity=".4" />
                <stop offset="1" stop-color="#15803d" stop-opacity="0" />
              </linearGradient>
            </defs>
            <path
              class="chart-area"
              d="M0 188 L36 175 L69 181 L106 145 L142 155 L182 118 L214 132 L253 106 L290 116 L326 72 L361 84 L398 48 L429 66 L468 30 L505 43 L560 8 L560 230 L0 230 Z"
            />
            <path
              class="chart-line"
              d="M0 188 L36 175 L69 181 L106 145 L142 155 L182 118 L214 132 L253 106 L290 116 L326 72 L361 84 L398 48 L429 66 L468 30 L505 43 L560 8"
            />
            <circle cx="468" cy="30" r="5" />
            <circle cx="560" cy="8" r="5" />
          </svg>
          <div class="chart-label label-a" aria-hidden="true">OTM</div>
          <div class="chart-label label-b" aria-hidden="true">ATM</div>
          <div class="chart-label label-c" aria-hidden="true">ITM</div>
        </div>
        <div class="positions">
          <span>Open legs</span>
          <strong>04</strong>
          <div class="position-bars" aria-hidden="true">
            <i></i><i></i><i></i><i></i>
          </div>
        </div>
      </div>
    </section>

    <section id="features" class="feature-section">
      <div class="section-intro">
        <span class="section-kicker">Why PaperTrade</span>
        <h2>
          Everything you need to<br />
          practice the full workflow.
        </h2>
      </div>
      <div class="features">
        <article v-for="(feature, index) in features" :key="feature.title">
          <div class="feature-number" aria-hidden="true">
            {{ String(index + 1).padStart(2, "0") }}
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.body }}</p>
          <div class="feature-mark" aria-hidden="true">{{ feature.mark }}</div>
        </article>
      </div>
    </section>

    <section class="cta-section">
      <span class="section-kicker">Ready when you are</span>
      <h2>
        Your next trade can<br />
        be a practice one.
      </h2>
      <a
        v-if="!isLoggedIn"
        href="#"
        class="button button-primary"
        @click.prevent="b2cLogin"
      >
        Create your free workspace
        <span class="button-arrow" aria-hidden="true">→</span>
      </a>
      <router-link v-else to="/papertrade" class="button button-primary">
        Open Paper Trade
        <span class="button-arrow" aria-hidden="true">→</span>
      </router-link>
    </section>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { apiUrl } from "../config";

export default {
  name: "Home",
  data() {
    return {
      previewLegs: [
        { label: "24500 CE", side: "Sell" },
        { label: "24500 PE", side: "Sell" },
        { label: "24600 CE", side: "Buy" },
        { label: "24400 PE", side: "Buy" },
      ],
      features: [
        {
          title: "Portfolios and strategies",
          body: "Organize books, search portfolios, and manage multi-leg strategies without clutter.",
          mark: "↗",
        },
        {
          title: "Payoff graphs on demand",
          body: "Open a clear payoff view whenever you need to compare risk, reward, and key price levels.",
          mark: "◌",
        },
        {
          title: "LTP and market data",
          body: "Keep an eye on prices and positions while you test how each decision affects your trade.",
          mark: "⌁",
        },
        {
          title: "Multi-leg options workflow",
          body: "Add calls, puts, and futures, exit trades, and track simulated totals in one focused workspace.",
          mark: "◇",
        },
        {
          title: "A workspace that fits you",
          body: "Choose a light or dark workspace that stays comfortable through every planning session.",
          mark: "☾",
        },
        {
          title: "Your practice, saved",
          body: "Sign in to keep your portfolios and strategies ready for the next time you want to learn.",
          mark: "▹",
        },
      ],
    };
  },
  computed: {
    ...mapGetters("authModule", ["isLoggedIn"]),
  },
  methods: {
    b2cLogin() {
      window.location.href = apiUrl + "auth/b2c/login";
    },
  },
};
</script>

<style scoped>
.landing-page {
  --ink: #17263c;
  --paper: #f8f4ee;
  --hero-surface: #f7f1e8;
  --feature-surface: #f3ebe0;
  --cta-surface: #ebc89a;
  --accent: #e07a2f;
  --accent-deep: #b45309;
  --accent-warm: #e89b4d;
  --muted: #56677a;
  --card: #17263c;
  --font-display: Georgia, "Times New Roman", Times, serif;
  --font-sans: system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial,
    sans-serif;
  --type-hero: clamp(2.5rem, 4.8vw, 4.25rem);
  --type-section: clamp(2rem, 3.8vw, 3.25rem);
  --type-title: clamp(1.25rem, 1.6vw, 1.5rem);
  --type-body: 1rem;
  --type-ui: 0.8125rem;
  --type-label: 0.6875rem;
  --type-meta: 0.75rem;
  --type-micro: 0.625rem;
  --space-page-x: max(7vw, 2.625rem);
  --radius-control: 0.25rem;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  font-family: var(--font-display);
  font-size: var(--type-body);
  line-height: 1.5;
  overflow-x: hidden;
  padding-bottom: 3.25rem;
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}
.hero {
  min-height: 650px;
  padding: 10rem var(--space-page-x) 5.375rem;
  position: relative;
  background: var(--hero-surface);
  overflow: hidden;
  display: flex;
  align-items: center;
}
.grid-lines {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  pointer-events: none;
  background-image: linear-gradient(#e8ddd0 1px, transparent 1px),
    linear-gradient(90deg, #e8ddd0 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(to bottom, #000, transparent 85%);
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
  pointer-events: none;
}
.orb-one {
  width: 420px;
  height: 420px;
  background: #f3d9b8;
  right: -70px;
  top: -135px;
}
.orb-two {
  width: 330px;
  height: 330px;
  border: 52px solid #ecd9c2;
  left: -160px;
  bottom: -190px;
}
.hero-copy {
  width: 57%;
  max-width: 690px;
  position: relative;
  z-index: 1;
}
.eyebrow,
.section-kicker {
  color: var(--accent-deep);
  font-family: var(--font-sans);
  font-size: var(--type-label);
  font-weight: 700;
  letter-spacing: 0.14em;
  line-height: 1.3;
  text-transform: uppercase;
}
.eyebrow {
  display: flex;
  gap: 0.55rem;
  align-items: center;
}
.eyebrow span {
  width: 20px;
  height: 1px;
  background: var(--accent-deep);
  flex-shrink: 0;
}
.hero h1 {
  font-family: var(--font-display);
  font-size: var(--type-hero);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1.08;
  margin: 1.25rem 0 1.15rem;
  max-width: 18ch;
  text-wrap: balance;
}
.hero h1 em {
  color: var(--accent-deep);
  font-style: italic;
}
.hero-copy > p:not(.trusted) {
  max-width: 36rem;
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: var(--type-body);
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.65;
  margin: 0;
}
.hero-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}
.button {
  align-items: center;
  border: 1px solid transparent;
  border-radius: var(--radius-control);
  box-sizing: border-box;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-sans);
  font-size: var(--type-ui);
  font-weight: 700;
  justify-content: center;
  letter-spacing: 0.02em;
  line-height: 1.2;
  min-height: 2.75rem;
  padding: 0.85rem 1.2rem;
  text-decoration: none;
  transition: transform 0.18s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.18s ease, border-color 0.18s ease, color 0.18s ease;
}
.button:hover {
  transform: translateY(-2px);
}
.button:active {
  transform: translateY(0);
}
.button:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 3px;
}
.button-arrow {
  font-size: 1.125rem;
  font-weight: 400;
  margin-left: 0.85rem;
  line-height: 1;
}
.button-primary {
  background: var(--accent);
  color: #10212a;
}
.button-primary:hover {
  background: var(--accent-warm);
}
.button-primary:active {
  background: #d4691f;
}
.button-secondary {
  background: rgba(255, 255, 255, 0.55);
  border-color: #e2d0b8;
  color: var(--ink);
}
.button-secondary:hover {
  background: rgba(255, 255, 255, 0.88);
  border-color: #d4bfa0;
}
.button-secondary:active {
  background: #fff;
}
.trusted {
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: var(--type-meta);
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.45;
  margin: 2rem 0 0;
  max-width: 36rem;
}
.market-card {
  background: var(--card);
  border-radius: 0.125rem;
  box-shadow: 0 28px 70px rgba(29, 54, 65, 0.24);
  color: #fff;
  font-family: var(--font-sans);
  font-variant-numeric: tabular-nums;
  padding: 1.65rem 1.75rem 1.4rem;
  position: absolute;
  right: max(6vw, 2.25rem);
  top: 9.625rem;
  transform: rotate(2.5deg);
  width: min(38vw, 495px);
  z-index: 2;
}
.card-top {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
}
.card-top > div {
  display: grid;
  gap: 0.5rem;
  min-width: 0;
}
.card-label {
  color: #b8c4d0;
  font-family: var(--font-sans);
  font-size: var(--type-micro);
  font-weight: 700;
  letter-spacing: 0.12em;
  line-height: 1.3;
  text-transform: uppercase;
}
.card-top strong {
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.2;
}
.live-dot {
  align-items: center;
  color: #f0b27a;
  display: flex;
  flex-shrink: 0;
  font-family: var(--font-sans);
  font-size: var(--type-label);
  font-weight: 600;
  gap: 0.35rem;
  height: fit-content;
  letter-spacing: 0.04em;
  line-height: 1.2;
}
.live-dot:before {
  background: var(--accent);
  border-radius: 50%;
  content: "";
  height: 6px;
  width: 6px;
}
.card-change {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.75rem;
  margin-top: 0.95rem;
  align-items: baseline;
}
.card-change span {
  color: #f0b27a;
  font-family: var(--font-sans);
  font-size: var(--type-ui);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.01em;
  line-height: 1.2;
}
.card-change small {
  color: #a3b1c0;
  font-family: var(--font-sans);
  font-size: var(--type-label);
  font-weight: 500;
  line-height: 1.3;
}
.legs {
  margin-top: 1rem;
  display: grid;
  gap: 0.5rem;
}
.leg-row {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  font-family: var(--font-sans);
  font-size: var(--type-ui);
  font-variant-numeric: tabular-nums;
  line-height: 1.3;
  padding: 0.5rem 0.65rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #314055;
  border-radius: 0.125rem;
}
.leg-row span {
  color: #c5d0db;
}
.leg-row .buy {
  color: #4ade80;
  font-weight: 700;
}
.leg-row .sell {
  color: #f87171;
  font-weight: 700;
}
.chart-wrap {
  height: 150px;
  margin: 1.15rem -0.3rem 0;
  position: relative;
}
.chart-wrap svg {
  height: 100%;
  overflow: visible;
  width: 100%;
}
.chart-area {
  fill: url(#home-payoff-fill);
}
.chart-line {
  fill: none;
  stroke: #15803d;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}
.chart-wrap circle {
  fill: var(--card);
  stroke: #22c55e;
  stroke-width: 3;
}
.chart-label {
  bottom: -4px;
  color: #97a6b5;
  font-family: var(--font-sans);
  font-size: var(--type-micro);
  font-weight: 600;
  letter-spacing: 0.06em;
  line-height: 1.2;
  position: absolute;
  text-transform: uppercase;
}
.label-a {
  left: 5%;
}
.label-b {
  left: 46%;
}
.label-c {
  right: 2%;
}
.positions {
  align-items: center;
  border-top: 1px solid #314055;
  color: #b0bccd;
  display: flex;
  font-family: var(--font-sans);
  font-size: var(--type-label);
  font-weight: 500;
  gap: 0.55rem;
  line-height: 1.3;
  margin-top: 0.9rem;
  padding-top: 1rem;
}
.positions strong {
  color: #fff;
  font-size: var(--type-ui);
  font-variant-numeric: tabular-nums;
  font-weight: 700;
}
.position-bars {
  display: flex;
  gap: 3px;
  margin-left: auto;
}
.position-bars i {
  background: #4f6175;
  display: block;
  height: 16px;
  width: 8px;
}
.position-bars i:nth-child(2),
.position-bars i:nth-child(4) {
  background: var(--accent);
}
.feature-section {
  background: var(--paper);
  padding: 6.5rem var(--space-page-x);
  scroll-margin-top: 5rem;
}
.section-intro {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
  max-width: 42rem;
}
.section-intro h2,
.cta-section h2 {
  font-family: var(--font-display);
  font-size: var(--type-section);
  font-weight: 400;
  letter-spacing: -0.035em;
  line-height: 1.12;
  margin: 0;
  max-width: 16ch;
  text-wrap: balance;
}
.features {
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 3.5rem;
}
.features article {
  background: var(--feature-surface);
  display: flex;
  flex-direction: column;
  min-height: 260px;
  padding: 1.75rem;
  position: relative;
}
.feature-number {
  color: var(--accent-deep);
  font-family: var(--font-sans);
  font-size: var(--type-label);
  font-weight: 700;
  letter-spacing: 0.08em;
  line-height: 1.3;
}
.features h3 {
  font-family: var(--font-display);
  font-size: var(--type-title);
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.25;
  margin: 2.25rem 0 0.65rem;
  max-width: 14ch;
  text-wrap: balance;
}
.features p {
  color: var(--muted);
  font-family: var(--font-sans);
  font-size: 0.9375rem;
  font-weight: 400;
  letter-spacing: 0.005em;
  line-height: 1.65;
  margin: 0;
  max-width: 32ch;
  padding-bottom: 2rem;
}
.feature-mark {
  bottom: 1.4rem;
  color: var(--accent-deep);
  font-family: var(--font-sans);
  font-size: 1.5rem;
  line-height: 1;
  position: absolute;
  right: 1.5rem;
  pointer-events: none;
}
.cta-section {
  align-items: center;
  background: var(--cta-surface);
  display: flex;
  flex-direction: column;
  min-height: 22rem;
  justify-content: center;
  padding: 4.5rem 1.5rem 5rem;
  text-align: center;
}
.cta-section .section-kicker {
  margin-bottom: 0;
}
.cta-section h2 {
  margin: 1rem 0 1.75rem;
  max-width: 14ch;
}
.cta-section .button {
  min-width: 14.5rem;
}
.cta-section .button-primary {
  background: var(--ink);
  color: #fff;
}
.cta-section .button-primary:hover {
  background: #28415e;
}
.cta-section .button-primary:active {
  background: #1a2e42;
}
.cta-section .button:focus-visible {
  outline-color: var(--ink);
}
@media (max-width: 1100px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 850px) {
  .hero {
    min-height: auto;
    padding-top: 8.5rem;
    padding-bottom: 35rem;
  }
  .hero-copy {
    width: 100%;
  }
  .hero h1 {
    max-width: none;
  }
  .market-card {
    left: 50%;
    right: auto;
    top: auto;
    bottom: 3.75rem;
    transform: translateX(-50%) rotate(1.5deg);
    width: min(78vw, 480px);
  }
  .section-intro h2 {
    max-width: none;
  }
  .features {
    grid-template-columns: 1fr;
    margin-top: 2.5rem;
  }
  .features article {
    min-height: 13.75rem;
  }
  .features h3 {
    margin-top: 1.75rem;
    max-width: none;
  }
  .features p {
    max-width: 42ch;
  }
}
@media (max-width: 520px) {
  .landing-page {
    --space-page-x: 1.5rem;
  }
  .hero {
    padding-bottom: 32.5rem;
  }
  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .button {
    width: 100%;
  }
  .market-card {
    bottom: 3rem;
    padding: 1.35rem;
    width: calc(100% - 3rem);
  }
  .chart-wrap {
    height: 7.5rem;
  }
  .feature-section {
    padding-top: 4.5rem;
    padding-bottom: 4.5rem;
  }
  .features article {
    padding: 1.5rem;
  }
  .cta-section {
    min-height: 20rem;
    padding: 3.5rem 1.5rem 4rem;
  }
  .cta-section h2 {
    max-width: none;
  }
  .cta-section .button {
    min-width: 0;
    width: 100%;
    max-width: 22rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .landing-page {
    scroll-behavior: auto;
  }
  .button {
    transition: none;
  }
  .button:hover,
  .button:active {
    transform: none;
  }
}
</style>

<style>
.dark .landing-page {
  --ink: #edf5f0;
  --paper: #101923;
  --hero-surface: #121f29;
  --feature-surface: #172630;
  --cta-surface: #3a2818;
  --accent: #e89b4d;
  --accent-deep: #e89b4d;
  --accent-warm: #f5c78a;
  --muted: #a6b6c3;
  --card: #1b2f3c;
  background: var(--paper);
}
.dark .landing-page .grid-lines {
  background-image: linear-gradient(
      rgba(180, 120, 60, 0.22) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(180, 120, 60, 0.22) 1px, transparent 1px);
}
.dark .landing-page .orb-one {
  background: #3d2a1c;
}
.dark .landing-page .orb-two {
  border-color: #3a2818;
}
.dark .landing-page .hero-copy > p:not(.trusted),
.dark .landing-page .features p,
.dark .landing-page .trusted {
  color: var(--muted);
  letter-spacing: 0.015em;
  line-height: 1.75;
  font-weight: 400;
}
.dark .landing-page .hero h1 em {
  color: #f0b27a;
}
.dark .landing-page .button-primary {
  background: var(--accent);
  color: #10212a;
}
.dark .landing-page .button-primary:hover {
  background: var(--accent-warm);
}
.dark .landing-page .button-primary:active {
  background: #d4a05a;
}
.dark .landing-page .button-secondary {
  background: rgba(255, 255, 255, 0.04);
  border-color: #314552;
  color: #edf5f0;
}
.dark .landing-page .button-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: #456274;
}
.dark .landing-page .button:focus-visible {
  outline-color: var(--accent);
}
.dark .landing-page .market-card {
  box-shadow: 0 28px 70px rgba(0, 0, 0, 0.38);
}
.dark .landing-page .card-label,
.dark .landing-page .card-change small,
.dark .landing-page .chart-label,
.dark .landing-page .positions {
  color: #a0b1bf;
}
.dark .landing-page .leg-row {
  background: rgba(0, 0, 0, 0.15);
  border-color: #38505d;
}
.dark .landing-page .positions {
  border-top-color: #38505d;
}
.dark .landing-page .cta-section .button-primary {
  background: var(--accent);
  color: #10212a;
}
.dark .landing-page .cta-section .button-primary:hover {
  background: var(--accent-warm);
}
.dark .landing-page .cta-section .button:focus-visible {
  outline-color: var(--accent);
}
.dark .landing-page .cta-section .section-kicker {
  color: #f0b27a;
}
</style>
