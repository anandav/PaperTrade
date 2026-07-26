<template>
  <div
    class="dropdown inline-block relative tooltip text-left"
    :class="{ 'is-open': isOpen }"
    @keydown.esc.stop.prevent="closeMenu"
  >
    <div v-if="Type == 'text'">
      <input type="text" class="normal-edit" data-dropdown-toggle="dropdown" />
    </div>
    <button
      class="btn"
      v-if="Type != 'text'"
      type="button"
      data-dropdown-toggle="dropdown"
      :id="triggerId"
      :aria-label="Tooltip || LblText || Icon"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="menu"
      :aria-controls="menuId"
      @click.stop="toggleMenu"
      @keydown.down.prevent="openAndFocusFirst"
      @keydown.enter.prevent="toggleMenu"
      @keydown.space.prevent="toggleMenu"
    >
      <i class="material-icons" aria-hidden="true">{{ Icon }}</i>
      <span class="lbltext" v-if="LblText">
        {{ LblText }}
      </span>
      <tooltip
        v-if="Tooltip && Tooltip.length > 0"
        :Value="Tooltip"
        :Location="TooltipLocation"
      />
    </button>
    <div
      :id="menuId"
      class="
        dropdown-content
        z-10
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
        overflow-auto
      "
      :class="[MinHeight, { 'is-visible': isOpen }]"
      role="menu"
      :aria-labelledby="triggerId"
      @keydown.down.prevent="focusNext"
      @keydown.up.prevent="focusPrev"
      @keydown.home.prevent="focusFirst"
      @keydown.end.prevent="focusLast"
    >
      <div v-if="Type != 'text'">
        <div
          :key="item._id"
          v-for="item in VisibleItems"
          v-bind:value="item._id"
        >
          <button
            type="button"
            role="menuitem"
            class="
              dropdown-item
              block
              w-full
              text-left
              hover:bg-gray-200
              dark:hover:bg-gray-600
              cursor-pointer
              hover:rounded-sm
              py-2
              px-2
              focus:outline-none
              focus:bg-gray-200
              dark:focus:bg-gray-600
            "
            :class="item.color"
            @click="onItemClicked(Type, item._id, item.name)"
            @keydown.enter.prevent="onItemClicked(Type, item._id, item.name)"
            @keydown.space.prevent="onItemClicked(Type, item._id, item.name)"
          >
            <span v-if="item.icon" class="text-left">
              <i class="material-icons text-sm" aria-hidden="true">{{
                item.icon
              }}</i>
            </span>
            {{ item.name }}
          </button>
        </div>
      </div>
      <div v-if="Type == 'text'">
        <div
          :key="item.symbol"
          v-for="item in Items"
          v-bind:value="item.symbol"
        >
          <button
            type="button"
            role="menuitem"
            class="
              dropdown-item
              block
              w-full
              text-left
              hover:bg-gray-200
              dark:hover:bg-gray-600
              cursor-pointer
              hover:rounded-sm
              py-2
              px-2
              focus:outline-none
              focus:bg-gray-200
              dark:focus:bg-gray-600
            "
            @click="onItemClicked(Type, item._id, item.name)"
            @keydown.enter.prevent="onItemClicked(Type, item._id, item.name)"
            @keydown.space.prevent="onItemClicked(Type, item._id, item.name)"
          >
            {{ item.symbol }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
let dropdownSeq = 0;

export default {
  name: "DropDown",
  props: {
    Type: { type: String },
    ExcludeItem: { type: String },
    Items: { type: Array },
    Icon: { type: String },
    Tooltip: { type: String },
    TooltipLocation: { type: String, default: "above end" },
    MinItem: {},
    CurrentObject: { type: Object },
    LabelText: { type: String },
  },
  data: function () {
    dropdownSeq += 1;
    const id = "dd-" + dropdownSeq;
    return {
      LblText: this.LabelText,
      isOpen: false,
      triggerId: id + "-trigger",
      menuId: id + "-menu",
    };
  },
  computed: {
    VisibleItems: function () {
      const items = this.Items || [];
      return items.filter((item) => item._id != this.ExcludeItem);
    },
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
    },
  },
  mounted() {
    this._onDocClick = (e) => {
      if (!this.$el.contains(e.target)) {
        this.closeMenu();
      }
    };
    document.addEventListener("click", this._onDocClick);
  },
  beforeUnmount() {
    document.removeEventListener("click", this._onDocClick);
  },
  methods: {
    toggleMenu: function () {
      this.isOpen = !this.isOpen;
      if (this.isOpen) {
        this.$nextTick(() => this.focusFirst());
      }
    },
    openAndFocusFirst: function () {
      if (!this.isOpen) {
        this.isOpen = true;
      }
      this.$nextTick(() => this.focusFirst());
    },
    closeMenu: function () {
      this.isOpen = false;
    },
    menuItems: function () {
      return Array.from(this.$el.querySelectorAll('[role="menuitem"]'));
    },
    focusFirst: function () {
      const items = this.menuItems();
      if (items[0]) items[0].focus();
    },
    focusLast: function () {
      const items = this.menuItems();
      if (items.length) items[items.length - 1].focus();
    },
    focusNext: function () {
      const items = this.menuItems();
      if (!items.length) return;
      const i = items.indexOf(document.activeElement);
      const next = i < 0 ? 0 : (i + 1) % items.length;
      items[next].focus();
    },
    focusPrev: function () {
      const items = this.menuItems();
      if (!items.length) return;
      const i = items.indexOf(document.activeElement);
      const prev = i <= 0 ? items.length - 1 : i - 1;
      items[prev].focus();
    },
    onItemClicked: function (type, id, name) {
      this.closeMenu();
      this.$emit("itemclicked", type, id, name, this.CurrentObject);
    },
  },
};
</script>
<style>
.dropdown {
  vertical-align: middle;
}
.dropdown-content {
  display: none;
  position: absolute;
  right: 0;
  left: auto;
  margin-left: 0;
}
.dropdown-content.is-visible {
  display: block;
}
.dropdown > .btn {
  height: 1.75rem;
  width: 1.75rem;
  min-height: 1.75rem;
  min-width: 1.75rem;
  padding: 0;
}
.dropdown-item {
  background: transparent;
  border: 0;
  color: inherit;
  font: inherit;
}
@media (pointer: coarse) {
  .dropdown > .btn {
    height: 2.25rem;
    width: 2.25rem;
    min-height: 2.25rem;
    min-width: 2.25rem;
  }
}
@media (prefers-reduced-motion: reduce) {
  .dropdown-content {
    transition: none;
  }
}
</style>
