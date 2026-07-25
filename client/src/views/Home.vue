<template>
  <div class="landing-page">
    <section class="hero">
      <div class="orb orb-one"></div>
      <div class="orb orb-two"></div>
      <div class="grid-lines"></div>

      <div class="hero-copy">
        <div class="eyebrow"><span></span> Risk-free practice</div>
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
            Open Paper Trade <b>→</b>
          </router-link>
          <a
            v-else
            href="#"
            class="button button-primary"
            @click.prevent="b2cLogin"
          >
            Get started <b>→</b>
          </a>
          <a href="#features" class="button button-secondary">See features</a>
        </div>
        <div class="trusted">
          <span>Portfolios, strategies, LTP, and charts in one workspace.</span>
        </div>
      </div>

      <div class="market-card" aria-label="Sample strategy preview">
        <div class="card-top">
          <div>
            <span class="card-label">STRATEGY PREVIEW</span>
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
              <linearGradient id="payoffChartFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stop-color="#e8953a" stop-opacity=".4" />
                <stop offset="1" stop-color="#e8953a" stop-opacity="0" />
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
          <div class="chart-label label-a">OTM</div>
          <div class="chart-label label-b">ATM</div>
          <div class="chart-label label-c">ITM</div>
        </div>
        <div class="positions">
          <span>Open legs</span>
          <strong>04</strong>
          <div class="position-bars">
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
          <div class="feature-number">
            {{ String(index + 1).padStart(2, "0") }}
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.body }}</p>
          <div class="feature-mark">{{ feature.mark }}</div>
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
        Create your free workspace <b>→</b>
      </a>
      <router-link v-else to="/papertrade" class="button button-primary">
        Open Paper Trade <b>→</b>
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
  --accent: #e07a2f;
  --muted: #708095;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  font-family: Georgia, "Times New Roman", serif;
  overflow: hidden;
}
.hero {
  min-height: 650px;
  padding: 160px max(7vw, 42px) 86px;
  position: relative;
  background: #f7f1e8;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.grid-lines {
  position: absolute;
  inset: 0;
  opacity: 0.45;
  background-image: linear-gradient(#e8ddd0 1px, transparent 1px),
    linear-gradient(90deg, #e8ddd0 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(to bottom, #000, transparent 85%);
}
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(2px);
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
  color: #b45309;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.eyebrow {
  display: flex;
  gap: 9px;
  align-items: center;
}
.eyebrow span {
  width: 20px;
  height: 1px;
  background: #b45309;
}
.hero h1 {
  font-size: clamp(42px, 4.8vw, 72px);
  font-weight: 400;
  letter-spacing: -0.055em;
  line-height: 0.99;
  margin: 23px 0;
}
.hero h1 em {
  color: #b45309;
  font-style: italic;
}
.hero-copy > p {
  max-width: 510px;
  color: #56677a;
  font-family: Arial, sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
}
.hero-actions {
  display: flex;
  gap: 13px;
  margin-top: 34px;
  flex-wrap: wrap;
}
.button {
  align-items: center;
  display: inline-flex;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  padding: 15px 19px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}
.button:hover {
  transform: translateY(-2px);
}
.button b {
  font-size: 18px;
  font-weight: 400;
  margin-left: 20px;
}
.button-primary {
  background: var(--ink);
  color: #fff;
}
.button-primary:hover {
  background: #28415e;
}
.button-secondary {
  background: rgba(255, 255, 255, 0.52);
  border: 1px solid #e2d0b8;
  color: var(--ink);
}
.trusted {
  color: #708095;
  font-family: Arial, sans-serif;
  font-size: 12px;
  margin-top: 35px;
}
.market-card {
  background: #17263c;
  box-shadow: 0 28px 70px rgba(29, 54, 65, 0.24);
  color: #fff;
  padding: 27px 29px 23px;
  position: absolute;
  right: max(6vw, 36px);
  top: 154px;
  transform: rotate(2.5deg);
  width: min(38vw, 495px);
  z-index: 2;
}
.card-top {
  display: flex;
  justify-content: space-between;
}
.card-top > div {
  display: grid;
  gap: 8px;
}
.card-label {
  color: #aab7c4;
  font-family: Arial, sans-serif;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.13em;
}
.card-top strong {
  font-size: 24px;
  font-weight: 400;
}
.live-dot {
  align-items: center;
  color: #f0b27a;
  display: flex;
  font-family: Arial, sans-serif;
  font-size: 11px;
  gap: 5px;
}
.live-dot:before {
  background: #e8953a;
  border-radius: 50%;
  content: "";
  height: 6px;
  width: 6px;
}
.card-change {
  display: flex;
  gap: 12px;
  margin-top: 15px;
  align-items: baseline;
}
.card-change span {
  color: #f0b27a;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
}
.card-change small {
  color: #91a1b2;
  font-family: Arial, sans-serif;
  font-size: 11px;
}
.legs {
  margin-top: 16px;
  display: grid;
  gap: 8px;
}
.leg-row {
  display: flex;
  justify-content: space-between;
  font-family: Arial, sans-serif;
  font-size: 12px;
  padding: 8px 10px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid #314055;
}
.leg-row span {
  color: #c5d0db;
}
.leg-row .buy {
  color: #f0b27a;
  font-weight: 700;
}
.leg-row .sell {
  color: #f0a8a0;
  font-weight: 700;
}
.chart-wrap {
  height: 150px;
  margin: 18px -5px 0;
  position: relative;
}
.chart-wrap svg {
  height: 100%;
  overflow: visible;
  width: 100%;
}
.chart-area {
  fill: url(#payoffChartFill);
}
.chart-line {
  fill: none;
  stroke: #e07a2f;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 3;
}
.chart-wrap circle {
  fill: #17263c;
  stroke: #f0b27a;
  stroke-width: 3;
}
.chart-label {
  bottom: -4px;
  color: #8493a3;
  font-family: Arial, sans-serif;
  font-size: 9px;
  position: absolute;
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
  color: #a7b2c0;
  display: flex;
  font-family: Arial, sans-serif;
  font-size: 11px;
  gap: 9px;
  margin-top: 14px;
  padding-top: 17px;
}
.positions strong {
  color: white;
  font-size: 13px;
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
  background: #e07a2f;
}
.feature-section {
  background: #f8f4ee;
  padding: 105px max(7vw, 42px);
}
.section-intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}
.section-intro h2,
.cta-section h2 {
  font-size: clamp(34px, 4vw, 56px);
  font-weight: 400;
  letter-spacing: -0.045em;
  line-height: 1.03;
  margin: 0;
}
.features {
  display: grid;
  gap: 1px;
  grid-template-columns: repeat(3, 1fr);
  margin-top: 65px;
}
.features article {
  background: #f3ebe0;
  min-height: 260px;
  padding: 29px;
  position: relative;
}
.feature-number {
  color: #c2782e;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
}
.features h3 {
  font-size: 23px;
  font-weight: 400;
  letter-spacing: -0.035em;
  margin: 48px 0 12px;
}
.features p {
  color: #68778a;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.65;
  max-width: 280px;
}
.feature-mark {
  bottom: 24px;
  color: #c2782e;
  font-family: Arial, sans-serif;
  font-size: 28px;
  position: absolute;
  right: 27px;
}
.cta-section {
  align-items: center;
  background: #f0d0a8;
  display: flex;
  flex-direction: column;
  min-height: 410px;
  justify-content: center;
  padding: 70px 25px;
  text-align: center;
}
.cta-section h2 {
  margin: 19px 0 29px;
}
.cta-section .button {
  min-width: 230px;
}
@media (max-width: 1100px) {
  .features {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 850px) {
  .hero {
    min-height: auto;
    padding-top: 135px;
    padding-bottom: 560px;
  }
  .hero-copy {
    width: 100%;
  }
  .market-card {
    left: 50%;
    right: auto;
    top: auto;
    bottom: 60px;
    transform: translateX(-50%) rotate(1.5deg);
    width: min(78vw, 480px);
  }
  .section-intro {
    display: block;
  }
  .section-intro h2 {
    margin-top: 19px;
  }
  .features {
    grid-template-columns: 1fr;
    margin-top: 40px;
  }
  .features article {
    min-height: 220px;
  }
  .features h3 {
    margin-top: 30px;
  }
}
@media (max-width: 520px) {
  .hero {
    padding-left: 25px;
    padding-right: 25px;
    padding-bottom: 520px;
  }
  .hero h1 {
    font-size: 42px;
  }
  .hero-actions {
    align-items: stretch;
    flex-direction: column;
  }
  .button {
    width: 100%;
  }
  .market-card {
    bottom: 48px;
    padding: 22px;
    width: calc(100% - 48px);
  }
  .chart-wrap {
    height: 120px;
  }
  .feature-section {
    padding: 75px 25px;
  }
  .features article {
    padding: 25px;
  }
  .cta-section {
    min-height: 355px;
  }
}
</style>

<style>
.dark .landing-page { --ink: #edf5f0; --paper: #101923; --accent: #e89b4d; --muted: #9baab7; background: var(--paper); }
.dark .landing-page .hero { background: #121f29; }.dark .landing-page .grid-lines { background-image: linear-gradient(rgba(180, 120, 60, .22) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 120, 60, .22) 1px, transparent 1px); }.dark .landing-page .orb-one { background: #3d2a1c; }.dark .landing-page .orb-two { border-color: #3a2818; }.dark .landing-page .eyebrow, .dark .landing-page .section-kicker { color: #e89b4d; }.dark .landing-page .eyebrow span { background: #e89b4d; }.dark .landing-page .hero h1 em { color: #f0b27a; }.dark .landing-page .hero-copy > p { color: #a6b6c3; }.dark .landing-page .button-primary { background: #e89b4d; color: #10212a; }.dark .landing-page .button-primary:hover { background: #f5c78a; }.dark .landing-page .button-secondary { background: rgba(255,255,255,.04); border-color: #314552; color: #edf5f0; }.dark .landing-page .trusted { color: #95a6b4; }.dark .landing-page .market-card { background: #1b2f3c; box-shadow: 0 28px 70px rgba(0,0,0,.38); }.dark .landing-page .card-label, .dark .landing-page .card-change small, .dark .landing-page .chart-label, .dark .landing-page .positions { color: #91a5b3; }.dark .landing-page .leg-row { background: rgba(0,0,0,.15); border-color: #38505d; }.dark .landing-page .chart-wrap circle { fill: #1b2f3c; }.dark .landing-page .positions { border-top-color: #38505d; }.dark .landing-page .feature-section { background: #101923; }.dark .landing-page .features article { background: #172630; }.dark .landing-page .feature-number, .dark .landing-page .feature-mark { color: #e89b4d; }.dark .landing-page .features p { color: #9dabb8; }.dark .landing-page .cta-section { background: #3a2818; }.dark .landing-page .cta-section .section-kicker { color: #f0b27a; }
</style>
