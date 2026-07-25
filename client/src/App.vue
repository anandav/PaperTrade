<template>
  <div id="app" class="text-sm font-medium text-gray-500 dark:text-gray-400">
    <nav class="
        fixed
        w-screen
        z-50
        drop-shadow-md
        py-5
        bg-gray-100
        dark:bg-gray-900 
        dark:border-b 
        dark:border-gray-800
      " role="navigation">
      <div class="w-full px-5">
        <router-link to="/" class="pl-5">Home</router-link>
        <router-link v-if="isLoggedIn" to="/papertrade" class="pl-5">Paper Trade</router-link>
        <router-link v-if="!isLoggedIn" to="/about" class="pl-5">About</router-link>
        <div class="float-right">
          <span v-if="isLoggedIn && email" class="mr-4">{{ email }}</span>
          <button v-if="isLoggedIn" @click="logout" class="mr-3">Logout</button>
          <a v-if="!isLoggedIn" @click.prevent="b2cLogin" href="#" class="mr-3 cursor-pointer text-orange-400">Login</a>
          <label class="mr-3">
            <SwitchButton :IsDarkTheme="true" :Value="isdark" @itemclicked="swiththeme" />
            Dark Mode
          </label>
        </div>
      </div>
    </nav>
    <main role="main">
      <router-view />
    </main>
    <AppFooter />
  </div>
</template>

<script>
import SwitchButton from "./components/ui/SwitchButton";
import AppFooter from "./components/ui/AppFooter";
import { mapGetters, mapActions } from 'vuex';
import { apiUrl } from './config';


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default {
  data() {
    const cookieValue = getCookie("isdark");
    return {
      isdark: cookieValue === null ? true : cookieValue === "true",
    };
  },
  components: {
    SwitchButton,
    AppFooter,
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const refreshToken = urlParams.get('refreshToken');

    if (token) {
      this.$store.dispatch('authModule/b2cLogin', { token, refreshToken })
        .then(() => {
          this.$router.replace('/papertrade');
        });
    }
  },
  computed: {
    ...mapGetters('authModule', ['isLoggedIn', 'username', 'email']),
  },
  methods: {
    ...mapActions('authModule', ['logout']),
    swiththeme(value) {
      this.isdark = value;
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      // Set cookie
      let d = new Date();
      d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
      let expires = "expires=" + d.toUTCString();
      document.cookie = "isdark=" + value + ";" + expires + ";path=/";
    },
    logout() {
      this.$store.dispatch('authModule/logout');
    },
    b2cLogin() {
      window.location.href = apiUrl + 'auth/b2c/login';
    }
  },
  mounted() {
    this.swiththeme(this.isdark);
  },
};
</script>

<style scoped></style>
