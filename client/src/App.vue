<template>
  <div id="app" class="text-sm font-medium text-gray-500 dark:text-gray-400">
    <nav
      class="fixed w-screen z-50 py-4 shadow-md"
      :class="navSurfaceClass"
      role="navigation"
    >
      <div class="w-full px-6 flex items-center flex-wrap gap-y-2">
        <router-link to="/" class="brand">paper<span>trade</span></router-link>
        <div class="nav-links">
          <router-link v-if="isLoggedIn" to="/papertrade">Workspace</router-link>
          <router-link v-if="!isLoggedIn" to="/about">About</router-link>
        </div>
        <div class="ml-auto flex items-center">
          <span v-if="isLoggedIn && email" class="mr-4">{{ email }}</span>
          <button
            v-if="isLoggedIn"
            type="button"
            class="mr-3"
            @click="logout"
          >
            Logout
          </button>
          <button
            v-if="!isLoggedIn"
            type="button"
            class="login-link"
            @click="b2cLogin"
          >
            Log in <span>→</span>
          </button>
        </div>
      </div>
    </nav>
    <main role="main">
      <router-view />
    </main>
    <AppFooter />
    <ConfirmDialog />
  </div>
</template>

<script>
import AppFooter from "./components/ui/AppFooter";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import { mapGetters, mapActions } from "vuex";
import { apiUrl } from "./config";

export default {
  components: {
    AppFooter,
    ConfirmDialog,
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const refreshToken = urlParams.get("refreshToken");

    if (token) {
      this.$store
        .dispatch("authModule/b2cLogin", { token, refreshToken })
        .then(() => {
          this.$router.replace("/papertrade");
        });
    }
  },
  computed: {
    ...mapGetters("authModule", ["isLoggedIn", "username", "email"]),
    navSurfaceClass() {
      if (this.$route.name === "Home" || this.$route.name === "About") {
        return "nav-landing";
      }
      return "bg-gray-100 dark:bg-gray-900";
    },
  },
  methods: {
    ...mapActions("authModule", ["logout"]),
    logout() {
      this.$store.dispatch("authModule/logout");
    },
    b2cLogin() {
      window.location.href = apiUrl + "auth/b2c/login";
    },
  },
};
</script>

<style scoped>
.nav-landing {
  background-color: #f7f1e8;
}
.brand {
  color: #17263c;
  font-family: Georgia, "Times New Roman", serif;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.05em;
  text-decoration: none;
}
.brand span {
  color: #c2410c;
  font-style: italic;
}
.nav-links {
  display: flex;
  font-size: 12px;
  gap: 24px;
  margin-left: 44px;
}
.nav-links a {
  color: #7a8798;
  text-decoration: none;
}
.nav-links a.router-link-exact-active {
  color: #c2410c;
}
.login-link {
  color: #9a3412;
  cursor: pointer;
  font-size: 12px;
  margin-right: 0;
  text-decoration: none;
  background: transparent;
  border: 0;
  padding: 0;
  font: inherit;
}
.login-link span {
  margin-left: 4px;
}
@media (max-width: 520px) {
  .nav-links {
    margin-left: 22px;
  }
}
</style>

<style>
.dark #app .nav-landing { background-color: #121f29; }
.dark #app .brand { color: #f3f7f5; }
.dark #app .login-link { color: #e89b4d; }
.dark #app .nav-links a.router-link-exact-active { color: #e89b4d; }
</style>
