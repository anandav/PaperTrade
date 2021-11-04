!<template>
  <div class="dropdown">
    <button class="btn tooltip" data-dropdown-toggle="dropdown">
      <i class="material-icons">{{ Icon }}</i>
      <tooltip :Value="Tooltip" />
    </button>
    <div
      class="
        dropdown-menu
        opacity-0
        invisible
        transition-all
        duration-300
        transform
        origin-top-right
        -translate-y-2
        scale-95
       
        z-50
      "
    >
      <div
        class="
          absolute
          right-0
          w-36
          mt-2
          origin-top-right
          bg-gray-200
          dark:bg-gray-700
          border border-gray-800
          divide-y divide-gray-500
          rounded-md
          shadow-md
          outline-none
          
        z-50
        "
        role="menu"
      >
        <div class="px-1 py-1">
          <a
            @click="onItemClicked(Type, item._id, item.name)"
            :key="item._id"
            v-for="item in Items"
            v-bind:value="item._id"
            v-show="item._id != ExcludeItem"
            tabindex="0"
            class="
              text-gray-400
              justify-between
              inline-block
              w-full
              px-1
              py-1
              text-xs
              leading-5
              text-left
              cursor-pointer
              border-b border-gray-600
            "
            role="menuitem"
          >
            <span v-if="item.icon" class="text-left">
              <i class="material-icons text-sm">{{ item.icon }}</i>
            </span>
            {{ item.name }}
          </a>
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
    Tooltip: { type: String },
  },
  data: function () {
    return {};
  },
  computed: {},
  methods: {
    onItemClicked: function (type, id, name) {
      this.$emit("itemclicked", type, id, name);
    },
  },
};
</script>
<style>
.dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
}
</style>
