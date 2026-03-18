<template>
  <footer class="fixed bottom-0 left-0 right-0 z-50 py-3 bg-gray-100 dark:bg-gray-900 dark:border-t dark:border-gray-800 text-center text-xs text-gray-400 shadow-top">
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
