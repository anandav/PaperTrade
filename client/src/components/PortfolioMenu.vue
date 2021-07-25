<template>
  <div class="col-lg-3">
    <div
      class="pl-3 list-group portfolioitem" role="tablist">
	<div class="list-group-item list-group-item-dark">

		<PortfolioAddEdit class="float-left" :showaddedit="showmyaddedit" />
		<div class="float-right">
			<a 
			class="btn btn-dark" 
			href="#" 
			@click="addEditPortfolio()"	
			>Create New Portfolio</a>
		</div>
	</div>
      <a
        class="list-group-item portforlio-menu-item text-dark"
        v-show="Portfolios !== undefined && Portfolios.length >0" 
        :key="item._id"
        v-for="item in Portfolios"
        @click="menuSelectedPortfolio(item)"
        :class="{active : Portfolio === item}"
      >{{item.name}}</a>
    </div>
  </div>
</template>
<script>
import  PortfolioAddEdit from "./PortfolioAddEdit";
import { mapActions, mapState } from "vuex";
export default {
  name: "PortfolioMenu",
  props: {
	id: String,
	name : String
	},
  components:{PortfolioAddEdit},
  methods: {
    ...mapActions([
      "GetAllPortfolios",
      "SelectPortfolioChanged",
      "GetPortfolioById",
    ]),
    addEditPortfolio(){
	this.showmyaddedit = !(this.showmyaddedit);
	
    },
    menuSelectedPortfolio(item) {
      this.GetPortfolioById(item);
    },
  },
  data: function(){
return {
		showmyaddedit : false,
		buttonText : "Save Portfolio",
	}	
},
  created() {
    this.GetAllPortfolios();
  },
  computed: {
    ...mapState(["Portfolios", "Portfolio"]),
  },
};
</script>
<style scoped>
.portfolioitem {
  min-height: 560px;
  overflow-y: hidden;
}

.portforlio-menu-item {
  font-size: 14px;
}

.portforlio-menu-item:hover {
  color: #bebebe !important;
}
.active {
  color: #ffffff !important;
  background-color: #6c757d;
  border-color: #6c757d;
}

.active :hover {
  color: #ffffff !important;
}
</style>
