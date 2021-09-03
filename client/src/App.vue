<template>
  <div id="app" class="text-sm font-medium text-gray-500 dark:text-gray-400">
    <nav class="drop-shadow-md  py-5 bg-gray-200 dark:bg-gray-700">
      <div class="container mx-auto ">
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
    <router-view />
  </div>
</template>

<script>
export default {
  methods: {
    swiththeme: function () {
      var _html = document.getElementsByTagName("html")[0];
      if (this.isdark) {
        _html.classList.add("dark");
      } else {
        _html.classList.remove("dark");
      }
    },
  },
  data: function () {
    return {
      isdark: true,
    };
  },
};
</script>

<style scoped>
</style>
