<template>
  <span class="tooltiptext" :class="Location">{{ Value }}</span>
</template>

<script>
export default {
  name: "tooltip",
  props: {
    Value: { type: String },
    Location: { type: String },
  },
};
</script>

<style>
.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  opacity: 0;
  transition: opacity 0.3s;
}

.tooltip:hover .tooltiptext {
  display: block;
  opacity: 0.75;
}

.tooltiptext::after {
  border-color: gray transparent transparent transparent;
}
/* .tooltiptext.bottom::before {
  border-color: transparent transparent pink transparent;
} */
</style>