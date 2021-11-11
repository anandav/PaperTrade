!<template>
  <div class="dropdown inline-block relative tooltip">
    <button class="btn" data-dropdown-toggle="dropdown" tabindex="0">
      <i class="material-icons">{{ Icon }}</i>
      <tooltip :Value="Tooltip" />
    </button>
    <div
      class="
        dropdown-content
        hidden
        absolute
        bg-gray-300
        dark:bg-gray-700
        rounded
        w-36
        -ml-10
        shadow-lg
        divide-y divide-gray-400 dark:divide-gray-600  divide-solid

        max-h-96
        overflow-auto
      "
      role="menuitem"
    >
      <div
        :key="item._id"
        v-for="item in Items"
        v-bind:value="item._id"
        tabindex="0"
        class=""
      >
            <!-- border-t 
            border-gray-400 -->
        <a
          class="
            block
            hover:bg-gray-400
            dark:hover:bg-gray-600
            cursor-pointer
            hover:rounded-sm
            py-2
            px-2
          "
          v-if="item._id != ExcludeItem"
          @click="onItemClicked(Type, item._id, item.name)"
        >
          <span v-if="item.icon" class="text-left">
            <i class="material-icons text-sm">{{ item.icon }}</i>
          </span>
          {{ item.name }}</a
        >
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
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
