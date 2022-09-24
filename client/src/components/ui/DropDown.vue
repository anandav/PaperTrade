<template>
  <div class="dropdown inline-block relative tooltip text-left">
    <div v-if="Type == 'text'">
      <input type="text" class="normal-edit" data-dropdown-toggle="dropdown" />
    </div>
    <button class="btn" v-if="Type != 'text'" data-dropdown-toggle="dropdown" tabindex="0">
      <i class="material-icons">{{ Icon }}</i>
      <span class="lbltext">
        {{ LblText }}
      </span>
      <tooltip v-if="Tooltip && Tooltip.length > 0" :Value="Tooltip" />
    </button>
    <div class=" 
        fixed
        z-10
        dropdown-content
        hidden
        text-gray-500
        dark:text-gray-400 
        bg-gray-100
        dark:bg-gray-700
        divide-gray-400
        dark:divide-gray-600
        rounded
        w-32
        -ml-10
        shadow-lg
        divide-y
        divide-solid
        overflow-auto" :class="MinHeight" role="menuitem">

      <div v-if="Type != 'text'">
        <div :key="item._id" v-for="item in Items" v-bind:value="item._id" tabindex="0" class="">
          <a class="
              block
              hover:bg-gray-200
              dark:hover:bg-gray-600
              cursor-pointer
              hover:rounded-sm
              py-2
              px-2" :class="item.color" v-if="item._id != ExcludeItem"
            @click="onItemClicked(Type, item._id, item.name)">
            <span v-if="item.icon" class="text-left">
              <i class="material-icons text-sm">{{ item.icon }}</i>
            </span>
            {{ item.name }}</a>
        </div>
      </div>
      <div v-if="Type == 'text'">
        <div :key="item.symbol" v-for="item in Items" v-bind:value="item.symbol" tabindex="0" class="">
          <a class="
              block
              hover:bg-gray-200
              dark:hover:bg-gray-600
              cursor-pointer
              hover:rounded-sm
              py-2
              px-2
              max-h-2
            " @click="onItemClicked(Type, item._id, item.name)">
            {{ item.symbol }}</a>
        </div>
      </div>
      <div class="max-h-1" />
    </div>
  </div>
</template>

<script>


export default {
  name: "DropDown",
  props: {
    Type: { type: String },
    ExcludeItem: { type: String },
    Items: { type: Array },
    Icon: { type: String },
    Tooltip: { type: String },
    MinItem: {},
    CurrentObject: { type: Object },
    LabelText: { type: String },
  },
  data: function () {
    return {

      LblText: this.LabelText,
    };
  },
  computed: {
    MinHeight: function () {
      switch (this.MinItem) {
        case -1:
          return "";
        case 0:
          return "max-h-16";
        case 1:
          return "max-h-20";
        case 2:
          return "max-h-28";
        case 3:
          return "max-h-36";
        case 4:
          return "max-h-40";
        default:
          return "max-h-20";
      }
    }

  },
  methods: {
    onItemClicked: function (type, id, name) {

      this.$emit("itemclicked", type, id, name, this.CurrentObject);
    },
  },
};
</script>
<style>
.dropdown:hover .dropdown-content {
  display: block;
}
</style>
