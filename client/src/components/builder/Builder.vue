<template>
  <div>
    <h2 class="font-black text-3xl text-gray-900 mb-2">Solid</h2>
    <h3
      class="uppercase text-sm font-semibold tracking-wider text-gray-700 mb-2"
    >
      Small
    </h3>

    <div class="mb-6">
      <button class="btn btn-primary btn-sm mr-4">Primary</button>
      <button class="btn btn-secondary btn-sm mr-4">Secondary</button>
      <button class="btn btn-tertiary btn-sm">Tertiary</button>
    </div>

    <div class="mb-6">
      <h3
        class="
          uppercase
          text-sm
          font-semibold
          tracking-wider
          text-gray-700
          mb-2
        "
      >
        Default
      </h3>

      <button class="btn btn-primary mr-4">Primary</button>
      <button class="btn btn-secondary mr-4">Secondary</button>
      <button class="btn btn-tertiary">Tertiary</button>
    </div>

    <h3
      class="uppercase text-sm font-semibold tracking-wider text-gray-700 mb-2"
    >
      Large
    </h3>

    <button class="btn btn-primary btn-lg mr-4">Primary</button>
    <button class="btn btn-secondary btn-lg mr-4">Secondary</button>
    <button class="btn btn-tertiary btn-lg">Tertiary</button>
 <h2 class="font-black text-3xl text-gray-900 mb-2">Outline</h2>

  <div class="mb-6">
    <h3
      class="uppercase text-sm font-semibold tracking-wider text-gray-700 mb-2"
    >
      Small
    </h3>
    <button class="btn btn-primary btn-sm btn-outline mr-4">Primary</button>
    <button class="btn btn-secondary btn-sm btn-outline mr-4">Secondary</button>
    <button class="btn btn-tertiary btn-sm btn-outline mr-4">Tertiary</button>
  </div>

  <div class="mb-6">
    <h3
      class="uppercase text-sm font-semibold tracking-wider text-gray-700 mb-2"
    >
      Default
    </h3>
    <button class="btn btn-primary btn-outline mr-4">Primary</button>
    <button class="btn btn-secondary btn-outline mr-4">Secondary</button>
    <button class="btn btn-tertiary btn-outline mr-4">Tertiary</button>
  </div>

  <div class="mb-6">
    <h3
      class="uppercase text-sm font-semibold tracking-wider text-gray-700 mb-2"
    >
      Large
    </h3>
    <button class="btn btn-primary btn-lg btn-outline mr-4">Primary</button>
    <button class="btn btn-secondary btn-lg btn-outline mr-4">Secondary</button>
    <button class="btn btn-tertiary btn-lg btn-outline mr-4">Tertiary</button>
  </div>

<h2 class="font-black text-3xl text-gray-900 mb-2">Grouped</h2>

  <div class="flex items-center">
    <button
      class="btn border-l rounded-r-none border-b border-t rounded-l hover:bg-gray-100"
    >
      One
    </button>
    <button class="btn border rounded-none hover:bg-gray-100">Two</button>
    <button
      class="btn border-t border-r border-b rounded-l-none rounded-r hover:bg-gray-100"
    >
      Three
    </button>


    <h2 class="font-black text-3xl text-gray-900 mb-4">Dropdowns</h2>
  <button
    class="btn btn-primary flex items-center justify-between pr-3"
    @click.prevent="active = !active"
  >
    Dropdown
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      class="w-5 h-5 text-white fill-current ml-2 transform transition duration-200"
      :class="{ 'rotate-180': active }"
    >
      <title>chevron-down</title>

      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M5.293 7.293a1 1 0 0 1 1.414 0L10 10.586l3.293-3.293a1 1 0 1 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 0-1.414z"
      ></path>
    </svg>
  </button>

  <ul
    v-if="active"
    class="list-reset bg-white border p-4 rounded-b-lg shadow-xl w-64"
  >
    <li>
      <a href="#" class="px-3 py-2 hover:bg-gray-100 rounded block mb-1"
        >Item 1</a
      >
    </li>
    <li>
      <a href="#" class="px-3 py-2 hover:bg-gray-100 rounded block mb-1"
        >Item 2</a
      >
    </li>
    <li>
      <a href="#" class="px-3 py-2 hover:bg-gray-100 rounded block mb-1"
        >Item 3</a
      >
    </li>
  </ul>
  </div>


  </div>
</template>

<script>
import myMixins from "../../shared/utilitymixins";
//import * as d3js from 'd3';
export default {
  name: "Builder",
  components: {},
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {
    //console.log(d3js);
  },
  data() {
    return {
      active : true,
      open: false,
      navigation: { categories: ["Home", "Home2", "Home3"] },
    };
  },
  methods: {},
  mixins: [myMixins],
  props: {},
};
</script>

<style>
</style>