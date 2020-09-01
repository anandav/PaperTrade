<template>
  <div class="col-lg-3">
    <div
      class="pl-3 list-group portfolioitem"
      role="tablist"
      v-show="Portfolios !== undefined && Portfolios.length >0"
    >
      <div class="list-group-item list-group-item-dark">
        <div class="float-right">
          <a
            class="btn btn-dark"
            href="#"
            data-target="#divcreateeditportfolio"
            data-toggle="modal"
          >Create New Portfolio</a>
        </div>
      </div>

      <a
        class="list-group-item portforlio-menu-item text-dark"
        :key="item._id.$oid"
        v-for="item in Portfolios"
        @click="menuSelectedPortfolio(item)"
        :class="{active : Portfolio === item}"
      >{{item.Name}}</a>
    </div>
  </div>
</template>
<script>
import { mapActions, mapState} from 'vuex';
export default {
  name: "PortfolioMenu",
  methods: {
    ...mapActions(['GetAllPortfolios','SelectPortfolioChanged','GetPortfolioById']),
    menuSelectedPortfolio(item) {
       this.GetPortfolioById(item);
    }
  },

  created() {
    this.GetAllPortfolios();

  },
  computed: {
    ...mapState(['Portfolios','Portfolio'])
  }
};
</script>
<style scoped>
.portfolioitem {
  min-height: 560px;
  overflow-y: hidden;
}

.portforlio-menu-item{
  font-size: 14px;
}

.portforlio-menu-item:hover{
   color: #bebebe !important;
}
.active {
  color: #ffffff !important;
  background-color: #6c757d;
  border-color: #6c757d;
}

.active :hover{
  color: #ffffff !important;

}
</style>
