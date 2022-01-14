<template>
  <div class="container ">

<div class="pt-52 p-4 space-y-4 bg-light-blue-300 bg-stripes bg-stripes-white rounded-md">
    <span class="block rounded-md text-white font-extrabold text-center p-6 bg-red-500   visible sm:invisible">1</span>
    <span class="block rounded-md text-white font-extrabold text-center p-6 bg-green-500 invisible md:visible">2</span>
    <span class="block rounded-md text-white font-extrabold text-center p-6 bg-blue-500  invisible lg:visible">3</span>
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
    return {};
  },
  methods: {},
  mounted() {},
  // mixins: [myMixins],
  props: {
    activeTab: { type: String, default: "code" },
  },
};
</script>
.dropdown:hover .dropdown-menu {
  display: block;
}


<style>
</style>