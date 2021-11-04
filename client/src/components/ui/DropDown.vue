!<template>
  <div class="dropdown inline-block relative">
    <button class="btn" data-dropdown-toggle="dropdown" tabindex="0">
      <i class="material-icons">{{ Icon }}</i>
    </button>
    <div
      class="
        dropdown-content
        hidden
        absolute
        z-10
        bg-gray-700
        rounded-sm
        p-1
        w-36
        shadow-lg"
      role="menuitem"
    >
      <a
        class="block p-1 border-t border-gray-600 hover:bg-gray-600 cursor-pointer"
        @click="onItemClicked(Type, item._id, item.name)"
        :key="item._id"
        v-for="item in Items"
        v-bind:value="item._id"
        v-show="item._id != ExcludeItem"
        tabindex="0"
      >
        <span v-if="item.icon" class="text-left">
          <i class="material-icons text-sm">{{ item.icon }}</i>
        </span>
        {{ item.name }}</a
      >
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
/* .dropdown:focus-within .dropdown-menu {
  opacity: 1;
  transform: translate(0) scale(1);
  visibility: visible;
} */

.dropdown:hover .dropdown-content {
  display: block;
}
</style>
