!<template>
  <div class="dropdown">
    <button class="btn ml-3">
      <i class="material-icons">{{ Icon }}</i>
    </button>
    <div
      class="
        opacity-0
        invisible
        dropdown-menu
        transition-all
        duration-300
        transform
        origin-top-right
        -translate-y-2
        scale-95
      "
    >
      <div
        class="
          absolute
          right-0
          w-36
          mt-2
          origin-top-right
          bg-gray-700
          border border-gray-800
          divide-y divide-gray-500
          rounded-md
          shadow-md
          outline-none
        "
        role="menu"
      >
        <div class="px-1 py-1">
          <a
            @click="onItemClicked(Type, item._id)"
            :key="item._id"
            v-for="item in Items"
            v-bind:value="item._id"
            v-show="item._id != ExcludeItem"
            tabindex="0"
            class="
              text-gray-400
              flex
              justify-between
              w-full
              px-1
              py-1
              text-sm
              leading-5
              text-left
            "
            role="menuitem"
            >{{ item.name }}</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  props: {
    Type: { type: String },
    ExcludeItem: { type: String },
    Items: { type: Array },
    Icon: { type: String },
  },
  methods: {
    onItemClicked: function (type, id) {
      this.$emit("itemclicked", type, id);
    },
  },
};
</script>
<style>
</style>
