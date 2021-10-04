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
        dark:bg-gray-800
      "
    >
      <div class="container mx-auto">
        <router-link to="/papertrade" class="pl-5">Paper Trade</router-link>
        <router-link to="/builder" class="pl-5">Builder</router-link>
        <router-link to="/about" class="pl-5">About</router-link>
        <div class="float-right">
          <label class="mr-3">
            <input type="checkbox" v-model="isdark" @change="swiththeme()" />
            Dark Mode
          </label>
        </div>
      </div>
    </nav>
    <!-- <nav class="drop-shadow-md py-5 bg-gray-200 dark:bg-gray-800">
      <div class="container mx-auto">
        <router-link to="/papertrade" class="pl-5">Paper Trade</router-link>
        <router-link to="/builder" class="pl-5">Builder</router-link>
        <router-link to="/about" class="pl-5">About</router-link>
        <div class="float-right">
          <label class="mr-3">
            <input type="checkbox" v-model="isdark" @change="swiththeme()" />
            Dark Mode
          </label>
        </div>
      </div>
    </nav> -->
    <router-view />
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      isdark: true,
    };
  },
  methods: {
    swiththeme: function () {
      if (this.isdark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    },
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
