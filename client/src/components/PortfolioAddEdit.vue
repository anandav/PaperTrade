<template>
    <div v-show="showaddedit">
	<input v-model="name" type="text" />	
    </div>
</template>
<script>
export default {
    name : "PortfolioAddEdit",
    props :{ showaddedit : Boolean, name : String}
 
    
}
</script>
<style scoped>

</style>
