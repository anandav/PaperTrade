<template>
  <div class="workspace flex min-h-screen bg-gray-100 dark:bg-gray-900">
    <div
      v-if="menuOpen"
      class="workspace-backdrop fixed inset-0 z-30 bg-black bg-opacity-40 lg:hidden"
      @click="closeMenu"
    />
    <PortfolioMenu
      class="portfolio-drawer"
      :class="{ 'is-open': menuOpen }"
      @portfolio-selected="onPortfolioSelected"
    />
    <div class="workspace-main flex-1 pt-16 pb-16 min-w-0">
      <div
        class="
          workspace-toolbar
          sticky
          top-16
          z-20
          flex
          items-center
          gap-2
          px-3
          py-2
          border-b border-gray-300
          dark:border-gray-800
          bg-gray-100
          dark:bg-gray-900
          lg:hidden
        "
      >
        <button
          type="button"
          class="btn workspace-menu-btn"
          aria-label="Open portfolio list"
          :aria-expanded="menuOpen ? 'true' : 'false'"
          @click="toggleMenu"
        >
          <i class="material-icons">menu</i>
          <span class="workspace-menu-label">Portfolios</span>

        </button>
      </div>
      <PortfolioDetail />
    </div>
  </div>
</template>
<style scoped>
.portfolio-drawer {
  position: fixed;
  top: 4rem;
  bottom: 2.5rem;
  left: 0;
  z-index: 40;
  width: 16rem;
  max-width: 85vw;
  transform: translateX(-100%);
  transition: transform 0.2s ease-out;
}
.portfolio-drawer.is-open {
  transform: translateX(0);
}
.workspace-main {
  margin-left: 0;
}
.workspace-menu-btn {
  align-items: center;
  gap: 0.35rem;
  width: auto;
  min-width: auto;
  height: 2rem;
  min-height: 2rem;
  padding: 0 0.65rem;
}
.workspace-menu-label {
  font-size: 0.8125rem;
  line-height: 1;
}
@media (min-width: 1024px) {
  .portfolio-drawer {
    transform: translateX(0);
    width: 13rem;
    max-width: none;
  }
  .workspace-main {
    margin-left: 13rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .portfolio-drawer {
    transition: none;
  }
}
</style>
<script>
import PortfolioMenu from "./PortfolioMenu";
import PortfolioDetail from "./PortfolioDetail";

export default {
  name: "PaperTrade",
  components: {
    PortfolioMenu,
    PortfolioDetail,
  },
  data() {
    return {
      menuOpen: false,
    };
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    closeMenu() {
      this.menuOpen = false;
    },
    onPortfolioSelected() {
      this.menuOpen = false;
    },
  },
};
</script>
