<template>
  <div>
    <div class=" lg:ml-8 lg:block lg:self-stretch">
      <div class="h-full flex space-x-8">
        <div
          v-for="category in navigation.categories"
          :key="category.name"
          class="flex"
         
        >
          <div class="relative flex">
            <button
              :class="[
                open
                  ? 'border-indigo-600 text-indigo-600'
                  : 'border-transparent text-gray-700 hover:text-gray-800',
                'relative z-10 flex items-center transition-colors ease-out duration-200 text-sm font-medium border-b-2 -mb-px pt-px',
              ]"
            >
              {{ category.name }}
            </button>
          </div>

          <transition
            enter-active-class="transition ease-out duration-200"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-150"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div
              class="absolute top-full inset-x-0 text-sm text-gray-500"
            >
              <!-- Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow -->
              <div
                class="absolute inset-0 top-1/2 bg-white shadow"
                aria-hidden="true"
              />

              <div class="relative bg-white">
                <div class="max-w-7xl mx-auto px-8">
                  <div class="grid grid-cols-2 gap-y-10 gap-x-8 py-16">
                    <div class="col-start-2 grid grid-cols-2 gap-x-8">
                      <div
                        v-for="item in category.featured"
                        :key="item.name"
                        class="group relative text-base sm:text-sm"
                      >
                        <div
                          class="
                            aspect-w-1 aspect-h-1
                            rounded-lg
                            bg-gray-100
                            overflow-hidden
                            group-hover:opacity-75
                          "
                        >
                          <img
                            :src="item.imageSrc"
                            :alt="item.imageAlt"
                            class="object-center object-cover"
                          />
                        </div>
                        <a
                          :href="item.href"
                          class="mt-6 block font-medium text-gray-900"
                        >
                          <span
                            class="absolute z-10 inset-0"
                            aria-hidden="true"
                          />
                          {{ item.name }}
                        </a>
                        <p aria-hidden="true" class="mt-1">Shop now</p>
                      </div>
                    </div>
                    <div
                      class="
                        row-start-1
                        grid grid-cols-3
                        gap-y-10 gap-x-8
                        text-sm
                      "
                    >
                      <div
                        v-for="section in category.sections"
                        :key="section.name"
                      >
                        <p
                          :id="`${section.name}-heading`"
                          class="font-medium text-gray-900"
                        >
                          {{ section.name }}
                        </p>
                        <ul
                          role="list"
                          :aria-labelledby="`${section.name}-heading`"
                          class="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                        >
                          <li
                            v-for="item in section.items"
                            :key="item.name"
                            class="flex"
                          >
                            <a :href="item.href" class="hover:text-gray-800">
                              {{ item.name }}
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <a
          v-for="page in navigation.pages"
          :key="page.name"
          :href="page.href"
          class="
            flex
            items-center
            text-sm
            font-medium
            text-gray-700
            hover:text-gray-800
          "
          >{{ page.name }}</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import PortfolioMenu from "../PortfolioMenu";
import myMixins from "../../shared/utilitymixins";
//import * as d3js from 'd3';
export default {
  name: "Builder",
  components: {
    PortfolioMenu,
  },
  computed: {
    //   ...mapState(["TradeDetail","Portfolio"])
  },
  created() {
    //console.log(d3js);
  },
  data() {
    return {
      open : false,
      navigation : {categories :["Home","Home2","Home3"]}
    };
  },
  methods: {},
  mixins: [myMixins],
  props: {},
};
</script>

<style>
</style>