<template>
  <div class="dropdown inline-block relative edit">
    <div>
      <input
        data-dropdown-toggle="dropdown"
        class="normal-edit"
        :list="componentid"
        @change="onChange"
        @keyup="onKeyUp"
        @keyup.enter="onEnterKeyup"
        :placeholder="PlaceHolder"
        v-model="autocompleteValue"
      />
      <datalist :id="componentid">
        <option :key="item.name" v-bind:id="item.name" v-for="item in Items">
          {{ item.name }}
        </option>
      </datalist>
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
    const guidGenerator = function () {
      var S4 = function () {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      };
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    };
    this.componentid = guidGenerator();
  },
  data: function () {
    return {
      autocompleteValue: this.Value,
      componentid: "",
    };
  },
  methods: {
    onKeyUp: function () {
      this.$emit("keyup", this.autocompleteValue);
    },
    
    onChange: function () {
      console.log('on change :>> ');
      this.$emit("change", this.autocompleteValue);
    },
    onEnterKeyup: function () {
      console.log('on enter press :>> ');
      this.$emit("save", this.autocompleteValue);
    },
  },
  props: {
    Items: { type: Array },
    Value: { type: String },
    PlaceHolder: { type: String },
  },
};
</script>

<style>
</style>