<template>
  <div class="dropdown inline-block relative edit">
    <div>
      <input
        data-dropdown-toggle="dropdown"
        class="normal-edit"
        :id="inputId || componentid + '-input'"
        :list="componentid"
        :aria-label="AriaLabel || PlaceHolder"
        @input="onInput"
        @change="onChange"
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
  </div>
</template>

<script>
export default {
  name: "AutoComplete",
  emits: ["keyup", "change", "save"],
  created: function () {
    this.autocompleteValue = this.Value == null ? "" : this.Value;
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
      autocompleteValue: this.Value == null ? "" : this.Value,
      componentid: "",
    };
  },
  watch: {
    Value: function (newVal) {
      const next = newVal == null ? "" : String(newVal);
      if (next !== this.autocompleteValue) {
        this.autocompleteValue = next;
      }
    },
  },
  methods: {
    currentValue: function () {
      return this.autocompleteValue == null ? "" : String(this.autocompleteValue);
    },
    onInput: function () {
      this.$emit("keyup", this.currentValue());
      this.$emit("change", this.currentValue());
    },
    onChange: function () {
      this.$emit("change", this.currentValue());
      this.$emit("keyup", this.currentValue());
    },
    onEnterKeyup: function () {
      this.$emit("save", this.currentValue());
    },
  },
  props: {
    Items: { type: Array },
    Value: { type: String },
    PlaceHolder: { type: String },
    AriaLabel: { type: String },
    inputId: { type: String },
  },
};
</script>

<style>
</style>
