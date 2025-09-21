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
      <div class="container mx-auto">
        <router-link to="/" class="pl-5">Paper Trade</router-link>
        <router-link to="/builder" class="pl-5"> Place holder</router-link>
        <!-- <router-link to="/about" class="pl-5">About</router-link> -->
        <div class="float-right">
          <button v-if="isLoggedIn" @click="logout" class="mr-3">Logout</button>
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
  </div>
</template>

<script>
import SwitchButton from "./components/ui/SwitchButton";
import { mapGetters, mapActions } from 'vuex';


function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default {
  data() {
    // Read theme from cookie on initialization
    const cookieValue = getCookie("isdark");
    return {
      isdark: cookieValue === "true",
    };
  },
  components: {
    SwitchButton,
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      this.$store.dispatch('authModule/b2cLogin', token)
        .then(() => {
          this.$router.replace('/');
        });
    }
  },
  computed: {
    ...mapGetters('authModule', ['isLoggedIn']),
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
      this.$store.dispatch('authModule/logout')
        .then(() => {
          this.$router.push('/login');
        });
    }
  },
  mounted() {
    this.swiththeme(this.isdark);
  },
};
</script>

<style scoped></style>
