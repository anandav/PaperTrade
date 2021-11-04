<template>
  <div id="app" class="text-sm font-medium text-gray-500 dark:text-gray-400">
    <nav
      class="
        fixed
        w-screen
        z-50
        drop-shadow-md
        py-5
        bg-gray-200
        dark:bg-gray-900
      "
      role="navigation"
    >
      <div class="container mx-auto">
        <router-link to="/papertrade" class="pl-5">Paper Trade</router-link>
        <!-- <router-link to="/builder" class="pl-5">Builder</router-link>
        <router-link to="/about" class="pl-5">About</router-link> -->
        <div class="float-right">
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

export default {
  data: function () {
    return {
      isdark: true,
    };
  },
  components: {
    SwitchButton,
  },
  methods: {
    swiththeme: function (value) {
      // let _isdark = document.cookie["isdark"];
      //  console.log('document.cookie :> switch ', document.cookie);

      if (value) {
        document.documentElement.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
      }
    },
  },
  computed: {
    // isdark: {
    //   get: function () {
    //     let _isdark = document.cookie["isdark"];
    //     console.log('document.cookie :>> ', document.cookie);
    //     console.log('_isdark :>> ', _isdark);
    //     return _isdark;
    //   },
    //   set: function (value) {
    //     let d = new Date();
    //     d.setTime(d.getTime() + 1 * 24 * 60 * 60 * 1000);
    //     let expires = "expires=" + d.toUTCString();
    //     document.cookie = "isdark=" + value + ";" + expires + ";path=/";
    //   },
    // },
  },
  mounted() {
    // console.log('localStroage.isdark :>> before ');
    // if (localStorage != undefined && localStorage.isdark) {
    //   console.log('localStroage.isdark :>> ', localStroage.isdark);
    //   this.isdark = localStorage.isdark;
    // }
  },
  watch: {
    // isdark(newisdark) {
    //   console.log("newisdark :>> ", newisdark);
    //   localStorage.isdark = newisdark;
    // },
  },
};
</script>

<style scoped>
</style>
