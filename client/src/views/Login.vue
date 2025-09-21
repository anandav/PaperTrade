<template>
  <div class="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
    <div class="w-full max-w-md">
      <form class="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4" @submit.prevent="login">
        <div v-if="error" class="mb-4 text-red-500">
          {{ error }}
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="username">
            Username
          </label>
          <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
        </div>
        <div class="mb-6">
          <label class="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" for="password">
            Password
          </label>
          <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
        </div>
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
            Sign In
          </button>
          <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="http://localhost:9090/auth/b2c/resetpassword">
            Forgot Password?
          </a>
        </div>

        <div class="flex items-center justify-between mt-4">
          <button @click="b2cLogin" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
            Login with B2C
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: null
    };
  },
  created() {
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error_description');
    if (error) {
      this.error = error;
    }
  },
  methods: {
    login() {
      this.$store.dispatch('authModule/login', { username: this.username, password: this.password })
        .then(() => {
          this.$router.push('/');
        })
        .catch(err => {
          console.error(err);
        });
    },

    b2cLogin() {
      window.location.href = 'http://localhost:9090/auth/b2c/login';
    }
  }
};
</script>
