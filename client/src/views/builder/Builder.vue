<template>
  <div class="p-12 pt-28">
    <div class="tooltip">
      name
      <tooltip Value="Test name" />
    </div>
  </div>
</template>

<script>
import tooltip from "../../components/ui/ToolTip";
export default {
  name: "Builder",
  components: {
    tooltip,
  },
  computed: {
  },
  created() {},
 
  methods: {},
  mounted() {
  },
  // mixins: [myMixins],
  props: {},
};
</script>


<style>
</style>