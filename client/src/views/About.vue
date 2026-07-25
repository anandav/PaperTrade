<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="orb orb-one"></div>
      <div class="orb orb-two"></div>
      <div class="grid-lines"></div>
      <div class="about-hero-copy">
        <div class="eyebrow"><span></span> About</div>
        <h1>
          A focused space to practice<br />
          before you risk <em>the money.</em>
        </h1>
        <p>
          PaperTrade is a practice workspace for options and futures. Build
          multi-leg strategies, review payoff graphs, and learn the workflow
          without putting real capital at risk.
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
          <router-link to="/" class="button button-secondary">Back to home</router-link>
        </div>
      </div>
    </section>

    <section class="about-body">
      <div class="about-grid">
        <article>
          <span class="num">01</span>
          <h2>What it is</h2>
          <p>
            A focused workspace for portfolios, strategies, and simulated trades.
            Test ideas in a clear environment instead of a noisy terminal.
          </p>
        </article>
        <article>
          <span class="num">02</span>
          <h2>Who it is for</h2>
          <p>
            Traders who want to rehearse multi-leg option structures, track
            simulated PnL, and build habit around process before trading live.
          </p>
        </article>
        <article>
          <span class="num">03</span>
          <h2>What you can do</h2>
          <ul>
            <li>Create portfolios and strategies</li>
            <li>Add calls, puts, and futures legs</li>
            <li>Open payoff charts on demand</li>
            <li>Refresh LTP-style prices when data API is enabled</li>
            <li>Search portfolios and organize your practice book</li>
          </ul>
        </article>
        <article>
          <span class="num">04</span>
          <h2>Your practice, saved</h2>
          <p>
            Sign in to keep your portfolios and strategies ready for the next
            time you want to learn.
          </p>
        </article>
        <article>
          <span class="num">05</span>
          <h2>Markets</h2>
          <p>
            Built for familiar options and futures workflows. Paper trading only:
            no real orders are ever sent to a broker.
          </p>
        </article>
        <article>
          <span class="num">06</span>
          <h2>Theme</h2>
          <p>
            Choose a light or dark workspace that stays comfortable through every
            planning session.
          </p>
        </article>
      </div>
    </section>

    <section class="about-cta">
      <span class="eyebrow center">Ready when you are</span>
      <h2>Practice the full workflow<br />with zero capital at risk.</h2>
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
  name: "About",
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
.about-page {
  --ink: #17263c;
  --paper: #f8f4ee;
  background: var(--paper);
  color: var(--ink);
  min-height: 100vh;
  font-family: Georgia, "Times New Roman", serif;
  padding-bottom: 48px;
}
.about-hero {
  position: relative;
  overflow: hidden;
  background: #f7f1e8;
  padding: 150px max(7vw, 42px) 80px;
}
.grid-lines {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  background-image: linear-gradient(#e8ddd0 1px, transparent 1px),
    linear-gradient(90deg, #e8ddd0 1px, transparent 1px);
  background-size: 52px 52px;
  mask-image: linear-gradient(to bottom, #000, transparent 90%);
}
.orb {
  position: absolute;
  border-radius: 50%;
}
.orb-one {
  width: 360px;
  height: 360px;
  background: #f3d9b8;
  right: -80px;
  top: -120px;
}
.orb-two {
  width: 280px;
  height: 280px;
  border: 48px solid #ecd9c2;
  left: -140px;
  bottom: -160px;
}
.about-hero-copy {
  position: relative;
  z-index: 1;
  max-width: 720px;
}
.eyebrow {
  color: #b45309;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  display: flex;
  gap: 9px;
  align-items: center;
}
.eyebrow.center {
  justify-content: center;
}
.eyebrow span {
  width: 20px;
  height: 1px;
  background: #b45309;
}
.about-hero h1 {
  font-size: clamp(36px, 4.5vw, 58px);
  font-weight: 400;
  letter-spacing: -0.05em;
  line-height: 1.02;
  margin: 22px 0 18px;
}
.about-hero h1 em {
  color: #b45309;
  font-style: italic;
}
.about-hero-copy > p {
  max-width: 560px;
  color: #56677a;
  font-family: Arial, sans-serif;
  font-size: 16px;
  line-height: 1.7;
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.button {
  align-items: center;
  display: inline-flex;
  font-family: Arial, sans-serif;
  font-size: 13px;
  font-weight: 700;
  justify-content: center;
  padding: 14px 18px;
  text-decoration: none;
  transition: transform 0.2s, background 0.2s;
}
.button:hover {
  transform: translateY(-2px);
}
.button b {
  font-size: 18px;
  font-weight: 400;
  margin-left: 16px;
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
.about-body {
  padding: 72px max(7vw, 42px) 40px;
}
.about-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: transparent;
}
.about-grid article {
  background: #f3ebe0;
  min-height: 220px;
  padding: 28px;
}
.about-grid .num {
  color: #c2782e;
  font-family: Arial, sans-serif;
  font-size: 11px;
  font-weight: 700;
}
.about-grid h2 {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -0.03em;
  margin: 36px 0 12px;
}
.about-grid p,
.about-grid li {
  color: #68778a;
  font-family: Arial, sans-serif;
  font-size: 13px;
  line-height: 1.65;
}
.about-grid ul {
  margin: 0;
  padding-left: 18px;
}
.about-grid li {
  margin-bottom: 6px;
}
.about-cta {
  margin: 40px max(7vw, 42px) 80px;
  background: #f0d0a8;
  text-align: center;
  padding: 64px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.about-cta h2 {
  font-size: clamp(30px, 3.5vw, 48px);
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1.05;
  margin: 16px 0 28px;
}
:global(.dark) .about-page {
  --ink: #edf5f0;
  --paper: #101923;
  background: var(--paper);
}
:global(.dark) .about-hero {
  background: #121f29;
}
:global(.dark) .grid-lines {
  background-image: linear-gradient(
      rgba(180, 120, 60, 0.22) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(180, 120, 60, 0.22) 1px, transparent 1px);
}
:global(.dark) .orb-one {
  background: #3d2a1c;
}
:global(.dark) .orb-two {
  border-color: #3a2818;
}
:global(.dark) .eyebrow {
  color: #e89b4d;
}
:global(.dark) .eyebrow span {
  background: #e89b4d;
}
:global(.dark) .about-hero h1 em {
  color: #f0b27a;
}
:global(.dark) .about-hero-copy > p {
  color: #a6b6c3;
}
:global(.dark) .button-primary {
  background: #e89b4d;
  color: #10212a;
}
:global(.dark) .button-primary:hover {
  background: #f5c78a;
}
:global(.dark) .button-secondary {
  background: rgba(255, 255, 255, 0.04);
  border-color: #314552;
  color: #edf5f0;
}
:global(.dark) .about-grid article {
  background: #172630;
}
:global(.dark) .about-grid .num {
  color: #e89b4d;
}
:global(.dark) .about-grid p,
:global(.dark) .about-grid li {
  color: #9dabb8;
}
:global(.dark) .about-cta {
  background: #3a2818;
}
@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 600px) {
  .about-hero {
    padding: 130px 24px 56px;
  }
  .about-body {
    padding: 48px 24px 24px;
  }
  .about-grid {
    grid-template-columns: 1fr;
  }
  .about-cta {
    margin: 24px 16px 72px;
  }
  .hero-actions {
    flex-direction: column;
  }
  .button {
    width: 100%;
  }
}
</style>

<style>
.dark .about-page { --ink: #edf5f0; --paper: #101923; background: var(--paper); }
.dark .about-page .about-hero { background: #121f29; }.dark .about-page .grid-lines { background-image: linear-gradient(rgba(180, 120, 60, .22) 1px, transparent 1px), linear-gradient(90deg, rgba(180, 120, 60, .22) 1px, transparent 1px); }.dark .about-page .orb-one { background: #3d2a1c; }.dark .about-page .orb-two { border-color: #3a2818; }.dark .about-page .eyebrow { color: #e89b4d; }.dark .about-page .eyebrow span { background: #e89b4d; }.dark .about-page .about-hero h1 em { color: #f0b27a; }.dark .about-page .about-hero-copy > p { color: #a6b6c3; }.dark .about-page .button-primary { background: #e89b4d; color: #10212a; }.dark .about-page .button-primary:hover { background: #f5c78a; }.dark .about-page .button-secondary { background: rgba(255,255,255,.04); border-color: #314552; color: #edf5f0; }.dark .about-page .about-grid article { background: #172630; }.dark .about-page .about-grid .num { color: #e89b4d; }.dark .about-page .about-grid p, .dark .about-page .about-grid li { color: #9dabb8; }.dark .about-page .about-cta { background: #3a2818; }
</style>
