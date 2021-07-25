<template>
  <div id="app">
    <div class="header">
      <div class="wrapper">
        <router-link to="/papertrade" class="">Papet Trade</router-link>
        <router-link to="/about" class="">About</router-link>
      </div>
    </div>
    <!-- <nav class="navbar navbar-expand-lg shadow-sm p-3 mb-2">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/papertrade" class="nav-link">Papet Trade</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/about" class="nav-link">About</router-link>
        </li>
      </ul>
    </nav>-->
    <router-view />
  </div>
</template>
<style scoped>
body{
  background-color: #f0f;
}
.header {
  height: 60px;
  min-width: 320px;
  box-sizing: border-box;
  z-index: 9;
  width: 100%;
  position: fixed;
  background-color: #181818;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
}

.wrapper {
  padding: 0;
  width: 100%;
  margin: 0 auto;
  max-width: 1200px;
}

.wrapper a{
  margin: 10px;
}
/* nav a {
  font-weight: bold;
}
nav a.router-link-exact-active {
  color: #42b983;
}

html,
body {
  height: 100%;
}
html {
  height: 100%;
}
body {
  min-height: 100%;
} */
</style>
