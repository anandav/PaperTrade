<template>
  <div id="app">
    <div class="header">
      <div class="wrapper">
        <router-link to="/papertrade" class="">Papet Trade</router-link>
        <router-link to="/about" class="">About</router-link>
      </div>
    </div>
   
    <router-view />
  </div>
</template>
<style scoped>

 

.header {
  height: 60px;
  min-width: 320px;
  box-sizing: border-box;
  z-index: 9;
  width: 100%;
  position: fixed;
  background-color: #282828;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
}

.wrapper {
  padding: 0;
  width: 100%;
  margin: 20px auto ;
  max-width: 1200px;
}

.wrapper a{
  color: antiquewhite;
  padding-right: 20px;
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
