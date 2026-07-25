<template>
  <footer
    class="
      fixed
      bottom-0
      left-0
      right-0
      z-50
      py-3
      px-4
      sm:px-6
      bg-gray-100
      dark:bg-gray-900
      dark:border-t
      dark:border-gray-800
      text-xs
      text-gray-400
      shadow-top
    "
  >
    <div class="footer-bar">
      <label class="theme-switch">
        <SwitchButton
          :IsDarkTheme="true"
          :Value="isdark"
          @itemclicked="swiththeme"
        />
        <span class="theme-label">Dark Mode</span>
      </label>
      <div class="footer-meta">
        <span>&copy; {{ currentYear }} Anand.AV</span>
        <span class="mx-2">&middot;</span>
        <span>{{ version }} ({{ buildSha }})</span>
      </div>
    </div>
  </footer>
</template>

<script>
import SwitchButton from "./SwitchButton";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

export default {
  components: {
    SwitchButton,
  },
  data() {
    const cookieValue = getCookie("isdark");
    return {
      isdark: cookieValue === null ? true : cookieValue === "true",
    };
  },
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    version() {
      return window.APP_CONFIG?.APP_VERSION || "v0.0.0";
    },
    buildSha() {
      return window.APP_CONFIG?.BUILD_SHA || "dev";
    },
  },
  methods: {
    swiththeme(value) {
      this.isdark = value;
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      let d = new Date();
      d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = "isdark=" + value + ";" + expires + ";path=/";
    },
  },
  mounted() {
    this.swiththeme(this.isdark);
  },
};
</script>

<style scoped>
.footer-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.theme-switch {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #56677a;
  white-space: nowrap;
  font-size: 11px;
}
:global(.dark) .theme-switch {
  color: #a6b6c3;
}
.footer-meta {
  text-align: right;
  margin-left: auto;
}
@media (max-width: 520px) {
  .theme-label {
    display: none;
  }
}
</style>
