<template>
  <div class="dropdown inline-block relative tooltip edit">
    <div>
      <input
        data-dropdown-toggle="dropdown"
        class="normal-edit"
        v-model="autocompleteValue"
        @keyup="onChange"
        :placeholder="PlaceHolder"
      />
    </div>
    <div
      class="
        dropdown-content
        hidden
        absolute
        bg-gray-300
        dark:bg-gray-700
        rounded
        w-36
        shadow-lg
        divide-y divide-gray-400
        dark:divide-gray-600
        divide-solid
        max-h-96
        overflow-auto
      "
    >
      <!-- <ul>
        <li>a</li>
        <li>b</li>
        <li>c</li>
      </ul> -->

      <!--<div
        :key="item.id"
        v-for="item in Items"
        v-bind:value="item.id"
        tabindex="0"
        class=""
      >

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
      </div>-->
    </div>
  </div>
</template>

<script>
export default {
  name: "AutoComplete",
  created: function () {
    this.autocompleteValue = this.Value;
  },
  data: function () {
    return {
      autocompleteValue: "",
    };
  },
  methods: {
    onChange: function () {
      this.$emit("keyup", this.autocompleteValue);
    },
  },
  props: {
    Value: { type: String },
    PlaceHolder: { type: String },
  },
};
</script>

<style>
</style>