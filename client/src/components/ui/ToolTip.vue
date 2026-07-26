<template>
  <span
    class="tooltiptext"
    :class="placementClass"
    role="tooltip"
    >{{ Value }}</span
  >
</template>

<script>
export default {
  name: "tooltip",
  props: {
    Value: { type: String },
    Location: { type: String, default: "" },
  },
  computed: {
    placementClass: function () {
      const loc = (this.Location || "").toLowerCase().trim();
      if (!loc) {
        return "tip-above tip-center";
      }
      const parts = loc.split(/[\s,_-]+/).filter(Boolean);
      const classes = [];
      if (parts.includes("bottom") || parts.includes("below")) {
        classes.push("tip-below");
      } else if (parts.includes("top") || parts.includes("above")) {
        classes.push("tip-above");
      } else {
        classes.push("tip-above");
      }
      if (parts.includes("end") || parts.includes("right")) {
        classes.push("tip-end");
      } else if (parts.includes("start") || parts.includes("left")) {
        classes.push("tip-start");
      } else {
        classes.push("tip-center");
      }
      return classes.join(" ");
    },
  },
};
</script>

<style>
.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  position: absolute;
  z-index: 60;
  display: block;
  box-sizing: border-box;
  width: max-content;
  max-width: 11rem;
  padding: 0.25rem 0.4rem;
  border-radius: 0.25rem;
  background-color: rgba(71, 85, 105, 0.95);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 500;
  line-height: 1.2;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.15s ease;
}

.tooltip:hover .tooltiptext,
.tooltip:focus-within .tooltiptext {
  opacity: 0.95;
  visibility: visible;
}

.tooltip .tooltiptext.tip-above {
  bottom: calc(100% + 6px);
  top: auto;
}

.tooltip .tooltiptext.tip-below {
  top: calc(100% + 6px);
  bottom: auto;
}

.tooltip .tooltiptext.tip-center {
  left: 50%;
  right: auto;
  transform: translateX(-50%);
}

.tooltip .tooltiptext.tip-end {
  left: auto;
  right: 0;
  transform: none;
}

.tooltip .tooltiptext.tip-start {
  left: 0;
  right: auto;
  transform: none;
}

.tooltip .tooltiptext::after {
  content: none;
}

@media (prefers-reduced-motion: reduce) {
  .tooltip .tooltiptext {
    transition: none;
  }
}
</style>
