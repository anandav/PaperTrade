<template>
  <div id="app" class="text-sm font-medium text-gray-500 dark:text-gray-400">
    <nav
      class="
        fixed
        w-screen
        z-50
        drop-shadow-md
        py-5
        bg-gray-100
        dark:bg-gray-900 
        dark:border-b 
        dark:border-gray-800
      "
      role="navigation"
    >
      <div class="container mx-auto">
        <router-link to="/" class="pl-5">Paper Trade</router-link>
        <router-link to="/builder" class="pl-5"
          > Place holder</router-link
        >
        <!-- <router-link to="/about" class="pl-5">About</router-link> -->
        <div class="float-right">
          <button v-if="isLoggedIn" @click="logout" class="mr-3">Logout</button>
          <label class="mr-3">
            <SwitchButton
              :IsDark="true"
              :Value="false"
              @itemclicked="swiththeme"
            />
            <!-- <input
              type="checkbox"
              class="mini-checkbox"
              v-model="isdark"
              @change="swiththeme()"
            /> -->
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

export default {
  data: function () {
    return {
      isdark: true,
    };
  },
  components: {
    SwitchButton,
  },
  computed: {
    ...mapGetters('authModule', ['isLoggedIn']),
      isdark: {
  get: function () {
    let _isdark = document.cookie["isdark"];
    return _isdark;
  },
  set: function (value) {
    let d = new Date();
    d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    let expires = "expires=" + d.toUTCString();
    document.cookie = "isdark=" + value + ";" + expires + ";path=/";
  }
},


  },
  methods: {
    ...mapActions('authModule', ['logout']),
    swiththeme: function (value) {
      if (value) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    },
    logout() {
      this.$store.dispatch('authModule/logout')
        .then(() => {
          this.$router.push('/login');
        });
    }
  },
  mounted() {
    // if (localStorage != undefined && localStorage.isdark) {
    //   this.isdark = localStorage.isdark;
    // }
  },
  watch: {
    // isdark(newisdark) {
    //   localStorage.isdark = newisdark;
    // },
  },
};
</script>

<style scoped>
</style>
