<template>
  <div id="app" class="text-sm font-medium  text-gray-500 dark:text-gray-500">
    <nav class="py-5  bg-gray-200  dark:bg-gray-800">
      <router-link to="/papertrade" class="pl-48  ">Paper Trade</router-link>
      <router-link to="/builder" class="pl-5">Builder</router-link>
      <router-link to="/about" class="pl-5">About</router-link>
    </nav>

    <router-view />
  </div>
</template>

<!-- <style src="./index.css" /> -->

<style scoped>
</style>
