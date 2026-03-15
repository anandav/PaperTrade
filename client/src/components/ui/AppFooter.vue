<template>
  <footer class="w-full py-3 mt-auto bg-gray-100 dark:bg-gray-900 dark:border-t dark:border-gray-800 text-center text-xs text-gray-400">
    <span>&copy; {{ currentYear }} Anand.AV</span>
    <span class="mx-2">&middot;</span>
    <span>{{ version }} ({{ buildSha }})</span>
  </footer>
</template>

<script>
export default {
  computed: {
    currentYear() {
      return new Date().getFullYear();
    },
    version() {
      return window.APP_CONFIG?.APP_VERSION || 'v0.0.0';
    },
    buildSha() {
      return window.APP_CONFIG?.BUILD_SHA || 'dev';
    },
  },
};
</script>
