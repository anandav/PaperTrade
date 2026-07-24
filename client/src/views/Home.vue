<template>
  <div class="home bg-white dark:bg-gray-900 min-h-screen">
    <div class="w-full px-5 pt-32 text-center">
      <h1 class="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Welcome to Paper Trade</h1>
      <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">Start your paper trading journey today.</p>
      <div class="flex justify-center gap-4">
        <router-link 
          v-if="isLoggedIn"
          to="/papertrade" 
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to App
        </router-link>
        <a 
          v-else
          href="#"
          @click.prevent="b2cLogin"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Get Started
        </a>
        <router-link 
          to="/about" 
          class="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
        >
          Learn More
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { apiUrl } from '../config';

export default {
  name: 'Home',
  computed: {
    ...mapGetters('authModule', ['isLoggedIn'])
  },
  methods: {
    b2cLogin() {
      window.location.href = apiUrl + 'auth/b2c/login';
    }
  }
}
</script>

<style scoped>
</style>
