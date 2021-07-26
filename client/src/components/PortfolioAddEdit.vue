<template>
    <div v-show="showaddedit">
	<input id="temp" type="text" v-on:change="$emit('change',$event)" />	
    </div>
</template>
<script>
export default {
    name : "PortfolioAddEdit",
    props : { showaddedit : Boolean, },
    emits : [],
}
</script>
<style scoped>

</style>
