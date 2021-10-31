<template>
  <span class="tooltiptext">{{ Value }}</span>
</template>

<script>
export default {
  name: "tooltip",
  props: {
    Value: { type: String },
  },
};
</script>

<style>
.tooltip .tooltiptext {
  opacity: 0;
  transition: opacity 0.3s;

  
}

.tooltip:hover .tooltiptext {
  /* visibility: visible; */
  display: block;
  opacity: 0.75;
}

.tooltiptext::after {
  border-color: gray transparent transparent transparent;
}
</style>