<template>
  <div class="chart flex items-center justify-center p-12">

<!-- <label class="inline-flex items-center">
    <input class="text-indigo-500 w-8 h-8 mr-2 focus:ring-indigo-400 focus:ring-opacity-25 border border-gray-300 rounded" type="checkbox" />
    Checkbox
  </label> -->

<div class="group cursor-pointer relative inline-block border-b border-gray-400 w-28 text-center">Hover over me
      <div class="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 ml-14 px-3 pointer-events-none">
        Tooltip center
        <svg class="absolute text-black h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255" xml:space="preserve"><polygon class="fill-current" points="0,0 127.5,127.5 255,0"/></svg>
      </div>
    </div>

<div class="flex items-center justify-center p-12">
  <div class=" relative inline-block text-left dropdown">
    <span class="rounded-md shadow-sm">
      <button class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-gray-700 border border-gray-700 rounded-md hover:text-gray-500 focus:outline-none  active:bg-gray-500 active:text-gray-800" 
       aria-haspopup="true" aria-expanded="true" aria-controls="headlessui-menu-items-117">
        <span></span>
        <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
        </button
    ></span>
    <div class="opacity-0 invisible dropdown-menu transition-all duration-300 transform origin-top-right -translate-y-2 scale-95">
      <div class="absolute right-0 w-56 mt-2 origin-top-right bg-gray-700 border border-gray-800 divide-y divide-gray-500 rounded-md shadow-lg outline-none" aria-labelledby="headlessui-menu-button-1" id="headlessui-menu-items-117" role="menu">
        <div class="px-4 py-3">         
          <!-- <p class="text-sm leading-5">Signed in as</p> -->
          
       
          <a href="javascript:void(0)" tabindex="0" class="text-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Account settings</a>
          <a href="javascript:void(0)" tabindex="1" class="text-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Support</a>
          <span role="menuitem" tabindex="-1" class="flex justify-between w-full px-4 py-2 text-sm leading-5 text-left text-gray-400 cursor-not-allowed opacity-50" aria-disabled="true">New feature (soon)</span>
          <a href="javascript:void(0)" tabindex="2" class="text-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left" role="menuitem" >License</a></div>

          <!-- <a href="javascript:void(0)" tabindex="3" class="text-gray-400 flex justify-between w-full px-4 py-2 text-sm leading-5 text-left"  role="menuitem" >Sign out</a> -->
      </div>
    </div>
  </div>
</div>              

  </div>
</template>

<script>
import myMixins from "../../shared/utilitymixins";
// import * as d3 from "d3";
export default {
  name: "Builder",
  components: {},
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {},
  data() {
    return {
      isOn: false,
      active: true,
      open: false,
      navigation: { categories: ["Home", "Home2", "Home3"] },
    };
  },
  methods: {

  },
  mounted() {
    //this.onload();
  },
  mixins: [myMixins],
  props: {},
};
</script>

<style>

.dropdown:focus-within .dropdown-menu {
  opacity:1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>