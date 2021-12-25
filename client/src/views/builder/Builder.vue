<template>
  <div class="container ">


<!-- 
    <div class="relative inline-block text-left mt-96 ml-96">
  <div>
    <button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500" id="menu-button" aria-expanded="true" aria-haspopup="true">
      Options
 
      <svg class="-mr-1 ml-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>


  <div class="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
    <div class="py-1" role="none">
      <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-0">Account settings</a>
      <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-1">Support</a>
      <a href="#" class="text-gray-700 block px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-2">License</a>
      <form method="POST" action="#" role="none">
        <button type="submit" class="text-gray-700 block w-full text-left px-4 py-2 text-sm" role="menuitem" tabindex="-1" id="menu-item-3">
          Sign out
        </button>
      </form>
    </div>
  </div>
</div> -->
      <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->


<div class="p-20">
      <div class="group inline-block relative">
        <button
          class="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded inline-flex items-center"
        >
          
<i class="material-icons">menu</i>

        </button>
        <ul class="absolute hidden text-gray-700 pt-1 group-hover:block">
          <li class="">
            <a
              class="rounded-t bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
              href="#"
              >One</a
            >
          </li>
          <li class="">
            <a
              class="bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
              href="#"
              >Two</a
            >
          </li>
          <li class="">
            <a
              class="rounded-b bg-gray-200 hover:bg-gray-400 py-2 px-4 block whitespace-no-wrap"
              href="#"
              >Three is the magic number</a
            >
          </li>
        </ul>
      </div>
    </div>

    
  </div>
</template>

<script>
export default {
  name: "Builder",
  components: {},
  computed: {},
  created() {},
  data: function () {
    return {
      
    };
  },
  methods: {},
  mounted() {},
  // mixins: [myMixins],
  props: {
    activeTab: {type : String , default : "code"},
  },
};
</script>
.dropdown:hover .dropdown-menu {
  display: block;
}


<style>
</style>